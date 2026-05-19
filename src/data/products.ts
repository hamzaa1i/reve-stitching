export interface Product {
    slug: string;
    name: string;
    category: string;
    image: string;
    gallery: string[];
    rating: number;
    moq: number;
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
      rating: 4.9,
      moq: 500,
      leadTime: '25–35 days',
      fabricWeight: '120–200 GSM',
      description: 'Premium combed cotton t-shirts engineered for comfort, durability, and brand distinction. Available in a full spectrum of colors, weights, and custom finishes.',
      features: ['100% Combed Cotton', 'SGS Quality Certified', 'Pre-Shrunk Fabric', 'Custom Prints & Colors'],
      fabrics: ['Single Jersey', 'Interlock'],
      certifications: ['GOTS', 'OCS', 'BCI'],
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
      rating: 4.8,
      moq: 300,
      leadTime: '30–40 days',
      fabricWeight: '180–300 GSM',
      description: 'Structured pique polos built for corporate and retail brands. Moisture-wicking options, reinforced collars, and precision embroidery for a polished finish.',
      features: ['Pique Cotton Construction', 'Moisture Management', 'Reinforced Collars', 'Custom Embroidery'],
      fabrics: ['Double Jersey', 'Interlock'],
      certifications: ['SEDEX', 'ISO 9001'],
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
      rating: 4.9,
      moq: 250,
      leadTime: '30–45 days',
      fabricWeight: '240–400 GSM',
      description: 'Heavyweight hoodies with brushed fleece interiors, YKK hardware, and premium construction. The gold standard for streetwear and retail brands worldwide.',
      features: ['Terry Fleece / Heavy Jersey', 'YKK Zippers Available', 'Brushed Interior Finish', 'Screen Print & Embroidery'],
      fabrics: ['Terry Fleece', 'Double Jersey'],
      certifications: ['GOTS', 'GRS', 'SEDEX'],
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
      rating: 4.7,
      moq: 400,
      leadTime: '30–40 days',
      fabricWeight: '140–220 GSM',
      description: 'Performance joggers engineered for athletic and athleisure brands. Moisture-wicking, four-way stretch, and precision-tailored for comfort and style.',
      features: ['Moisture Management Fabric', 'Cotton-Polyester Blend', 'Elastic Cuffs & Waistband', 'Zippered Pockets Option'],
      fabrics: ['Moisture Management', 'Lycra Rib'],
      certifications: ['OCS', 'BCI'],
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
      rating: 4.8,
      moq: 350,
      leadTime: '25–40 days',
      fabricWeight: '180–350 GSM',
      description: 'Crew-neck and half-zip sweatshirts in French terry, fleece, and double jersey. Versatile silhouettes with custom dye and finish options.',
      features: ['Double Jersey Options', 'Fleece & French Terry', 'Crew & Half-Zip Styles', 'Custom Dye Options'],
      fabrics: ['Terry Fleece', 'Double Jersey', 'Single Jersey'],
      certifications: ['GOTS', 'GRS'],
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
      rating: 4.9,
      moq: 300,
      leadTime: '30–45 days',
      fabricWeight: '120–280 GSM',
      description: "Trend-forward ladies' knits — from modal-blend tops to lycra-rib fitted pieces. Delicate finishing and contemporary silhouettes for fashion retailers.",
      features: ['Modal Blends Available', 'Lycra Rib Options', 'Delicate Finishing', 'Trend-Forward Designs'],
      fabrics: ['Single Jersey', 'Lycra Rib', 'Interlock'],
      certifications: ['GOTS', 'OCS', 'BCI'],
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
      rating: 4.8,
      moq: 500,
      leadTime: '25–35 days',
      fabricWeight: '120–200 GSM',
      description: "Skin-friendly kids' knits with certified safe dyes, reinforced stitching, and playful prints. Built to meet the strictest EU safety standards.",
      features: ['100% Skin-Friendly Cotton', 'Certified Safe Dyes', 'Reinforced Stitching', 'Fun Prints & Patterns'],
      fabrics: ['Single Jersey', 'Interlock'],
      certifications: ['GOTS', 'OCS', 'BCI', 'SEDEX'],
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
      rating: 4.7,
      moq: 200,
      leadTime: '35–50 days',
      fabricWeight: '140–350 GSM',
      description: 'Lurex blends, burnout prints, performance fabrics, and fully custom developments. For brands that need something nobody else has.',
      features: ['Lurex Mixed Fabrics', 'Burnout Printed Options', 'Performance Blends', 'Custom Development'],
      fabrics: ['Single Jersey', 'Double Jersey', 'Lycra Rib'],
      certifications: ['GRS', 'RCS', 'ISO 9001'],
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