import type { APIRoute } from "astro";
import { getDb } from "../../../../../db/index";
import { orders } from "../../../../../db/schema";
import { desc } from "drizzle-orm";

export const GET: APIRoute = async ({ locals }) => {
  if (locals.user?.role !== "admin") {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const db = getDb();
    const allOrders = await db
      .select()
      .from(orders)
      .orderBy(desc(orders.createdAt))
      .all();
    return new Response(JSON.stringify({ orders: allOrders }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("[Admin] Get orders error:", err);
    return new Response(JSON.stringify({ error: "Failed to fetch orders" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

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
      poNumber,
      productType,
      quantity,
      unitPrice,
      totalPrice,
      currency,
      fabricDetails,
      color,
      sizeRange,
      notes,
      estimatedCompletion,
    } = body;

    if (!clientId || !poNumber || !productType || !quantity) {
      return new Response(
        JSON.stringify({
          error: "Client, PO number, product type, and quantity are required",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const id = crypto.randomUUID();
    await db.insert(orders).values({
      id,
      clientId,
      poNumber,
      productType,
      quantity,
      unitPrice: unitPrice || null,
      totalPrice: totalPrice || null,
      currency: currency || "USD",
      status: "confirmed",
      fabricDetails: fabricDetails || null,
      color: color || null,
      sizeRange: sizeRange || null,
      notes: notes || null,
      estimatedCompletion: estimatedCompletion
        ? new Date(estimatedCompletion)
        : null,
    });

    return new Response(JSON.stringify({ id, message: "Order created" }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("[Admin] Create order error:", err);
    return new Response(JSON.stringify({ error: "Failed to create order" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
