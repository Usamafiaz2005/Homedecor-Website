'use client';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { api } from '@/lib/axios';
import { Instagram, Facebook, MessageCircle } from 'lucide-react';

const links = {
  shop: [
    { label: 'All Products', href: '/shop' },
    { label: 'New Arrivals', href: '/shop?filter=new' },
    { label: 'Best Sellers', href: '/shop?filter=trending' },
    { label: 'Flash Sale', href: '/shop?filter=flash-sale' },
  ],
  assistance: [
    { label: 'Studio Inquiries', href: '/contact' },
    { label: 'Shipping Info', href: '/shipping' },
    { label: 'Exchange Mandates', href: '/returns' },
    { label: 'Track Order', href: '/track' },
  ],
  company: [
    { label: 'Our Story', href: '/about' },
    { label: 'Craftsmanship', href: '/craftsmanship' },
  ],
};

export default function Footer() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const currentYear = new Date().getFullYear();

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await api.post('/newsletter/subscribe', { email, targetAdmin: 'zainabahmed1207@gmail.com' });
      toast.success('Welcome to the Homedecor Inner Circle.', { 
        style: { background: '#4E342E', color: '#FAFAFA', borderRadius: '0px' } 
      });
      setEmail('');
    } catch {
      toast.error('Subscription fault. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-luxury-white border-t border-sand/30 pt-16 font-sans">
      
      {/* ── Newsletter Row ── */}
      <div className="max-w-7xl mx-auto px-6 pb-14 border-b border-sand/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        <div className="space-y-1">
          <h3 className="text-lg font-serif text-charcoal tracking-wide">Join Our Journal</h3>
          <p className="text-xs text-charcoal/50 font-light">Advance previews of seasonal collections synced to homedecorhomes8@gmail.com.</p>
        </div>
        <form onSubmit={handleSubscribe} className="flex w-full md:w-auto border-b border-sand/60 focus-within:border-walnut-brown transition-colors duration-300 pb-1">
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Your email address"
            className="flex-1 md:w-64 bg-transparent border-none outline-none text-charcoal placeholder-charcoal/30 text-xs py-2 pr-4"
          />
          <button
            type="submit"
            disabled={loading}
            className="text-[10px] uppercase tracking-[0.2em] text-walnut-brown font-semibold hover:text-charcoal transition-colors disabled:opacity-50 px-2"
          >
            {loading ? '...' : 'Subscribe'}
          </button>
        </form>
      </div>

      {/* ── Grid Links ── */}
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-12 md:gap-8">
        <div className="md:col-span-2 space-y-4">
          <span className="font-serif text-2xl tracking-[0.2em] text-walnut-brown block">HOMEDECOR</span>
          <p className="text-[11px] text-charcoal/50 leading-relaxed font-light max-w-xs">
            Architectural furniture structures and handcrafted accessories engineered to transform spaces into silent sanctuaries. Delivering premium craftsmanship nationally from our Lahore studios.
          </p>
          <div className="flex items-center gap-4 pt-2">
            <a href="https://www.instagram.com/home.decor.homes?igsh=aWF6bjZyY2ZtbXZp" target="_blank" rel="noopener noreferrer" className="text-charcoal/40 hover:text-walnut-brown transition-colors">
              <Instagram className="w-4 h-4" />
            </a>
            <a href="https://www.facebook.com/share/1JKCLztrt8/" target="_blank" rel="noopener noreferrer" className="text-charcoal/40 hover:text-walnut-brown transition-colors">
              <Facebook className="w-4 h-4" />
            </a>
            <a href="https://tiktok.com/@homedecor.homes" target="_blank" rel="noopener noreferrer" className="text-charcoal/40 hover:text-walnut-brown transition-colors text-xs font-bold tracking-tighter">
              ТТ
            </a>
          </div>
        </div>

        {Object.entries(links).map(([section, items]) => (
          <div key={section} className="space-y-4">
            <h4 className="text-[10px] uppercase tracking-[0.25em] font-medium text-charcoal/40">{section}</h4>
            <ul className="space-y-2.5">
              {items.map(link => (
                <li key={link.label}>
                  <Link href={link.href} className="text-xs text-charcoal/70 font-light hover:text-walnut-brown transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* ── Sub-Footer Base ── */}
      <div className="border-t border-sand/10 bg-neutral-50/50">
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] text-charcoal/40 uppercase tracking-widest">
          <p>© {currentYear} Homedecor Studio. All Rights Reserved.</p>
          <div className="flex flex-wrap items-center justify-center gap-6 font-light">
            <a href="https://wa.me/923270724767" className="hover:text-walnut-brown transition-colors normal-case tracking-normal flex items-center gap-1 font-medium">
              <MessageCircle className="w-3 h-3 text-walnut-brown" /> 0327-0724767
            </a>
            <span className="normal-case tracking-normal text-charcoal/30">Lahore, Pakistan</span>
          </div>
        </div>
      </div>
    </footer>
  );
}