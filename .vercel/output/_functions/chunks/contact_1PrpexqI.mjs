import { g as getServiceClient } from './supabase_BOuP-yIE.mjs';
import { a as notifyNewContact } from './notifications_D1fqCv0k.mjs';
import { g as getClientIp, c as checkRateLimit, i as isValidEmail, t as truncate, s as sanitizeString } from './security_Bv8llNtS.mjs';

const prerender = false;
const POST = async ({ request }) => {
  try {
    const ip = getClientIp(request);
    if (!checkRateLimit(ip, 5, 6e4)) {
      return json({ error: "Too many requests. Please wait a minute." }, 429);
    }
    const body = await request.json();
    const { name, email, company, phone, subject, message } = body;
    if (!name || !email || !subject || !message) {
      return json(
        { error: "Name, email, subject, and message are required." },
        400
      );
    }
    if (!isValidEmail(email)) {
      return json({ error: "Please provide a valid email address." }, 400);
    }
    const cleanName = truncate(sanitizeString(name), 200);
    const cleanEmail = truncate(email.trim().toLowerCase(), 254);
    const cleanCompany = company ? truncate(sanitizeString(company), 200) : null;
    const cleanPhone = phone ? truncate(sanitizeString(phone), 50) : null;
    const cleanSubject = truncate(sanitizeString(subject), 300);
    const cleanMessage = truncate(sanitizeString(message), 5e3);
    if (cleanName.length < 2) {
      return json({ error: "Name must be at least 2 characters." }, 400);
    }
    if (cleanMessage.length < 5) {
      return json({ error: "Message must be at least 5 characters." }, 400);
    }
    const supabase = getServiceClient();
    const { error } = await supabase.from("contact_submissions").insert({
      name: cleanName,
      email: cleanEmail,
      company: cleanCompany,
      phone: cleanPhone,
      subject: cleanSubject,
      message: cleanMessage
    });
    if (error) throw error;
    await notifyNewContact({
      name: cleanName,
      email: cleanEmail,
      company: cleanCompany,
      subject: cleanSubject,
      message: cleanMessage
    });
    return json({ success: true }, 200);
  } catch (e) {
    console.error("Contact form error:", e);
    return json({ error: "Failed to submit. Please try again." }, 500);
  }
};
function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" }
  });
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
