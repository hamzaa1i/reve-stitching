import type { APIRoute } from "astro";
import { getDb } from "../../../../../db/index";
import { orders } from "../../../../../db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { isSameOriginRequest } from "../../../../../lib/admin-operations";

const ORDER_STATUSES = [
  "confirmed", "fabric_sourced", "cutting", "stitching",
  "qc", "packing", "shipped", "delivered",
] as const;
const optionalText = (max: number) => z.preprocess(
  (value) => value === "" ? null : value,
  z.string().trim().max(max).nullable().optional(),
);
const optionalPrice = (decimalPlaces: number) => z.preprocess(
  (value) => value === "" ? null : value,
  z.string().trim().regex(new RegExp(`^\\d+(?:\\.\\d{1,${decimalPlaces}})?$`)).max(30).nullable().optional(),
);
const optionalDate = z.preprocess(
  (value) => value === "" ? null : value,
  z.string().datetime().nullable().optional(),
);
const optionalUrl = z.preprocess(
  (value) => value === "" ? null : value,
  z.string().trim().url().max(2_000).nullable().optional(),
);
const updateOrderSchema = z.object({
  status: z.enum(ORDER_STATUSES).optional(),
  poNumber: z.string().trim().min(1).max(100).optional(),
  productType: z.string().trim().min(1).max(200).optional(),
  quantity: z.number().int().positive().max(10_000_000).optional(),
  unitPrice: optionalPrice(4),
  totalPrice: optionalPrice(2),
  currency: z.string().trim().regex(/^[A-Z]{3}$/).optional(),
  fabricDetails: optionalText(2_000),
  color: optionalText(200),
  sizeRange: optionalText(200),
  notes: optionalText(5_000),
  estimatedCompletion: optionalDate,
  actualCompletion: optionalDate,
  trackingNumber: optionalText(300),
  trackingUrl: optionalUrl,
}).strict().refine((value) => Object.keys(value).length > 0, "No updates supplied");

export const PATCH: APIRoute = async ({ params, request, locals }) => {
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

    const parsed = updateOrderSchema.safeParse(await request.json());
    if (!parsed.success) {
      return new Response(JSON.stringify({ error: "Invalid order update" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const existing = await db.select({ id: orders.id }).from(orders).where(eq(orders.id, id)).get();
    if (!existing) {
      return new Response(JSON.stringify({ error: "Order not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const updates: Record<string, any> = { updatedAt: new Date() };
    for (const [field, value] of Object.entries(parsed.data)) {
      if (value !== undefined) {
        if (field === "estimatedCompletion" || field === "actualCompletion") {
          updates[field] = value ? new Date(value as string) : null;
        } else {
          updates[field] = value;
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
