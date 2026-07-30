'use client';
import { useState } from 'react';
import { useCartStore } from '@/store/useCartStore';
import { Product, ProductVariant } from '@/types';
import { Minus, Plus, ShoppingBag } from 'lucide-react';

interface ProductActionsProps {
  product: Product;
}

export default function ProductActions({ product }: ProductActionsProps) {
  const addItem = useCartStore((state) => state.addItem);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(
    product.variants?.[0] || { _id: 'default', color: 'Standard', material: 'Standard', stock: product.totalStock, sku: 'SKU-DEF' }
  );
  const [quantity, setQuantity] = useState(1);

  const handleQuantityChange = (type: 'inc' | 'dec') => {
    if (type === 'dec' && quantity > 1) setQuantity(prev => prev - 1);
    if (type === 'inc' && quantity < selectedVariant.stock) setQuantity(prev => prev + 1);
  };

  const handleAddToCart = () => {
    addItem(product, selectedVariant, quantity);
  };

  const isOutOfStock = selectedVariant.stock === 0;

  return (
    <div className="space-y-6 font-sans">
      {/* Configuration Picker */}
      {product.variants && product.variants.length > 1 && (
        <div>
          <span className="block text-xs uppercase tracking-widest text-charcoal/60 font-semibold mb-3">Select Configuration</span>
          <div className="flex flex-wrap gap-3">
            {product.variants.map((v) => (
              <button
                key={v._id}
                type="button"
                onClick={() => { setSelectedVariant(v); setQuantity(1); }}
                className={`px-4 py-2.5 text-xs uppercase tracking-wider border transition-all duration-300 rounded-none ${
                  selectedVariant._id === v._id
                    ? 'border-walnut-brown bg-walnut-brown text-white font-medium'
                    : 'border-sand hover:border-charcoal text-charcoal'
                } focus-ring-premium`}
              >
                {v.color} {v.material ? `(${v.material})` : ''}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Stock Status */}
      <div className="text-xs tracking-wide">
        {isOutOfStock ? (
          <span className="text-red-600 font-medium">Bespoke Production Backordered (Out of Stock)</span>
        ) : (
          <span className="text-charcoal/60">
            Available at Lahore Showroom: <strong className="text-charcoal font-medium">{selectedVariant.stock} pieces</strong> remaining
          </span>
        )}
      </div>

      {/* Quantity & Add to Cart CTA */}
      <div className="flex flex-col sm:flex-row gap-4 pt-2">
        <div className="flex items-center justify-between border border-sand w-full sm:w-32 h-14" aria-label="Quantity Selector">
          <button
            type="button"
            disabled={quantity <= 1 || isOutOfStock}
            onClick={() => handleQuantityChange('dec')}
            className="h-full px-4 text-charcoal hover:bg-sand/15 transition-colors disabled:opacity-30 focus-ring-premium"
          >
            <Minus className="w-3 h-3" />
          </button>
          <span className="text-sm font-medium w-8 text-center select-none" aria-live="polite">
            {quantity}
          </span>
          <button
            type="button"
            disabled={quantity >= selectedVariant.stock || isOutOfStock}
            onClick={() => handleQuantityChange('inc')}
            className="h-full px-4 text-charcoal hover:bg-sand/15 transition-colors disabled:opacity-30 focus-ring-premium"
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>

        <button
          type="button"
          disabled={isOutOfStock}
          onClick={handleAddToCart}
          className="flex-1 h-14 bg-walnut-brown text-luxury-white uppercase tracking-widest text-xs font-semibold hover:bg-charcoal transition-colors duration-300 flex items-center justify-center gap-3 disabled:bg-gray-300 disabled:cursor-not-allowed focus-ring-premium"
        >
          <ShoppingBag className="w-4 h-4" />
          {isOutOfStock ? 'Sold Out' : 'Add to Curated Cart'}
        </button>
      </div>
    </div>
  );
}