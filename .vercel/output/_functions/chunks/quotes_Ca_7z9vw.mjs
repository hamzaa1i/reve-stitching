import { c as createComponent } from './astro-component_jWm3wabT.mjs';
import 'piccolore';
import { b8 as renderTemplate, aW as maybeRenderHead, a5 as addAttribute } from './params-and-props_CgCnFJtu.mjs';
import { r as renderComponent } from './entrypoint_Bu1exgrV.mjs';
import { $ as $$AdminLayout } from './AdminLayout_aVs5BGT6.mjs';
import { createClient } from '@supabase/supabase-js';
import { S as STATUS_META, P as PRODUCT_NAMES } from './quote_D5oWnva4.mjs';

const prerender = false;
const $$Quotes = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Quotes;
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
  const url = Astro2.url;
  const statusFilter = url.searchParams.get("status") || "all";
  const searchQuery = (url.searchParams.get("q") || "").trim();
  const page = Math.max(1, Number(url.searchParams.get("page")) || 1);
  const perPage = 20;
  const { data: statsRow } = await supabase.from("quote_stats").select("*").single();
  const stats = statsRow || {
    total: 0,
    new_count: 0,
    reviewed_count: 0,
    quoted_count: 0,
    converted_count: 0,
    rejected_count: 0,
    last_7_days: 0};
  let query = supabase.from("quote_requests").select("*", { count: "exact" }).order("created_at", { ascending: false }).range((page - 1) * perPage, page * perPage - 1);
  if (statusFilter !== "all") {
    query = query.eq("status", statusFilter);
  }
  if (searchQuery) {
    query = query.or(
      `company_name.ilike.%${searchQuery}%,reference_number.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%,contact_person.ilike.%${searchQuery}%`
    );
  }
  const { data: quotes, count } = await query;
  const totalPages = Math.ceil((count || 0) / perPage);
  function formatDate(iso) {
    return new Date(iso).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  }
  function timeAgo(iso) {
    const diff = Date.now() - new Date(iso).getTime();
    const hours = Math.floor(diff / 36e5);
    if (hours < 1) return "Just now";
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days === 1) return "Yesterday";
    return `${days}d ago`;
  }
  const statusTabs = [
    { key: "all", label: "All", count: stats.total },
    { key: "new", label: "New", count: stats.new_count },
    { key: "reviewed", label: "Reviewed", count: stats.reviewed_count },
    { key: "quoted", label: "Quoted", count: stats.quoted_count },
    { key: "converted", label: "Converted", count: stats.converted_count },
    { key: "rejected", label: "Rejected", count: stats.rejected_count }
  ];
  return renderTemplate`${renderComponent($$result, "AdminLayout", $$AdminLayout, { "title": "Quote Requests" }, { "default": async ($$result2) => renderTemplate`  ${maybeRenderHead()}<div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"> <div> <h1 class="text-2xl font-bold text-gray-900">Quote Requests</h1> <p class="mt-1 text-sm text-gray-500"> ${stats.last_7_days} new in the last 7 days • ${stats.total} total
</p> </div> <form method="GET" class="flex gap-2"> <input type="hidden" name="status"${addAttribute(statusFilter, "value")}> <input type="text" name="q"${addAttribute(searchQuery, "value")} placeholder="Search company, ref, email…" class="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm shadow-sm focus:border-green-700 focus:outline-none focus:ring-2 focus:ring-green-600/30 sm:w-72"> <button type="submit" class="shrink-0 rounded-lg bg-green-800 px-4 py-2 text-sm font-medium text-white shadow transition hover:bg-green-700">
Search
</button> </form> </div>  <div class="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4"> <div class="rounded-xl bg-white p-4 shadow ring-1 ring-gray-200"> <p class="text-xs font-medium text-gray-500">Total Quotes</p> <p class="mt-1 text-2xl font-bold text-gray-900">${stats.total}</p> </div> <div class="rounded-xl bg-blue-50 p-4 shadow ring-1 ring-blue-200"> <p class="text-xs font-medium text-blue-600">Awaiting Review</p> <p class="mt-1 text-2xl font-bold text-blue-800">${stats.new_count}</p> </div> <div class="rounded-xl bg-green-50 p-4 shadow ring-1 ring-green-200"> <p class="text-xs font-medium text-green-600">Quoted</p> <p class="mt-1 text-2xl font-bold text-green-800">${stats.quoted_count}</p> </div> <div class="rounded-xl bg-purple-50 p-4 shadow ring-1 ring-purple-200"> <p class="text-xs font-medium text-purple-600">Converted</p> <p class="mt-1 text-2xl font-bold text-purple-800">${stats.converted_count}</p> </div> </div>  <div class="mb-4 flex gap-1 overflow-x-auto rounded-lg bg-gray-200/60 p-1"> ${statusTabs.map((tab) => renderTemplate`<a${addAttribute(`/admin/quotes?status=${tab.key}${searchQuery ? `&q=${encodeURIComponent(searchQuery)}` : ""}`, "href")}${addAttribute([
    "flex items-center gap-1.5 whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition",
    statusFilter === tab.key ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
  ], "class:list")}> ${tab.label} <span${addAttribute([
    "rounded-full px-1.5 py-0.5 text-xs",
    statusFilter === tab.key ? "bg-green-100 text-green-800" : "bg-gray-200 text-gray-500"
  ], "class:list")}> ${tab.count} </span> </a>`)} </div>  <div class="overflow-hidden rounded-xl bg-white shadow ring-1 ring-gray-200"> <div class="overflow-x-auto"> <table class="w-full text-sm"> <thead> <tr class="border-b border-gray-100 bg-gray-50/60 text-left text-xs font-medium uppercase tracking-wider text-gray-500"> <th class="px-5 py-3">Reference</th> <th class="px-5 py-3">Company</th> <th class="px-5 py-3">Product</th> <th class="px-5 py-3 text-right">Qty</th> <th class="px-5 py-3">Status</th> <th class="px-5 py-3">Date</th> <th class="px-5 py-3 text-right">Actions</th> </tr> </thead> <tbody class="divide-y divide-gray-50"> ${!quotes || quotes.length === 0 ? renderTemplate`<tr> <td colspan="7" class="px-5 py-12 text-center text-gray-400"> <svg class="mx-auto mb-3 h-10 w-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path></svg>
No quotes found.
</td> </tr>` : quotes.map((q) => {
    const sm = STATUS_META[q.status] || STATUS_META.new;
    return renderTemplate`<tr class="transition hover:bg-gray-50"> <td class="whitespace-nowrap px-5 py-3.5"> <a${addAttribute(`/admin/quote/${q.id}`, "href")} class="font-mono text-sm font-semibold text-green-800 hover:underline"> ${q.reference_number} </a> ${q.is_rush && renderTemplate`<span class="ml-1.5 text-xs" title="Rush order">⚡</span>`} </td> <td class="px-5 py-3.5"> <div class="font-medium text-gray-900">${q.company_name}</div> <div class="text-xs text-gray-500">${q.contact_person}</div> </td> <td class="px-5 py-3.5 text-gray-700"> ${PRODUCT_NAMES[q.product_type] || q.product_type} </td> <td class="whitespace-nowrap px-5 py-3.5 text-right font-semibold text-gray-900"> ${q.quantity.toLocaleString()} </td> <td class="px-5 py-3.5"> <span${addAttribute(["inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold", sm.bg, sm.color], "class:list")}> ${sm.label} </span> </td> <td class="whitespace-nowrap px-5 py-3.5 text-gray-500"${addAttribute(formatDate(q.created_at), "title")}> ${timeAgo(q.created_at)} </td> <td class="whitespace-nowrap px-5 py-3.5 text-right"> <a${addAttribute(`/admin/quote/${q.id}`, "href")} class="inline-flex items-center gap-1 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-50 hover:shadow">
View
<svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"></path></svg> </a> </td> </tr>`;
  })} </tbody> </table> </div> ${totalPages > 1 && renderTemplate`<div class="flex items-center justify-between border-t border-gray-100 px-5 py-3"> <p class="text-xs text-gray-500">
Showing ${(page - 1) * perPage + 1}–${Math.min(page * perPage, count || 0)} of ${count} </p> <div class="flex gap-1"> ${page > 1 && renderTemplate`<a${addAttribute(`/admin/quotes?status=${statusFilter}&page=${page - 1}${searchQuery ? `&q=${encodeURIComponent(searchQuery)}` : ""}`, "href")} class="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50">
← Prev
</a>`} ${page < totalPages && renderTemplate`<a${addAttribute(`/admin/quotes?status=${statusFilter}&page=${page + 1}${searchQuery ? `&q=${encodeURIComponent(searchQuery)}` : ""}`, "href")} class="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50">
Next →
</a>`} </div> </div>`} </div> ` })}`;
}, "/home/hamzaa1i/reve-stitching/src/pages/admin/quotes.astro", void 0);

const $$file = "/home/hamzaa1i/reve-stitching/src/pages/admin/quotes.astro";
const $$url = "/admin/quotes";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Quotes,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
