import type { APIRoute } from 'astro';
import {
  createAdminToken,
  verifyCredentials,
  COOKIE_CONFIG,
} from '../../../lib/auth';

export const prerender = false;

const attempts = new Map<string, { count: number; last: number }>();
const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 15 * 60 * 1000;

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';

    const record = attempts.get(ip);
    if (record && record.count >= MAX_ATTEMPTS) {
      const remaining = record.last + LOCKOUT_MS - Date.now();
      if (remaining > 0) {
        const mins = Math.ceil(remaining / 60000);
        return json({ error: `Too many attempts. Try again in ${mins} minutes.` }, 429);
      }
      attempts.delete(ip);
    }

    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return json({ error: 'Email and password are required.' }, 400);
    }

    if (!verifyCredentials(email, password)) {
      const current = attempts.get(ip) || { count: 0, last: 0 };
      attempts.set(ip, { count: current.count + 1, last: Date.now() });
      const left = MAX_ATTEMPTS - (current.count + 1);
      console.warn(`[Auth] Failed login: ${email} from ${ip}`);
      return json({
        error: left > 0
          ? `Invalid credentials. ${left} attempt${left === 1 ? '' : 's'} remaining.`
          : 'Account locked. Try again in 15 minutes.',
      }, 401);
    }

    const token = createAdminToken(email);
    cookies.set(COOKIE_CONFIG.name, token, COOKIE_CONFIG.options);
    attempts.delete(ip);

    console.log(`[Auth] Admin logged in: ${email}`);
    return json({ success: true });
  } catch (err) {
    console.error('[Auth] Login error:', err);
    return json({ error: 'Server error. Please try again.' }, 500);
  }
};

function json(data: object, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}