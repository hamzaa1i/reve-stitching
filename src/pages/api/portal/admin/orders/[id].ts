import type { APIRoute } from "astro";
import { getDb } from "../../../../../db/index";
import { orders } from "../../../../../db/schema";
import { eq } from "drizzle-orm";

export const PATCH: APIRoute = async ({ params, request, locals }) => {
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

    const updates: Record<string, any> = { updatedAt: new Date() };
    const allowedFields = [
      "status",
      "poNumber",
      "productType",
      "quantity",
      "unitPrice",
      "totalPrice",
      "currency",
      "fabricDetails",
      "color",
      "sizeRange",
      "notes",
      "estimatedCompletion",
      "actualCompletion",
      "trackingNumber",
      "trackingUrl",
    ];

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        if (field === "estimatedCompletion" || field === "actualCompletion") {
          updates[field] = body[field] ? new Date(body[field]) : null;
        } else {
          updates[field] = body[field];
        }
      }
    }

    await db.update(orders).set(updates).where(eq(orders.id, id!));

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("[Admin] Update order error:", err);
    return new Response(JSON.stringify({ error: "Failed to update order" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
