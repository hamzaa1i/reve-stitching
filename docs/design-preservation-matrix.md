# Original design preservation matrix

Corrective branch: `feat/catalogue-original-design-preserved`. Baseline: `ab1a8a96a31978f7b0fdac6139e7bb782fc7abb4`.

PR #11 / `150bafb6676a1329437cbd72aa03bb2fec12037e` is a rejected reference. It remains preserved and unmerged. No full cherry-pick, reset, history rewrite, production deployment or bulk image integration.

## Review boundary

Source structure checks are regression guards, not browser proof. Matched 1440/768/390px screenshots have not been produced in an available permitted browser context. Visual approval is blocked until those comparisons exist. Vercel Preview previously redirects to sign-in and the connector returns403 for qxcz1s-projects. The local managed environment has no control-browser skill. No claim of visual acceptance is made.

## Page-by-page matrix

| Route | Original sections, in order | Component hierarchy | Original behavior protected | Intended changes | Explicitly protected |
|---|---|---|---|---|---|
| /products | Products hero → Price calculator → products-heading → fabrics-heading → Call to action | Layout → original sections → ProductCard, PriceCalculator, WhatsAppWidget | data-animate, data-magnetic, data-tilt | Remove ratings/public estimates; qualify policy/specification claims; quote/sample links and truthful schema. Photography/gallery upgrade held for pilot approval. | Original hero, containers, typography, palette, section order, classes, animations and footer; no editorial framework. |
| /quality | Quality hero → AQL explained → Inspection process → Lab testing → Call to action | Layout → original sections →  | data-animate, data-magnetic | Necessary factual text corrections and bounded reliability fixes only; sample form context/labels or contact success wording where applicable. | Original hero, containers, typography, palette, section order, classes, animations and footer; no editorial framework. |
| /clients | Clients hero → global-heading → industries-heading → logos-heading → certs-heading → Key figures → Call to action | Layout → original sections →  | data-animate, data-magnetic | Necessary factual text corrections and bounded reliability fixes only; sample form context/labels or contact success wording where applicable. | Original hero, containers, typography, palette, section order, classes, animations and footer; no editorial framework. |
| /404 | section | Layout → original sections →  | Existing navigation and links | Necessary factual text corrections and bounded reliability fixes only; sample form context/labels or contact success wording where applicable. | Original hero, containers, typography, palette, section order, classes, animations and footer; no editorial framework. |
| / | hero → stats → case-studies → process → capabilities → products → clients → cta | Layout → original sections → WhatsAppWidget | data-animate, data-hero-buttons, data-hero-content, data-hero-deco, data-hero-entrance, data-hero-label, data-hero-line, data-hero-paragraph, data-hero-trust, data-magnetic, data-pinned-steps, data-step-panel, data-tilt | Necessary factual text corrections and bounded reliability fixes only; sample form context/labels or contact success wording where applicable. | Original hero, containers, typography, palette, section order, classes, animations and footer; no editorial framework. |
| /about | About hero → timeline → factory-heading → leadership-heading → certs-heading → quality-heading → tech-heading → Call to action | Layout → original sections →  | data-animate, data-magnetic, data-pinned-steps, data-stagger, data-step-panel, data-tilt | Necessary factual text corrections and bounded reliability fixes only; sample form context/labels or contact success wording where applicable. | Original hero, containers, typography, palette, section order, classes, animations and footer; no editorial framework. |
| /case-studies | Case studies hero → All case studies → Call to action | Layout → original sections →  | data-animate, data-magnetic | Necessary factual text corrections and bounded reliability fixes only; sample form context/labels or contact success wording where applicable. | Original hero, containers, typography, palette, section order, classes, animations and footer; no editorial framework. |
| /samples | Sample request hero → section | Layout → original sections → WhatsAppWidget | data-animate, data-magnetic | Necessary factual text corrections and bounded reliability fixes only; sample form context/labels or contact success wording where applicable. | Original hero, containers, typography, palette, section order, classes, animations and footer; no editorial framework. |
| /sustainability | Sustainability hero → Certifications → Our commitments → Supply chain → Call to action | Layout → original sections →  | data-animate, data-magnetic | Necessary factual text corrections and bounded reliability fixes only; sample form context/labels or contact success wording where applicable. | Original hero, containers, typography, palette, section order, classes, animations and footer; no editorial framework. |
| /quote | Trust signals → quote-faq-heading | Layout → original sections → QuoteWizard, WhatsAppWidget | data-animate | Necessary factual text corrections and bounded reliability fixes only; sample form context/labels or contact success wording where applicable. | Original hero, containers, typography, palette, section order, classes, animations and footer; no editorial framework. |
| /contact | Contact hero → form-heading → Location map → faq-heading → Call to action | Layout → original sections → WhatsAppWidget | data-animate, data-magnetic | Necessary factual text corrections and bounded reliability fixes only; sample form context/labels or contact success wording where applicable. | Original hero, containers, typography, palette, section order, classes, animations and footer; no editorial framework. |
| /products/[slug] | Product hero → Key specifications → Production process → Features → Fabric options → Call to action | Layout → original sections → WhatsAppWidget | data-animate, data-magnetic, data-stagger, data-tilt | Remove ratings/public estimates; qualify policy/specification claims; quote/sample links and truthful schema. Photography/gallery upgrade held for pilot approval. | Original hero, containers, typography, palette, section order, classes, animations and footer; no editorial framework. |

All eight category slugs remain: t-shirts, polo-shirts, hoodies, joggers, sweatshirts, ladies-wear, kids-wear, specialized-fabrics. The shared category template retains its original hero, specification cards, horizontal process, capabilities/gallery and CTA.

## Rejected implementation excluded

- Replacement Home/About/Quality/Sustainability/Clients/Case Studies pages and EditorialPage wrapper.
- New catalogue CSS, revised global spacing/layout language, replacement footer and rewritten data-driven product/card/gallery framework.
- Bulk publication/integration of new AI-edited photos before pilot approval.
- PR11 accidentally removed the original contact form; this recovery starts from original source and retains the complete form and its security fields.

## Bounded reuse

- Central category/legacy identifiers, enquiry quantity safety, quote prefill and URL context, API category/sample validation stored in existing notes fields.
- Preview isolation before API/Admin/Portal access; production environment guard unchanged.
- Quote wizard UI preserved while prices/MOQ promises are removed. Sample field labels and prefill added.
- Header aria-expanded/inert/Escape behavior; existing header layout retained.
- Correct canonical host/robots and Organization/service metadata; single scroll-to-top control.
- Chat UI/provider retained, unsupported public/private knowledge removed.

## Content changes within original structures

- Numeric capacity/output/turnaround cards now use qualified planning wording in their original positions; decorative counters for unverified figures are disabled.
- Homepage case cards remain three; detailed case cards remain six. Unsupported named outcomes are replaced with specification-review topics, not fabricated outcomes.
- About retains seven pinned timeline panels, full machinery/factory mosaic, three team cards, six compliance-topic cards, quality section and four digital-manufacturing cards. Unverified dated milestones after founding are labelled by development topic rather than invented chronology.
- Quality retains all five sections and five inspection steps, with correct lot/level/sample-size/acceptance-rejection explanation and no fixed2.5% sample-defect rule.
- Sustainability retains its nine scheme-reference cards, six pillars and supply-chain sections. Scheme guidance is explicitly not certification; unsupported percentage bars do not show fabricated progress.
- Existing stock product imagery is temporarily retained from main. It is not the completed authentic catalogue and must be replaced only after the six-image approval gate.

## Next phase — requires owner review

1. Obtain matched browser comparisons and correct any visual regressions.
2. Review all six original/proposal pairs; hold outputs with changed artwork, labels, garment edges or colour. Use source-preserving retouch where the model reconstructed details.
3. After approval, improve only Products and category details within the original component language, integrate selected authentic images, responsive media and accessible gallery behavior.
4. Verify mapping, refresh/back, themes, keyboard/touch and isolated integration delivery before any separate production decision.
