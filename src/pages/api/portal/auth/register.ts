import type { APIRoute } from "astro";
import { getUserByEmail, createUser } from "../../../../lib/portal-auth";
import { checkRateLimit, getClientIp } from "../../../../lib/security";
import { isSameOriginRequest } from "../../../../lib/admin-operations";
import { z } from "zod";

const optionalText = (max: number) => z.preprocess(
  (value) => value === "" ? undefined : value,
  z.string().trim().max(max).optional(),
);
const registerSchema = z.object({
  name: z.string().trim().min(2).max(200),
  email: z.string().trim().email().max(254),
  password: z.string().min(8).max(128),
  company: optionalText(200),
  phone: optionalText(50),
}).strict();

export const POST: APIRoute = async ({ request }) => {
  if (!isSameOriginRequest(request)) {
    return new Response(JSON.stringify({ error: "Forbidden" }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    });
  }

  const ip = getClientIp(request);
  if (!checkRateLimit(ip, 5, 60 * 60_000)) {
    return new Response(JSON.stringify({ error: "Too many registration attempts. Try again later." }), {
      status: 429,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const parsed = registerSchema.safeParse(await request.json());
    if (!parsed.success) {
      return new Response(
        JSON.stringify({ error: "Invalid registration details" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }
    const { name, email, password, company, phone } = parsed.data;

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
      name,
      email: email.toLowerCase().trim(),
      password,
      company,
      phone,
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
