import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';
import { generateSampleReference } from '../../../lib/services/sample-reference';
import { Resend } from 'resend';
import { checkRateLimit, getClientIp, isHoneypotTriggered, sanitizeString, isValidEmail, truncate } from '../../../lib/security';

export const prerender = false;

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

const resend = new Resend(process.env.RESEND_API_KEY!);

// C-008 hotfix (extension): HTML-escape user input before interpolating into email HTML
function escapeHtml(s: unknown): string {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export const POST: APIRoute = async ({ request }) => {
  // C-010 hotfix: rate limit + honeypot on public endpoint
  const ip = getClientIp(request);
  if (!checkRateLimit(ip, 3, 60_000)) {
    return new Response(JSON.stringify({ error: 'Too many requests. Please wait a minute.' }), {
      status: 429,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const body = await request.json();

    // Honeypot check
    if (isHoneypotTriggered(body)) {
      return new Response(JSON.stringify({ success: true, reference_number: 'SAMPLE-0000-XXXX' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const {
      company_name, contact_person, email, phone, country, shipping_address,
      product_type, fabric_type, gsm, color, size, quantity,
      special_requirements, linked_quote_id
    } = body;
    // C-010 hotfix: sanitize all string inputs
    const s = (v: unknown) => v ? truncate(sanitizeString(String(v)), 500) : '';

    // Validation
    const errors: string[] = [];
    if (!company_name?.trim()) errors.push('Company name is required');
    if (!contact_person?.trim()) errors.push('Contact person is required');
    if (!email?.trim()) errors.push('Email is required');
    if (!country?.trim()) errors.push('Country is required');
    if (!shipping_address?.trim()) errors.push('Shipping address is required');
    if (!product_type?.trim()) errors.push('Product type is required');
    if (!quantity || quantity < 1 || quantity > 5) errors.push('Quantity must be between 1 and 5');

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.push('Invalid email address');
    }

    if (errors.length > 0) {
      return new Response(JSON.stringify({ error: errors.join(', ') }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const reference_number = generateSampleReference();

    const insertData: Record<string, unknown> = {
      reference_number,
      company_name: s(company_name),
      contact_person: s(contact_person),
      email: s(email).toLowerCase(),
      phone: phone ? s(phone) : null,
      country: s(country),
      shipping_address: s(shipping_address),
      product_type: s(product_type),
      fabric_type: fabric_type ? s(fabric_type) : null,
      gsm: gsm ? parseInt(gsm, 10) : null,
      color: color ? s(color) : null,
      size: size ? s(size) : null,
      quantity: parseInt(quantity, 10),
      special_requirements: special_requirements ? s(special_requirements) : null,
      linked_quote_id: linked_quote_id ? s(linked_quote_id) : null,
      status: 'new',
    };

    const { data, error } = await supabase
      .from('sample_requests')
      .insert(insertData)
      .select()
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      return new Response(JSON.stringify({ error: 'Failed to submit sample request' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Send confirmation email
    try {
      await resend.emails.send({
        from: 'Reve Stitching <notifications@revestitching.com>',
        to: email.trim().toLowerCase(),
        subject: `Sample Request Received - ${reference_number}`,
        html: `
          <h2>Sample Request Received</h2>
          <p>Dear ${escapeHtml(contact_person.trim())},</p>
          <p>Thank you for your sample request. Your reference number is: <strong>${escapeHtml(reference_number)}</strong></p>
          <p>We will review your request and get back to you within 1-2 business days.</p>
          <p>Best regards,<br>Reve Stitching Team</p>
        `,
      });
    } catch (emailErr) {
      console.error('Email send error:', emailErr);
    }

    // Send admin notification email
    try {
        const adminEmail = process.env.NOTIFICATION_EMAIL || process.env.ADMIN_EMAIL;
        if (adminEmail) {
          await resend.emails.send({
            from: 'Reve Stitching <notifications@revestitching.com>',
            to: adminEmail,
            subject: `New Sample Request: ${reference_number} - ${company_name.trim()}`,
            html: `
              <h2>New Sample Request Received</h2>
              <table style="border-collapse:collapse;width:100%;max-width:500px;">
                <tr><td style="padding:8px;color:#666;">Reference</td><td style="padding:8px;font-weight:bold;">${escapeHtml(reference_number)}</td></tr>
                <tr><td style="padding:8px;color:#666;">Company</td><td style="padding:8px;">${escapeHtml(company_name.trim())}</td></tr>
                <tr><td style="padding:8px;color:#666;">Contact</td><td style="padding:8px;">${escapeHtml(contact_person.trim())}</td></tr>
                <tr><td style="padding:8px;color:#666;">Email</td><td style="padding:8px;">${escapeHtml(email.trim())}</td></tr>
                <tr><td style="padding:8px;color:#666;">Product</td><td style="padding:8px;">${escapeHtml(product_type)}</td></tr>
                <tr><td style="padding:8px;color:#666;">Quantity</td><td style="padding:8px;">${escapeHtml(quantity)}</td></tr>
                <tr><td style="padding:8px;color:#666;">Country</td><td style="padding:8px;">${escapeHtml(country.trim())}</td></tr>
                ${fabric_type ? `<tr><td style="padding:8px;color:#666;">Fabric</td><td style="padding:8px;">${escapeHtml(fabric_type)}</td></tr>` : ''}
                ${color ? `<tr><td style="padding:8px;color:#666;">Color</td><td style="padding:8px;">${escapeHtml(color)}</td></tr>` : ''}
                ${special_requirements ? `<tr><td style="padding:8px;color:#666;">Notes</td><td style="padding:8px;">${escapeHtml(special_requirements.trim())}</td></tr>` : ''}
              </table>
              <p style="margin-top:20px;"><a href="https://www.revestitching.com/admin/samples" style="background:#166534;color:#fff;padding:10px 20px;text-decoration:none;border-radius:8px;">View in Admin Panel</a></p>
            `,
          });
        }
      } catch (adminEmailErr) {
        console.error('Admin email error:', adminEmailErr);
      }

    // Discord notification
    if (process.env.DISCORD_WEBHOOK_URL) {
      try {
        await fetch(process.env.DISCORD_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            embeds: [{
              title: `New Sample Request: ${reference_number}`,
              color: 0x166534,
              fields: [
                { name: 'Company', value: String(company_name).slice(0, 1000), inline: true },
                { name: 'Contact', value: String(contact_person).slice(0, 1000), inline: true },
                { name: 'Product', value: String(product_type).slice(0, 1000), inline: true },
                { name: 'Country', value: String(country).slice(0, 1000), inline: true },
                { name: 'Quantity', value: String(quantity).slice(0, 1000), inline: true },
                { name: 'Email', value: String(email).slice(0, 1000), inline: true },
              ],
              timestamp: new Date().toISOString(),
            }],
          }),
        });
      } catch (discordErr) {
        console.error('Discord notification error:', discordErr);
      }
    }

    return new Response(JSON.stringify({ success: true, data: { reference_number, id: data.id } }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Sample submit error:', err);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};