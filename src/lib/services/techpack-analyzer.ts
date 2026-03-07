/**
 * AI Tech Pack Analyzer
 * Works with tech packs, product photos, screenshots — anything visual
 */

import { createAzure } from '@ai-sdk/azure';
import { generateText } from 'ai';

const azure = createAzure({
  apiKey: import.meta.env.GITHUB_TOKEN || '',
  baseURL: 'https://models.inference.ai.azure.com',
});

interface TechPackAnalysis {
  extracted_specs: {
    product_type?: string;
    fabric_details?: string;
    gsm?: number;
    colors?: string[];
    decorations?: Array<{
      type: string;
      location: string;
      details: string;
    }>;
    accessories?: string[];
    packaging?: string;
  };
  missing_fields: string[];
  action_items: Array<{
    priority: 'high' | 'medium' | 'low';
    task: string;
    reason: string;
  }>;
  confidence: number;
}

export async function analyzeTechPack(
  techPackBase64?: string | null,
  referenceImagesBase64?: string[],
  userProvidedData?: {
    product_type?: string;
    fabric_type?: string;
    quantity?: number;
  }
): Promise<TechPackAnalysis> {
  
  // If no files at all, return empty analysis
  if (!techPackBase64 && (!referenceImagesBase64 || referenceImagesBase64.length === 0)) {
    return {
      extracted_specs: {},
      missing_fields: [],
      action_items: [],
      confidence: 0,
    };
  }

  try {
    const prompt = buildAnalysisPrompt(userProvidedData);
    
    const messages: any[] = [
      {
        role: 'user',
        content: [
          { type: 'text', text: prompt },
        ],
      },
    ];

    // Add tech pack if available
     if (techPackBase64) {
        // Detect MIME type from Base64 header or default to JPEG
        const mimeType = detectMimeType(techPackBase64);
        const cleanBase64 = techPackBase64.replace(/^data:[^;]+;base64,/, '');
        
        messages[0].content.push({
          type: 'image',
          image: `data:${mimeType};base64,${cleanBase64}`,
        });
      }
  
      // Add reference images (limit to first 3)
      if (referenceImagesBase64 && referenceImagesBase64.length > 0) {
        const imagesToAnalyze = referenceImagesBase64.slice(0, 3);
        imagesToAnalyze.forEach((img) => {
          const mimeType = detectMimeType(img);
          const cleanBase64 = img.replace(/^data:[^;]+;base64,/, '');
          
          messages[0].content.push({
            type: 'image',
            image: `data:${mimeType};base64,${cleanBase64}`,
          });
        });
      }
  
      console.log('[TechPackAnalyzer] Sending', messages[0].content.length - 1, 'images to AI...');
  
      const result = await generateText({
        model: azure('gpt-4o'),
        messages,
        temperature: 0.3,
        maxTokens: 2000,
      });

    const analysis = parseAnalysisResponse(result.text);
    console.log('[TechPackAnalyzer] Confidence:', analysis.confidence, '% | Extracted:', Object.keys(analysis.extracted_specs).length, 'fields');
    
    return analysis;

} catch (error: any) {
    console.error('[TechPackAnalyzer] Failed:', error?.message || error);
    console.error('[TechPackAnalyzer] Stack:', error?.stack || 'no stack');
    return {

      extracted_specs: {},
      missing_fields: ['AI analysis unavailable'],
      action_items: [],
      confidence: 0,
    };
  }
}

function buildAnalysisPrompt(userData?: any): string {
  return `You are analyzing garment images/tech packs for manufacturing. The client may have uploaded:
- Professional tech pack (PDF pages)
- Product photos from online stores
- Reference garment images
- Screenshots

USER ALREADY PROVIDED:
${userData ? `Product: ${userData.product_type || 'unspecified'}\nFabric: ${userData.fabric_type || 'unspecified'}\nQuantity: ${userData.quantity || 'unspecified'}` : 'None'}

YOUR JOB: Extract what you CAN see visually, flag what's MISSING.

EXTRACT IF VISIBLE:
1. Product type (hoodie, t-shirt, polo, joggers, etc.)
2. Fabric appearance (fleece, jersey, etc.) — estimate if unclear
3. Decorations visible (embroidery, prints, location, approximate size)
4. Colors visible
5. Accessories (zippers, buttons, drawstrings, etc.)
6. Any text/specs if this is a tech pack

MISSING INFO TO FLAG:
- Fabric GSM weight (if not specified)
- Exact fabric composition (cotton %, etc.)
- Pantone color codes
- Artwork files for printing/embroidery
- Exact size measurements
- Packaging requirements

ACTION ITEMS:
Generate 3-5 specific tasks the sales team should follow up on.

RESPOND IN JSON:
{
  "extracted_specs": {
    "product_type": "string or null",
    "fabric_details": "what you can see/estimate",
    "gsm": number or null,
    "colors": ["color names you see"],
    "decorations": [{"type": "embroidery", "location": "chest", "details": "visible in image"}],
    "accessories": ["visible items"]
  },
  "missing_fields": [
    "Fabric GSM not specified",
    "Pantone codes needed",
    "Embroidery artwork required"
  ],
  "action_items": [
    {
      "priority": "high",
      "task": "Request embroidery artwork in AI/EPS format",
      "reason": "Logo visible but no vector file provided"
    }
  ],
  "confidence": 75
}

Confidence score:
- 80-100: Professional tech pack with clear specs
- 60-79: Good reference images, some specs missing
- 40-59: Basic product photos, many details unclear
- 0-39: Very limited information, mostly guesswork

Be honest about what you DON'T know. Flag missing info clearly.`;
}

function parseAnalysisResponse(text: string): TechPackAnalysis {
  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON in response');
    }

    const parsed = JSON.parse(jsonMatch[0]);
    
    return {
      extracted_specs: parsed.extracted_specs || {},
      missing_fields: Array.isArray(parsed.missing_fields) ? parsed.missing_fields : [],
      action_items: Array.isArray(parsed.action_items) ? parsed.action_items : [],
      confidence: typeof parsed.confidence === 'number' ? parsed.confidence : 0,
    };

  } catch (error) {
    console.error('[TechPackAnalyzer] Parse error:', error);
    return {
      extracted_specs: {},
      missing_fields: ['Could not parse AI response'],
      action_items: [],
      confidence: 0,
    };
  }
}

function detectMimeType(base64: string): string {
    // Check if it already has a data URI prefix
    if (base64.startsWith('data:')) {
      const match = base64.match(/^data:([^;]+);/);
      if (match) return match[1];
    }
  
    // Detect from Base64 magic bytes
    const header = base64.substring(0, 20).toUpperCase();
    
    if (header.startsWith('/9J/') || header.startsWith('/9J')) return 'image/jpeg';
    if (header.startsWith('IVBOR')) return 'image/png';
    if (header.startsWith('AAAAF') || header.startsWith('AAABA')) return 'video/mp4';
    if (header.startsWith('JVBER')) return 'application/pdf';
    if (header.startsWith('UKLT')) return 'image/webp';
    
    // Default to JPEG (most common for garment photos)
    return 'image/jpeg';
  }