// src/pages/api/auth/logout.ts

import type { APIRoute } from 'astro';
import { COOKIE_CONFIG } from '../../../lib/auth';

export const prerender = false;

export const POST: APIRoute = async ({ cookies }) => {
  cookies.delete(COOKIE_CONFIG.name, { path: '/' });

  console.log('[Auth] Admin logged out');

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};