import type { APIRoute } from 'astro';
import { getSupabase } from '../../../lib/supabase';
import { generateReferenceNumber } from '../../../lib/services/reference';
import { generateAISummary } from '../../../lib/services/ai-summary';
import {
  notifyNewQuote,
  sendQuoteCustomerConfirmation,
} from '../../../lib/notifications';
import {
  checkRateLimit,
  getClientIp,
  sanitizeString,
  isValidEmail,
  truncate,
  isHoneypotTriggered,
  verifyTurnstile,
} from '../../../lib/security';
import { initSentry, captureException } from '../../../lib/sentry';
import { createERPNextLead } from '../../../lib/services/erpnext';
import type { QuoteRequest } from '../../../lib/types/quote';

export const prerender = false;

const MAX_REQUEST_BYTES = 35 * 1024 * 1024;
const MAX_TECH_PACK_BYTES = 10 * 1024 * 1024;
const MAX_REFERENCE_IMAGE_BYTES = 5 * 1024 * 1024;
const MAX_REFERENCE_IMAGES = 5;

function estimatedBase64Bytes(value: unknown): number {
  if (typeof value !== 'string') return 0;
  const payload = value.includes(',') ? value.slice(value.indexOf(',') + 1) : value;
  return Math.floor((payload.length * 3) / 4);
}

function getContentType(filename: string): string {
  const ext = filename.toLowerCase().split('.').pop();
  const types: Record<string, string> = {
    pdf: 'application/pdf',
    ai: 'application/postscript',
    eps: 'application/postscript',
    doc: 'application/msword',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    png: 'image/png',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    webp: 'image/webp',
  };
  return types[ext || ''] || 'application/octet-stream';
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const contentLength = Number(request.headers.get('content-length') || 0);
    if (contentLength > MAX_REQUEST_BYTES) {
      return new Response(JSON.stringify({ success: false, error: 'The upload is too large. Reduce file sizes and try again.' }), { status: 413, headers: { 'Content-Type': 'application/json' } });
    }
    const ip = getClientIp(request);
    initSentry(); // Initialize Sentry early
    if (!checkRateLimit(ip, 3, 60_000)) {
      return new Response(
        JSON.stringify({ error: 'Too many requests. Please wait a minute.' }),
        { status: 429, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const body = await request.json();
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return new Response(JSON.stringify({ success: false, error: 'Invalid request body.' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    // Honeypot check
    if (isHoneypotTriggered(body)) {
      return new Response(JSON.stringify({ success: true, referenceNumber: 'RQ-000000-XXXX' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Turnstile check
    if (!await verifyTurnstile(body.cf_turnstile_response)) {
      return new Response(
        JSON.stringify({ success: false, error: 'Spam verification failed. Please try again.' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const parseJsonField = (val: any, fallback: any = []) => {
      if (!val) return fallback;
      if (Array.isArray(val)) return val;
      if (typeof val === 'string') {
        try {
          return JSON.parse(val);
        } catch {
          return fallback;
        }
      }
      return fallback;
    };

    const product_type = truncate(sanitizeString(body.selectedProduct || ''), 100);
    const fabric_type = truncate(sanitizeString(body.fabricType || ''), 100);
    const gsm = Number(body.gsmRange) || 0;
    const quantity = Number(body.quantity) || 0;
    const sizes = parseJsonField(body.sizeRange, []);
    const color_count = Number(body.colorQuantity) || 1;
    const customizations = parseJsonField(body.customizations, []);
    const has_sample = body.sampleRequired === 'true';
    const is_rush = body.rushOrder === 'true';
    const target_date = truncate(sanitizeString(body.deliveryDate || ''), 20);
    const destination = truncate(sanitizeString(body.shippingDestination || ''), 100);
    const company_name = truncate(sanitizeString(body.companyName || ''), 200);
    const contact_person = truncate(sanitizeString(body.contactPerson || ''), 200);
    const email = truncate((body.email || '').trim().toLowerCase(), 254);
    const phone = body.phone ? truncate(sanitizeString(body.phone), 50) : null;
    const notes = body.additionalNotes
      ? truncate(sanitizeString(body.additionalNotes), 3000)
      : null;

    // Validate
    const errors: string[] = [];
    if (!product_type) errors.push('Product type is required.');
    if (!fabric_type) errors.push('Fabric type is required.');
    if (!gsm || gsm < 100 || gsm > 500)
      errors.push('GSM must be between 100 and 500.');
    if (!quantity || quantity < 1) errors.push('Quantity is required.');
    if (quantity > 10_000_000) errors.push('Quantity exceeds the supported maximum.');
    if (!sizes || sizes.length === 0)
      errors.push('At least one size is required.');
    if (!target_date) errors.push('Target delivery date is required.');
    if (!destination) errors.push('Shipping destination is required.');
    if (!company_name) errors.push('Company name is required.');
    if (!contact_person) errors.push('Contact person is required.');
    if (!email) errors.push('Email is required.');
    if (email && !isValidEmail(email))
      errors.push('Please provide a valid email address.');
    if (body.techPackBase64 && estimatedBase64Bytes(body.techPackBase64) > MAX_TECH_PACK_BYTES) errors.push('Tech pack must be 10 MB or smaller.');
    if (body.referenceImagesBase64 && !Array.isArray(body.referenceImagesBase64)) errors.push('Reference images are invalid.');
    if (Array.isArray(body.referenceImagesBase64)) {
      if (body.referenceImagesBase64.length > MAX_REFERENCE_IMAGES) errors.push(`Upload no more than ${MAX_REFERENCE_IMAGES} reference images.`);
      if (body.referenceImagesBase64.some((image: unknown) => estimatedBase64Bytes(image) > MAX_REFERENCE_IMAGE_BYTES)) errors.push('Each reference image must be 5 MB or smaller.');
      if (!Array.isArray(body.referenceImageNames) || body.referenceImageNames.length !== body.referenceImagesBase64.length) errors.push('Reference image metadata is invalid.');
    }

    if (errors.length > 0) {
      return new Response(
        JSON.stringify({ success: false, error: errors.join(' ') }),
        { status: 422, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Generate reference number
    const reference_number = await generateReferenceNumber();
    console.log(`[Quote] Processing ${reference_number} from ${company_name}`);

    // ── Upload files from Base64 ──
    const supabase = getSupabase();
    let tech_pack_url: string | null = null;
    const reference_images: string[] = [];

    // Upload tech pack if provided
    if (body.techPackBase64 && body.techPackName) {
      try {
        const buffer = Buffer.from(body.techPackBase64, 'base64');
        const safeName = (body.techPackName as string)
          .replace(/[^a-zA-Z0-9._-]/g, '_')
          .replace(/_{2,}/g, '_');
        const path = `${reference_number}/techpack/${Date.now()}_${safeName}`;

        const { error: uploadError } = await supabase.storage
          .from('quote-uploads')
          .upload(path, buffer, {
            contentType: getContentType(body.techPackName as string),
            upsert: false,
          });

        if (!uploadError) {
          tech_pack_url = path;
          console.log(`[Quote] Tech pack uploaded: ${path}`);
        } else {
          console.error('[Quote] Tech pack upload failed:', uploadError.message);
        }
      } catch (err) {
        console.error('[Quote] Tech pack upload error:', err);
      }
    }

    // Upload reference images if provided
    if (
      body.referenceImagesBase64 &&
      Array.isArray(body.referenceImagesBase64)
    ) {
      for (let i = 0; i < body.referenceImagesBase64.length; i++) {
        try {
          const buffer = Buffer.from(body.referenceImagesBase64[i], 'base64');
          const safeName = (body.referenceImageNames[i] as string)
            .replace(/[^a-zA-Z0-9._-]/g, '_')
            .replace(/_{2,}/g, '_');
          const path = `${reference_number}/images/${Date.now()}_${i}_${safeName}`;

          const { error: uploadError } = await supabase.storage
            .from('quote-uploads')
            .upload(path, buffer, {
              contentType: getContentType(
                body.referenceImageNames[i] as string
              ),
              upsert: false,
            });

          if (!uploadError) {
            reference_images.push(path);
            console.log(`[Quote] Image ${i + 1} uploaded: ${path}`);
          } else {
            console.error(
              `[Quote] Image ${i + 1} upload failed:`,
              uploadError.message
            );
          }
        } catch (err) {
          console.error(`[Quote] Image ${i + 1} upload error:`, err);
        }
      }
    }

    // AI summary + Tech Pack Analysis (single call, no duplicate)
    let ai_summary: string | null = null;
    let estimated_price_range: string | null = null;
    let suggested_moq: number | null = null;
    let ai_flags: string | null = null;
    let ai_extracted_data: any = null;
    let ai_confidence_score: number | null = null;
    let ai_missing_fields: string[] | null = null;
    let action_items: any = null;

    try {
      const [summaryResult, techPackResult] = await Promise.all([
        generateAISummary({
          product_type,
          fabric_type,
          gsm,
          quantity,
          sizes,
          color_count,
          customizations,
          has_sample,
          is_rush,
          target_date,
          destination,
          notes,
        }),
        (async () => {
          if (
            body.techPackBase64 ||
            (body.referenceImagesBase64 &&
              body.referenceImagesBase64.length > 0)
          ) {
            const { analyzeTechPack } = await import(
              '../../../lib/services/techpack-analyzer'
            );
            return analyzeTechPack(
              body.techPackBase64,
              body.referenceImagesBase64,
              { product_type, fabric_type, quantity }
            );
          }
          return null;
        })(),
      ]);

      // Apply summary results
      ai_summary = summaryResult.ai_summary;
      estimated_price_range = summaryResult.estimated_price_range;
      suggested_moq = summaryResult.suggested_moq;
      ai_flags = summaryResult.ai_flags;

      // Apply tech pack analysis results
      if (techPackResult) {
        ai_extracted_data = techPackResult.extracted_specs;
        ai_confidence_score = techPackResult.confidence / 100;
        ai_missing_fields = techPackResult.missing_fields;
        action_items = {
          items: techPackResult.action_items.map((item: any, idx: number) => ({
            id: `auto-${idx}`,
            priority: item.priority,
            title: item.task,
            description: item.reason,
            completed: false,
          })),
          auto_generated: true,
          generated_at: new Date().toISOString(),
        };

        if (Object.keys(techPackResult.extracted_specs).length > 0) {
          ai_summary = `${ai_summary}\n\n━━━ TECH PACK ANALYSIS ━━━\n${JSON.stringify(techPackResult.extracted_specs, null, 2)}`;
        }

        if (techPackResult.missing_fields.length > 0) {
          const missingInfo = `Missing: ${techPackResult.missing_fields.join('; ')}`;
          ai_flags = ai_flags ? `${ai_flags}\n${missingInfo}` : missingInfo;
        }
      }
    } catch (err) {
      console.error('[Quote] AI analysis failed:', err);
    }

    const { data: inserted, error: dbError } = await supabase
      .from('quote_requests')
      .insert({
        reference_number,
        status: 'new',
        product_type,
        fabric_type,
        gsm,
        quantity,
        sizes,
        color_count,
        customizations,
        has_sample,
        is_rush,
        target_date,
        destination,
        company_name,
        contact_person,
        email,
        phone,
        notes,
        tech_pack_url,
        reference_images,
        ai_summary,
        estimated_price_range,
        suggested_moq,
        ai_flags,
        ai_extracted_data,
        ai_confidence_score,
        ai_missing_fields,
        action_items,
        tech_pack_status: tech_pack_url ? 'analyzed' : null,
        admin_notes: null,
        assigned_to: null,
      })
      .select()
      .single();

    if (dbError || !inserted) {
      captureException(dbError, { route: '/api/quote/submit', reference_number });
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Failed to save. Please try again.',
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    console.log(
      `[Quote] Saved ${reference_number} with id ${(inserted as any).id}`
    );

    // ── ERPNext Integration ──
    // Create a Lead in ERPNext (non-blocking — if it fails, the quote still succeeds).
    // The ERPNext lead ID is stored back in the Supabase quote record for reference.
    try {
      const erpResult = await createERPNextLead({
        referenceNumber: reference_number,
        companyName: company_name,
        contactPerson: contact_person,
        email,
        phone,
        productType: product_type,
        quantity,
        fabricType: fabric_type,
        gsm,
        destination,
        targetDate: target_date,
        isRush: is_rush,
        hasSample: has_sample,
        notes,
        aiSummary: ai_summary,
        estimatedPriceRange: estimated_price_range,
      });

      if (erpResult.success && erpResult.leadId) {
        // Store the ERPNext lead ID back in the Supabase quote record
        await supabase
          .from('quote_requests')
          .update({ erpnext_lead_id: erpResult.leadId })
          .eq('id', (inserted as any).id);
        console.log(`[Quote] ERPNext lead linked: ${erpResult.leadId}`);
      }
    } catch (erpErr) {
      // Log but never fail the quote submission
      console.error('[Quote] ERPNext integration error (non-fatal):', erpErr);
    }

    // Send notifications
    const quoteRecord = inserted as unknown as QuoteRequest;

    await Promise.allSettled([
      notifyNewQuote(quoteRecord),
      sendQuoteCustomerConfirmation(quoteRecord),
    ]);

    return new Response(
      JSON.stringify({
        success: true,
        referenceNumber: reference_number,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    captureException(err, { route: '/api/quote/submit' });
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Something went wrong. Please try again.',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
