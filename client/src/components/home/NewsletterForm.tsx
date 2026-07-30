'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';

const newsletterSchema = z.object({
  email: z.string().email('Please submit a valid structural email address.')
});

// 1. Tell TypeScript to infer the type perfectly from the Zod schema
type NewsletterFormData = z.infer<typeof newsletterSchema>;

export default function NewsletterForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // 2. Pass the inferred type into useForm
  const { register, handleSubmit, reset, formState: { errors } } = useForm<NewsletterFormData>({
    resolver: zodResolver(newsletterSchema)
  });

  // 3. Use the inferred type here as well
  const onSubscribe = async (data: NewsletterFormData) => {
    setIsSubmitting(true);
    try {
      // Simulate API subscribe path safely
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Welcome to the Homedecor Inner Circle. Catalogues incoming.');
      reset();
    } catch {
      toast.error('Subscription error. Please retry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="bg-charcoal text-luxury-white py-20 px-6 text-center border-t border-sand/10">
      <div className="max-w-md mx-auto">
        <span className="text-[10px] uppercase tracking-widest text-sand font-semibold block mb-2">Join Our Journal</span>
        <h2 className="text-2xl font-serif mb-4">Privé Architectural Updates</h2>
        <p className="text-xs text-luxury-white/60 mb-6 font-sans">
          Subscribe to gain exclusive advance look previews at incoming seasonal collection drops and artisan feature logs.
        </p>
        <form onSubmit={handleSubmit(onSubscribe)} className="space-y-2">
          <div className="flex border-b border-sand/40 focus-within:border-sand transition-colors">
            <input
              {...register('email')}
              type="email"
              placeholder="Your email address"
              aria-label="Email for newsletter"
              className="bg-transparent border-none outline-none w-full px-2 py-3 text-sm font-sans placeholder-luxury-white/30 text-luxury-white"
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="text-xs uppercase tracking-widest font-sans font-semibold text-sand px-4 hover:text-luxury-white transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Joining...' : 'Subscribe'}
            </button>
          </div>
          {errors.email && <p className="text-left text-red-400 text-[11px] mt-1">{errors.email.message}</p>}
        </form>
      </div>
    </section>
  );
}