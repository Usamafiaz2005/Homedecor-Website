// client/src/components/ui/Skeletons.tsx

const shimmer = "animate-pulse bg-sand/30";

export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col">
      <div className={`aspect-[4/5] w-full ${shimmer}`} />
      <div className="pt-4 space-y-2">
        <div className={`h-3 w-16 ${shimmer}`} />
        <div className={`h-4 w-3/4 ${shimmer}`} />
        <div className={`h-3 w-20 ${shimmer}`} />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function ProductDetailSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-2 gap-16">
      <div className={`aspect-square ${shimmer}`} />
      <div className="space-y-6">
        <div className={`h-4 w-24 ${shimmer}`} />
        <div className={`h-8 w-3/4 ${shimmer}`} />
        <div className={`h-6 w-32 ${shimmer}`} />
        <div className="space-y-2">
          <div className={`h-4 w-full ${shimmer}`} />
          <div className={`h-4 w-5/6 ${shimmer}`} />
          <div className={`h-4 w-4/6 ${shimmer}`} />
        </div>
        <div className={`h-12 w-full ${shimmer}`} />
      </div>
    </div>
  );
}

export function OrderCardSkeleton() {
  return (
    <div className="bg-white border border-sand/30 p-6 space-y-4">
      <div className="flex justify-between">
        <div className={`h-4 w-32 ${shimmer}`} />
        <div className={`h-4 w-20 ${shimmer}`} />
      </div>
      <div className={`h-px w-full bg-sand/30`} />
      <div className="flex gap-4">
        <div className={`w-16 h-20 ${shimmer}`} />
        <div className="flex-1 space-y-2">
          <div className={`h-4 w-3/4 ${shimmer}`} />
          <div className={`h-3 w-1/2 ${shimmer}`} />
        </div>
      </div>
    </div>
  );
}

export function NavbarSkeleton() {
  return (
    <div className="fixed top-0 left-0 right-0 h-20 bg-luxury-white/80 border-b border-sand/20 z-40">
      <div className="max-w-7xl mx-auto h-full px-6 flex items-center justify-between">
        <div className={`w-5 h-5 rounded ${shimmer}`} />
        <div className={`w-28 h-5 ${shimmer}`} />
        <div className={`w-5 h-5 rounded ${shimmer}`} />
      </div>
    </div>
  );
}