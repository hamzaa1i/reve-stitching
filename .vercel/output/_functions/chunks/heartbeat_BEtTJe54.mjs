import { g as getServiceClient } from './supabase_BOuP-yIE.mjs';

const prerender = false;
const POST = async ({ request }) => {
  try {
    const { sessionId, visitorToken } = await request.json();
    if (!sessionId || !visitorToken) {
      return new Response(JSON.stringify({ error: "Missing fields." }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const supabase = getServiceClient();
    const { error } = await supabase.from("chat_sessions").update({ updated_at: (/* @__PURE__ */ new Date()).toISOString() }).eq("id", sessionId).eq("visitor_token", visitorToken).in("status", ["waiting", "active"]);
    if (error) throw error;
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: "Failed." }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
