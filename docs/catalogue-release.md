# Premium garment catalogue — review release

18 October 2026. Feature scope: corporate Reve Stitching website only.

## Baseline and authorization

- Baseline main: `ab1a8a96a31978f7b0fdac6139e7bb782fc7abb4`.
- Existing GitHub Vercel status for that commit reports a completed deployment: `8kyzDyPYpNERTg5J8ps6ZtoXvrB9`. Direct production deployment/environment inspection is unavailable through the current Vercel team connection (403). Do not claim a live SHA has been independently established from this status alone.
- Owner confirmed every supplied asset is Reve-manufactured and approved for website use, including faithful processing, on 18 October 2026. This supersedes the audit's pending image-provenance classification. It does not substantiate prices, capacities, certifications or buyer outcome statistics.
- Production merge/deployment is not authorized. The historical chat-modernization branch was not merged.

## What changes

- Category-first product catalogue and all eight retained category routes;28 individually identified sample views, accessible native-dialog image viewer, URL-aware category filtering, sample-specific quotation/sample links and responsive imagery.
- Existing category IDs and historical calculator aliases normalize through `src/lib/catalogue/policy.ts`. Quote quantities remain enquiries rather than verified production MOQ. Existing API record shapes and operational integrations are retained; catalogue context is validated and stored through existing notes fields without a schema migration.
- Public price estimator is no longer imported; legacy calculator/pricing code is retained for future commercial review. No replacement prices, savings, review ratings or stock availability were invented.
- Related home photography, company copy, AQL explanation, quality/compliance pages, footer, desktop dropdown state and canonical/sitemap/robots metadata corrected. Unsubstantiated capacity, defect, certification, environmental and case-performance figures are withheld pending evidence. Former buyer case narratives are replaced by actual sample examples, not new invented outcomes.
- Chat knowledge is narrowed to public, neutral facts and the same qualified commercial approach; private operational/staff/family context is not used. Provider architecture is unchanged.

## Photography

See `catalogue-photography.md` and `catalogue-media-manifest.json`. 28 selected source views;77 responsive WebPs;2,673,938 bytes total. No source ZIP, PowerPoints or original photographs are published. Simple source-preserving brightness/contrast/sharpening and aspect-fit export retain real construction, graphics, silhouette, material appearance and source background. This does not claim to replace a controlled studio shoot. Six pilot before/after comparisons were visually checked privately; sample identity and artwork were retained. Native-resolution limits apply, especially to deck extracts. Different samples are labelled as separate examples.

## Review isolation

Vercel Preview requests are explicitly prevented from invoking APIs or accessing Admin/Portal. Public pages and client-side specification/validation can be reviewed without creating records or sending emails. Local `CATALOGUE_REVIEW_MODE=true` enables the same isolated public review build. Production ignores that local flag and retains normal API/auth behavior and environment validation.

No live database, mailbox, notifications, ERPNext endpoint or real buyer record was accessed or mutated. Production smoke submissions are not part of this review. Successful interface validation does not prove storage/email/ERP delivery.

## Verification

- Node test suite covers eight existing routes, all legacy keys, unknown IDs, sample/reference URL generation, valid enquiry quantities and malformed/unsafe inputs, preview isolation and all curated media records.
- Media processing validates actual decoding, dimensions, checksums and source-width caps.
- `npm run check` / `npm run build` use review mode without live service secrets. The baseline contains Astro hints; do not report hints as zero findings.
- Generated HTML/schema/robots checks validate all eight prerendered product routes, canonical host, image references and absence of ratings/stock offers/unrelated stock images.
- Browser widths, gallery interaction, image-failure/no-JS behavior, light/dark, keyboard and performance need recorded browser results on an accessible Preview; static source checks are not browser tests.
- Live form persistence, notifications and role/ownership regressions remain NOT VERIFIED until isolated service/account fixtures are provisioned. Existing operational authorization code was not replaced; this is not a penetration-test claim.

Run locally: `npm ci`, `node --experimental-strip-types --test tests/*.test.ts`, `CATALOGUE_REVIEW_MODE=true npm run check`, `CATALOGUE_REVIEW_MODE=true npm run build`.

## Outstanding business configuration

1. Approved bulk MOQ policy: per style/colour/material, size split, trial exceptions and effective date.
2. Sample fees/revisions/courier terms, response SLA and conditional production schedule.
3. Certificate/audit holder/site/scope/status and permitted public claims; test arrangements and process location/partner map.
4. Current capacity/machinery/output and any approved environmental metrics, named-client references and order case details.

Until confirmed, the public pages use neutral wording and tailored enquiry actions rather than unverified numerical guarantees.

## Launch and rollback

Before production approval: verify Preview commit; complete responsive/keyboard/theme/gallery tests; run the buyer→sample→quote journey and controlled isolated API/storage/notification tests; approve visual comparisons and remaining commercial copy. Record actual current production deployment/SHA through authorized Vercel access and confirm the established www redirect policy. No DNS/settings change is needed for this branch's canonical correction.

Production release requires a separate explicit owner decision. Build with production environment validation and normal integrations, not a copied review-mode static artifact. Keep the last good deployment and baseline commit. Roll back application code with a reviewed revert or authorized previous production deployment; do not force-push or mutate enquiry data. No database migration is required. Keep versioned catalogue assets matched to the chosen code release.
