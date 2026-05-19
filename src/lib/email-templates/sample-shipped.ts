// src/lib/email-templates/sample-shipped.ts

import { emailLayout } from './_layout';

interface SampleShippedData {
  reference_number: string;
  contact_person: string;
  company_name: string;
  product_type: string;
  shipping_carrier: string;
  tracking_number: string;
}

export async function sampleShippedEmail(data: SampleShippedData): Promise<{ subject: string; html: string }> {
  const subject = `Sample Shipped - ${data.reference_number}`;

  const carrierLinks: Record<string, string> = {
    'DHL': `https://www.dhl.com/en/express/tracking.html?AWB=${data.tracking_number}`,
    'FedEx': `https://www.fedex.com/fedextrack/?trknbr=${data.tracking_number}`,
    'UPS': `https://www.ups.com/track?tracknum=${data.tracking_number}`,
  };

  const trackingUrl = carrierLinks[data.shipping_carrier] || '#';

  const content = `
    <h2 style="color: #166534; margin: 0 0 16px 0; font-size: 22px;">Your Sample Has Been Shipped</h2>
    <p style="color: #3f3f46; margin: 0 0 16px 0; font-size: 15px; line-height: 1.6;">
      Dear ${data.contact_person},
    </p>
    <p style="color: #3f3f46; margin: 0 0 24px 0; font-size: 15px; line-height: 1.6;">
      Your sample for <strong>${data.product_type}</strong> (ref: ${data.reference_number}) has been shipped and is on its way to you.
    </p>

    <div style="background: #ecfdf5; border: 1px solid #bbf7d0; border-radius: 12px; padding: 20px; margin: 0 0 24px 0; text-align: center;">
      <p style="color: #71717a; margin: 0 0 4px 0; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Carrier</p>
      <p style="color: #27272a; margin: 0 0 16px 0; font-size: 16px; font-weight: 600;">${data.shipping_carrier}</p>
      <p style="color: #71717a; margin: 0 0 4px 0; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Tracking Number</p>
      <p style="color: #27272a; margin: 0 0 16px 0; font-size: 18px; font-weight: 700; font-family: monospace;">${data.tracking_number}</p>
      <a href="${trackingUrl}" style="display: inline-block; background: #166534; color: #ffffff; text-decoration: none; padding: 10px 24px; border-radius: 8px; font-size: 14px; font-weight: 600;">
        Track Your Shipment
      </a>
    </div>

    <p style="color: #71717a; margin: 0; font-size: 13px; line-height: 1.6;">
      Typical delivery time: 5-10 business days depending on your location. We will follow up once delivery is confirmed.
    </p>
  `;

  return { subject, html: await emailLayout(content) };
}