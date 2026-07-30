'use client';
import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

const slides = [
  {
    // High-end minimalist living room
    image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=2000',
    tagline: 'Curated Elegance.',
    sub: 'Handcrafted luxury furniture, defining the modern aesthetic.',
  },
  {
    // Warm, luxury bedroom
    image: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&q=80&w=2000',
    tagline: 'Timeless Craft.',
    sub: 'Every piece tells a story — woven from the finest architectural materials.',
  },
  {
    // Elegant dining/decor space
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=2000',
    tagline: 'Your Sanctuary.',
    sub: 'Spaces that breathe with understated beauty, built to last generations.',
  },
];

export default function PremiumHero() {
  const [current, setCurrent] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 600], [0, 180]); 

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % slides.length);
    }, 6000); // Slightly slower for a more relaxed, luxurious feel
    return () => clearInterval(timer);
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative h-screen w-full overflow-hidden bg-charcoal"
      aria-label="Hero banner"
    >
      {slides.map((slide, i) => (
        <motion.div
          key={i}
          className="absolute inset-0"
          initial={false}
          animate={{ opacity: i === current ? 1 : 0 }}
          transition={{ duration: 1.5, ease: 'easeInOut' }}
        >
          <motion.div
            className="absolute inset-0"
            style={{ y: i === current ? y : 0, scale: 1.05 }}
            animate={{ scale: i === current ? 1 : 1.05 }}
            transition={{ duration: 8, ease: "easeOut" }} // Subtle Ken Burns zoom effect
          >
            <Image 
              src={slide.image}
              alt={slide.tagline}
              fill
              priority={i === 0} 
              sizes="100vw"
              className="object-cover"
              quality={90} 
            />
          </motion.div>
          {/* Smoother, darker luxury gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/95 via-charcoal/40 to-black/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-charcoal/60 to-transparent" />
        </motion.div>
      ))}

      <div className="relative z-10 h-full flex flex-col justify-end pb-24 px-6 md:px-16 max-w-7xl mx-auto">
        <motion.div
          key={current}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.21, 0.47, 0.32, 0.98], delay: 0.4 }}
        >
          <p className="text-sand/90 text-[10px] uppercase tracking-[0.4em] mb-5 font-sans font-medium">
            The Homedecor Collection
          </p>

          <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] text-luxury-white font-serif leading-[1.1] mb-6 tracking-tight">
            {slides[current].tagline}
          </h1>

          <p className="text-sand/80 font-sans text-sm md:text-base max-w-md mb-12 leading-relaxed font-light">
            {slides[current].sub}
          </p>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-8">
            <Link
              href="/shop"
              className="px-10 py-4 bg-luxury-white text-charcoal font-medium uppercase tracking-[0.2em] text-[10px] hover:bg-sand hover:text-walnut-brown transition-all duration-300"
            >
              Explore Collection
            </Link>
            <Link
              href="/shop?filter=new"
              className="text-luxury-white/90 font-sans text-[10px] font-medium uppercase tracking-[0.2em] hover:text-luxury-white transition-colors relative group flex items-center gap-2"
            >
              New Arrivals
              <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
              <span className="absolute -bottom-2 left-0 w-0 h-[1px] bg-luxury-white transition-all duration-300 group-hover:w-full" />
            </Link>
          </div>
        </motion.div>

        <div className="absolute bottom-10 right-6 md:right-16 flex items-center gap-3">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`transition-all duration-500 rounded-full ${
                i === current
                  ? 'w-10 h-1 bg-luxury-white'
                  : 'w-2 h-1 bg-luxury-white/30 hover:bg-luxury-white/60'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}