import { createClient } from '@supabase/supabase-js';

const TEMPLATE_DEFAULTS = {
  "24h": {
    name: "24-Hour Buyer Follow-Up",
    subject: "Your Quote {reference_number} Is Under Review — Reve Stitching",
    greeting: "Thank you for your interest in Reve Stitching. We wanted to let you know that your quote request is currently being reviewed by our production team.",
    main_body: "We aim to send you a detailed quotation within 48 hours. If your order is urgent, don't hesitate to reach out directly.",
    cta_text: "Chat With Us on WhatsApp",
    footer_note: "Or reply directly to this email — we're here to help."
  },
  "48h": {
    name: "48-Hour Admin Reminder",
    subject: "PENDING: Quote {reference_number} — No Response in 48h",
    greeting: "{full_name} from {company_name} is waiting for a response.",
    main_body: "Buyers who get responses within 24h are 3x more likely to convert. After 48h, buyer interest drops by 60%. Competitors may already be quoting this buyer.",
    cta_text: "Review Quote Now",
    footer_note: ""
  },
  "7d": {
    name: "7-Day Re-engagement",
    subject: "Still interested in {product_type}? — Quote {reference_number}",
    greeting: "A week ago, you requested a quote for {quantity} {product_type}. We wanted to check in — are you still exploring this project?",
    main_body: "If your plans have changed, no worries at all. But if you'd like to move forward or adjust your requirements, we're ready to help.",
    cta_text: "Update My Quote Request",
    footer_note: "This is a one-time follow-up. You won't receive further automated emails about this quote unless you contact us."
  }
};
const DEFAULT_BRANDING = {
  company_name: "Reve Stitching",
  tagline: "Premium Garment Manufacturing",
  logo_text: "R",
  brand_color: "#166534",
  whatsapp_number: "+92 332 9555786",
  support_email: "info@revestitching.com",
  website_url: "https://revestitching.com",
  footer_text: `Reve Stitching (Pvt.) Ltd.
100% Export-Oriented Knitted Garment Manufacturer
Faisalabad, Pakistan`
};
function getSupabase() {
  return createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}
let settingsCache = null;
let settingsCacheTime = 0;
const CACHE_TTL = 5 * 60 * 1e3;
async function getTemplateSettings() {
  const now = Date.now();
  if (settingsCache && now - settingsCacheTime < CACHE_TTL) {
    return settingsCache;
  }
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase.from("email_template_settings").select("*").limit(1).single();
    if (error || !data) {
      console.warn("[TemplateStorage] No branding settings found, using defaults");
      return {
        id: "default",
        ...DEFAULT_BRANDING,
        updated_at: (/* @__PURE__ */ new Date()).toISOString()
      };
    }
    settingsCache = data;
    settingsCacheTime = now;
    return settingsCache;
  } catch (err) {
    console.error("[TemplateStorage] Error fetching settings:", err);
    return {
      id: "default",
      ...DEFAULT_BRANDING,
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    };
  }
}
async function saveTemplateSettings(settings) {
  try {
    const supabase = getSupabase();
    const { data: existing } = await supabase.from("email_template_settings").select("id").limit(1).single();
    if (existing) {
      const { error } = await supabase.from("email_template_settings").update({
        ...settings,
        updated_at: (/* @__PURE__ */ new Date()).toISOString()
      }).eq("id", existing.id);
      if (error) {
        console.error("[TemplateStorage] Save error:", error);
        return { success: false, error: error.message };
      }
    } else {
      const { error } = await supabase.from("email_template_settings").insert({
        ...DEFAULT_BRANDING,
        ...settings
      });
      if (error) {
        console.error("[TemplateStorage] Insert error:", error);
        return { success: false, error: error.message };
      }
    }
    settingsCache = null;
    settingsCacheTime = 0;
    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return { success: false, error: message };
  }
}
function getDefaultSettings() {
  return { ...DEFAULT_BRANDING };
}
let contentCache = /* @__PURE__ */ new Map();
let contentCacheTime = 0;
async function getTemplateContent(templateId) {
  const now = Date.now();
  if (now - contentCacheTime < CACHE_TTL && contentCache.size > 0) {
    return contentCache.get(templateId) || null;
  }
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase.from("email_template_content").select("*");
    contentCache.clear();
    contentCacheTime = now;
    if (error) {
      console.warn("[TemplateStorage] Error fetching content:", error);
      return null;
    }
    if (data) {
      for (const row of data) {
        contentCache.set(row.template_id, row);
      }
    }
    return contentCache.get(templateId) || null;
  } catch (err) {
    console.error("[TemplateStorage] Exception fetching content:", err);
    return null;
  }
}
async function saveTemplateContent(templateId, content) {
  try {
    const supabase = getSupabase();
    const { data: existing } = await supabase.from("email_template_content").select("template_id").eq("template_id", templateId).single();
    if (existing) {
      const { error } = await supabase.from("email_template_content").update({
        ...content,
        updated_at: (/* @__PURE__ */ new Date()).toISOString()
      }).eq("template_id", templateId);
      if (error) {
        console.error("[TemplateStorage] Update content error:", error);
        return { success: false, error: error.message };
      }
    } else {
      const { error } = await supabase.from("email_template_content").insert({
        template_id: templateId,
        ...content
      });
      if (error) {
        console.error("[TemplateStorage] Insert content error:", error);
        return { success: false, error: error.message };
      }
    }
    contentCache.clear();
    contentCacheTime = 0;
    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return { success: false, error: message };
  }
}
async function deleteTemplateContent(templateId) {
  try {
    const supabase = getSupabase();
    await supabase.from("email_template_content").delete().eq("template_id", templateId);
    contentCache.clear();
    contentCacheTime = 0;
    return { success: true };
  } catch (err) {
    console.error("[TemplateStorage] Delete content error:", err);
    return { success: true };
  }
}
function replaceVars(template, vars) {
  let result = template;
  for (const [key, value] of Object.entries(vars)) {
    result = result.replace(new RegExp(`\\{${key}\\}`, "g"), value);
  }
  return result;
}
function buildVars(quote) {
  const firstName = (quote.contact_person || "").split(" ")[0] || "there";
  return {
    first_name: firstName,
    full_name: quote.contact_person || "",
    company_name: quote.company_name || "",
    reference_number: quote.reference_number || "",
    product_type: quote.product_type || "",
    quantity: (quote.quantity || 0).toLocaleString(),
    estimated_price: quote.estimated_price_range || "TBD"
  };
}

export { TEMPLATE_DEFAULTS as T, getTemplateContent as a, buildVars as b, getTemplateSettings as c, deleteTemplateContent as d, saveTemplateSettings as e, getDefaultSettings as g, replaceVars as r, saveTemplateContent as s };
