import { COOKIE_CONFIG } from './auth_BQ4oAavg.mjs';

const prerender = false;
const POST = async ({ cookies }) => {
  cookies.delete(COOKIE_CONFIG.name, { path: "/" });
  console.log("[Auth] Admin logged out");
  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
