import { a as getSupabase } from './supabase_BOuP-yIE.mjs';
import { b as notifyNewQuote, s as sendQuoteCustomerConfirmation } from './notifications_D1fqCv0k.mjs';
import { g as getClientIp, c as checkRateLimit, t as truncate, s as sanitizeString, i as isValidEmail } from './security_Bv8llNtS.mjs';

async function generateReferenceNumber() {
  const supabase = getSupabase();
  const maxAttempts = 5;
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const now = /* @__PURE__ */ new Date();
    const datePart = [
      now.getFullYear(),
      String(now.getMonth() + 1).padStart(2, "0"),
      String(now.getDate()).padStart(2, "0")
    ].join("");
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let rand = "";
    for (let i = 0; i < 4; i++) {
      rand += chars[Math.floor(Math.random() * chars.length)];
    }
    const ref = `RQ-${datePart}-${rand}`;
    const { count } = await supabase.from("quote_requests").select("id", { count: "exact", head: true }).eq("reference_number", ref);
    if (count === 0) return ref;
  }
  return `RQ-${Date.now()}`;
}

async function generateAISummary(data) {
  {
    console.warn("[AI] GITHUB_TOKEN not set — skipping AI summary");
    return fallbackSummary(data);
  }
}
function fallbackSummary(data) {
  return {
    ai_summary: `Quote request for ${data.quantity} pcs of ${data.product_type} in ${data.fabric_type} (${data.gsm} GSM). ${data.customizations.length} customization(s) requested. Destination: ${data.destination}.`,
    estimated_price_range: "Pending manual review",
    suggested_moq: null,
    ai_flags: "AI summary unavailable — manual review required."
  };
}

const prerender = false;
function getContentType(filename) {
  const ext = filename.toLowerCase().split(".").pop();
  const types = {
    pdf: "application/pdf",
    ai: "application/postscript",
    eps: "application/postscript",
    doc: "application/msword",
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    png: "image/png",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    webp: "image/webp"
  };
  return types[ext || ""] || "application/octet-stream";
}
const POST = async ({ request }) => {
  try {
    const ip = getClientIp(request);
    if (!checkRateLimit(ip, 3, 6e4)) {
      return new Response(
        JSON.stringify({ error: "Too many requests. Please wait a minute." }),
        { status: 429, headers: { "Content-Type": "application/json" } }
      );
    }
    const body = await request.json();
    const parseJsonField = (val, fallback = []) => {
      if (!val) return fallback;
      if (Array.isArray(val)) return val;
      if (typeof val === "string") {
        try {
          return JSON.parse(val);
        } catch {
          return fallback;
        }
      }
      return fallback;
    };
    const product_type = truncate(sanitizeString(body.selectedProduct || ""), 100);
    const fabric_type = truncate(sanitizeString(body.fabricType || ""), 100);
    const gsm = Number(body.gsmRange) || 0;
    const quantity = Number(body.quantity) || 0;
    const sizes = parseJsonField(body.sizeRange, []);
    const color_count = Number(body.colorQuantity) || 1;
    const customizations = parseJsonField(body.customizations, []);
    const has_sample = body.sampleRequired === "true";
    const is_rush = body.rushOrder === "true";
    const target_date = truncate(sanitizeString(body.deliveryDate || ""), 20);
    const destination = truncate(sanitizeString(body.shippingDestination || ""), 100);
    const company_name = truncate(sanitizeString(body.companyName || ""), 200);
    const contact_person = truncate(sanitizeString(body.contactPerson || ""), 200);
    const email = truncate((body.email || "").trim().toLowerCase(), 254);
    const phone = body.phone ? truncate(sanitizeString(body.phone), 50) : null;
    const notes = body.additionalNotes ? truncate(sanitizeString(body.additionalNotes), 3e3) : null;
    const errors = [];
    if (!product_type) errors.push("Product type is required.");
    if (!fabric_type) errors.push("Fabric type is required.");
    if (!gsm || gsm < 100 || gsm > 500)
      errors.push("GSM must be between 100 and 500.");
    if (!quantity || quantity < 1) errors.push("Quantity is required.");
    if (!sizes || sizes.length === 0)
      errors.push("At least one size is required.");
    if (!target_date) errors.push("Target delivery date is required.");
    if (!destination) errors.push("Shipping destination is required.");
    if (!company_name) errors.push("Company name is required.");
    if (!contact_person) errors.push("Contact person is required.");
    if (!email) errors.push("Email is required.");
    if (email && !isValidEmail(email))
      errors.push("Please provide a valid email address.");
    if (errors.length > 0) {
      return new Response(
        JSON.stringify({ success: false, error: errors.join(" ") }),
        { status: 422, headers: { "Content-Type": "application/json" } }
      );
    }
    const reference_number = await generateReferenceNumber();
    console.log(`[Quote] Processing ${reference_number} from ${company_name}`);
    const supabase = getSupabase();
    let tech_pack_url = null;
    const reference_images = [];
    if (body.techPackBase64 && body.techPackName) {
      try {
        const buffer = Buffer.from(body.techPackBase64, "base64");
        const safeName = body.techPackName.replace(/[^a-zA-Z0-9._-]/g, "_").replace(/_{2,}/g, "_");
        const path = `${reference_number}/techpack/${Date.now()}_${safeName}`;
        const { error: uploadError } = await supabase.storage.from("quote-uploads").upload(path, buffer, {
          contentType: getContentType(body.techPackName),
          upsert: false
        });
        if (!uploadError) {
          tech_pack_url = path;
          console.log(`[Quote] Tech pack uploaded: ${path}`);
        } else {
          console.error("[Quote] Tech pack upload failed:", uploadError.message);
        }
      } catch (err) {
        console.error("[Quote] Tech pack upload error:", err);
      }
    }
    if (body.referenceImagesBase64 && Array.isArray(body.referenceImagesBase64)) {
      for (let i = 0; i < body.referenceImagesBase64.length; i++) {
        try {
          const buffer = Buffer.from(body.referenceImagesBase64[i], "base64");
          const safeName = body.referenceImageNames[i].replace(/[^a-zA-Z0-9._-]/g, "_").replace(/_{2,}/g, "_");
          const path = `${reference_number}/images/${Date.now()}_${i}_${safeName}`;
          const { error: uploadError } = await supabase.storage.from("quote-uploads").upload(path, buffer, {
            contentType: getContentType(
              body.referenceImageNames[i]
            ),
            upsert: false
          });
          if (!uploadError) {
            reference_images.push(path);
            console.log(`[Quote] Image ${i + 1} uploaded: ${path}`);
          } else {
            console.error(
              `[Quote] Image ${i + 1} upload failed:`,
              uploadError.message
            );
          }
        } catch (err) {
          console.error(`[Quote] Image ${i + 1} upload error:`, err);
        }
      }
    }
    let ai_summary = null;
    let estimated_price_range = null;
    let suggested_moq = null;
    let ai_flags = null;
    let ai_extracted_data = null;
    let ai_confidence_score = null;
    let ai_missing_fields = null;
    let action_items = null;
    try {
      const [summaryResult, techPackResult] = await Promise.all([
        generateAISummary({
          product_type,
          fabric_type,
          gsm,
          quantity,
          sizes,
          color_count,
          customizations,
          has_sample,
          is_rush,
          target_date,
          destination,
          notes
        }),
        (async () => {
          if (body.techPackBase64 || body.referenceImagesBase64 && body.referenceImagesBase64.length > 0) {
            const { analyzeTechPack } = await import('./techpack-analyzer_BgvNtcWb.mjs');
            return analyzeTechPack(
              body.techPackBase64,
              body.referenceImagesBase64,
              { product_type, fabric_type, quantity }
            );
          }
          return null;
        })()
      ]);
      ai_summary = summaryResult.ai_summary;
      estimated_price_range = summaryResult.estimated_price_range;
      suggested_moq = summaryResult.suggested_moq;
      ai_flags = summaryResult.ai_flags;
      if (techPackResult) {
        ai_extracted_data = techPackResult.extracted_specs;
        ai_confidence_score = techPackResult.confidence / 100;
        ai_missing_fields = techPackResult.missing_fields;
        action_items = {
          items: techPackResult.action_items.map((item, idx) => ({
            id: `auto-${idx}`,
            priority: item.priority,
            title: item.task,
            description: item.reason,
            completed: false
          })),
          auto_generated: true,
          generated_at: (/* @__PURE__ */ new Date()).toISOString()
        };
        if (Object.keys(techPackResult.extracted_specs).length > 0) {
          ai_summary = `${ai_summary}

━━━ TECH PACK ANALYSIS ━━━
${JSON.stringify(techPackResult.extracted_specs, null, 2)}`;
        }
        if (techPackResult.missing_fields.length > 0) {
          const missingInfo = `Missing: ${techPackResult.missing_fields.join("; ")}`;
          ai_flags = ai_flags ? `${ai_flags}
${missingInfo}` : missingInfo;
        }
      }
    } catch (err) {
      console.error("[Quote] AI analysis failed:", err);
    }
    const { data: inserted, error: dbError } = await supabase.from("quote_requests").insert({
      reference_number,
      status: "new",
      product_type,
      fabric_type,
      gsm,
      quantity,
      sizes,
      color_count,
      customizations,
      has_sample,
      is_rush,
      target_date,
      destination,
      company_name,
      contact_person,
      email,
      phone,
      notes,
      tech_pack_url,
      reference_images,
      ai_summary,
      estimated_price_range,
      suggested_moq,
      ai_flags,
      ai_extracted_data,
      ai_confidence_score,
      ai_missing_fields,
      action_items,
      tech_pack_status: tech_pack_url ? "analyzed" : null,
      admin_notes: null,
      assigned_to: null
    }).select().single();
    if (dbError || !inserted) {
      console.error("[Quote] Database insert failed:", dbError);
      return new Response(
        JSON.stringify({
          success: false,
          error: "Failed to save. Please try again."
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
    console.log(
      `[Quote] Saved ${reference_number} with id ${inserted.id}`
    );
    const quoteRecord = inserted;
    await Promise.allSettled([
      notifyNewQuote(quoteRecord),
      sendQuoteCustomerConfirmation(quoteRecord)
    ]);
    return new Response(
      JSON.stringify({
        success: true,
        referenceNumber: reference_number
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("[Quote] Unexpected error:", err);
    return new Response(
      JSON.stringify({
        success: false,
        error: "Something went wrong. Please try again."
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
