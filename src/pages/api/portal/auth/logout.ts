import type { APIRoute } from "astro";
import {
  deleteSession,
  getSessionCookieName,
} from "../../../../lib/portal-auth";

export const POST: APIRoute = async ({ cookies }) => {
  const token = cookies.get(getSessionCookieName())?.value;

  if (token) {
    try {
      await deleteSession(token);
    } catch {}
  }

  cookies.delete(getSessionCookieName(), { path: "/" });

  return new Response(JSON.stringify({ message: "Logged out" }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
