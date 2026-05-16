import { createClient } from '@supabase/supabase-js';
import { c as checkAndSendFollowUps } from './follow-up-emails_C__bybi-.mjs';

const prerender = false;
const GET = async ({ request }) => {
  const startTime = Date.now();
  const authHeader = request.headers.get("authorization");
  const url = new URL(request.url);
  const querySecret = url.searchParams.get("secret");
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) {
    console.error("[Cron] ❌ CRON_SECRET not set");
    return new Response(
      JSON.stringify({ error: "Server misconfiguration" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
  const isAuthorized = authHeader === `Bearer ${cronSecret}` || querySecret === cronSecret;
  if (!isAuthorized) {
    console.warn("[Cron] ⚠️ Unauthorized attempt");
    return new Response(
      JSON.stringify({ error: "Unauthorized" }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }
  console.log("[Cron] ✅ Authenticated via", authHeader ? "header" : "query param");
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !supabaseServiceKey) {
    console.error("[Cron] ❌ Supabase credentials not configured");
    return new Response(
      JSON.stringify({ error: "Database not configured" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
  try {
    const result = await checkAndSendFollowUps(supabase);
    const elapsed = ((Date.now() - startTime) / 1e3).toFixed(2);
    return new Response(
      JSON.stringify({
        success: true,
        duration: `${elapsed}s`,
        ...result
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store"
        }
      }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[Cron] ❌ Unhandled error:", message);
    const discordUrl = process.env.DISCORD_WEBHOOK_URL;
    if (discordUrl) {
      fetch(discordUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: "🚨 **Follow-up cron failed!**",
          embeds: [
            {
              title: "Cron Error",
              description: `\`\`\`
${message}
\`\`\``,
              color: 16711680,
              timestamp: (/* @__PURE__ */ new Date()).toISOString()
            }
          ]
        })
      }).catch(() => {
      });
    }
    return new Response(
      JSON.stringify({ success: false, error: message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
