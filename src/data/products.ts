export interface Product {
    slug: string;
    name: string;
    category: string;
    image: string;
    gallery: string[];
        moq: string;
    leadTime: string;
    fabricWeight: string;
    description: string;
    features: string[];
    fabrics: string[];
    certifications: string[];
  }
  
  export const products: Product[] = [
    {
      slug: 't-shirts',
      name: 'Premium Cotton T-Shirts',
      category: 'T-Shirts',
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&h=600&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&h=800&q=80',
        'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=1200&h=800&q=80',
        'https://images.unsplash.com/photo-1622445275463-afa2ab738c34?auto=format&fit=crop&w=1200&h=800&q=80',
      ],
      moq: 'Review',
      leadTime: 'Agreed',
      fabricWeight: 'Specify',
      description: 'T-shirts for brand development. Confirm fibre content, fit, artwork, colour and finishing through your specification and approved sample.',
      features: ['Material specification', 'Fit and construction review', 'Artwork and label options', 'Sample approval'],
      fabrics: ['Single Jersey', 'Interlock'],
      certifications: ['Specification Review', 'Sample Approval', 'Buyer QC Plan'],
    },
    {
      slug: 'polo-shirts',
      name: 'Corporate Polo Shirts',
      category: 'Polo Shirts',
      image: 'https://images.unsplash.com/photo-1589310243389-96a5483213a8?auto=format&fit=crop&w=800&h=600&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1589310243389-96a5483213a8?auto=format&fit=crop&w=1200&h=800&q=80',
        'https://images.unsplash.com/photo-1625910513413-5fc421e0e2f0?auto=format&fit=crop&w=1200&h=800&q=80',
        'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=1200&h=800&q=80',
      ],
      moq: 'Review',
      leadTime: 'Agreed',
      fabricWeight: 'Specify',
      description: 'Structured pique polos built for corporate and retail brands. Moisture-wicking options, reinforced collars, and precision embroidery for a polished finish.',
      features: ['Material specification', 'Fit and construction review', 'Artwork and label options', 'Sample approval'],
      fabrics: ['Double Jersey', 'Interlock'],
      certifications: ['Specification Review', 'Sample Approval', 'Buyer QC Plan'],
    },
    {
      slug: 'hoodies',
      name: 'Premium Hoodies',
      category: 'Hoodies',
      image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=800&h=600&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=1200&h=800&q=80',
        'https://images.unsplash.com/photo-1578768079470-0a4536cc4e03?auto=format&fit=crop&w=1200&h=800&q=80',
        'https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?auto=format&fit=crop&w=1200&h=800&q=80',
      ],
      moq: 'Review',
      leadTime: 'Agreed',
      fabricWeight: 'Specify',
      description: 'Hoodies for streetwear and retail development. Fabric, weight, hardware and finish are agreed against your technical specification.',
      features: ['Material specification', 'Fit and construction review', 'Artwork and label options', 'Sample approval'],
      fabrics: ['Terry Fleece', 'Double Jersey'],
      certifications: ['Specification Review', 'Sample Approval', 'Buyer QC Plan'],
    },
    {
      slug: 'joggers',
      name: 'Athletic Joggers',
      category: 'Joggers',
      image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&h=600&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&h=800&q=80',
        'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?auto=format&fit=crop&w=1200&h=800&q=80',
        'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&w=1200&h=800&q=80',
      ],
      moq: 'Review',
      leadTime: 'Agreed',
      fabricWeight: 'Specify',
      description: 'Performance joggers engineered for athletic and athleisure brands. Moisture-wicking, four-way stretch, and precision-tailored for comfort and style.',
      features: ['Material specification', 'Fit and construction review', 'Artwork and label options', 'Sample approval'],
      fabrics: ['Moisture Management', 'Lycra Rib'],
      certifications: ['Specification Review', 'Sample Approval', 'Buyer QC Plan'],
    },
    {
      slug: 'sweatshirts',
      name: 'Sweatshirts Collection',
      category: 'Sweatshirts',
      image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&h=600&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=1200&h=800&q=80',
        'https://images.unsplash.com/photo-1614975059251-992f11792571?auto=format&fit=crop&w=1200&h=800&q=80',
        'https://images.unsplash.com/photo-1611312449408-fcece27cdbb7?auto=format&fit=crop&w=1200&h=800&q=80',
      ],
      moq: 'Review',
      leadTime: 'Agreed',
      fabricWeight: 'Specify',
      description: 'Crew-neck and half-zip sweatshirts in French terry, fleece, and double jersey. Versatile silhouettes with custom dye and finish options.',
      features: ['Material specification', 'Fit and construction review', 'Artwork and label options', 'Sample approval'],
      fabrics: ['Terry Fleece', 'Double Jersey', 'Single Jersey'],
      certifications: ['Specification Review', 'Sample Approval', 'Buyer QC Plan'],
    },
    {
      slug: 'ladies-wear',
      name: "Ladies' Wear Collection",
      category: "Ladies' Wear",
      image: 'https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?auto=format&fit=crop&w=800&h=600&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?auto=format&fit=crop&w=1200&h=800&q=80',
        'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&w=1200&h=800&q=80',
        'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1200&h=800&q=80',
      ],
      moq: 'Review',
      leadTime: 'Agreed',
      fabricWeight: 'Specify',
      description: "Trend-forward ladies' knits — from modal-blend tops to lycra-rib fitted pieces. Delicate finishing and contemporary silhouettes for fashion retailers.",
      features: ['Material specification', 'Fit and construction review', 'Artwork and label options', 'Sample approval'],
      fabrics: ['Single Jersey', 'Lycra Rib', 'Interlock'],
      certifications: ['Specification Review', 'Sample Approval', 'Buyer QC Plan'],
    },
    {
      slug: 'kids-wear',
      name: "Kids' Wear Range",
      category: "Kids' Wear",
      image: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=800&h=600&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=1200&h=800&q=80',
        'https://images.unsplash.com/photo-1519340241574-2cec6aef0c01?auto=format&fit=crop&w=1200&h=800&q=80',
        'https://images.unsplash.com/photo-1503944583220-79e89fe3666b?auto=format&fit=crop&w=1200&h=800&q=80',
      ],
      moq: 'Review',
      leadTime: 'Agreed',
      fabricWeight: 'Specify',
      description: "Kids' knitted garments developed against your material, construction and applicable safety requirements.",
      features: ['Material specification', 'Fit and construction review', 'Artwork and label options', 'Sample approval'],
      fabrics: ['Single Jersey', 'Interlock'],
      certifications: ['Specification Review', 'Sample Approval', 'Buyer QC Plan'],
    },
    {
      slug: 'specialized-fabrics',
      name: 'Specialized Fabric Garments',
      category: 'Specialized',
      image: 'https://images.unsplash.com/photo-1769867414844-d77ccb5b5543?auto=format&fit=crop&w=800&h=600&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1769867414844-d77ccb5b5543?auto=format&fit=crop&w=1200&h=800&q=80',
        'https://images.unsplash.com/photo-1558171813-4c088753af8f?auto=format&fit=crop&w=1200&h=800&q=80',
        'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&h=800&q=80',
      ],
      moq: 'Review',
      leadTime: 'Agreed',
      fabricWeight: 'Specify',
      description: 'Lurex blends, burnout prints, performance fabrics, and fully custom developments. For brands that need something nobody else has.',
      features: ['Material specification', 'Fit and construction review', 'Artwork and label options', 'Sample approval'],
      fabrics: ['Single Jersey', 'Double Jersey', 'Lycra Rib'],
      certifications: ['Specification Review', 'Sample Approval', 'Buyer QC Plan'],
    },
  ];
  
  export const fabrics = [
    { name: 'Single Jersey', desc: 'Lightweight, breathable knit perfect for t-shirts and casual wear. Smooth face, soft hand feel.', weight: '120–200 GSM' },
    { name: 'Double Jersey', desc: 'Thicker, more structured knit ideal for polos and upscale casual garments. Excellent dimensional stability.', weight: '180–300 GSM' },
    { name: 'Terry Fleece', desc: 'Soft looped interior for warmth — hoodies, sweatshirts, and loungewear. Brushed or unbrushed options.', weight: '240–400 GSM' },
    { name: 'Lycra Rib', desc: "Stretchy, form-fitting fabric for activewear, trims, and ladies' wear. Outstanding recovery and comfort.", weight: '170–280 GSM' },
    { name: 'Interlock', desc: 'Smooth double-knit structure with excellent drape and stability. Ideal for premium basics.', weight: '160–280 GSM' },
    { name: 'Moisture Management', desc: 'High-performance wicking fabric for sportswear and athletic lines. Rapid dry technology.', weight: '140–220 GSM' },
  ];