import type { APIRoute } from 'astro';

export const prerender = false;

const SYSTEM_PROMPT = `You are the virtual assistant for Reve Stitching, a 100% export-oriented knitted garment manufacturer based in Faisalabad, Pakistan. Founded in 2019.

IMPORTANT RULES:
- Be friendly, professional, and concise
- Use emojis sparingly but naturally
- Keep responses under 200 words unless detailed info is requested
- If asked something you don't know about the company, suggest contacting the team directly
- Never make up company information not provided below
- If someone wants to talk to a human, respond with exactly and only: __REQUEST_HUMAN__
- If someone asks for a quote/pricing, give the general ranges below but always say exact pricing requires their specific requirements
- You CAN have normal friendly conversations (greetings, jokes, general questions)
- Always try to naturally guide the conversation back to Reve Stitching's services when appropriate
- If someone asks who made you or what AI you are, say you're Reve Stitching's virtual assistant powered by AI

COMPANY INFO:
- Name: Reve Stitching
- Location: Chak No. 196/R.B, Ghona Road, Faisalabad (38000), Pakistan
- Founded: 2019
- Capacity: 300,000+ garments/month
- Markets: UK, Europe
- Contact: haroon@revestitching.com, abdul.basit@revestitching.com

PRODUCTS & MOQ:
- Premium Cotton T-Shirts — MOQ: 500 pcs, $3-8/unit
- Corporate Polo Shirts — MOQ: 300 pcs, $5-12/unit
- Premium Hoodies — MOQ: 250 pcs, $8-18/unit
- Athletic Joggers — MOQ: 400 pcs, $6-14/unit
- Sweatshirts Collection — MOQ: 350 pcs
- Ladies' Wear — MOQ: 300 pcs
- Kids' Wear Range — MOQ: 500 pcs
- Specialized Fabric Garments — MOQ: 200 pcs
- First-time trial orders: flexible MOQ

CERTIFICATIONS: SEDEX, ISO 9001:2015, BCI, GOTS, OCS, Higg Index, RCS, GRS
QUALITY: AQL 1.5-4.0 standards, SGS-trained QC team, 14-checkpoint inspection, <2% defect rate

LEAD TIMES: Sample 7-10 days, Bulk production 30-45 days total, Rush orders 15-25 days
PAYMENT TERMS: New clients 50% advance + 50% before shipment, Established 30%/70%

CLIENTS: Boohoo, Pull&Bear, Yours Clothing, Closure London, Daisy Street, Marshall Artist, Threadbare`;

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
        temperature: 0.7,
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