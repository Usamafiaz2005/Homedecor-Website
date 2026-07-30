'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

const editorialRooms = [
  {
    season: 'Volume 01 / The Sanctuary',
    title: 'Silent Earth Living Spaces',
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1600',
    quote: 'True comfort relies entirely on the subtraction of visual noise.',
    products: ['walnut-luxe-sofa', 'heritage-handwoven-rug']
  },
  {
    season: 'Volume 02 / The Shadow Play',
    title: 'Illuminated Chambers',
    image: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&q=80&w=1600',
    quote: 'Crafted contours reflecting the organic paths of light across Lahore.',
    products: ['noor-pendant-lamp']
  }
];

export default function LookbookPage() {
  return (
    <main className="bg-luxury-white min-h-screen pt-20">
      {/* Editorial Banner header */}
      <section className="max-w-7xl mx-auto px-6 py-16 text-center">
        <span className="text-[10px] uppercase tracking-[0.3em] text-walnut-brown font-medium block mb-3">Aesthetic Exposition</span>
        <h1 className="text-4xl lg:text-5xl font-serif text-charcoal tracking-wide">The Homedecor Lookbook</h1>
        <p className="text-charcoal/50 text-xs font-light max-w-md mx-auto mt-4 leading-relaxed">
          Explore architectural furniture compositions framed across highly curated luxury environments.
        </p>
      </section>

      {/* Modern Spaced Editorial Rows */}
      <div className="space-y-32 pb-32">
        {editorialRooms.map((room, i) => (
          <section key={i} className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className={`lg:col-span-7 relative aspect-[16/10] bg-neutral-100 overflow-hidden ${i % 2 === 1 ? 'lg:order-last' : ''}`}>
              <Image src={room.image} alt={room.title} fill className="object-cover transition-transform duration-[2000ms] hover:scale-103" />
            </div>
            
            <div className="lg:col-span-5 space-y-6 lg:px-8">
              <span className="text-[9px] uppercase tracking-widest text-walnut-brown font-medium block">{room.season}</span>
              <h2 className="text-2xl lg:text-3xl font-serif text-charcoal tracking-wide">{room.title}</h2>
              <p className="font-serif text-sm text-charcoal/60 leading-relaxed italic">"{room.quote}"</p>
              
              <div className="pt-4">
                <Link href="/shop" className="inline-block border border-charcoal text-[10px] uppercase tracking-widest font-medium text-charcoal px-6 py-3 hover:bg-charcoal hover:text-luxury-white transition-colors duration-300">
                  Acquire Spatial Look →
                </Link>
              </div>
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}