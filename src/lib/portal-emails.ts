import { Resend } from "resend";

const resend = new Resend(import.meta.env.RESEND_API_KEY);

const FROM = "Reve Stitching <noreply@revestitching.com>";
const REPLY_TO = "info@revestitching.com";

const baseStyle = `
  font-family: Inter, -apple-system, sans-serif;
  max-width: 600px;
  margin: 0 auto;
  background: #09090b;
  color: #e4e4e7;
  border-radius: 16px;
  overflow: hidden;
`;

const headerStyle = `
  background: #16a34a;
  padding: 32px 40px;
  text-align: center;
`;

const bodyStyle = `
  padding: 40px;
`;

const footerStyle = `
  padding: 24px 40px;
  border-top: 1px solid #27272a;
  text-align: center;
  color: #71717a;
  font-size: 12px;
`;

function emailWrapper(content: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width"></head>
    <body style="margin:0;padding:20px;background:#000;">
      <div style="${baseStyle}">
        <div style="${headerStyle}">
          <div style="font-family:Georgia,serif;font-size:24px;font-weight:700;color:white;letter-spacing:-0.5px;">
            Reve Stitching
          </div>
          <div style="font-size:11px;color:rgba(255,255,255,0.7);letter-spacing:2px;text-transform:uppercase;margin-top:4px;">
            Client Portal
          </div>
        </div>
        <div style="${bodyStyle}">
          ${content}
        </div>
        <div style="${footerStyle}">
          <p style="margin:0">Reve Stitching (Pvt.) Ltd. · Faisalabad, Pakistan</p>
          <p style="margin:4px 0 0"><a href="https://revestitching.com" style="color:#16a34a;text-decoration:none;">revestitching.com</a></p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// ━━━ Account Approved ━━━
export async function sendAccountApprovedEmail(to: string, name: string) {
  const content = `
    <h2 style="color:white;font-size:22px;margin:0 0 12px">Welcome, ${name}! 🎉</h2>
    <p style="color:#a1a1aa;line-height:1.7;margin:0 0 24px">
      Your Reve Stitching client portal account has been activated.
      You can now log in to track your orders, download documents, and communicate with our team.
    </p>
    <div style="text-align:center;margin:32px 0">
      <a href="https://revestitching.com/portal/dashboard"
         style="background:#16a34a;color:white;text-decoration:none;padding:14px 32px;border-radius:100px;font-weight:700;font-size:14px;letter-spacing:0.5px;display:inline-block">
        Access Your Portal
      </a>
    </div>
    <p style="color:#71717a;font-size:13px;margin:0">
      Questions? Reply to this email or contact us at
      <a href="mailto:haroon@revestitching.com" style="color:#16a34a;">haroon@revestitching.com</a>
    </p>
  `;

  return resend.emails.send({
    from: FROM,
    replyTo: REPLY_TO,
    to,
    subject: "Your Reve Stitching portal account is ready",
    html: emailWrapper(content),
  });
}

// ━━━ Order Stage Update ━━━
const stageLabels: Record<string, string> = {
  confirmed: "Order Confirmed",
  fabric_sourced: "Fabric Sourced",
  cutting: "Cutting Started",
  stitching: "Stitching In Progress",
  qc: "Quality Inspection",
  packing: "Packing & Labeling",
  shipped: "Order Shipped",
  delivered: "Order Delivered",
};

const stageEmoji: Record<string, string> = {
  confirmed: "✅",
  fabric_sourced: "🧵",
  cutting: "✂️",
  stitching: "🪡",
  qc: "🔍",
  packing: "📦",
  shipped: "🚢",
  delivered: "🎉",
};

export async function sendStageUpdateEmail(
  to: string,
  name: string,
  poNumber: string,
  stage: string,
  notes: string | null,
  orderId: string,
) {
  const label = stageLabels[stage] || stage;
  const emoji = stageEmoji[stage] || "📋";

  const content = `
    <h2 style="color:white;font-size:22px;margin:0 0 8px">${emoji} Order Update</h2>
    <p style="color:#71717a;font-size:13px;margin:0 0 24px">PO: ${poNumber}</p>

    <div style="background:#18181b;border:1px solid #27272a;border-radius:12px;padding:20px;margin:0 0 24px">
      <div style="font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:1.5px;color:#71717a;margin-bottom:8px">Current Stage</div>
      <div style="font-size:20px;font-weight:700;color:#22c55e">${label}</div>
      ${notes ? `<p style="color:#a1a1aa;font-size:14px;margin:12px 0 0;line-height:1.6">${notes}</p>` : ""}
    </div>

    <p style="color:#a1a1aa;line-height:1.7;margin:0 0 24px">
      Hi ${name}, your order <strong style="color:white">${poNumber}</strong> has been updated.
      Log in to your portal to view the full production timeline.
    </p>

    <div style="text-align:center;margin:32px 0">
      <a href="https://revestitching.com/portal/orders/${orderId}"
         style="background:#16a34a;color:white;text-decoration:none;padding:14px 32px;border-radius:100px;font-weight:700;font-size:14px;letter-spacing:0.5px;display:inline-block">
        View Order Status
      </a>
    </div>
  `;

  return resend.emails.send({
    from: FROM,
    replyTo: REPLY_TO,
    to,
    subject: `${emoji} ${label} — Order ${poNumber}`,
    html: emailWrapper(content),
  });
}

// ━━━ New Message ━━━
export async function sendNewMessageEmail(
  to: string,
  name: string,
  subject: string,
  preview: string,
) {
  const content = `
    <h2 style="color:white;font-size:22px;margin:0 0 8px">💬 New Message</h2>
    <p style="color:#a1a1aa;line-height:1.7;margin:0 0 20px">
      Hi ${name}, you have a new message from the Reve Stitching team.
    </p>

    <div style="background:#18181b;border:1px solid #27272a;border-left:3px solid #22c55e;border-radius:12px;padding:20px;margin:0 0 24px">
      <div style="font-size:13px;font-weight:600;color:white;margin-bottom:8px">${subject || "Message from Reve Team"}</div>
      <div style="color:#a1a1aa;font-size:14px;line-height:1.6">${preview}</div>
    </div>

    <div style="text-align:center;margin:32px 0">
      <a href="https://revestitching.com/portal/messages"
         style="background:#16a34a;color:white;text-decoration:none;padding:14px 32px;border-radius:100px;font-weight:700;font-size:14px;letter-spacing:0.5px;display:inline-block">
        View Messages
      </a>
    </div>
  `;

  return resend.emails.send({
    from: FROM,
    replyTo: REPLY_TO,
    to,
    subject: subject ? `💬 ${subject}` : "💬 New message from Reve Stitching",
    html: emailWrapper(content),
  });
}

// ━━━ Quote Ready ━━━
export async function sendQuoteReadyEmail(
  to: string,
  name: string,
  productType: string,
  totalPrice: string,
  currency: string,
) {
  const content = `
    <h2 style="color:white;font-size:22px;margin:0 0 8px">📋 Your Quote is Ready</h2>
    <p style="color:#a1a1aa;line-height:1.7;margin:0 0 20px">
      Hi ${name}, your price quotation for <strong style="color:white">${productType}</strong> has been prepared.
    </p>

    <div style="background:#18181b;border:1px solid #27272a;border-radius:12px;padding:20px;margin:0 0 24px;text-align:center">
      <div style="font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:1.5px;color:#71717a;margin-bottom:8px">Total Price</div>
      <div style="font-size:32px;font-weight:700;color:#22c55e">${totalPrice} ${currency}</div>
    </div>

    <div style="text-align:center;margin:32px 0">
      <a href="https://revestitching.com/portal/quotes"
         style="background:#16a34a;color:white;text-decoration:none;padding:14px 32px;border-radius:100px;font-weight:700;font-size:14px;letter-spacing:0.5px;display:inline-block">
        View Your Quote
      </a>
    </div>

    <p style="color:#71717a;font-size:13px;margin:0;text-align:center">
      This quote is valid for 30 days. Approve it to start production.
    </p>
  `;

  return resend.emails.send({
    from: FROM,
    replyTo: REPLY_TO,
    to,
    subject: `📋 Your quote for ${productType} is ready`,
    html: emailWrapper(content),
  });
}
