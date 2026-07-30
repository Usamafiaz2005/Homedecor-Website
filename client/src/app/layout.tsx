import '@/app/globals.css';
import type { Metadata } from 'next';
import { Playfair_Display, Inter } from 'next/font/google';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import WhatsAppWidget from '@/components/ui/WhatsAppWidget';
import { Toaster } from 'react-hot-toast';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://homedecore.homes'),
  title: {
    template: '%s | Homedecor',
    default: 'Homedecor | Luxury Home Decor & Handcrafted Furniture Pakistan',
  },
  description: 'Discover premium, handcrafted luxury furniture and architectural home decor in Lahore, Pakistan.',
  openGraph: {
    title: 'Homedecor | Luxury Home Decor & Furniture',
    description: 'Premium handcrafted furniture and architectural home decor in Pakistan.',
    url: '/',
    siteName: 'Homedecor',
    locale: 'en_PK',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${playfair.variable} ${inter.variable}`}>
      <body suppressHydrationWarning className="bg-luxury-white min-h-screen antialiased selection:bg-walnut-brown/10 selection:text-walnut-brown">
        <Navbar />
        {children}
        <WhatsAppWidget />
        <Footer />
        <Toaster position="bottom-right" toastOptions={{
          style: { borderRadius: '0px', fontFamily: 'var(--font-inter)', fontSize: '13px' }
        }} />
      </body>
    </html>
  );
}