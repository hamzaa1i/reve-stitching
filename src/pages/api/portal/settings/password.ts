import type { APIRoute } from "astro";
import { getDb } from "../../../../db/index";
import { users } from "../../../../db/schema";
import { eq } from "drizzle-orm";
import { verifyPassword, hashPassword } from "../../../../lib/portal-auth";
import { z } from "zod";
import { isSameOriginRequest } from "../../../../lib/admin-operations";

const passwordSchema = z.object({
  currentPassword: z.string().min(1).max(1_000),
  newPassword: z.string().min(8).max(128),
}).strict();

export const POST: APIRoute = async ({ request, locals }) => {
  if (!locals.user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
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
    const parsed = passwordSchema.safeParse(await request.json());
    if (!parsed.success) {
      return new Response(
        JSON.stringify({ error: "New password must be 8 to 128 characters" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }
    const { currentPassword, newPassword } = parsed.data;

    const db = getDb();
    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, locals.user.id))
      .get();
    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const valid = await verifyPassword(currentPassword, user.passwordHash);
    if (!valid) {
      return new Response(
        JSON.stringify({ error: "Current password is incorrect" }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    const newHash = await hashPassword(newPassword);
    await db
      .update(users)
      .set({ passwordHash: newHash })
      .where(eq(users.id, user.id));

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("[Portal] Change password error:", err);
    return new Response(JSON.stringify({ error: "Something went wrong" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
