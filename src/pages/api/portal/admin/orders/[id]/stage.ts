import type { APIRoute } from "astro";
import { getDb } from "../../../../../../db/index";
import { orders, orderStages, users } from "../../../../../../db/schema";
import { eq } from "drizzle-orm";
import { sendStageUpdateEmail } from "../../../../../../lib/portal-emails";
import { z } from "zod";
import { isSameOriginRequest } from "../../../../../../lib/admin-operations";

const ORDER_STAGES = [
  "confirmed", "fabric_sourced", "cutting", "stitching",
  "qc", "packing", "shipped", "delivered",
] as const;
const optionalPhotoUrl = z.preprocess(
  (value) => value === "" ? null : value,
  z.string().trim().url().max(2_000).refine((url) => url.startsWith("https://"), "HTTPS required").optional().nullable(),
);
const stageUpdateSchema = z.object({
  stage: z.enum(ORDER_STAGES),
  notes: z.string().trim().max(5_000).optional().nullable(),
  photoUrl: optionalPhotoUrl,
}).strict();

export const POST: APIRoute = async ({ params, request, locals }) => {
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
    const { id } = params;
    if (!id) {
      return new Response(JSON.stringify({ error: "Order not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const parsed = stageUpdateSchema.safeParse(await request.json());
    if (!parsed.success) {
      return new Response(JSON.stringify({ error: "Invalid stage update" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
    const { stage, notes, photoUrl } = parsed.data;

    const order = await db.select().from(orders).where(eq(orders.id, id)).get();
    if (!order) {
      return new Response(JSON.stringify({ error: "Order not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const currentIndex = ORDER_STAGES.indexOf(order.status as typeof ORDER_STAGES[number]);
    if (currentIndex < 0 || ORDER_STAGES[currentIndex + 1] !== stage) {
      return new Response(JSON.stringify({ error: "Order stage changed. Refresh and try again." }), {
        status: 409,
        headers: { "Content-Type": "application/json" },
      });
    }

    const stageId = crypto.randomUUID();
    await db.insert(orderStages).values({
      id: stageId,
      orderId: id,
      stage,
      notes: notes || null,
      photoUrl: photoUrl || null,
      createdBy: locals.user!.id,
    });

    await db
      .update(orders)
      .set({
        status: stage,
        ...(stage === "delivered" ? { actualCompletion: new Date() } : {}),
        updatedAt: new Date(),
      })
      .where(eq(orders.id, id));

    // Send email notification
    try {
      const updatedOrder = await db
        .select()
        .from(orders)
        .where(eq(orders.id, id))
        .get();
      if (updatedOrder) {
        const client = await db
          .select()
          .from(users)
          .where(eq(users.id, updatedOrder.clientId))
          .get();
        if (client?.email) {
          await sendStageUpdateEmail(
            client.email,
            client.name,
            updatedOrder.poNumber,
            stage,
            notes || null,
            updatedOrder.id,
          );
        }
      }
    } catch (emailErr) {
      console.warn("[Portal] Stage email failed (non-critical):", emailErr);
    }

    return new Response(JSON.stringify({ success: true, stageId }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("[Admin] Add stage error:", err);
    return new Response(JSON.stringify({ error: "Failed to add stage" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
