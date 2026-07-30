'use client';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingBag, Search, Heart, User, Menu, X } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { useStore } from '@/hooks/useStore';

const LazyCartDrawer = dynamic(() => import('../cart/CartDrawer'), { ssr: false });
const LazySearchOverlay = dynamic(() => import('../search/SearchOverlay'), { ssr: false });

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Shop', href: '/shop' },
  { name: 'Categories', href: '/shop?category=furniture' },
  { name: 'New Arrivals', href: '/shop?filter=new' },
  { name: 'Best Sellers', href: '/shop?filter=best' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  
  const { openDrawer, isDrawerOpen } = useCartStore();
  const cartItems = useStore(useCartStore, (state) => state.items) || [];
  const cartItemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // Smooth background transition on scroll
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 h-20 z-40 transition-all duration-500 border-b ${
          scrolled 
            ? 'bg-luxury-white/90 backdrop-blur-lg border-sand/30 shadow-sm' 
            : 'bg-transparent border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto h-full px-6 flex items-center justify-between">
          
          {/* Mobile Menu Toggle & Search */}
          <div className="flex items-center gap-4 lg:hidden">
            <button onClick={() => setIsMobileMenuOpen(true)} aria-label="Open Menu">
              <Menu className={`w-5 h-5 ${scrolled || pathname !== '/' ? 'text-charcoal' : 'text-luxury-white'}`} />
            </button>
            <button onClick={() => setIsSearchOpen(true)} aria-label="Search Collection">
              <Search className={`w-5 h-5 ${scrolled || pathname !== '/' ? 'text-charcoal' : 'text-luxury-white'}`} />
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.slice(0, 4).map((link) => (
              <Link 
                key={link.name} 
                href={link.href}
                className={`text-[11px] uppercase tracking-[0.15em] transition-colors hover:text-walnut-brown relative group ${
                  scrolled || pathname !== '/' ? 'text-charcoal/80' : 'text-luxury-white/90 hover:text-luxury-white'
                }`}
              >
                {link.name}
                <span className={`absolute -bottom-1 left-0 w-0 h-[1px] transition-all duration-300 group-hover:w-full ${
                  scrolled || pathname !== '/' ? 'bg-walnut-brown' : 'bg-luxury-white'
                }`} />
              </Link>
            ))}
          </nav>

          {/* BRAND */}
          <Link href="/" className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center">
            <span className={`font-serif text-2xl lg:text-3xl tracking-[0.2em] transition-colors ${
              scrolled || pathname !== '/' ? 'text-walnut-brown' : 'text-luxury-white'
            }`}>
              HOMEDECOR
            </span>
          </Link>

          {/* Desktop Right Nav & Icons */}
          <div className="flex items-center gap-6">
            <nav className="hidden lg:flex items-center gap-8 mr-4">
              {navLinks.slice(4).map((link) => (
                <Link 
                  key={link.name} 
                  href={link.href}
                  className={`text-[11px] uppercase tracking-[0.15em] transition-colors hover:text-walnut-brown relative group ${
                    scrolled || pathname !== '/' ? 'text-charcoal/80' : 'text-luxury-white/90 hover:text-luxury-white'
                  }`}
                >
                  {link.name}
                  <span className={`absolute -bottom-1 left-0 w-0 h-[1px] transition-all duration-300 group-hover:w-full ${
                    scrolled || pathname !== '/' ? 'bg-walnut-brown' : 'bg-luxury-white'
                  }`} />
                </Link>
              ))}
            </nav>

            <div className={`flex items-center gap-5 transition-colors ${
              scrolled || pathname !== '/' ? 'text-charcoal' : 'text-luxury-white'
            }`}>
              <button className="hidden lg:block hover:text-walnut-brown transition-colors" onClick={() => setIsSearchOpen(true)}>
                <Search className="w-4 h-4" />
              </button>
              <Link href="/profile" className="hidden sm:block hover:text-walnut-brown transition-colors">
                <User className="w-4 h-4" />
              </Link>
              <Link href="/profile?tab=wishlist" className="hidden sm:block hover:text-walnut-brown transition-colors">
                <Heart className="w-4 h-4" />
              </Link>
              <button onClick={openDrawer} className="relative hover:text-walnut-brown transition-colors" aria-label="Open Cart Bag">
                <ShoppingBag className="w-4 h-4" />
                {cartItemCount > 0 && (
                  <span className={`absolute -top-2 -right-2 font-sans text-[9px] font-medium w-4 h-4 rounded-full flex items-center justify-center transition-colors ${
                    scrolled || pathname !== '/' ? 'bg-walnut-brown text-luxury-white' : 'bg-luxury-white text-charcoal'
                  }`}>
                    {cartItemCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Full-Screen Menu */}
      <div className={`fixed inset-0 bg-luxury-white z-50 transform transition-transform duration-500 ease-in-out lg:hidden ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="h-20 px-6 flex items-center justify-between border-b border-sand/30">
          <span className="font-serif text-xl tracking-[0.2em] text-walnut-brown">HOMEDECOR</span>
          <button onClick={() => setIsMobileMenuOpen(false)}>
            <X className="w-6 h-6 text-charcoal" />
          </button>
        </div>
        <nav className="p-8 flex flex-col gap-6">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href}
              className="text-2xl font-serif text-charcoal hover:text-walnut-brown transition-colors"
            >
              {link.name}
            </Link>
          ))}
          <div className="w-full h-[1px] bg-sand/30 my-4" />
          <Link href="/profile" className="text-sm uppercase tracking-widest text-charcoal/60 hover:text-walnut-brown flex items-center gap-4">
            <User className="w-4 h-4" /> Account Login
          </Link>
          <Link href="/profile?tab=wishlist" className="text-sm uppercase tracking-widest text-charcoal/60 hover:text-walnut-brown flex items-center gap-4">
            <Heart className="w-4 h-4" /> Wishlist
          </Link>
        </nav>
      </div>

      {isDrawerOpen && <LazyCartDrawer />}
      {isSearchOpen && <LazySearchOverlay onClose={() => setIsSearchOpen(false)} />}
    </>
  );
}