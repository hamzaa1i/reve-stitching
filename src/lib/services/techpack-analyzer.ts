/**
 * AI Tech Pack Analyzer
 * Extracts specifications from uploaded tech packs and generates action items
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
  confidence: number; // 0-100
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
  
  if (!techPackBase64 && (!referenceImagesBase64 || referenceImagesBase64.length === 0)) {
    return {
      extracted_specs: {},
      missing_fields: ['No files uploaded for analysis'],
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

    // Add tech pack image if available
    if (techPackBase64) {
      messages[0].content.push({
        type: 'image',
        image: techPackBase64,
      });
    }

    // Add reference images
    if (referenceImagesBase64 && referenceImagesBase64.length > 0) {
      referenceImagesBase64.forEach((img) => {
        messages[0].content.push({
          type: 'image',
          image: img,
        });
      });
    }

    const result = await generateText({
      model: azure('gpt-4o'),
      messages,
      temperature: 0.3, // Lower = more factual
    });

    const analysis = parseAnalysisResponse(result.text);
    console.log('[TechPackAnalyzer] Analysis complete:', analysis);
    
    return analysis;

  } catch (error) {
    console.error('[TechPackAnalyzer] Failed:', error);
    return {
      extracted_specs: {},
      missing_fields: ['AI analysis failed - will process manually'],
      action_items: [
        {
          priority: 'high',
          task: 'Manual tech pack review required',
          reason: 'Automated analysis unavailable',
        },
      ],
      confidence: 0,
    };
  }
}

function buildAnalysisPrompt(userData?: any): string {
  return `You are a garment manufacturing technical analyst. Analyze the uploaded tech pack and reference images.

USER PROVIDED INFO:
${userData ? JSON.stringify(userData, null, 2) : 'None'}

EXTRACT THESE SPECIFICATIONS:

1. PRODUCT DETAILS
- Exact product type (t-shirt, hoodie, polo, joggers, etc.)
- Style variations (pullover, zip-up, crew neck, etc.)

2. FABRIC & MATERIALS  
- Fabric type (single jersey, fleece, pique, etc.)
- GSM weight (if specified)
- Fiber composition (cotton %, polyester %, etc.)
- Any special treatments (brushed, peached, moisture-wicking, etc.)

3. DECORATIONS
- Print methods (screen, DTG, heat transfer, etc.)
- Print locations and sizes
- Embroidery locations and stitch counts
- Number of colors per decoration

4. ACCESSORIES & TRIMS
- Zippers (brand, size, color)
- Buttons, snaps, rivets
- Drawcords, elastics
- Labels (main, care, size)

5. PACKAGING
- Polybag, tissue, boxes
- Hang tags, stickers

IDENTIFY MISSING INFORMATION:
List anything that is unclear, not specified, or needs client confirmation.

GENERATE ACTION ITEMS:
For each missing or unclear item, create a task for the sales team with:
- Priority (high/medium/low)
- Specific task
- Why it's needed

CONFIDENCE SCORE:
Rate 0-100 how complete and clear the tech pack is.

RESPOND IN THIS EXACT JSON FORMAT:
{
  "extracted_specs": {
    "product_type": "string",
    "fabric_details": "string",
    "gsm": number or null,
    "colors": ["color1", "color2"],
    "decorations": [
      {"type": "embroidery", "location": "chest", "details": "3 inch logo, 6 colors"}
    ],
    "accessories": ["YKK zipper #5", "woven main label"],
    "packaging": "polybag + hang tag"
  },
  "missing_fields": [
    "Pantone color codes not specified",
    "Embroidery artwork not provided"
  ],
  "action_items": [
    {
      "priority": "high",
      "task": "Request Pantone swatch approval for 4 colors",
      "reason": "Color matching requires exact codes"
    }
  ],
  "confidence": 85
}

BE SPECIFIC. If you see exact details, include them. If something is vague, flag it.`;
}

function parseAnalysisResponse(text: string): TechPackAnalysis {
  try {
    // Extract JSON from response (AI might wrap it in markdown code blocks)
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in response');
    }

    const parsed = JSON.parse(jsonMatch[0]);
    
    return {
      extracted_specs: parsed.extracted_specs || {},
      missing_fields: parsed.missing_fields || [],
      action_items: parsed.action_items || [],
      confidence: parsed.confidence || 0,
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