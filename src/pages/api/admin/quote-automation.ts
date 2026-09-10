// src/pages/api/admin/quote-automation.ts

import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';
import { getAdminFromCookies } from '../../../lib/auth';
import { json } from '../../../lib/utils';
import { isSameOriginRequest } from '../../../lib/admin-operations';
import { z } from 'zod';

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies }) => {
  // 1) Admin auth
  const admin = getAdminFromCookies(cookies);
  if (!admin) {
    return json({ success: false, error: 'Unauthorized' }, 401);
  }
  if (!isSameOriginRequest(request)) return json({ success: false, error: 'Cross-site request rejected' }, 403);

  // 2) Read body
  let body: any;
  try {
    body = await request.json();
  } catch {
    return json({ success: false, error: 'Invalid JSON body' }, 400);
  }

  const parsed = z.object({ id: z.string().trim().min(1).max(128), paused: z.boolean() }).strict().safeParse(body);
  if (!parsed.success) return json({ success: false, error: 'Invalid automation update' }, 400);
  const { id, paused } = parsed.data;

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
    return json({ success: false, error: 'Automation setting could not be updated' }, 500);
  }

  console.log(
    `[Quote Automation] ${paused ? 'PAUSED' : 'RESUMED'} by ${admin.sub} for quote ${id}`
  );

  return json({ success: true, data });
};
