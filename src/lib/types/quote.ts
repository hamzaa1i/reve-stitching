// src/lib/types/quote.ts

// ─── Database Row ───

export type QuoteStatus = 'new' | 'reviewed' | 'quoted' | 'converted' | 'rejected';

export interface QuoteRequest {
  id: string;
  reference_number: string;
  created_at: string;
  updated_at: string;
  status: QuoteStatus;

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

  company_name: string;
  contact_person: string;
  email: string;
  phone: string | null;
  notes: string | null;

  tech_pack_url: string | null;
  reference_images: string[];

  ai_summary: string | null;
  estimated_price_range: string | null;
  suggested_moq: number | null;
  ai_flags: string | null;

  admin_notes: string | null;
  assigned_to: string | null;
}

// ─── Insert (omit auto-generated fields) ───

export type QuoteInsert = Omit<QuoteRequest, 'id' | 'created_at' | 'updated_at'>;

// ─── API Response ───

export interface QuoteSubmitResponse {
  success: boolean;
  referenceNumber?: string;
  error?: string;
  errors?: Record<string, string>;
}

// ─── AI Summary Result ───

export interface AISummaryResult {
  ai_summary: string;
  estimated_price_range: string;
  suggested_moq: number | null;
  ai_flags: string | null;
}

// ─── Quote Stats ───

export interface QuoteStats {
  total: number;
  new_count: number;
  reviewed_count: number;
  quoted_count: number;
  converted_count: number;
  rejected_count: number;
  last_7_days: number;
  last_30_days: number;
}

// ─── Product Lookup ───

export const PRODUCT_NAMES: Record<string, string> = {
  't-shirts':    'Premium Cotton T-Shirts',
  'polo-shirts': 'Corporate Polo Shirts',
  'hoodies':     'Premium Hoodies',
  'joggers':     'Athletic Joggers',
  'sweatshirts': 'Sweatshirts Collection',
  'ladies-wear': "Ladies' Wear",
  'kids-wear':   "Kids' Wear Range",
  'custom':      'Custom / Other',
};

export const FABRIC_NAMES: Record<string, string> = {
  'single-jersey': 'Single Jersey',
  'double-jersey': 'Double Jersey',
  'terry-fleece':  'Terry Fleece',
  'lycra-rib':     'Lycra Rib',
  'interlock':     'Interlock',
  'custom-fabric': 'Custom Fabric',
};

export const CUSTOMIZATION_NAMES: Record<string, string> = {
  'screen-printing':  'Screen Printing',
  'dtg-printing':     'DTG Printing',
  'embroidery':       'Embroidery',
  'heat-transfer':    'Heat Transfer',
  'sublimation':      'Sublimation',
  'custom-labels':    'Custom Labels',
  'custom-hang-tags': 'Custom Hang Tags',
  'custom-packaging': 'Custom Packaging',
};

export const DESTINATION_NAMES: Record<string, string> = {
  'uk':    'United Kingdom',
  'eu':    'European Union',
  'us':    'United States',
  'other': 'Other',
};

export const STATUS_META: Record<QuoteStatus, { label: string; color: string; bg: string }> = {
  new:       { label: 'New',       color: 'text-blue-800',   bg: 'bg-blue-100' },
  reviewed:  { label: 'Reviewed',  color: 'text-yellow-800', bg: 'bg-yellow-100' },
  quoted:    { label: 'Quoted',    color: 'text-green-800',  bg: 'bg-green-100' },
  converted: { label: 'Converted', color: 'text-purple-800', bg: 'bg-purple-100' },
  rejected:  { label: 'Rejected',  color: 'text-red-800',    bg: 'bg-red-100' },
};