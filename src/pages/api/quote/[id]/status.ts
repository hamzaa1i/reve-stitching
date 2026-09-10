import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';
import { getAdminFromCookies } from '../../../../lib/auth';
import { json } from '../../../../lib/utils';
import type { QuoteStatus } from '../../../../lib/types/quote';
import { isSameOriginRequest } from '../../../../lib/admin-operations';
import { z } from 'zod';

export const prerender = false;

const VALID_STATUSES: QuoteStatus[] = ['new', 'reviewed', 'quoted', 'converted', 'rejected'];

export const PATCH: APIRoute = async ({ params, request, cookies }) => {
  const admin = getAdminFromCookies(cookies);
  if (!admin) {
    return json({ error: 'Unauthorized' }, 401);
  }
  if (!isSameOriginRequest(request)) return json({ error: 'Cross-site request rejected' }, 403);

  const { id } = params;
  if (!id) {
    return json({ error: 'Missing quote ID' }, 400);
  }

  try {
    const body = await request.json();
    const parsed = z.object({
      status: z.enum(VALID_STATUSES as [QuoteStatus, ...QuoteStatus[]]).optional(),
      admin_notes: z.string().trim().max(10_000).nullable().optional(),
      assigned_to: z.string().trim().max(200).nullable().optional(),
    }).strict().safeParse(body);
    if (!parsed.success) return json({ error: 'Invalid quote update' }, 422);
    const updates: Record<string, unknown> = { ...parsed.data };

    if (Object.keys(updates).length === 0) {
      return json({ error: 'No fields to update' }, 422);
    }

    updates.last_admin_action_at = new Date().toISOString();  // ← ADD THIS


    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    const { data, error } = await supabase
      .from('quote_requests')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('[API] Status update failed:', error);
      return json({ error: 'Update failed' }, 500);
    }

    return json({ success: true, data });
  } catch (err) {
    console.error('[API] Status update exception:', err);
    return json({ error: 'Server error' }, 500);
  }
};
