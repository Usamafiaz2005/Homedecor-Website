'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { api } from '@/lib/axios';
import { toast } from 'react-hot-toast';
import { CheckCircle } from 'lucide-react';

export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await api.post('/newsletter/subscribe', { email });
      setSubscribed(true);
      toast.success("You're on the list!", { style: { background: '#4E342E', color: '#FAFAFA' } });
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-[#F5F5F3] border-y border-sand/30 py-20 px-6">
      <div className="max-w-xl mx-auto text-center">
        <p className="text-xs text-walnut-brown/60 uppercase tracking-[0.3em] font-sans mb-3">Stay connected</p>
        <h2 className="text-3xl font-serif text-charcoal mb-3">The Homedecor Letter</h2>
        <p className="text-sm text-charcoal/50 font-sans mb-8">
          New arrivals, artisan stories, and exclusive offers — straight to your inbox.
        </p>
        {subscribed ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center justify-center gap-3 text-walnut-brown"
          >
            <CheckCircle className="w-5 h-5" />
            <p className="font-serif text-lg">You're in. Welcome to the circle.</p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="flex max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className="flex-1 px-4 py-3.5 border border-sand bg-white text-charcoal placeholder-charcoal/30 text-sm focus:outline-none focus:border-walnut-brown transition-colors"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-7 py-3.5 bg-walnut-brown text-luxury-white text-xs uppercase tracking-widest hover:bg-charcoal transition-colors disabled:opacity-60"
            >
              {loading ? '...' : 'Join'}
            </button>
          </form>
        )}
        <p className="text-[11px] text-charcoal/30 font-sans mt-4">No spam. Unsubscribe anytime.</p>
      </div>
    </section>
  );
}