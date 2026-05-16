import { g as getServiceClient } from './supabase_BOuP-yIE.mjs';

const prerender = false;
const POST = async ({ request }) => {
  try {
    const text = await request.text();
    const { sessionId, visitorToken } = JSON.parse(text);
    if (!sessionId || !visitorToken) {
      return new Response("Missing fields", { status: 400 });
    }
    const supabase = getServiceClient();
    const { data: session } = await supabase.from("chat_sessions").select("id, status").eq("id", sessionId).eq("visitor_token", visitorToken).single();
    if (!session || session.status === "closed") {
      return new Response("OK", { status: 200 });
    }
    await supabase.from("chat_sessions").update({ status: "closed" }).eq("id", sessionId);
    await supabase.from("chat_messages").insert({
      session_id: sessionId,
      sender: "visitor",
      message: "(Visitor left the chat)"
    });
    return new Response("OK", { status: 200 });
  } catch (e) {
    return new Response("Error", { status: 500 });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
