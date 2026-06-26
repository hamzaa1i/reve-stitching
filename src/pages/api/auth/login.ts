import type { APIRoute } from 'astro';
import {
  createAdminToken,
  verifyCredentials,
  COOKIE_CONFIG,
} from '../../../lib/auth';
import {
  checkRateLimit,
  getClientIp,
  sanitizeString,
  isValidEmail,
} from '../../../lib/security';
import { json } from '../../../lib/utils';

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const ip = getClientIp(request);

    // Rate limit: 5 attempts per 15 minutes
    if (!checkRateLimit(ip, 5, 15 * 60_000)) {
      return json({ error: 'Too many attempts. Try again later.' }, 429);
    }

    let body: { email?: string; password?: string };
    try {
      body = await request.json();
    } catch {
      return json({ error: 'Invalid request body.' }, 400);
    }

    const { email, password } = body;

    if (!email || !password) {
      return json({ error: 'Email and password are required.' }, 400);
    }

    const cleanEmail = sanitizeString(email).toLowerCase();

    if (!isValidEmail(cleanEmail)) {
      return json({ error: 'Please provide a valid email address.' }, 400);
    }

    if (password.length > 200) {
      return json({ error: 'Invalid credentials.' }, 401);
    }

    if (!verifyCredentials(cleanEmail, password)) {
      console.warn(`[Auth] Failed login from ${ip}`);
      return json({ error: 'Invalid credentials.' }, 401);
    }

    const token = createAdminToken(cleanEmail);
    cookies.set(COOKIE_CONFIG.name, token, COOKIE_CONFIG.options);

    console.log(`[Auth] Admin logged in from ${ip}`);
    return json({ success: true });
  } catch (err) {
    console.error('[Auth] Login error:', err);
    return json({ error: 'Server error. Please try again.' }, 500);
  }
};
