import { g as getServiceClient } from './supabase_BOuP-yIE.mjs';
import { g as getClientIp, c as checkRateLimit, t as truncate, s as sanitizeString } from './security_Bv8llNtS.mjs';

const prerender = false;
const POST = async ({ request }) => {
  try {
    const ip = getClientIp(request);
    if (!checkRateLimit(ip, 20, 6e4)) {
      return new Response(
        JSON.stringify({ error: "Too many messages. Please wait." }),
        { status: 429, headers: { "Content-Type": "application/json" } }
      );
    }
    const { sessionId, visitorToken, message } = await request.json();
    if (!sessionId || !visitorToken || !message) {
      return new Response(
        JSON.stringify({ error: "Missing required fields." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    const cleanSessionId = truncate(sanitizeString(sessionId), 100);
    const cleanToken = truncate(sanitizeString(visitorToken), 200);
    const cleanMessage = truncate(sanitizeString(message), 2e3);
    if (cleanMessage.length < 1) {
      return new Response(
        JSON.stringify({ error: "Message cannot be empty." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    const supabase = getServiceClient();
    const { data: session } = await supabase.from("chat_sessions").select("id, status").eq("id", cleanSessionId).eq("visitor_token", cleanToken).single();
    if (!session) {
      return new Response(
        JSON.stringify({ error: "Invalid session." }),
        { status: 403, headers: { "Content-Type": "application/json" } }
      );
    }
    if (session.status === "closed") {
      return new Response(
        JSON.stringify({ error: "Chat session is closed." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    const { error } = await supabase.from("chat_messages").insert({
      session_id: cleanSessionId,
      sender: "visitor",
      message: cleanMessage
    });
    if (error) throw error;
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (e) {
    console.error("Chat send error:", e);
    return new Response(
      JSON.stringify({ error: "Failed to send message." }),
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
