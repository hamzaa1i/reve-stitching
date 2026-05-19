import { defineMiddleware } from "astro:middleware";

export const onRequest = defineMiddleware(async (context, next) => {
  const path = context.url.pathname;

  // ━━━ Portal API routes — set user but don't redirect ━━━
  if (path.startsWith("/api/portal/")) {
    try {
      const { validateSession, getSessionCookieName } =
        await import("./lib/portal-auth");
      const token = context.cookies.get(getSessionCookieName())?.value;

      if (token) {
        const result = await validateSession(token);
        if (result) {
          context.locals.user = {
            id: result.user.id,
            email: result.user.email,
            name: result.user.name,
            company: result.user.company,
            role: result.user.role,
            status: result.user.status,
            avatarUrl: result.user.avatarUrl,
          };
        }
      }
    } catch (err) {
      console.error("[Middleware] Portal API auth error:", err);
    }
    return next();
  }

  // ━━━ Skip other API routes (they handle their own auth) ━━━
  if (path.startsWith("/api/")) {
    return next();
  }

  // ━━━ Admin routes (existing — unchanged) ━━━
  const isAdminRoute = path.startsWith("/admin") || path.startsWith("/admin/");
  const isAdminLogin = path === "/admin/login" || path === "/admin/login/";

  if (isAdminRoute && !isAdminLogin) {
    try {
      const { verifyAdminToken, COOKIE_CONFIG } = await import("./lib/auth");
      const token = context.cookies.get(COOKIE_CONFIG.name)?.value;

      if (!token) {
        return context.redirect("/admin/login");
      }

      const admin = verifyAdminToken(token);
      if (!admin) {
        context.cookies.delete(COOKIE_CONFIG.name, { path: "/" });
        return context.redirect("/admin/login");
      }

      context.locals.admin = admin;
    } catch (err) {
      console.error("[Middleware] Admin auth error:", err);
      return context.redirect("/admin/login");
    }
  }

  // ━━━ Portal page routes ━━━
  const isPortalRoute =
    path.startsWith("/portal") || path.startsWith("/portal/");
  const isPortalPublic =
    path === "/portal/login" ||
    path === "/portal/register" ||
    path === "/portal/forgot-password";

  if (isPortalRoute && !isPortalPublic) {
    try {
      const { validateSession, getSessionCookieName } =
        await import("./lib/portal-auth");
      const token = context.cookies.get(getSessionCookieName())?.value;

      if (!token) {
        return context.redirect("/portal/login");
      }

      const result = await validateSession(token);
      if (!result) {
        context.cookies.delete(getSessionCookieName(), { path: "/" });
        return context.redirect("/portal/login");
      }

      context.locals.user = {
        id: result.user.id,
        email: result.user.email,
        name: result.user.name,
        company: result.user.company,
        role: result.user.role,
        status: result.user.status,
        avatarUrl: result.user.avatarUrl,
      };
    } catch (err) {
      console.error("[Middleware] Portal auth error:", err);
      return context.redirect("/portal/login");
    }
  }

  return next();
});
