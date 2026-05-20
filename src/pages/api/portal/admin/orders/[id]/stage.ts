import type { APIRoute } from "astro";
import { getDb } from "../../../../../../db/index";
import { orders, orderStages, users } from "../../../../../../db/schema";
import { eq } from "drizzle-orm";
import { sendStageUpdateEmail } from "../../../../../../lib/portal-emails";

export const POST: APIRoute = async ({ params, request, locals }) => {
  if (locals.user?.role !== "admin") {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const db = getDb();
    const { id } = params;
    const body = await request.json();
    const { stage, notes, photoUrl } = body;

    if (!stage) {
      return new Response(JSON.stringify({ error: "Stage is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const stageId = crypto.randomUUID();
    await db.insert(orderStages).values({
      id: stageId,
      orderId: id!,
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
      })
      .where(eq(orders.id, id!));

    // Send email notification
    try {
      const order = await db
        .select()
        .from(orders)
        .where(eq(orders.id, id!))
        .get();
      if (order) {
        const client = await db
          .select()
          .from(users)
          .where(eq(users.id, order.clientId))
          .get();
        if (client?.email) {
          await sendStageUpdateEmail(
            client.email,
            client.name,
            order.poNumber,
            stage,
            notes || null,
            order.id,
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
