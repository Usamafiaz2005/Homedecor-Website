'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';

const timelineMilestones = [
  { year: '2018', title: 'Studio Inception', desc: 'Established our primary design space in Lahore, collaborating directly with local carving masters.' },
  { year: '2021', title: 'The Material Shift', desc: 'Transitioned exclusively to premium kiln-dried walnut, teak, and eco-certified organic linens.' },
  { year: '2026', title: 'Homedecor Evolution', desc: 'Upgraded our spatial vision to launch minimalist, cross-disciplinary global collections.' }
];

export default function AboutPage() {
  return (
    <main className="bg-luxury-white min-h-screen pt-32 pb-24">
      {/* Narrative Section Header */}
      <section className="max-w-3xl mx-auto px-6 mb-20 text-center space-y-4">
        <span className="text-[10px] uppercase tracking-[0.3em] text-walnut-brown font-medium block">Our Manifesto</span>
        <h1 className="text-3xl md:text-4xl font-serif text-charcoal tracking-wide">Honest Materials. Architectural Longevity.</h1>
        <p className="text-xs text-charcoal/60 leading-relaxed font-light pt-4">
          Homedecor was built to restore quiet luxury and genuine structural integrity to the contemporary Pakistani home ecosystem.
        </p>
      </section>

      {/* Asymmetric Split Imagery/Story Row */}
      <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32">
        <div className="relative aspect-[4/5] bg-neutral-100 overflow-hidden">
          <Image src="https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&q=80&w=1000" alt="Artisan detailing" fill className="object-cover" />
        </div>
        <div className="space-y-6 font-light text-sm text-charcoal/70 leading-relaxed">
          <h2 className="text-xl lg:text-2xl font-serif text-charcoal tracking-wide mb-4">The Precision of the Joinery</h2>
          <p>Every element in our collection is shaped from premium solid hardwoods. We reject the short lifespan of modern compressed board alternatives.</p>
          <p>By blending clean architectural layouts with centuries-old interlocking joinery, we ensure each piece anchors its intended environment across multiple generations.</p>
        </div>
      </section>

      {/* Modern Horizontal Brand History Timeline Display Grid */}
      <section className="bg-neutral-50 border-y border-sand/20 py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-xs uppercase tracking-[0.3em] text-walnut-brown font-medium text-center mb-16">Chronological Progress</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {timelineMilestones.map((milestone, idx) => (
              <div key={idx} className="space-y-3 relative border-l border-sand/40 pl-6 md:border-l-0 md:border-t md:pt-6 md:pl-0">
                <span className="font-serif text-2xl text-walnut-brown font-medium">{milestone.year}</span>
                <h3 className="text-sm font-serif text-charcoal tracking-wide">{milestone.title}</h3>
                <p className="text-xs text-charcoal/50 leading-relaxed font-light">{milestone.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}