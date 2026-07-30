'use client';
import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '@/store/useCartStore';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function CartDrawer() {
  const { items, isDrawerOpen, closeDrawer, updateQuantity, cartTotal } = useCartStore();
  const drawerRef = useRef<HTMLDivElement>(null);

  // Hook 1: Trap Focus & Handle Accessibility Esc key event
  useEffect(() => {
    if (!isDrawerOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeDrawer();
    };

    window.addEventListener('keydown', handleKeyDown);
    
    // Auto focus the drawer container for accessibility layout entry announcements
    drawerRef.current?.focus();
    document.body.style.overflow = 'hidden'; // Lock background scrolling

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isDrawerOpen, closeDrawer]);

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <>
          {/* Backdrop with explicit accessibility handling */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeDrawer}
            className="fixed inset-0 bg-charcoal/40 backdrop-blur-sm z-50"
            role="presentation"
            aria-hidden="true"
          />

          {/* Drawer Layer conforming strictly to standard dialog configurations */}
          <motion.div
            ref={drawerRef}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-luxury-white shadow-2xl z-50 flex flex-col focus:outline-none"
            role="dialog"
            aria-modal="true"
            aria-labelledby="cart-drawer-heading"
            tabIndex={-1}
          >
            {/* Accessibility Live Region to announce quantity mutations directly */}
            <div className="sr-only" role="status" aria-live="polite">
              Shopping cart context updated. Total items count: {items.length}
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-sand/30">
              <h2 id="cart-drawer-heading" className="text-xl font-serif text-charcoal">
                Shopping Cart
              </h2>
              <button 
                onClick={closeDrawer} 
                className="p-2 hover:bg-sand/20 rounded-full transition-colors focus-ring-premium"
                aria-label="Close shopping cart drawer"
              >
                <X className="w-5 h-5 text-charcoal" aria-hidden="true" />
              </button>
            </div>

            {/* Items Stream */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-charcoal/60 space-y-4">
                  <ShoppingBag className="w-12 h-12 opacity-20" aria-hidden="true" />
                  <p className="font-serif">Your cart is elegantly empty.</p>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.cartItemId} className="flex gap-4" role="group" aria-label="Cart Line Item">
                    <div className="relative w-24 h-32 bg-[#F5F5F3] flex-shrink-0">
                      <Image src={item.thumbnail} alt={item.title} fill className="object-cover" />
                    </div>
                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div>
                        <h3 className="font-serif text-charcoal text-sm line-clamp-2">{item.title}</h3>
                        <p className="text-xs text-charcoal/50 mt-1">
                          Configuration: {item.selectedVariant.color} | {item.selectedVariant.material}
                        </p>
                      </div>
                      
                      <div className="flex items-center justify-between mt-4">
                        {/* Accessible Quantity Selector Node */}
                        <div className="flex items-center border border-sand">
                          <button 
                            onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)} 
                            className="px-3 py-1 text-charcoal hover:bg-sand/20 focus-ring-premium"
                            aria-label={`Decrease quantity of ${item.title}`}
                          >
                            <Minus className="w-3 h-3" aria-hidden="true" />
                          </button>
                          <span className="px-3 py-1 text-xs" aria-label={`Current quantity is ${item.quantity}`}>
                            {item.quantity}
                          </span>
                          <button 
                            onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)} 
                            className="px-3 py-1 text-charcoal hover:bg-sand/20 focus-ring-premium"
                            aria-label={`Increase quantity of ${item.title}`}
                          >
                            <Plus className="w-3 h-3" aria-hidden="true" />
                          </button>
                        </div>
                        <p className="font-medium text-sm">
                          <span className="sr-only">Line item total price</span>
                          Rs. {((item.discountedPricePKR || item.basePricePKR) * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer Calculations Frame */}
            {items.length > 0 && (
              <div className="border-t border-sand/30 p-6 bg-white">
                <div className="flex justify-between items-center mb-6">
                  <span className="font-serif text-charcoal text-base">Subtotal</span>
                  <span className="font-sans font-medium text-lg text-charcoal">
                    <span className="sr-only">Cart Grand Subtotal: </span>
                    Rs. {cartTotal().toLocaleString()}
                  </span>
                </div>
                <Link href="/checkout" onClick={closeDrawer} className="block">
                  <button className="w-full bg-walnut-brown text-luxury-white py-4 text-sm uppercase tracking-widest hover:bg-charcoal transition-colors focus-ring-premium">
                    Proceed to Checkout
                  </button>
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}