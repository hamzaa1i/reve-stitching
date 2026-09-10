import type { SupabaseClient } from '@supabase/supabase-js';

export interface QuoteAnalytics {
  // Key Metrics
  totalQuotes: number;
  quotesThisMonth: number;
  activeQuotes: number;
  pipelineValue: number;
  avgResponseTime: number; // in hours
  conversionRate: number; // percentage
  limitations: {
    financialPipelineAvailable: boolean;
    responseTimeAvailable: boolean;
    recordBreakdownsComplete: boolean;
  };

  // Funnel Data
  funnel: {
    new: { count: number; value: number };
    reviewed: { count: number; value: number };
    quoted: { count: number; value: number };
    won: { count: number; value: number };
    lost: { count: number; value: number };
  };

  // Geographic Breakdown
  geography: {
    country: string;
    count: number;
    percentage: number;
  }[];

  // Product Breakdown
  products: {
    product: string;
    count: number;
    avgQuantity: number;
  }[];

  // Monthly Trend
  monthlyTrend: {
    month: string;
    count: number;
  }[];

  // Response Times
  slowestQuotes: {
    id: string;
    reference_number: string;
    company_name: string;
    hoursWaiting: number;
  }[];
}

/**
 * Calculate comprehensive quote analytics
 */
export async function getQuoteAnalytics(
  supabase: SupabaseClient
): Promise<QuoteAnalytics> {
  // Fetch only fields needed for non-financial breakdowns. Supabase may cap the
  // returned rows; the exact total count is kept separately.
  const { data: quotes, error, count: exactTotal } = await supabase
    .from('quote_requests')
    .select('id,reference_number,company_name,status,created_at,destination,product_type,quantity', { count: 'exact' })
    .order('created_at', { ascending: false })
    .limit(1_000);

  if (error || !quotes) {
    console.error('❌ Error fetching quotes:', error);
    return getEmptyAnalytics();
  }

  const now = new Date();
  const startOfMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)).toISOString();
  const [thisMonthResult, activeResult, convertedResult] = await Promise.all([
    supabase.from('quote_requests').select('id', { count: 'exact', head: true }).gte('created_at', startOfMonth),
    supabase.from('quote_requests').select('id', { count: 'exact', head: true }).in('status', ['new', 'reviewed', 'quoted']),
    supabase.from('quote_requests').select('id', { count: 'exact', head: true }).eq('status', 'converted'),
  ]);

  console.log(`📊 Analyzing ${quotes.length} quotes...`);

  // Calculate date ranges
  const startOfMonthDate = new Date(startOfMonth);

  // Filter quotes by date
  const quotesThisMonth = quotes.filter(
    (q) => new Date(q.created_at) >= startOfMonthDate
  );

  const activeQuotes = quotes.filter((q) => ['new', 'reviewed', 'quoted'].includes(q.status));

  // Calculate conversion rate
  const wonQuotes = convertedResult.count ?? quotes.filter((q) => q.status === 'converted').length;
  const totalQuotes = exactTotal ?? quotes.length;
  const conversionRate =
    totalQuotes > 0 ? (wonQuotes / totalQuotes) * 100 : 0;

  // Funnel breakdown
  const funnel = {
    new: calculateFunnelStage(quotes, 'new'),
    reviewed: calculateFunnelStage(quotes, 'reviewed'),
    quoted: calculateFunnelStage(quotes, 'quoted'),
    won: calculateFunnelStage(quotes, 'converted'),
    lost: calculateFunnelStage(quotes, 'rejected'),
  };

  // Geographic breakdown
  const geographyMap = new Map<string, number>();
  quotes.forEach((q) => {
    const country = q.destination || 'Unknown';
    geographyMap.set(country, (geographyMap.get(country) || 0) + 1);
  });
  const geography = Array.from(geographyMap.entries())
    .map(([country, count]) => ({
      country: formatCountryName(country),
      count,
      percentage: (count / quotes.length) * 100,
    }))
    .sort((a, b) => b.count - a.count);

  // Product breakdown
  const productMap = new Map<
    string,
    { count: number; totalQuantity: number }
  >();
  quotes.forEach((q) => {
    const product = q.product_type || 'Unknown';
    const existing = productMap.get(product) || { count: 0, totalQuantity: 0 };
    productMap.set(product, {
      count: existing.count + 1,
      totalQuantity: existing.totalQuantity + (q.quantity || 0),
    });
  });
  const products = Array.from(productMap.entries())
    .map(([product, data]) => ({
      product: formatProductName(product),
      count: data.count,
      avgQuantity: data.count > 0 ? data.totalQuantity / data.count : 0,
    }))
    .sort((a, b) => b.count - a.count);

  // Monthly trend (last 6 months)
  const monthlyTrend = calculateMonthlyTrend(quotes, 6);

  // Slowest response quotes (unread, oldest first)
  const slowestQuotes = quotes
    .filter((q) => q.status === 'new')
    .map((q) => {
      const hoursWaiting =
        (now.getTime() - new Date(q.created_at).getTime()) / (1000 * 60 * 60);
      return {
        id: q.id,
        reference_number: q.reference_number,
        company_name: q.company_name,
        hoursWaiting: Math.round(hoursWaiting),
      };
    })
    .sort((a, b) => b.hoursWaiting - a.hoursWaiting)
    .slice(0, 5);

  return {
    totalQuotes,
    quotesThisMonth: thisMonthResult.count ?? quotesThisMonth.length,
    activeQuotes: activeResult.count ?? activeQuotes.length,
    pipelineValue: 0,
    avgResponseTime: 0,
    conversionRate: Math.round(conversionRate * 10) / 10,
    limitations: {
      financialPipelineAvailable: false,
      responseTimeAvailable: false,
      recordBreakdownsComplete: (exactTotal ?? quotes.length) <= quotes.length,
    },
    funnel,
    geography,
    products,
    monthlyTrend,
    slowestQuotes,
  };
}

/**
 * Calculate funnel stage stats
 */
function calculateFunnelStage(
  quotes: any[],
  status: string
): { count: number; value: number } {
  const stageQuotes = quotes.filter((q) => q.status === status);
  return { count: stageQuotes.length, value: 0 };
}

/**
 * Calculate monthly trend
 */
function calculateMonthlyTrend(
  quotes: any[],
  months: number
): { month: string; count: number }[] {
  const now = new Date();
  const trend: { month: string; count: number }[] = [];

  for (let i = months - 1; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
    const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    const count = quotes.filter((q) => {
      const created = new Date(q.created_at);
      return created >= monthStart && created <= monthEnd;
    }).length;

    trend.push({
      month: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      count,
    });
  }

  return trend;
}

/**
 * Format country name for display
 */
function formatCountryName(country: string): string {
  const map: Record<string, string> = {
    uk: 'United Kingdom',
    us: 'United States',
    eu: 'European Union',
    ca: 'Canada',
    au: 'Australia',
  };
  return map[country.toLowerCase()] || country.toUpperCase();
}

/**
 * Format product name for display
 */
function formatProductName(product: string): string {
  return product
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Get empty analytics (fallback)
 */
function getEmptyAnalytics(): QuoteAnalytics {
  return {
    totalQuotes: 0,
    quotesThisMonth: 0,
    activeQuotes: 0,
    pipelineValue: 0,
    avgResponseTime: 0,
    conversionRate: 0,
    limitations: {
      financialPipelineAvailable: false,
      responseTimeAvailable: false,
      recordBreakdownsComplete: true,
    },
    funnel: {
      new: { count: 0, value: 0 },
      reviewed: { count: 0, value: 0 },
      quoted: { count: 0, value: 0 },
      won: { count: 0, value: 0 },
      lost: { count: 0, value: 0 },
    },
    geography: [],
    products: [],
    monthlyTrend: [],
    slowestQuotes: [],
  };
}
