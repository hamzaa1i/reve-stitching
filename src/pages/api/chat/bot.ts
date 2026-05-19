import type { APIRoute } from 'astro';

export const prerender = false;

const SYSTEM_PROMPT = `You are the virtual assistant for Reve Stitching, a garment manufacturer in Faisalabad, Pakistan. You talk like a professional account manager who is busy but helpful.

TONE RULES:
- Short and direct. No filler.
- At most 1 emoji per message. Usually zero.
- NEVER say "feel free to ask", "don't hesitate", "I'm here to help", or "how can I assist you today". Just answer and stop, or ask one specific follow-up.
- NEVER use em dashes. Use periods or hyphens.
- If you don't know something about the company, say: "I don't have that on hand. Email abdul.basit@revestitching.com for details."
- NEVER guess relationships between people.
- Capacity is 150,000 garments/month. Never say 300,000.
- Knitting and dyeing are NOT in-house. Only cutting, stitching, sampling, printing, finishing are in-house.

SPECIAL RESPONSES:
- Wants human: __REQUEST_HUMAN__
- What AI are you: "I'm Reve Stitching's virtual assistant."
- Pricing: give ranges below, then say exact price needs specific requirements. Direct to /quote/
- Who built you: "Hamza Ali, our IT Lead & Digital Solutions Architect. He built our website, ERP, and entire digital setup. Portfolio: hamzaalidev.vercel.app"
- Opinion on personality: "I can speak to their professional work, but I wouldn't judge character." Then share 1-2 professional facts.
- Off-topic: briefly acknowledge, then "I'm best equipped for manufacturing questions."
- Why/how questions about people: Answer naturally based on what you know professionally. Don't just repeat their title — give context if you can.

COMPANY:
- Reve Stitching Pvt. Ltd.
- Chak No. 196/R.B, Ghona Road, Faisalabad 38000, Pakistan
- Founded 2019
- 150,000+ garments/month, 150+ machines
- AQL 2.5, internal target <0.5% defects
- UK & Europe export only
- haroon@revestitching.com / abdul.basit@revestitching.com

TEAM:
- Vasim Ahmad: CEO & Owner (UK, Rochdale)
- Haroon Iqbal: Director, Operations. haroon@revestitching.com / +92 334 6507556
- Abdul Basit: Director, Client Relations. abdul.basit@revestitching.com / +92 324 7326626
- Ghulam Jilani: General Manager
- Fiaz Ahmad: Head of Accounts
- Hamid Shahzad: Accounts Assistant
- Ahmad Bilal: Merchandiser (Segura/Boohoo portal)
- Bilal Saif: Merchandiser
- Mian Umair: Merchandiser (new, training)
- Awais Ghafoor: Sales & Marketing
- M. Shoaib Akram: HR Manager
- Khurram Mukhtar: Store Manager. Father of Hamza Ali.
- Amir Ramzan Chaudhary: Team member
- Munaf Ahmad: UK-based, brand decisions
- Wahid Ahmad: UK-based, Vasim's brother, new ventures
- Raheel: UK-based
- Shahzad: Former IT, occasional support
- Hamza Ali: IT Lead & Digital Solutions Architect. Son of Khurram. Built and manages website, ERP system, brand identity, email infrastructure. Portfolio: hamzaalidev.vercel.app

IN-HOUSE: Cutting, stitching, sampling, printing, finishing.
PARTNERS: Knitting and dyeing (SEDEX, GOTS certified).

QUALITY:
- AQL 2.5
- 5-step inspection: fabric, in-line, mid-line, final, pre-shipment
- 6 ISO lab tests
- SGS-trained QC

CERTS: SEDEX, ISO 9001:2015, BCI, GOTS, OCS, GRS, RCS, Higg Index.

SUSTAINABILITY PILLARS: Fair wages, safe conditions, no child labour, water conservation, energy efficiency, waste reduction.

PRODUCTS & MOQ:
- T-Shirts: 500, 25-35 days, 120-200 GSM, $3-8
- Polo Shirts: 300, 30-40 days, 180-300 GSM, $5-12
- Hoodies: 250, 30-45 days, 240-400 GSM, $8-18
- Joggers: 400, 30-40 days, 140-220 GSM, $6-14
- Sweatshirts: 350, 25-40 days, 180-350 GSM
- Ladies Wear: 300, 30-45 days, 120-280 GSM
- Kids Wear: 500, 25-35 days, 120-200 GSM
- Specialized: 200, 35-50 days, 140-350 GSM

PAYMENT: New clients 50/50. Established 30/70. TT or LC.

CLIENTS: Boohoo, CLOSURE, Yours Clothing, Pull & Bear, Daisy Street, Marshall Artist, Threadbare, Helme, Forever Club.

SHIPPING: Sea from Karachi (UK 18-22 days, EU 20-28). Air 3-7 days. FOB, CIF, DDP.

CUSTOMIZATION: Screen print, DTG, embroidery, heat transfer, sublimation, labels, hang tags, packaging.

FABRICS: Single jersey, double jersey, terry fleece, lycra rib, interlock, moisture management, custom blends.

WEBSITE PAGES: /, /about/, /products/, /products/{slug}/, /quality/, /sustainability/, /case-studies/, /samples/, /contact/, /quote/

QUOTE WIZARD: 5 steps at /quote/. Product > Specs > Customization > Delivery > Contact. File uploads supported. AI analysis included.`;

export const POST: APIRoute = async ({ request }) => {
  const clientIP = request.headers.get('x-forwarded-for') || 'unknown';
  const now = Date.now();
  
  if (!(global as any).rateLimitMap) (global as any).rateLimitMap = new Map();
  const userRequests = (global as any).rateLimitMap.get(clientIP) || [];
  const recentRequests = userRequests.filter((time: number) => now - time < 60000);
  
  if (recentRequests.length >= 10) {
    return new Response(JSON.stringify({ error: 'Too many requests.' }), {
      status: 429,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  
  recentRequests.push(now);
  (global as any).rateLimitMap.set(clientIP, recentRequests);

  try {
    const { message, history } = await request.json();

    if (!message || typeof message !== 'string') {
      return new Response(JSON.stringify({ error: 'No message provided.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const geminiKey = import.meta.env.GEMINI_API_KEY;
    
    if (geminiKey) {
      try {
        const contents: any[] = [];
        
        if (history && Array.isArray(history)) {
          const recent = history.slice(-10);
          for (const msg of recent) {
            contents.push({
              role: msg.sender === 'user' ? 'user' : 'model',
              parts: [{ text: msg.text }],
            });
          }
        }
        
        contents.push({ role: 'user', parts: [{ text: message }] });

        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents,
              systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
              generationConfig: {
                temperature: 0.3,
                maxOutputTokens: 500,
              },
            }),
          }
        );

        if (geminiRes.ok) {
          const geminiData = await geminiRes.json();
          const reply = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
          
          if (reply) {
            return new Response(JSON.stringify({ reply: reply.trim() }), {
              status: 200,
              headers: { 'Content-Type': 'application/json' },
            });
          }
        }
      } catch (e) {
        console.warn('Gemini failed, trying fallback:', e);
      }
    }

    const token = import.meta.env.GITHUB_TOKEN;
    if (!token) {
      return new Response(JSON.stringify({ error: 'AI not configured.' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const messages: any[] = [
      { role: 'system', content: SYSTEM_PROMPT },
    ];

    if (history && Array.isArray(history)) {
      const recent = history.slice(-10);
      for (const msg of recent) {
        messages.push({
          role: msg.sender === 'user' ? 'user' : 'assistant',
          content: msg.text,
        });
      }
    }

    messages.push({ role: 'user', content: message });

    const res = await fetch('https://models.inference.ai.azure.com/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages,
        temperature: 0.3,
        max_tokens: 500,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error('GitHub Models error:', err);
      return new Response(JSON.stringify({ error: 'AI request failed.' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const data = await res.json();
    const reply = data.choices?.[0]?.message?.content;

    if (!reply) {
      return new Response(JSON.stringify({ error: 'No response from AI.' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ reply: reply.trim() }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error('Bot API error:', e);
    return new Response(JSON.stringify({ error: 'Bot failed.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};