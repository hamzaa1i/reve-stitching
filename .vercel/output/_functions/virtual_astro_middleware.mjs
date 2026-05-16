import { ao as defineMiddleware, bd as sequence } from './chunks/params-and-props_CgCnFJtu.mjs';
import 'piccolore';
import 'clsx';

const onRequest$1 = defineMiddleware(async (context, next) => {
  const path = context.url.pathname;
  if (path.startsWith("/api/")) {
    return next();
  }
  const isAdminRoute = path.startsWith("/admin") || path.startsWith("/admin/");
  const isLoginPage = path === "/admin/login" || path === "/admin/login/";
  if (isAdminRoute && !isLoginPage) {
    try {
      const { verifyAdminToken, COOKIE_CONFIG } = await import('./chunks/auth_BQ4oAavg.mjs');
      const token = context.cookies.get(COOKIE_CONFIG.name)?.value;
      if (!token) {
        console.log("[Middleware] No admin token cookie found, redirecting to login");
        return context.redirect("/admin/login");
      }
      const admin = verifyAdminToken(token);
      if (!admin) {
        console.log("[Middleware] Token invalid or expired, clearing and redirecting");
        context.cookies.delete(COOKIE_CONFIG.name, { path: "/" });
        return context.redirect("/admin/login");
      }
      context.locals.admin = admin;
    } catch (err) {
      console.error("[Middleware] Auth error:", err);
      return context.redirect("/admin/login");
    }
  }
  return next();
});

const onRequest = sequence(
	
	onRequest$1
	
);

export { onRequest };
