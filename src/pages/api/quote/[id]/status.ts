import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';
import { getAdminFromCookies } from '../../../../lib/auth';
import type { QuoteStatus } from '../../../../lib/types/quote';

export const prerender = false;

const VALID_STATUSES: QuoteStatus[] = ['new', 'reviewed', 'quoted', 'converted', 'rejected'];

export const PATCH: APIRoute = async ({ params, request, cookies }) => {
  // Auth check
  const admin = getAdminFromCookies(cookies);
  if (!admin) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { 
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const { id } = params;
  if (!id) {
    return new Response(JSON.stringify({ error: 'Missing quote ID' }), { 
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const body = await request.json();
    const updates: Record<string, any> = {};

    if (body.status) {
      if (!VALID_STATUSES.includes(body.status)) {
        return new Response(
          JSON.stringify({ error: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}` }),
          { status: 422, headers: { 'Content-Type': 'application/json' } }
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
      return new Response(JSON.stringify({ error: 'No fields to update' }), { 
        status: 422,
        headers: { 'Content-Type': 'application/json' }
      });
    }

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
      return new Response(JSON.stringify({ error: 'Update failed' }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ success: true, data }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (err) {
    console.error('[API] Status update exception:', err);
    return new Response(JSON.stringify({ error: 'Server error' }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};