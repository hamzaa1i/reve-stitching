import type { APIRoute } from 'astro';
import { getServiceClient } from '../../../lib/supabase';
import { notifyNewChat } from '../../../lib/notifications';
import {
  checkRateLimit,
  getClientIp,
  sanitizeString,
  truncate,
  isHoneypotTriggered,
  verifyTurnstile,
} from '../../../lib/security';
import { initSentry, captureException } from '../../../lib/sentry';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    initSentry();

    const ip = getClientIp(request);
    if (!checkRateLimit(ip, 10, 60_000)) {
      return new Response(
        JSON.stringify({ error: 'Too many requests. Please wait.' }),
        { status: 429, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { visitorToken, visitorName, visitorEmail } = await request.json();

    // Honeypot check (simple: if visitorName equals 'bot', treat as spam)
    if (isHoneypotTriggered({ website: visitorName === 'bot' ? 'triggered' : '' })) {
      return new Response(JSON.stringify({ error: 'Failed to create session.' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Turnstile check – chat doesn't send token, so skip if not configured
    if (!await verifyTurnstile(undefined)) {
      // No token provided – ignore for now
    }

    if (!visitorToken || typeof visitorToken !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Visitor token required.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const cleanToken = truncate(sanitizeString(visitorToken), 200);
    const cleanName = visitorName
      ? truncate(sanitizeString(visitorName), 200)
      : null;
    const cleanEmail = visitorEmail
      ? truncate(sanitizeString(visitorEmail), 254)
      : null;

    const supabase = getServiceClient();

    // Check for existing active session
    const { data: existing } = await supabase
      .from('chat_sessions')
      .select('id')
      .eq('visitor_token', cleanToken)
      .in('status', ['waiting', 'active'])
      .single();

    if (existing) {
      return new Response(
        JSON.stringify({ sessionId: existing.id }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Create new session
    const { data, error } = await supabase
      .from('chat_sessions')
      .insert({
        visitor_token: cleanToken,
        visitor_name: cleanName,
        visitor_email: cleanEmail,
        status: 'waiting',
      })
      .select('id')
      .single();

    if (error) throw error;

    await notifyNewChat({
      sessionId: data.id,
      visitorName: cleanName,
      visitorEmail: cleanEmail,
    });

    return new Response(JSON.stringify({ sessionId: data.id }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e) {
    captureException(e, { route: '/api/chat/session' });
    return new Response(
      JSON.stringify({ error: 'Failed to create session.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};