'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Search, Edit3, Trash2, Loader2, PackageCheck, AlertTriangle } from 'lucide-react';
import { api } from '@/lib/axios';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get('/products?limit=100');
      if (res.data?.data?.products) {
        setProducts(res.data.data.products);
      }
    } catch (err) {
      console.error('Failed to fetch products', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;
    try {
      setDeletingId(id);
      await api.delete(`/products/${id}`);
      setProducts(products.filter((p) => p._id !== id));
    } catch (err) {
      alert('Failed to delete product.');
    } finally {
      setDeletingId(null);
    }
  };

  const filteredProducts = products.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.slug?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-charcoal">Products Management</h1>
          <p className="text-sm text-gray-500">Create, edit, manage stock, and organize storefront inventory.</p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-walnut-brown text-white rounded-md hover:bg-opacity-90 transition-all font-medium text-sm shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Add New Product
        </Link>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-sand/50 shadow-sm flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search products by title or slug..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-walnut-brown"
          />
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl border border-sand/50 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 flex justify-center items-center text-walnut-brown gap-3">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span className="text-sm font-medium">Loading products...</span>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <PackageCheck className="w-10 h-10 mx-auto mb-3 text-gray-300" />
            <p className="text-base font-medium">No products found</p>
            <p className="text-xs text-gray-400 mt-1">Try adjusting your search query or add a new product.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 border-b border-sand/50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3.5">Product</th>
                  <th className="px-6 py-3.5">Category</th>
                  <th className="px-6 py-3.5">Price (PKR)</th>
                  <th className="px-6 py-3.5">Stock</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredProducts.map((product) => {
                  const isLowStock = (product.totalStock || 0) < 5;
                  return (
                    <tr key={product._id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 flex items-center gap-3">
                        <img
                          src={product.thumbnail || '/placeholder.jpg'}
                          alt={product.title}
                          className="w-12 h-12 rounded-lg object-cover border border-sand bg-gray-100"
                        />
                        <div>
                          <p className="font-semibold text-charcoal">{product.title}</p>
                          <p className="text-xs text-gray-400">/{product.slug}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {product.category?.name || 'Uncategorized'}
                      </td>
                      <td className="px-6 py-4 font-medium text-charcoal">
                        Rs. {product.basePricePKR?.toLocaleString()}
                        {product.discountedPricePKR && (
                          <span className="block text-xs text-green-600">
                            Disc: Rs. {product.discountedPricePKR?.toLocaleString()}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium ${
                          isLowStock ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
                        }`}>
                          {isLowStock && <AlertTriangle className="w-3 h-3" />}
                          {product.totalStock || 0} in stock
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {product.isFeatured && <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded">Featured</span>}
                          {product.isBestSeller && <span className="text-[10px] bg-purple-100 text-purple-800 px-2 py-0.5 rounded">Best Seller</span>}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/products/${product._id}/edit`}
                            className="p-2 text-gray-600 hover:text-walnut-brown hover:bg-sand/20 rounded-md transition-colors"
                            title="Edit Product"
                          >
                            <Edit3 className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(product._id, product.title)}
                            disabled={deletingId === product._id}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                            title="Delete Product"
                          >
                            {deletingId === product._id ? (
                              <Loader2 className="w-4 h-4 animate-spin text-red-600" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
