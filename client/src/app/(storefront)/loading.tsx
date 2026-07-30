export default function StorefrontLoading() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center bg-luxury-white">
      <div className="flex flex-col items-center gap-6">
        {/* Minimalist Spinner */}
        <div className="w-12 h-12 border-2 border-sand border-t-walnut-brown rounded-full animate-spin"></div>
        
        {/* Branded Text */}
        <div className="space-y-2 text-center">
          <h2 className="text-charcoal font-serif tracking-wide text-lg">Curating the Collection</h2>
          <p className="text-xs text-charcoal/60 uppercase tracking-[0.2em]">Homedecor</p>
        </div>
      </div>
    </div>
  );
}