import { c as createComponent } from './astro-component_jWm3wabT.mjs';
import 'piccolore';
import { b8 as renderTemplate, b5 as renderSlot, a5 as addAttribute, b4 as renderHead } from './params-and-props_CgCnFJtu.mjs';
import 'clsx';
/* empty css                 */

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$AdminLayout = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$AdminLayout;
  const { title } = Astro2.props;
  const currentPath = Astro2.url.pathname;
  const admin = Astro2.locals.admin;
  const adminEmail = admin?.sub || "";
  return renderTemplate(_a || (_a = __template(['<html lang="en"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta name="robots" content="noindex, nofollow"><title>', ' | Reve Admin</title><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">', '</head> <body class="bg-zinc-50 min-h-screen font-[Inter,sans-serif]"> <!-- Admin Navigation --> <nav class="bg-white border-b border-zinc-200 sticky top-0 z-50"> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> <div class="flex items-center justify-between h-16"> <div class="flex items-center gap-8"> <a href="/admin" class="flex items-center gap-2 text-lg font-bold text-zinc-900"> <span class="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white"> <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"> <path stroke-linecap="round" stroke-linejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path> </svg> </span> <span><span class="text-primary">Reve</span> Admin</span> </a> <div class="hidden sm:flex items-center gap-1"> <a href="/admin"', '>\nDashboard\n</a> <a href="/admin/quotes"', '>\nQuotes\n</a> <a href="/admin/samples"', '>\nSamples\n</a> <a href="/admin/email-templates"', '>\nEmail Settings\n</a> </div> </div> <div class="flex items-center gap-4"> ', ' <button id="logout-btn" class="flex items-center gap-2 px-4 py-2 text-sm font-medium text-zinc-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"> <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"> <path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path> </svg>\nLogout\n</button> </div> </div> </div> </nav> <!-- Page Content --> <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"> ', " </main> <script>\n      document.getElementById('logout-btn')?.addEventListener('click', async () => {\n        const btn = document.getElementById('logout-btn');\n        if (btn) {\n          btn.disabled = true;\n          btn.textContent = 'Logging out...';\n        }\n        try {\n          await fetch('/api/auth/logout', { \n            method: 'POST', \n            headers: {\n              'Content-Type': 'application/json',\n              'Accept': 'application/json'\n            },\n            credentials: 'include' \n          });\n        } catch (e) {}\n        window.location.href = '/admin/login';\n      });\n    <\/script> </body> </html>"])), title, renderHead(), addAttribute([
    "px-3 py-2 rounded-lg text-sm font-medium transition-colors",
    currentPath === "/admin" || currentPath === "/admin/" ? "bg-primary/10 text-primary" : "text-zinc-600 hover:bg-zinc-100"
  ], "class:list"), addAttribute([
    "px-3 py-2 rounded-lg text-sm font-medium transition-colors",
    currentPath.includes("/quote") ? "bg-primary/10 text-primary" : "text-zinc-600 hover:bg-zinc-100"
  ], "class:list"), addAttribute([
    "px-3 py-2 rounded-lg text-sm font-medium transition-colors",
    currentPath.includes("/samples") ? "bg-primary/10 text-primary" : "text-zinc-600 hover:bg-zinc-100"
  ], "class:list"), addAttribute([
    "px-3 py-2 rounded-lg text-sm font-medium transition-colors",
    currentPath.includes("/email-template") ? "bg-primary/10 text-primary" : "text-zinc-600 hover:bg-zinc-100"
  ], "class:list"), adminEmail && renderTemplate`<span class="hidden sm:block text-xs text-zinc-400">${adminEmail}</span>`, renderSlot($$result, $$slots["default"]));
}, "/home/hamzaa1i/reve-stitching/src/layouts/AdminLayout.astro", void 0);

export { $$AdminLayout as $ };
