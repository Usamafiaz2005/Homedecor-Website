'use client';
import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2, Save } from 'lucide-react';
import { api } from '@/lib/axios';
import ImageUploader from '@/components/admin/ImageUploader';

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    shortDescription: '',
    fullDescription: '',
    category: '',
    brand: 'Homedecor',
    basePricePKR: '',
    discountedPricePKR: '',
    thumbnail: '',
    images: [] as string[],
    totalStock: '0',
    tags: '',
    isFeatured: false,
    isBestSeller: false,
    isNewArrival: false,
    isFlashSale: false,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [catRes, prodRes] = await Promise.all([
          api.get('/categories'),
          api.get(`/products/${id}`),
        ]);

        if (catRes.data?.data) {
          setCategories(catRes.data.data);
        }

        const product = prodRes.data?.data?.product;
        if (product) {
          setFormData({
            title: product.title || '',
            slug: product.slug || '',
            shortDescription: product.shortDescription || '',
            fullDescription: product.fullDescription || '',
            category: product.category?._id || product.category || '',
            brand: product.brand || 'Homedecor',
            basePricePKR: product.basePricePKR?.toString() || '',
            discountedPricePKR: product.discountedPricePKR?.toString() || '',
            thumbnail: product.thumbnail || '',
            images: product.images || (product.thumbnail ? [product.thumbnail] : []),
            totalStock: product.totalStock?.toString() || '0',
            tags: product.tags ? product.tags.join(', ') : '',
            isFeatured: !!product.isFeatured,
            isBestSeller: !!product.isBestSeller,
            isNewArrival: !!product.isNewArrival,
            isFlashSale: !!product.isFlashSale,
          });
        }
      } catch (err: any) {
        console.error('Failed to load product data', err);
        setError('Failed to load product details.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);

    try {
      const payload = {
        ...formData,
        basePricePKR: Number(formData.basePricePKR),
        discountedPricePKR: formData.discountedPricePKR ? Number(formData.discountedPricePKR) : undefined,
        totalStock: Number(formData.totalStock) || 0,
        thumbnail: formData.images[0] || formData.thumbnail,
        tags: formData.tags ? formData.tags.split(',').map((t) => t.trim()) : [],
      };

      const res = await api.put(`/products/${id}`, payload);
      if (res.data?.success) {
        router.push('/admin/products');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to update product.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 flex justify-center items-center text-walnut-brown gap-3">
        <Loader2 className="w-6 h-6 animate-spin" />
        <span className="text-sm font-medium">Loading product editor...</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/products"
          className="p-2 text-gray-500 hover:text-charcoal hover:bg-white rounded-lg border border-sand/50 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-serif font-bold text-charcoal">Edit Product</h1>
          <p className="text-sm text-gray-500">Update product details, pricing, and media</p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white p-6 rounded-xl border border-sand/50 shadow-sm space-y-4">
          <h2 className="text-lg font-serif font-semibold text-charcoal border-b pb-2">General Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Product Title *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-walnut-brown"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Slug</label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-walnut-brown"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Short Description *</label>
            <input
              type="text"
              required
              maxLength={200}
              value={formData.shortDescription}
              onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-walnut-brown"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Full Description *</label>
            <textarea
              required
              rows={5}
              value={formData.fullDescription}
              onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-walnut-brown"
            />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-sand/50 shadow-sm space-y-4">
          <h2 className="text-lg font-serif font-semibold text-charcoal border-b pb-2">Pricing & Stock</h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Category *</label>
              <select
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg text-sm bg-white focus:outline-none focus:border-walnut-brown"
              >
                <option value="">Select Category</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Base Price (PKR) *</label>
              <input
                type="number"
                required
                min={0}
                value={formData.basePricePKR}
                onChange={(e) => setFormData({ ...formData, basePricePKR: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-walnut-brown"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Discounted Price (PKR)</label>
              <input
                type="number"
                min={0}
                value={formData.discountedPricePKR}
                onChange={(e) => setFormData({ ...formData, discountedPricePKR: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-walnut-brown"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Total Stock</label>
              <input
                type="number"
                min={0}
                value={formData.totalStock}
                onChange={(e) => setFormData({ ...formData, totalStock: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-walnut-brown"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Tags (Comma-separated)</label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-walnut-brown"
              />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-sand/50 shadow-sm space-y-4">
          <h2 className="text-lg font-serif font-semibold text-charcoal border-b pb-2">Media & Cloudinary Gallery</h2>
          <ImageUploader
            value={formData.images}
            onChange={(urls) => setFormData({ ...formData, images: urls })}
            multiple={true}
            maxFiles={6}
            folder="homedecor/products"
            label="Product Images"
          />
        </div>

        <div className="bg-white p-6 rounded-xl border border-sand/50 shadow-sm space-y-4">
          <h2 className="text-lg font-serif font-semibold text-charcoal border-b pb-2">Marketing Flags</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isFeatured}
                onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                className="rounded border-gray-300 text-walnut-brown focus:ring-walnut-brown"
              />
              Featured Product
            </label>
            <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isBestSeller}
                onChange={(e) => setFormData({ ...formData, isBestSeller: e.target.checked })}
                className="rounded border-gray-300 text-walnut-brown focus:ring-walnut-brown"
              />
              Best Seller
            </label>
            <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isNewArrival}
                onChange={(e) => setFormData({ ...formData, isNewArrival: e.target.checked })}
                className="rounded border-gray-300 text-walnut-brown focus:ring-walnut-brown"
              />
              New Arrival
            </label>
            <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isFlashSale}
                onChange={(e) => setFormData({ ...formData, isFlashSale: e.target.checked })}
                className="rounded border-gray-300 text-walnut-brown focus:ring-walnut-brown"
              />
              Flash Sale
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Link
            href="/admin/products"
            className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-charcoal rounded-lg text-sm font-medium transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-walnut-brown hover:bg-opacity-90 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Saving Changes...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" /> Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
