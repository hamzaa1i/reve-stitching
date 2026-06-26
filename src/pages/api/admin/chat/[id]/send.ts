// src/pages/api/admin/chat/[id]/send.ts
//
// Phase 2.3: Server-side admin chat write endpoint.
//
// Replaces the previous browser-side Supabase writes in admin/chat/[id].astro
// (audit finding C-013). The browser used the public anon key to insert admin
// messages and close sessions — anyone with the anon key could replay the
// writes. This route uses the service-role key server-side and verifies the
// admin cookie before any DB mutation.
//
// POST /api/admin/chat/[id]/send
//   Body: { message: string }
//   Inserts an admin-side chat message into chat_messages.
//   Returns: { success: true, id, created_at }
//
// POST /api/admin/chat/[id]/send?action=close
//   Closes the chat session and inserts a system message.
//   Returns: { success: true }

import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';
import { getAdminFromCookies } from '../../../../../lib/auth';
import { truncate, sanitizeString } from '../../../../../lib/security';

export const prerender = false;

function json(data: object, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function getSupabase() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error('Supabase credentials not configured');
  }
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

export const POST: APIRoute = async ({ params, request, cookies }) => {
  // ── 1. Verify admin auth ──
  const admin = getAdminFromCookies(cookies);
  if (!admin) {
    return json({ error: 'Unauthorized' }, 401);
  }

  const { id: sessionId } = params;
  if (!sessionId) {
    return json({ error: 'Missing session id' }, 400);
  }

  // ── 2. Parse body ──
  let body: any;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid JSON body' }, 400);
  }

  const action = new URL(request.url).searchParams.get('action');
  const supabase = getSupabase();

  // ── 3a. Close session action ──
  if (action === 'close') {
    // Verify session exists and isn't already closed
    const { data: session, error: sessionErr } = await supabase
      .from('chat_sessions')
      .select('id, status')
      .eq('id', sessionId)
      .single();

    if (sessionErr || !session) {
      return json({ error: 'Session not found' }, 404);
    }
    if (session.status === 'closed') {
      return json({ error: 'Session is already closed' }, 400);
    }

    // Update session status
    const { error: updateErr } = await supabase
      .from('chat_sessions')
      .update({ status: 'closed' })
      .eq('id', sessionId);

    if (updateErr) {
      console.error('[Admin Chat] Close session error:', updateErr);
      return json({ error: 'Failed to close session' }, 500);
    }

    // Insert system message
    const { error: msgErr } = await supabase
      .from('chat_messages')
      .insert({
        session_id: sessionId,
        sender: 'admin',
        message: 'This chat session has been closed. Thank you for contacting us!',
      });

    if (msgErr) {
      console.error('[Admin Chat] System message insert error:', msgErr);
      // Non-fatal — session is already closed
    }

    console.log(`[Admin Chat] Session ${sessionId} closed by ${admin.sub}`);
    return json({ success: true });
  }

  // ── 3b. Send message action (default) ──
  const message = body?.message;
  if (!message || typeof message !== 'string') {
    return json({ error: 'Message is required' }, 400);
  }

  // Sanitize + truncate (defense-in-depth; the admin page also clamps client-side)
  const cleanMessage = truncate(sanitizeString(message), 2000);
  if (cleanMessage.length < 1) {
    return json({ error: 'Message cannot be empty' }, 400);
  }

  // Verify session exists and is open
  const { data: session, error: sessionErr } = await supabase
    .from('chat_sessions')
    .select('id, status')
    .eq('id', sessionId)
    .single();

  if (sessionErr || !session) {
    return json({ error: 'Session not found' }, 404);
  }
  if (session.status === 'closed') {
    return json({ error: 'Cannot send to a closed session' }, 400);
  }

  // Insert the admin message
  const { data: inserted, error: insertErr } = await supabase
    .from('chat_messages')
    .insert({
      session_id: sessionId,
      sender: 'admin',
      message: cleanMessage,
    })
    .select('id, created_at')
    .single();

  if (insertErr || !inserted) {
    console.error('[Admin Chat] Message insert error:', insertErr);
    return json({ error: 'Failed to send message' }, 500);
  }

  return json({ success: true, id: inserted.id, created_at: inserted.created_at });
};
