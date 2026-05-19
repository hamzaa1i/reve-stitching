import type { APIRoute } from 'astro';
import { getServiceClient } from '../../../lib/supabase';
import {
  checkRateLimit,
  getClientIp,
  sanitizeString,
  truncate,
} from '../../../lib/security';
import { captureException } from '../../../lib/sentry';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const ip = getClientIp(request);
    if (!checkRateLimit(ip, 20, 60_000)) {
      return new Response(
        JSON.stringify({ error: 'Too many messages. Please wait.' }),
        { status: 429, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { sessionId, visitorToken, message } = await request.json();

    if (!sessionId || !visitorToken || !message) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const cleanSessionId = truncate(sanitizeString(sessionId), 100);
    const cleanToken = truncate(sanitizeString(visitorToken), 200);
    const cleanMessage = truncate(sanitizeString(message), 2000);

    if (cleanMessage.length < 1) {
      return new Response(
        JSON.stringify({ error: 'Message cannot be empty.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const supabase = getServiceClient();

    // Verify session belongs to this visitor
    const { data: session } = await supabase
      .from('chat_sessions')
      .select('id, status')
      .eq('id', cleanSessionId)
      .eq('visitor_token', cleanToken)
      .single();

    if (!session) {
      return new Response(
        JSON.stringify({ error: 'Invalid session.' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (session.status === 'closed') {
      return new Response(
        JSON.stringify({ error: 'Chat session is closed.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Insert message
    const { error } = await supabase.from('chat_messages').insert({
      session_id: cleanSessionId,
      sender: 'visitor',
      message: cleanMessage,
    });

    if (error) throw error;

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e) {
    const cleanSessionId = (await request.json().catch(() => ({}))).sessionId;
    const sessionIdForLog = cleanSessionId ? truncate(sanitizeString(cleanSessionId), 100) : 'unknown';
    captureException(e, { route: '/api/chat/send', sessionId: sessionIdForLog });
    return new Response(
      JSON.stringify({ error: 'Failed to send message.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};