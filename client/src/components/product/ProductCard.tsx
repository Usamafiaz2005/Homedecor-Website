'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types';
import { useCartStore } from '@/store/useCartStore';

interface ProductCardProps {
  product: Product;
  index: number;
}

export default function ProductCard({ product, index }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault(); // Stop Link navigation from triggering
    if (product.variants && product.variants.length > 0) {
      addItem(product, product.variants[0], 1);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: index * 0.05, ease: [0.215, 0.61, 0.355, 1] }}
      className="group relative flex flex-col bg-luxury-white"
    >
      {/* Image Container with editorial aspect ratio */}
      <Link 
        href={`/shop/${product.slug}`} 
        className="relative aspect-[3/4] overflow-hidden bg-neutral-100 block group"
      >
        {/* Luxury Minimalist Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
          {product.isNewArrival && (
            <span className="bg-luxury-white text-charcoal text-[9px] uppercase tracking-[0.2em] px-2.5 py-1 font-medium shadow-sm">
              New
            </span>
          )}
          {product.discountedPricePKR && (
            <span className="bg-walnut-brown text-luxury-white text-[9px] uppercase tracking-[0.2em] px-2.5 py-1 font-medium">
              Sale
            </span>
          )}
        </div>

        {/* Product Thumbnail with Smooth Zoom Animation */}
        <Image
          src={product.thumbnail || 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=600'}
          alt={product.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
          priority={index <= 3} 
          quality={85}
          className="object-cover object-center transition-transform duration-[1200ms] ease-out group-hover:scale-105"
        />

        {/* Premium Sliding Quick Add Drawer Overlay */}
        <div className="absolute inset-x-0 bottom-0 p-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-[0.215,0.61,0.355,1] z-20">
          <button 
            onClick={handleQuickAdd}
            disabled={product.totalStock === 0}
            className="w-full bg-charcoal/90 backdrop-blur-md text-luxury-white py-3.5 text-[10px] uppercase tracking-[0.2em] font-medium hover:bg-walnut-brown transition-colors duration-300 disabled:bg-neutral-300 disabled:text-neutral-500"
          >
            {product.totalStock === 0 ? 'Out of Stock' : 'Quick View + Add'}
          </button>
        </div>
      </Link>

      {/* Meta Content Details Panel */}
      <div className="pt-4 pb-3 flex flex-col items-center text-center">
        <p className="text-[10px] text-charcoal/40 uppercase tracking-[0.25em] mb-1.5 font-sans">
          {product.category?.name || 'Collection'}
        </p>
        
        <Link href={`/shop/${product.slug}`} className="max-w-full">
          <h3 className="text-sm font-serif text-charcoal mb-2 line-clamp-1 hover:text-walnut-brown transition-colors duration-300 tracking-wide px-2">
            {product.title}
          </h3>
        </Link>
        
        <div className="flex items-center gap-2.5 font-sans text-xs">
          {product.discountedPricePKR ? (
            <>
              <span className="text-walnut-brown font-medium">
                Rs. {product.discountedPricePKR.toLocaleString()}
              </span>
              <span className="text-charcoal/30 line-through text-[11px]">
                Rs. {product.basePricePKR.toLocaleString()}
              </span>
            </>
          ) : (
            <span className="text-charcoal/80 font-medium">
              Rs. {product.basePricePKR.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}