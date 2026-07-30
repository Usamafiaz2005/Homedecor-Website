'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useCartStore } from '@/store/useCartStore';
import { api } from '@/lib/axios';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const checkoutSchema = z.object({
  fullName: z.string().min(2, 'Name is required'),
  phone: z.string().regex(/^((\+92)|(0092))-{0,1}\d{3}-{0,1}\d{7}$|^\d{11}$/, 'Invalid Pakistani number format.'),
  addressLine1: z.string().min(10, 'Complete structural delivery address is required.'),
  city: z.string().min(2, 'City input missing.'),
  province: z.string(),
  paymentMethod: z.enum(['COD', 'JazzCash', 'EasyPaisa', 'Stripe'])
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const { items, cartTotal, clearCart } = useCartStore();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { province: 'Punjab', paymentMethod: 'COD' }
  });

  const selectedCity = watch('city');
  const paymentMethod = watch('paymentMethod');

  const calculateShipping = () => {
    if (cartTotal() > 100000) return 0;
    if (selectedCity?.toLowerCase() === 'lahore') return 500;
    return 1500;
  };

  const onSubmit = async (data: CheckoutFormValues) => {
    setIsProcessing(true);
    try {
      const orderPayload = {
        orderItems: items.map(i => ({ product: i._id, variant: i.selectedVariant, qty: i.quantity })),
        shippingAddress: { fullName: data.fullName, phone: data.phone, addressLine1: data.addressLine1, city: data.city, province: data.province, postalCode: '54000' },
        paymentMethod: data.paymentMethod
      };

      const res = await api.post('/orders', orderPayload);
      const orderId = res.data.data.order._id;

      clearCart();
      toast.success('Order logged successfully.');
      router.push(`/orders?id=${orderId}`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Checkout connection terminal fault.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0) return <div className="min-h-screen flex items-center justify-center font-serif text-charcoal">Cart is empty.</div>;

  return (
    <div className="max-w-7xl mx-auto px-6 sm:px-8 py-16 grid grid-cols-1 lg:grid-cols-12 gap-12 pt-32">
      <div className="lg:col-span-7">
        <h1 className="text-2xl font-serif text-charcoal mb-8">Secure Checkout Gateway</h1>
        <form id="checkout-form" onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="bg-luxury-white p-8 border border-sand/30">
            <h2 className="text-sm font-serif uppercase tracking-wider text-charcoal mb-6 border-b border-sand pb-4">1. Shipping Logistics Destination</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="chk-name" className="block text-xs font-medium uppercase tracking-wider mb-2">Full Name</label>
                <input id="chk-name" {...register('fullName')} className="w-full bg-transparent border-b border-sand py-2 outline-none focus:border-walnut-brown transition-colors" />
                {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>}
              </div>
              <div>
                <label htmlFor="chk-phone" className="block text-xs font-medium uppercase tracking-wider mb-2">Phone</label>
                <input id="chk-phone" {...register('phone')} className="w-full bg-transparent border-b border-sand py-2 outline-none focus:border-walnut-brown transition-colors" />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
              </div>
              <div className="col-span-2">
                <label htmlFor="chk-address" className="block text-xs font-medium uppercase tracking-wider mb-2">Street Address</label>
                <input id="chk-address" {...register('addressLine1')} className="w-full bg-transparent border-b border-sand py-2 outline-none focus:border-walnut-brown transition-colors" />
                {errors.addressLine1 && <p className="text-red-500 text-xs mt-1">{errors.addressLine1.message}</p>}
              </div>
              <div>
                <label htmlFor="chk-city" className="block text-xs font-medium uppercase tracking-wider mb-2">City</label>
                <input id="chk-city" {...register('city')} placeholder="Lahore" className="w-full bg-transparent border-b border-sand py-2 outline-none focus:border-walnut-brown transition-colors" />
              </div>
            </div>
          </div>
          <div className="bg-luxury-white p-8 border border-sand/30">
            <h2 className="text-sm font-serif uppercase tracking-wider text-charcoal mb-6 border-b border-sand pb-4">2. Payment Protocol Settlement</h2>
            <div className="space-y-4">
              <label className={`flex items-center p-4 border cursor-pointer ${paymentMethod === 'COD' ? 'border-walnut-brown bg-sand/10' : 'border-sand'}`}>
                <input type="radio" value="COD" {...register('paymentMethod')} className="w-4 h-4 text-walnut-brown" />
                <span className="ml-3 text-sm font-sans font-medium text-charcoal">Cash on Delivery (Pakistan)</span>
              </label>
              <label className={`flex items-center p-4 border cursor-pointer ${paymentMethod === 'JazzCash' ? 'border-walnut-brown bg-sand/10' : 'border-sand'}`}>
                <input type="radio" value="JazzCash" {...register('paymentMethod')} className="w-4 h-4 text-walnut-brown" />
                <span className="ml-3 text-sm font-sans font-medium text-charcoal">JazzCash Escrow Wallet</span>
              </label>
            </div>
          </div>
        </form>
      </div>
      <div className="lg:col-span-5">
        <div className="bg-[#F5F5F3] p-8 sticky top-32">
          <h2 className="text-base font-serif text-charcoal mb-6">Review Manifest</h2>
          <div className="space-y-4 mb-6 max-h-[30vh] overflow-y-auto">
            {items.map((item) => (
              <div key={item.cartItemId} className="flex gap-4 items-center">
                <div className="relative w-12 h-16 bg-white flex-shrink-0"><Image src={item.thumbnail} alt={item.title} fill className="object-cover" /></div>
                <div className="flex-1 text-xs">
                  <h3 className="font-serif text-charcoal line-clamp-1">{item.title}</h3>
                  <p className="text-charcoal/50 mt-0.5">Qty: {item.quantity}</p>
                </div>
                <span className="text-xs font-semibold">Rs. {((item.discountedPricePKR || item.basePricePKR) * item.quantity).toLocaleString()}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-sand/50 pt-4 text-xs space-y-2 font-sans text-charcoal/80">
            <div className="flex justify-between"><span>Subtotal</span><span>Rs. {cartTotal().toLocaleString()}</span></div>
            <div className="flex justify-between"><span>Logistics Fee</span><span>Rs. {calculateShipping().toLocaleString()}</span></div>
            <div className="border-t border-sand pt-4 flex justify-between font-serif text-base text-charcoal">
              <span>Final Total</span><span>Rs. {(cartTotal() + calculateShipping()).toLocaleString()}</span>
            </div>
          </div>
          <button type="submit" form="checkout-form" disabled={isProcessing} className="w-full mt-8 bg-walnut-brown text-white py-4 uppercase tracking-widest text-xs font-semibold hover:bg-charcoal transition-colors disabled:opacity-50">
            {isProcessing ? 'Processing Transaction...' : 'Place Secure Order'}
          </button>
        </div>
      </div>
    </div>
  );
}