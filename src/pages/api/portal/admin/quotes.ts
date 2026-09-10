import type { APIRoute } from "astro";
import { getDb } from "../../../../db/index";
import { quotes, users } from "../../../../db/schema";
import { and, eq } from "drizzle-orm";
import { sendQuoteReadyEmail } from "../../../../lib/portal-emails";
import { z } from "zod";
import { isSameOriginRequest } from "../../../../lib/admin-operations";

const optionalText = (max: number) => z.preprocess(
  (value) => value === "" ? null : value,
  z.string().trim().max(max).optional().nullable(),
);
const createQuoteSchema = z.object({
  clientId: z.string().uuid(),
  productType: z.string().trim().min(1).max(200),
  quantity: z.coerce.number().int().positive().max(10_000_000),
  unitPrice: z.string().trim().regex(/^\d+(?:\.\d{1,4})?$/).max(30),
  totalPrice: z.string().trim().regex(/^\d+(?:\.\d{1,2})?$/).max(30),
  currency: z.string().trim().regex(/^[A-Z]{3}$/).default("USD"),
  fabric: optionalText(2_000),
  color: optionalText(200),
  notes: optionalText(5_000),
  validDays: z.coerce.number().int().min(1).max(365).default(30),
}).strict();

export const POST: APIRoute = async ({ request, locals }) => {
  if (locals.user?.role !== "admin") {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 403,
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
    const parsed = createQuoteSchema.safeParse(await request.json());
    if (!parsed.success) {
      return new Response(JSON.stringify({ error: "Invalid quote details" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
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
    } = parsed.data;

    const client = await db
      .select({ id: users.id, email: users.email, name: users.name })
      .from(users)
      .where(and(eq(users.id, clientId), eq(users.role, "client"), eq(users.status, "active")))
      .get();
    if (!client) {
      return new Response(JSON.stringify({ error: "Active client not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const id = crypto.randomUUID();
    const validUntil = new Date(Date.now() + validDays * 24 * 60 * 60 * 1000);

    await db.insert(quotes).values({
      id,
      clientId,
      productType,
      quantity,
      unitPrice,
      totalPrice,
      currency,
      fabric: fabric || null,
      color: color || null,
      notes: notes || null,
      status: "sent",
      validUntil,
    });

    // Send email
    try {
      if (client?.email) {
        await sendQuoteReadyEmail(
          client.email,
          client.name,
          productType,
          totalPrice,
          currency,
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
