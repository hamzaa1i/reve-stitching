// src/lib/email-templates/_layout.ts

/**
 * Shared email layout wrapper.
 * All follow-up emails use this for consistent branding.
 *
 * Design rules for email HTML:
 * - All CSS must be inline (Gmail, Outlook strip <style> tags)
 * - Use tables for layout (not flexbox/grid)
 * - max-width: 600px
 * - No external fonts (use system font stack)
 * - Images need full URLs
 */

export interface EmailLayoutOptions {
    previewText?: string; // Shows in inbox preview, hidden in body
  }
  
  export function emailLayout(
    bodyContent: string,
    options: EmailLayoutOptions = {}
  ): string {
    const { previewText } = options;
  
    return `<!DOCTYPE html>
  <html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="x-apple-disable-message-reformatting" />
    <title>Reve Stitching</title>
    <!--[if mso]>
    <noscript>
      <xml>
        <o:OfficeDocumentSettings>
          <o:AllowPNG/>
          <o:PixelsPerInch>96</o:PixelsPerInch>
        </o:OfficeDocumentSettings>
      </xml>
    </noscript>
    <![endif]-->
  </head>
  <body style="margin:0;padding:0;background-color:#f4f4f5;font-family:Arial,Helvetica,sans-serif;-webkit-font-smoothing:antialiased;">
  
    ${previewText ? `
    <!-- Preview text (visible in inbox, hidden in email body) -->
    <div style="display:none;font-size:1px;color:#f4f4f5;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">
      ${previewText}
      ${'‌ '.repeat(30)}
    </div>
    ` : ''}
  
    <!-- Outer wrapper -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5;">
      <tr>
        <td align="center" style="padding:32px 16px;">
  
          <!-- Email container -->
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.08);">
  
            <!-- ━━━ Header ━━━ -->
            <tr>
              <td style="background-color:#166534;padding:28px 32px;text-align:center;">
                <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto;">
                  <tr>
                    <td style="padding-right:10px;vertical-align:middle;">
                      <div style="width:36px;height:36px;background-color:rgba(255,255,255,0.2);border-radius:8px;text-align:center;line-height:36px;">
                        <span style="color:#ffffff;font-size:18px;font-weight:bold;">R</span>
                      </div>
                    </td>
                    <td style="vertical-align:middle;">
                      <span style="color:#ffffff;font-size:20px;font-weight:bold;letter-spacing:0.5px;">Reve Stitching</span>
                    </td>
                  </tr>
                </table>
                <p style="color:rgba(255,255,255,0.75);font-size:12px;margin:8px 0 0;letter-spacing:0.3px;">
                  Premium Garment Manufacturing
                </p>
              </td>
            </tr>
  
            <!-- ━━━ Body ━━━ -->
            <tr>
              <td style="padding:36px 32px;">
                ${bodyContent}
              </td>
            </tr>
  
            <!-- ━━━ Footer ━━━ -->
            <tr>
              <td style="background-color:#fafafa;padding:24px 32px;border-top:1px solid #e4e4e7;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="text-align:center;">
                      <!-- Social / Contact Links -->
                      <p style="margin:0 0 12px;font-size:13px;color:#71717a;">
                        <a href="https://wa.me/923329555786" style="color:#166534;text-decoration:none;font-weight:600;">WhatsApp</a>
                        &nbsp;&nbsp;·&nbsp;&nbsp;
                        <a href="mailto:info@revestitching.com" style="color:#166534;text-decoration:none;font-weight:600;">Email</a>
                        &nbsp;&nbsp;·&nbsp;&nbsp;
                        <a href="https://revestitching.com" style="color:#166534;text-decoration:none;font-weight:600;">Website</a>
                      </p>
                      <p style="margin:0 0 4px;font-size:11px;color:#a1a1aa;">
                        Reve Stitching (Pvt.) Ltd.
                      </p>
                      <p style="margin:0 0 4px;font-size:11px;color:#a1a1aa;">
                        100% Export-Oriented Knitted Garment Manufacturer
                      </p>
                      <p style="margin:0;font-size:11px;color:#a1a1aa;">
                        Faisalabad, Pakistan
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
  
          </table>
          <!-- /Email container -->
  
        </td>
      </tr>
    </table>
  
  </body>
  </html>`;
  }
  
  /**
   * Reusable green CTA button for emails.
   */
  export function emailButton(text: string, href: string): string {
    return `
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:28px auto 0;">
      <tr>
        <td align="center" style="border-radius:8px;background-color:#166534;">
          <!--[if mso]>
          <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${href}" style="height:48px;v-text-anchor:middle;width:220px;" arcsize="17%" strokecolor="#166534" fillcolor="#166534">
            <w:anchorlock/>
            <center style="color:#ffffff;font-family:Arial,sans-serif;font-size:14px;font-weight:bold;">${text}</center>
          </v:roundrect>
          <![endif]-->
          <!--[if !mso]><!-->
          <a href="${href}" target="_blank" style="display:inline-block;padding:14px 32px;background-color:#166534;color:#ffffff;font-size:14px;font-weight:bold;text-decoration:none;border-radius:8px;text-align:center;line-height:1;">
            ${text}
          </a>
          <!--<![endif]-->
        </td>
      </tr>
    </table>`;
  }
  
  /**
   * Gray info box for quote details.
   */
  export function quoteDetailsBox(fields: { label: string; value: string }[]): string {
    const rows = fields
      .map(
        (f) => `
        <tr>
          <td style="padding:6px 0;font-size:13px;color:#71717a;width:140px;vertical-align:top;">${f.label}</td>
          <td style="padding:6px 0;font-size:13px;color:#18181b;font-weight:600;vertical-align:top;">${f.value}</td>
        </tr>`
      )
      .join('');
  
    return `
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color:#f9fafb;border:1px solid #e4e4e7;border-radius:8px;padding:4px;">
      <tr>
        <td style="padding:16px 20px;">
          <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
            ${rows}
          </table>
        </td>
      </tr>
    </table>`;
  }