'use client';
import { useEffect, useState, useCallback } from 'react';
import { api } from '@/lib/axios';
import ProductCard from './ProductCard';
import { ProductGridSkeleton } from '../ui/Skeletons';
import { Product } from '@/types';
import { SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Filters {
  sort: string;
  color: string;
  minPrice: string;
  maxPrice: string;
}

interface ProductGridProps {
  category?: string;
  filter?: string; 
  keyword?: string;
}

export default function ProductGrid({ category, filter, keyword }: ProductGridProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    sort: '-createdAt',
    color: '',
    minPrice: '',
    maxPrice: '',
  });

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: '12',
        sort: filters.sort,
        ...(category && { category }),
        ...(keyword && { keyword }),
        ...(filters.color && { color: filters.color }),
        ...(filters.minPrice && { 'basePricePKR[gte]': filters.minPrice }),
        ...(filters.maxPrice && { 'basePricePKR[lte]': filters.maxPrice }),
      });

      if (filter) {
        const res = await api.get(`/products/curated/${filter}`);
        setProducts(res.data.data.products);
        setTotal(res.data.data.products.length);
      } else {
        const res = await api.get(`/products?${params}`);
        setProducts(res.data.data.products);
        setTotal(res.data.total);
      }
    } catch (err) {
      console.error('Failed to fetch products', err);
    } finally {
      setIsLoading(false);
    }
  }, [page, filters, category, filter, keyword]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const totalPages = Math.ceil(total / 12);
  const hasActiveFilters = filters.color || filters.minPrice || filters.maxPrice;

  const clearFilters = () => {
    setFilters({ sort: '-createdAt', color: '', minPrice: '', maxPrice: '' });
    setPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      {/* ── Premium Minimalist Toolbar ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 pb-5 border-b border-sand/20">
        <p className="text-xs uppercase tracking-[0.2em] text-charcoal/50 font-sans font-medium">
          {isLoading ? 'Cataloging...' : `${total} Objects found`}
        </p>
        
        <div className="flex items-center justify-between sm:justify-end gap-6">
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1.5 text-[11px] uppercase tracking-widest text-walnut-brown hover:text-charcoal transition-colors duration-300 font-sans"
            >
              <X className="w-3 h-3" /> Reset Filter
            </button>
          )}
          
          <div className="flex items-center gap-4">
            <div className="relative group bg-luxury-white">
              <select
                value={filters.sort}
                onChange={e => { setFilters(f => ({ ...f, sort: e.target.value })); setPage(1); }}
                className="appearance-none text-[11px] uppercase tracking-widest bg-transparent border border-sand/40 hover:border-walnut-brown transition-colors text-charcoal pl-4 pr-10 py-2.5 focus:outline-none cursor-pointer font-sans rounded-none"
              >
                <option value="-createdAt">Newest Arrivals</option>
                <option value="basePricePKR">Price: Low to High</option>
                <option value="-basePricePKR">Price: High to Low</option>
                <option value="-ratingsAverage">Highly Curated</option>
              </select>
              <ChevronDown className="w-3 h-3 text-charcoal/40 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none group-hover:text-walnut-brown transition-colors" />
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 text-[11px] uppercase tracking-widest border px-4 py-2.5 transition-all duration-300 rounded-none font-sans ${
                showFilters 
                  ? 'border-walnut-brown bg-charcoal text-luxury-white' 
                  : 'border-sand/40 hover:border-walnut-brown text-charcoal'
              }`}
            >
              <SlidersHorizontal className="w-3 h-3" />
              Refine
            </button>
          </div>
        </div>
      </div>

      {/* ── Premium Dropdown Filter Panel ── */}
      <AnimatePresence>
        {showFilters && (
          <motion.div 
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
            className="mb-12 p-8 bg-neutral-50/50 backdrop-blur-sm border border-sand/20 grid grid-cols-1 sm:grid-cols-3 gap-8"
          >
            <div>
              <label className="block text-[10px] font-medium text-charcoal/40 uppercase tracking-[0.25em] mb-3.5 font-sans">Palette</label>
              <div className="flex flex-wrap gap-2">
                {['Walnut', 'Beige', 'Ivory', 'Charcoal', 'Teak'].map(c => (
                  <button
                    key={c}
                    onClick={() => setFilters(f => ({ ...f, color: f.color === c.toLowerCase() ? '' : c.toLowerCase() }))}
                    className={`px-4 py-2 text-[11px] font-sans tracking-wide border transition-all duration-300 rounded-none ${
                      filters.color === c.toLowerCase()
                        ? 'bg-walnut-brown text-luxury-white border-walnut-brown'
                        : 'border-sand/40 bg-white text-charcoal/70 hover:border-walnut-brown'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-[10px] font-medium text-charcoal/40 uppercase tracking-[0.25em] mb-3.5 font-sans">Minimum Threshold (Rs.)</label>
              <input
                type="number"
                placeholder="0"
                value={filters.minPrice}
                onChange={e => setFilters(f => ({ ...f, minPrice: e.target.value }))}
                className="w-full border border-sand/40 bg-white px-4 py-2.5 text-xs font-sans placeholder-neutral-300 focus:outline-none focus:border-walnut-brown rounded-none transition-colors"
              />
            </div>
            
            <div>
              <label className="block text-[10px] font-medium text-charcoal/40 uppercase tracking-[0.25em] mb-3.5 font-sans">Maximum Cap (Rs.)</label>
              <input
                type="number"
                placeholder="500,000"
                value={filters.maxPrice}
                onChange={e => setFilters(f => ({ ...f, maxPrice: e.target.value }))}
                className="w-full border border-sand/40 bg-white px-4 py-2.5 text-xs font-sans placeholder-neutral-300 focus:outline-none focus:border-walnut-brown rounded-none transition-colors"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Luxury Grid System ── */}
      {isLoading ? (
        <ProductGridSkeleton />
      ) : products.length === 0 ? (
        <div className="text-center py-32 border border-dashed border-sand/30 bg-neutral-50/30">
          <p className="font-serif text-xl text-charcoal/60 mb-2 tracking-wide">Archival Void</p>
          <p className="text-xs text-charcoal/40 font-sans tracking-wider uppercase">No design objects currently match your adjustments.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12">
          {products.map((product, i) => (
            <ProductCard key={product._id} product={product} index={i} />
          ))}
        </div>
      )}

      {/* ── Editorial Pagination ── */}
      {!filter && totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 mt-20 border-t border-sand/10 pt-10">
          <button
            onClick={() => setPage(p => p - 1)}
            disabled={page === 1}
            className="px-5 py-2.5 text-[10px] uppercase tracking-widest border border-sand/40 text-charcoal/70 font-sans font-medium transition-all duration-300 disabled:opacity-20 hover:border-walnut-brown disabled:hover:border-sand/40 rounded-none bg-white"
          >
            ← Back
          </button>
          
          <div className="flex items-center gap-1.5">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-9 h-9 text-xs font-sans font-medium tracking-wide transition-all duration-300 rounded-none ${
                  p === page
                    ? 'bg-walnut-brown text-luxury-white font-semibold'
                    : 'border border-transparent text-charcoal/60 hover:border-sand'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
          
          <button
            onClick={() => setPage(p => p + 1)}
            disabled={page === totalPages}
            className="px-5 py-2.5 text-[10px] uppercase tracking-widest border border-sand/40 text-charcoal/70 font-sans font-medium transition-all duration-300 disabled:opacity-20 hover:border-walnut-brown disabled:hover:border-sand/40 rounded-none bg-white"
          >
            Forward →
          </button>
        </div>
      )}
    </div>
  );
}