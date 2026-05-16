import { q as quoteDetailsBox, e as emailButton, a as emailLayout } from './_layout_DBrGWFJB.mjs';
import { a as getTemplateContent, b as buildVars, r as replaceVars, T as TEMPLATE_DEFAULTS } from './template-storage_Dbz2aNJw.mjs';

async function generateQuoteUnderReviewEmail(quote, brandingOverride, contentOverride) {
  const saved = contentOverride !== void 0 ? contentOverride : await getTemplateContent("24h");
  const defaults = TEMPLATE_DEFAULTS["24h"];
  const vars = buildVars(quote);
  const subject = replaceVars(saved?.subject || defaults.subject, vars);
  const greeting = replaceVars(saved?.greeting || defaults.greeting, vars);
  const mainBody = replaceVars(saved?.main_body || defaults.main_body, vars);
  const ctaText = replaceVars(saved?.cta_text || defaults.cta_text, vars);
  const footerNote = replaceVars(saved?.footer_note || defaults.footer_note, vars);
  const firstName = vars.first_name;
  const body = `
    <!-- Greeting -->
    <h2 style="margin:0 0 8px;font-size:20px;color:#18181b;font-weight:bold;">
      Hi ${firstName},
    </h2>
    <p style="margin:0 0 20px;font-size:15px;color:#52525b;line-height:1.6;">
      ${greeting}
    </p>

    <!-- Status Indicator -->
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin:0 0 24px;">
      <tr>
        <td style="padding:16px 20px;background-color:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;">
          <table role="presentation" cellpadding="0" cellspacing="0">
            <tr>
              <td style="vertical-align:middle;padding-right:12px;">
                <div style="width:32px;height:32px;background-color:#166534;border-radius:50%;text-align:center;line-height:32px;">
                  <span style="color:#ffffff;font-size:16px;">&#10003;</span>
                </div>
              </td>
              <td style="vertical-align:middle;">
                <p style="margin:0;font-size:14px;font-weight:bold;color:#166534;">Quote Under Review</p>
                <p style="margin:2px 0 0;font-size:12px;color:#15803d;">
                  Our team is evaluating your requirements
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <!-- Quote Details -->
    <p style="margin:0 0 12px;font-size:13px;font-weight:bold;color:#18181b;text-transform:uppercase;letter-spacing:0.5px;">
      Your Quote Summary
    </p>
    ${quoteDetailsBox([
    { label: "Reference", value: quote.reference_number },
    { label: "Company", value: quote.company_name },
    { label: "Product", value: quote.product_type },
    { label: "Quantity", value: `${quote.quantity.toLocaleString()} pcs` },
    ...quote.estimated_price_range ? [{ label: "Est. Range", value: quote.estimated_price_range }] : []
  ])}

    <!-- What happens next -->
    <h3 style="margin:28px 0 12px;font-size:16px;color:#18181b;font-weight:bold;">
      What Happens Next?
    </h3>
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
      <tr>
        <td style="padding:8px 0;vertical-align:top;width:28px;">
          <span style="display:inline-block;width:22px;height:22px;background-color:#166534;color:#fff;border-radius:50%;text-align:center;line-height:22px;font-size:11px;font-weight:bold;">1</span>
        </td>
        <td style="padding:8px 0 8px 8px;font-size:14px;color:#52525b;line-height:1.5;">
          <strong style="color:#18181b;">Technical Review</strong> — Our team assesses fabric, construction, and production feasibility.
        </td>
      </tr>
      <tr>
        <td style="padding:8px 0;vertical-align:top;width:28px;">
          <span style="display:inline-block;width:22px;height:22px;background-color:#166534;color:#fff;border-radius:50%;text-align:center;line-height:22px;font-size:11px;font-weight:bold;">2</span>
        </td>
        <td style="padding:8px 0 8px 8px;font-size:14px;color:#52525b;line-height:1.5;">
          <strong style="color:#18181b;">Pricing Calculation</strong> — We prepare a detailed cost breakdown based on your specifications.
        </td>
      </tr>
      <tr>
        <td style="padding:8px 0;vertical-align:top;width:28px;">
          <span style="display:inline-block;width:22px;height:22px;background-color:#166534;color:#fff;border-radius:50%;text-align:center;line-height:22px;font-size:11px;font-weight:bold;">3</span>
        </td>
        <td style="padding:8px 0 8px 8px;font-size:14px;color:#52525b;line-height:1.5;">
          <strong style="color:#18181b;">Formal Quotation</strong> — You receive a complete quote with pricing, lead times, and payment terms.
        </td>
      </tr>
    </table>

    <p style="margin:24px 0 0;font-size:14px;color:#52525b;line-height:1.6;">
      ${mainBody}
    </p>

    <!-- WhatsApp CTA -->
    ${emailButton(ctaText, "https://wa.me/923329555786?text=Hi%2C%20I%20submitted%20quote%20" + encodeURIComponent(quote.reference_number) + "%20and%20wanted%20to%20follow%20up.")}

    ${footerNote ? `<p style="margin:24px 0 0;font-size:13px;color:#a1a1aa;text-align:center;">${footerNote}</p>` : ""}
  `;
  const html = await emailLayout(
    body,
    {
      previewText: `We're reviewing your quote ${quote.reference_number} for ${quote.quantity.toLocaleString()} ${quote.product_type}. You'll hear back within 48 hours.`
    },
    brandingOverride
  );
  return { subject, html };
}

async function generateAdminReminderEmail(quote, brandingOverride, contentOverride) {
  const saved = contentOverride !== void 0 ? contentOverride : await getTemplateContent("48h");
  const defaults = TEMPLATE_DEFAULTS["48h"];
  const vars = buildVars(quote);
  const hoursSince = 48;
  const adminUrl = `https://revestitching.com/admin/quote/${quote.reference_number}`;
  const subject = replaceVars(saved?.subject || defaults.subject, vars);
  const greeting = replaceVars(saved?.greeting || defaults.greeting, vars);
  const mainBody = replaceVars(saved?.main_body || defaults.main_body, vars);
  const ctaText = replaceVars(saved?.cta_text || defaults.cta_text, vars);
  const statsLines = mainBody.split(/[.\n]/).filter((s) => s.trim().length > 5);
  const body = `
    <!-- Alert Banner -->
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin:0 0 24px;">
      <tr>
        <td style="padding:16px 20px;background-color:#fef2f2;border:1px solid #fecaca;border-radius:8px;">
          <table role="presentation" cellpadding="0" cellspacing="0">
            <tr>
              <td style="vertical-align:middle;padding-right:12px;">
                <div style="width:32px;height:32px;background-color:#dc2626;border-radius:50%;text-align:center;line-height:32px;">
                  <span style="color:#ffffff;font-size:18px;font-weight:bold;">!</span>
                </div>
              </td>
              <td style="vertical-align:middle;">
                <p style="margin:0;font-size:15px;font-weight:bold;color:#dc2626;">
                  Quote Pending for ${hoursSince}+ Hours
                </p>
                <p style="margin:4px 0 0;font-size:13px;color:#991b1b;">
                  ${greeting}
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <!-- Quote Details -->
    ${quoteDetailsBox([
    { label: "Reference", value: quote.reference_number },
    { label: "Buyer", value: `${quote.contact_person} (${quote.company_name})` },
    { label: "Email", value: quote.email },
    { label: "Product", value: quote.product_type },
    { label: "Quantity", value: `${quote.quantity.toLocaleString()} pcs` },
    ...quote.estimated_price_range ? [{ label: "Est. Value", value: quote.estimated_price_range }] : []
  ])}

    <!-- Why This Matters -->
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin:24px 0;">
      <tr>
        <td style="padding:16px 20px;background-color:#fffbeb;border:1px solid #fde68a;border-radius:8px;">
          <p style="margin:0 0 8px;font-size:13px;font-weight:bold;color:#92400e;">
            Why response time matters:
          </p>
          <ul style="margin:0;padding:0 0 0 20px;font-size:13px;color:#78350f;line-height:1.8;">
            ${statsLines.map((line) => `<li>${line.trim()}</li>`).join("")}
          </ul>
        </td>
      </tr>
    </table>

    <!-- CTA -->
    ${emailButton(ctaText, adminUrl)}

    <!-- Quick Actions -->
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin:24px 0 0;">
      <tr>
        <td style="text-align:center;">
          <p style="margin:0 0 8px;font-size:12px;color:#a1a1aa;">Quick actions:</p>
          <a href="mailto:${quote.email}?subject=Re: Quote ${quote.reference_number} — Reve Stitching&body=Hi ${encodeURIComponent(quote.contact_person.split(" ")[0])},%0A%0AThank you for your quote request (${quote.reference_number}).%0A%0A" style="font-size:13px;color:#166534;text-decoration:none;font-weight:600;">
            Reply to Buyer
          </a>
          <span style="color:#d4d4d8;margin:0 8px;">|</span>
          <a href="https://wa.me/923329555786?text=Reminder: Quote ${encodeURIComponent(quote.reference_number)} from ${encodeURIComponent(quote.company_name)} needs a response." style="font-size:13px;color:#166534;text-decoration:none;font-weight:600;">
            WhatsApp Team
          </a>
        </td>
      </tr>
    </table>
  `;
  const html = await emailLayout(
    body,
    {
      previewText: `Quote ${quote.reference_number} from ${quote.company_name} has been pending for ${hoursSince}+ hours. ${quote.quantity.toLocaleString()} ${quote.product_type} — needs your attention.`
    },
    brandingOverride
  );
  return { subject, html };
}
function buildAdminReminderDiscordPayload(quote) {
  return {
    content: "Quote pending for 48+ hours — needs attention!",
    embeds: [
      {
        title: `PENDING: ${quote.reference_number}`,
        description: `**${quote.contact_person}** from **${quote.company_name}** submitted a quote **48+ hours ago** and hasn't received a response.`,
        color: 14427686,
        // Red
        fields: [
          {
            name: "Product",
            value: quote.product_type,
            inline: true
          },
          {
            name: "Quantity",
            value: `${quote.quantity.toLocaleString()} pcs`,
            inline: true
          },
          {
            name: "Buyer Email",
            value: quote.email,
            inline: true
          },
          ...quote.estimated_price_range ? [
            {
              name: "Est. Value",
              value: quote.estimated_price_range,
              inline: true
            }
          ] : []
        ],
        url: `https://revestitching.com/admin/quote/${quote.reference_number}`,
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        footer: {
          text: "Reve Stitching — Automated Follow-Up System"
        }
      }
    ]
  };
}

async function generateReengagementEmail(quote, brandingOverride, contentOverride) {
  const saved = contentOverride !== void 0 ? contentOverride : await getTemplateContent("7d");
  const defaults = TEMPLATE_DEFAULTS["7d"];
  const vars = buildVars(quote);
  const subject = replaceVars(saved?.subject || defaults.subject, vars);
  const greeting = replaceVars(saved?.greeting || defaults.greeting, vars);
  const mainBody = replaceVars(saved?.main_body || defaults.main_body, vars);
  const ctaText = replaceVars(saved?.cta_text || defaults.cta_text, vars);
  const footerNote = replaceVars(saved?.footer_note || defaults.footer_note, vars);
  const firstName = vars.first_name;
  const body = `
    <!-- Greeting -->
    <h2 style="margin:0 0 8px;font-size:20px;color:#18181b;font-weight:bold;">
      Hi ${firstName},
    </h2>
    <p style="margin:0 0 20px;font-size:15px;color:#52525b;line-height:1.6;">
      ${greeting}
    </p>

    <!-- Original Quote Reference -->
    <p style="margin:0 0 12px;font-size:13px;font-weight:bold;color:#18181b;text-transform:uppercase;letter-spacing:0.5px;">
      Your Original Request
    </p>
    ${quoteDetailsBox([
    { label: "Reference", value: quote.reference_number },
    { label: "Product", value: quote.product_type },
    { label: "Quantity", value: `${quote.quantity.toLocaleString()} pcs` },
    { label: "Submitted", value: "7 days ago" }
  ])}

    <!-- Value Propositions -->
    <h3 style="margin:28px 0 16px;font-size:16px;color:#18181b;font-weight:bold;">
      Why Brands Choose Reve Stitching
    </h3>

    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin:0 0 8px;">
      <tr>
        <td style="padding:12px 16px;background-color:#f9fafb;border-radius:8px;border:1px solid #f4f4f5;">
          <table role="presentation" cellpadding="0" cellspacing="0">
            <tr>
              <td style="vertical-align:top;padding-right:12px;">
                <div style="width:28px;height:28px;background-color:#166534;border-radius:50%;text-align:center;line-height:28px;">
                  <span style="color:#fff;font-size:12px;font-weight:bold;">1</span>
                </div>
              </td>
              <td>
                <p style="margin:0 0 2px;font-size:14px;font-weight:bold;color:#18181b;">Vertically Integrated</p>
                <p style="margin:0;font-size:13px;color:#71717a;line-height:1.5;">Knitting, dyeing, cutting, stitching, finishing — all under one roof. Full quality control.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin:0 0 8px;">
      <tr>
        <td style="padding:12px 16px;background-color:#f9fafb;border-radius:8px;border:1px solid #f4f4f5;">
          <table role="presentation" cellpadding="0" cellspacing="0">
            <tr>
              <td style="vertical-align:top;padding-right:12px;">
                <div style="width:28px;height:28px;background-color:#166534;border-radius:50%;text-align:center;line-height:28px;">
                  <span style="color:#fff;font-size:12px;font-weight:bold;">2</span>
                </div>
              </td>
              <td>
                <p style="margin:0 0 2px;font-size:14px;font-weight:bold;color:#18181b;">Low MOQ, Fast Turnaround</p>
                <p style="margin:0;font-size:13px;color:#71717a;line-height:1.5;">Start from just 100 pieces. Production in 25–50 days depending on order size.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin:0 0 8px;">
      <tr>
        <td style="padding:12px 16px;background-color:#f9fafb;border-radius:8px;border:1px solid #f4f4f5;">
          <table role="presentation" cellpadding="0" cellspacing="0">
            <tr>
              <td style="vertical-align:top;padding-right:12px;">
                <div style="width:28px;height:28px;background-color:#166534;border-radius:50%;text-align:center;line-height:28px;">
                  <span style="color:#fff;font-size:12px;font-weight:bold;">3</span>
                </div>
              </td>
              <td>
                <p style="margin:0 0 2px;font-size:14px;font-weight:bold;color:#18181b;">Export to UK, EU &amp; Beyond</p>
                <p style="margin:0;font-size:13px;color:#71717a;line-height:1.5;">Trusted by brands across Europe. FOB &amp; CIF shipping available.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <!-- Soft CTA -->
    <p style="margin:28px 0 0;font-size:15px;color:#52525b;line-height:1.6;">
      ${mainBody}
    </p>

    <!-- Primary CTA -->
    ${emailButton(ctaText, `https://revestitching.com/quote?ref=${encodeURIComponent(quote.reference_number)}`)}

    <!-- Secondary CTA -->
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:16px auto 0;">
      <tr>
        <td align="center">
          <a href="https://wa.me/923329555786?text=Hi%2C%20I%20submitted%20quote%20${encodeURIComponent(quote.reference_number)}%20last%20week.%20I'd%20like%20to%20discuss%20further." target="_blank" style="display:inline-block;padding:12px 28px;background-color:#ffffff;color:#166534;font-size:14px;font-weight:bold;text-decoration:none;border-radius:8px;border:2px solid #166534;text-align:center;line-height:1;">
            Chat on WhatsApp Instead
          </a>
        </td>
      </tr>
    </table>

    <!-- Opt-out note -->
    ${footerNote ? `<p style="margin:28px 0 0;font-size:11px;color:#a1a1aa;text-align:center;line-height:1.6;">${footerNote}</p>` : ""}
  `;
  const html = await emailLayout(
    body,
    {
      previewText: `Hi ${firstName}, are you still looking for a manufacturer for ${quote.quantity.toLocaleString()} ${quote.product_type}? Your quote ${quote.reference_number} is ready for review.`
    },
    brandingOverride
  );
  return { subject, html };
}

export { generateQuoteUnderReviewEmail as a, buildAdminReminderDiscordPayload as b, generateReengagementEmail as c, generateAdminReminderEmail as g };
