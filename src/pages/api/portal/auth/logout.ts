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

  // Phase 2.2: Cookie delete must pass the EXACT same options used when setting it
  // (in login.ts). Browsers refuse to delete cookies when attributes mismatch —
  // the old session cookie would persist after logout on shared computers.
  cookies.delete(getSessionCookieName(), {
    path: "/",
    httpOnly: true,
    secure: import.meta.env.PROD,
    sameSite: "lax",
  });

  return new Response(JSON.stringify({ message: "Logged out" }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
