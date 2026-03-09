// src/lib/email-templates/sample-status-update.ts

import { emailLayout } from './_layout';

interface SampleStatusUpdateData {
  reference_number: string;
  contact_person: string;
  company_name: string;
  product_type: string;
  status: string;
  rejection_reason?: string;
}

const statusMessages: Record<string, { title: string; message: string }> = {
  production: {
    title: 'Sample In Production',
    message: 'Your sample is now being produced by our team. We will notify you once it is ready for shipping.',
  },
  delivered: {
    title: 'Sample Delivery Confirmed',
    message: 'We have confirmed that your sample has been delivered. We hope it meets your expectations. Please do not hesitate to reach out with any feedback or to discuss a bulk order.',
  },
  rejected: {
    title: 'Sample Request Update',
    message: 'Unfortunately, we are unable to fulfill this sample request at this time.',
  },
};

export async function sampleStatusUpdateEmail(data: SampleStatusUpdateData): Promise<{ subject: string; html: string }> {
  const config = statusMessages[data.status] || {
    title: 'Sample Request Update',
    message: `Your sample request status has been updated to: ${data.status}.`,
  };

  const subject = `${config.title} - ${data.reference_number}`;

  const rejectionBlock = data.status === 'rejected' && data.rejection_reason
    ? `<div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 12px; padding: 16px; margin: 0 0 24px 0;">
        <p style="color: #991b1b; margin: 0; font-size: 14px;">
          <strong>Reason:</strong> ${data.rejection_reason}
        </p>
       </div>`
    : '';

  const content = `
    <h2 style="color: #166534; margin: 0 0 16px 0; font-size: 22px;">${config.title}</h2>
    <p style="color: #3f3f46; margin: 0 0 16px 0; font-size: 15px; line-height: 1.6;">
      Dear ${data.contact_person},
    </p>
    <p style="color: #3f3f46; margin: 0 0 24px 0; font-size: 15px; line-height: 1.6;">
      Regarding your sample request <strong>${data.reference_number}</strong> for <strong>${data.product_type}</strong>:
    </p>
    <p style="color: #3f3f46; margin: 0 0 24px 0; font-size: 15px; line-height: 1.6;">
      ${config.message}
    </p>
    ${rejectionBlock}
    <p style="color: #71717a; margin: 0; font-size: 13px; line-height: 1.6;">
      If you have any questions, reply to this email or contact us on WhatsApp.
    </p>
  `;

  return { subject, html: await emailLayout(content) };
}