import { categories, commercialPolicy } from '../lib/catalogue/policy';
import { catalogueMedia } from './catalogue-media';
export const products = categories.map(category => {
  const samples = catalogueMedia.filter(sample => sample.categorySlug === category.slug);
  return { ...category, samples, representative: samples[0], commercialPolicy };
});
export const fabrics = [
  { name: 'Fabric selection', desc: 'Discuss composition, weight, handle and colour against your reference or tech pack.' },
  { name: 'Graphics & branding', desc: 'Review artwork, placement, labels and finishing for the garment you want to develop.' },
  { name: 'Fit & construction', desc: 'Confirm measurements, shape, seams and trims through sample review.' },
];
