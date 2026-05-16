import { createClient } from '@supabase/supabase-js';
import { getAdminFromCookies } from './auth_BQ4oAavg.mjs';
import { Resend } from 'resend';
import { a as emailLayout } from './_layout_DBrGWFJB.mjs';

async function sampleApprovedEmail(data) {
  const subject = `Sample Request Approved - ${data.reference_number}`;
  const feeSection = data.is_free_sample ? `<p style="color: #166534; margin: 0 0 16px 0; font-size: 15px; font-weight: 600;">
        This sample is complimentary -- no charges apply.
       </p>` : data.sample_fee > 0 ? `<div style="background: #f4f4f5; border-radius: 12px; padding: 16px; margin: 0 0 24px 0;">
        <p style="color: #3f3f46; margin: 0; font-size: 14px;">
          Sample fee: <strong>$${data.sample_fee.toFixed(2)}</strong>
          <br><span style="color: #71717a; font-size: 13px;">This fee is deductible from your first bulk order.</span>
        </p>
       </div>` : "";
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

async function sampleShippedEmail(data) {
  const subject = `Sample Shipped - ${data.reference_number}`;
  const carrierLinks = {
    "DHL": `https://www.dhl.com/en/express/tracking.html?AWB=${data.tracking_number}`,
    "FedEx": `https://www.fedex.com/fedextrack/?trknbr=${data.tracking_number}`,
    "UPS": `https://www.ups.com/track?tracknum=${data.tracking_number}`
  };
  const trackingUrl = carrierLinks[data.shipping_carrier] || "#";
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

const statusMessages = {
  production: {
    title: "Sample In Production",
    message: "Your sample is now being produced by our team. We will notify you once it is ready for shipping."
  },
  delivered: {
    title: "Sample Delivery Confirmed",
    message: "We have confirmed that your sample has been delivered. We hope it meets your expectations. Please do not hesitate to reach out with any feedback or to discuss a bulk order."
  },
  rejected: {
    title: "Sample Request Update",
    message: "Unfortunately, we are unable to fulfill this sample request at this time."
  }
};
async function sampleStatusUpdateEmail(data) {
  const config = statusMessages[data.status] || {
    title: "Sample Request Update",
    message: `Your sample request status has been updated to: ${data.status}.`
  };
  const subject = `${config.title} - ${data.reference_number}`;
  const rejectionBlock = data.status === "rejected" && data.rejection_reason ? `<div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 12px; padding: 16px; margin: 0 0 24px 0;">
        <p style="color: #991b1b; margin: 0; font-size: 14px;">
          <strong>Reason:</strong> ${data.rejection_reason}
        </p>
       </div>` : "";
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

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
);
const resend = new Resend(process.env.RESEND_API_KEY);
const PATCH = async ({ params, request, cookies }) => {
  const admin = await getAdminFromCookies(cookies);
  if (!admin) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" }
    });
  }
  try {
    const { id } = params;
    const body = await request.json();
    const {
      status,
      shipping_carrier,
      tracking_number,
      shipped_at,
      delivered_at,
      sample_fee,
      actual_cost,
      shipping_cost,
      is_free_sample,
      admin_notes,
      rejection_reason
    } = body;
    const { data: current, error: fetchError } = await supabase.from("sample_requests").select("*").eq("id", id).single();
    if (fetchError || !current) {
      return new Response(JSON.stringify({ error: "Sample request not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }
    const sample = current;
    const updateData = {};
    if (status !== void 0) updateData.status = status;
    if (shipping_carrier !== void 0) updateData.shipping_carrier = shipping_carrier;
    if (tracking_number !== void 0) updateData.tracking_number = tracking_number;
    if (shipped_at !== void 0) updateData.shipped_at = shipped_at;
    if (delivered_at !== void 0) updateData.delivered_at = delivered_at;
    if (sample_fee !== void 0) updateData.sample_fee = sample_fee;
    if (actual_cost !== void 0) updateData.actual_cost = actual_cost;
    if (shipping_cost !== void 0) updateData.shipping_cost = shipping_cost;
    if (is_free_sample !== void 0) updateData.is_free_sample = is_free_sample;
    if (admin_notes !== void 0) updateData.admin_notes = admin_notes;
    if (rejection_reason !== void 0) updateData.rejection_reason = rejection_reason;
    const { data: updated, error: updateError } = await supabase.from("sample_requests").update(updateData).eq("id", id).select().single();
    if (updateError) {
      console.error("Update error:", updateError);
      return new Response(JSON.stringify({ error: "Failed to update sample request" }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
    if (status && status !== sample.status) {
      try {
        let emailContent = null;
        if (status === "approved") {
          emailContent = await sampleApprovedEmail({
            reference_number: sample.reference_number,
            contact_person: sample.contact_person,
            company_name: sample.company_name,
            product_type: sample.product_type,
            sample_fee: sample_fee ?? sample.sample_fee ?? 0,
            is_free_sample: is_free_sample ?? sample.is_free_sample
          });
        } else if (status === "shipped" && (tracking_number || sample.tracking_number)) {
          emailContent = await sampleShippedEmail({
            reference_number: sample.reference_number,
            contact_person: sample.contact_person,
            company_name: sample.company_name,
            product_type: sample.product_type,
            shipping_carrier: shipping_carrier || sample.shipping_carrier || "Courier",
            tracking_number: tracking_number || sample.tracking_number || ""
          });
        } else if (["production", "delivered", "rejected"].includes(status)) {
          emailContent = await sampleStatusUpdateEmail({
            reference_number: sample.reference_number,
            contact_person: sample.contact_person,
            company_name: sample.company_name,
            product_type: sample.product_type,
            status,
            rejection_reason: rejection_reason || void 0
          });
        }
        if (emailContent) {
          await resend.emails.send({
            from: "Reve Stitching <notifications@revestitching.com>",
            to: sample.email,
            subject: emailContent.subject,
            html: emailContent.html
          });
        }
      } catch (emailErr) {
        console.error("Status email error:", emailErr);
      }
    }
    return new Response(JSON.stringify({ success: true, data: updated }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    console.error("Status update error:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  PATCH
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
