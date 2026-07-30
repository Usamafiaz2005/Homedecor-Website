'use client';
import { useRef } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, ShoppingBag } from 'lucide-react';

const bestSellers = [
  {
    id: 'bs-1',
    title: 'Travertine Minimalist Coffee Table',
    category: 'Furniture',
    price: 'Rs. 85,000',
    image: 'https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&q=80&w=800',
    slug: 'travertine-coffee-table',
  },
  {
    id: 'bs-2',
    title: 'Bouclé Editorial Lounge Armchair',
    category: 'Seating',
    price: 'Rs. 62,000',
    image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&q=80&w=800',
    slug: 'boucle-lounge-chair',
  },
  {
    id: 'bs-3',
    title: 'Fluted Walnut Credenza Sideboard',
    category: 'Storage',
    price: 'Rs. 145,000',
    image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&q=80&w=800',
    slug: 'walnut-credenza',
  },
  {
    id: 'bs-4',
    title: 'Alabaster Spherical Pendant Light',
    category: 'Lighting',
    price: 'Rs. 28,000',
    image: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&q=80&w=800',
    slug: 'alabaster-pendant-light',
  }
];

export default function BestSellers() {
  const sliderRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (sliderRef.current) {
      const { scrollLeft, clientWidth } = sliderRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth / 2 : scrollLeft + clientWidth / 2;
      sliderRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <section className="bg-luxury-white py-24 px-6 border-t border-sand/10">
      <div className="max-w-7xl mx-auto">
        {/* Header Controller Bar */}
        <div className="flex items-end justify-between mb-12">
          <div className="space-y-2">
            <span className="text-[10px] uppercase tracking-[0.3em] text-walnut-brown font-medium block">
              High Demand Artifacts
            </span>
            <h2 className="text-2xl lg:text-3xl font-serif text-charcoal tracking-wide">
              The Best Sellers
            </h2>
          </div>
          
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => scroll('left')}
              className="w-10 h-10 border border-sand/40 flex items-center justify-center text-charcoal hover:border-walnut-brown transition-colors duration-300"
              aria-label="Previous items"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="w-10 h-10 border border-sand/40 flex items-center justify-center text-charcoal hover:border-walnut-brown transition-colors duration-300"
              aria-label="Next items"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Carousel Window */}
        <div
          ref={sliderRef}
          className="flex gap-6 overflow-x-auto scrollbar-none snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none' }}
        >
          {bestSellers.map((item) => (
            <div
              key={item.id}
              className="min-w-[280px] sm:min-w-[340px] md:min-w-[380px] flex-1 snap-start group"
            >
              <div className="relative aspect-[3/4] bg-neutral-50 overflow-hidden mb-4">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-103"
                  quality={85}
                />
                
                {/* Minimalist Hover Add Shortcut Card */}
                <div className="absolute inset-x-0 bottom-0 p-4 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-10">
                  <Link
                    href={`/shop/${item.slug}`}
                    className="w-full bg-luxury-white/90 backdrop-blur-md text-charcoal py-3 text-[10px] uppercase tracking-[0.2em] font-medium hover:bg-charcoal hover:text-luxury-white transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" /> Acquire Piece
                  </Link>
                </div>
              </div>

              {/* Text Matrix Block */}
              <div className="space-y-1 text-center md:text-left">
                <span className="text-[9px] uppercase tracking-[0.25em] text-charcoal/40 font-sans block">
                  {item.category}
                </span>
                <Link href={`/shop/${item.slug}`} className="block">
                  <h3 className="text-sm font-serif text-charcoal hover:text-walnut-brown transition-colors duration-300 line-clamp-1">
                    {item.title}
                  </h3>
                </Link>
                <p className="text-xs font-sans font-medium text-walnut-brown">
                  {item.price}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}