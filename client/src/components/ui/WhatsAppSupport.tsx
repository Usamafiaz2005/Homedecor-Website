// client/src/components/ui/WhatsAppSupport.tsx
'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X } from 'lucide-react';

const WA_NUMBER = '923001234567'; // Replace with actual number
const PRESET_MESSAGES = [
  'I\'d like to enquire about a product',
  'I need help with my order',
  'Custom furniture enquiry',
  'Showroom visit information',
];

export default function WhatsAppSupport() {
  const [isOpen, setIsOpen] = useState(false);

  const openChat = (message: string) => {
    const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="bg-white shadow-2xl border border-sand/20 w-72 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-[#25D366] px-4 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-white text-sm font-semibold">Homedecor Support</p>
                  <p className="text-white/70 text-xs">Typically replies instantly</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} aria-label="Close" className="text-white/70 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="p-4 bg-[#ECE5DD]">
              <div className="bg-white rounded-lg p-3 shadow-sm max-w-[85%]">
                <p className="text-xs text-charcoal/80 leading-relaxed">
                  Salam! 👋 How can we help you today? Choose a topic or type your question.
                </p>
                <p className="text-[10px] text-charcoal/40 mt-1 text-right">Homedecor</p>
              </div>
            </div>

            {/* Quick replies */}
            <div className="p-4 space-y-2 bg-white border-t border-sand/20">
              {PRESET_MESSAGES.map(msg => (
                <button
                  key={msg}
                  onClick={() => openChat(msg)}
                  className="w-full text-left text-xs text-[#25D366] border border-[#25D366]/30 px-3 py-2.5 hover:bg-[#25D366]/5 transition-colors"
                >
                  {msg}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Open WhatsApp support"
        className="w-14 h-14 bg-[#25D366] rounded-full shadow-lg flex items-center justify-center"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <X className="w-6 h-6 text-white" />
            </motion.div>
          ) : (
            <motion.div key="chat" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
              <MessageCircle className="w-6 h-6 text-white" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}