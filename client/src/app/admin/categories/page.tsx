'use client';
import { useEffect, useState } from 'react';
import { Plus, Edit3, Trash2, Loader2, FolderTree } from 'lucide-react';
import { api } from '@/lib/axios';
import ImageUploader from '@/components/admin/ImageUploader';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    image: '',
    parentCategory: '',
    isActive: true,
  });

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await api.get('/categories?includeInactive=true');
      if (res.data?.data) {
        setCategories(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load categories', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpenModal = (category?: any) => {
    if (category) {
      setEditingId(category._id);
      setFormData({
        name: category.name || '',
        slug: category.slug || '',
        description: category.description || '',
        image: category.image || '',
        parentCategory: category.parentCategory?._id || category.parentCategory || '',
        isActive: category.isActive ?? true,
      });
    } else {
      setEditingId(null);
      setFormData({
        name: '',
        slug: '',
        description: '',
        image: '',
        parentCategory: '',
        isActive: true,
      });
    }
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.image) {
      alert('Category Name and Image are required.');
      return;
    }

    setSaving(true);
    try {
      if (editingId) {
        await api.put(`/categories/${editingId}`, formData);
      } else {
        await api.post('/categories', formData);
      }
      setShowModal(false);
      fetchCategories();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to save category');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete category "${name}"?`)) return;
    try {
      await api.delete(`/categories/${id}`);
      fetchCategories();
    } catch (err) {
      alert('Failed to delete category.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-charcoal">Categories Management</h1>
          <p className="text-sm text-gray-500">Organize storefront navigation and parent/sub-category structures.</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-walnut-brown text-white rounded-md hover:bg-opacity-90 transition-all font-medium text-sm shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Add Category
        </button>
      </div>

      <div className="bg-white rounded-xl border border-sand/50 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 flex justify-center items-center text-walnut-brown gap-3">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span className="text-sm font-medium">Loading categories...</span>
          </div>
        ) : categories.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <FolderTree className="w-10 h-10 mx-auto mb-3 text-gray-300" />
            <p className="text-base font-medium">No categories found</p>
            <p className="text-xs text-gray-400 mt-1">Click "Add Category" to create your first product category.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 border-b border-sand/50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3.5">Category</th>
                  <th className="px-6 py-3.5">Slug</th>
                  <th className="px-6 py-3.5">Parent Category</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {categories.map((cat) => (
                  <tr key={cat._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 flex items-center gap-3">
                      <img
                        src={cat.image || '/placeholder.jpg'}
                        alt={cat.name}
                        className="w-10 h-10 rounded-lg object-cover border border-sand bg-gray-100"
                      />
                      <div>
                        <p className="font-semibold text-charcoal">{cat.name}</p>
                        {cat.description && <p className="text-xs text-gray-400 line-clamp-1">{cat.description}</p>}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs font-mono text-gray-500">{cat.slug}</td>
                    <td className="px-6 py-4 text-gray-600">
                      {cat.parentCategory?.name ? (
                        <span className="bg-sand/30 text-charcoal px-2 py-0.5 rounded text-xs">
                          {cat.parentCategory.name}
                        </span>
                      ) : (
                        <span className="text-gray-400 text-xs">Top Level</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                        cat.isActive ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {cat.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenModal(cat)}
                          className="p-2 text-gray-600 hover:text-walnut-brown hover:bg-sand/20 rounded-md transition-colors"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(cat._id, cat.name)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Category Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 space-y-4 shadow-xl">
            <h2 className="text-lg font-serif font-bold text-charcoal">
              {editingId ? 'Edit Category' : 'Add New Category'}
            </h2>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Living Room Furniture"
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-walnut-brown"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Slug (Optional)</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="living-room-furniture"
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-walnut-brown"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Parent Category</label>
                <select
                  value={formData.parentCategory}
                  onChange={(e) => setFormData({ ...formData, parentCategory: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-sm bg-white focus:outline-none focus:border-walnut-brown"
                >
                  <option value="">None (Top-Level Category)</option>
                  {categories
                    .filter((c) => c._id !== editingId)
                    .map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Short overview of items in this category..."
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-walnut-brown"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Category Banner Image *</label>
                <ImageUploader
                  value={formData.image ? [formData.image] : []}
                  onChange={(urls) => setFormData({ ...formData, image: urls[0] || '' })}
                  multiple={false}
                  folder="homedecor/categories"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActiveCat"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="rounded border-gray-300 text-walnut-brown focus:ring-walnut-brown"
                />
                <label htmlFor="isActiveCat" className="text-xs font-medium text-charcoal">
                  Visible on Storefront Navigation
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-charcoal rounded-lg text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-5 py-2 bg-walnut-brown hover:bg-opacity-90 text-white rounded-lg text-sm font-medium shadow-sm"
                >
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
