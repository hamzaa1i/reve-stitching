import type { APIRoute } from 'astro';
import { getServiceClient } from '../../lib/supabase';
import { notifyNewContact } from '../../lib/notifications';
import {
  checkRateLimit,
  getClientIp,
  sanitizeString,
  isValidEmail,
  truncate,
  isHoneypotTriggered,
  verifyTurnstile,
} from '../../lib/security';
import { initSentry, captureException } from '../../lib/sentry';

export const prerender = false;

initSentry();

export const POST: APIRoute = async ({ request }) => {
  try {
    const ip = getClientIp(request);
    if (!checkRateLimit(ip, 5, 60_000)) {
      return json({ error: 'Too many requests. Please wait a minute.' }, 429);
    }

    const body = await request.json();

    // Honeypot check — silently reject bot submissions
    if (isHoneypotTriggered(body)) {
      // Return success to not alert the bot
      return json({ success: true }, 200);
    }

    // Turnstile check
    if (!await verifyTurnstile(body.cf_turnstile_response)) {
      return json({ error: 'Spam verification failed. Please try again.' }, 403);
    }

    const { name, email, company, phone, subject, message } = body;

    // Validation
    if (!name || !email || !subject || !message) {
      return json(
        { error: 'Name, email, subject, and message are required.' },
        400
      );
    }

    if (!isValidEmail(email)) {
      return json({ error: 'Please provide a valid email address.' }, 400);
    }

    // Sanitize + truncate
    const cleanName = truncate(sanitizeString(name), 200);
    const cleanEmail = truncate(email.trim().toLowerCase(), 254);
    const cleanCompany = company
      ? truncate(sanitizeString(company), 200)
      : null;
    const cleanPhone = phone ? truncate(sanitizeString(phone), 50) : null;
    const cleanSubject = truncate(sanitizeString(subject), 300);
    const cleanMessage = truncate(sanitizeString(message), 5000);

    if (cleanName.length < 2) {
      return json({ error: 'Name must be at least 2 characters.' }, 400);
    }

    if (cleanMessage.length < 5) {
      return json({ error: 'Message must be at least 5 characters.' }, 400);
    }

    const supabase = getServiceClient();
    const { error } = await supabase.from('contact_submissions').insert({
      name: cleanName,
      email: cleanEmail,
      company: cleanCompany,
      phone: cleanPhone,
      subject: cleanSubject,
      message: cleanMessage,
    });

    if (error) throw error;

    await notifyNewContact({
      name: cleanName,
      email: cleanEmail,
      company: cleanCompany,
      subject: cleanSubject,
      message: cleanMessage,
    });

    return json({ success: true }, 200);
  } catch (e) {
    captureException(e, { route: '/api/contact' });
    return json({ error: 'Failed to submit. Please try again.' }, 500);
  }
};

function json(data: object, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}