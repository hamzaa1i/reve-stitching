/**
 * src/lib/services/erpnext.ts
 *
 * ERPNext integration — creates Lead records in ERPNext when quote requests
 * are submitted on the website.
 *
 * Architecture:
 *   - Called AFTER the quote is saved to Supabase (never blocks the save)
 *   - If ERPNext is unreachable or returns an error, the quote still succeeds
 *   - The ERPNext lead ID is stored back in the Supabase quote record
 *   - All errors are logged but never thrown to the caller
 *
 * Required env vars:
 *   - ERPNEXT_URL       e.g. https://erp.revestitching.com
 *   - ERPNEXT_API_KEY   ERPNext API key (generated in ERPNext user settings)
 *   - ERPNEXT_API_SECRET  ERPNext API secret (paired with the key)
 *
 * ERPNext REST API docs:
 *   POST /api/resource/Lead
 *   Headers: Authorization: token <key>:<secret>
 *   Body: { lead_name, company_name, email_id, phone, ... }
 */

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface ERPNextLeadData {
  referenceNumber: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string | null;
  productType: string;
  quantity: number;
  fabricType: string;
  gsm: number;
  destination: string;
  targetDate: string;
  isRush: boolean;
  hasSample: boolean;
  notes: string | null;
  aiSummary: string | null;
  estimatedPriceRange: string | null;
}

export interface ERPNextLeadResult {
  success: boolean;
  leadId: string | null;
  error?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Configuration
// ─────────────────────────────────────────────────────────────────────────────

function getERPNextConfig() {
  const url = import.meta.env.ERPNEXT_URL || process.env.ERPNEXT_URL;
  const apiKey = import.meta.env.ERPNEXT_API_KEY || process.env.ERPNEXT_API_KEY;
  const apiSecret = import.meta.env.ERPNEXT_API_SECRET || process.env.ERPNEXT_API_SECRET;

  return { url, apiKey, apiSecret };
}

function isERPNextConfigured(): boolean {
  const { url, apiKey, apiSecret } = getERPNextConfig();
  return !!(url && apiKey && apiSecret);
}

// ─────────────────────────────────────────────────────────────────────────────
// Lead creation
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Create a Lead record in ERPNext via the REST API.
 *
 * Returns { success, leadId } on success.
 * Returns { success: false, error } on failure — NEVER throws.
 *
 * The caller (quote/submit.ts) handles failures by logging but NOT
 * failing the quote submission.
 */
export async function createERPNextLead(data: ERPNextLeadData): Promise<ERPNextLeadResult> {
  // DEBUG: unconditional log at function entry — confirms the function is called.
  // Uses console.error so Vercel's log viewer captures it (console.log is dropped).
  console.error(`[ERPNext] createERPNextLead() CALLED for quote ${data.referenceNumber} (${data.companyName})`);

  const { url, apiKey, apiSecret } = getERPNextConfig();

  // DEBUG: log what env vars are actually visible to the function
  console.error(`[ERPNext] Config: url=${url ? 'SET' : 'EMPTY'}, apiKey=${apiKey ? 'SET' : 'EMPTY'}, apiSecret=${apiSecret ? 'SET' : 'EMPTY'}`);

  if (!isERPNextConfigured()) {
    console.error(`[ERPNext] Not configured — skipping lead creation. ERPNEXT_URL=${url || '(empty)'}`);
    return { success: false, leadId: null, error: 'Not configured' };
  }

  // Build the ERPNext Lead payload
  // ERPNext Lead fields: https://frappeframework.com/docs/v14/api/models/CRM/lead
  const leadPayload: Record<string, unknown> = {
    // Core fields
    lead_name: data.contactPerson,
    company_name: data.companyName,
    email_id: data.email,
    phone: data.phone || '',
    status: 'Lead',
    source: 'Website',

    // Custom description with full quote context
    lead_owner: '',

    // Use the 'description' field for the full quote context
    description: buildLeadDescription(data),

    // ERPNext custom fields (if they exist in your ERPNext instance):
    // These will silently be ignored if the custom fields don't exist.
    website_quote_reference: data.referenceNumber,
    website_product_type: data.productType,
    website_quantity: data.quantity,
    website_fabric_type: data.fabricType,
    website_gsm: data.gsm,
    website_destination: data.destination,
    website_target_date: data.targetDate,
    website_is_rush: data.isRush ? 1 : 0,
    website_has_sample: data.hasSample ? 1 : 0,
  };

  try {
    const endpoint = `${url}/api/resource/Lead`;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `token ${apiKey}:${apiSecret}`,
      },
      body: JSON.stringify(leadPayload),
      signal: AbortSignal.timeout(10_000), // 10s timeout — don't hang the quote submission
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[ERPNext] API returned ${response.status}: ${errorText.substring(0, 500)}`);
      return {
        success: false,
        leadId: null,
        error: `HTTP ${response.status}: ${response.statusText}`,
      };
    }

    const result = await response.json();

    // ERPNext returns { data: { name: "CRM-LEAD-2024-00001", ... } }
    const leadId = result?.data?.name || result?.name || null;

    if (!leadId) {
      console.error('[ERPNext] Lead created but no ID returned in response:', JSON.stringify(result).substring(0, 500));
      return {
        success: false,
        leadId: null,
        error: 'No lead ID in response',
      };
    }

    console.log(`[ERPNext] Lead created: ${leadId} for quote ${data.referenceNumber}`);
    return { success: true, leadId };
  } catch (err) {
    const errStr = err instanceof Error ? `${err.name}: ${err.message}` : String(err);
    console.error(`[ERPNext] Failed to create lead for ${data.referenceNumber}:`, errStr);
    return {
      success: false,
      leadId: null,
      error: errStr,
    };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Build a human-readable description for the ERPNext Lead's description field.
 * This contains all the quote context that doesn't fit into standard Lead fields.
 */
function buildLeadDescription(data: ERPNextLeadData): string {
  const lines: string[] = [
    `Quote Reference: ${data.referenceNumber}`,
    `Product: ${data.productType}`,
    `Fabric: ${data.fabricType} (${data.gsm} GSM)`,
    `Quantity: ${data.quantity.toLocaleString()} pcs`,
    `Destination: ${data.destination}`,
    `Target Date: ${data.targetDate}`,
    `Rush Order: ${data.isRush ? 'Yes' : 'No'}`,
    `Sample Required: ${data.hasSample ? 'Yes' : 'No'}`,
  ];

  if (data.notes) {
    lines.push(`Customer Notes: ${data.notes}`);
  }

  if (data.estimatedPriceRange) {
    lines.push(`AI Est. Price Range: ${data.estimatedPriceRange}`);
  }

  if (data.aiSummary) {
    lines.push(`AI Summary: ${data.aiSummary.substring(0, 500)}`);
  }

  return lines.join('\n');
}
