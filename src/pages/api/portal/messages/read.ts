import type { APIRoute } from "astro";
import { getDb } from "../../../../db/index";
import { messages } from "../../../../db/schema";
import { eq, and } from "drizzle-orm";
import { z } from "zod";
import { isSameOriginRequest } from "../../../../lib/admin-operations";

const markReadSchema = z.object({ messageId: z.string().uuid() }).strict();

export const POST: APIRoute = async ({ request, locals }) => {
  if (!locals.user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }
  if (!isSameOriginRequest(request)) {
    return new Response(JSON.stringify({ error: "Forbidden" }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const db = getDb();
    const parsed = markReadSchema.safeParse(await request.json());
    if (!parsed.success) {
      return new Response(JSON.stringify({ error: "Invalid message" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
    const { messageId } = parsed.data;

    // C-011 hotfix: scope update to messages owned by the current user
    const message = await db
      .select({ id: messages.id })
      .from(messages)
      .where(and(eq(messages.id, messageId), eq(messages.recipientId, locals.user.id)))
      .get();
    if (!message) {
      return new Response(JSON.stringify({ error: "Message not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    await db
      .update(messages)
      .set({ isRead: true })
      .where(and(eq(messages.id, messageId), eq(messages.recipientId, locals.user.id)));

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("[Portal] Mark message read failed");
    return new Response(JSON.stringify({ error: "Failed to update message" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
