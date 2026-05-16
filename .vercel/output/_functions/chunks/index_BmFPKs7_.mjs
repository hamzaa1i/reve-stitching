import { c as createComponent } from './astro-component_jWm3wabT.mjs';
import 'piccolore';
import { b8 as renderTemplate, aW as maybeRenderHead, a5 as addAttribute } from './params-and-props_CgCnFJtu.mjs';
import { r as renderComponent } from './entrypoint_Bu1exgrV.mjs';
import { r as renderScript } from './script_CN3n2meJ.mjs';
import { $ as $$AdminLayout } from './AdminLayout_aVs5BGT6.mjs';
import { createClient } from '@supabase/supabase-js';
import { S as SAMPLE_STATUS_CONFIG } from './sample_36eUEm5r.mjs';

const prerender = false;
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Index;
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
  const statusFilter = Astro2.url.searchParams.get("status") || "all";
  const searchQuery = Astro2.url.searchParams.get("search") || "";
  let query = supabase.from("sample_requests").select("*", { count: "exact" }).order("created_at", { ascending: false });
  if (statusFilter !== "all") {
    query = query.eq("status", statusFilter);
  }
  if (searchQuery) {
    query = query.or(`company_name.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%,reference_number.ilike.%${searchQuery}%`);
  }
  const { data: samples, error, count } = await query;
  const samplesList = samples || [];
  function formatDate(iso) {
    return new Date(iso).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  }
  return renderTemplate`${renderComponent($$result, "AdminLayout", $$AdminLayout, { "title": "Sample Requests" }, { "default": async ($$result2) => renderTemplate`  ${maybeRenderHead()}<div class="mb-6 flex items-center justify-between"> <div> <h1 class="text-2xl font-bold text-zinc-900">Sample Requests</h1> <p class="text-sm text-zinc-500 mt-1">Manage physical sample requests from buyers</p> </div> <a href="/samples" target="_blank" class="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-2"> <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"> <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"></path> </svg>
View Public Form
</a> </div>  <div class="mb-6 flex flex-col sm:flex-row gap-4"> <!-- Status Filter --> <div class="flex-1"> <select id="statusFilter" class="w-full px-4 py-2 rounded-lg border border-zinc-300 focus:border-primary focus:ring-2 focus:ring-primary/20"> <option value="all"${addAttribute(statusFilter === "all", "selected")}>All Statuses</option> <option value="new"${addAttribute(statusFilter === "new", "selected")}>New</option> <option value="approved"${addAttribute(statusFilter === "approved", "selected")}>Approved</option> <option value="production"${addAttribute(statusFilter === "production", "selected")}>In Production</option> <option value="shipped"${addAttribute(statusFilter === "shipped", "selected")}>Shipped</option> <option value="delivered"${addAttribute(statusFilter === "delivered", "selected")}>Delivered</option> <option value="converted"${addAttribute(statusFilter === "converted", "selected")}>Converted</option> <option value="rejected"${addAttribute(statusFilter === "rejected", "selected")}>Rejected</option> </select> </div> <!-- Search --> <div class="flex-1"> <input type="text" id="searchInput"${addAttribute(searchQuery, "value")} placeholder="Search by company, email, or reference..." class="w-full px-4 py-2 rounded-lg border border-zinc-300 focus:border-primary focus:ring-2 focus:ring-primary/20"> </div> </div>  <div class="mb-4 text-sm text-zinc-600">
Found ${count || 0} sample${(count || 0) !== 1 ? "s" : ""} </div>  ${error ? renderTemplate`<div class="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
Error loading samples: ${error.message} </div>` : samplesList.length === 0 ? renderTemplate`<div class="bg-white rounded-xl border border-zinc-200 p-12 text-center"> <svg class="h-12 w-12 text-zinc-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"> <path stroke-linecap="round" stroke-linejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path> </svg> <p class="text-zinc-500">No sample requests found</p> </div>` : renderTemplate`<div class="bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden"> <table class="w-full"> <thead class="bg-zinc-50 border-b border-zinc-200"> <tr> <th class="px-4 py-3 text-left text-xs font-semibold text-zinc-600 uppercase">Reference</th> <th class="px-4 py-3 text-left text-xs font-semibold text-zinc-600 uppercase">Company</th> <th class="px-4 py-3 text-left text-xs font-semibold text-zinc-600 uppercase">Product</th> <th class="px-4 py-3 text-left text-xs font-semibold text-zinc-600 uppercase">Qty</th> <th class="px-4 py-3 text-left text-xs font-semibold text-zinc-600 uppercase">Status</th> <th class="px-4 py-3 text-left text-xs font-semibold text-zinc-600 uppercase">Submitted</th> <th class="px-4 py-3 text-right text-xs font-semibold text-zinc-600 uppercase">Actions</th> </tr> </thead> <tbody class="divide-y divide-zinc-100"> ${samplesList.map((sample) => {
    const statusConfig = SAMPLE_STATUS_CONFIG[sample.status];
    return renderTemplate`<tr class="hover:bg-zinc-50 transition-colors"> <td class="px-4 py-3"> <span class="font-mono text-sm text-zinc-900">${sample.reference_number}</span> </td> <td class="px-4 py-3"> <div class="text-sm font-medium text-zinc-900">${sample.company_name}</div> <div class="text-xs text-zinc-500">${sample.contact_person}</div> </td> <td class="px-4 py-3"> <span class="text-sm text-zinc-700 capitalize">${sample.product_type}</span> ${sample.fabric_type && renderTemplate`<div class="text-xs text-zinc-500 capitalize">${sample.fabric_type}</div>`} </td> <td class="px-4 py-3"> <span class="text-sm text-zinc-700">${sample.quantity}</span> </td> <td class="px-4 py-3"> <span${addAttribute(`inline-block px-2 py-1 rounded-full text-xs font-semibold ${statusConfig.bg} ${statusConfig.color}`, "class")}> ${statusConfig.label} </span> </td> <td class="px-4 py-3"> <span class="text-sm text-zinc-600">${formatDate(sample.created_at)}</span> </td> <td class="px-4 py-3 text-right"> <a${addAttribute(`/admin/samples/${sample.id}`, "href")} class="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/5 rounded-lg transition-colors"> <span>View</span> <svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"> <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"></path> </svg> </a> </td> </tr>`;
  })} </tbody> </table> </div>`}${renderScript($$result2, "/home/hamzaa1i/reve-stitching/src/pages/admin/samples/index.astro?astro&type=script&index=0&lang.ts")} ` })}`;
}, "/home/hamzaa1i/reve-stitching/src/pages/admin/samples/index.astro", void 0);

const $$file = "/home/hamzaa1i/reve-stitching/src/pages/admin/samples/index.astro";
const $$url = "/admin/samples";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
