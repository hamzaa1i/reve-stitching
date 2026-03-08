// src/pages/api/admin/trigger-follow-ups.ts
import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';
import { checkAndSendFollowUps } from '../../../lib/services/follow-up-emails';
import { getAdminFromCookies } from '../../../lib/auth';

export const prerender = false;

export const POST: APIRoute = async ({ cookies }) => {
  // Admin auth
  const admin = getAdminFromCookies(cookies);
  if (!admin) {
    console.error('[Trigger Follow-ups] Unauthorized access attempt');
    return json({ success: false, error: 'Unauthorized' }, 401);
  }

  console.log(`[Trigger Follow-ups] Manual trigger by admin: ${admin.sub}`);

  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  try {
    const result = await checkAndSendFollowUps(supabase);

    return json({
      success: true,
      message: 'Follow-up check complete',
      stats: {
        quotesProcessed: result.quotesProcessed,
        emailsSent: result.emailsSent,
        errors: result.errors,
      },
      details: result.details,
    });
  } catch (error) {
    console.error('[Trigger Follow-ups] Error:', error);
    return json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }, 500);
  }
};

function json(data: object, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}