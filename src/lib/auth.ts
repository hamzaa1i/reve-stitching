// src/lib/auth.ts
// Centralized authentication — no external dependencies

import { createHmac, timingSafeEqual } from 'node:crypto';

// ── Configuration ──────────────────────────────────────────
const COOKIE_NAME = 'admin-token';
const TOKEN_EXPIRY_SECONDS = 7 * 24 * 60 * 60; // 7 days

export interface AdminPayload {
  sub: string;  // admin email
  iat: number;  // issued at (unix seconds)
  exp: number;  // expires at (unix seconds)
}

// ── Cookie Config (reuse everywhere) ───────────────────────
export const COOKIE_CONFIG = {
  name: COOKIE_NAME,
  options: {
    httpOnly: true,       // JS cannot read it (XSS protection)
    secure: true,         // HTTPS only
    sameSite: 'lax' as const,  // CSRF protection
    path: '/',            // Available on all routes
    maxAge: TOKEN_EXPIRY_SECONDS,
  },
};

// ── Create Token ───────────────────────────────────────────
export function createAdminToken(email: string): string {
  const secret = getSecret();

  const payload: AdminPayload = {
    sub: email,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + TOKEN_EXPIRY_SECONDS,
  };

  const data = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = createHmac('sha256', secret).update(data).digest('base64url');

  return `${data}.${signature}`;
}

// ── Verify Token ───────────────────────────────────────────
export function verifyAdminToken(token: string): AdminPayload | null {
  try {
    const secret = getSecret();
    const parts = token.split('.');
    if (parts.length !== 2) return null;

    const [data, signature] = parts;
    if (!data || !signature) return null;

    // Verify signature (timing-safe comparison)
    const expectedSig = createHmac('sha256', secret).update(data).digest('base64url');

    if (signature.length !== expectedSig.length) return null;
    if (!timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSig))) {
      return null;
    }

    // Decode and check expiry
    const payload: AdminPayload = JSON.parse(
      Buffer.from(data, 'base64url').toString()
    );

    if (payload.exp < Math.floor(Date.now() / 1000)) return null;

    return payload;
  } catch {
    return null;
  }
}

// ── Verify Login Credentials ───────────────────────────────
export function verifyCredentials(email: string, password: string): boolean {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    console.error('[Auth] ❌ ADMIN_EMAIL or ADMIN_PASSWORD not set');
    return false;
  }

  // Constant-time comparison (prevents timing attacks)
  const emailHash = createHmac('sha256', 'reve-email')
    .update(email.toLowerCase().trim())
    .digest('hex');
  const storedEmailHash = createHmac('sha256', 'reve-email')
    .update(adminEmail.toLowerCase().trim())
    .digest('hex');

  const pwHash = createHmac('sha256', 'reve-pw')
    .update(password)
    .digest('hex');
  const storedPwHash = createHmac('sha256', 'reve-pw')
    .update(adminPassword)
    .digest('hex');

  const emailMatch = timingSafeEqual(
    Buffer.from(emailHash),
    Buffer.from(storedEmailHash)
  );
  const pwMatch = timingSafeEqual(
    Buffer.from(pwHash),
    Buffer.from(storedPwHash)
  );

  return emailMatch && pwMatch;
}

// ── Helper for API routes ──────────────────────────────────
// Use this in any /api/admin/* endpoint to check auth
export function getAdminFromCookies(cookies: any): AdminPayload | null {
  const token = cookies.get(COOKIE_CONFIG.name)?.value;
  if (!token) return null;
  return verifyAdminToken(token);
}

// ── Private ────────────────────────────────────────────────
function getSecret(): string {
  const secret = process.env.ADMIN_JWT_SECRET;
  if (!secret) throw new Error('ADMIN_JWT_SECRET not configured');
  return secret;
}