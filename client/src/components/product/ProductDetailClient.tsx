'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/axios';
import Image from 'next/image';
import { Product } from '@/types';
import ProductActions from './ProductActions';
import ProductCard from './ProductCard';
import { ProductDetailSkeleton } from '../ui/Skeletons';
import Link from 'next/link';

export default function ProductDetailClient({ slug }: { slug: string }) {
  const [product, setProduct] = useState<any>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${slug}`);
        setProduct(res.data.data.product);
        setRelated(res.data.data.relatedProducts || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  if (loading) return <ProductDetailSkeleton />;
  if (!product) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <p className="font-serif text-2xl text-charcoal">Product not found</p>
      <Link href="/shop" className="text-xs uppercase tracking-widest text-walnut-brown hover:underline">← Back to Shop</Link>
    </div>
  );

  const images = [product.thumbnail, ...(product.images || [])].filter(Boolean);

  return (
    <main className="pt-20 bg-luxury-white min-h-screen">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="text-[10px] uppercase tracking-widest text-charcoal/40 flex items-center gap-2">
          <Link href="/" className="hover:text-walnut-brown transition-colors">Home</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-walnut-brown transition-colors">Shop</Link>
          <span>/</span>
          <span className="text-charcoal/80">{product.title}</span>
        </div>
      </div>

      {/* Product Detail */}
      <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Images */}
        <div className="space-y-4">
          <div className="relative aspect-square bg-neutral-100 overflow-hidden">
            <Image
              src={images[activeImage] || product.thumbnail}
              alt={product.title}
              fill
              className="object-cover"
              quality={90}
              priority
            />
          </div>
          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {images.map((img: string, i: number) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`relative flex-shrink-0 w-20 h-20 border-2 transition-colors ${i === activeImage ? 'border-walnut-brown' : 'border-transparent hover:border-sand'}`}
                >
                  <Image src={img} alt="" fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="space-y-6 pt-2">
          <div>
            <p className="text-xs text-walnut-brown uppercase tracking-widest mb-2">{product.category?.name}</p>
            <h1 className="text-3xl font-serif text-charcoal mb-4">{product.title}</h1>
            <div className="flex items-center gap-4">
              {product.discountedPricePKR ? (
                <>
                  <span className="text-2xl font-sans font-medium text-walnut-brown">
                    Rs. {product.discountedPricePKR.toLocaleString()}
                  </span>
                  <span className="text-lg text-charcoal/40 line-through">
                    Rs. {product.basePricePKR.toLocaleString()}
                  </span>
                </>
              ) : (
                <span className="text-2xl font-sans font-medium text-charcoal">
                  Rs. {product.basePricePKR.toLocaleString()}
                </span>
              )}
            </div>
          </div>

          <p className="text-sm text-charcoal/70 font-sans leading-relaxed border-t border-sand/30 pt-6">
            {product.shortDescription}
          </p>

          <div className="border-t border-sand/30 pt-6">
            <ProductActions product={product} />
          </div>

          {product.fullDescription && (
            <div className="border-t border-sand/30 pt-6">
              <h3 className="text-xs uppercase tracking-widest font-semibold text-charcoal mb-3">Details</h3>
              <p className="text-sm text-charcoal/60 font-sans leading-relaxed">{product.fullDescription}</p>
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 py-16 border-t border-sand/20">
          <h2 className="text-xl font-serif text-charcoal mb-10">You May Also Like</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
          </div>
        </section>
      )}
    </main>
  );
}