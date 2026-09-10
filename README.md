# 🧵 Reve Stitching — Official Website

<p align="center">
  The corporate website and client portal for
  <strong>Reve Stitching (Pvt.) Ltd.</strong>,
  a 100% export-oriented knitted garment manufacturer based in Faisalabad, Pakistan.
</p>

<p align="center">
  🌐 <strong>Live:</strong>
  <a href="https://revestitching.com">revestitching.com</a>
</p>

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Astro 6](https://astro.build/) (SSR) |
| Styling | [Tailwind CSS](https://tailwindcss.com/) |
| Animation | [GSAP 3](https://greensock.com/gsap/) + [Lenis](https://lenis.darkroom.engineering/) |
| Database | [Supabase PostgreSQL](https://supabase.com/) |
| Email | [Resend](https://resend.com/) |
| AI | Gemini Developer API Free Tier (`gemini-3.7-flash`) |
| Hosting | [Vercel](https://vercel.com/) |
| Notifications | Discord Webhooks |

---

## ✨ Features

### 🧑‍💼 Buyer-Facing

- Product catalog with 8 garment categories and detailed specifications
- Instant price calculator with dual currency support (USD/GBP)
- Auto-currency detection based on visitor region
- 5-step guided quote wizard with file uploads
- AI-powered quote analysis and recommendations
- AI chatbot with human handoff support
- WhatsApp click-to-chat integration

### 🛡️ Admin Panel

- Dashboard with quote analytics and conversion funnel
- Geographic inquiry tracking
- Quote management pipeline with AI-generated insights
- Contact submission management
- Live chat session handling
- Email template editor with live preview
- Automated follow-up email workflows

### 🤖 AI Capabilities

- Automatic quote summarization
- AI-generated price estimation
- Tech pack analysis from uploaded files/images
- Missing information detection
- Action item generation for sales staff
- 24/7 chatbot for common buyer questions

### 🔐 Security

- Server-side Supabase access; production RLS policies must be verified from an exported schema
- Service-role-only database access via server-side API routes
- Rate limiting on public endpoints
- Input sanitization and email validation
- HMAC-signed Admin authentication cookie and separate client-portal sessions
- Lockout protection for repeated failed logins
- Security headers:
  - `X-Frame-Options`
  - `X-Content-Type-Options`
  - `Referrer-Policy`
  - `Content-Security-Policy`

### ♿ Accessibility

- Full `prefers-reduced-motion` support
- No-JS fallback using `<noscript>` styles
- Keyboard navigation support
- Focus-visible indicators
- Performance-adaptive animation system (`full`, `mid`, `lite`)

---

## 🚦 Getting Started

### 📋 Prerequisites

- Node.js 18+
- npm
- Supabase account
- Resend account
- Google AI Studio Free Tier project and API key (AI features; billing disabled)

---

## 📥 Installation

### Clone Repository

```bash
git clone https://github.com/hamzaa1i/reve-stitching.git
cd reve-stitching
```

### Install Dependencies

```bash
npm ci
```

---

## 🔐 Environment Variables

Create a `.env` file in the project root:

```env
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# SUPABASE
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
PUBLIC_SUPABASE_URL=
PUBLIC_SUPABASE_ANON_KEY=

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# TURSO / LIBSQL (Client Portal Database)
# Required for authenticated portal (users, sessions, orders, messages, documents)
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TURSO_CONNECTION_URL=          # e.g. libsql://reve-stitching.turso.io (required)
TURSO_AUTH_TOKEN=              # Turso auth token (required for cloud; omit for local file: URLs)

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# ADMIN AUTHENTICATION
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ADMIN_JWT_SECRET=              # Secret for admin HMAC token signing (used by /admin/*)
ADMIN_EMAIL=                   # Admin login email (used by lib/auth.ts verifyCredentials)
ADMIN_PASSWORD=                # Admin login password (plaintext in env; rotate regularly)
PORTAL_ADMIN_PASSWORD=         # Initial admin password for `npm run db:seed` (required, min 12 chars)

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# PORTAL AUTHENTICATION (JWT)
# Required for client portal session tokens
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
JWT_SECRET=                    # Generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))" (required, min 32 chars)

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# AI (Gemini Developer API Free Tier)
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
GEMINI_API_KEY=                # Required server-only key from a Free Tier project

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# EMAIL (RESEND)
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RESEND_API_KEY=
NOTIFICATION_EMAIL=            # Destination for contact, chat, quote, sample notifications (required)
TEAM_EMAIL=                    # Destination for admin reminder emails (required; can be same as NOTIFICATION_EMAIL)

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# DISCORD NOTIFICATIONS
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DISCORD_WEBHOOK_URL=

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# CLOUDFLARE TURNSTILE (Bot Protection)
# Required for public form endpoints (/api/contact, /api/quote/submit, /api/samples/submit)
# Get keys at https://dash.cloudflare.com/?to=/:account/turnstile
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TURNSTILE_SECRET_KEY=          # Server-side verification secret (required for bot protection)
PUBLIC_TURNSTILE_SITE_KEY=     # Client-side site key (required; rendered in contact/quote/samples forms)

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# WHATSAPP
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
WHATSAPP_DISPLAY_NAME=
PUBLIC_WHATSAPP_NUMBER=

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# ANALYTICS (Optional)
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PUBLIC_UMAMI_WEBSITE_ID=       # Optional — Umami analytics website ID
SENTRY_DSN=                    # Optional — Sentry error tracking DSN

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# SITE
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SITE_URL=
CRON_SECRET=
```

---

## 🧪 Development

```bash
npm run dev       # Start dev server at localhost:4321
npm run build     # Build production bundle
npm run check     # Run Astro and TypeScript diagnostics
npm run preview   # Preview production build locally
```

---

## 🗄️ Database Setup

Run the required SQL statements in the Supabase SQL Editor.

### 📦 Tables

| Table | Purpose |
|---|---|
| `quote_requests` | Quote submissions with AI analysis |
| `chat_sessions` | Live chat session data |
| `chat_messages` | Live chat message history |
| `contact_submissions` | Contact form submissions |
| `sample_requests` | Physical sample request workflow |
| `email_log` | Automated follow-up delivery attempts |

---

## 🔒 Security Model

Supabase tables are intended to use deny-by-default Row Level Security and are accessed by server-side routes with the service role. The separate client portal uses Turso/libSQL with application-enforced authorization, not Supabase RLS.

> The repository does not currently contain the authoritative Supabase migrations, views, RPC definitions, or RLS policies. Export and review the production schema before adding fields or applying database changes. Do not infer production constraints from TypeScript alone.

### Architecture Rules

- Supabase operations run only in Astro server pages and API routes
- The Supabase `service_role` key remains server-only
- No direct client-side Supabase queries
- Public forms are mediated by validated server routes

### Relevant Files

```text
src/lib/supabase.ts
src/lib/security.ts
src/lib/auth.ts
```

---

## 📂 Project Structure

```text
src/
├── components/
│   └── admin/
│
├── layouts/
│   ├── Layout.astro
│   └── AdminLayout.astro
│
├── lib/
│   ├── supabase.ts
│   ├── security.ts
│   ├── auth.ts
│   ├── pricing.ts
│   ├── notifications.ts
│   ├── analytics.ts
│   ├── email-templates/
│   ├── services/
│   └── types/
│
├── pages/
│   ├── index.astro
│   ├── about.astro
│   ├── products.astro
│   ├── clients.astro
│   ├── contact.astro
│   ├── quote.astro
│   ├── admin/
│   └── api/
│       ├── contact.ts
│       ├── quote/
│       ├── chat/
│       ├── auth/
│       ├── admin/
│       ├── samples/
│       └── cron/
│
├── scripts/
│   └── animations.js
│
├── styles/
│   └── global.css
│
└── middleware.ts
```

---

## 🚀 Deployment

<p align="center">
  Deployed on <strong>Vercel</strong> with automatic deployments on push to <code>main</code>.
</p>

### Push Changes

```bash
git add .
git commit -m "your message"
git push
```

### Environment Variables

Configured inside the Vercel Dashboard.

### Cron Jobs

A scheduled cron job runs daily at:

```text
9:00 AM UTC
```

to send automated follow-up emails for pending quotes.

---

## 🏗️ Architecture Decisions

| Decision | Rationale |
|---|---|
| Server-only Supabase access | Astro SSR pages and API routes use `service_role`; no browser bundle receives the key. |
| Performance-adaptive animations | Hardware detection assigns `full`, `mid`, or `lite` animation tier based on CPU/memory capabilities. |
| Reduced-motion bail-out | If `prefers-reduced-motion: reduce` is active, GSAP and Lenis never initialize. |
| In-memory rate limiting | Best-effort per-instance protection only. A shared durable limiter is recommended before treating limits as globally enforced on serverless deployments. |
| Zero-cost AI | All AI features use `gemini-3.7-flash` through the standard Gemini Developer API Free Tier. No grounding, retries, paid tier, or fallback provider is configured. Quota/provider failures degrade to deterministic fallback behavior and chat keeps human handoff available. |

`GITHUB_TOKEN` and `GITHUB_MODEL` are no longer used. After deploying this version, they may be removed from Vercel if no external deployment process depends on them.

Model and cost status were verified against Google's official [Gemini 3.7 Flash model page](https://ai.google.dev/gemini-api/docs/models/gemini-3.7-flash), [Gemini Developer API pricing](https://ai.google.dev/gemini-api/docs/pricing), and [billing guide](https://ai.google.dev/gemini-api/docs/billing) on 2026-09-10. Production must use an API key from a Free Tier project with billing disabled; there is no code-level paid fallback.

---

## 📬 Contact

<p align="center">
  <strong>Reve Stitching (Pvt.) Ltd.</strong>
</p>

<p align="center">
  📍 Chak No. 196/R.B, Ghona Road,<br>
  Faisalabad 38000, Pakistan
</p>

<p align="center">
  📧 Email:
  <a href="mailto:info@revestitching.com">
    info@revestitching.com
  </a>
</p>

<p align="center">
  📞 Phone:
  <a href="tel:+92418548041">
    +92 41 8548041
  </a>
</p>

<p align="center">
  💬 WhatsApp:
  <a href="https://wa.me/92418548041">
    +92 41 8548041
  </a>
</p>

<p align="center">
  🌐 Website:
  <a href="https://revestitching.com">
    revestitching.com
  </a>
</p>
 
---

<p align="center">
  Built by <strong><a href="https://hamzaalidev.vercel.app">Hamza Ali</a></strong>
</p>

<p align="center">
  © 2026 Reve Stitching (Pvt.) Ltd. All rights reserved.
</p>
