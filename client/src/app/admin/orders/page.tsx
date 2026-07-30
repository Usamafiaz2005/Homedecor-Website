'use client';
import { useEffect, useState } from 'react';
import { ShoppingBag, Search, Eye, Loader2, CheckCircle2, Clock, Truck, AlertCircle, XCircle } from 'lucide-react';
import { api } from '@/lib/axios';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const query = selectedStatus ? `?status=${selectedStatus}` : '';
      const res = await api.get(`/orders/admin/all${query}`);
      if (res.data?.data?.orders) {
        setOrders(res.data.data.orders);
      }
    } catch (err) {
      console.error('Failed to load orders', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [selectedStatus]);

  const handleStatusChange = async (orderId: string, newOrderStatus: string, newPaymentStatus?: string) => {
    try {
      setUpdatingId(orderId);
      const res = await api.put(`/orders/${orderId}/status`, {
        orderStatus: newOrderStatus,
        paymentStatus: newPaymentStatus,
      });

      if (res.data?.success) {
        setOrders(orders.map((o) => (o._id === orderId ? res.data.data.order : o)));
        if (selectedOrder && selectedOrder._id === orderId) {
          setSelectedOrder(res.data.data.order);
        }
      }
    } catch (err) {
      alert('Failed to update order status.');
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Pending':
        return <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium bg-amber-50 text-amber-700 border border-amber-200"><Clock className="w-3 h-3" /> Pending</span>;
      case 'Processing':
        return <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium bg-blue-50 text-blue-700 border border-blue-200"><Loader2 className="w-3 h-3 animate-spin" /> Processing</span>;
      case 'Shipped':
        return <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium bg-purple-50 text-purple-700 border border-purple-200"><Truck className="w-3 h-3" /> Shipped</span>;
      case 'Delivered':
        return <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium bg-green-50 text-green-700 border border-green-200"><CheckCircle2 className="w-3 h-3" /> Delivered</span>;
      case 'Cancelled':
        return <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium bg-red-50 text-red-700 border border-red-200"><XCircle className="w-3 h-3" /> Cancelled</span>;
      default:
        return <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-gray-100 text-gray-700">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-charcoal">Orders Management</h1>
          <p className="text-sm text-gray-500">Track customer orders, verify payments, and manage fulfillment.</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-sand/50 pb-2">
        {['', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map((status) => (
          <button
            key={status}
            onClick={() => setSelectedStatus(status)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              selectedStatus === status ? 'bg-walnut-brown text-white' : 'bg-white text-charcoal/70 hover:bg-sand/30'
            }`}
          >
            {status || 'All Orders'}
          </button>
        ))}
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl border border-sand/50 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 flex justify-center items-center text-walnut-brown gap-3">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span className="text-sm font-medium">Loading orders...</span>
          </div>
        ) : orders.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <ShoppingBag className="w-10 h-10 mx-auto mb-3 text-gray-300" />
            <p className="text-base font-medium">No orders found</p>
            <p className="text-xs text-gray-400 mt-1">When customers place orders, they will appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 border-b border-sand/50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3.5">Order ID & Date</th>
                  <th className="px-6 py-3.5">Customer</th>
                  <th className="px-6 py-3.5">Payment</th>
                  <th className="px-6 py-3.5">Total Amount</th>
                  <th className="px-6 py-3.5">Order Status</th>
                  <th className="px-6 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-mono text-xs font-semibold text-charcoal">#{order._id.slice(-8).toUpperCase()}</p>
                      <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-charcoal">{order.shippingAddress?.fullName || order.user?.fullName || 'Guest'}</p>
                      <p className="text-xs text-gray-400">{order.shippingAddress?.phone || order.user?.email}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-xs font-medium text-charcoal">{order.paymentMethod}</p>
                      <span className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                        order.paymentStatus === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-charcoal">
                      Rs. {order.totalAmountPKR?.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(order.orderStatus)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-sand/30 hover:bg-sand/50 text-charcoal text-xs font-medium rounded-md transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" /> Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 space-y-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <h2 className="text-lg font-serif font-bold text-charcoal">
                  Order #{selectedOrder._id.slice(-8).toUpperCase()}
                </h2>
                <p className="text-xs text-gray-400">Placed on {new Date(selectedOrder.createdAt).toLocaleString()}</p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-400 hover:text-charcoal font-bold text-lg p-1"
              >
                ✕
              </button>
            </div>

            {/* Quick Status Update Controls */}
            <div className="bg-sand/20 p-4 rounded-lg space-y-3">
              <h3 className="text-xs font-semibold text-charcoal uppercase tracking-wider">Update Order Status</h3>
              <div className="flex flex-wrap items-center gap-3">
                <select
                  value={selectedOrder.orderStatus}
                  disabled={updatingId === selectedOrder._id}
                  onChange={(e) => handleStatusChange(selectedOrder._id, e.target.value, selectedOrder.paymentStatus)}
                  className="px-3 py-1.5 border rounded-md text-xs font-medium bg-white focus:outline-none focus:border-walnut-brown"
                >
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>

                <select
                  value={selectedOrder.paymentStatus}
                  disabled={updatingId === selectedOrder._id}
                  onChange={(e) => handleStatusChange(selectedOrder._id, selectedOrder.orderStatus, e.target.value)}
                  className="px-3 py-1.5 border rounded-md text-xs font-medium bg-white focus:outline-none focus:border-walnut-brown"
                >
                  <option value="Pending">Payment: Pending</option>
                  <option value="Paid">Payment: Paid</option>
                  <option value="Failed">Payment: Failed</option>
                  <option value="Refunded">Payment: Refunded</option>
                </select>

                {updatingId === selectedOrder._id && <Loader2 className="w-4 h-4 animate-spin text-walnut-brown" />}
              </div>
            </div>

            {/* Customer & Shipping Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="border p-3 rounded-lg space-y-1">
                <p className="font-semibold text-charcoal uppercase">Customer Details</p>
                <p className="text-gray-700">Name: {selectedOrder.shippingAddress?.fullName || 'N/A'}</p>
                <p className="text-gray-700">Phone: {selectedOrder.shippingAddress?.phone || 'N/A'}</p>
                <p className="text-gray-700">Email: {selectedOrder.user?.email || 'N/A'}</p>
              </div>
              <div className="border p-3 rounded-lg space-y-1">
                <p className="font-semibold text-charcoal uppercase">Shipping Address</p>
                <p className="text-gray-700">{selectedOrder.shippingAddress?.addressLine1}</p>
                {selectedOrder.shippingAddress?.addressLine2 && <p className="text-gray-700">{selectedOrder.shippingAddress?.addressLine2}</p>}
                <p className="text-gray-700">{selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.province} - {selectedOrder.shippingAddress?.postalCode}</p>
              </div>
            </div>

            {/* Order Items Table */}
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 border-b text-gray-500 font-semibold">
                  <tr>
                    <th className="p-3">Item</th>
                    <th className="p-3">Qty</th>
                    <th className="p-3">Price</th>
                    <th className="p-3 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {selectedOrder.orderItems?.map((item: any, i: number) => (
                    <tr key={i}>
                      <td className="p-3 flex items-center gap-2">
                        <img src={item.image} alt={item.title} className="w-8 h-8 rounded object-cover border" />
                        <div>
                          <p className="font-medium text-charcoal">{item.title}</p>
                          {item.variant?.sku && <p className="text-[10px] text-gray-400">SKU: {item.variant.sku}</p>}
                        </div>
                      </td>
                      <td className="p-3 font-medium">{item.qty}</td>
                      <td className="p-3">Rs. {item.pricePKR?.toLocaleString()}</td>
                      <td className="p-3 text-right font-semibold">Rs. {(item.qty * item.pricePKR)?.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Summary */}
            <div className="border-t pt-3 flex justify-between text-xs font-semibold text-charcoal">
              <span>Total Paid / Payable:</span>
              <span className="text-base text-walnut-brown">Rs. {selectedOrder.totalAmountPKR?.toLocaleString()}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
