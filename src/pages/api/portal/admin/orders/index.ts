import type { APIRoute } from "astro";
import { getDb } from "../../../../../db/index";
import { orders, users } from "../../../../../db/schema";
import { and, desc, eq } from "drizzle-orm";
import { z } from "zod";
import { isSameOriginRequest } from "../../../../../lib/admin-operations";

const optionalText = (max: number) => z.preprocess(
  (value) => value === "" ? null : value,
  z.string().trim().max(max).optional().nullable(),
);
const optionalPrice = (decimalPlaces: number) => z.preprocess(
  (value) => value === "" ? null : value,
  z.string().trim().regex(new RegExp(`^\\d+(?:\\.\\d{1,${decimalPlaces}})?$`)).max(30).optional().nullable(),
);
const optionalDate = z.preprocess(
  (value) => value === "" ? null : value,
  z.string().datetime().optional().nullable(),
);
const createOrderSchema = z.object({
  clientId: z.string().uuid(),
  poNumber: z.string().trim().min(1).max(100),
  productType: z.string().trim().min(1).max(200),
  quantity: z.number().int().positive().max(10_000_000),
  unitPrice: optionalPrice(4),
  totalPrice: optionalPrice(2),
  currency: z.string().trim().regex(/^[A-Z]{3}$/).default("USD"),
  fabricDetails: optionalText(2_000),
  color: optionalText(200),
  sizeRange: optionalText(200),
  notes: optionalText(5_000),
  estimatedCompletion: optionalDate,
}).strict();

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

  if (!isSameOriginRequest(request)) {
    return new Response(JSON.stringify({ error: "Forbidden" }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const db = getDb();
    const parsed = createOrderSchema.safeParse(await request.json());
    if (!parsed.success) {
      return new Response(JSON.stringify({ error: "Invalid order details" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

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
    } = parsed.data;

    const client = await db
      .select({ id: users.id })
      .from(users)
      .where(and(eq(users.id, clientId), eq(users.role, "client")))
      .get();

    if (!client) {
      return new Response(JSON.stringify({ error: "Client not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
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
      currency,
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
