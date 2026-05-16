import { createClient } from '@supabase/supabase-js';
import { getAdminFromCookies } from './auth_BQ4oAavg.mjs';

const prerender = false;
const POST = async ({ request, cookies }) => {
  const admin = getAdminFromCookies(cookies);
  if (!admin) {
    return json({ success: false, error: "Unauthorized" }, 401);
  }
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ success: false, error: "Invalid JSON body" }, 400);
  }
  const id = String(body?.id || "");
  const paused = Boolean(body?.paused);
  if (!id) {
    return json({ success: false, error: "Missing quote id" }, 400);
  }
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
  const now = (/* @__PURE__ */ new Date()).toISOString();
  const { data, error } = await supabase.from("quote_requests").update({
    automation_paused: paused,
    last_admin_action_at: now
  }).eq("id", id).select("id, automation_paused, last_admin_action_at").single();
  if (error) {
    console.error("[Quote Automation] Update failed:", error);
    return json({ success: false, error: error.message }, 500);
  }
  console.log(
    `[Quote Automation] ${paused ? "PAUSED" : "RESUMED"} by ${admin.sub} for quote ${id}`
  );
  return json({ success: true, data });
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
