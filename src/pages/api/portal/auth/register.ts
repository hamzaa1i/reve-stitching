import type { APIRoute } from "astro";
import { getUserByEmail, createUser } from "../../../../lib/portal-auth";

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { name, email, password, company, phone } = body;

    if (!name || !email || !password) {
      return new Response(
        JSON.stringify({ error: "Name, email, and password are required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    if (password.length < 8) {
      return new Response(
        JSON.stringify({ error: "Password must be at least 8 characters" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    const existing = await getUserByEmail(email.toLowerCase().trim());
    if (existing) {
      return new Response(
        JSON.stringify({ error: "An account with this email already exists" }),
        {
          status: 409,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    await createUser({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      company: company?.trim() || undefined,
      phone: phone?.trim() || undefined,
      role: "client",
      status: "pending",
    });

    return new Response(
      JSON.stringify({
        message:
          "Account created successfully. Our team will review and activate your account within 24 hours.",
      }),
      {
        status: 201,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (err) {
    console.error("[Portal] Register error:", err);
    return new Response(
      JSON.stringify({ error: "Something went wrong. Please try again." }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
};
