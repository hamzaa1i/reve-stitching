import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';
import { checkAndSendFollowUps } from '../../../lib/services/follow-up-emails';
import { getAdminFromCookies } from '../../../lib/auth';

export const prerender = false;

export const POST: APIRoute = async ({ cookies }) => {
  const startTime = Date.now();

  const admin = getAdminFromCookies(cookies);
  if (!admin) {
    return json({ success: false, error: 'Unauthorized' }, 401);
  }

  console.log(`[Manual Trigger] Initiated by ${admin.sub}`);

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    return json({ success: false, error: 'Database not configured' }, 500);
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  try {
    const result = await checkAndSendFollowUps(supabase);
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
    return json({ success: true, duration: `${elapsed}s`, ...result });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('[Manual Trigger] Error:', message);
    return json({ success: false, error: message }, 500);
  }
};

function json(data: object, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}