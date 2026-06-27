/**
 * Environment variable validation — Phase 1 (Secret Hygiene) hotfix.
 *
 * Validates ALL required environment variables at build time (via astro.config.mjs)
 * and at runtime (when imported by API routes / libs). Throws a clear, descriptive
 * error listing every missing or invalid variable so the operator knows exactly
 * what to fix.
 *
 * Usage:
 *   import { env, validateEnv } from "../lib/env";
 *   validateEnv();           // throws on misconfiguration
 *   const url = env.SUPABASE_URL;
 *
 * OR (preferred) just import `env` — it is validated lazily on first access:
 *   import { env } from "../lib/env";
 *   const url = env.SUPABASE_URL;
 */

import { z } from "zod";

// ─────────────────────────────────────────────────────────────────────────────
// Schema
// ─────────────────────────────────────────────────────────────────────────────

const envSchema = z.object({
  // ── Supabase (public-facing lead capture: quotes, chat, contact, samples) ──
  SUPABASE_URL: z
    .string()
    .url("SUPABASE_URL must be a valid URL (e.g. https://xyz.supabase.co)"),
  SUPABASE_SERVICE_ROLE_KEY: z
    .string()
    .min(32, "SUPABASE_SERVICE_ROLE_KEY must be at least 32 chars (Supabase service role key)"),
  PUBLIC_SUPABASE_URL: z
    .string()
    .url("PUBLIC_SUPABASE_URL must be a valid URL"),
  PUBLIC_SUPABASE_ANON_KEY: z
    .string()
    .min(32, "PUBLIC_SUPABASE_ANON_KEY must be at least 32 chars (Supabase anon key)"),

  // ── Turso / libSQL (authenticated client portal: users, sessions, orders) ──
  TURSO_CONNECTION_URL: z
    .string()
    .min(1, "TURSO_CONNECTION_URL is required (e.g. libsql://reve-stitching.turso.io)"),
  TURSO_AUTH_TOKEN: z
    .string()
    .min(1, "TURSO_AUTH_TOKEN is required for cloud Turso instances (omit only for file: URLs)"),

  // ── Admin authentication (HMAC token for /admin/*) ──
  ADMIN_JWT_SECRET: z
    .string()
    .min(32, "ADMIN_JWT_SECRET must be at least 32 chars — generate with: node -e \"console.log(require('crypto').randomBytes(32).toString('hex'))\""),
  ADMIN_EMAIL: z
    .string()
    .email("ADMIN_EMAIL must be a valid email address"),
  ADMIN_PASSWORD: z
    .string()
    .min(12, "ADMIN_PASSWORD must be at least 12 chars"),

  // ── Portal authentication (JWT for /portal/* — client portal) ──
  JWT_SECRET: z
    .string()
    .min(32, "JWT_SECRET must be at least 32 chars — generate with: node -e \"console.log(require('crypto').randomBytes(32).toString('hex'))\""),

  // ── Initial admin password used by `npm run db:seed` ──
  PORTAL_ADMIN_PASSWORD: z
    .string()
    .min(12, "PORTAL_ADMIN_PASSWORD must be at least 12 chars (used by src/db/seed.ts)"),

  // ── AI (GitHub Models for quote analysis + chatbot) ──
  GITHUB_TOKEN: z
    .string()
    .min(20, "GITHUB_TOKEN must be a valid GitHub Personal Access Token (min 20 chars)"),

  // ── Email (Resend) ──
  RESEND_API_KEY: z
    .string()
    .min(20, "RESEND_API_KEY must be a valid Resend API key (starts with 're_')"),
  NOTIFICATION_EMAIL: z
    .string()
    .email("NOTIFICATION_EMAIL must be a valid email address (destination for contact/chat/quote/sample notifications)"),
  TEAM_EMAIL: z
    .string()
    .email("TEAM_EMAIL must be a valid email address (destination for admin reminder emails; can be same as NOTIFICATION_EMAIL)")
    .optional()
    .or(z.literal("")),

  // ── Discord ──
  DISCORD_WEBHOOK_URL: z
    .string()
    .url("DISCORD_WEBHOOK_URL must be a valid Discord webhook URL (https://discord.com/api/webhooks/...)"),

  // ── Cloudflare Turnstile (bot protection) ──
  TURNSTILE_SECRET_KEY: z
    .string()
    .min(20, "TURNSTILE_SECRET_KEY must be a valid Cloudflare Turnstile secret key (starts with '0x')"),
  PUBLIC_TURNSTILE_SITE_KEY: z
    .string()
    .min(20, "PUBLIC_TURNSTILE_SITE_KEY must be a valid Cloudflare Turnstile site key (starts with '0x')"),

  // ── Site ──
  SITE_URL: z
    .string()
    .url("SITE_URL must be a valid URL (e.g. https://revestitching.com)"),
  CRON_SECRET: z
    .string()
    .min(16, "CRON_SECRET must be at least 16 chars — generate with: node -e \"console.log(require('crypto').randomBytes(24).toString('hex'))\""),

  // ── ERPNext Integration (optional — leave blank to disable) ──
  ERPNEXT_URL: z
    .string()
    .url("ERPNEXT_URL must be a valid URL (e.g. https://erp.revestitching.com)")
    .optional()
    .or(z.literal("")),
  ERPNEXT_API_KEY: z
    .string()
    .optional()
    .or(z.literal("")),
  ERPNEXT_API_SECRET: z
    .string()
    .optional()
    .or(z.literal("")),
});

export type Env = z.infer<typeof envSchema>;

// Build a list of required keys (non-optional) for clearer error reporting.
// Zod v4 doesn't expose `requiredKeys` directly — derive from shape.
const REQUIRED_KEYS = Object.entries(envSchema.shape)
  .filter(([, def]) => !def.isOptional())
  .map(([k]) => k);

// ─────────────────────────────────────────────────────────────────────────────
// Loader — works in both Astro (import.meta.env) and Node (process.env)
// ─────────────────────────────────────────────────────────────────────────────

function loadEnv(): Record<string, string | undefined> {
  // In Astro/Vite context, import.meta.env contains PUBLIC_* and the rest at build time.
  // In pure Node (e.g. running src/db/seed.ts directly), process.env is the source of truth.
  // We merge both, preferring process.env (so runtime overrides work).
  const viteEnv: Record<string, string | undefined> = {};
  if (typeof import.meta !== "undefined" && (import.meta as any).env) {
    // Spread because import.meta.env is a Proxy in Vite — direct iteration misses keys.
    Object.assign(viteEnv, (import.meta as any).env);
  }
  const procEnv: Record<string, string | undefined> = {};
  if (typeof process !== "undefined" && process.env) {
    Object.assign(procEnv, process.env);
  }
  return { ...viteEnv, ...procEnv };
}

// ─────────────────────────────────────────────────────────────────────────────
// Validation entry point
// ─────────────────────────────────────────────────────────────────────────────

let _cachedEnv: Env | null = null;

/**
 * Validate the environment and return a typed object.
 * Throws a clear, multi-line error if any required variable is missing or invalid.
 *
 * Safe to call multiple times — result is cached.
 */
export function validateEnv(): Env {
  if (_cachedEnv) return _cachedEnv;

  const raw = loadEnv();
  const result = envSchema.safeParse(raw);

  if (!result.success) {
    const issues = result.error.issues.map((issue) => {
      const path = issue.path.join(".") || "(root)";
      return `  • ${path}: ${issue.message}`;
    });

    const missingCount = REQUIRED_KEYS.filter((k) => !raw[k]).length;

    const header =
      missingCount > 0
        ? `❌ Environment validation failed — ${missingCount} required env var(s) missing or invalid.\n\nDetails:\n${issues.join("\n")}\n\nSet these in your .env file (local) or Vercel project settings (production).\nSee .env.example for a complete template.`
        : `❌ Environment validation failed:\n\n${issues.join("\n")}`;

    throw new Error(header);
  }

  _cachedEnv = result.data;
  return _cachedEnv;
}

/**
 * Typed env object. Validates on first access and caches the result.
 *
 *   import { env } from "../lib/env";
 *   const url = env.SUPABASE_URL;   // typed as string
 */
export const env: Env = new Proxy({} as Env, {
  get(_target, prop: string) {
    return validateEnv()[prop as keyof Env];
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// Silent check — for use in astro.config.mjs (logs instead of throwing on
// `astro check`/dev server spin-up where some vars may legitimately be unset).
// Use `validateEnv()` for hard-fail behavior in API routes and at build time.
// ─────────────────────────────────────────────────────────────────────────────

export function checkEnvOrExit(): void {
  try {
    validateEnv();
    console.log("✅ Environment validation passed — all required vars present.");
  } catch (err) {
    console.error((err as Error).message);
    console.error("\nAborting. Fix the above and re-run.");
    process.exit(1);
  }
}
