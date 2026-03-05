// src/pages/admin/logout.ts

import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ cookies, redirect }) => {
  cookies.delete('admin_token', { path: '/' });
  return redirect('/admin/login');
};

// Also support GET for convenience
export const GET: APIRoute = async ({ cookies, redirect }) => {
  cookies.delete('admin_token', { path: '/' });
  return redirect('/admin/login');
};