// src/lib/email-templates/sample-confirmation.ts

import { emailLayout } from './_layout';

interface SampleConfirmationData {
  reference_number: string;
  contact_person: string;
  company_name: string;
  product_type: string;
  fabric_type?: string;
  quantity: number;
  color?: string;
  size?: string;
}

export async function sampleConfirmationEmail(data: SampleConfirmationData): Promise<{ subject: string; html: string }> {
  const subject = `Sample Request Received - ${data.reference_number}`;

  const content = `
    <h2 style="color: #166534; margin: 0 0 16px 0; font-size: 22px;">Sample Request Received</h2>
    <p style="color: #3f3f46; margin: 0 0 16px 0; font-size: 15px; line-height: 1.6;">
      Dear ${data.contact_person},
    </p>
    <p style="color: #3f3f46; margin: 0 0 24px 0; font-size: 15px; line-height: 1.6;">
      Thank you for your sample request. We have received your submission and our team will review it shortly.
    </p>

    <div style="background: #f4f4f5; border-radius: 12px; padding: 20px; margin: 0 0 24px 0;">
      <h3 style="color: #27272a; margin: 0 0 12px 0; font-size: 16px;">Request Details</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 6px 0; color: #71717a; font-size: 14px; width: 140px;">Reference</td>
          <td style="padding: 6px 0; color: #27272a; font-size: 14px; font-weight: 600;">${data.reference_number}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #71717a; font-size: 14px;">Company</td>
          <td style="padding: 6px 0; color: #27272a; font-size: 14px;">${data.company_name}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #71717a; font-size: 14px;">Product</td>
          <td style="padding: 6px 0; color: #27272a; font-size: 14px;">${data.product_type}</td>
        </tr>
        ${data.fabric_type ? `
        <tr>
          <td style="padding: 6px 0; color: #71717a; font-size: 14px;">Fabric</td>
          <td style="padding: 6px 0; color: #27272a; font-size: 14px;">${data.fabric_type}</td>
        </tr>` : ''}
        ${data.color ? `
        <tr>
          <td style="padding: 6px 0; color: #71717a; font-size: 14px;">Color</td>
          <td style="padding: 6px 0; color: #27272a; font-size: 14px;">${data.color}</td>
        </tr>` : ''}
        ${data.size ? `
        <tr>
          <td style="padding: 6px 0; color: #71717a; font-size: 14px;">Size</td>
          <td style="padding: 6px 0; color: #27272a; font-size: 14px;">${data.size}</td>
        </tr>` : ''}
        <tr>
          <td style="padding: 6px 0; color: #71717a; font-size: 14px;">Quantity</td>
          <td style="padding: 6px 0; color: #27272a; font-size: 14px;">${data.quantity} piece(s)</td>
        </tr>
      </table>
    </div>

    <p style="color: #3f3f46; margin: 0 0 8px 0; font-size: 15px; line-height: 1.6;">
      <strong>What happens next?</strong>
    </p>
    <ol style="color: #3f3f46; margin: 0 0 24px 0; padding-left: 20px; font-size: 14px; line-height: 1.8;">
      <li>Our team reviews your request (1-2 business days)</li>
      <li>We confirm sample availability and any applicable fees</li>
      <li>Sample is produced and shipped with tracking</li>
      <li>You receive the sample for evaluation</li>
    </ol>

    <p style="color: #71717a; margin: 0; font-size: 13px; line-height: 1.6;">
      If you have any questions, reply to this email or contact us on WhatsApp.
    </p>
  `;

  return { subject, html: await emailLayout(content) };
}