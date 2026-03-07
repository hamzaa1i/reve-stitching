// src/lib/pricing.ts

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export type ProductKey =
  | 'tshirts'
  | 'polos'
  | 'hoodies'
  | 'joggers'
  | 'sweatshirts'
  | 'ladies'
  | 'kids';

export type FabricKey =
  | 'single_jersey'
  | 'double_jersey'
  | 'terry_fleece'
  | 'pique'
  | 'interlock'
  | 'lycra_rib';

export type CustomizationKey =
  | 'screen_print'
  | 'embroidery'
  | 'dtg'
  | 'custom_labels';

export interface PriceRange {
  min: number;
  max: number;
}

export interface PriceEstimate {
  perUnit: PriceRange;
  total: PriceRange;
  leadTime: string;
  moq: number;
  savings: number | null;       // Percentage saved vs. smallest tier
  tierLabel: string;            // "Volume Discount", "Optimal", etc.
  quantity: number;
  product: ProductKey;
}

export interface CalculatorInput {
  product: ProductKey;
  quantity: number;
  fabric?: FabricKey;
  customizations?: CustomizationKey[];
}

// ─────────────────────────────────────────────────────────────────────────────
// Data Tables
// ─────────────────────────────────────────────────────────────────────────────

/** Base prices per unit at 1000 pcs, FOB Karachi */
export const BASE_PRICES: Record<ProductKey, PriceRange> = {
  tshirts:      { min: 3.50, max: 8.00 },
  polos:        { min: 5.00, max: 12.00 },
  hoodies:      { min: 8.00, max: 18.00 },
  joggers:      { min: 6.00, max: 15.00 },
  sweatshirts:  { min: 7.00, max: 16.00 },
  ladies:       { min: 4.00, max: 14.00 },
  kids:         { min: 3.00, max: 10.00 },
};

/** Display names for products */
export const PRODUCT_LABELS: Record<ProductKey, string> = {
  tshirts:     'Premium Cotton T-Shirts',
  polos:       'Corporate Polo Shirts',
  hoodies:     'Premium Hoodies',
  joggers:     'Athletic Joggers',
  sweatshirts: 'Sweatshirts Collection',
  ladies:      "Ladies' Wear",
  kids:        "Kids' Wear",
};

/** Fabric cost multipliers relative to Single Jersey baseline */
export const FABRIC_MULTIPLIERS: Record<FabricKey, number> = {
  single_jersey: 1.0,
  double_jersey: 1.15,
  terry_fleece:  1.3,
  pique:         1.1,
  interlock:     1.15,
  lycra_rib:     1.2,
};

/** Display names for fabrics */
export const FABRIC_LABELS: Record<FabricKey, string> = {
  single_jersey: 'Single Jersey (120–200 GSM)',
  double_jersey: 'Double Jersey (180–300 GSM)',
  terry_fleece:  'Terry Fleece (240–400 GSM)',
  pique:         'Pique Cotton',
  interlock:     'Interlock',
  lycra_rib:     'Lycra Rib',
};

/** Quantity tier definitions */
interface QuantityTier {
  min: number;
  max: number;
  multiplier: number;
  label: string;
}

export const QUANTITY_TIERS: QuantityTier[] = [
  { min: 100,  max: 249,      multiplier: 1.50, label: 'Small Batch' },
  { min: 250,  max: 499,      multiplier: 1.25, label: 'Starter' },
  { min: 500,  max: 999,      multiplier: 1.10, label: 'Standard' },
  { min: 1000, max: 2499,     multiplier: 1.00, label: 'Optimal' },
  { min: 2500, max: 4999,     multiplier: 0.93, label: 'Volume Discount' },
  { min: 5000, max: Infinity, multiplier: 0.87, label: 'High Volume' },
];

/** Per-unit customization cost adders */
export const CUSTOMIZATION_COSTS: Record<CustomizationKey, PriceRange> = {
  screen_print:  { min: 0.50, max: 1.50 },
  embroidery:    { min: 1.50, max: 3.50 },
  dtg:           { min: 2.00, max: 4.00 },
  custom_labels: { min: 0.30, max: 0.80 },
};

/** Display names for customizations */
export const CUSTOMIZATION_LABELS: Record<CustomizationKey, string> = {
  screen_print:  'Screen Printing',
  embroidery:    'Embroidery',
  dtg:           'DTG Printing',
  custom_labels: 'Custom Labels',
};

// ─────────────────────────────────────────────────────────────────────────────
// Internal Helpers
// ─────────────────────────────────────────────────────────────────────────────

function getTier(quantity: number): QuantityTier {
  const tier = QUANTITY_TIERS.find(
    (t) => quantity >= t.min && quantity <= t.max
  );
  // Fallback: if somehow below MOQ, use the smallest tier
  return tier ?? QUANTITY_TIERS[0];
}

function clampQuantity(quantity: number): number {
  return Math.max(100, Math.round(quantity));
}

function roundCurrency(value: number): number {
  return Math.round(value * 100) / 100;
}

// ─────────────────────────────────────────────────────────────────────────────
// Lead Time Calculation
// ─────────────────────────────────────────────────────────────────────────────

export function calculateLeadTime(quantity: number): string {
  if (quantity < 500) return '25–30 days';
  if (quantity < 1000) return '30–35 days';
  if (quantity < 2500) return '35–40 days';
  if (quantity < 5000) return '40–45 days';
  return '45–50 days';
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Calculation
// ─────────────────────────────────────────────────────────────────────────────

export function calculatePrice(params: CalculatorInput): PriceEstimate {
  const { product, fabric, customizations = [] } = params;
  const quantity = clampQuantity(params.quantity);

  // 1. Base price range for this product
  const base = BASE_PRICES[product];
  if (!base) {
    throw new Error(`Unknown product: ${product}`);
  }

  // 2. Fabric multiplier
  const fabricMult = fabric && FABRIC_MULTIPLIERS[fabric] != null
    ? FABRIC_MULTIPLIERS[fabric]
    : 1.0;

  // 3. Quantity tier multiplier
  const tier = getTier(quantity);
  const tierMult = tier.multiplier;

  // 4. Customization add-ons (summed)
  let customMin = 0;
  let customMax = 0;
  for (const key of customizations) {
    const cost = CUSTOMIZATION_COSTS[key];
    if (cost) {
      customMin += cost.min;
      customMax += cost.max;
    }
  }

  // 5. Calculate per-unit price
  //    Formula: (base × fabric × tier) + customizations
  const perUnitMin = roundCurrency(base.min * fabricMult * tierMult + customMin);
  const perUnitMax = roundCurrency(base.max * fabricMult * tierMult + customMax);

  // 6. Total order cost
  const totalMin = roundCurrency(perUnitMin * quantity);
  const totalMax = roundCurrency(perUnitMax * quantity);

  // 7. Savings vs. smallest tier (100-249 pcs at 1.5x)
  let savings: number | null = null;
  if (tier.multiplier < 1.5) {
    savings = Math.round((1 - tier.multiplier / 1.5) * 100);
  }

  // 8. Lead time
  const leadTime = calculateLeadTime(quantity);

  // 9. MOQ for this product
  const moq = 100;

  return {
    perUnit: { min: perUnitMin, max: perUnitMax },
    total: { min: totalMin, max: totalMax },
    leadTime,
    moq,
    savings,
    tierLabel: tier.label,
    quantity,
    product,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// URL Parameter Helpers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Build a /quote URL with pre-filled parameters from calculator state.
 */
export function buildQuoteUrl(params: CalculatorInput): string {
  const url = new URL('/quote', 'https://revestitching.com');

  url.searchParams.set('product', params.product);
  url.searchParams.set('quantity', String(params.quantity));

  if (params.fabric) {
    url.searchParams.set('fabric', params.fabric);
  }

  if (params.customizations && params.customizations.length > 0) {
    url.searchParams.set('customizations', params.customizations.join(','));
  }

  // Return just the path + search (relative URL)
  return url.pathname + url.search;
}

/**
 * Parse URL search params back into CalculatorInput.
 * Used by QuoteWizard to pre-fill from calculator handoff.
 */
export function parseQuoteParams(searchParams: URLSearchParams): Partial<CalculatorInput> {
  const result: Partial<CalculatorInput> = {};

  const product = searchParams.get('product');
  if (product && product in BASE_PRICES) {
    result.product = product as ProductKey;
  }

  const quantity = searchParams.get('quantity');
  if (quantity) {
    const parsed = parseInt(quantity, 10);
    if (!isNaN(parsed) && parsed >= 100) {
      result.quantity = parsed;
    }
  }

  const fabric = searchParams.get('fabric');
  if (fabric && fabric in FABRIC_MULTIPLIERS) {
    result.fabric = fabric as FabricKey;
  }

  const customs = searchParams.get('customizations');
  if (customs) {
    const keys = customs.split(',').filter(
      (k): k is CustomizationKey => k in CUSTOMIZATION_COSTS
    );
    if (keys.length > 0) {
      result.customizations = keys;
    }
  }

  return result;
}

// ─────────────────────────────────────────────────────────────────────────────
// Formatting Helpers
// ─────────────────────────────────────────────────────────────────────────────

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatRange(range: PriceRange): string {
  return `${formatCurrency(range.min)} – ${formatCurrency(range.max)}`;
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US').format(value);
}