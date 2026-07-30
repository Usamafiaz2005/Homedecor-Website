'use client';
import { motion } from 'framer-motion';
import { MessageSquare } from 'lucide-react';

export default function WhatsAppWidget() {
  // Luxury curated customer concierge prompt
  const prefilledMessage = encodeURIComponent(
    "Hello Homedecor Concierge, I am reviewing the architectural catalog and would like to inquire about space staging and bespoke production configurations."
  );
  
  const whatsappUrl = `https://wa.me/923270724767?text=${prefilledMessage}`;

  return (
    <motion.a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 2, duration: 0.5 }}
      whileHover={{ scale: 1.05 }}
      className="fixed bottom-6 right-6 z-50 bg-walnut-brown hover:bg-charcoal text-luxury-white p-4 rounded-none shadow-xl border border-white/10 flex items-center gap-3 transition-colors duration-300 group"
      aria-label="Connect with Homedecor Concierge on WhatsApp"
    >
      <MessageSquare className="w-4 h-4 transition-transform group-hover:rotate-6" />
      <span className="text-[10px] uppercase tracking-[0.25em] font-medium hidden sm:inline-block border-l border-white/20 pl-3">
        Concierge Support
      </span>
    </motion.a>
  );
}