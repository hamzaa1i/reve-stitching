const __vite_import_meta_env__ = {"ASSETS_PREFIX": undefined, "BASE_URL": "/", "DEV": false, "MODE": "production", "PROD": true, "PUBLIC_SUPABASE_ANON_KEY": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImptZXFpZ2hkdmFjZ2dtd3RieGZvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI2OTY4NDYsImV4cCI6MjA4ODI3Mjg0Nn0.xsrP9O3vVZb4JK-pgb8zE2fMBFKX8mV1gljmPCO8F70", "PUBLIC_SUPABASE_URL": "https://jmeqighdvacggmwtbxfo.supabase.co", "SITE": "https://revestitching.com", "SSR": true};
async function analyzeTechPack(techPackBase64, referenceImagesBase64, userProvidedData) {
  if (!techPackBase64 && (!referenceImagesBase64 || referenceImagesBase64.length === 0)) {
    return { extracted_specs: {}, missing_fields: [], action_items: [], confidence: 0 };
  }
  const apiKey = process.env.GITHUB_TOKEN || Object.assign(__vite_import_meta_env__, {})?.GITHUB_TOKEN || "";
  if (!apiKey) {
    console.error("[TechPackAnalyzer] No GITHUB_TOKEN found");
    return { extracted_specs: {}, missing_fields: ["API key missing"], action_items: [], confidence: 0 };
  }
  try {
    const contentParts = [
      { type: "text", text: buildPrompt(userProvidedData) }
    ];
    if (techPackBase64) {
      const dataUri = toDataUri(techPackBase64);
      contentParts.push({
        type: "image_url",
        image_url: { url: dataUri }
      });
    }
    if (referenceImagesBase64 && referenceImagesBase64.length > 0) {
      referenceImagesBase64.slice(0, 3).forEach((img) => {
        contentParts.push({
          type: "image_url",
          image_url: { url: toDataUri(img) }
        });
      });
    }
    console.log("[TechPackAnalyzer] Sending", contentParts.length - 1, "images to GPT-4o...");
    const response = await fetch("https://models.inference.ai.azure.com/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "user",
            content: contentParts
          }
        ],
        temperature: 0.3,
        max_tokens: 2e3
      })
    });
    if (!response.ok) {
      const errText = await response.text();
      console.error("[TechPackAnalyzer] API error:", response.status, errText);
      throw new Error(`API returned ${response.status}`);
    }
    const data = await response.json();
    const aiText = data.choices?.[0]?.message?.content || "";
    console.log("[TechPackAnalyzer] Raw response length:", aiText.length);
    const analysis = parseResponse(aiText);
    console.log("[TechPackAnalyzer] Done — Confidence:", analysis.confidence, "% | Fields:", Object.keys(analysis.extracted_specs).length);
    return analysis;
  } catch (error) {
    console.error("[TechPackAnalyzer] Failed:", error?.message || error);
    return {
      extracted_specs: {},
      missing_fields: ["AI analysis unavailable: " + (error?.message || "unknown error")],
      action_items: [],
      confidence: 0
    };
  }
}
function buildPrompt(userData) {
  return `You are analyzing garment images/tech packs for a manufacturing company. The client may have uploaded product photos, tech packs, screenshots, or reference images.
  
  USER ALREADY PROVIDED:
  ${userData ? `Product: ${userData.product_type || "unspecified"}
Fabric: ${userData.fabric_type || "unspecified"}
Quantity: ${userData.quantity || "unspecified"}` : "None"}
  
  EXTRACT what you CAN see visually. Flag what's MISSING.
  
  EXTRACT IF VISIBLE:
  1. Product type (hoodie, t-shirt, polo, joggers, etc.)
  2. Fabric appearance (fleece, jersey, pique, etc.) — estimate if unclear
  3. Decorations visible (embroidery, prints, location, approximate size)
  4. Colors visible
  5. Accessories (zippers, buttons, drawstrings, etc.)
  6. Any text/specs if this is a tech pack document
  
  MISSING INFO TO FLAG:
  - Fabric GSM weight (if not specified)
  - Exact fabric composition (cotton %, etc.)
  - Pantone color codes
  - Artwork files for printing/embroidery
  - Exact size measurements
  - Packaging requirements
  
  ACTION ITEMS:
  Generate 3-5 specific tasks the sales team should follow up on.
  
  RESPOND IN JSON ONLY (no markdown, no explanation):
  {
    "extracted_specs": {
      "product_type": "string or null",
      "fabric_details": "what you can see/estimate",
      "gsm": null,
      "colors": ["color names you see"],
      "decorations": [{"type": "embroidery", "location": "chest", "details": "visible in image"}],
      "accessories": ["visible items"],
      "packaging": null
    },
    "missing_fields": [
      "Fabric GSM not specified",
      "Pantone codes needed"
    ],
    "action_items": [
      {
        "priority": "high",
        "task": "Request embroidery artwork in AI/EPS format",
        "reason": "Logo visible but no vector file provided"
      }
    ],
    "confidence": 65
  }
  
  Confidence scoring:
  - 80-100: Professional tech pack with clear specs
  - 60-79: Good reference images, some specs missing
  - 40-59: Basic product photos, many details unclear
  - 0-39: Very limited information
  
  Be specific about what you see. Be honest about what you don't know.`;
}
function parseResponse(text) {
  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("No JSON found in AI response");
    }
    const parsed = JSON.parse(jsonMatch[0]);
    return {
      extracted_specs: parsed.extracted_specs || {},
      missing_fields: Array.isArray(parsed.missing_fields) ? parsed.missing_fields : [],
      action_items: Array.isArray(parsed.action_items) ? parsed.action_items : [],
      confidence: typeof parsed.confidence === "number" ? parsed.confidence : 0
    };
  } catch (error) {
    console.error("[TechPackAnalyzer] Parse error:", error);
    console.error("[TechPackAnalyzer] Raw text was:", text.substring(0, 500));
    return {
      extracted_specs: {},
      missing_fields: ["Could not parse AI response"],
      action_items: [],
      confidence: 0
    };
  }
}
function toDataUri(base64) {
  if (base64.startsWith("data:")) {
    return base64;
  }
  const header = base64.substring(0, 10);
  if (header.startsWith("/9j/") || header.startsWith("/9J/")) {
    return `data:image/jpeg;base64,${base64}`;
  }
  if (header.startsWith("iVBOR")) {
    return `data:image/png;base64,${base64}`;
  }
  if (header.startsWith("UklGR")) {
    return `data:image/webp;base64,${base64}`;
  }
  if (header.startsWith("JVBERi")) {
    return `data:application/pdf;base64,${base64}`;
  }
  return `data:image/jpeg;base64,${base64}`;
}

export { analyzeTechPack };
