import { verifyCredentials, createAdminToken, COOKIE_CONFIG } from './auth_BQ4oAavg.mjs';
import { g as getClientIp, c as checkRateLimit, s as sanitizeString, i as isValidEmail } from './security_Bv8llNtS.mjs';

const prerender = false;
const POST = async ({ request, cookies }) => {
  try {
    const ip = getClientIp(request);
    if (!checkRateLimit(ip, 5, 15 * 6e4)) {
      return json({ error: "Too many attempts. Try again later." }, 429);
    }
    let body;
    try {
      body = await request.json();
    } catch {
      return json({ error: "Invalid request body." }, 400);
    }
    const { email, password } = body;
    if (!email || !password) {
      return json({ error: "Email and password are required." }, 400);
    }
    const cleanEmail = sanitizeString(email).toLowerCase();
    if (!isValidEmail(cleanEmail)) {
      return json({ error: "Please provide a valid email address." }, 400);
    }
    if (password.length > 200) {
      return json({ error: "Invalid credentials." }, 401);
    }
    if (!verifyCredentials(cleanEmail, password)) {
      console.warn(`[Auth] Failed login from ${ip}`);
      return json({ error: "Invalid credentials." }, 401);
    }
    const token = createAdminToken(cleanEmail);
    cookies.set(COOKIE_CONFIG.name, token, COOKIE_CONFIG.options);
    console.log(`[Auth] Admin logged in from ${ip}`);
    return json({ success: true });
  } catch (err) {
    console.error("[Auth] Login error:", err);
    return json({ error: "Server error. Please try again." }, 500);
  }
};
function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" }
  });
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
