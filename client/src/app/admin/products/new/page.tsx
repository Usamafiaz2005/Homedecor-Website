'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2, Save } from 'lucide-react';
import { api } from '@/lib/axios';
import ImageUploader from '@/components/admin/ImageUploader';

export default function AddProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<any[]>([]);
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
    totalStock: '10',
    tags: '',
    isFeatured: false,
    isBestSeller: false,
    isNewArrival: true,
    isFlashSale: false,
    // Primary Variant
    color: 'Default',
    material: 'Wood',
    sku: '',
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/categories');
        if (res.data?.data) {
          setCategories(res.data.data);
          if (res.data.data.length > 0) {
            setFormData((prev) => ({ ...prev, category: res.data.data[0]._id }));
          }
        }
      } catch (err) {
        console.error('Failed to fetch categories', err);
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.title || !formData.shortDescription || !formData.fullDescription || !formData.category || !formData.basePricePKR) {
      setError('Please fill in all required fields (Title, Descriptions, Category, Base Price)');
      return;
    }

    if (formData.images.length === 0) {
      setError('Please upload at least one product image');
      return;
    }

    setSaving(true);

    try {
      const generatedSku = formData.sku || `SKU-${Date.now().toString().slice(-6)}`;
      const payload = {
        ...formData,
        basePricePKR: Number(formData.basePricePKR),
        discountedPricePKR: formData.discountedPricePKR ? Number(formData.discountedPricePKR) : undefined,
        totalStock: Number(formData.totalStock) || 0,
        thumbnail: formData.images[0], // First image is thumbnail
        tags: formData.tags ? formData.tags.split(',').map((t) => t.trim()) : [],
        variants: [
          {
            color: formData.color || 'Standard',
            material: formData.material || 'Standard',
            stock: Number(formData.totalStock) || 10,
            sku: generatedSku,
            image: formData.images[0],
          },
        ],
      };

      const res = await api.post('/products', payload);
      if (res.data?.success) {
        router.push('/admin/products');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to create product.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/products"
            className="p-2 text-gray-500 hover:text-charcoal hover:bg-white rounded-lg border border-sand/50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-serif font-bold text-charcoal">Add New Product</h1>
            <p className="text-sm text-gray-500">Create a new item in your catalog</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Main Details */}
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
                placeholder="e.g. Minimalist Velvet Armchair"
                className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-walnut-brown"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Custom Slug (Optional)</label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="minimalist-velvet-armchair"
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
              placeholder="Brief summary for product card..."
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
              placeholder="Detailed specifications, handcrafted materials, care instructions..."
              className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-walnut-brown"
            />
          </div>
        </div>

        {/* Pricing & Category */}
        <div className="bg-white p-6 rounded-xl border border-sand/50 shadow-sm space-y-4">
          <h2 className="text-lg font-serif font-semibold text-charcoal border-b pb-2">Pricing & Category</h2>

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
                placeholder="25000"
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
                placeholder="21999"
                className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-walnut-brown"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Stock Quantity</label>
              <input
                type="number"
                min={0}
                value={formData.totalStock}
                onChange={(e) => setFormData({ ...formData, totalStock: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-walnut-brown"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">SKU Code</label>
              <input
                type="text"
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                placeholder="e.g. ARM-VEL-001"
                className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-walnut-brown"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Tags (Comma-separated)</label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder="velvet, luxury, armchair"
                className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-walnut-brown"
              />
            </div>
          </div>
        </div>

        {/* Cloudinary Image Upload Section */}
        <div className="bg-white p-6 rounded-xl border border-sand/50 shadow-sm space-y-4">
          <h2 className="text-lg font-serif font-semibold text-charcoal border-b pb-2">Media & Cloudinary Upload</h2>
          <ImageUploader
            value={formData.images}
            onChange={(urls) => setFormData({ ...formData, images: urls })}
            multiple={true}
            maxFiles={6}
            folder="homedecor/products"
            label="Upload Product Gallery Images (First image will be the primary thumbnail)"
          />
        </div>

        {/* Marketing Flags */}
        <div className="bg-white p-6 rounded-xl border border-sand/50 shadow-sm space-y-4">
          <h2 className="text-lg font-serif font-semibold text-charcoal border-b pb-2">Display Settings</h2>
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

        {/* Submit */}
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
                <Loader2 className="w-4 h-4 animate-spin" /> Saving Product...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" /> Save Product
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
