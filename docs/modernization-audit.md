# Reve Stitching Modernization Audit

Audit date: 2026-09-08
Working branch: `work/admin-operations-overhaul`
Audited baseline: `12393cd7f299bc5d28c2e1b4c72796853df38ceb`

## Scope and evidence

This audit covers the public Astro site, Admin portal, client portal, Astro API routes, Supabase access, Turso/Drizzle access, Resend email flows, AI integrations, Vercel configuration, repository assets, and the live unauthenticated website.

Production data was not changed. No database migration was applied. The repository does not include an authoritative Supabase schema or migration history, so schema-dependent features are explicitly separated from verified existing capabilities.

## System map

| Area | Current implementation | Primary storage/integration |
|---|---|---|
| Public corporate site | Astro pages with Tailwind, GSAP/Lenis, quote/sample/contact/chat widgets | Static/SSR |
| Admin authentication | HMAC-signed HttpOnly cookie checked by middleware and APIs | Environment credentials |
| Admin operations | Astro SSR pages and server API routes | Supabase service role |
| Quotes | Public wizard, file uploads, AI analysis, follow-up automation, ERPNext lead attempt | Supabase, GitHub Models, Resend, ERPNext |
| Contact submissions | Public contact and exit-intent capture | Supabase `contact_submissions` |
| Live chat | Visitor token ownership, polling, admin replies | Supabase `chat_sessions` / `chat_messages` |
| Samples | Public request and Admin status workflow | Supabase `sample_requests`, Resend |
| Client portal | Separate account/order/document/message application | Turso/libSQL via Drizzle |
| Monitoring | Sentry exception capture where called | Sentry |
| Deployment | Vercel SSR adapter and daily cron | Vercel |

## High-priority findings

### Admin operations

- Navigation exposed Dashboard, Quotes, Samples, and Email Templates only. Contacts and chat had no dedicated indexes.
- Dashboard contact/chat totals were calculated from lists capped at 50 records.
- Contact messages were truncated on the dashboard and had no full detail route.
- “System Online” was a static label rather than a health signal.
- Samples loaded an unbounded result set and exposed raw database error text.
- Opening a waiting chat changed it to active before an administrator responded.
- Admin pages used several mutually inconsistent visual/status patterns.

### Analytics and financial integrity

- Quote status logic mixed `won/lost/closed` with the actual application statuses `converted/rejected`.
- Average response time used generic `updated_at`, which is not a verified first-response timestamp.
- Pipeline code parsed the first number from an AI-generated price-range string and displayed it as dollars.
- The AI prompt describes the stored estimate as a per-unit range, while the dashboard treated it like an opportunity total.
- The public quote submission does not persist a structured quoted total and currency with historical conversion semantics.

The modernization therefore withholds financial pipeline value and response-time metrics. It reports only exact status counts and recorded conversion statuses. A future financial dashboard needs explicit amount, currency, and quote-issued fields.

### Security and reliability

- Admin authentication cookies are HttpOnly, Secure, and SameSite=Lax; service-role credentials remain server-side.
- State-changing Admin endpoints did not consistently reject cross-site requests.
- Several mutation endpoints accepted arbitrary status strings or coerced arbitrary values.
- Portal messaging allowed any authenticated portal user to address an arbitrary user and attach an arbitrary order ID.
- Portal order mutation endpoints accepted arbitrary update values and did not enforce sequential production-stage transitions.
- Portal account and remaining admin mutations lacked consistent strict payload validation and same-origin protection.
- Portal email HTML interpolated stored user content without output encoding.
- Quote Base64 uploads had no server-side decoded-size or file-count limits.
- The ERPNext quote integration referenced an undefined `aiSummary` variable, silently preventing intended lead data from being sent.
- Cron authentication accepted its secret in the query string, which can leak into logs/history.
- Very old quotes could receive all three follow-up stages in one cron run.
- In-memory rate limiting is per process and is not a reliable global limit on serverless infrastructure.

### Data and migrations

The application references Supabase objects including:

- `quote_requests`, `quote_stats`, and `get_full_dashboard_stats`
- `contact_submissions`
- `chat_sessions` and `chat_messages`
- `sample_requests`
- email template/settings tables and `email_log`

Their authoritative SQL definitions are absent. This blocks safe implementation of archived contacts, replied status/history, internal contact notes, durable admin activity, and trusted response-time analytics. Those additions require a reviewed migration based on an exported production schema.

No record was identified as test/demo data by string matching, and no data was deleted or excluded from analytics.

### Email and communication

- Contact forms and exit-intent records are website inquiries, not an inbound company mailbox.
- The application does not ingest inbound company email. The Admin must not be described as an email inbox.
- Current contact reply actions can open an administrator’s email client but cannot truthfully record a reply.
- The exit-intent endpoint records a “Capability Deck Request” but contains a TODO instead of actually delivering a deck.
- Template preview/test and automated follow-up flows exist, but depend on database objects not defined in the repository.

Recommended inbound-email architecture: use a verified provider’s inbound webhook, validate provider signatures, store normalized messages and immutable provider IDs server-side, strip unsafe HTML, scan attachments, deduplicate on provider ID, and link messages to contacts without exposing provider credentials to the browser. This should be a separate reviewed project.

### Client portal

- Admin and client roles are separate from the corporate Admin portal and must remain so.
- Client-scoped order/document list queries generally filter by `locals.user.id`.
- Cross-recipient portal messaging was a critical authorization gap and has been closed in this branch.
- Several portal pages swallow database exceptions and render empty states, which can disguise an outage.
- Drizzle tables include an audit log, but the audited routes do not consistently write it.
- Document URLs should be verified as short-lived or access-controlled before the portal is considered production-ready.
- The repository contains Drizzle schema declarations but no migration history for the portal database.

### Public site, accessibility, performance, and SEO

- Core live routes render on desktop without horizontal overflow or broken loaded images.
- Several page titles duplicated the site name because both page and layout added it.
- The default Open Graph image was a zero-byte file and the metadata used a relative URL.
- Fifteen zero-byte, unreferenced image placeholders were present.
- A skip link was missing.
- Search results surfaced an unexpected “Register | Reve Portal” title for a corporate-site query; portal routes should be reviewed for indexing controls and sitemap inclusion.
- Animated numeric content can expose initial zero values to crawlers before JavaScript runs.
- Public product imagery comes from Unsplash rather than owned product photography. Replacing it requires verified company assets, not generated customer/product evidence.
- Claims about customers, certifications, production metrics, defects, sustainability projects, and dated plans are extensive. They were not changed because business verification is outside repository evidence; management should validate them before publication.

## Implemented in this branch

- Operations-oriented Admin navigation with Overview, Sales, and Inbox & Communication sections.
- Paginated, searchable, sortable, date-filterable Contact Submissions inbox.
- Full contact detail route with complete message, exact timestamp, read/unread controls, copy-email, and explicit external email-app reply.
- Paginated/filterable Live Chat index and truthful waiting-to-active transition on first admin reply.
- Action-oriented dashboard with exact counts and filtered drill-down links.
- Consistent status badge and pagination components.
- Paginated, validated Samples index and stronger status-update validation/conflict handling.
- Same-origin checks and stricter schemas across state-changing Admin APIs.
- Daily follow-up documentation, header-only cron authentication, and one follow-up stage per quote per run.
- Portal recipient/order authorization and portal email output encoding.
- Quote request upload limits and ERPNext AI-summary bug fix.
- Portal order mutation schemas, same-origin checks, client validation, and sequential stage-transition enforcement.
- Strict validation, role/ownership checks, and same-origin protection for remaining portal account, client, quote, and message mutations.
- Valid Open Graph fallback, unique page titles, skip link, and zero-byte asset cleanup.
- Truthful capability-deck capture copy: the current endpoint records a request for staff follow-up; it does not claim automatic delivery.

## Schema-dependent follow-up

Do not apply these changes without first exporting and reviewing production DDL:

1. Add explicit contact `source`, `archived_at`, `replied_at`, and status constraints.
2. Add an append-only inquiry communication/history table with provider message IDs and actor identity.
3. Add structured quote amount, currency, issued-at, first-viewed-at, first-response-at, won-at, and lost-at fields.
4. Add durable admin activity/audit events for state transitions.
5. Add idempotency keys/unique constraints for email sends and sample status notifications.
6. Version and commit Supabase and Turso migrations, views, RPCs, and rollback scripts.

## Deployment and rollback

- No database migration is required for this branch.
- Verify all variables in `.env.example` in the deployment environment.
- Confirm Vercel continues to send `Authorization: Bearer <CRON_SECRET>` to the daily cron route.
- Run `npm ci`, `npm run check`, and `npm run build` before deployment.
- Deploy through the normal preview/PR workflow; do not deploy directly from this branch without review.
- Application rollback is a Git revert of the branch commits. No data rollback is needed because this branch does not alter production schema or data.
