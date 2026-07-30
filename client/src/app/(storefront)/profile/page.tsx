'use client';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { User, ShieldCheck, MapPin } from 'lucide-react';

export default function ProfilePage() {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) router.push('/login?callbackUrl=/profile');
  }, [isAuthenticated, router]);

  if (!user) return null;

  return (
    <main className="max-w-4xl mx-auto px-6 py-20 pt-32">
      <div className="bg-white border border-sand/30 p-8 shadow-sm">
        <div className="flex items-center gap-6 border-b border-sand/20 pb-6 mb-8">
          <div className="w-16 h-16 bg-sand/30 rounded-full flex items-center justify-center text-walnut-brown"><User className="w-8 h-8" /></div>
          <div>
            <h1 className="text-2xl font-serif text-charcoal">{user.name}</h1>
            <p className="text-xs text-charcoal/60 font-sans mt-0.5">{user.email}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 font-sans">
          <div className="border border-sand/20 p-6 bg-luxury-white">
            <div className="flex items-center gap-3 text-walnut-brown mb-3"><ShieldCheck className="w-5 h-5" /><h2 className="text-xs uppercase tracking-widest font-semibold">Account Status</h2></div>
            <p className="text-sm text-charcoal/80">Designated Role Profile: <span className="capitalize font-semibold">{user.role}</span></p>
          </div>
          <div className="border border-sand/20 p-6 bg-luxury-white">
            <div className="flex items-center gap-3 text-walnut-brown mb-3"><MapPin className="w-5 h-5" /><h2 className="text-xs uppercase tracking-widest font-semibold">Primary Galleria Base</h2></div>
            <p className="text-sm text-charcoal/80">Lahore District Region Base Validation Node Active.</p>
          </div>
        </div>
      </div>
    </main>
  );
}