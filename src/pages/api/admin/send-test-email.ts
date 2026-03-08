// src/pages/api/admin/send-test-email.ts
import type { APIRoute } from 'astro';
import { Resend } from 'resend';
import { getAdminFromCookies } from '../../../lib/auth';
import { generateQuoteUnderReviewEmail } from '../../../lib/email-templates/quote-under-review';
import { generateAdminReminderEmail } from '../../../lib/email-templates/admin-reminder';
import { generateReengagementEmail } from '../../../lib/email-templates/quote-reengagement';

export const prerender = false;

const MOCK_QUOTE = {
  reference_number: 'RQ-TEST-0001',
  contact_person: 'John Smith',
  company_name: 'Sample Ltd.',
  email: 'test@example.com',
  product_type: 't-shirts',
  quantity: 500,
  estimated_price_range: '$4.50 – $7.00',
};

export const POST: APIRoute = async ({ request, cookies }) => {
  const admin = getAdminFromCookies(cookies);
  if (!admin) {
    return json({ success: false, error: 'Unauthorized' }, 401);
  }

  let body: any;
  try {
    body = await request.json();
  } catch {
    return json({ success: false, error: 'Invalid JSON body' }, 400);
  }

  const email = typeof body?.email === 'string' ? body.email.trim() : '';
  const template_id = typeof body?.template_id === 'string' ? body.template_id.trim() : '';
  const branding_override = sanitizeBrandingOverride(body?.branding_override);

  if (!email || !template_id) {
    return json({ success: false, error: 'Missing email or template_id' }, 400);
  }

  if (!isValidEmail(email)) {
    return json({ success: false, error: 'Invalid email address' }, 400);
  }

  const resendApiKey = process.env.RESEND_API_KEY;
  if (!resendApiKey) {
    return json({ success: false, error: 'RESEND_API_KEY not configured' }, 500);
  }

  const resend = new Resend(resendApiKey);

  let emailContent: { subject: string; html: string };

  try {
    if (template_id === '24h') {
      emailContent = await generateQuoteUnderReviewEmail(MOCK_QUOTE, branding_override);
    } else if (template_id === '48h') {
      emailContent = await generateAdminReminderEmail(MOCK_QUOTE, branding_override);
    } else if (template_id === '7d') {
      emailContent = await generateReengagementEmail(MOCK_QUOTE, branding_override);
    } else {
      return json({ success: false, error: 'Invalid template_id' }, 400);
    }
  } catch (err) {
    console.error('[Test Email] Template generation failed:', err);
    return json({ success: false, error: 'Failed to generate email template' }, 500);
  }

  const { data, error } = await resend.emails.send({
    from: 'Reve Stitching <notifications@revestitching.com>',
    to: [email],
    subject: `[TEST] ${emailContent.subject}`,
    html: emailContent.html,
    replyTo: 'info@revestitching.com',
  });

  if (error) {
    console.error('[Test Email] Resend error:', error);
    return json({ success: false, error: error.message }, 500);
  }

  console.log(`[Test Email] Sent to ${email} (template: ${template_id}, Resend ID: ${data?.id})`);
  return json({ success: true, id: data?.id });
};

function sanitizeBrandingOverride(input: unknown): Record<string, string> | null {
  if (!input || typeof input !== 'object') return null;

  const ALLOWED_KEYS = new Set([
    'company_name',
    'tagline',
    'logo_text',
    'brand_color',
    'whatsapp_number',
    'support_email',
    'website_url',
    'footer_text',
  ]);

  const obj = input as Record<string, unknown>;
  const cleaned: Record<string, string> = {};

  for (const [key, value] of Object.entries(obj)) {
    if (!ALLOWED_KEYS.has(key)) continue;
    if (typeof value !== 'string') continue;
    const trimmed = value.trim();
    if (!trimmed) continue;
    cleaned[key] = trimmed.slice(0, 5000); // Safety limit
  }

  return Object.keys(cleaned).length > 0 ? cleaned : null;
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function json(data: object, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}