import { createClient } from '@supabase/supabase-js';
import { getAdminFromCookies } from './auth_BQ4oAavg.mjs';

const prerender = false;
const GET = async ({ cookies }) => {
  try {
    const admin = getAdminFromCookies(cookies);
    if (!admin) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );
    const { count: totalContacts } = await supabase.from("contact_submissions").select("*", { count: "exact", head: true });
    const { count: newContacts } = await supabase.from("contact_submissions").select("*", { count: "exact", head: true }).eq("status", "new");
    const { count: waitingChats } = await supabase.from("chat_sessions").select("*", { count: "exact", head: true }).eq("status", "waiting");
    const { count: activeChats } = await supabase.from("chat_sessions").select("*", { count: "exact", head: true }).eq("status", "active");
    return new Response(
      JSON.stringify({
        totalContacts: totalContacts || 0,
        newContacts: newContacts || 0,
        waitingChats: waitingChats || 0,
        activeChats: activeChats || 0
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" }
      }
    );
  } catch (e) {
    console.error("[Dashboard Stats] Error:", e);
    return new Response(
      JSON.stringify({ error: "Failed to fetch stats" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
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
