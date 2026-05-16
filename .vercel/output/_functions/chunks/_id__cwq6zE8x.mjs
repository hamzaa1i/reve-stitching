import { c as createComponent } from './astro-component_jWm3wabT.mjs';
import 'piccolore';
import { b8 as renderTemplate, aW as maybeRenderHead, a5 as addAttribute } from './params-and-props_CgCnFJtu.mjs';
import { r as renderComponent } from './entrypoint_Bu1exgrV.mjs';
import { $ as $$AdminLayout } from './AdminLayout_aVs5BGT6.mjs';
import { a as getTemplateContent, s as saveTemplateContent, d as deleteTemplateContent, T as TEMPLATE_DEFAULTS, b as buildVars } from './template-storage_Dbz2aNJw.mjs';
import { c as generateReengagementEmail, g as generateAdminReminderEmail, a as generateQuoteUnderReviewEmail } from './quote-reengagement_Cg833LUq.mjs';

const prerender = false;
const $$id = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$id;
  const { id } = Astro2.params;
  const validIds = ["24h", "48h", "7d"];
  if (!id || !validIds.includes(id)) {
    return Astro2.redirect("/admin/email-templates");
  }
  const defaults = TEMPLATE_DEFAULTS[id];
  let saved = await getTemplateContent(id);
  let flash = "";
  const sampleQuote = {
    reference_number: "RQ-20260308-DEMO",
    company_name: "Example Fashion Ltd",
    contact_person: "John Smith",
    email: "john@example.com",
    product_type: "hoodies",
    quantity: 2500,
    estimated_price_range: "$12,000 - $18,500",
    created_at: (/* @__PURE__ */ new Date()).toISOString()
  };
  let formValues = null;
  if (Astro2.request.method === "POST") {
    const formData = await Astro2.request.formData();
    const action = formData.get("_action");
    formValues = {
      subject: formData.get("subject") || "",
      greeting: formData.get("greeting") || "",
      main_body: formData.get("main_body") || "",
      cta_text: formData.get("cta_text") || "",
      footer_note: formData.get("footer_note") || ""
    };
    if (action === "save") {
      const result = await saveTemplateContent(id, formValues);
      if (result.success) {
        flash = "Content saved successfully! Future emails will use your custom text.";
        saved = { template_id: id, ...formValues };
      } else {
        flash = `Error: ${result.error}`;
      }
    } else if (action === "reset") {
      await deleteTemplateContent(id);
      saved = null;
      formValues = null;
      flash = "Template reset to defaults.";
    }
  }
  const current = {
    subject: formValues?.subject ?? saved?.subject ?? defaults.subject,
    greeting: formValues?.greeting ?? saved?.greeting ?? defaults.greeting,
    main_body: formValues?.main_body ?? saved?.main_body ?? defaults.main_body,
    cta_text: formValues?.cta_text ?? saved?.cta_text ?? defaults.cta_text,
    footer_note: formValues?.footer_note ?? saved?.footer_note ?? defaults.footer_note
  };
  const contentForPreview = {
    template_id: id,
    ...current
  };
  const generators = {
    "24h": generateQuoteUnderReviewEmail,
    "48h": generateAdminReminderEmail,
    "7d": generateReengagementEmail
  };
  const previewResult = await generators[id](sampleQuote, contentForPreview);
  const previewHtml = previewResult.html;
  const previewSubject = previewResult.subject;
  const vars = buildVars(sampleQuote);
  const isCustomized = !!saved;
  const variableHints = [
    { var: "{first_name}", example: vars.first_name },
    { var: "{full_name}", example: vars.full_name },
    { var: "{company_name}", example: vars.company_name },
    { var: "{reference_number}", example: vars.reference_number },
    { var: "{product_type}", example: vars.product_type },
    { var: "{quantity}", example: vars.quantity },
    { var: "{estimated_price}", example: vars.estimated_price }
  ];
  return renderTemplate`${renderComponent($$result, "AdminLayout", $$AdminLayout, { "title": `Edit: ${defaults.name}` }, { "default": async ($$result2) => renderTemplate`${flash && renderTemplate`${maybeRenderHead()}<div${addAttribute([
    "mb-6 rounded-lg p-3 text-sm font-medium",
    flash.startsWith("Error") ? "bg-red-50 text-red-800" : "bg-green-50 text-green-800"
  ], "class:list")} role="alert"> ${flash} </div>`}<div class="mb-6"> <div class="flex items-center gap-3 mb-2"> <a href="/admin/email-templates" class="p-2 rounded-lg hover:bg-zinc-100 transition-colors"> <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"></path></svg> </a> <div> <h1 class="text-2xl font-bold text-zinc-900">Edit: ${defaults.name}</h1> <p class="text-sm text-zinc-500 mt-1"> ${isCustomized ? "Using custom content. Reset to restore defaults." : "Using default content. Edit to customize."} </p> </div> </div> </div> <div class="grid gap-6 lg:grid-cols-2"> <!-- Editor --> <div class="space-y-6"> <form method="POST" class="space-y-6"> <input type="hidden" name="_action" value="save"> <div class="rounded-xl bg-white p-6 shadow ring-1 ring-zinc-200"> <h3 class="text-sm font-bold text-zinc-900 mb-4">Email Content</h3> <div class="space-y-4"> <div> <label for="subject" class="block text-xs font-medium text-zinc-600 mb-1">Subject Line</label> <input id="subject" name="subject" type="text"${addAttribute(current.subject, "value")} class="w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"> </div> <div> <label for="greeting" class="block text-xs font-medium text-zinc-600 mb-1">Greeting / Opening</label> <textarea id="greeting" name="greeting" rows="3" class="w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20">${current.greeting}</textarea> <p class="text-[10px] text-zinc-400 mt-1">Shown after "Hi ${`{first_name}`},"</p> </div> <div> <label for="main_body" class="block text-xs font-medium text-zinc-600 mb-1">Main Body Text</label> <textarea id="main_body" name="main_body" rows="3" class="w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20">${current.main_body}</textarea> </div> <div> <label for="cta_text" class="block text-xs font-medium text-zinc-600 mb-1">Button Text</label> <input id="cta_text" name="cta_text" type="text"${addAttribute(current.cta_text, "value")} class="w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"> </div> <div> <label for="footer_note" class="block text-xs font-medium text-zinc-600 mb-1">Footer Note</label> <input id="footer_note" name="footer_note" type="text"${addAttribute(current.footer_note, "value")} class="w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"> <p class="text-[10px] text-zinc-400 mt-1">Small text below the button. Leave empty to hide.</p> </div> </div> </div> <!-- Variable Reference --> <div class="rounded-xl bg-zinc-50 p-5 ring-1 ring-zinc-200"> <h4 class="text-xs font-bold text-zinc-700 mb-3">Available Variables</h4> <div class="grid grid-cols-2 gap-2"> ${variableHints.map((v) => renderTemplate`<div class="text-xs"> <code class="bg-white px-1.5 py-0.5 rounded text-primary font-mono">${v.var}</code> <span class="text-zinc-400 ml-1">${v.example}</span> </div>`)} </div> </div> <!-- Save Button --> <div class="flex gap-3"> <button type="submit" class="flex-1 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow hover:bg-primary-light transition flex items-center justify-center gap-2"> <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"></path></svg>
Save Content
</button> </div> </form> <!-- Reset Button (only show if customized) --> ${isCustomized && renderTemplate`<form method="POST"> <input type="hidden" name="_action" value="reset"> <button type="submit" onclick="return confirm('Reset this template to defaults? Your custom content will be lost.')" class="w-full rounded-lg border border-zinc-300 px-4 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 transition">
Reset to Defaults
</button> </form>`} </div> <!-- Live Preview --> <div> <div class="sticky top-24"> <div class="flex items-center justify-between mb-3"> <h3 class="text-sm font-bold text-zinc-900">Preview</h3> <span class="text-[10px] text-zinc-400">Subject: ${previewSubject}</span> </div> <div class="rounded-xl bg-white shadow ring-1 ring-zinc-200 overflow-hidden"> <iframe${addAttribute(previewHtml, "srcdoc")} class="w-full border-0" style="height: 650px;" title="Email Preview"></iframe> </div> <p class="text-[10px] text-zinc-400 mt-2 text-center">
Save to update the preview. Actual rendering may vary across email clients.
</p> </div> </div> </div> ` })}`;
}, "/home/hamzaa1i/reve-stitching/src/pages/admin/email-templates/[id].astro", void 0);

const $$file = "/home/hamzaa1i/reve-stitching/src/pages/admin/email-templates/[id].astro";
const $$url = "/admin/email-templates/[id]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$id,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
