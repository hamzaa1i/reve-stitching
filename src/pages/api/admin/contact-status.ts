import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';
import { getAdminFromCookies } from '../../../lib/auth';
import { isSameOriginRequest } from '../../../lib/admin-operations';
import { json } from '../../../lib/utils';

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies }) => {
  const admin = getAdminFromCookies(cookies);
  if (!admin) {
    return json({ error: 'Unauthorized' }, 401);
  }

  if (!isSameOriginRequest(request)) return json({ error: 'Cross-site request rejected' }, 403);

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid JSON body' }, 400);
  }

  const parsed = z.object({
    id: z.string().trim().min(1).max(128),
    status: z.enum(['new', 'read']),
  }).strict().safeParse(body);
  if (!parsed.success) return json({ error: 'Invalid contact status update' }, 400);

  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  const { data, error } = await supabase
    .from('contact_submissions')
    .update({ status: parsed.data.status })
    .eq('id', parsed.data.id)
    .select('id')
    .maybeSingle();

  if (error) {
    console.error('[Admin Contacts] Status update failed');
    return json({ error: 'Contact status could not be updated' }, 500);
  }
  if (!data) return json({ error: 'Contact submission not found' }, 404);

  return json({ success: true, status: parsed.data.status });
};
