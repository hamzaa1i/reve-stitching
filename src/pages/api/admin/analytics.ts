import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';
import { getQuoteAnalytics } from '../../../lib/analytics';
import { getAdminFromCookies } from '../../../lib/auth';

export const prerender = false;

export const GET: APIRoute = async ({ cookies }) => {
  try {
    // Auth check using new system
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

    // Fetch analytics
    const analytics = await getQuoteAnalytics(supabase);

    // Fetch contacts
    const { data: contacts } = await supabase
      .from('contact_submissions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    // Fetch sessions
    const { data: sessions } = await supabase
      .from('chat_sessions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    return new Response(
      JSON.stringify({
        analytics,
        contacts: contacts || [],
        sessions: sessions || [],
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'private, max-age=60',
        },
      }
    );
  } catch (error: any) {
    console.error('❌ Analytics API error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to fetch analytics' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};