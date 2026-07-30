export interface MockProduct {
  _id: string;
  title: string;
  slug: string;
  category: string;
  basePricePKR: number;
  discountedPricePKR?: number;
  thumbnail: string;
  images: string[];
  description: string;
  totalStock: number;
  ratingsAverage: number;
  isNewArrival?: boolean;
  color: string;
}

export const MOCK_CATEGORIES = [
  { slug: 'sofas', name: 'Sofas', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=600' },
  { slug: 'chairs', name: 'Chairs', image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&q=80&w=600' },
  { slug: 'dining', name: 'Dining Tables', image: 'https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&q=80&w=600' },
  { slug: 'beds', name: 'Beds', image: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&q=80&w=600' },
  { slug: 'lighting', name: 'Lighting', image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=600' },
  { slug: 'rugs', name: 'Rugs', image: 'https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&q=80&w=600' },
  { slug: 'decor', name: 'Decor Accessories', image: 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&q=80&w=600' },
  { slug: 'storage', name: 'Storage', image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&q=80&w=600' }
];

export const MOCK_PRODUCTS: MockProduct[] = [
  {
    _id: 'p1',
    title: 'Walnut Luxe Sofa',
    slug: 'walnut-luxe-sofa',
    category: 'sofas',
    basePricePKR: 245000,
    discountedPricePKR: 215000,
    thumbnail: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800',
    images: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800'],
    description: 'An architectural structural framework solid-carved from premium cured walnut, upholstered in an organic, thick neutral linen weave.',
    totalStock: 5,
    ratingsAverage: 4.9,
    isNewArrival: true,
    color: 'walnut'
  },
  {
    _id: 'p2',
    title: 'Noor Pendant Lamp',
    slug: 'noor-pendant-lamp',
    category: 'lighting',
    basePricePKR: 34000,
    thumbnail: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=800',
    images: ['https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=800'],
    description: 'A soft alabaster spherical lamp designed to scatter light dynamically, inspired by heritage minaret architectural elements.',
    totalStock: 12,
    ratingsAverage: 4.8,
    isNewArrival: true,
    color: 'ivory'
  },
  {
    _id: 'p3',
    title: 'Artisan Oak Dining Table',
    slug: 'artisan-oak-dining-table',
    category: 'dining',
    basePricePKR: 185000,
    thumbnail: 'https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&q=80&w=800',
    images: ['https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&q=80&w=800'],
    description: 'Clean, linear silhouettes utilizing interlocking tenon micro-joinery. Comfortably hosts up to eight patrons.',
    totalStock: 3,
    ratingsAverage: 5.0,
    color: 'beige'
  },
  {
    _id: 'p4',
    title: 'Heritage Handwoven Rug',
    slug: 'heritage-handwoven-rug',
    category: 'rugs',
    basePricePKR: 95000,
    discountedPricePKR: 85000,
    thumbnail: 'https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&q=80&w=800',
    images: ['https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&q=80&w=800'],
    description: 'Hand-knotted raw premium wool patterns exhibiting asymmetrical neutral forms designed to enrich hardwood or stone gallery environments.',
    totalStock: 8,
    ratingsAverage: 4.7,
    color: 'beige'
  }
];