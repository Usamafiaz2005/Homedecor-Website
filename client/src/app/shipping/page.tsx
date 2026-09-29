import type { Metadata } from 'next';
import { Truck, ShieldCheck, Clock, MapPin } from 'lucide-react';
import { SHIPPING_POLICY } from '@/constants/pakistan';

export const metadata: Metadata = {
  title: 'Logistics & White-Glove Delivery | Homedecor Pakistan',
  description: 'Specialized furniture delivery protocols across Lahore, Karachi, Islamabad, and all regions of Pakistan.',
};

export default function ShippingPage() {
  return (
    <main className="bg-luxury-white min-h-screen pt-32 pb-24 px-6">
      <div className="max-w-4xl mx-auto space-y-12">
        <header className="border-b border-sand/40 pb-8 space-y-3">
          <span className="text-[10px] uppercase tracking-[0.3em] text-walnut-brown font-medium block">Careful Transit</span>
          <h1 className="text-3xl md:text-4xl font-serif text-charcoal">Delivery & Logistics Policy</h1>
          <p className="text-xs text-charcoal/60 leading-relaxed max-w-2xl font-light">
            Due to the scale, artisanal nature, and weight of our kiln-dried solid hardwood furniture, Homedecor operates specialized furniture handling protocols across Pakistan.
          </p>
        </header>

        {/* Key Logistics Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="p-6 bg-white border border-sand/30 shadow-xs space-y-3">
            <Truck className="w-5 h-5 text-walnut-brown" />
            <h3 className="font-serif text-base text-charcoal">White-Glove Showroom Dispatch</h3>
            <p className="text-xs text-charcoal/60 leading-relaxed">
              For Lahore orders, dedicated showroom transport teams manage safe transit, in-room placement, and packaging removal at a flat rate of Rs. {SHIPPING_POLICY.LOCAL_LAHORE_RATE_PKR}.
            </p>
          </div>

          <div className="p-6 bg-white border border-sand/30 shadow-xs space-y-3">
            <ShieldCheck className="w-5 h-5 text-walnut-brown" />
            <h3 className="font-serif text-base text-charcoal">Crated Nationwide Freight</h3>
            <p className="text-xs text-charcoal/60 leading-relaxed">
              Major metropolitan hubs (Karachi, Islamabad, Rawalpindi, Faisalabad, Multan) receive fortified crated shipping at Rs. {SHIPPING_POLICY.MAJOR_CITIES_RATE_PKR}. Rest of Pakistan is Rs. {SHIPPING_POLICY.REST_OF_PK_RATE_PKR}.
            </p>
          </div>

          <div className="p-6 bg-white border border-sand/30 shadow-xs space-y-3">
            <Clock className="w-5 h-5 text-walnut-brown" />
            <h3 className="font-serif text-base text-charcoal">Craftsmanship & Lead Times</h3>
            <p className="text-xs text-charcoal/60 leading-relaxed">
              In-stock accent pieces dispatch within 3–5 business days. Bespoke commissioned suites require 3–4 weeks for joinery curing and hand-finishing.
            </p>
          </div>

          <div className="p-6 bg-white border border-sand/30 shadow-xs space-y-3">
            <MapPin className="w-5 h-5 text-walnut-brown" />
            <h3 className="font-serif text-base text-charcoal">Complimentary Premium Freight</h3>
            <p className="text-xs text-charcoal/60 leading-relaxed">
              All residential and corporate orders exceeding Rs. {SHIPPING_POLICY.FREE_SHIPPING_THRESHOLD_PKR.toLocaleString()} qualify for complimentary nationwide shipping.
            </p>
          </div>
        </div>

        {/* Detailed Guidelines */}
        <section className="space-y-6 text-xs text-charcoal/70 leading-relaxed bg-neutral-50/60 p-8 border border-sand/30">
          <h2 className="font-serif text-lg text-charcoal">Inspection Upon Arrival</h2>
          <p>
            Please inspect all crating and exposed timber joints upon delivery in the presence of our carrier agent. In the rare event of transit abrasions or structural damage, note the condition on the carrier manifest and notify our concierge within 24 hours at <span className="font-medium text-walnut-brown">concierge@homedecor.pk</span>.
          </p>
        </section>
      </div>
    </main>
  );
}