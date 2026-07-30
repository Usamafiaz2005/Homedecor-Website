'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { api } from '@/lib/axios';
import Link from 'next/link';
import { LayoutDashboard, Package, ShoppingBag, Users, Image as ImageIcon, Settings, LogOut } from 'lucide-react';

const sidebarLinks = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Products', href: '/admin/products', icon: Package },
  { name: 'Categories', href: '/admin/categories', icon: Package },
  { name: 'Orders', href: '/admin/orders', icon: ShoppingBag },
  { name: 'Customers', href: '/admin/customers', icon: Users },
  { name: 'CMS & Banners', href: '/admin/cms', icon: ImageIcon },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, logout } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (!isAuthenticated || user?.role !== 'admin') {
      router.push('/login?callbackUrl=/admin');
    }
  }, [isAuthenticated, user, router]);

  if (!isMounted || !isAuthenticated || user?.role !== 'admin') return null;

  return (
    <div className="min-h-screen bg-[#F5F5F3] flex text-charcoal font-sans">
      {/* Admin Sidebar */}
      <aside className="w-64 bg-white border-r border-sand/50 fixed h-full z-20 flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-sand/50">
          <span className="font-serif text-xl text-walnut-brown">Homedecor Admin</span>
        </div>
        <nav className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link key={link.name} href={link.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors text-sm font-medium ${
                  isActive ? 'bg-walnut-brown text-luxury-white' : 'text-charcoal/70 hover:bg-sand/20 hover:text-charcoal'
                }`}
              >
                <Icon className="w-4 h-4" />
                {link.name}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-sand/50">
          <button onClick={() => { logout(); router.push('/login'); }} className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md w-full transition-colors">
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="ml-64 flex-1 flex flex-col min-h-screen">
        <header className="h-16 bg-white border-b border-sand/50 flex items-center justify-between px-8 sticky top-0 z-10">
          <h1 className="text-sm font-medium text-charcoal/60 capitalize">
            {pathname.split('/').pop() || 'Overview'}
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">{user.name}</span>
            <div className="w-8 h-8 rounded-full bg-walnut-brown text-white flex items-center justify-center text-xs">
              {user.name.charAt(0)}
            </div>
          </div>
        </header>
        <div className="p-8 flex-1 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
}