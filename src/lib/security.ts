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
//
// Fail-mode policy (post-fix June 2026):
//
//   Condition                                   | Return | Rationale
//   --------------------------------------------+--------+-----------------------------
//   secret missing (TURNSTILE_SECRET_KEY unset) | true   | dev/local skips bot check
//   token missing (client didn't send)          | false  | legitimate block (real bot)
//   Cloudflare explicitly rejected (success=false) | false | real bot protection
//   Network error / timeout / DNS / 5xx / parse | true   | don't block legit users on infra hiccup
//
// All return paths log via console.error so Vercel's log viewer captures them
// (Vercel appears to drop console.warn output by default — only info + error
// are surfaced in the dashboard).
// ═══════════════════════════════════════════════════

export async function verifyTurnstile(
  token: string | undefined
): Promise<boolean> {
  const secret = import.meta.env.TURNSTILE_SECRET_KEY;

  // Path 1: Turnstile not configured — skip verification (dev/local).
  if (!secret) {
    console.error('[Turnstile] FAIL-OPEN: TURNSTILE_SECRET_KEY not set — bot protection disabled.');
    return true;
  }

  // Path 2: No token provided by the client — fail CLOSED.
  // This is the legitimate "blocked" path: real bots don't render the widget.
  if (!token) {
    console.error('[Turnstile] FAIL-CLOSED: no cf_turnstile_response token in request body — rejecting.');
    return false;
  }

  try {
    const response = await fetch(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `secret=${encodeURIComponent(secret)}&response=${encodeURIComponent(token)}`,
        signal: AbortSignal.timeout(5_000),
      }
    );

    // Path 3: Non-2xx HTTP status from Cloudflare — treat as their infra problem.
    // Fail OPEN so we don't block legit users when Cloudflare is having an outage.
    if (!response.ok) {
      console.error(`[Turnstile] FAIL-OPEN: Cloudflare returned HTTP ${response.status} ${response.statusText}. Treating as infra outage — letting request through.`);
      return true;
    }

    let data: { success?: boolean; 'error-codes'?: string[] };
    try {
      data = await response.json();
    } catch (parseErr) {
      // Path 4: Response body isn't valid JSON — fail OPEN (treat as infra issue).
      console.error('[Turnstile] FAIL-OPEN: Cloudflare response was not valid JSON. Treating as infra outage — letting request through. Parse error:', parseErr instanceof Error ? parseErr.message : String(parseErr));
      return true;
    }

    // Path 5: Cloudflare explicitly rejected the token — fail CLOSED.
    // This is real bot protection: a token that Cloudflare verifies as invalid is blocked.
    if (data.success !== true) {
      console.error('[Turnstile] FAIL-CLOSED: Cloudflare rejected token. Error codes:', data['error-codes'] || 'unknown');
      return false;
    }

    // Path 6: Cloudflare verified the token — pass.
    return true;
  } catch (err) {
    // Path 7: Network error / timeout / DNS — fail OPEN with loud logging.
    // The previous C-023 behavior was fail-closed here, which blocked legit users
    // whenever Vercel serverless couldn't reach challenges.cloudflare.com.
    // We now fail OPEN on transport errors but fail CLOSED on explicit rejection.
    const errStr = err instanceof Error ? `${err.name}: ${err.message}` : String(err);
    console.error(`[Turnstile] FAIL-OPEN: network/transport error contacting Cloudflare — letting request through to avoid blocking legit users. Error: ${errStr}`);
    return true;
  }
}