'use client';
import { motion } from 'framer-motion';

const reviews = [
  {
    quote: "The structural precision of the Walnut Sideboard completely anchors my formal living environment. Exceptional wood selection and premium curation details.",
    author: "Amna Khan",
    location: "Gulberg, Lahore"
  },
  {
    quote: "Bypassing mainstream, crowded furniture stores to source clean architectural ceramics here completely remade our studio ecosystem. True quiet luxury.",
    author: "Zayn Malik",
    location: "DHA Phase 6, Karachi"
  }
];

export default function Testimonials() {
  return (
    <section className="bg-neutral-50/50 border-t border-sand/20 py-24 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-16 lg:gap-8 items-start">
        
        {/* Section Label Left Panel Column */}
        <div className="space-y-4 lg:pr-8">
          <span className="text-[10px] uppercase tracking-[0.3em] text-walnut-brown font-medium block">
            Patron Records
          </span>
          <h2 className="text-2xl lg:text-3xl font-serif text-charcoal tracking-wide leading-tight">
            Interiors Redeemed By Our Collection
          </h2>
          <p className="text-xs text-charcoal/50 font-sans leading-relaxed">
            A quiet validation of design, layout consistency, and premium longevity expressed by our discerning community.
          </p>
        </div>

        {/* Double Review Content Masonry Cards Column */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-12">
          {reviews.map((rev, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: i * 0.15 }}
              className="flex flex-col justify-between space-y-6"
            >
              <p className="font-serif text-sm lg:text-base text-charcoal/80 leading-relaxed italic">
                "{rev.quote}"
              </p>
              <div className="space-y-0.5">
                <h4 className="text-xs uppercase tracking-widest font-sans font-semibold text-charcoal">
                  {rev.author}
                </h4>
                <p className="text-[10px] text-charcoal/40 font-sans tracking-wide">
                  {rev.location}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}