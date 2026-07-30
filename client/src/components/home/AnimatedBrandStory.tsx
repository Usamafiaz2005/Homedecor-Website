'use client';
import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FadeIn } from '../animations/FadeIn';
import Image from 'next/image';
import Link from 'next/link';

const stats = [
  { value: '2009', label: 'Est. in Lahore' },
  { value: '850+', label: 'Unique pieces' },
  { value: '12K+', label: 'Homes transformed' },
  { value: '100%', label: 'Handcrafted' },
];

const values = [
  {
    title: 'Mughal Heritage',
    body: "Every design draws from Pakistan's rich artistic legacy — geometric inlays, carved jali patterns, and the warmth of walnut.",
  },
  {
    title: 'Master Craftsmen',
    body: "Our workshops in Lahore's old city employ third-generation artisans who have perfected their craft over decades.",
  },
  {
    title: 'Built to Outlast',
    body: 'Solid sheesham and teak, not veneers. Dovetail joints, not glue. Furniture that becomes an heirloom.',
  },
];

export default function AnimatedBrandStory() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });
  const imageY = useTransform(scrollYProgress, [0, 1], [-40, 40]);

  return (
    <section ref={sectionRef} className="bg-luxury-white overflow-hidden">
      <div className="border-y border-sand/30 py-10 bg-[#F5F5F3]">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <FadeIn key={stat.value} delay={i * 0.1}>
              <div className="text-center">
                <p className="text-3xl md:text-4xl font-serif text-walnut-brown mb-1">{stat.value}</p>
                <p className="text-xs text-charcoal/50 uppercase tracking-widest font-sans">{stat.label}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-24 md:py-32 grid md:grid-cols-2 gap-16 items-center">
        <div>
          <FadeIn direction="left">
            <p className="text-xs text-walnut-brown/60 uppercase tracking-[0.3em] font-sans mb-4">Our story</p>
            <h2 className="text-4xl md:text-5xl font-serif text-charcoal leading-tight mb-8">
              Where Heritage<br />Meets Home.
            </h2>
          </FadeIn>
          <FadeIn direction="left" delay={0.15}>
            <p className="text-charcoal/70 font-sans leading-relaxed mb-6">
              Homedecor — meaning <em className="text-walnut-brown not-italic">"tradition"</em> in Urdu — was born from a simple belief: that Pakistani craftsmanship deserves to be celebrated, not hidden. What began as a small workshop in Lahore's Anarkali bazaar is now a destination for those who understand that true luxury is built by hand.
            </p>
            <p className="text-charcoal/70 font-sans leading-relaxed mb-10">
              Each piece in our collection is designed in-house and executed by master craftsmen who have inherited their skills across generations. The result is furniture that carries memory — of the maker, the wood, and the culture.
            </p>
          </FadeIn>
          <FadeIn direction="left" delay={0.25}>
            <Link href="/lookbook" className="inline-flex items-center gap-2 text-walnut-brown font-sans text-sm uppercase tracking-widest hover:gap-4 transition-all duration-300">
              View our lookbook <span>→</span>
            </Link>
          </FadeIn>
        </div>

        <FadeIn direction="right">
          <div className="relative aspect-[4/5] overflow-hidden">
            <motion.div className="absolute inset-0 scale-110" style={{ y: imageY }}>
              <Image
                src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=800"
                alt="Craftsman working in Lahore workshop"
                fill
                className="object-cover"
              />
            </motion.div>
            <div className="absolute -bottom-4 -left-4 w-2/3 h-2/3 border border-sand/40 -z-10" />
          </div>
        </FadeIn>
      </div>

      <div className="border-t border-sand/30 bg-[#F5F5F3]">
        <div className="max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-3 gap-px bg-sand/30">
          {values.map((v, i) => (
            <FadeIn key={v.title} delay={i * 0.12}>
              <div className="bg-[#F5F5F3] p-10">
                <div className="w-8 h-px bg-walnut-brown/40 mb-6" />
                <h3 className="text-lg font-serif text-charcoal mb-3">{v.title}</h3>
                <p className="text-sm text-charcoal/60 font-sans leading-relaxed">{v.body}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>

      <FadeIn>
        <div className="relative overflow-hidden bg-charcoal py-20 px-6 text-center">
          <div
            className="absolute inset-0 opacity-10 bg-cover bg-center"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1600')" }}
          />
          <div className="relative z-10">
            <p className="text-sand/60 text-xs uppercase tracking-[0.3em] font-sans mb-4">New collection available</p>
            <h2 className="text-3xl md:text-5xl font-serif text-luxury-white mb-8">The Mughal Edit — 2025</h2>
            <Link
              href="/shop?filter=new"
              className="inline-block px-10 py-4 border border-luxury-white/40 text-luxury-white text-xs uppercase tracking-widest font-sans hover:bg-luxury-white hover:text-charcoal transition-all duration-300"
            >
              View Collection
            </Link>
          </div>
        </div>
      </FadeIn>
    </section>
  );
}