// src/pages/api/admin/quote-automation.ts

import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';
import { getAdminFromCookies } from '../../../lib/auth';

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies }) => {
  // 1) Admin auth
  const admin = getAdminFromCookies(cookies);
  if (!admin) {
    return json({ success: false, error: 'Unauthorized' }, 401);
  }

  // 2) Read body
  let body: any;
  try {
    body = await request.json();
  } catch {
    return json({ success: false, error: 'Invalid JSON body' }, 400);
  }

  const id = String(body?.id || '');
  const paused = Boolean(body?.paused);

  if (!id) {
    return json({ success: false, error: 'Missing quote id' }, 400);
  }

  // 3) Supabase service role
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  const now = new Date().toISOString();

  // 4) Update quote
  const { data, error } = await supabase
    .from('quote_requests')
    .update({
      automation_paused: paused,
      last_admin_action_at: now,
    })
    .eq('id', id)
    .select('id, automation_paused, last_admin_action_at')
    .single();

  if (error) {
    console.error('[Quote Automation] Update failed:', error);
    return json({ success: false, error: error.message }, 500);
  }

  console.log(
    `[Quote Automation] ${paused ? 'PAUSED' : 'RESUMED'} by ${admin.sub} for quote ${id}`
  );

  return json({ success: true, data });
};

function json(data: object, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}