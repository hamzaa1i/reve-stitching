import type { APIRoute } from "astro";
import { getDb } from "../../../../db/index";
import { messages } from "../../../../db/schema";
import { eq, and } from "drizzle-orm";

export const POST: APIRoute = async ({ request, locals }) => {
  if (!locals.user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const db = getDb();
    const { messageId } = await request.json();

    // C-011 hotfix: scope update to messages owned by the current user
    await db
      .update(messages)
      .set({ isRead: true })
      .where(and(eq(messages.id, messageId), eq(messages.recipientId, locals.user.id)));

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
