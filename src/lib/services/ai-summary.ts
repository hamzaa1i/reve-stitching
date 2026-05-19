// src/lib/services/ai-summary.ts

import type { AISummaryResult } from '../types/quote';

interface QuoteDataForAI {
  product_type: string;
  fabric_type: string;
  gsm: number;
  quantity: number;
  sizes: string[];
  color_count: number;
  customizations: string[];
  has_sample: boolean;
  is_rush: boolean;
  target_date: string;
  destination: string;
  notes: string | null;
}

const SYSTEM_PROMPT = `You are a senior sales analyst at a Pakistani knitted garment export manufacturer (Reve Stitching, based in Faisalabad). 
You analyze incoming quote requests and produce a concise sales brief for the production and sales team.

Your response MUST be valid JSON with exactly these keys:
{
  "summary": "2-3 sentence professional inquiry summary",
  "priceRange": "estimated FOB price range per piece in USD, e.g. '$4.50 – $7.00'",
  "suggestedMoq": null or a number if the requested quantity is below sensible MOQ,
  "flags": null or a string listing any red flags / clarifications needed
}

Price estimation guidelines (FOB Pakistan, USD per piece):
- Basic T-shirt 160gsm single jersey: $3.00–5.00
- Polo shirt 220gsm pique: $5.00–9.00
- Hoodie 300gsm fleece: $8.00–14.00
- Jogger 280gsm fleece: $6.00–11.00
- Sweatshirt 280gsm fleece: $7.00–12.00
- Add 10-20% for rush orders
- Add $0.50–2.00 per customization type
- Higher GSM = higher cost
- More colors = slightly higher cost
- Embroidery adds $0.80–3.00 depending on stitch count
- Sublimation adds $1.00–3.00

MOQ guidelines:
- T-shirts: 500 per style/color
- Polos: 300
- Hoodies: 250
- Joggers: 400
- Sweatshirts: 350
- Ladies wear: 300
- Kids wear: 500

If quantity is below MOQ, suggest the correct MOQ in suggestedMoq.`;

function buildUserPrompt(data: QuoteDataForAI): string {
  const customList = data.customizations.length
    ? data.customizations.join(', ')
    : 'None';

  return `Analyze this quote request:

Product: ${data.product_type}
Fabric: ${data.fabric_type}, ${data.gsm} GSM
Quantity: ${data.quantity} pieces
Sizes: ${data.sizes.join(', ')}
Colors: ${data.color_count}
Customizations: ${customList}
Sample requested: ${data.has_sample ? 'Yes' : 'No'}
Rush order: ${data.is_rush ? 'Yes' : 'No'}
Target delivery: ${data.target_date}
Destination: ${data.destination}
${data.notes ? `Customer notes: ${data.notes}` : ''}

Generate the JSON analysis.`;
}

export async function generateAISummary(
  data: QuoteDataForAI
): Promise<AISummaryResult> {
  const token = import.meta.env.GITHUB_TOKEN;
  const model = import.meta.env.GITHUB_MODEL || 'gpt-4o-mini';

  if (!token) {
    console.warn('[AI] GITHUB_TOKEN not set — skipping AI summary');
    return fallbackSummary(data);
  }

  try {
    const response = await fetch(
      'https://models.inference.ai.azure.com/chat/completions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: buildUserPrompt(data) },
          ],
          temperature: 0.4,
          max_tokens: 600,
          response_format: { type: 'json_object' },
        }),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      console.error(`[AI] GitHub Models API error ${response.status}: ${errText}`);
      return fallbackSummary(data);
    }

    const json = await response.json();
    const content = json.choices?.[0]?.message?.content;

    if (!content) {
      console.error('[AI] No content in response');
      return fallbackSummary(data);
    }

    const parsed = JSON.parse(content);

    return {
      ai_summary: parsed.summary || '',
      estimated_price_range: parsed.priceRange || '',
      suggested_moq: parsed.suggestedMoq ?? null,
      ai_flags: parsed.flags ?? null,
    };
  } catch (err) {
    console.error('[AI] Summary generation failed:', err);
    return fallbackSummary(data);
  }
}

function fallbackSummary(data: QuoteDataForAI): AISummaryResult {
  return {
    ai_summary: `Quote request for ${data.quantity} pcs of ${data.product_type} in ${data.fabric_type} (${data.gsm} GSM). ${data.customizations.length} customization(s) requested. Destination: ${data.destination}.`,
    estimated_price_range: 'Pending manual review',
    suggested_moq: null,
    ai_flags: 'AI summary unavailable — manual review required.',
  };
}