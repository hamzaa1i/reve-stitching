// src/pages/api/admin/chat/[id]/poll.ts
//
// Phase 2.3: Server-side admin chat poll endpoint.
//
// Replaces the browser-side Supabase polling in admin/chat/[id].astro.
// Returns new visitor messages since the provided `after` timestamp.
//
// GET /api/admin/chat/[id]/poll?after=2026-06-26T10:00:00.000Z
//   Returns: { messages: [{ id, sender, message, created_at }], sessionStatus: string }

import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';
import { getAdminFromCookies } from '../../../../../lib/auth';

export const prerender = false;

function json(data: object, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store, no-cache, must-revalidate',
    },
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

export const GET: APIRoute = async ({ params, request, cookies }) => {
  // ── 1. Verify admin auth ──
  const admin = getAdminFromCookies(cookies);
  if (!admin) {
    return json({ error: 'Unauthorized' }, 401);
  }

  const { id: sessionId } = params;
  if (!sessionId) {
    return json({ error: 'Missing session id' }, 400);
  }

  const url = new URL(request.url);
  const after = url.searchParams.get('after') || '1970-01-01T00:00:00.000Z';

  const supabase = getSupabase();

  // ── 2. Fetch session status ──
  const { data: session, error: sessionErr } = await supabase
    .from('chat_sessions')
    .select('id, status')
    .eq('id', sessionId)
    .single();

  if (sessionErr || !session) {
    return json({ error: 'Session not found' }, 404);
  }

  // ── 3. Fetch new visitor messages since `after` ──
  // Only fetch visitor messages — admin messages are rendered optimistically
  // by the admin page on send, so the server doesn't need to echo them back.
  const { data: messages, error: msgErr } = await supabase
    .from('chat_messages')
    .select('id, sender, message, created_at')
    .eq('session_id', sessionId)
    .eq('sender', 'visitor')
    .gt('created_at', after)
    .order('created_at', { ascending: true });

  if (msgErr) {
    console.error('[Admin Chat] Poll error:', msgErr);
    return json({ error: 'Failed to fetch messages' }, 500);
  }

  return json({
    messages: messages || [],
    sessionStatus: session.status,
  });
};
