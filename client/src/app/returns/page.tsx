import type { Metadata } from 'next';
import { RotateCcw, AlertCircle, Sparkles, CheckCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Returns & Exchange Policy | Homedecor Pakistan',
  description: 'Guarantees and return protocols for handcrafted furniture and home decor from Homedecor.',
};

export default function ReturnsPage() {
  return (
    <main className="bg-luxury-white min-h-screen pt-32 pb-24 px-6">
      <div className="max-w-4xl mx-auto space-y-12">
        <header className="border-b border-sand/40 pb-8 space-y-3">
          <span className="text-[10px] uppercase tracking-[0.3em] text-walnut-brown font-medium block">Client Satisfaction</span>
          <h1 className="text-3xl md:text-4xl font-serif text-charcoal">Returns & Exchange Protocol</h1>
          <p className="text-xs text-charcoal/60 leading-relaxed max-w-2xl font-light">
            Each Homedecor artifact is handcrafted with organic timbers, ceramic glazes, and natural fibers. We honor the structural fidelity and client trust invested into every curated order.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white border border-sand/30 shadow-xs space-y-3">
            <RotateCcw className="w-5 h-5 text-walnut-brown" />
            <h3 className="font-serif text-base text-charcoal">7-Day Return Window</h3>
            <p className="text-xs text-charcoal/60 leading-relaxed">
              Standard stock items (rugs, lamps, decor accents) can be returned within 7 calendar days in original packaging and unblemished condition.
            </p>
          </div>

          <div className="p-6 bg-white border border-sand/30 shadow-xs space-y-3">
            <Sparkles className="w-5 h-5 text-walnut-brown" />
            <h3 className="font-serif text-base text-charcoal">Structural Timber Guarantee</h3>
            <p className="text-xs text-charcoal/60 leading-relaxed">
              Our solid walnut, oak, and sheesham furniture frames carry a 3-year structural warranty against warping, splitting, and joinery separation.
            </p>
          </div>

          <div className="p-6 bg-white border border-sand/30 shadow-xs space-y-3">
            <AlertCircle className="w-5 h-5 text-walnut-brown" />
            <h3 className="font-serif text-base text-charcoal">Custom Commissions</h3>
            <p className="text-xs text-charcoal/60 leading-relaxed">
              Custom-built pieces crafted to non-standard dimensions, bespoke upholstery fabrics, or unique stain formulas are non-refundable once production commences.
            </p>
          </div>
        </div>

        <section className="bg-neutral-50/60 p-8 border border-sand/30 space-y-4 text-xs text-charcoal/70 leading-relaxed">
          <h2 className="font-serif text-lg text-charcoal">Return Initiation Steps</h2>
          <ol className="list-decimal pl-5 space-y-2">
            <li>Photograph the product and serial plaque or delivery receipt.</li>
            <li>Email our concierge at <span className="font-medium text-walnut-brown">concierge@homedecor.pk</span> or reach out via WhatsApp at +92 (42) 111-466333.</li>
            <li>Our logistics team will coordinate reverse pickup from your Lahore, Karachi, or Islamabad residence.</li>
            <li>Upon warehouse structural audit, refunds are processed via bank transfer or JazzCash within 5 business days.</li>
          </ol>
        </section>
      </div>
    </main>
  );
}