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

    const { count: totalContacts } = await supabase
      .from('contact_submissions')
      .select('*', { count: 'exact', head: true });

    const { count: newContacts } = await supabase
      .from('contact_submissions')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'new');

    const { count: waitingChats } = await supabase
      .from('chat_sessions')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'waiting');

    const { count: activeChats } = await supabase
      .from('chat_sessions')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active');

    return new Response(
      JSON.stringify({
        totalContacts: totalContacts || 0,
        newContacts: newContacts || 0,
        waitingChats: waitingChats || 0,
        activeChats: activeChats || 0,
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