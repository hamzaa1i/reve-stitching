import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://jmeqighdvacggmwtbxfo.supabase.co";
const supabaseServiceKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImptZXFpZ2hkdmFjZ2dtd3RieGZvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjY5Njg0NiwiZXhwIjoyMDg4MjcyODQ2fQ.lRRLm5eQnXNYY4N8BSSPoNzoRPKY7zHThGRY5-ooEA0";
function getServiceClient() {
  return createClient(supabaseUrl, supabaseServiceKey);
}
let _supabase = null;
function getSupabase() {
  if (_supabase) return _supabase;
  _supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
  return _supabase;
}

export { getSupabase as a, getServiceClient as g };
