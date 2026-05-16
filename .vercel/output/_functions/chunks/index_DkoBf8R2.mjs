import { c as createComponent } from './astro-component_jWm3wabT.mjs';
import 'piccolore';
import { b8 as renderTemplate, aW as maybeRenderHead, a5 as addAttribute } from './params-and-props_CgCnFJtu.mjs';
import { r as renderComponent } from './entrypoint_Bu1exgrV.mjs';
import { $ as $$AdminLayout } from './AdminLayout_aVs5BGT6.mjs';
import { createClient } from '@supabase/supabase-js';
import 'clsx';

const EMPTY_STATS = {
  total_quotes: 0,
  new: 0,
  reviewed: 0,
  quoted: 0,
  converted: 0,
  rejected: 0,
  quotes_this_month: 0,
  quotes_last_month: 0,
  last_7_days: 0,
  last_30_days: 0,
  active_quotes: 0,
  conversion_rate: 0,
  pipeline_value: 0,
  avg_response_hours: 0,
  funnel: {
    new: { count: 0, value: 0 },
    reviewed: { count: 0, value: 0 },
    quoted: { count: 0, value: 0 },
    won: { count: 0, value: 0 },
    lost: { count: 0, value: 0 }
  },
  geography: [],
  products: [],
  monthlyTrend: [],
  oldestUnread: []
};
async function getFullDashboardStats(supabase) {
  const startTime = performance.now();
  try {
    const { data, error } = await supabase.rpc("get_full_dashboard_stats");
    if (error) throw new Error(`RPC error: ${error.message}`);
    const stats = validateStats(data);
    return {
      data: stats,
      error: null,
      durationMs: Math.round(performance.now() - startTime)
    };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    console.error("[getFullDashboardStats] Failed:", errorMessage);
    return {
      data: EMPTY_STATS,
      error: errorMessage,
      durationMs: Math.round(performance.now() - startTime)
    };
  }
}
function validateStats(raw) {
  if (!raw || typeof raw !== "object") {
    return EMPTY_STATS;
  }
  const d = raw;
  return {
    total_quotes: asNumber(d.total_quotes),
    new: asNumber(d.new),
    reviewed: asNumber(d.reviewed),
    quoted: asNumber(d.quoted),
    converted: asNumber(d.converted),
    rejected: asNumber(d.rejected),
    quotes_this_month: asNumber(d.quotes_this_month),
    quotes_last_month: asNumber(d.quotes_last_month),
    last_7_days: asNumber(d.last_7_days),
    last_30_days: asNumber(d.last_30_days),
    active_quotes: asNumber(d.active_quotes),
    conversion_rate: asNumber(d.conversion_rate),
    pipeline_value: asNumber(d.pipeline_value),
    avg_response_hours: asNumber(d.avg_response_hours),
    funnel: asFunnel(d.funnel),
    geography: asGeoArray(d.geography),
    products: asProductArray(d.products),
    monthlyTrend: asMonthlyArray(d.monthlyTrend),
    oldestUnread: asOldestArray(d.oldestUnread)
  };
}
function asNumber(val) {
  const num = Number(val);
  return Number.isFinite(num) ? num : 0;
}
function asFunnel(val) {
  const defaultFunnel = EMPTY_STATS.funnel;
  if (!val || typeof val !== "object") return defaultFunnel;
  const f = val;
  return {
    new: asStage(f.new),
    reviewed: asStage(f.reviewed),
    quoted: asStage(f.quoted),
    won: asStage(f.won),
    lost: asStage(f.lost)
  };
}
function asStage(val) {
  if (!val || typeof val !== "object") return { count: 0, value: 0 };
  const s = val;
  return {
    count: asNumber(s.count),
    value: asNumber(s.value)
  };
}
function asGeoArray(val) {
  if (!Array.isArray(val)) return [];
  return val.map((item) => ({
    country: String(item?.country || "Unknown"),
    count: asNumber(item?.count),
    percentage: asNumber(item?.percentage)
  }));
}
function asProductArray(val) {
  if (!Array.isArray(val)) return [];
  return val.map((item) => ({
    product: String(item?.product || "Unknown"),
    count: asNumber(item?.count),
    avgQuantity: asNumber(item?.avgQuantity)
  }));
}
function asMonthlyArray(val) {
  if (!Array.isArray(val)) return [];
  return val.map((item) => ({
    month: String(item?.month || ""),
    count: asNumber(item?.count)
  }));
}
function asOldestArray(val) {
  if (!Array.isArray(val)) return [];
  return val.map((item) => ({
    id: String(item?.id || ""),
    reference_number: String(item?.reference_number || ""),
    company_name: String(item?.company_name || "Unknown"),
    hoursWaiting: asNumber(item?.hoursWaiting)
  }));
}

var __freeze$1 = Object.freeze;
var __defProp$1 = Object.defineProperty;
var __template$1 = (cooked, raw) => __freeze$1(__defProp$1(cooked, "raw", { value: __freeze$1(cooked.slice()) }));
var _a$1;
const $$ManualTriggerButton = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate(_a$1 || (_a$1 = __template$1(["", `<div class="manual-trigger-wrapper" data-astro-cid-xj25pa4o> <button id="manual-trigger-btn" class="manual-trigger-btn" type="button" data-astro-cid-xj25pa4o> <svg class="icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-astro-cid-xj25pa4o> <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" data-astro-cid-xj25pa4o></path> <path d="M9 12l2 2 4-4" data-astro-cid-xj25pa4o></path> </svg> <span class="btn-text" data-astro-cid-xj25pa4o>Send Follow-Ups Now</span> <span class="btn-loading" style="display:none;" data-astro-cid-xj25pa4o> <svg class="spinner" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" data-astro-cid-xj25pa4o> <circle cx="12" cy="12" r="10" stroke-width="4" stroke-opacity="0.25" data-astro-cid-xj25pa4o></circle> <path d="M12 2a10 10 0 0110 10" stroke-width="4" stroke-linecap="round" data-astro-cid-xj25pa4o></path> </svg>
Sending...
</span> </button> <div id="trigger-result" class="trigger-result" style="display:none;" data-astro-cid-xj25pa4o></div> </div>  <script>
  document.getElementById('manual-trigger-btn')?.addEventListener('click', async () => {
    var btn = document.getElementById('manual-trigger-btn');
    var resultDiv = document.getElementById('trigger-result');
    var btnText = btn.querySelector('.btn-text');
    var btnLoading = btn.querySelector('.btn-loading');

    btn.disabled = true;
    btnText.style.display = 'none';
    btnLoading.style.display = 'flex';
    resultDiv.style.display = 'none';

    try {
      var response = await fetch('/api/admin/trigger-follow-ups', {
        method: 'POST',
        credentials: 'include',
      });

      if (response.status === 401) {
        throw new Error('Session expired. Please log in again.');
      }

      var data = await response.json();

      if (data.success) {
        resultDiv.className = 'trigger-result success';
        resultDiv.innerHTML =
          '<strong>Follow-ups sent successfully!</strong>' +
          '<div class="result-stats">' +
            '<div class="stat"><span class="stat-value">' + data.emailsSent + '</span><span class="stat-label">Emails Sent</span></div>' +
            '<div class="stat"><span class="stat-value">' + data.quotesProcessed + '</span><span class="stat-label">Quotes Checked</span></div>' +
            '<div class="stat"><span class="stat-value">' + data.duration + '</span><span class="stat-label">Duration</span></div>' +
            '<div class="stat"><span class="stat-value">' + data.errors + '</span><span class="stat-label">Errors</span></div>' +
          '</div>';
      } else {
        throw new Error(data.error || 'Unknown error');
      }
    } catch (error) {
      resultDiv.className = 'trigger-result error';
      resultDiv.innerHTML = '<strong>Error:</strong> ' + (error.message || 'Failed to send follow-ups');
    } finally {
      btn.disabled = false;
      btnText.style.display = 'block';
      btnLoading.style.display = 'none';
      resultDiv.style.display = 'block';
    }
  });
<\/script>`])), maybeRenderHead());
}, "/home/hamzaa1i/reve-stitching/src/components/admin/ManualTriggerButton.astro", void 0);

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const prerender = false;
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
  const [statsResult, contactsResult, sessionsResult] = await Promise.all([
    getFullDashboardStats(supabase),
    supabase.from("contact_submissions").select("*").order("created_at", { ascending: false }).limit(50),
    supabase.from("chat_sessions").select("*").order("created_at", { ascending: false }).limit(50)
  ]);
  const analytics = statsResult.data || EMPTY_STATS;
  const analyticsError = statsResult.error;
  const contacts = contactsResult.data || [];
  const sessions = sessionsResult.data || [];
  const newContacts = contacts.filter((c) => c.status === "new").length;
  const waitingChats = sessions.filter((s) => s.status === "waiting").length;
  const activeChats = sessions.filter((s) => s.status === "active").length;
  const quotesChange = analytics.quotes_last_month > 0 ? Math.round((analytics.quotes_this_month - analytics.quotes_last_month) / analytics.quotes_last_month * 100) : analytics.quotes_this_month > 0 ? 100 : 0;
  function formatCurrency(value) {
    if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
    if (value >= 1e3) return `$${(value / 1e3).toFixed(0)}K`;
    return `$${value}`;
  }
  function formatResponseTime(hours) {
    if (hours < 1) return "< 1 hr";
    if (hours < 24) return `${hours} hrs`;
    const days = Math.floor(hours / 24);
    return `${days}d ${hours % 24}h`;
  }
  return renderTemplate`${renderComponent($$result, "AdminLayout", $$AdminLayout, { "title": "Dashboard" }, { "default": async ($$result2) => renderTemplate(_a || (_a = __template(["", " ", ' <div class="mb-8"> <h2 class="text-lg font-semibold text-zinc-900 mb-4 flex items-center gap-2"> <svg class="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"> <path stroke-linecap="round" stroke-linejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path> </svg>\nQuote Analytics\n</h2> <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4"> <!-- Total Quotes --> <div class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white shadow-lg shadow-blue-500/20"> <div class="flex items-center justify-between mb-2"> <svg class="h-5 w-5 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"> <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path> </svg> <a href="/admin/quotes" class="text-xs opacity-70 hover:opacity-100 transition-opacity">View all</a> </div> <p class="text-2xl font-bold">', '</p> <p class="text-xs opacity-80">Total Quotes</p> </div> <!-- This Month --> <div class="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 text-white shadow-lg shadow-green-500/20"> <div class="flex items-center justify-between mb-2"> <svg class="h-5 w-5 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"> <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path> </svg> ', ' </div> <p class="text-2xl font-bold">', '</p> <p class="text-xs opacity-80">This Month</p> </div> <!-- Active Pipeline --> <div class="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 text-white shadow-lg shadow-purple-500/20"> <div class="flex items-center justify-between mb-2"> <svg class="h-5 w-5 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"> <path stroke-linecap="round" stroke-linejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path> </svg> </div> <p class="text-2xl font-bold">', '</p> <p class="text-xs opacity-80">Active Quotes</p> </div> <!-- Pipeline Value --> <div class="bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl p-4 text-white shadow-lg shadow-amber-500/20"> <div class="flex items-center justify-between mb-2"> <svg class="h-5 w-5 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"> <path stroke-linecap="round" stroke-linejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path> </svg> </div> <p class="text-2xl font-bold">', '</p> <p class="text-xs opacity-80">Pipeline Value</p> </div> <!-- Response Time --> <div class="bg-gradient-to-br from-cyan-500 to-teal-500 rounded-xl p-4 text-white shadow-lg shadow-cyan-500/20"> <div class="flex items-center justify-between mb-2"> <svg class="h-5 w-5 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"> <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path> </svg> </div> <p class="text-2xl font-bold">', '</p> <p class="text-xs opacity-80">Avg Response</p> </div> <!-- Conversion Rate --> <div class="bg-gradient-to-br from-rose-500 to-pink-500 rounded-xl p-4 text-white shadow-lg shadow-rose-500/20"> <div class="flex items-center justify-between mb-2"> <svg class="h-5 w-5 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"> <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path> </svg> </div> <p class="text-2xl font-bold">', '%</p> <p class="text-xs opacity-80">Conversion</p> </div> </div> </div>  <div class="mb-8 rounded-xl bg-white p-6 shadow ring-1 ring-zinc-200"> <h2 class="text-sm font-bold text-zinc-900 mb-2">Email Follow-Ups</h2> <p class="text-sm text-zinc-600 mb-2">\nManually trigger the automated follow-up email system.\n</p> ', ' </div>  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"> <!-- Quote Funnel --> <div class="bg-white rounded-xl border border-zinc-200 p-5"> <h3 class="text-sm font-semibold text-zinc-900 mb-4 flex items-center gap-2"> <svg class="h-4 w-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"> <path stroke-linecap="round" stroke-linejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path> </svg>\nConversion Funnel\n</h3> <div class="space-y-3"> ', ' </div> </div> <!-- Monthly Trend --> <div class="bg-white rounded-xl border border-zinc-200 p-5"> <h3 class="text-sm font-semibold text-zinc-900 mb-4 flex items-center gap-2"> <svg class="h-4 w-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"> <path stroke-linecap="round" stroke-linejoin="round" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"></path> </svg>\nQuote Trend (6 Months)\n</h3> ', ' </div> <!-- Products Breakdown --> <div class="bg-white rounded-xl border border-zinc-200 p-5"> <h3 class="text-sm font-semibold text-zinc-900 mb-4 flex items-center gap-2"> <svg class="h-4 w-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"> <path stroke-linecap="round" stroke-linejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path> </svg>\nTop Products\n</h3> ', ' </div> <!-- Geographic Distribution --> <div class="bg-white rounded-xl border border-zinc-200 p-5"> <h3 class="text-sm font-semibold text-zinc-900 mb-4 flex items-center gap-2"> <svg class="h-4 w-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"> <path stroke-linecap="round" stroke-linejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path> </svg>\nGeographic Distribution\n</h3> ', " </div> </div>  ", ' <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"> <div class="bg-white rounded-xl border border-zinc-200 p-5"> <div class="flex items-center gap-3"> <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600"> <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"> <path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path> </svg> </div> <div> <p class="text-sm text-zinc-500">Total Contacts</p> <p class="text-2xl font-bold text-zinc-900">', '</p> </div> </div> </div> <div class="bg-white rounded-xl border border-zinc-200 p-5"> <div class="flex items-center gap-3"> <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-amber-600"> <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"> <path stroke-linecap="round" stroke-linejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path> </svg> </div> <div> <p class="text-sm text-zinc-500">New (Unread)</p> <p class="text-2xl font-bold text-blue-600">', '</p> </div> </div> </div> <div class="bg-white rounded-xl border border-zinc-200 p-5"> <div class="flex items-center gap-3"> <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-50 text-yellow-600"> <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"> <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path> </svg> </div> <div> <p class="text-sm text-zinc-500">Waiting Chats</p> <p class="text-2xl font-bold text-amber-600">', '</p> </div> </div> </div> <div class="bg-white rounded-xl border border-zinc-200 p-5"> <div class="flex items-center gap-3"> <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50 text-green-600"> <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"> <path stroke-linecap="round" stroke-linejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path> </svg> </div> <div> <p class="text-sm text-zinc-500">Active Chats</p> <p class="text-2xl font-bold text-green-600">', '</p> </div> </div> </div> </div>  <div class="grid grid-cols-1 lg:grid-cols-2 gap-8"> <!-- Chat Sessions --> <div> <h2 class="flex items-center gap-2 text-lg font-semibold text-zinc-900 mb-4"> <svg class="h-5 w-5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"> <path stroke-linecap="round" stroke-linejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path> </svg>\nLive Chat Sessions\n</h2> <div class="space-y-3"> ', " ", ' </div> </div> <!-- Contact Submissions --> <div> <h2 class="flex items-center gap-2 text-lg font-semibold text-zinc-900 mb-4"> <svg class="h-5 w-5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"> <path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path> </svg>\nContact Submissions\n</h2> <div class="space-y-3"> ', " ", ` </div> </div> </div> <script>
  document.querySelectorAll('.mark-read-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = btn.getAttribute('data-contact-id');
      const res = await fetch('/api/admin/contact-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: 'read' }),
        credentials: 'include'
      });
      if (res.ok) {
        btn.innerHTML = '<svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg> Read';
        btn.disabled = true;
        btn.classList.remove('text-primary', 'border-primary/30', 'hover:bg-primary', 'hover:text-white');
        btn.classList.add('text-zinc-400', 'border-zinc-200');
      }
    });
  });
<\/script> `])), analyticsError && renderTemplate`${maybeRenderHead()}<div class="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm"> <strong>Analytics Error:</strong> ${analyticsError} </div>`, statsResult.durationMs && renderTemplate`<div class="mb-4 text-right"> <span class="inline-block rounded-full bg-green-100 px-3 py-1 text-xs text-green-700 font-medium">
⚡ SQL Stats: ${statsResult.durationMs}ms
</span> </div>`, analytics.total_quotes, quotesChange !== 0 && renderTemplate`<span${addAttribute(`text-xs px-1.5 py-0.5 rounded ${quotesChange > 0 ? "bg-white/20" : "bg-red-500/30"}`, "class")}> ${quotesChange > 0 ? "+" : ""}${quotesChange}%
</span>`, analytics.quotes_this_month, analytics.active_quotes, formatCurrency(analytics.pipeline_value), formatResponseTime(analytics.avg_response_hours), analytics.conversion_rate, renderComponent($$result2, "ManualTriggerButton", $$ManualTriggerButton, {}), (() => {
    const stages = [
      { label: "New", ...analytics.funnel.new, color: "bg-blue-500", textColor: "text-blue-600" },
      { label: "Reviewed", ...analytics.funnel.reviewed, color: "bg-yellow-500", textColor: "text-yellow-600" },
      { label: "Quoted", ...analytics.funnel.quoted, color: "bg-purple-500", textColor: "text-purple-600" },
      { label: "Won", ...analytics.funnel.won, color: "bg-green-500", textColor: "text-green-600" },
      { label: "Lost", ...analytics.funnel.lost, color: "bg-red-500", textColor: "text-red-600" }
    ];
    const maxCount = Math.max(...stages.map((s) => s.count), 1);
    return stages.map((stage) => {
      const width = Math.max(stage.count / maxCount * 100, 2);
      return renderTemplate`<div> <div class="flex items-center justify-between text-sm mb-1"> <span class="text-zinc-600">${stage.label}</span> <div class="flex items-center gap-3"> <span${addAttribute(`font-semibold ${stage.textColor}`, "class")}>${stage.count}</span> ${stage.value > 0 && renderTemplate`<span class="text-xs text-zinc-400">${formatCurrency(stage.value)}</span>`} </div> </div> <div class="h-3 bg-zinc-100 rounded-full overflow-hidden"> <div${addAttribute(`h-full ${stage.color} rounded-full transition-all duration-700`, "class")}${addAttribute(`width: ${width}%`, "style")}></div> </div> </div>`;
    });
  })(), analytics.monthlyTrend.length === 0 ? renderTemplate`<p class="text-sm text-zinc-400 text-center py-8">No trend data yet</p>` : renderTemplate`<div class="h-40 flex items-end justify-between gap-2 pt-4"> ${(() => {
    const maxCount = Math.max(...analytics.monthlyTrend.map((m) => m.count), 1);
    return analytics.monthlyTrend.map((month) => {
      const height = Math.max(month.count / maxCount * 100, 5);
      return renderTemplate`<div class="flex-1 flex flex-col items-center gap-1"> <span class="text-xs font-semibold text-zinc-900">${month.count}</span> <div class="w-full bg-zinc-100 rounded-t-lg relative" style="height: 120px;"> <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-primary to-green-400 rounded-t-lg transition-all duration-700"${addAttribute(`height: ${height}%`, "style")}></div> </div> <span class="text-[10px] text-zinc-500 font-medium">${month.month}</span> </div>`;
    });
  })()} </div>`, analytics.products.length === 0 ? renderTemplate`<p class="text-sm text-zinc-400 text-center py-8">No product data yet</p>` : renderTemplate`<div class="space-y-3"> ${(() => {
    const colors = ["bg-blue-500", "bg-green-500", "bg-amber-500", "bg-purple-500", "bg-pink-500", "bg-cyan-500"];
    const maxCount = Math.max(...analytics.products.map((p) => p.count), 1);
    return analytics.products.slice(0, 5).map((product, idx) => {
      const width = product.count / maxCount * 100;
      return renderTemplate`<div> <div class="flex items-center justify-between text-sm mb-1"> <span class="text-zinc-700 font-medium">${product.product}</span> <div class="flex items-center gap-2"> <span class="text-zinc-900 font-semibold">${product.count}</span> <span class="text-xs text-zinc-400">avg: ${product.avgQuantity.toLocaleString()} pcs</span> </div> </div> <div class="h-2 bg-zinc-100 rounded-full overflow-hidden"> <div${addAttribute(`h-full ${colors[idx % colors.length]} rounded-full transition-all duration-500`, "class")}${addAttribute(`width: ${width}%`, "style")}></div> </div> </div>`;
    });
  })()} </div>`, analytics.geography.length === 0 ? renderTemplate`<p class="text-sm text-zinc-400 text-center py-8">No geographic data yet</p>` : renderTemplate`<div class="space-y-3"> ${(() => {
    const colors = [
      { bg: "bg-blue-500", text: "text-blue-600" },
      { bg: "bg-green-500", text: "text-green-600" },
      { bg: "bg-amber-500", text: "text-amber-600" },
      { bg: "bg-purple-500", text: "text-purple-600" },
      { bg: "bg-pink-500", text: "text-pink-600" }
    ];
    const maxCount = Math.max(...analytics.geography.map((g) => g.count), 1);
    return analytics.geography.map((geo, idx) => {
      const width = geo.count / maxCount * 100;
      const color = colors[idx % colors.length];
      return renderTemplate`<div> <div class="flex items-center justify-between text-sm mb-1"> <div class="flex items-center gap-2"> <div${addAttribute(`w-2.5 h-2.5 rounded-full ${color.bg}`, "class")}></div> <span class="text-zinc-700">${geo.country}</span> </div> <div class="flex items-center gap-2"> <span${addAttribute(`font-semibold ${color.text}`, "class")}>${geo.count}</span> <span class="text-xs text-zinc-400">(${geo.percentage}%)</span> </div> </div> <div class="h-2 bg-zinc-100 rounded-full overflow-hidden"> <div${addAttribute(`h-full ${color.bg} rounded-full transition-all duration-500`, "class")}${addAttribute(`width: ${width}%`, "style")}></div> </div> </div>`;
    });
  })()} </div>`, analytics.oldestUnread && analytics.oldestUnread.length > 0 && renderTemplate`<div class="mb-8"> <h2 class="text-lg font-semibold text-zinc-900 mb-4 flex items-center gap-2"> <svg class="h-5 w-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"> <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path> </svg>
Awaiting Response
<span class="ml-2 px-2 py-0.5 text-xs font-bold bg-amber-100 text-amber-700 rounded-full"> ${analytics.oldestUnread.length} unread
</span> </h2> <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3"> ${analytics.oldestUnread.map((quote) => renderTemplate`<a${addAttribute(`/admin/quote/${quote.id}`, "href")} class="bg-white rounded-xl border border-amber-200 p-4 hover:border-amber-400 hover:shadow-md transition-all group"> <div class="flex items-start justify-between mb-2"> <span class="text-xs font-mono text-zinc-400">${quote.reference_number}</span> <span${addAttribute(`text-xs font-bold px-1.5 py-0.5 rounded ${quote.hoursWaiting > 48 ? "bg-red-100 text-red-700" : quote.hoursWaiting > 24 ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700"}`, "class")}> ${quote.hoursWaiting}h
</span> </div> <p class="text-sm font-medium text-zinc-900 truncate group-hover:text-primary transition-colors"> ${quote.company_name} </p> </a>`)} </div> </div>`, contacts.length, newContacts, waitingChats, activeChats, sessions.length === 0 && renderTemplate`<div class="bg-white rounded-xl border border-zinc-200 p-6 text-center text-zinc-400 text-sm">
No chat sessions yet.
</div>`, sessions.slice(0, 5).map((session) => renderTemplate`<a${addAttribute(`/admin/chat/${session.id}`, "href")} class="block bg-white rounded-xl border border-zinc-200 p-4 hover:border-primary/50 hover:shadow-md transition-all"> <div class="flex items-center justify-between mb-2"> <div class="flex items-center gap-2"> <span class="text-sm font-medium text-zinc-900"> ${session.visitor_name || "Anonymous Visitor"} </span> <span${addAttribute(`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${session.status === "waiting" ? "bg-amber-100 text-amber-700" : session.status === "active" ? "bg-green-100 text-green-700" : "bg-zinc-100 text-zinc-500"}`, "class")}> ${session.status} </span> </div> <span class="text-xs text-zinc-400"> ${new Date(session.created_at).toLocaleString()} </span> </div> ${session.visitor_email && renderTemplate`<p class="text-xs text-zinc-500">${session.visitor_email}</p>`} </a>`), contacts.length === 0 && renderTemplate`<div class="bg-white rounded-xl border border-zinc-200 p-6 text-center text-zinc-400 text-sm">
No submissions yet.
</div>`, contacts.slice(0, 5).map((contact) => renderTemplate`<div class="bg-white rounded-xl border border-zinc-200 p-4"> <div class="flex items-center justify-between mb-2"> <span class="text-sm font-medium text-zinc-900">${contact.name}</span> <div class="flex items-center gap-2"> <span${addAttribute(`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${contact.status === "new" ? "bg-blue-100 text-blue-700" : contact.status === "read" ? "bg-zinc-100 text-zinc-500" : "bg-green-100 text-green-700"}`, "class")}> ${contact.status} </span> <span class="text-xs text-zinc-400"> ${new Date(contact.created_at).toLocaleString()} </span> </div> </div> <p class="text-xs text-zinc-500 mb-1">${contact.email} ${contact.company ? `• ${contact.company}` : ""}</p> <p class="text-sm text-zinc-600 line-clamp-2">${contact.message}</p> ${contact.status === "new" && renderTemplate`<button${addAttribute(contact.id, "data-contact-id")} class="mark-read-btn mt-3 flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-primary border border-primary/30 rounded-lg hover:bg-primary hover:text-white transition-colors"> <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"> <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"></path> </svg>
Mark as Read
</button>`} </div>`)) })}`;
}, "/home/hamzaa1i/reve-stitching/src/pages/admin/index.astro", void 0);

const $$file = "/home/hamzaa1i/reve-stitching/src/pages/admin/index.astro";
const $$url = "/admin";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
