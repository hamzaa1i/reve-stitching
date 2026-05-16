import { g as getServiceClient } from './supabase_BOuP-yIE.mjs';
import { n as notifyNewChat } from './notifications_D1fqCv0k.mjs';
import { g as getClientIp, c as checkRateLimit, t as truncate, s as sanitizeString } from './security_Bv8llNtS.mjs';

const prerender = false;
const POST = async ({ request }) => {
  try {
    const ip = getClientIp(request);
    if (!checkRateLimit(ip, 10, 6e4)) {
      return new Response(
        JSON.stringify({ error: "Too many requests. Please wait." }),
        { status: 429, headers: { "Content-Type": "application/json" } }
      );
    }
    const { visitorToken, visitorName, visitorEmail } = await request.json();
    if (!visitorToken || typeof visitorToken !== "string") {
      return new Response(
        JSON.stringify({ error: "Visitor token required." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    const cleanToken = truncate(sanitizeString(visitorToken), 200);
    const cleanName = visitorName ? truncate(sanitizeString(visitorName), 200) : null;
    const cleanEmail = visitorEmail ? truncate(sanitizeString(visitorEmail), 254) : null;
    const supabase = getServiceClient();
    const { data: existing } = await supabase.from("chat_sessions").select("id").eq("visitor_token", cleanToken).in("status", ["waiting", "active"]).single();
    if (existing) {
      return new Response(
        JSON.stringify({ sessionId: existing.id }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }
    const { data, error } = await supabase.from("chat_sessions").insert({
      visitor_token: cleanToken,
      visitor_name: cleanName,
      visitor_email: cleanEmail,
      status: "waiting"
    }).select("id").single();
    if (error) throw error;
    await notifyNewChat({
      sessionId: data.id,
      visitorName: cleanName,
      visitorEmail: cleanEmail
    });
    return new Response(JSON.stringify({ sessionId: data.id }), {
      status: 201,
      headers: { "Content-Type": "application/json" }
    });
  } catch (e) {
    console.error("Chat session error:", e);
    return new Response(
      JSON.stringify({ error: "Failed to create session." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
