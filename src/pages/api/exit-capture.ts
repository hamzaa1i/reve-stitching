import type { APIRoute } from 'astro';
import { getServiceClient } from '../../lib/supabase';
import {
  checkRateLimit,
  getClientIp,
  isValidEmail,
  truncate,
} from '../../lib/security';
import { captureException } from '../../lib/sentry';
import { json } from '../../lib/utils';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const ip = getClientIp(request);
    if (!checkRateLimit(ip, 3, 60_000)) {
      return json({ error: 'Too many requests' }, 429);
    }

    const { email } = await request.json();
    if (!email || !isValidEmail(email)) {
      return json({ error: 'Valid email required' }, 400);
    }

    const cleanEmail = truncate(email.trim().toLowerCase(), 254);

    const supabase = getServiceClient();
    const { error } = await supabase.from('contact_submissions').insert({
      name: 'Exit Intent Capture',
      email: cleanEmail,
      subject: 'Capability Deck Request',
      message: 'Requested via exit-intent popup on website.',
    });

    if (error) throw error;

    // TODO: Send capability deck email via Resend here
    // await sendCapabilityDeck(cleanEmail);

    return json({ success: true }, 200);
  } catch (e) {
    captureException(e, { route: '/api/exit-capture' });
    return json({ error: 'Failed to process request' }, 500);
  }
};
