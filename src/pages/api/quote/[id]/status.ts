// src/pages/api/quote/[id]/status.ts

import type { APIRoute } from 'astro';
import { getSupabase } from '../../../../lib/supabase';
import type { QuoteStatus } from '../../../../lib/types/quote';

const VALID_STATUSES: QuoteStatus[] = ['new', 'reviewed', 'quoted', 'converted', 'rejected'];

export const PATCH: APIRoute = async ({ params, request, cookies }) => {
  // ── Auth check ──
  const token = cookies.get('admin_token')?.value;
  if (token !== import.meta.env.ADMIN_SECRET) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const { id } = params;
  if (!id) {
    return new Response(JSON.stringify({ error: 'Missing quote ID' }), { status: 400 });
  }

  try {
    const body = await request.json();
    const updates: Record<string, any> = {};

    if (body.status) {
      if (!VALID_STATUSES.includes(body.status)) {
        return new Response(
          JSON.stringify({ error: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}` }),
          { status: 422 }
        );
      }
      updates.status = body.status;
    }

    if (typeof body.admin_notes === 'string') {
      updates.admin_notes = body.admin_notes;
    }

    if (typeof body.assigned_to === 'string') {
      updates.assigned_to = body.assigned_to;
    }

    if (Object.keys(updates).length === 0) {
      return new Response(JSON.stringify({ error: 'No fields to update' }), { status: 422 });
    }

    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('quote_requests')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('[API] Status update failed:', error);
      return new Response(JSON.stringify({ error: 'Update failed' }), { status: 500 });
    }

    return new Response(JSON.stringify({ success: true, data }), { status: 200 });

  } catch (err) {
    console.error('[API] Status update exception:', err);
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
  }
};