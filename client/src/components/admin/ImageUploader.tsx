'use client';
import { useState, useRef } from 'react';
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react';
import { api } from '@/lib/axios';

interface ImageUploaderProps {
  value: string[];
  onChange: (urls: string[]) => void;
  multiple?: boolean;
  maxFiles?: number;
  folder?: string;
  label?: string;
}

export default function ImageUploader({
  value = [],
  onChange,
  multiple = true,
  maxFiles = 5,
  folder = 'homedecor/products',
  label = 'Product Images',
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList | File[]) => {
    setError(null);
    const selectedFiles = Array.from(files).filter(f => f.type.startsWith('image/'));
    if (selectedFiles.length === 0) {
      setError('Please select valid image files (JPEG, PNG, WebP).');
      return;
    }

    if (!multiple && selectedFiles.length > 1) {
      setError('Only single image allowed');
      return;
    }

    if (value.length + selectedFiles.length > maxFiles) {
      setError(`Maximum ${maxFiles} images allowed.`);
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('folder', folder);
    selectedFiles.forEach((file) => formData.append('images', file));

    try {
      const res = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data.success) {
        const uploadedData = Array.isArray(res.data.data) ? res.data.data : [res.data.data];
        const newUrls = uploadedData.map((item: any) => item.url);

        if (multiple) {
          onChange([...value, ...newUrls]);
        } else {
          onChange([newUrls[0]]);
        }
      }
    } catch (err: any) {
      console.error('Upload Error:', err);
      setError(err.response?.data?.message || 'Failed to upload images. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = (urlToRemove: string) => {
    onChange(value.filter((url) => url !== urlToRemove));
  };

  return (
    <div className="space-y-3">
      {label && <label className="block text-sm font-medium text-charcoal">{label}</label>}

      {/* Drag & Drop Zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          if (e.dataTransfer.files) handleFiles(e.dataTransfer.files);
        }}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-colors ${
          dragOver ? 'border-walnut-brown bg-sand/30' : 'border-gray-300 hover:border-walnut-brown bg-white'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple={multiple}
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
          className="hidden"
        />

        {uploading ? (
          <div className="flex flex-col items-center gap-2 text-walnut-brown">
            <Loader2 className="w-8 h-8 animate-spin" />
            <span className="text-sm font-medium">Uploading images to Cloudinary...</span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 text-gray-500">
            <Upload className="w-8 h-8 text-walnut-brown/70" />
            <p className="text-sm font-medium text-charcoal">
              Click to upload or drag & drop images
            </p>
            <p className="text-xs text-gray-400">
              PNG, JPG, WEBP up to 10MB {multiple ? `(Max ${maxFiles} files)` : ''}
            </p>
          </div>
        )}
      </div>

      {error && <p className="text-xs text-red-600 font-medium">{error}</p>}

      {/* Image Preview Grid */}
      {value.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
          {value.map((url, idx) => (
            <div key={idx} className="relative group rounded-md overflow-hidden border border-sand bg-gray-50 aspect-square">
              <img src={url} alt={`Upload ${idx + 1}`} className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); handleRemove(url); }}
                className="absolute top-1.5 right-1.5 p-1 bg-red-600 text-white rounded-full opacity-90 hover:opacity-100 transition-opacity"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
