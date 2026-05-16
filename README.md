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
| Framework | [Astro 5](https://astro.build/) (SSR) |
| Styling | [Tailwind CSS](https://tailwindcss.com/) |
| Animation | [GSAP 3](https://greensock.com/gsap/) + [Lenis](https://lenis.darkroom.engineering/) |
| Database | [Supabase PostgreSQL](https://supabase.com/) |
| Email | [Resend](https://resend.com/) |
| AI | GitHub Models (GPT-4o) |
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

- Row Level Security (RLS) enabled on all Supabase tables
- Service-role-only database access via server-side API routes
- Rate limiting on public endpoints
- Input sanitization and email validation
- JWT-based admin authentication
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
- GitHub account (AI features)

---

## 📥 Installation

### Clone Repository

```bash
git clone https://github.com/hamzaa1i/reve-stitching.git
cd reve-stitching
```

### Install Dependencies

```bash
npm install
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
# ADMIN AUTHENTICATION
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ADMIN_JWT_SECRET=

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# AI (GitHub Models)
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
GITHUB_TOKEN=
GITHUB_MODEL=

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# EMAIL (RESEND)
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RESEND_API_KEY=
NOTIFICATION_EMAIL=

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# DISCORD NOTIFICATIONS
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DISCORD_WEBHOOK_URL=

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# WHATSAPP
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
WHATSAPP_DISPLAY_NAME=
PUBLIC_WHATSAPP_NUMBER=

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
| `contact_submissions` | Contact form submissions |

---

## 🔒 Security Model

All tables use **Row Level Security (RLS)** with deny-all policies enabled.

### Architecture Rules

- All database operations go through Astro API routes
- Only the `service_role` key can access the database
- No direct client-side Supabase queries
- Public anonymous access is blocked entirely

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
| Service-role-only DB access | All database actions run through Astro API routes using `service_role`. No direct client-side queries allowed. |
| Performance-adaptive animations | Hardware detection assigns `full`, `mid`, or `lite` animation tier based on CPU/memory capabilities. |
| Reduced-motion bail-out | If `prefers-reduced-motion: reduce` is active, GSAP and Lenis never initialize. |
| In-memory rate limiting | Lightweight `Map`-based limiter without Redis dependency. Suitable for current traffic scale. |

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
  <a href="https://wa.me/923329555786">
    +92 332 9555786
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