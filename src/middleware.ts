import { defineMiddleware } from 'astro:middleware';
import { verifyAdminToken, COOKIE_CONFIG } from './lib/auth';

export const onRequest = defineMiddleware(async (context, next) => {
  const path = context.url.pathname;

  // Only protect /admin routes (except login and logout)
  if (path.startsWith('/admin') && !path.startsWith('/admin/login')) {
    const token = context.cookies.get(COOKIE_CONFIG.name)?.value;

    if (!token) {
      return context.redirect('/admin/login');
    }

    // Verify token using new auth system
    const admin = verifyAdminToken(token);

    if (!admin) {
      context.cookies.delete(COOKIE_CONFIG.name, { path: '/' });
      return context.redirect('/admin/login');
    }

    // Attach admin to locals for use in pages
    context.locals.admin = admin;
  }

  return next();
});