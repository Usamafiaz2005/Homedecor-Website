import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product, ProductVariant } from '@/types';
import { toast } from 'sonner';

interface CartState {
  items: CartItem[];
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  addItem: (product: Product, variant: ProductVariant, quantity?: number) => void;
  removeItem: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isDrawerOpen: false,
      
      openDrawer: () => set({ isDrawerOpen: true }),
      closeDrawer: () => set({ isDrawerOpen: false }),
      
      addItem: (product, variant, quantity = 1) => {
        const cartItemId = `${product._id}-${variant._id}`;
        const currentItems = get().items;
        const existingItem = currentItems.find(item => item.cartItemId === cartItemId);
        
        if (existingItem) {
          if (existingItem.quantity + quantity > variant.stock) {
            toast.error(`Only ${variant.stock} items available in stock.`);
            return;
          }
          set({
            items: currentItems.map(item => 
              item.cartItemId === cartItemId 
                ? { ...item, quantity: item.quantity + quantity } 
                : item
            ),
            isDrawerOpen: true,
          });
        } else {
          set({ 
            items: [...currentItems, { ...product, selectedVariant: variant, quantity, cartItemId }],
            isDrawerOpen: true 
          });
        }
        toast.success('Added to your curated cart.', { className: 'bg-charcoal text-luxury-white' });
      },

      removeItem: (cartItemId) => {
        set({ items: get().items.filter(item => item.cartItemId !== cartItemId) });
      },

      updateQuantity: (cartItemId, quantity) => {
        if (quantity < 1) return;
        set({
          items: get().items.map(item => 
            item.cartItemId === cartItemId ? { ...item, quantity } : item
          )
        });
      },

      clearCart: () => set({ items: [] }),

      cartTotal: () => {
        return get().items.reduce((total, item) => {
          const price = item.discountedPricePKR || item.basePricePKR;
          return total + (price * item.quantity);
        }, 0);
      }
    }),
    { name: 'Homedecor-cart' }
  )
);