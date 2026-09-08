export const CONTACT_STATUSES = ['new', 'read'] as const;
export const CHAT_STATUSES = ['waiting', 'active', 'closed'] as const;

export type ContactStatus = (typeof CONTACT_STATUSES)[number];
export type ChatStatus = (typeof CHAT_STATUSES)[number];

export function parsePositiveInt(value: string | null, fallback: number, max = 10_000): number {
  const parsed = Number.parseInt(value || '', 10);
  if (!Number.isFinite(parsed) || parsed < 1) return fallback;
  return Math.min(parsed, max);
}

/**
 * PostgREST's `.or()` syntax is a small query language. Strip its control
 * characters before embedding a user-entered search term in that expression.
 */
export function sanitizePostgrestSearch(value: string, maxLength = 120): string {
  return value
    .trim()
    .slice(0, maxLength)
    .replace(/[(),.%_*'"\\]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function formatAdminDateTime(value: string | null | undefined): string {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function formatAge(value: string | null | undefined, now = Date.now()): string {
  if (!value) return '—';
  const timestamp = new Date(value).getTime();
  if (!Number.isFinite(timestamp)) return '—';

  const minutes = Math.max(0, Math.floor((now - timestamp) / 60_000));
  if (minutes < 60) return `${minutes} min`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hr`;

  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;
  return remainingHours > 0 ? `${days}d ${remainingHours}h` : `${days}d`;
}

export function urgencyClass(value: string | null | undefined): string {
  if (!value) return 'text-slate-500';
  const ageHours = Math.max(0, (Date.now() - new Date(value).getTime()) / 3_600_000);
  if (ageHours >= 72) return 'text-red-700';
  if (ageHours >= 24) return 'text-amber-700';
  return 'text-slate-600';
}

/**
 * Cookie-authenticated mutations are allowed only from this deployment's
 * origin. Sec-Fetch-Site is checked as defense in depth for browsers that omit
 * Origin on some requests.
 */
export function isSameOriginRequest(request: Request): boolean {
  const expectedOrigin = new URL(request.url).origin;
  const origin = request.headers.get('origin');
  if (origin && origin !== expectedOrigin) return false;

  const fetchSite = request.headers.get('sec-fetch-site');
  if (fetchSite && !['same-origin', 'same-site', 'none'].includes(fetchSite)) return false;

  return true;
}

