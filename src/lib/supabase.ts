import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY;

// Server-side client (bypasses RLS — for API routes)
export function getServiceClient() {
  return createClient(supabaseUrl, supabaseServiceKey);
}

// Authenticated client (for admin pages — respects RLS)
export function getAuthClient(accessToken: string) {
  return createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: { Authorization: `Bearer ${accessToken}` },
    },
  });
}

// Public config (for client-side scripts)
export const supabaseConfig = {
  url: supabaseUrl,
  anonKey: supabaseAnonKey,
};

// ═══════════════════════════════════════════════════
// QUOTE SYSTEM CLIENT (singleton with caching)
// ═══════════════════════════════════════════════════

let _supabase: ReturnType<typeof createClient> | null = null;

/**
 * Singleton Supabase client for quote system
 * Uses service role key with caching for performance
 */
export function getSupabase() {
  if (_supabase) return _supabase;
  
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase credentials');
  }
  
  _supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: { 
      autoRefreshToken: false, 
      persistSession: false 
    }
  });
  
  return _supabase;
}