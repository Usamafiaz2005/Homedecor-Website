'use client';
import { useState, Suspense } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { api } from '@/lib/axios';
import { useAuthStore } from '@/store/authStore';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import Link from 'next/link';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const setUser = useAuthStore((state) => state.setUser);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      const response = await api.post('/auth/login', data);
      setUser(response.data.user);
      toast.success(`Welcome back, ${response.data.user.name.split(' ')[0]}`, {
        style: { background: '#4E342E', color: '#FAFAFA' }
      });
      const callbackUrl = searchParams.get('callbackUrl') || '/';
      router.push(callbackUrl);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-luxury-white py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-8 bg-white p-10 shadow-2xl border border-sand/20"
      >
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-serif text-charcoal">Sign in to Homedecor</h2>
          <p className="mt-2 text-sm text-walnut-brown/70">
            Access your curated wishlist and exclusive orders.
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">Email Address</label>
              <input
                {...register('email')}
                type="email"
                className="appearance-none relative block w-full px-3 py-3 border border-sand bg-luxury-white placeholder-gray-400 text-charcoal focus:outline-none focus:ring-1 focus:ring-walnut-brown focus:border-walnut-brown transition-colors sm:text-sm"
                placeholder="ahmed@example.com"
              />
              {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">Password</label>
              <input
                {...register('password')}
                type="password"
                className="appearance-none relative block w-full px-3 py-3 border border-sand bg-luxury-white placeholder-gray-400 text-charcoal focus:outline-none focus:ring-1 focus:ring-walnut-brown focus:border-walnut-brown transition-colors sm:text-sm"
                placeholder="••••••••"
              />
              {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-sm">
              <Link href="/forgot-password" className="font-medium text-walnut-brown hover:text-charcoal transition-colors">
                Forgot your password?
              </Link>
            </div>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium text-luxury-white bg-walnut-brown hover:bg-charcoal focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-walnut-brown transition-all duration-300 disabled:opacity-70"
          >
            {isLoading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}