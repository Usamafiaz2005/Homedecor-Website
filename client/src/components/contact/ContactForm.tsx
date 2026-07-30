'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be provided.'),
  email: z.string().email('Provide a valid email address.'),
  message: z.string().min(10, 'Message must be at least 10 characters.')
});

type ContactValues = z.infer<typeof contactSchema>;

export default function ContactForm() {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ContactValues>({
    resolver: zodResolver(contactSchema)
  });

  const handleMessageSubmit = async (data: ContactValues) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Message dispatched to our Gulberg showroom concierge team.');
      reset();
    } catch {
      toast.error('System delivery fault. Contact via phone line.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleMessageSubmit)} className="space-y-6 max-w-xl mx-auto bg-white p-8 border border-sand/20">
      <div>
        <label htmlFor="cnt-name" className="block text-xs uppercase tracking-widest font-semibold mb-2">Your Name</label>
        <input id="cnt-name" {...register('name')} className="w-full bg-transparent border-b border-sand py-2 outline-none focus:border-walnut-brown transition-colors font-sans text-sm" />
        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
      </div>
      <div>
        <label htmlFor="cnt-email" className="block text-xs uppercase tracking-widest font-semibold mb-2">Email</label>
        <input id="cnt-email" type="email" {...register('email')} className="w-full bg-transparent border-b border-sand py-2 outline-none focus:border-walnut-brown transition-colors font-sans text-sm" />
        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
      </div>
      <div>
        <label htmlFor="cnt-msg" className="block text-xs uppercase tracking-widest font-semibold mb-2">Your Inquiry</label>
        <textarea id="cnt-msg" rows={4} {...register('message')} className="w-full bg-transparent border-b border-sand py-2 outline-none focus:border-walnut-brown transition-colors font-sans text-sm resize-none" />
        {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
      </div>
      <button type="submit" disabled={loading} className="w-full bg-walnut-brown text-white py-4 font-sans uppercase tracking-widest text-xs font-semibold hover:bg-charcoal transition-colors disabled:opacity-50 focus-ring-premium">
        {loading ? 'Transmitting...' : 'Send Inquiry'}
      </button>
    </form>
  );
}