import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Metadata } from 'next';
import { api } from '@/lib/axios';
import { buildProductMetadata } from '@/lib/seo/metadata';
import { getCanonicalUrl } from '@/lib/seo/canonical';
import { generateBreadcrumbSchema } from '@/lib/seo/breadcrumb-schema';
import { generateProductJsonLd } from '@/lib/seo/product-schema';
import ProductActions from '@/components/product/ProductActions';

interface PageProps {
  params: Promise<{ slug: string }>;
}

// ── 1. SERVER-SIDE METADATA ACCELERATION ENGINE ──
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const res = await api.get(`/products/${slug}`);
    const product = res.data.data.product;
    
    return buildProductMetadata({
      title: `${product.title} | Homedecor`,
      description: product.shortDescription || product.fullDescription,
      slug: product.slug,
      imageUrl: product.thumbnail,
      keywords: product.tags || [],
    });
  } catch (error) {
    const cleanTitle = slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    return {
      title: `${cleanTitle} | Premium Collection | Homedecor`,
      description: 'Explore curated modern furniture objects from our handcrafted Homedecor portfolio.',
    };
  }
}

// ── 2. IMMERSIVE PRODUCT PRESENTATION RENDERING LAYER (SERVER COMPONENT) ──
export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  let productData;

  try {
    const res = await api.get(`/products/${slug}`);
    productData = res.data.data;
  } catch (error) {
    notFound();
  }

  const { product } = productData;
  const canonicalUrl = getCanonicalUrl(product.slug);

  const breadcrumbSchema = generateBreadcrumbSchema(product.title, product.category.name, product.category.slug, canonicalUrl);
  const productSchema = generateProductJsonLd({
    title: product.title,
    description: product.fullDescription,
    sku: product.variants?.[0]?.sku || product._id,
    price: product.discountedPricePKR || product.basePricePKR,
    imageUrl: product.thumbnail,
    canonicalUrl,
    inStock: product.totalStock > 0,
  });

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />

      <main className="max-w-7xl mx-auto px-6 sm:px-8 py-20 pt-36 grid grid-cols-1 md:grid-cols-12 gap-12 bg-luxury-white">
        {/* Media Canvas */}
        <div className="md:col-span-7">
          <div className="relative aspect-[4/5] bg-neutral-50 overflow-hidden border border-sand/10 group">
            <Image 
              src={product.thumbnail} 
              alt={product.title} 
              fill 
              priority 
              sizes="(max-width: 768px) 100vw, 60vw" 
              className="object-cover object-center transition-transform duration-[1200ms] ease-out group-hover:scale-102"
              quality={90}
            />
          </div>
        </div>

        {/* Content Configuration Matrix */}
        <div className="md:col-span-5 flex flex-col justify-center space-y-6">
          <div className="space-y-2">
            <span className="text-[10px] uppercase tracking-[0.25em] text-walnut-brown font-medium block">
              {product.category.name}
            </span>
            <h1 className="text-3xl font-serif text-charcoal tracking-wide leading-tight">
              {product.title}
            </h1>
          </div>

          <div className="flex items-baseline gap-3">
            {product.discountedPricePKR ? (
              <>
                <span className="text-xl font-sans font-medium text-walnut-brown">
                  Rs. {product.discountedPricePKR.toLocaleString()}
                </span>
                <span className="text-sm text-charcoal/30 line-through">
                  Rs. {product.basePricePKR.toLocaleString()}
                </span>
              </>
            ) : (
              <span className="text-xl font-sans font-medium text-charcoal">
                Rs. {product.basePricePKR.toLocaleString()}
              </span>
            )}
          </div>

          <div className="border-t border-b border-sand/20 py-6">
            <p className="text-xs text-charcoal/70 leading-relaxed font-sans font-light">
              {product.fullDescription}
            </p>
          </div>

          {/* This component internally uses 'use client' to seamlessly handle cart button clicks */}
          <ProductActions product={product} />
        </div>
      </main>
    </>
  );
}