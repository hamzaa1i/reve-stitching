import { createClient } from '@supabase/supabase-js';
import { getAdminFromCookies } from './auth_BQ4oAavg.mjs';

async function getQuoteAnalytics(supabase) {
  const { data: quotes, error } = await supabase.from("quote_requests").select("*").order("created_at", { ascending: false });
  if (error || !quotes) {
    console.error("❌ Error fetching quotes:", error);
    return getEmptyAnalytics();
  }
  console.log(`📊 Analyzing ${quotes.length} quotes...`);
  const now = /* @__PURE__ */ new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  new Date(now.getFullYear(), now.getMonth() - 1, 1);
  new Date(now.getFullYear(), now.getMonth(), 0);
  const quotesThisMonth = quotes.filter(
    (q) => new Date(q.created_at) >= startOfMonth
  );
  const activeQuotes = quotes.filter(
    (q) => q.status !== "closed" && q.status !== "rejected" && q.status !== "lost"
  );
  const pipelineValue = activeQuotes.reduce((sum, q) => {
    if (!q.estimated_price_range) return sum;
    const match = q.estimated_price_range.match(/\$?([\d,]+)/);
    if (match) {
      const value = parseInt(match[1].replace(/,/g, ""), 10);
      return sum + value;
    }
    return sum;
  }, 0);
  const quotesWithResponse = quotes.filter(
    (q) => q.status !== "new" && q.updated_at && q.created_at
  );
  const totalResponseTime = quotesWithResponse.reduce((sum, q) => {
    const created = new Date(q.created_at).getTime();
    const updated = new Date(q.updated_at).getTime();
    const hours = (updated - created) / (1e3 * 60 * 60);
    return sum + hours;
  }, 0);
  const avgResponseTime = quotesWithResponse.length > 0 ? totalResponseTime / quotesWithResponse.length : 0;
  const wonQuotes = quotes.filter((q) => q.status === "won").length;
  const conversionRate = quotes.length > 0 ? wonQuotes / quotes.length * 100 : 0;
  const funnel = {
    new: calculateFunnelStage(quotes, "new"),
    reviewed: calculateFunnelStage(quotes, "reviewed"),
    quoted: calculateFunnelStage(quotes, "quoted"),
    won: calculateFunnelStage(quotes, "won"),
    lost: calculateFunnelStage(quotes, "lost")
  };
  const geographyMap = /* @__PURE__ */ new Map();
  quotes.forEach((q) => {
    const country = q.destination || "Unknown";
    geographyMap.set(country, (geographyMap.get(country) || 0) + 1);
  });
  const geography = Array.from(geographyMap.entries()).map(([country, count]) => ({
    country: formatCountryName(country),
    count,
    percentage: count / quotes.length * 100
  })).sort((a, b) => b.count - a.count);
  const productMap = /* @__PURE__ */ new Map();
  quotes.forEach((q) => {
    const product = q.product_type || "Unknown";
    const existing = productMap.get(product) || { count: 0, totalQuantity: 0 };
    productMap.set(product, {
      count: existing.count + 1,
      totalQuantity: existing.totalQuantity + (q.quantity || 0)
    });
  });
  const products = Array.from(productMap.entries()).map(([product, data]) => ({
    product: formatProductName(product),
    count: data.count,
    avgQuantity: data.count > 0 ? data.totalQuantity / data.count : 0
  })).sort((a, b) => b.count - a.count);
  const monthlyTrend = calculateMonthlyTrend(quotes, 6);
  const slowestQuotes = quotes.filter((q) => q.status === "new").map((q) => {
    const hoursWaiting = (now.getTime() - new Date(q.created_at).getTime()) / (1e3 * 60 * 60);
    return {
      id: q.id,
      reference_number: q.reference_number,
      company_name: q.company_name,
      hoursWaiting: Math.round(hoursWaiting)
    };
  }).sort((a, b) => b.hoursWaiting - a.hoursWaiting).slice(0, 5);
  return {
    totalQuotes: quotes.length,
    quotesThisMonth: quotesThisMonth.length,
    activeQuotes: activeQuotes.length,
    pipelineValue,
    avgResponseTime: Math.round(avgResponseTime),
    conversionRate: Math.round(conversionRate * 10) / 10,
    funnel,
    geography,
    products,
    monthlyTrend,
    slowestQuotes
  };
}
function calculateFunnelStage(quotes, status) {
  const stageQuotes = quotes.filter((q) => q.status === status);
  const value = stageQuotes.reduce((sum, q) => {
    if (!q.estimated_price_range) return sum;
    const match = q.estimated_price_range.match(/\$?([\d,]+)/);
    if (match) {
      return sum + parseInt(match[1].replace(/,/g, ""), 10);
    }
    return sum;
  }, 0);
  return { count: stageQuotes.length, value };
}
function calculateMonthlyTrend(quotes, months) {
  const now = /* @__PURE__ */ new Date();
  const trend = [];
  for (let i = months - 1; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
    const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    const count = quotes.filter((q) => {
      const created = new Date(q.created_at);
      return created >= monthStart && created <= monthEnd;
    }).length;
    trend.push({
      month: date.toLocaleDateString("en-US", { month: "short", year: "numeric" }),
      count
    });
  }
  return trend;
}
function formatCountryName(country) {
  const map = {
    uk: "United Kingdom",
    us: "United States",
    eu: "European Union",
    ca: "Canada",
    au: "Australia"
  };
  return map[country.toLowerCase()] || country.toUpperCase();
}
function formatProductName(product) {
  return product.split("-").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
}
function getEmptyAnalytics() {
  return {
    totalQuotes: 0,
    quotesThisMonth: 0,
    activeQuotes: 0,
    pipelineValue: 0,
    avgResponseTime: 0,
    conversionRate: 0,
    funnel: {
      new: { count: 0, value: 0 },
      reviewed: { count: 0, value: 0 },
      quoted: { count: 0, value: 0 },
      won: { count: 0, value: 0 },
      lost: { count: 0, value: 0 }
    },
    geography: [],
    products: [],
    monthlyTrend: [],
    slowestQuotes: []
  };
}

const prerender = false;
const GET = async ({ cookies }) => {
  try {
    const admin = getAdminFromCookies(cookies);
    if (!admin) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );
    const analytics = await getQuoteAnalytics(supabase);
    const { data: contacts } = await supabase.from("contact_submissions").select("*").order("created_at", { ascending: false }).limit(50);
    const { data: sessions } = await supabase.from("chat_sessions").select("*").order("created_at", { ascending: false }).limit(50);
    return new Response(
      JSON.stringify({
        analytics,
        contacts: contacts || [],
        sessions: sessions || []
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "private, max-age=60"
        }
      }
    );
  } catch (error) {
    console.error("❌ Analytics API error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Failed to fetch analytics" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
