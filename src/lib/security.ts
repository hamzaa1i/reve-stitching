// ═══════════════════════════════════════════════════
// SECURITY UTILITIES
// Rate limiting, input sanitization, validation
// ═══════════════════════════════════════════════════

// ── Rate Limiting (in-memory, per-instance) ──
const rateLimits = new Map<string, number[]>();

export function checkRateLimit(
  ip: string,
  max = 5,
  windowMs = 60_000
): boolean {
  const now = Date.now();
  const windowStart = now - windowMs;

  // Prevent memory leak on long-running instances
  if (rateLimits.size > 10_000) {
    for (const [key, timestamps] of rateLimits) {
      const recent = timestamps.filter((t) => t > windowStart);
      if (recent.length === 0) rateLimits.delete(key);
    }
  }

  const attempts = rateLimits.get(ip) || [];
  const recent = attempts.filter((t) => t > windowStart);

  if (recent.length >= max) return false;

  recent.push(now);
  rateLimits.set(ip, recent);
  return true;
}

export function getClientIp(request: Request): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip')?.trim() ||
    'unknown'
  );
}

// ── Input Sanitization ──
const HTML_TAG_REGEX = /<[^>]*>/g;

export function sanitizeString(input: string): string {
  return input.replace(HTML_TAG_REGEX, '').trim();
}

// ── Email Validation ──
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(email: string): boolean {
  return EMAIL_REGEX.test(email.trim().toLowerCase());
}

// ── String Length Limits ──
export function truncate(input: string, maxLength: number): string {
  return input.length <= maxLength ? input : input.substring(0, maxLength);
}

// ═══════════════════════════════════════════════════
// HONEYPOT CHECK
// If a bot fills the hidden honeypot field, reject silently
// ═══════════════════════════════════════════════════

export function isHoneypotTriggered(body: Record<string, unknown>): boolean {
  // Common honeypot field names — must match the hidden fields in your forms
  const honeypotFields = ['website', 'url', 'company_website', 'hp_field'];
  return honeypotFields.some(
    (field) => body[field] && String(body[field]).trim().length > 0
  );
}

// ═══════════════════════════════════════════════════
// CLOUDFLARE TURNSTILE VERIFICATION
// ═══════════════════════════════════════════════════

export async function verifyTurnstile(
  token: string | undefined
): Promise<boolean> {
  const secret = import.meta.env.TURNSTILE_SECRET_KEY;

  // If Turnstile is not configured, skip verification
  if (!secret) return true;
  if (!token) return false;

  try {
    const response = await fetch(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `secret=${encodeURIComponent(secret)}&response=${encodeURIComponent(token)}`,
      }
    );

    const data = await response.json();
    return data.success === true;
  } catch (err) {
    console.error('[Turnstile] Verification failed:', err);
    // Fail open — don't block real users if Turnstile API is down
    return true;
  }
}