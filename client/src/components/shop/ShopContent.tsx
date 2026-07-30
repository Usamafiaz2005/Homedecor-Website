'use client';
import { useSearchParams } from 'next/navigation';
import ProductGrid from '@/components/product/ProductGrid';
import { motion } from 'framer-motion';

const bannerConfigs: Record<string, { title: string; subtitle: string; bg: string }> = {
  all: {
    title: 'The Full Catalog',
    subtitle: 'Architectural forms and organic textures for modern Pakistani living.',
    bg: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=1600',
  },
  new: {
    title: 'New Arrivals',
    subtitle: 'Freshly cataloged design objects directly from our Lahore workshop.',
    bg: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=1600',
  },
  trending: {
    title: 'Best Sellers',
    subtitle: "Our community's most coveted high-end luxury focal pieces.",
    bg: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&q=80&w=1600',
  },
  'flash-sale': {
    title: 'Archive Exhibition',
    subtitle: 'Limited seasonal provisions featuring exclusive architectural value reductions.',
    bg: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&q=80&w=1600',
  },
};

export default function ShopContent() {
  const searchParams = useSearchParams();
  const filter = searchParams.get('filter') || 'all';
  const category = searchParams.get('category') || undefined;
  const currentBanner = bannerConfigs[filter] || bannerConfigs.all;

  return (
    <main className="bg-luxury-white min-h-screen pt-20">
      <div className="relative h-[40vh] w-full overflow-hidden bg-charcoal">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{ backgroundImage: `url('${currentBanner.bg}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-luxury-white via-transparent to-transparent" />
        <div className="relative z-10 h-full max-w-7xl mx-auto px-6 flex flex-col justify-center items-center text-center">
          <span className="text-[9px] uppercase tracking-[0.4em] text-sand mb-3 block">
            {category ? `Collection / ${category}` : 'Homedecor Portfolio'}
          </span>
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-3xl md:text-5xl font-serif text-luxury-white tracking-wide capitalize"
          >
            {category ? `${category} Collection` : currentBanner.title}
          </motion.h1>
          <p className="text-luxury-white/60 font-sans text-xs max-w-md mt-4 leading-relaxed">
            {currentBanner.subtitle}
          </p>
        </div>
      </div>
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-[10px] uppercase tracking-widest text-charcoal/40 mb-8 flex items-center gap-2">
          <a href="/" className="hover:text-walnut-brown transition-colors">Home</a>
          <span>/</span>
          <span className="text-charcoal/80 font-medium">Shop</span>
        </div>
        <ProductGrid category={category} filter={filter !== 'all' ? filter : undefined} />
      </section>
    </main>
  );
}