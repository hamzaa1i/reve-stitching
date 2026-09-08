// src/pages/api/samples/submit.ts

import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';
import { generateSampleReference } from '../../../../lib/services/sample-reference';
import { sampleConfirmationEmail } from '../../../../lib/email-templates/sample-confirmation';
import { Resend } from 'resend';
import { getAdminFromCookies } from '../../../../lib/auth';
import { checkRateLimit, getClientIp } from '../../../../lib/security';
import { isSameOriginRequest } from '../../../../lib/admin-operations';
import { z } from 'zod';

const optionalText = (max: number) => z.preprocess(
  (value) => value === '' ? null : value,
  z.string().trim().max(max).optional().nullable(),
);
const sampleSchema = z.object({
  company_name: z.string().trim().min(1).max(200),
  contact_person: z.string().trim().min(1).max(200),
  email: z.string().trim().email().max(254),
  phone: optionalText(50),
  country: z.string().trim().min(1).max(120),
  shipping_address: z.string().trim().min(1).max(2_000),
  product_type: z.string().trim().min(1).max(200),
  fabric_type: optionalText(200),
  gsm: z.preprocess(
    (value) => value === '' ? null : value,
    z.coerce.number().int().min(50).max(1_000).optional().nullable(),
  ),
  color: optionalText(200),
  size: optionalText(100),
  quantity: z.coerce.number().int().min(1).max(5),
  special_requirements: optionalText(5_000),
  linked_quote_id: optionalText(128),
}).strict();

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

const resend = new Resend(process.env.RESEND_API_KEY!);

export const POST: APIRoute = async ({ request, cookies }) => {
  // C-005 hotfix: require admin auth
  const admin = getAdminFromCookies(cookies);
  if (!admin) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  if (!isSameOriginRequest(request)) {
    return new Response(JSON.stringify({ error: 'Cross-site request rejected' }), { status: 403, headers: { 'Content-Type': 'application/json' } });
  }

  // C-010 hotfix (partial): rate limit even admin endpoints
  const ip = getClientIp(request);
  if (!checkRateLimit(ip, 10, 60_000)) {
    return new Response(JSON.stringify({ error: 'Too many requests' }), {
      status: 429,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const parsed = sampleSchema.safeParse(await request.json());
    if (!parsed.success) {
      return new Response(JSON.stringify({ error: 'Invalid sample request details' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { company_name, contact_person, email, phone, country, shipping_address,
            product_type, fabric_type, gsm, color, size, quantity,
            special_requirements, linked_quote_id } = parsed.data;

    const reference_number = generateSampleReference();

    const insertData: Record<string, unknown> = {
      reference_number,
      company_name: company_name.trim(),
      contact_person: contact_person.trim(),
      email: email.trim().toLowerCase(),
      phone: phone || null,
      country: country.trim(),
      shipping_address: shipping_address.trim(),
      product_type,
      fabric_type: fabric_type || null,
      gsm: gsm || null,
      color: color || null,
      size: size || null,
      quantity,
      special_requirements: special_requirements || null,
      linked_quote_id: linked_quote_id || null,
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
      // Phase 4: sampleConfirmationEmail is async — must await
      const emailContent = await sampleConfirmationEmail({
        reference_number,
        contact_person: contact_person.trim(),
        company_name: company_name.trim(),
        product_type,
        fabric_type: fabric_type || undefined,
        quantity,
        color: color || undefined,
        size: size || undefined,
      });

      await resend.emails.send({
        from: 'Reve Stitching <notifications@revestitching.com>',
        to: email.trim().toLowerCase(),
        subject: emailContent.subject,
        html: emailContent.html,
      });
    } catch (emailErr) {
      console.error('Email send error:', emailErr);
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
                { name: 'Company', value: company_name, inline: true },
                { name: 'Contact', value: contact_person, inline: true },
                { name: 'Product', value: product_type, inline: true },
                { name: 'Country', value: country, inline: true },
                { name: 'Quantity', value: String(quantity), inline: true },
                { name: 'Email', value: email, inline: true },
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
