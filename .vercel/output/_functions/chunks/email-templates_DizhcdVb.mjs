import { getAdminFromCookies } from './auth_BQ4oAavg.mjs';
import { g as getDefaultSettings, e as saveTemplateSettings, c as getTemplateSettings } from './template-storage_Dbz2aNJw.mjs';
import { c as clearTemplateCache } from './_layout_DBrGWFJB.mjs';

const prerender = false;
const GET = async ({ cookies }) => {
  const admin = getAdminFromCookies(cookies);
  if (!admin) {
    return json({ error: "Unauthorized" }, 401);
  }
  try {
    const settings = await getTemplateSettings();
    return json({ success: true, settings });
  } catch (err) {
    return json({ error: "Failed to load settings" }, 500);
  }
};
const POST = async ({ request, cookies }) => {
  const admin = getAdminFromCookies(cookies);
  if (!admin) {
    return json({ error: "Unauthorized" }, 401);
  }
  try {
    const body = await request.json();
    const allowedFields = [
      "company_name",
      "tagline",
      "logo_text",
      "brand_color",
      "whatsapp_number",
      "support_email",
      "website_url",
      "footer_text"
    ];
    const updates = {};
    for (const field of allowedFields) {
      if (body[field] !== void 0) {
        updates[field] = String(body[field]).trim();
      }
    }
    if (Object.keys(updates).length === 0) {
      return json({ error: "No valid fields to update" }, 400);
    }
    const result = await saveTemplateSettings(updates);
    if (result.success) {
      clearTemplateCache();
      console.log(`[Admin] Email template updated by ${admin.sub}`);
    }
    return json(result);
  } catch (err) {
    console.error("[API] Save template error:", err);
    return json({ error: "Failed to save settings" }, 500);
  }
};
const DELETE = async ({ cookies }) => {
  const admin = getAdminFromCookies(cookies);
  if (!admin) {
    return json({ error: "Unauthorized" }, 401);
  }
  try {
    const defaults = getDefaultSettings();
    const result = await saveTemplateSettings(defaults);
    if (result.success) {
      clearTemplateCache();
      console.log(`[Admin] Email template reset to defaults by ${admin.sub}`);
    }
    return json({ success: true, settings: defaults });
  } catch (err) {
    return json({ error: "Failed to reset settings" }, 500);
  }
};
function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" }
  });
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  DELETE,
  GET,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
