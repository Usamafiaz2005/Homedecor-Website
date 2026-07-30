'use client';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { api } from '@/lib/axios';
import { ShoppingBag, Box, Calendar, CreditCard } from 'lucide-react';

function OrdersContent() {
  const searchParams = useSearchParams();
  const targetedOrderId = searchParams.get('id');
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrders() {
      try {
        const url = targetedOrderId ? `/orders/${targetedOrderId}` : '/orders/my-orders';
        const res = await api.get(url);
        // Handle single order array mapping safely
        const payload = targetedOrderId ? [res.data.data.order] : res.data.data.orders;
        setOrders(payload || []);
      } catch (err) {
        console.error('Failed to parse history metrics:', err);
      } finally {
        setLoading(false);
      }
    }
    loadOrders();
  }, [targetedOrderId]);

  if (loading) return <div className="text-center py-20 font-sans text-sm animate-pulse">Syncing order manifest entries...</div>;

  return (
    <main className="max-w-5xl mx-auto px-6 py-20 pt-32">
      <div className="flex items-center gap-3 mb-10 border-b border-sand/30 pb-4">
        <ShoppingBag className="w-6 h-6 text-walnut-brown" />
        <h1 className="text-2xl font-serif text-charcoal">
          {targetedOrderId ? 'Order Manifest Validation' : 'Your Order Heritage History'}
        </h1>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-16 bg-white border border-sand/20 rounded-xs font-serif text-charcoal/60">
          No current order receipts logged in this profile node index.
        </div>
      ) : (
        <div className="space-y-8">
          {orders.map((order: any) => (
            <div key={order._id} className="bg-white border border-sand/30 p-6 shadow-sm font-sans text-sm">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-luxury-white p-4 mb-6 text-xs uppercase tracking-wider text-charcoal/70 font-medium">
                <div><span className="block text-[10px] text-charcoal/40 mb-1">Manifest Identification</span><span className="font-mono text-charcoal select-all">{order._id}</span></div>
                <div><span className="block text-[10px] text-charcoal/40 mb-1"><Calendar className="w-3 h-3 inline mr-1" /> Logged Date</span>{new Date(order.createdAt).toLocaleDateString('en-PK')}</div>
                <div><span className="block text-[10px] text-charcoal/40 mb-1"><Box className="w-3 h-3 inline mr-1" /> Logistical Status</span><span className="text-walnut-brown font-semibold">{order.orderStatus}</span></div>
                <div><span className="block text-[10px] text-charcoal/40 mb-1"><CreditCard className="w-3 h-3 inline mr-1" /> Balance Clear</span>Rs. {order.totalAmountPKR?.toLocaleString()}</div>
              </div>
              <div className="divide-y divide-sand/20">
                {order.orderItems?.map((item: any, idx: number) => (
                  <div key={idx} className="py-4 flex justify-between items-center first:pt-0 last:pb-0">
                    <div>
                      <h4 className="font-serif font-medium text-charcoal text-base">{item.title}</h4>
                      <p className="text-xs text-charcoal/50 mt-1">Quantity Manifest Multiplier: {item.qty}</p>
                    </div>
                    <span className="font-semibold text-charcoal/80">Rs. {item.pricePKR?.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

export default function OrdersPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 font-sans text-sm animate-pulse">Loading execution context...</div>}>
      <OrdersContent />
    </Suspense>
  );
}