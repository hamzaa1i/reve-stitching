import { createClient } from '@supabase/supabase-js';
import { getAdminFromCookies } from './auth_BQ4oAavg.mjs';

const prerender = false;
const VALID_STATUSES = ["new", "reviewed", "quoted", "converted", "rejected"];
const PATCH = async ({ params, request, cookies }) => {
  const admin = getAdminFromCookies(cookies);
  if (!admin) {
    return json({ error: "Unauthorized" }, 401);
  }
  const { id } = params;
  if (!id) {
    return json({ error: "Missing quote ID" }, 400);
  }
  try {
    const body = await request.json();
    const updates = {};
    if (body.status) {
      if (!VALID_STATUSES.includes(body.status)) {
        return json({ error: `Invalid status. Must be one of: ${VALID_STATUSES.join(", ")}` }, 422);
      }
      updates.status = body.status;
    }
    if (typeof body.admin_notes === "string") updates.admin_notes = body.admin_notes;
    if (typeof body.assigned_to === "string") updates.assigned_to = body.assigned_to;
    if (Object.keys(updates).length === 0) {
      return json({ error: "No fields to update" }, 422);
    }
    updates.last_admin_action_at = (/* @__PURE__ */ new Date()).toISOString();
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );
    const { data, error } = await supabase.from("quote_requests").update(updates).eq("id", id).select().single();
    if (error) {
      console.error("[API] Status update failed:", error);
      return json({ error: "Update failed" }, 500);
    }
    return json({ success: true, data });
  } catch (err) {
    console.error("[API] Status update exception:", err);
    return json({ error: "Server error" }, 500);
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
  PATCH,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
