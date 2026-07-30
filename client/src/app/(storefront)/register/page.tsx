'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { api } from '@/lib/axios';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be provided'),
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  phone: z.string().regex(/^((\+92)|(0092))-{0,1}\d{3}-{0,1}\d{7}$|^\d{11}$/, 'Invalid Pakistani phone number (e.g. 03001234567)'),
});

type RegisterValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema)
  });

  const onRegisterAttempt = async (data: RegisterValues) => {
    try {
      await api.post('/auth/register', data);
      toast.success('Account created! Please sign in.', { style: { background: '#4E342E', color: '#FAFAFA' } });
      router.push('/login');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-luxury-white px-6 pt-20">
      <div className="max-w-md w-full bg-white p-10 border border-sand/30 shadow-sm space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-serif text-charcoal">Create Account</h1>
          <p className="text-xs text-charcoal/60 font-sans mt-2">Join the Homedecor luxury design circle.</p>
        </div>
        <form onSubmit={handleSubmit(onRegisterAttempt)} className="space-y-4 font-sans text-sm">
          <div>
            <label className="block text-xs font-medium uppercase tracking-wider mb-2">Full Name</label>
            <input {...register('name')} className="w-full bg-transparent border-b border-sand py-2 outline-none focus:border-walnut-brown transition-colors" placeholder="Ahmed Khan" />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <label className="block text-xs font-medium uppercase tracking-wider mb-2">Email</label>
            <input type="email" {...register('email')} className="w-full bg-transparent border-b border-sand py-2 outline-none focus:border-walnut-brown transition-colors" placeholder="ahmed@example.com" />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <label className="block text-xs font-medium uppercase tracking-wider mb-2">Phone</label>
            <input {...register('phone')} className="w-full bg-transparent border-b border-sand py-2 outline-none focus:border-walnut-brown transition-colors" placeholder="03001234567" />
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
          </div>
          <div>
            <label className="block text-xs font-medium uppercase tracking-wider mb-2">Password</label>
            <input type="password" {...register('password')} className="w-full bg-transparent border-b border-sand py-2 outline-none focus:border-walnut-brown transition-colors" placeholder="Min. 8 characters" />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>
          <button type="submit" disabled={isSubmitting} className="w-full bg-walnut-brown text-white py-3.5 uppercase tracking-widest text-xs font-semibold hover:bg-charcoal transition-all mt-4 disabled:opacity-50">
            {isSubmitting ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
        <p className="text-xs text-center font-sans text-charcoal/60">
          Already have an account? <Link href="/login" className="text-walnut-brown hover:underline font-semibold">Sign in →</Link>
        </p>
      </div>
    </main>
  );
}