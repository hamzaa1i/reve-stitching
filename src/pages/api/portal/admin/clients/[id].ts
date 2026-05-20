import type { APIRoute } from "astro";
import { getDb } from "../../../../../db/index";
import { users } from "../../../../../db/schema";
import { eq } from "drizzle-orm";
import { sendAccountApprovedEmail } from "../../../../../lib/portal-emails";

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
    const { status } = body;

    if (!status || !["active", "pending", "suspended"].includes(status)) {
      return new Response(JSON.stringify({ error: "Invalid status" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Get user before updating (to check previous status)
    const userBefore = await db
      .select()
      .from(users)
      .where(eq(users.id, id!))
      .get();

    await db.update(users).set({ status }).where(eq(users.id, id!));

    // Send welcome email if account just activated
    if (status === "active" && userBefore?.status !== "active") {
      try {
        await sendAccountApprovedEmail(userBefore!.email, userBefore!.name);
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
