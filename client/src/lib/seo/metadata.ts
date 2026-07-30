import { Metadata } from 'next';

export function buildProductMetadata(product: any): Metadata {
  if (!product) return { title: 'Product Not Found | Homedecor ' };
  
  return {
    title: `${product.name} | Homedecor `,
    description: product.description?.substring(0, 160) || 'Discover premium luxury home decor at Homedecor.',
    openGraph: {
      title: product.name,
      images: product.images?.[0]?.url ? [product.images[0].url] : [],
    }
  };
}