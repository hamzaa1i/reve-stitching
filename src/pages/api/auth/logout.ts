import type { APIRoute } from 'astro';
import { COOKIE_CONFIG } from '../../../lib/auth';
import { isSameOriginRequest } from '../../../lib/admin-operations';

export const prerender = false;

export const POST: APIRoute = async ({ cookies, request }) => {
  if (!isSameOriginRequest(request)) {
    return new Response(JSON.stringify({ error: 'Forbidden' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  cookies.delete(COOKIE_CONFIG.name, { path: '/' });
  console.log('[Auth] Admin logged out');
  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
