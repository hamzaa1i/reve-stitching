// src/lib/email-templates/_layout.ts

import { getTemplateSettings, type EmailTemplateSettings } from './template-storage';

// Cache settings for 5 minutes to avoid DB calls on every email
let cachedSettings: EmailTemplateSettings | null = null;
let cacheTime = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

async function getSettings(): Promise<EmailTemplateSettings> {
  const now = Date.now();
  if (cachedSettings && now - cacheTime < CACHE_TTL) {
    return cachedSettings;
  }
  
  try {
    cachedSettings = await getTemplateSettings();
    cacheTime = now;
    return cachedSettings;
  } catch (err) {
    console.error('[Email Layout] Failed to load settings:', err);
    // Return defaults
    return {
      id: 'default',
      company_name: 'Reve Stitching',
      tagline: 'Premium Garment Manufacturing',
      logo_text: 'R',
      brand_color: '#166534',
      whatsapp_number: '+92 332 9555786',
      support_email: 'info@revestitching.com',
      website_url: 'https://revestitching.com',
      footer_text: `Reve Stitching (Pvt.) Ltd.\n100% Export-Oriented Knitted Garment Manufacturer\nFaisalabad, Pakistan`,
      updated_at: new Date().toISOString(),
    };
  }
}

// Clear cache (call after saving new settings)
export function clearTemplateCache(): void {
  cachedSettings = null;
  cacheTime = 0;
}

interface LayoutOptions {
  previewText?: string;
}

export async function emailLayout(
  body: string, 
  options: LayoutOptions = {},
  brandingOverride?: Record<string, string> | null
): Promise<string> {
  const baseSettings = await getSettings();
const settings = brandingOverride 
  ? { ...baseSettings, ...brandingOverride }
  : baseSettings;
  const { previewText = '' } = options;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>${settings.company_name}</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
  <style>
    body { margin: 0; padding: 0; background-color: #f4f4f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; }
    table { border-collapse: collapse; }
    img { border: 0; display: block; }
    a { color: ${settings.brand_color}; text-decoration: none; }
    a:hover { text-decoration: underline; }
  </style>
</head>
<body style="margin:0;padding:0;background-color:#f4f4f5;">
  ${previewText ? `<div style="display:none;max-height:0;overflow:hidden;">${previewText}</div>` : ''}
  
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color:#f4f4f5;">
    <tr>
      <td align="center" style="padding:40px 20px;">
        
        <!-- Main Container -->
        <table role="presentation" cellpadding="0" cellspacing="0" width="600" style="max-width:600px;width:100%;background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
          
          <!-- Header -->
          <tr>
            <td style="background-color:${settings.brand_color};padding:32px;text-align:center;">
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center">
                    <div style="width:56px;height:56px;background-color:rgba(255,255,255,0.2);border-radius:12px;display:inline-block;line-height:56px;text-align:center;">
                      <span style="color:#ffffff;font-size:24px;font-weight:bold;">${settings.logo_text}</span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-top:16px;">
                    <h1 style="margin:0;color:#ffffff;font-size:20px;font-weight:bold;">${settings.company_name}</h1>
                    <p style="margin:4px 0 0;color:rgba(255,255,255,0.8);font-size:13px;">${settings.tagline}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Body -->
          <tr>
            <td style="padding:32px;">
              ${body}
            </td>
          </tr>
          
          <!-- Footer Links -->
          <tr>
            <td style="padding:0 32px;">
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td style="border-top:1px solid #e4e4e7;padding:20px 0;text-align:center;">
                    <a href="https://wa.me/${settings.whatsapp_number.replace(/[^0-9]/g, '')}" target="_blank" style="display:inline-block;margin:0 8px;color:#71717a;font-size:12px;text-decoration:none;">WhatsApp</a>
                    <span style="color:#d4d4d8;">·</span>
                    <a href="mailto:${settings.support_email}" style="display:inline-block;margin:0 8px;color:#71717a;font-size:12px;text-decoration:none;">Email</a>
                    <span style="color:#d4d4d8;">·</span>
                    <a href="${settings.website_url}" target="_blank" style="display:inline-block;margin:0 8px;color:#71717a;font-size:12px;text-decoration:none;">Website</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color:#f9fafb;padding:24px 32px;text-align:center;">
              <p style="margin:0;font-size:11px;color:#a1a1aa;line-height:1.6;">
                ${settings.footer_text.replace(/\n/g, '<br>')}
              </p>
            </td>
          </tr>
          
          <!-- Compliance Footer (buyer emails only) -->
          <tr>
            <td style="padding:20px 32px;text-align:center;border-top:1px solid #e4e4e7;">
              <p style="margin:0 0 8px;font-size:11px;color:#a1a1aa;line-height:1.5;">
                You received this email because you requested a quote from Reve Stitching.
                If you didn't request this, you can safely ignore it.
              </p>
              <p style="margin:0;font-size:10px;color:#d1d5db;">
                Sent on ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </td>
          </tr>
          
        </table>
        
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

export function emailButton(text: string, href: string, color?: string): string {
  // Color will be loaded from settings, but allow override
  const bgColor = color || '#166534';
  
  return `
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:24px auto 0;">
      <tr>
        <td align="center">
          <a href="${href}" target="_blank" style="display:inline-block;padding:14px 32px;background-color:${bgColor};color:#ffffff;font-size:14px;font-weight:bold;text-decoration:none;border-radius:8px;text-align:center;line-height:1;">
            ${text}
          </a>
        </td>
      </tr>
    </table>
  `;
}

export function quoteDetailsBox(items: { label: string; value: string }[]): string {
  const rows = items
    .map(
      (item) => `
      <tr>
        <td style="padding:6px 0;font-size:13px;color:#71717a;width:120px;">${item.label}</td>
        <td style="padding:6px 0;font-size:13px;color:#18181b;font-weight:500;">${item.value}</td>
      </tr>
    `
    )
    .join('');

  return `
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color:#f9fafb;border-radius:8px;padding:16px;margin:16px 0;">
      <tr>
        <td>
          <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
            ${rows}
          </table>
        </td>
      </tr>
    </table>
  `;
}