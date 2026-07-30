'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';

export default function StorefrontError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // In production, this would log to Sentry or Datadog
    console.error('Storefront Error Caught:', error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center bg-luxury-white px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-16 h-16 bg-sand/20 rounded-full flex items-center justify-center mx-auto">
          <AlertTriangle className="w-8 h-8 text-walnut-brown" />
        </div>
        
        <div className="space-y-2">
          <h2 className="text-2xl font-serif text-charcoal">Something went wrong</h2>
          <p className="text-sm text-charcoal/70">
            We encountered an unexpected issue while preparing this collection.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <button
            onClick={() => reset()}
            className="px-8 py-3 bg-walnut-brown text-luxury-white text-xs uppercase tracking-widest hover:bg-charcoal transition-colors focus-ring-premium"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="px-8 py-3 border border-charcoal text-charcoal text-xs uppercase tracking-widest hover:bg-charcoal hover:text-luxury-white transition-colors focus-ring-premium"
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}