/**
 * src/lib/utils.ts
 * Phase 4: Shared utility helpers — eliminates duplication across API routes.
 *
 * Previously, `json()`, `isValidEmail()`, `sanitizePhone()`, and `formatDate()`
 * were copy-pasted across 10+ files. This module is the single source of truth.
 */

// ─────────────────────────────────────────────────────────────────────────────
// JSON Response Helper
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Build a JSON Response with the standard Content-Type header.
 * Replaces the `function json(data, status)` copy-pasted across 10 API routes.
 */
export function json(data: object, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Email Validation
// ─────────────────────────────────────────────────────────────────────────────

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Validate an email address.
 * Replaces the duplicated `isValidEmail` in send-test-email.ts.
 * Uses the same regex as src/lib/security.ts but with a tighter TLD check (≥2 chars).
 */
export function isValidEmail(email: string): boolean {
  return EMAIL_REGEX.test(email.trim().toLowerCase());
}

// ─────────────────────────────────────────────────────────────────────────────
// Phone Sanitization
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Sanitize a phone number for storage — strip everything except digits and leading +.
 * Replaces the `sanitizePhone` helper duplicated across admin pages.
 */
export function sanitizePhone(phone: string): string {
  const trimmed = phone.trim();
  if (trimmed.startsWith('+')) {
    return '+' + trimmed.slice(1).replace(/[^0-9]/g, '');
  }
  return trimmed.replace(/[^0-9]/g, '');
}

// ─────────────────────────────────────────────────────────────────────────────
// Date Formatting
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Format an ISO date string for display (e.g. "Jun 26, 2026").
 * Replaces the `formatDate` helper duplicated across admin pages.
 */
export function formatDate(dateStr: string | Date, locale = 'en-US'): string {
  const date = typeof dateStr === 'string' ? new Date(dateStr) : dateStr;
  if (isNaN(date.getTime())) return '—';
  return date.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Format an ISO date string with time (e.g. "Jun 26, 2026, 2:30 PM").
 */
export function formatDateTime(dateStr: string | Date, locale = 'en-US'): string {
  const date = typeof dateStr === 'string' ? new Date(dateStr) : dateStr;
  if (isNaN(date.getTime())) return '—';
  return date.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

/**
 * Format a relative time (e.g. "2 hours ago", "3 days ago").
 */
export function formatRelativeTime(dateStr: string | Date): string {
  const date = typeof dateStr === 'string' ? new Date(dateStr) : dateStr;
  if (isNaN(date.getTime())) return '—';
  const now = Date.now();
  const diff = now - date.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return 'just now';
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  if (days < 30) return `${days} day${days === 1 ? '' : 's'} ago`;
  return formatDate(date);
}
