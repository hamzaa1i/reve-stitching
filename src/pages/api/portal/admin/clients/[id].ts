import type { APIRoute } from "astro";
import { getDb } from "../../../../../db/index";
import { users } from "../../../../../db/schema";
import { eq } from "drizzle-orm";
import { sendAccountApprovedEmail } from "../../../../../lib/portal-emails";
import { z } from "zod";
import { isSameOriginRequest } from "../../../../../lib/admin-operations";

const updateClientSchema = z.object({
  status: z.enum(["active", "pending", "suspended"]),
}).strict();

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
      return new Response(JSON.stringify({ error: "Client not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }
    const parsed = updateClientSchema.safeParse(await request.json());
    if (!parsed.success) {
      return new Response(JSON.stringify({ error: "Invalid client status" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
    const { status } = parsed.data;

    // Get user before updating (to check previous status)
    const userBefore = await db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .get();

    if (!userBefore || userBefore.role !== "client") {
      return new Response(JSON.stringify({ error: "Client not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    await db.update(users).set({ status, updatedAt: new Date() }).where(eq(users.id, id));

    // Send welcome email if account just activated
    if (status === "active" && userBefore?.status !== "active") {
      try {
        await sendAccountApprovedEmail(userBefore.email, userBefore.name);
      } catch (emailErr) {
        console.warn(
          "[Portal] Account approval email failed (non-critical):",
          emailErr,
        );
      }
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("[Admin] Update client error:", err);
    return new Response(JSON.stringify({ error: "Failed to update client" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
