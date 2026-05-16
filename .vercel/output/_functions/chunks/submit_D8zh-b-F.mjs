import { createClient } from '@supabase/supabase-js';
import { g as generateSampleReference } from './sample-reference_DLuhyRF6.mjs';
import { a as emailLayout } from './_layout_DBrGWFJB.mjs';
import { Resend } from 'resend';

async function sampleConfirmationEmail(data) {
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
        </tr>` : ""}
        ${data.color ? `
        <tr>
          <td style="padding: 6px 0; color: #71717a; font-size: 14px;">Color</td>
          <td style="padding: 6px 0; color: #27272a; font-size: 14px;">${data.color}</td>
        </tr>` : ""}
        ${data.size ? `
        <tr>
          <td style="padding: 6px 0; color: #71717a; font-size: 14px;">Size</td>
          <td style="padding: 6px 0; color: #27272a; font-size: 14px;">${data.size}</td>
        </tr>` : ""}
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

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
);
const resend = new Resend(process.env.RESEND_API_KEY);
const POST = async ({ request }) => {
  try {
    const body = await request.json();
    const {
      company_name,
      contact_person,
      email,
      phone,
      country,
      shipping_address,
      product_type,
      fabric_type,
      gsm,
      color,
      size,
      quantity,
      special_requirements,
      linked_quote_id
    } = body;
    const errors = [];
    if (!company_name?.trim()) errors.push("Company name is required");
    if (!contact_person?.trim()) errors.push("Contact person is required");
    if (!email?.trim()) errors.push("Email is required");
    if (!country?.trim()) errors.push("Country is required");
    if (!shipping_address?.trim()) errors.push("Shipping address is required");
    if (!product_type?.trim()) errors.push("Product type is required");
    if (!quantity || quantity < 1 || quantity > 5) errors.push("Quantity must be between 1 and 5");
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.push("Invalid email address");
    }
    if (errors.length > 0) {
      return new Response(JSON.stringify({ error: errors.join(", ") }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const reference_number = generateSampleReference();
    const insertData = {
      reference_number,
      company_name: company_name.trim(),
      contact_person: contact_person.trim(),
      email: email.trim().toLowerCase(),
      phone: phone?.trim() || null,
      country: country.trim(),
      shipping_address: shipping_address.trim(),
      product_type,
      fabric_type: fabric_type || null,
      gsm: gsm ? parseInt(gsm, 10) : null,
      color: color?.trim() || null,
      size: size || null,
      quantity: parseInt(quantity, 10),
      special_requirements: special_requirements?.trim() || null,
      linked_quote_id: linked_quote_id?.trim() || null,
      status: "new"
    };
    const { data, error } = await supabase.from("sample_requests").insert(insertData).select().single();
    if (error) {
      console.error("Supabase insert error:", error);
      return new Response(JSON.stringify({ error: "Failed to submit sample request" }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
    try {
      const emailContent = sampleConfirmationEmail({
        reference_number,
        contact_person: contact_person.trim(),
        company_name: company_name.trim(),
        product_type,
        fabric_type,
        quantity: parseInt(quantity, 10),
        color,
        size
      });
      await resend.emails.send({
        from: "Reve Stitching <notifications@revestitching.com>",
        to: email.trim().toLowerCase(),
        subject: emailContent.subject,
        html: emailContent.html
      });
    } catch (emailErr) {
      console.error("Email send error:", emailErr);
    }
    if (process.env.DISCORD_WEBHOOK_URL) {
      try {
        await fetch(process.env.DISCORD_WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            embeds: [{
              title: `New Sample Request: ${reference_number}`,
              color: 1467700,
              fields: [
                { name: "Company", value: company_name, inline: true },
                { name: "Contact", value: contact_person, inline: true },
                { name: "Product", value: product_type, inline: true },
                { name: "Country", value: country, inline: true },
                { name: "Quantity", value: String(quantity), inline: true },
                { name: "Email", value: email, inline: true }
              ],
              timestamp: (/* @__PURE__ */ new Date()).toISOString()
            }]
          })
        });
      } catch (discordErr) {
        console.error("Discord notification error:", discordErr);
      }
    }
    return new Response(JSON.stringify({ success: true, data: { reference_number, id: data.id } }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    console.error("Sample submit error:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
