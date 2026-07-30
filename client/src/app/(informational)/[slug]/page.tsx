'use client';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Truck, ShieldAlert, FileText } from 'lucide-react';

// Unified Copy Deck Mapping matching West Elm & Interwood brand protocols
const contentDeck: Record<string, { title: string; eyebrow: string; body: React.ReactNode }> = {
  about: {
    eyebrow: 'Our Heritage Story',
    title: 'Honest Materials, Silent Sanctuaries.',
    body: (
      <div className="space-y-6 text-sm text-charcoal/70 leading-relaxed font-light">
        <p>Founded in Lahore, Homedecor was built on a singular manifesto: to craft architectural furniture systems that balance modern spatial mechanics with the unparalleled heritage of Pakistani master woodcarvers.</p>
        <p>We completely reject the transient nature of modern fast furniture. Our studios partner directly with native artisans across Punjab, sourcing sustainably harvested kiln-dried premium Walnut, Teak, and White Oak elements.</p>
      </div>
    ),
  },
  contact: {
    eyebrow: 'Studio Inquiries',
    title: 'Establish Connection.',
    body: (
      <div className="space-y-8">
        <p className="text-sm text-charcoal/70 font-light">Whether arranging a private studio viewing in Allama Iqbal Town or inquiring about custom commercial design scale orders, our customer experience concierge team is standing by.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 font-sans text-xs uppercase tracking-wider text-charcoal/80">
          <div className="flex items-center gap-3 border border-sand/30 p-4"><Mail className="w-4 h-4 text-walnut-brown" /> concierge@homedecor.com</div>
          <div className="flex items-center gap-3 border border-sand/30 p-4"><Phone className="w-4 h-4 text-walnut-brown" /> +92 (42) 111-HOMEDECOR</div>
          <div className="flex items-center gap-3 border border-sand/30 p-4 sm:col-span-2"><MapPin className="w-4 h-4 text-walnut-brown" /> Badar Block, Allama Iqbal Town, Lahore, Pakistan</div>
        </div>
      </div>
    ),
  },
  shipping: {
    eyebrow: 'Logistics Protocol',
    title: 'Secure National Provisioning.',
    body: (
      <div className="space-y-6 text-sm text-charcoal/70 font-light leading-relaxed">
        <p>Every Homedecor design asset is blanket-wrapped, loaded into custom structural crates, and ferried via specialized air-ride courier channels to ensure flawless arrival parameters across Pakistan.</p>
        <ul className="list-disc pl-5 space-y-2 text-xs">
          <li><strong>Lahore Metropolitan Transits:</strong> 3–5 Business Days | Complimentary white-glove setup.</li>
          <li><strong>Karachi & Islamabad Freight Lines:</strong> 7–10 Business Days | Comprehensive premium structural insurance included.</li>
        </ul>
      </div>
    ),
  },
  returns: {
    eyebrow: 'Exchange Mandates',
    title: 'The Preservation Commitment.',
    body: (
      <div className="space-y-6 text-sm text-charcoal/70 font-light leading-relaxed">
        <p>If an architectural element does not properly anchor your intended interior spatial layouts, Homedecor provides a protective 14-day archival exchange window.</p>
        <p>Objects must return in perfect, unaltered original conditions. Custom configuration wood commissions or stone fabrications are excluded from typical returns procedures.</p>
      </div>
    ),
  },
  craftsmanship: {
    eyebrow: 'Artisanal Integrity',
    title: 'The Art of the Joinery.',
    body: (
      <div className="space-y-6 text-sm text-charcoal/70 font-light leading-relaxed">
        <p>True luxury lies beneath the veneer. Our artisans implement traditional precision mortise-and-tenon joints, completely omitting unstable industrial adhesives and artificial composite panels.</p>
      </div>
    ),
  },
};

export default function InformationalPage() {
  const { slug } = useParams() as { slug: string };
  const pageData = contentDeck[slug] || {
    eyebrow: 'Document Hub',
    title: 'Institutional Protocol',
    body: <p className="text-sm text-charcoal/50 italic font-light">Documentation asset processing under standard regulatory reviews.</p>,
  };

  return (
    <main className="bg-luxury-white min-h-screen pt-36 pb-24 px-6">
      <div className="max-w-3xl mx-auto">
        {/* Dynamic Section Label Column heading */}
        <div className="space-y-3 mb-12 border-b border-sand/20 pb-8">
          <span className="text-[10px] uppercase tracking-[0.3em] text-walnut-brown font-medium block">
            {pageData.eyebrow}
          </span>
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl font-serif text-charcoal tracking-wide"
          >
            {pageData.title}
          </motion.h1>
        </div>

        {/* Render Formatted Document Text Blocks */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {pageData.body}
        </motion.div>

        {/* Return Call to Action Link */}
        <div className="mt-16 pt-8 border-t border-sand/20">
          <a href="/shop" className="text-[10px] uppercase tracking-widest text-charcoal/60 hover:text-walnut-brown font-medium transition-colors duration-300">
            ← Return to Collections Gallery
          </a>
        </div>
      </div>
    </main>
  );
}