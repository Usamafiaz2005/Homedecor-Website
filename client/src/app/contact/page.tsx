'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2 } from 'lucide-react';
import { api } from '@/lib/axios';
import { toast } from 'sonner';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post('/contact', {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: `[Subject: ${formData.subject || 'General Inquiry'}] ${formData.message}`
      });
      setSubmitted(true);
      toast.success('Your message has been safely received. Our concierge will be in touch shortly.');
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (error: any) {
      console.error('Contact submit error:', error);
      toast.error(error.response?.data?.message || 'Unable to transmit inquiry. Please call or WhatsApp us.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="bg-luxury-white min-h-screen pt-32 pb-24 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
        
        {/* Contact Matrix details left panel column */}
        <div className="lg:col-span-5 space-y-8">
          <div className="space-y-3">
            <span className="text-[10px] uppercase tracking-[0.3em] text-walnut-brown font-medium block">Studio Connection</span>
            <h1 className="text-3xl md:text-4xl font-serif text-charcoal tracking-wide">Establish Contact</h1>
            <p className="text-xs font-light text-charcoal/60 leading-relaxed">
              Arrange private gallery viewings in Lahore, discuss bespoke residential architectural commissions, or submit trade inquiries.
            </p>
          </div>

          <div className="space-y-4 pt-4 font-sans text-xs tracking-wider text-charcoal/80">
            <div className="flex items-center gap-4 p-4 border border-sand/30 bg-white shadow-xs">
              <Mail className="w-4 h-4 text-walnut-brown flex-shrink-0" /> 
              <div>
                <span className="block text-[10px] uppercase text-charcoal/40">Direct Inquiries</span>
                <span className="font-medium">concierge@homedecor.pk</span>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 border border-sand/30 bg-white shadow-xs">
              <Phone className="w-4 h-4 text-walnut-brown flex-shrink-0" /> 
              <div>
                <span className="block text-[10px] uppercase text-charcoal/40">Studio Phone</span>
                <span className="font-medium">+92 (42) 111-466333</span>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 border border-sand/30 bg-white shadow-xs">
              <MapPin className="w-4 h-4 text-walnut-brown flex-shrink-0" /> 
              <div>
                <span className="block text-[10px] uppercase text-charcoal/40">Flagship Showroom</span>
                <span className="font-medium">Badar Block, Allama Iqbal Town, Lahore, Pakistan</span>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 border border-sand/30 bg-white shadow-xs">
              <Clock className="w-4 h-4 text-walnut-brown flex-shrink-0" /> 
              <div>
                <span className="block text-[10px] uppercase text-charcoal/40">Operating Hours</span>
                <span className="font-medium">Mon - Sat: 11:00 AM - 08:00 PM (PKT)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Minimalist interactive user input form panel right column */}
        <div className="lg:col-span-7 bg-white border border-sand/40 p-8 md:p-12 shadow-sm">
          {submitted ? (
            <div className="text-center py-12 space-y-4">
              <CheckCircle2 className="w-12 h-12 text-walnut-brown mx-auto" />
              <h2 className="text-2xl font-serif text-charcoal">Inquiry Transmitted</h2>
              <p className="text-xs text-charcoal/60 max-w-md mx-auto">
                Thank you for reaching out to Homedecor. Our design advisory team will review your requirements and respond within 24 business hours.
              </p>
              <button 
                onClick={() => setSubmitted(false)}
                className="mt-6 inline-block text-xs uppercase tracking-widest text-walnut-brown font-semibold border-b border-walnut-brown pb-1 hover:text-charcoal"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-charcoal/60 font-medium block">Your Name *</label>
                  <input 
                    required 
                    name="name" 
                    value={formData.name} 
                    onChange={handleChange}
                    placeholder="Fatima Khan"
                    type="text" 
                    className="w-full bg-luxury-white border border-sand/40 p-3 text-xs outline-none focus:border-walnut-brown transition-colors" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-charcoal/60 font-medium block">Email Address *</label>
                  <input 
                    required 
                    name="email" 
                    value={formData.email} 
                    onChange={handleChange}
                    placeholder="fatima@example.com"
                    type="email" 
                    className="w-full bg-luxury-white border border-sand/40 p-3 text-xs outline-none focus:border-walnut-brown transition-colors" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-charcoal/60 font-medium block">Phone (Optional)</label>
                  <input 
                    name="phone" 
                    value={formData.phone} 
                    onChange={handleChange}
                    placeholder="+92 300 1234567"
                    type="tel" 
                    className="w-full bg-luxury-white border border-sand/40 p-3 text-xs outline-none focus:border-walnut-brown transition-colors" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-charcoal/60 font-medium block">Message Subject</label>
                  <input 
                    name="subject" 
                    value={formData.subject} 
                    onChange={handleChange}
                    placeholder="Custom Walnut Dining Table"
                    type="text" 
                    className="w-full bg-luxury-white border border-sand/40 p-3 text-xs outline-none focus:border-walnut-brown transition-colors" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-charcoal/60 font-medium block">Detailed Inquiry *</label>
                <textarea 
                  required 
                  rows={5} 
                  name="message" 
                  value={formData.message} 
                  onChange={handleChange}
                  placeholder="Tell us about your spatial dimensions, preferred hardwoods, or interior specifications..."
                  className="w-full bg-luxury-white border border-sand/40 p-3 text-xs outline-none focus:border-walnut-brown transition-colors resize-none" 
                />
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-charcoal text-luxury-white text-[11px] uppercase tracking-[0.2em] font-medium py-4 hover:bg-walnut-brown transition-colors duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSubmitting ? 'Transmitting...' : 'Transmit Inquiry'}
              </button>
            </form>
          )}
        </div>

      </div>
    </main>
  );
}