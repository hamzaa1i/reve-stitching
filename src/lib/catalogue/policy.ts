/** Canonical enquiry identities. Historical price/MOQ figures are not approved policy. */
export const categories = [
  { slug: 't-shirts', quoteId: 't-shirts', sampleId: 'tshirt', name: 'T-Shirts & Tops', shortName: 'T-shirts', description: 'Graphic tees, relaxed silhouettes and everyday knitted tops.', options: ['Neckline and fit', 'Print placement', 'Labels and packaging'] },
  { slug: 'polo-shirts', quoteId: 'polo-shirts', sampleId: 'polo', name: 'Polo & Rugby Tops', shortName: 'Polos & rugby', description: 'Collared styles, bold stripes and distinctive everyday layers.', options: ['Collar and placket', 'Stripe arrangement', 'Embroidery and branding'] },
  { slug: 'hoodies', quoteId: 'hoodies', sampleId: 'hoodie', name: 'Hoodies', shortName: 'Hoodies', description: 'Pullover and zip-through styles, developed around your collection.', options: ['Pullover or zip-through', 'Pocket and hood construction', 'Print and trim details'] },
  { slug: 'joggers', quoteId: 'joggers', sampleId: 'joggers', name: 'Joggers & Bottoms', shortName: 'Bottoms', description: 'Relaxed trousers, joggers and casual bottoms with considered proportions.', options: ['Leg shape and length', 'Waistband and drawcord', 'Pockets and finishing'] },
  { slug: 'sweatshirts', quoteId: 'sweatshirts', sampleId: 'sweatshirt', name: 'Sweatshirts', shortName: 'Sweatshirts', description: 'Crew-neck layers and graphic sweatshirts with character in the details.', options: ['Raglan or set-in sleeves', 'Neckline and rib trims', 'Graphic and embroidery options'] },
  { slug: 'ladies-wear', quoteId: 'ladies-wear', sampleId: 'ladies-wear', name: "Women's Knitted Garments", shortName: "Women's wear", description: 'Contemporary tops, coordinated separates and relaxed knitted layers.', options: ['Silhouette and grading', 'Coordinated separates', 'Garment and trim details'] },
  { slug: 'kids-wear', quoteId: 'kids-wear', sampleId: 'kids-wear', name: 'Kidswear', shortName: 'Kidswear', description: 'An introduction to our children’s garment samples and development enquiries.', options: ['Age and size specification', 'Artwork and placement', 'Buyer-specific testing requirements'] },
  { slug: 'specialized-fabrics', quoteId: 'custom', sampleId: 'custom', name: 'Fabric & Finish Development', shortName: 'Fabric & finishes', description: 'Discuss washed effects, pattern placement and distinctive garment finishes.', options: ['Reference-led development', 'Pattern and panel arrangement', 'Finish and swatch review'] },
] as const;
export type CategorySlug = typeof categories[number]['slug'];
export type QuoteProductId = typeof categories[number]['quoteId'];
const aliases: Record<string, CategorySlug> = {
  tshirt: 't-shirts', tshirts: 't-shirts', 't-shirt': 't-shirts',
  polo: 'polo-shirts', polos: 'polo-shirts', 'polo-shirt': 'polo-shirts',
  hoodie: 'hoodies', sweatshirt: 'sweatshirts',
  ladies: 'ladies-wear', ladieswear: 'ladies-wear', kids: 'kids-wear', kidswear: 'kids-wear',
  custom: 'specialized-fabrics', 'custom-other': 'specialized-fabrics',
};
export function resolveCategory(value: unknown) {
  if (typeof value !== 'string') return undefined;
  const key = value.trim().toLowerCase().replace(/\s+/g, '-');
  return categories.find(c => c.slug === key || c.slug === aliases[key]);
}
export const commercialPolicy = {
  status: 'pending-management-confirmation',
  minimumEnquiryQuantity: 1,
  maximumEnquiryQuantity: 10_000_000,
  moq: 'Bulk minimums depend on the garment, fabric and colour split. Share your intended quantity; trial and development enquiries are welcome. Production minimums are confirmed with your quotation.',
  leadTime: 'Sampling and production schedules are confirmed after specification, material availability and order review.',
  pricing: 'Share your specifications for a tailored quotation. Pricing is confirmed by our team.',
  compliance: 'Tell us the standards and documentation your buyer requires. Applicable site, material and product evidence is reviewed for your order.',
} as const;
export function isEnquiryQuantity(value: unknown): boolean {
  if (typeof value !== 'string' && typeof value !== 'number') return false;
  if (typeof value === 'string' && !/^\d+$/.test(value.trim())) return false;
  const n = Number(value);
  return Number.isSafeInteger(n) && n >= commercialPolicy.minimumEnquiryQuantity && n <= commercialPolicy.maximumEnquiryQuantity;
}
export function enquiryUrl(kind: 'quote' | 'samples', category: unknown, sample?: string): string {
  const c = resolveCategory(category);
  const params = new URLSearchParams();
  if (c) { params.set('product', c.slug); }
  if (sample && /^rs-a\d{3}$/.test(sample)) params.set('sample', sample);
  return `/${kind}/${params.size ? '?' + params.toString() : ''}`;
}
export function enquiryContextNote(category: unknown, sample: unknown): string {
  const c = resolveCategory(category);
  if (!c) return '';
  const ref = typeof sample === 'string' && /^rs-a\d{3}$/.test(sample) ? `; sample reference ${sample}` : '';
  return `Catalogue enquiry: ${c.name} (${c.slug})${ref}. Sample is a reference; specifications, minimums and schedule require quotation confirmation.`;
}
