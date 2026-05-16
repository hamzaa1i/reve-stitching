import { c as createComponent } from './astro-component_jWm3wabT.mjs';
import 'piccolore';
import { aW as maybeRenderHead, a5 as addAttribute, b8 as renderTemplate, m as Fragment } from './params-and-props_CgCnFJtu.mjs';
import { r as renderComponent } from './entrypoint_Bu1exgrV.mjs';
import { $ as $$AdminLayout } from './AdminLayout_aVs5BGT6.mjs';
import { createClient } from '@supabase/supabase-js';
import { a as getSupabase } from './supabase_BOuP-yIE.mjs';
import 'clsx';
import { r as renderScript } from './script_CN3n2meJ.mjs';
import { S as STATUS_META, P as PRODUCT_NAMES, F as FABRIC_NAMES, D as DESTINATION_NAMES, C as CUSTOMIZATION_NAMES } from './quote_D5oWnva4.mjs';

const BUCKET = "quote-uploads";
async function getSignedUrl(path, expiresIn = 3600) {
  const supabase = getSupabase();
  const { data, error } = await supabase.storage.from(BUCKET).createSignedUrl(path, expiresIn);
  if (error) {
    console.error(`[Storage] Signed URL failed for ${path}:`, error.message);
    return null;
  }
  return data.signedUrl;
}

const $$WhatsAppContactButton = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$WhatsAppContactButton;
  const { buyerPhone, buyerName, companyName, quoteRef } = Astro2.props;
  function sanitizePhone(raw) {
    let digits = raw.replace(/\D/g, "");
    if (digits.startsWith("0") && digits.length === 11) {
      digits = "92" + digits.slice(1);
    }
    if (digits.startsWith("00")) {
      digits = digits.slice(2);
    }
    return digits;
  }
  const greeting = companyName ? `Hi ${buyerName} from ${companyName}` : `Hi ${buyerName}`;
  const message = [
    `${greeting},`,
    "",
    `Thank you for your quote request (Ref: ${quoteRef}) on Reve Stitching.`,
    "",
    `I'd like to discuss your requirements in detail — quantity, fabric preferences, timeline, and pricing.`,
    "",
    `When would be a good time to connect?`,
    "",
    "Best regards,",
    "Reve Stitching Sales Team"
  ].join("\n");
  const cleanPhone = sanitizePhone(buyerPhone);
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
  const hasPhone = buyerPhone && buyerPhone.trim().length > 0;
  return renderTemplate`${hasPhone ? renderTemplate`${maybeRenderHead()}<a${addAttribute(whatsappUrl, "href")} target="_blank" rel="noopener noreferrer" class="wa-contact-btn"${addAttribute(`Message ${buyerName} on WhatsApp`, "title")} data-astro-cid-iaq54436><svg class="wa-contact-btn__icon" viewBox="0 0 24 24" fill="currentColor" width="18" height="18" data-astro-cid-iaq54436><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" data-astro-cid-iaq54436></path></svg><span data-astro-cid-iaq54436>Contact via WhatsApp</span></a>` : renderTemplate`<button class="wa-contact-btn wa-contact-btn--disabled" disabled title="No phone number provided by buyer" data-astro-cid-iaq54436><svg class="wa-contact-btn__icon" viewBox="0 0 24 24" fill="currentColor" width="18" height="18" data-astro-cid-iaq54436><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" data-astro-cid-iaq54436></path></svg><span data-astro-cid-iaq54436>No phone number</span></button>`}`;
}, "/home/hamzaa1i/reve-stitching/src/components/admin/WhatsAppContactButton.astro", void 0);

const $$FollowUpStatus = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$FollowUpStatus;
  const {
    followUp24hSent,
    adminReminderSent,
    reengagementSent,
    lastEmailSentAt,
    quoteCreatedAt,
    quoteStatus
  } = Astro2.props;
  const now = /* @__PURE__ */ new Date();
  const created = new Date(quoteCreatedAt);
  const hoursElapsed = (now.getTime() - created.getTime()) / (1e3 * 60 * 60);
  const steps = [
    {
      label: "24h Buyer Follow-Up",
      description: `"We're reviewing your quote"`,
      sent: followUp24hSent,
      threshold: 24,
      recipient: "buyer"
    },
    {
      label: "48h Admin Reminder",
      description: "Nudge to respond",
      sent: adminReminderSent,
      threshold: 48,
      recipient: "admin"
    },
    {
      label: "7-Day Re-engagement",
      description: '"Still interested?"',
      sent: reengagementSent,
      threshold: 168,
      recipient: "buyer"
    }
  ];
  const isActive = quoteStatus === "new";
  return renderTemplate`${maybeRenderHead()}<div class="bg-white rounded-xl border border-zinc-200 p-5"> <div class="flex items-center justify-between mb-4"> <h3 class="text-sm font-bold text-zinc-900 flex items-center gap-2"> <svg class="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"></path> </svg>
Automated Follow-Ups
</h3> ${!isActive && renderTemplate`<span class="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-zinc-100 text-zinc-500 rounded-full">
Paused (status: ${quoteStatus})
</span>`} </div> <div class="space-y-3"> ${steps.map((step) => {
    const isPending = !step.sent && hoursElapsed < step.threshold;
    const isDue = !step.sent && hoursElapsed >= step.threshold;
    const hoursUntil = Math.max(0, step.threshold - hoursElapsed);
    return renderTemplate`<div class="flex items-start gap-3">  <div class="mt-0.5"> ${step.sent ? renderTemplate`<div class="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center"> <svg class="w-3 h-3 text-emerald-600" fill="currentColor" viewBox="0 0 20 20"> <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clip-rule="evenodd"></path> </svg> </div>` : isDue ? renderTemplate`<div class="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center"> <svg class="w-3 h-3 text-amber-600" fill="currentColor" viewBox="0 0 20 20"> <path fill-rule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-8-5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5A.75.75 0 0 1 10 5Zm0 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clip-rule="evenodd"></path> </svg> </div>` : renderTemplate`<div class="w-5 h-5 rounded-full bg-zinc-100 flex items-center justify-center"> <div class="w-2 h-2 rounded-full bg-zinc-300"></div> </div>`} </div>  <div class="flex-1 min-w-0"> <div class="flex items-center gap-2"> <span class="text-sm font-medium text-zinc-900">${step.label}</span> <span${addAttribute(`px-1.5 py-0.5 text-[10px] font-medium rounded ${step.recipient === "buyer" ? "bg-blue-50 text-blue-600" : "bg-purple-50 text-purple-600"}`, "class")}> <svg class="w-2.5 h-2.5 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"> <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"></path> </svg> ${step.recipient} </span> </div> <p class="text-xs text-zinc-500 mt-0.5"> ${step.sent ? renderTemplate`<span class="inline-flex items-center gap-1"> <svg class="w-3 h-3 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"> <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"></path> </svg>
Sent
</span>` : isPending ? `Scheduled in ${hoursUntil.toFixed(0)}h` : isActive ? `Due — will send on next cron run` : `Skipped (quote ${quoteStatus})`} </p> </div> </div>`;
  })} </div>  ${lastEmailSentAt && renderTemplate`<p class="mt-4 pt-3 border-t border-zinc-100 text-[11px] text-zinc-400 flex items-center gap-1.5"> <svg class="w-3 h-3 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"> <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path> </svg>
Last email sent: ${new Date(lastEmailSentAt).toLocaleString("en-GB", {
    dateStyle: "medium",
    timeStyle: "short"
  })} </p>`}  ${isActive && renderTemplate`<button class="mt-3 w-full py-2 text-xs font-semibold text-primary border border-primary/30 rounded-lg hover:bg-primary/5 transition-colors flex items-center justify-center gap-1.5" id="trigger-followups-btn" type="button"> <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"> <path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"></path> </svg>
Run Follow-Up Check Now
</button>`} <div id="trigger-result" class="hidden mt-3 rounded-lg p-2.5 text-xs"></div> </div> ${renderScript($$result, "/home/hamzaa1i/reve-stitching/src/components/admin/FollowUpStatus.astro?astro&type=script&index=0&lang.ts")}`;
}, "/home/hamzaa1i/reve-stitching/src/components/admin/FollowUpStatus.astro", void 0);

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const prerender = false;
const $$id = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$id;
  const { id } = Astro2.params;
  if (!id) return Astro2.redirect("/admin/quotes");
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
  let flash = "";
  if (Astro2.request.method === "POST") {
    const formData = await Astro2.request.formData();
    const action = formData.get("_action");
    if (action === "update-status") {
      const newStatus = formData.get("status");
      const { error } = await supabase.from("quote_requests").update({
        status: newStatus,
        last_admin_action_at: (/* @__PURE__ */ new Date()).toISOString()
      }).eq("id", id);
      flash = error ? `Error: ${error.message}` : `Status updated to "${newStatus}".`;
    }
    if (action === "update-notes") {
      const notes = formData.get("admin_notes");
      const assignedTo = formData.get("assigned_to");
      const { error } = await supabase.from("quote_requests").update({
        admin_notes: notes || null,
        assigned_to: assignedTo || null,
        last_admin_action_at: (/* @__PURE__ */ new Date()).toISOString()
      }).eq("id", id);
      flash = error ? `Error: ${error.message}` : "Notes saved.";
    }
  }
  const { data: quote, error: fetchError } = await supabase.from("quote_requests").select("*").eq("id", id).single();
  if (fetchError || !quote) return Astro2.redirect("/admin/quotes");
  const q = quote;
  const sm = STATUS_META[q.status] || STATUS_META.new;
  let techPackSignedUrl = null;
  if (q.tech_pack_url) {
    techPackSignedUrl = await getSignedUrl(q.tech_pack_url);
  }
  const imageSignedUrls = [];
  for (const imgPath of q.reference_images || []) {
    const signedUrl = await getSignedUrl(imgPath);
    if (signedUrl) imageSignedUrls.push({ path: imgPath, url: signedUrl });
  }
  function formatDate(iso) {
    return new Date(iso).toLocaleDateString("en-GB", {
      weekday: "short",
      day: "numeric",
      month: "long",
      year: "numeric"
    });
  }
  function fileName(path) {
    return path.split("/").pop() || path;
  }
  const productLabel = PRODUCT_NAMES[q.product_type] || q.product_type;
  const fabricLabel = FABRIC_NAMES[q.fabric_type] || q.fabric_type;
  const destLabel = DESTINATION_NAMES[q.destination] || q.destination;
  const customList = (q.customizations || []).map((c) => CUSTOMIZATION_NAMES[c] || c);
  const mailSubject = encodeURIComponent(`RE: Quote ${q.reference_number} — Reve Stitching`);
  const mailBody = encodeURIComponent(
    `Dear ${q.contact_person},

Thank you for your quote request (${q.reference_number}) for ${q.quantity} pcs of ${productLabel}.

We have reviewed your requirements and are pleased to offer the following:

[Your quote details here]

Please let us know if you have any questions.

Best regards,
Reve Stitching Team`
  );
  const mailtoHref = `mailto:${q.email}?subject=${mailSubject}&body=${mailBody}`;
  const allStatuses = ["new", "reviewed", "quoted", "converted", "rejected"];
  return renderTemplate`${renderComponent($$result, "AdminLayout", $$AdminLayout, { "title": `Quote ${q.reference_number}` }, { "default": async ($$result2) => renderTemplate(_a || (_a = __template(["", '<div class="mb-6"> <a href="/admin/quotes" class="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"> <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"></path></svg>\nBack to all quotes\n</a> </div> <div class="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"> <div> <div class="flex items-center gap-3"> <h1 class="text-2xl font-bold text-gray-900">', "</h1> <span", "> ", " </span> ", ' </div> <p class="mt-1 text-sm text-gray-500">\nSubmitted ', " • ", ' </p> </div> <div class="flex gap-2"> <a', ' class="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow transition hover:bg-primary-light"> <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>\nEmail Client\n</a> ', ' <button onclick="window.print()" class="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50"> <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>\nPrint\n</button> </div> </div> <div class="grid gap-6 lg:grid-cols-3"> <div class="space-y-6 lg:col-span-2"> ', " ", " ", ' <div class="rounded-xl bg-white p-6 shadow ring-1 ring-gray-200"> <h2 class="mb-4 flex items-center gap-2 text-sm font-bold text-gray-900"> <svg class="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>\nContact Information\n</h2> <dl class="grid gap-x-8 gap-y-3 text-sm sm:grid-cols-2"> <div><dt class="text-gray-500">Company</dt><dd class="mt-0.5 font-semibold text-gray-900">', '</dd></div> <div><dt class="text-gray-500">Contact</dt><dd class="mt-0.5 font-semibold text-gray-900">', '</dd></div> <div><dt class="text-gray-500">Email</dt><dd class="mt-0.5"><a', ' class="font-medium text-primary hover:underline">', '</a></dd></div> <div><dt class="text-gray-500">Phone</dt><dd class="mt-0.5 font-medium text-gray-900">', '</dd></div> </dl> </div> <div class="rounded-xl bg-white p-6 shadow ring-1 ring-gray-200"> <h2 class="mb-4 flex items-center gap-2 text-sm font-bold text-gray-900"> <svg class="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>\nProduct &amp; Specifications\n</h2> <dl class="grid gap-x-8 gap-y-3 text-sm sm:grid-cols-2"> <div><dt class="text-gray-500">Product</dt><dd class="mt-0.5 font-semibold text-gray-900">', '</dd></div> <div><dt class="text-gray-500">Fabric</dt><dd class="mt-0.5 font-medium text-gray-900">', '</dd></div> <div><dt class="text-gray-500">GSM</dt><dd class="mt-0.5 font-medium text-gray-900">', ' g/m²</dd></div> <div><dt class="text-gray-500">Quantity</dt><dd class="mt-0.5 text-lg font-bold text-primary">', ' pcs</dd></div> <div><dt class="text-gray-500">Sizes</dt><dd class="mt-0.5 font-medium text-gray-900">', '</dd></div> <div><dt class="text-gray-500">Colors</dt><dd class="mt-0.5 font-medium text-gray-900">', "</dd></div> </dl> </div> ", ' <div class="rounded-xl bg-white p-6 shadow ring-1 ring-gray-200"> <h2 class="mb-4 flex items-center gap-2 text-sm font-bold text-gray-900"> <svg class="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>\nDelivery &amp; Timeline\n</h2> <dl class="grid gap-x-8 gap-y-3 text-sm sm:grid-cols-2"> <div><dt class="text-gray-500">Target Date</dt><dd class="mt-0.5 font-semibold text-gray-900">', '</dd></div> <div><dt class="text-gray-500">Destination</dt><dd class="mt-0.5 font-medium text-gray-900">', '</dd></div> <div> <dt class="text-gray-500">Sample Required</dt> <dd class="mt-0.5 flex items-center gap-1.5 font-medium text-gray-900"> ', ' </dd> </div> <div> <dt class="text-gray-500">Rush Order</dt> <dd', "> ", " </dd> </div> </dl> </div> ", " ", ' </div> <div class="space-y-6"> <!-- Automation Safety --> <div class="rounded-xl bg-white p-6 shadow ring-1 ring-gray-200"> <h2 class="mb-3 text-sm font-bold text-gray-900">Automation</h2> <div class="text-sm text-gray-700 space-y-2"> <div class="flex items-center justify-between"> <span class="text-gray-500">Status</span> <span id="automation-status"', "> ", ' </span> </div> <div class="flex items-center justify-between"> <span class="text-gray-500">Last admin action</span> <span id="automation-last-action" class="text-xs text-gray-700"> ', ' </span> </div> <p class="text-xs text-gray-500 pt-2">\nWhen paused, the system will not send automatic follow-up emails for this quote.\n</p> </div> <button id="automation-toggle-btn"', "", "", ' type="button"> ', ' </button> <p id="automation-msg" class="mt-3 hidden text-xs"></p> </div> <!-- Update Status --> <div class="rounded-xl bg-white p-6 shadow ring-1 ring-gray-200"> <h2 class="mb-4 text-sm font-bold text-gray-900">Update Status</h2> <form method="POST" class="space-y-3"> <input type="hidden" name="_action" value="update-status"> <select name="status" class="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"> ', ' </select> <button type="submit" class="w-full rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow transition hover:bg-primary-light">Update Status</button> </form> </div> <div class="rounded-xl bg-white p-6 shadow ring-1 ring-gray-200"> <h2 class="mb-4 text-sm font-bold text-gray-900">Internal Notes</h2> <form method="POST" class="space-y-3"> <input type="hidden" name="_action" value="update-notes"> <div> <label for="assigned_to" class="block text-xs font-medium text-gray-500">Assigned To</label> <input type="text" id="assigned_to" name="assigned_to"', ' placeholder="e.g. Ali, Sarah…" class="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"> </div> <div> <label for="admin_notes" class="block text-xs font-medium text-gray-500">Notes</label> <textarea id="admin_notes" name="admin_notes" rows="5" placeholder="Internal notes, pricing calculations, follow-up reminders…" class="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30">', '</textarea> </div> <button type="submit" class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50">Save Notes</button> </form> </div> <div class="rounded-xl bg-gray-50 p-6 ring-1 ring-gray-200"> <h2 class="mb-3 text-sm font-bold text-gray-900">Quick Info</h2> <dl class="space-y-2 text-sm"> <div class="flex justify-between"><dt class="text-gray-500">Quote ID</dt><dd class="font-mono text-xs text-gray-600">', '…</dd></div> <div class="flex justify-between"><dt class="text-gray-500">Created</dt><dd class="text-gray-700">', '</dd></div> <div class="flex justify-between"><dt class="text-gray-500">Updated</dt><dd class="text-gray-700">', "</dd></div> ", " </dl> </div> </div> </div> <script>\n    (function () {\n      var btn = document.getElementById('automation-toggle-btn');\n      if (!btn) return;\n  \n      var statusEl = document.getElementById('automation-status');\n      var lastActionEl = document.getElementById('automation-last-action');\n      var msgEl = document.getElementById('automation-msg');\n  \n      btn.addEventListener('click', async function () {\n        var quoteId = btn.getAttribute('data-quote-id');\n        var pausedNow = btn.getAttribute('data-paused') === 'true';\n        var nextPaused = !pausedNow;\n  \n        btn.disabled = true;\n        btn.textContent = nextPaused ? 'Pausing...' : 'Resuming...';\n        msgEl.classList.add('hidden');\n  \n        try {\n          var res = await fetch('/api/admin/quote-automation', {\n            method: 'POST',\n            headers: { 'Content-Type': 'application/json' },\n            credentials: 'include',\n            body: JSON.stringify({ id: quoteId, paused: nextPaused })\n          });\n  \n          var data = await res.json();\n          if (!res.ok || !data.success) {\n            throw new Error(data.error || 'Failed');\n          }\n  \n          // Update UI\n          var paused = data.data.automation_paused;\n          var lastAction = data.data.last_admin_action_at;\n  \n          btn.setAttribute('data-paused', paused ? 'true' : 'false');\n          btn.textContent = paused ? 'Resume Automation' : 'Pause Automation';\n  \n          // Button color\n          btn.className =\n            'mt-4 w-full rounded-lg px-4 py-2 text-sm font-semibold shadow transition ' +\n            (paused ? 'bg-green-700 text-white hover:bg-green-600' : 'bg-red-600 text-white hover:bg-red-500');\n  \n          // Status badge\n          statusEl.textContent = paused ? 'Paused' : 'Active';\n          statusEl.className =\n            'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ' +\n            (paused ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700');\n  \n          // Last action\n          if (lastActionEl) {\n            lastActionEl.textContent = new Date(lastAction).toLocaleString('en-GB');\n          }\n  \n          msgEl.textContent = paused\n            ? 'Automation paused. No follow-up emails will be sent for this quote.'\n            : 'Automation resumed. Follow-ups will work again if the quote is still eligible.';\n          msgEl.className = 'mt-3 text-xs text-green-700';\n          msgEl.classList.remove('hidden');\n        } catch (err) {\n          msgEl.textContent = 'Error: ' + (err && err.message ? err.message : 'Failed');\n          msgEl.className = 'mt-3 text-xs text-red-700';\n          msgEl.classList.remove('hidden');\n        } finally {\n          btn.disabled = false;\n        }\n      });\n    })();\n  <\/script> "])), flash && renderTemplate`${maybeRenderHead()}<div${addAttribute([
    "mb-6 rounded-lg p-3 text-sm font-medium",
    flash.startsWith("Error") ? "bg-red-50 text-red-800" : "bg-green-50 text-green-800"
  ], "class:list")} role="alert"> ${flash} </div>`, q.reference_number, addAttribute(["rounded-full px-3 py-1 text-xs font-semibold", sm.bg, sm.color], "class:list"), sm.label, q.is_rush && renderTemplate`<span class="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800"> <svg class="h-3 w-3" fill="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
Rush
</span>`, formatDate(q.created_at), q.company_name, addAttribute(mailtoHref, "href"), renderComponent($$result2, "WhatsAppContactButton", $$WhatsAppContactButton, { "buyerPhone": q.phone || "", "buyerName": q.contact_person, "companyName": q.company_name, "quoteRef": q.reference_number }), q.ai_summary && renderTemplate`<div class="rounded-xl border border-primary/20 bg-primary/5 p-6"> <div class="mb-3 flex items-center gap-2"> <span class="flex h-7 w-7 items-center justify-center rounded-full bg-primary/20"> <svg class="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg> </span> <h2 class="text-sm font-bold text-gray-900">AI Analysis</h2> </div> <p class="text-sm leading-relaxed text-gray-700">${q.ai_summary}</p> <div class="mt-4 flex flex-wrap gap-4 text-sm"> ${q.estimated_price_range && renderTemplate`<div class="rounded-lg bg-white px-3 py-2 shadow-sm"> <span class="text-xs text-gray-500">Est. Price</span> <p class="font-bold text-primary">${q.estimated_price_range}</p> </div>`} ${q.suggested_moq && renderTemplate`<div class="rounded-lg bg-white px-3 py-2 shadow-sm"> <span class="text-xs text-gray-500">Suggested MOQ</span> <p class="font-bold text-amber-700">${q.suggested_moq.toLocaleString()} pcs</p> </div>`} </div> ${q.ai_flags && renderTemplate`<div class="mt-3 flex items-start gap-2 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800"> <svg class="mt-0.5 h-4 w-4 shrink-0 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg> <span>${q.ai_flags}</span> </div>`} </div>`, renderComponent($$result2, "FollowUpStatus", $$FollowUpStatus, { "followUp24hSent": quote.follow_up_24h_sent, "adminReminderSent": quote.admin_reminder_sent, "reengagementSent": quote.reengagement_sent, "lastEmailSentAt": quote.last_email_sent_at, "quoteCreatedAt": quote.created_at, "quoteStatus": quote.status }), q.ai_extracted_data && Object.keys(q.ai_extracted_data).length > 0 && renderTemplate`<div class="rounded-xl bg-white p-6 shadow ring-1 ring-gray-200"> <div class="mb-4 flex items-center justify-between"> <h2 class="flex items-center gap-2 text-sm font-bold text-gray-900"> <svg class="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
Tech Pack Analysis
</h2> ${q.ai_confidence_score !== null && renderTemplate`<div class="flex items-center gap-2"> <div class="h-2 w-32 overflow-hidden rounded-full bg-gray-200"> <div class="h-full rounded-full bg-gradient-to-r from-primary to-primary-light transition-all"${addAttribute(`width: ${(q.ai_confidence_score * 100).toFixed(0)}%`, "style")}></div> </div> <span class="text-xs font-medium text-gray-600">${(q.ai_confidence_score * 100).toFixed(0)}%</span> </div>`} </div> <div class="space-y-3 rounded-lg bg-gray-50 p-4"> ${q.ai_extracted_data.product_type && renderTemplate`<div class="flex gap-2 text-sm"><span class="min-w-[130px] font-medium text-gray-600">Product Type:</span><span class="text-gray-900">${q.ai_extracted_data.product_type}</span></div>`} ${q.ai_extracted_data.fabric_details && renderTemplate`<div class="flex gap-2 text-sm"><span class="min-w-[130px] font-medium text-gray-600">Fabric:</span><span class="text-gray-900">${q.ai_extracted_data.fabric_details}</span></div>`} ${q.ai_extracted_data.gsm && renderTemplate`<div class="flex gap-2 text-sm"><span class="min-w-[130px] font-medium text-gray-600">GSM:</span><span class="text-gray-900">${q.ai_extracted_data.gsm}</span></div>`} ${q.ai_extracted_data.colors && q.ai_extracted_data.colors.length > 0 && renderTemplate`<div class="flex gap-2 text-sm"><span class="min-w-[130px] font-medium text-gray-600">Colors Visible:</span><span class="text-gray-900">${q.ai_extracted_data.colors.join(", ")}</span></div>`} ${q.ai_extracted_data.decorations && q.ai_extracted_data.decorations.length > 0 && renderTemplate`<div class="text-sm"> <span class="font-medium text-gray-600">Decorations:</span> <div class="mt-1 space-y-1 text-gray-900"> ${q.ai_extracted_data.decorations.map((dec) => renderTemplate`<div class="flex items-start gap-2"> <span class="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-400"></span> <span><strong>${dec.type}</strong> — ${dec.location} — ${dec.details}</span> </div>`)} </div> </div>`} ${q.ai_extracted_data.accessories && q.ai_extracted_data.accessories.length > 0 && renderTemplate`<div class="flex gap-2 text-sm"><span class="min-w-[130px] font-medium text-gray-600">Accessories:</span><span class="text-gray-900">${q.ai_extracted_data.accessories.join(", ")}</span></div>`} </div> ${q.ai_missing_fields && q.ai_missing_fields.length > 0 && renderTemplate`<div class="mt-4"> <h4 class="mb-2 flex items-center gap-2 text-sm font-semibold text-amber-700"> <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
Missing Information
</h4> <ul class="space-y-1"> ${q.ai_missing_fields.map((field) => renderTemplate`<li class="flex items-start gap-2 text-sm text-amber-600"> <span class="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400"></span> <span>${field}</span> </li>`)} </ul> </div>`} ${q.action_items && q.action_items.items && q.action_items.items.length > 0 && renderTemplate`<div class="mt-4"> <h4 class="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-900"> <svg class="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg>
Action Items for Sales Team
</h4> <div class="space-y-2"> ${q.action_items.items.map((item) => renderTemplate`<div class="flex items-start gap-3 rounded-lg border border-gray-200 bg-white p-3 transition hover:border-primary/50"> <input type="checkbox"${addAttribute(item.completed, "checked")} class="mt-0.5 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"> <div class="flex-1"> <div class="flex items-center gap-2"> <span${addAttribute(`rounded px-2 py-0.5 text-xs font-semibold uppercase ${item.priority === "high" ? "bg-red-100 text-red-700" : ""} ${item.priority === "medium" ? "bg-yellow-100 text-yellow-700" : ""} ${item.priority === "low" ? "bg-gray-100 text-gray-600" : ""}`, "class")}> ${item.priority} </span> <span class="text-sm font-medium text-gray-900">${item.title}</span> </div> <p class="mt-1 text-xs text-gray-600">${item.description}</p> </div> </div>`)} </div> </div>`} </div>`, q.company_name, q.contact_person, addAttribute(`mailto:${q.email}`, "href"), q.email, q.phone || "—", productLabel, fabricLabel, q.gsm, q.quantity.toLocaleString(), (q.sizes || []).join(", "), q.color_count, customList.length > 0 && renderTemplate`<div class="rounded-xl bg-white p-6 shadow ring-1 ring-gray-200"> <h2 class="mb-4 flex items-center gap-2 text-sm font-bold text-gray-900"> <svg class="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"></path></svg>
Customizations
</h2> <div class="flex flex-wrap gap-2"> ${customList.map((c) => renderTemplate`<span class="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-800"> <svg class="h-3.5 w-3.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"></path></svg> ${c} </span>`)} </div> </div>`, formatDate(q.target_date), destLabel, q.has_sample ? renderTemplate`${renderComponent($$result2, "Fragment", Fragment, {}, { "default": async ($$result3) => renderTemplate`<svg class="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"></path></svg>Yes` })}` : "No", addAttribute(["mt-0.5 flex items-center gap-1.5 font-medium", q.is_rush ? "text-amber-700" : "text-gray-900"], "class:list"), q.is_rush ? renderTemplate`${renderComponent($$result2, "Fragment", Fragment, {}, { "default": async ($$result3) => renderTemplate`<svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>Yes` })}` : "No", q.notes && renderTemplate`<div class="rounded-xl bg-white p-6 shadow ring-1 ring-gray-200"> <h2 class="mb-2 flex items-center gap-2 text-sm font-bold text-gray-900"> <svg class="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"></path></svg>
Customer Notes
</h2> <p class="whitespace-pre-wrap text-sm leading-relaxed text-gray-700">${q.notes}</p> </div>`, (techPackSignedUrl || imageSignedUrls.length > 0) && renderTemplate`<div class="rounded-xl bg-white p-6 shadow ring-1 ring-gray-200"> <h2 class="mb-4 flex items-center gap-2 text-sm font-bold text-gray-900"> <svg class="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path></svg>
Uploaded Files
</h2> <div class="space-y-2"> ${techPackSignedUrl && renderTemplate`<a${addAttribute(techPackSignedUrl, "href")} target="_blank" rel="noopener" class="flex items-center gap-3 rounded-lg border border-gray-200 p-3 text-sm transition hover:bg-gray-50"> <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-600"> <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg> </span> <div><p class="font-medium text-gray-900">Tech Pack</p><p class="text-xs text-gray-500">${fileName(q.tech_pack_url)}</p></div> <span class="ml-auto flex items-center gap-1 text-xs text-primary"> <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
Download
</span> </a>`} ${imageSignedUrls.map((img) => renderTemplate`<a${addAttribute(img.url, "href")} target="_blank" rel="noopener" class="flex items-center gap-3 rounded-lg border border-gray-200 p-3 text-sm transition hover:bg-gray-50"> <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600"> <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg> </span> <div><p class="font-medium text-gray-900">Reference Image</p><p class="text-xs text-gray-500">${fileName(img.path)}</p></div> <span class="ml-auto flex items-center gap-1 text-xs text-primary"> <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
Download
</span> </a>`)} </div> </div>`, addAttribute([
    "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
    q.automation_paused ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"
  ], "class:list"), q.automation_paused ? "Paused" : "Active", q.last_admin_action_at ? new Date(q.last_admin_action_at).toLocaleString("en-GB") : "—", addAttribute(q.id, "data-quote-id"), addAttribute(q.automation_paused ? "true" : "false", "data-paused"), addAttribute([
    "mt-4 w-full rounded-lg px-4 py-2 text-sm font-semibold shadow transition",
    q.automation_paused ? "bg-green-700 text-white hover:bg-green-600" : "bg-red-600 text-white hover:bg-red-500"
  ], "class:list"), q.automation_paused ? "Resume Automation" : "Pause Automation", allStatuses.map((s) => renderTemplate`<option${addAttribute(s, "value")}${addAttribute(q.status === s, "selected")}>${STATUS_META[s].label}</option>`), addAttribute(q.assigned_to || "", "value"), q.admin_notes || "", q.id.slice(0, 8), formatDate(q.created_at), formatDate(q.updated_at), q.assigned_to && renderTemplate`<div class="flex justify-between"><dt class="text-gray-500">Assigned</dt><dd class="font-medium text-gray-900">${q.assigned_to}</dd></div>`) })}`;
}, "/home/hamzaa1i/reve-stitching/src/pages/admin/quote/[id].astro", void 0);

const $$file = "/home/hamzaa1i/reve-stitching/src/pages/admin/quote/[id].astro";
const $$url = "/admin/quote/[id]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$id,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
