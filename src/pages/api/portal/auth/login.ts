import type { APIRoute } from "astro";
import { getDb } from "../../../../db/index";
import { users } from "../../../../db/schema";
import { eq } from "drizzle-orm";
import {
  verifyPassword,
  createSession,
  getSessionCookieName,
  getSessionDuration,
} from "../../../../lib/portal-auth";

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return new Response(
        JSON.stringify({ error: "Email and password are required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    const db = getDb();
    const user = await db
      .select()
      .from(users)
      .where(eq(users.email, email.toLowerCase().trim()))
      .get();

    if (!user) {
      return new Response(
        JSON.stringify({ error: "Invalid email or password" }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid) {
      return new Response(
        JSON.stringify({ error: "Invalid email or password" }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    if (user.status === "pending") {
      return new Response(
        JSON.stringify({
          error:
            "Your account is pending approval. Our team will activate it shortly.",
        }),
        {
          status: 403,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    if (user.status === "suspended") {
      return new Response(
        JSON.stringify({
          error: "Your account has been suspended. Please contact our team.",
        }),
        {
          status: 403,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    const token = await createSession(user.id);

    cookies.set(getSessionCookieName(), token, {
      path: "/",
      httpOnly: true,
      secure: import.meta.env.PROD,
      sameSite: "lax",
      maxAge: getSessionDuration() / 1000,
    });

    return new Response(
      JSON.stringify({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          company: user.company,
          role: user.role,
        },
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (err) {
    console.error("[Portal] Login error:", err);
    return new Response(
      JSON.stringify({ error: "Something went wrong. Please try again." }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
};
