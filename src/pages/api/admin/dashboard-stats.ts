import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';
import { getAdminFromCookies } from '../../../lib/auth';

export const prerender = false;

export const GET: APIRoute = async ({ cookies }) => {
  try {
    // Auth check
    const admin = getAdminFromCookies(cookies);
    if (!admin) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Create Supabase client with service role
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    const [totalResult, newResult, waitingResult, activeResult] = await Promise.all([
      supabase.from('contact_submissions').select('id', { count: 'exact', head: true }),
      supabase.from('contact_submissions').select('id', { count: 'exact', head: true }).eq('status', 'new'),
      supabase.from('chat_sessions').select('id', { count: 'exact', head: true }).eq('status', 'waiting'),
      supabase.from('chat_sessions').select('id', { count: 'exact', head: true }).eq('status', 'active'),
    ]);
    if ([totalResult, newResult, waitingResult, activeResult].some((result) => result.error)) throw new Error('Count query failed');

    return new Response(
      JSON.stringify({
        totalContacts: totalResult.count || 0,
        newContacts: newResult.count || 0,
        waitingChats: waitingResult.count || 0,
        activeChats: activeResult.count || 0,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (e: any) {
    console.error('[Dashboard Stats] Error:', e);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch stats' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};
