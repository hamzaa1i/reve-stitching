// src/lib/email-templates/sample-approved.ts

import { emailLayout } from './_layout';

interface SampleApprovedData {
  reference_number: string;
  contact_person: string;
  company_name: string;
  product_type: string;
  sample_fee: number;
  is_free_sample: boolean;
}

export async function sampleApprovedEmail(data: SampleApprovedData): Promise<{ subject: string; html: string }> {
  const subject = `Sample Request Approved - ${data.reference_number}`;

  const feeSection = data.is_free_sample
    ? `<p style="color: #166534; margin: 0 0 16px 0; font-size: 15px; font-weight: 600;">
        This sample is complimentary -- no charges apply.
       </p>`
    : data.sample_fee > 0
    ? `<div style="background: #f4f4f5; border-radius: 12px; padding: 16px; margin: 0 0 24px 0;">
        <p style="color: #3f3f46; margin: 0; font-size: 14px;">
          Sample fee: <strong>$${data.sample_fee.toFixed(2)}</strong>
          <br><span style="color: #71717a; font-size: 13px;">This fee is deductible from your first bulk order.</span>
        </p>
       </div>`
    : '';

  const content = `
    <h2 style="color: #166534; margin: 0 0 16px 0; font-size: 22px;">Sample Request Approved</h2>
    <p style="color: #3f3f46; margin: 0 0 16px 0; font-size: 15px; line-height: 1.6;">
      Dear ${data.contact_person},
    </p>
    <p style="color: #3f3f46; margin: 0 0 24px 0; font-size: 15px; line-height: 1.6;">
      Great news! Your sample request <strong>${data.reference_number}</strong> for <strong>${data.product_type}</strong> has been approved and is now being prepared.
    </p>

    ${feeSection}

    <p style="color: #3f3f46; margin: 0 0 16px 0; font-size: 15px; line-height: 1.6;">
      We will notify you with tracking information once your sample has been shipped.
    </p>

    <p style="color: #71717a; margin: 0; font-size: 13px; line-height: 1.6;">
      Estimated preparation time: 3-5 business days.
    </p>
  `;

  return { subject, html: await emailLayout(content) };
}