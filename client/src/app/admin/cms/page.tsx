'use client';
import { useEffect, useState } from 'react';
import { Image as ImageIcon, Save, Plus, Trash2, Loader2, Sparkles, Layout } from 'lucide-react';
import { api } from '@/lib/axios';
import ImageUploader from '@/components/admin/ImageUploader';

export default function AdminCmsPage() {
  const [blocks, setBlocks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<'hero' | 'banner'>('hero');

  const fetchBlocks = async () => {
    try {
      setLoading(true);
      const res = await api.get('/cms');
      if (res.data?.data) {
        setBlocks(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load CMS blocks', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlocks();
  }, []);

  const handleSaveBlock = async (blockData: any) => {
    try {
      setSavingId(blockData.blockId);
      const res = await api.post('/cms', blockData);
      if (res.data?.success) {
        setBlocks((prev) =>
          prev.some((b) => b.blockId === blockData.blockId)
            ? prev.map((b) => (b.blockId === blockData.blockId ? res.data.data : b))
            : [...prev, res.data.data]
        );
        alert('CMS content saved successfully!');
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to save block.');
    } finally {
      setSavingId(null);
    }
  };

  const handleDeleteBlock = async (blockId: string) => {
    if (!confirm('Are you sure you want to delete this block?')) return;
    try {
      await api.delete(`/cms/${blockId}`);
      setBlocks(blocks.filter((b) => b.blockId !== blockId));
    } catch (err) {
      alert('Failed to delete block.');
    }
  };

  const createNewSlide = () => {
    const newId = `hero-slide-${Date.now()}`;
    const newBlock = {
      blockId: newId,
      type: 'hero',
      title: 'Handcrafted Modern Elegance',
      subtitle: 'Premium Wooden & Upholstered Furniture',
      content: 'Transform your home with our bespoke artisan pieces.',
      mediaUrl: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1200',
      ctaText: 'Explore Collection',
      ctaLink: '/shop',
      isActive: true,
      order: blocks.length + 1,
    };
    handleSaveBlock(newBlock);
  };

  const filteredBlocks = blocks.filter((b) => b.type === activeTab);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-charcoal">CMS & Storefront Banner Editor</h1>
          <p className="text-sm text-gray-500">Edit hero banners, promotional section slides, and homepage text without code changes.</p>
        </div>
        <button
          onClick={createNewSlide}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-walnut-brown text-white rounded-md hover:bg-opacity-90 transition-all font-medium text-sm shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Add Hero Slide
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-sand/50 pb-2">
        <button
          onClick={() => setActiveTab('hero')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'hero' ? 'bg-walnut-brown text-white' : 'bg-white text-charcoal/70 hover:bg-sand/30'
          }`}
        >
          <Layout className="w-4 h-4" /> Hero Banners
        </button>
        <button
          onClick={() => setActiveTab('banner')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'banner' ? 'bg-walnut-brown text-white' : 'bg-white text-charcoal/70 hover:bg-sand/30'
          }`}
        >
          <Sparkles className="w-4 h-4" /> Promo Banners
        </button>
      </div>

      {/* Block List */}
      {loading ? (
        <div className="p-12 flex justify-center items-center text-walnut-brown gap-3">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span className="text-sm font-medium">Loading CMS content...</span>
        </div>
      ) : filteredBlocks.length === 0 ? (
        <div className="bg-white p-12 rounded-xl border border-sand/50 text-center text-gray-500">
          <ImageIcon className="w-10 h-10 mx-auto mb-3 text-gray-300" />
          <p className="text-base font-medium">No {activeTab} slides created yet</p>
          <button
            onClick={createNewSlide}
            className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-walnut-brown text-white text-xs rounded-md font-medium"
          >
            <Plus className="w-3.5 h-3.5" /> Create First Slide
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredBlocks.map((block) => (
            <CmsBlockCard
              key={block.blockId}
              block={block}
              saving={savingId === block.blockId}
              onSave={handleSaveBlock}
              onDelete={() => handleDeleteBlock(block.blockId)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function CmsBlockCard({ block, saving, onSave, onDelete }: { block: any; saving: boolean; onSave: (data: any) => void; onDelete: () => void }) {
  const [data, setData] = useState(block);

  useEffect(() => {
    setData(block);
  }, [block]);

  return (
    <div className="bg-white p-6 rounded-xl border border-sand/50 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b pb-3">
        <span className="font-mono text-xs font-semibold text-walnut-brown uppercase">{data.blockId}</span>
        <button
          onClick={onDelete}
          className="text-gray-400 hover:text-red-600 p-1 rounded transition-colors"
          title="Delete Slide"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Slide Title</label>
            <input
              type="text"
              value={data.title || ''}
              onChange={(e) => setData({ ...data, title: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-walnut-brown"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Subtitle / Tagline</label>
            <input
              type="text"
              value={data.subtitle || ''}
              onChange={(e) => setData({ ...data, subtitle: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-walnut-brown"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">CTA Button Text</label>
              <input
                type="text"
                value={data.ctaText || ''}
                onChange={(e) => setData({ ...data, ctaText: e.target.value })}
                placeholder="Explore Now"
                className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-walnut-brown"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">CTA Target URL</label>
              <input
                type="text"
                value={data.ctaLink || ''}
                onChange={(e) => setData({ ...data, ctaLink: e.target.value })}
                placeholder="/shop"
                className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-walnut-brown"
              />
            </div>
          </div>
        </div>

        {/* Media Uploader */}
        <div className="space-y-3">
          <label className="block text-xs font-semibold text-gray-600">Banner / Background Image</label>
          <ImageUploader
            value={data.mediaUrl ? [data.mediaUrl] : []}
            onChange={(urls) => setData({ ...data, mediaUrl: urls[0] || '' })}
            multiple={false}
            folder="homedecor/cms"
          />
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 border-t">
        <label className="flex items-center gap-2 text-xs font-medium text-charcoal cursor-pointer">
          <input
            type="checkbox"
            checked={data.isActive}
            onChange={(e) => setData({ ...data, isActive: e.target.checked })}
            className="rounded border-gray-300 text-walnut-brown focus:ring-walnut-brown"
          />
          Visible on Live Site
        </label>

        <button
          onClick={() => onSave(data)}
          disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2 bg-walnut-brown text-white text-xs font-semibold rounded-lg hover:bg-opacity-90 transition-colors shadow-sm"
        >
          {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />} Save Slide
        </button>
      </div>
    </div>
  );
}
