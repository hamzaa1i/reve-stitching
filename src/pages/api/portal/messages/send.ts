import type { APIRoute } from "astro";
import { getDb } from "../../../../db/index";
import { messages, users } from "../../../../db/schema";
import { eq } from "drizzle-orm";
import { sendNewMessageEmail } from "../../../../lib/portal-emails";

export const POST: APIRoute = async ({ request, locals }) => {
  if (!locals.user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const db = getDb();
    const body = await request.json();
    const { recipientId, subject, body: messageBody, orderId } = body;

    if (!recipientId || !messageBody) {
      return new Response(
        JSON.stringify({ error: "Recipient and message are required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
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
      const recipient = await db
        .select()
        .from(users)
        .where(eq(users.id, recipientId))
        .get();
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
