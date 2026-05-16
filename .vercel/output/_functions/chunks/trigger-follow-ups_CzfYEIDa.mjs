import { createClient } from '@supabase/supabase-js';
import { c as checkAndSendFollowUps } from './follow-up-emails_C__bybi-.mjs';
import { getAdminFromCookies } from './auth_BQ4oAavg.mjs';

const prerender = false;
const POST = async ({ cookies }) => {
  const admin = getAdminFromCookies(cookies);
  if (!admin) {
    console.error("[Trigger Follow-ups] Unauthorized access attempt");
    return json({ success: false, error: "Unauthorized" }, 401);
  }
  console.log(`[Trigger Follow-ups] Manual trigger by admin: ${admin.sub}`);
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
  try {
    const result = await checkAndSendFollowUps(supabase);
    return json({
      success: true,
      message: "Follow-up check complete",
      stats: {
        quotesProcessed: result.quotesProcessed,
        emailsSent: result.emailsSent,
        errors: result.errors
      },
      details: result.details
    });
  } catch (error) {
    console.error("[Trigger Follow-ups] Error:", error);
    return json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    }, 500);
  }
};
function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" }
  });
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
