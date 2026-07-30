export interface ProductVariant {
  _id: string;
  color: string;
  material: string;
  stock: number;
  sku: string;
}

export interface Product {
  _id: string;
  title: string;
  slug: string;
  category: { name: string; slug: string };
  basePricePKR: number;
  discountedPricePKR?: number;
  thumbnail: string;
  variants: ProductVariant[];
  totalStock: number;
  isNewArrival: boolean;
  isBestSeller: boolean;
}

export interface CartItem extends Product {
  cartItemId: string; // Unique ID for variant + product combo
  selectedVariant: ProductVariant;
  quantity: number;
}
export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  avatar?: string;
}