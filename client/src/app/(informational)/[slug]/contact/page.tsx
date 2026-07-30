'use client';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

export default function ContactPage() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Thank you. Our concierge will contact you within 24 hours.');
  };

  return (
    <main className="bg-luxury-white min-h-screen pt-32 pb-24 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
        
        {/* Contact Matrix details left panel column */}
        <div className="lg:col-span-5 space-y-8">
          <div className="space-y-3">
            <span className="text-[10px] uppercase tracking-[0.3em] text-walnut-brown font-medium block">Studio Connection</span>
            <h1 className="text-3xl md:text-4xl font-serif text-charcoal tracking-wide">Establish Contact</h1>
            <p className="text-xs font-light text-charcoal/50 leading-relaxed">
              Arrange private gallery viewings, discuss bespoke commercial commissions, or file trade inquiries.
            </p>
          </div>

          <div className="space-y-4 pt-4 font-sans text-xs uppercase tracking-wider text-charcoal/80">
            <div className="flex items-center gap-4 p-4 border border-sand/20 bg-neutral-50/50">
              <Mail className="w-4 h-4 text-walnut-brown" /> 
              <span>concierge@homedecor.com</span>
            </div>
            <div className="flex items-center gap-4 p-4 border border-sand/20 bg-neutral-50/50">
              <Phone className="w-4 h-4 text-walnut-brown" /> 
              <span>+92 (42) 111-466333</span>
            </div>
            <div className="flex items-center gap-4 p-4 border border-sand/20 bg-neutral-50/50">
              <MapPin className="w-4 h-4 text-walnut-brown" /> 
              <span>Badar Block, Allama Iqbal Town, Lahore</span>
            </div>
            <div className="flex items-center gap-4 p-4 border border-sand/20 bg-neutral-50/50">
              <Clock className="w-4 h-4 text-walnut-brown" /> 
              <span>Mon - Sat: 11:00 AM - 08:00 PM</span>
            </div>
          </div>
        </div>

        {/* Minimalist interactive user input form panel right column */}
        <div className="lg:col-span-7 bg-neutral-50/40 border border-sand/20 p-8 md:p-12">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-charcoal/50 font-medium block">Your Name</label>
                <input required type="text" className="w-full bg-white border border-sand/40 p-3 text-xs outline-none focus:border-walnut-brown rounded-none transition-colors" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-charcoal/50 font-medium block">Email Address</label>
                <input required type="email" className="w-full bg-white border border-sand/40 p-3 text-xs outline-none focus:border-walnut-brown rounded-none transition-colors" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-charcoal/50 font-medium block">Message Subject</label>
              <input required type="text" className="w-full bg-white border border-sand/40 p-3 text-xs outline-none focus:border-walnut-brown rounded-none transition-colors" />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-charcoal/50 font-medium block">Detailed Inquiry</label>
              <textarea required rows={5} className="w-full bg-white border border-sand/40 p-3 text-xs outline-none focus:border-walnut-brown rounded-none transition-colors resize-none" />
            </div>

            <button type="submit" className="w-full bg-charcoal text-luxury-white text-[10px] uppercase tracking-[0.2em] font-medium py-4 hover:bg-walnut-brown transition-colors duration-300 rounded-none">
              Transmit Inquiry
            </button>
          </form>
        </div>

      </div>
    </main>
  );
}