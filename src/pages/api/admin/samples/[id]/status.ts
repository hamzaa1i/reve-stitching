// src/pages/api/admin/samples/[id]/status.ts

import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';
import { getAdminFromCookies } from '../../../../../lib/auth';
import { Resend } from 'resend';
import { sampleApprovedEmail } from '../../../../../lib/email-templates/sample-approved';
import { sampleShippedEmail } from '../../../../../lib/email-templates/sample-shipped';
import { sampleStatusUpdateEmail } from '../../../../../lib/email-templates/sample-status-update';
import type { SampleRequest } from '../../../../../lib/types/sample';
import { z } from 'zod';
import { isSameOriginRequest } from '../../../../../lib/admin-operations';
import { json } from '../../../../../lib/utils';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

const resend = new Resend(process.env.RESEND_API_KEY!);

export const PATCH: APIRoute = async ({ params, request, cookies }) => {
  const admin = getAdminFromCookies(cookies);
  if (!admin) {
    return json({ error: 'Unauthorized' }, 401);
  }
  if (!isSameOriginRequest(request)) return json({ error: 'Cross-site request rejected' }, 403);
  if (!params.id) return json({ error: 'Missing sample request ID' }, 400);

  try {
    const { id } = params;
    const body = await request.json();
    const nullableText = (max: number) => z.union([z.string().trim().max(max), z.null()]).transform((value) => value === '' ? null : value).optional();
    const nullableDate = z.union([z.string().datetime(), z.literal(''), z.null()]).transform((value) => value || null).optional();
    const parsed = z.object({
      status: z.enum(['new', 'approved', 'production', 'shipped', 'delivered', 'converted', 'rejected']).optional(),
      shipping_carrier: nullableText(120),
      tracking_number: nullableText(200),
      shipped_at: nullableDate,
      delivered_at: nullableDate,
      sample_fee: z.number().finite().min(0).max(1_000_000).optional(),
      actual_cost: z.number().finite().min(0).max(1_000_000).nullable().optional(),
      shipping_cost: z.number().finite().min(0).max(1_000_000).nullable().optional(),
      is_free_sample: z.boolean().optional(),
      admin_notes: nullableText(10_000),
      rejection_reason: nullableText(2_000),
    }).strict().safeParse(body);
    if (!parsed.success) return json({ error: 'Invalid sample update' }, 422);

    const { status, shipping_carrier, tracking_number, shipped_at, delivered_at, sample_fee, actual_cost, shipping_cost, is_free_sample, admin_notes, rejection_reason } = parsed.data;

    // Fetch current record
    const { data: current, error: fetchError } = await supabase
      .from('sample_requests')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !current) {
      return json({ error: 'Sample request not found' }, 404);
    }

    const sample = current as SampleRequest;

    const updateData: Record<string, unknown> = {};

    if (status !== undefined) updateData.status = status;
    if (shipping_carrier !== undefined) updateData.shipping_carrier = shipping_carrier;
    if (tracking_number !== undefined) updateData.tracking_number = tracking_number;
    if (shipped_at !== undefined) updateData.shipped_at = shipped_at;
    if (delivered_at !== undefined) updateData.delivered_at = delivered_at;
    if (sample_fee !== undefined) updateData.sample_fee = sample_fee;
    if (actual_cost !== undefined) updateData.actual_cost = actual_cost;
    if (shipping_cost !== undefined) updateData.shipping_cost = shipping_cost;
    if (is_free_sample !== undefined) updateData.is_free_sample = is_free_sample;
    if (admin_notes !== undefined) updateData.admin_notes = admin_notes;
    if (rejection_reason !== undefined) updateData.rejection_reason = rejection_reason;
    if (Object.keys(updateData).length === 0) return json({ error: 'No fields to update' }, 422);

    let updateQuery = supabase
      .from('sample_requests')
      .update(updateData)
      .eq('id', id!);
    if (status && status !== sample.status) updateQuery = updateQuery.eq('status', sample.status);
    const { data: updated, error: updateError } = await updateQuery.select().maybeSingle();

    if (updateError) {
      console.error('Update error:', updateError);
      return json({ error: 'Failed to update sample request' }, 500);
    }
    if (!updated) return json({ error: 'This sample changed in another session. Reload and try again.' }, 409);

    let notificationStatus: 'not_applicable' | 'sent' | 'failed' = 'not_applicable';
    // Send status notification emails
    if (status && status !== sample.status) {
      try {
        let emailContent: { subject: string; html: string } | null = null;

        if (status === 'approved') {
          emailContent = await sampleApprovedEmail({
            reference_number: sample.reference_number,
            contact_person: sample.contact_person,
            company_name: sample.company_name,
            product_type: sample.product_type,
            sample_fee: sample_fee ?? sample.sample_fee ?? 0,
            is_free_sample: is_free_sample ?? sample.is_free_sample,
          });
        } else if (status === 'shipped' && (tracking_number || sample.tracking_number)) {
          emailContent = await sampleShippedEmail({
            reference_number: sample.reference_number,
            contact_person: sample.contact_person,
            company_name: sample.company_name,
            product_type: sample.product_type,
            shipping_carrier: shipping_carrier || sample.shipping_carrier || 'Courier',
            tracking_number: tracking_number || sample.tracking_number || '',
          });
        } else if (['production', 'delivered', 'rejected'].includes(status)) {
          emailContent = await sampleStatusUpdateEmail({
            reference_number: sample.reference_number,
            contact_person: sample.contact_person,
            company_name: sample.company_name,
            product_type: sample.product_type,
            status,
            rejection_reason: rejection_reason || undefined,
          });
        }

        if (emailContent) {
          const { error: emailError } = await resend.emails.send({
            from: 'Reve Stitching <notifications@revestitching.com>',
            to: sample.email,
            subject: emailContent.subject,
            html: emailContent.html,
          });
          if (emailError) throw emailError;
          notificationStatus = 'sent';
        }
      } catch (emailErr) {
        console.error('Status email error:', emailErr);
        notificationStatus = 'failed';
      }
    }

    return json({ success: true, data: updated, notificationStatus });
  } catch (err) {
    console.error('Status update error:', err);
    return json({ error: 'Internal server error' }, 500);
  }
};
