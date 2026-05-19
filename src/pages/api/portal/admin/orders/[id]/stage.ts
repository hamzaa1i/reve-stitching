import type { APIRoute } from "astro";
import { getDb } from "../../../../../../db/index";
import { orders, orderStages } from "../../../../../../db/schema";
import { eq } from "drizzle-orm";

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

    // Add stage entry
    const stageId = crypto.randomUUID();
    await db.insert(orderStages).values({
      id: stageId,
      orderId: id!,
      stage,
      notes: notes || null,
      photoUrl: photoUrl || null,
      createdBy: locals.user!.id,
    });

    // Update order status to match
    await db
      .update(orders)
      .set({
        status: stage,
        updatedAt: new Date(),
        ...(stage === "delivered" ? { actualCompletion: new Date() } : {}),
      })
      .where(eq(orders.id, id!));

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
