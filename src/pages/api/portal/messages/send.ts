import type { APIRoute } from "astro";
import { getDb } from "../../../../db/index";
import { messages, users, orders } from "../../../../db/schema";
import { and, eq } from "drizzle-orm";
import { sendNewMessageEmail } from "../../../../lib/portal-emails";
import { isSameOriginRequest } from "../../../../lib/admin-operations";
import { z } from "zod";

export const POST: APIRoute = async ({ request, locals }) => {
  if (!locals.user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }
  if (!isSameOriginRequest(request)) {
    return new Response(JSON.stringify({ error: "Cross-site request rejected" }), { status: 403, headers: { "Content-Type": "application/json" } });
  }

  try {
    const db = getDb();
    const body = await request.json();
    const parsed = z.object({
      recipientId: z.string().trim().min(1).max(128),
      subject: z.string().trim().max(200).nullable().optional(),
      body: z.string().trim().min(1).max(10_000),
      orderId: z.string().trim().max(128).nullable().optional(),
    }).strict().safeParse(body);
    if (!parsed.success) return new Response(JSON.stringify({ error: "Invalid message" }), { status: 422, headers: { "Content-Type": "application/json" } });
    const { recipientId, subject, body: messageBody, orderId } = parsed.data;

    const recipient = await db.select().from(users).where(eq(users.id, recipientId)).get();
    const recipientRoleAllowed = locals.user.role === "admin" ? recipient?.role === "client" : recipient?.role === "admin";
    if (!recipient || recipient.status !== "active" || !recipientRoleAllowed) {
      return new Response(JSON.stringify({ error: "Recipient is not available" }), { status: 403, headers: { "Content-Type": "application/json" } });
    }

    if (orderId) {
      const linkedOrder = locals.user.role === "admin"
        ? await db.select({ id: orders.id }).from(orders).where(eq(orders.id, orderId)).get()
        : await db.select({ id: orders.id }).from(orders).where(and(eq(orders.id, orderId), eq(orders.clientId, locals.user.id))).get();
      if (!linkedOrder) return new Response(JSON.stringify({ error: "Order is not available" }), { status: 403, headers: { "Content-Type": "application/json" } });
    }

    const id = crypto.randomUUID();
    await db.insert(messages).values({
      id,
      orderId: orderId || null,
      senderId: locals.user.id,
      recipientId,
      subject: subject || null,
      body: messageBody,
      isRead: false,
    });

    // Send email notification to recipient
    try {
      if (recipient?.email) {
        await sendNewMessageEmail(
          recipient.email,
          recipient.name,
          subject || "",
          messageBody.substring(0, 200),
        );
      }
    } catch (emailErr) {
      console.warn("[Portal] Message email failed (non-critical):", emailErr);
    }

    return new Response(JSON.stringify({ success: true, id }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("[Portal] Send message error:", err);
    return new Response(JSON.stringify({ error: "Failed to send message" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
