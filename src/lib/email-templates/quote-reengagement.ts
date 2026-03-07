// src/lib/email-templates/quote-reengagement.ts

import { emailLayout, emailButton, quoteDetailsBox } from './_layout';
import type { QuoteEmailData } from './quote-under-review';

/**
 * 7-day re-engagement: Check if buyer is still interested.
 *
 * Tone: Helpful, no-pressure, value-driven.
 * Goal: Reignite interest or learn why they went quiet.
 */
export function generateReengagementEmail(quote: QuoteEmailData): {
  subject: string;
  html: string;
} {
  const firstName = quote.contact_person.split(' ')[0];

  const subject = `Still interested in ${quote.product_type}? — Quote ${quote.reference_number}`;

  const body = `
    <!-- Greeting -->
    <h2 style="margin:0 0 8px;font-size:20px;color:#18181b;font-weight:bold;">
      Hi ${firstName},
    </h2>
    <p style="margin:0 0 20px;font-size:15px;color:#52525b;line-height:1.6;">
      A week ago, you requested a quote for
      <strong style="color:#18181b;">${quote.quantity.toLocaleString()} ${quote.product_type}</strong>.
      We wanted to check in — are you still exploring this project?
    </p>

    <!-- Original Quote Reference -->
    <p style="margin:0 0 12px;font-size:13px;font-weight:bold;color:#18181b;text-transform:uppercase;letter-spacing:0.5px;">
      Your Original Request
    </p>
    ${quoteDetailsBox([
      { label: 'Reference', value: quote.reference_number },
      { label: 'Product', value: quote.product_type },
      { label: 'Quantity', value: `${quote.quantity.toLocaleString()} pcs` },
      { label: 'Submitted', value: '7 days ago' },
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
              <td style="vertical-align:top;padding-right:12px;font-size:20px;">🏭</td>
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
              <td style="vertical-align:top;padding-right:12px;font-size:20px;">📦</td>
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
              <td style="vertical-align:top;padding-right:12px;font-size:20px;">🌍</td>
              <td>
                <p style="margin:0 0 2px;font-size:14px;font-weight:bold;color:#18181b;">Export to UK, EU & Beyond</p>
                <p style="margin:0;font-size:13px;color:#71717a;line-height:1.5;">Trusted by brands across Europe. FOB & CIF shipping available.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <!-- Soft CTA -->
    <p style="margin:28px 0 0;font-size:15px;color:#52525b;line-height:1.6;">
      If your plans have changed, no worries at all. But if you'd like to move forward
      or adjust your requirements, we're ready to help.
    </p>

    <!-- Primary CTA -->
    ${emailButton('📋 Update My Quote Request', `https://revestitching.com/quote?ref=${encodeURIComponent(quote.reference_number)}`)}

    <!-- Secondary CTA -->
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:16px auto 0;">
      <tr>
        <td align="center">
          <a href="https://wa.me/923329555786?text=Hi%2C%20I%20submitted%20quote%20${encodeURIComponent(quote.reference_number)}%20last%20week.%20I'd%20like%20to%20discuss%20further." target="_blank" style="display:inline-block;padding:12px 28px;background-color:#ffffff;color:#166534;font-size:14px;font-weight:bold;text-decoration:none;border-radius:8px;border:2px solid #166534;text-align:center;line-height:1;">
            💬 Chat on WhatsApp Instead
          </a>
        </td>
      </tr>
    </table>

    <!-- Opt-out note -->
    <p style="margin:28px 0 0;font-size:11px;color:#a1a1aa;text-align:center;line-height:1.6;">
      This is a one-time follow-up. You won't receive further automated emails
      about this quote unless you contact us.
    </p>
  `;

  return {
    subject,
    html: emailLayout(body, {
      previewText: `Hi ${firstName}, are you still looking for a manufacturer for ${quote.quantity.toLocaleString()} ${quote.product_type}? Your quote ${quote.reference_number} is ready for review.`,
    }),
  };
}