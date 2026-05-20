import type { APIRoute } from "astro";
import { getDb } from "../../../../db/index";
import { quotes, users } from "../../../../db/schema";
import { eq, desc } from "drizzle-orm";
import { sendQuoteReadyEmail } from "../../../../lib/portal-emails";

export const POST: APIRoute = async ({ request, locals }) => {
  if (locals.user?.role !== "admin") {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const db = getDb();
    const body = await request.json();
    const {
      clientId,
      productType,
      quantity,
      unitPrice,
      totalPrice,
      currency,
      fabric,
      color,
      notes,
      validDays,
    } = body;

    if (!clientId || !productType || !quantity || !unitPrice || !totalPrice) {
      return new Response(
        JSON.stringify({ error: "Required fields missing" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    const id = crypto.randomUUID();
    const validUntil = validDays
      ? new Date(Date.now() + Number(validDays) * 24 * 60 * 60 * 1000)
      : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    await db.insert(quotes).values({
      id,
      clientId,
      productType,
      quantity: Number(quantity),
      unitPrice,
      totalPrice,
      currency: currency || "USD",
      fabric: fabric || null,
      color: color || null,
      notes: notes || null,
      status: "sent",
      validUntil,
    });

    // Send email
    try {
      const client = await db
        .select()
        .from(users)
        .where(eq(users.id, clientId))
        .get();
      if (client?.email) {
        await sendQuoteReadyEmail(
          client.email,
          client.name,
          productType,
          totalPrice,
          currency || "USD",
        );
      }
    } catch (emailErr) {
      console.warn("[Portal] Quote email failed (non-critical):", emailErr);
    }

    return new Response(JSON.stringify({ id, success: true }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("[Admin] Create quote error:", err);
    return new Response(JSON.stringify({ error: "Failed to create quote" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
