// src/lib/auth.ts
// Centralized admin authentication — zero external dependencies

import { createHmac } from 'crypto';

// ── Configuration ──
const COOKIE_NAME = 'admin-token';
const TOKEN_EXPIRY_SECONDS = 7 * 24 * 60 * 60; // 7 days

export interface AdminPayload {
  sub: string;
  iat: number;
  exp: number;
}

export const COOKIE_CONFIG = {
  name: COOKIE_NAME,
  options: {
    httpOnly: true,
    secure: true,
    sameSite: 'lax' as const,
    path: '/',
    maxAge: TOKEN_EXPIRY_SECONDS,
  },
};

// ── Timing-safe comparison ──
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

// ── HMAC helper ──
function hmac(secret: string, data: string): string {
  return createHmac('sha256', secret).update(data).digest('base64url');
}

// ── Create Token ──
export function createAdminToken(email: string): string {
  const secret = getSecret();

  const payload: AdminPayload = {
    sub: email,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + TOKEN_EXPIRY_SECONDS,
  };

  const data = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = hmac(secret, data);

  return `${data}.${signature}`;
}

// ── Verify Token ──
export function verifyAdminToken(token: string): AdminPayload | null {
  try {
    const secret = getSecret();
    const dotIndex = token.indexOf('.');
    if (dotIndex === -1) {
      console.warn('[Auth] Token has no dot separator');
      return null;
    }

    const data = token.substring(0, dotIndex);
    const signature = token.substring(dotIndex + 1);

    if (!data || !signature) {
      console.warn('[Auth] Token missing data or signature');
      return null;
    }

    const expectedSig = hmac(secret, data);

    if (!safeEqual(signature, expectedSig)) {
      console.warn('[Auth] Token signature mismatch');
      return null;
    }

    const payload: AdminPayload = JSON.parse(
      Buffer.from(data, 'base64url').toString()
    );

    if (payload.exp < Math.floor(Date.now() / 1000)) {
      console.warn('[Auth] Token expired');
      return null;
    }

    return payload;
  } catch (err) {
    console.error('[Auth] Token verification error:', err);
    return null;
  }
}

// ── Verify Login Credentials ──
export function verifyCredentials(email: string, password: string): boolean {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    console.error('[Auth] ADMIN_EMAIL or ADMIN_PASSWORD not set in env vars');
    return false;
  }

  const emailMatch = safeEqual(
    hmac('reve-email', email.toLowerCase().trim()),
    hmac('reve-email', adminEmail.toLowerCase().trim())
  );

  const pwMatch = safeEqual(
    hmac('reve-pw', password),
    hmac('reve-pw', adminPassword)
  );

  return emailMatch && pwMatch;
}

// ── Helper for API routes ──
export function getAdminFromCookies(cookies: any): AdminPayload | null {
  const token = cookies.get(COOKIE_CONFIG.name)?.value;
  if (!token) return null;
  return verifyAdminToken(token);
}

// ── Private ──
function getSecret(): string {
  const secret = process.env.ADMIN_JWT_SECRET;
  if (!secret) {
    throw new Error('ADMIN_JWT_SECRET not configured in environment variables');
  }
  return secret;
}