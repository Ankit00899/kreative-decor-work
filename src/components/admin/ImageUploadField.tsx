import React, { useState, useRef } from 'react';
import {
  Upload,
  Link as LinkIcon,
  Sparkles,
  X,
  Check,
  RefreshCw,
  Image as ImageIcon,
  Loader2,
} from 'lucide-react';
import { compressImageFile } from '../../utils/imageCompressor';

interface ImageUploadFieldProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  required?: boolean;
  aspectRatio?: 'square' | 'video' | 'banner';
  helperText?: string;
}

const CURATED_SAMPLE_IMAGES = [
  {
    name: 'Luxury Ring Arch Birthday',
    category: 'Birthday',
    url: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Romantic Candlelight & Rose Room',
    category: 'Romantic',
    url: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Grand Royal Wedding Mandap',
    category: 'Wedding',
    url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Dreamy Pastel Baby Shower',
    category: 'Baby Shower',
    url: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Golden Anniversary Floral Setup',
    category: 'Anniversary',
    url: 'https://images.unsplash.com/photo-1464349153735-7db50ed83c84?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Chrome & Pastel Balloon Garland',
    category: 'Balloon',
    url: 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Elegant Welcome Easel Board',
    category: 'Props',
    url: 'https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Neon Sign & Sequin Wall',
    category: 'Stage',
    url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80',
  },
];

export const ImageUploadField: React.FC<ImageUploadFieldProps> = ({
  value,
  onChange,
  label = 'Decoration Photo',
  required = false,
  aspectRatio = 'video',
  helperText,
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'url' | 'samples'>('upload');
  const [urlInput, setUrlInput] = useState(value && !value.startsWith('data:') ? value : '');
  const [isCompressing, setIsCompressing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setUploadError('Please choose a valid image file (JPG, PNG, WebP).');
      return;
    }
    setUploadError(null);
    setIsCompressing(true);
    try {
      const compressed = await compressImageFile(file);
      onChange(compressed);
    } catch (err) {
      setUploadError('Failed to process image. Please try another image.');
    } finally {
      setIsCompressing(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const applyUrl = () => {
    if (urlInput.trim()) {
      onChange(urlInput.trim());
      setUploadError(null);
    }
  };

  const clearImage = () => {
    onChange('');
    setUrlInput('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const aspectClass =
    aspectRatio === 'square'
      ? 'aspect-square'
      : aspectRatio === 'banner'
      ? 'aspect-[21/9]'
      : 'aspect-[16/9]';

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-gray-800">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        {value && (
          <button
            type="button"
            onClick={clearImage}
            className="text-[11px] text-red-600 hover:text-red-800 font-medium flex items-center gap-1 cursor-pointer"
          >
            <X className="w-3 h-3" />
            <span>Remove Photo</span>
          </button>
        )}
      </div>

      {helperText && <p className="text-[11px] text-gray-500">{helperText}</p>}

      {/* Current Image Preview */}
      {value ? (
        <div className="relative rounded-2xl overflow-hidden border-2 border-[#D6B36A]/40 bg-gray-900 group shadow-md">
          <div className={`w-full ${aspectClass} overflow-hidden bg-gray-950 flex items-center justify-center`}>
            <img
              src={value}
              alt="Uploaded preview"
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>

          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 bg-white text-gray-900 rounded-xl text-xs font-bold shadow-lg hover:bg-gray-100 flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5 text-[#701F3D]" />
              <span>Change Photo</span>
            </button>
            <button
              type="button"
              onClick={clearImage}
              className="px-3 py-1.5 bg-red-600 text-white rounded-xl text-xs font-bold shadow-lg hover:bg-red-700 flex items-center gap-1.5 cursor-pointer"
            >
              <TrashIcon />
              <span>Delete</span>
            </button>
          </div>

          <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-xs text-white text-[10px] font-medium flex items-center gap-1.5">
            <Check className="w-3 h-3 text-emerald-400" />
            <span>{value.startsWith('data:') ? 'Custom Upload (Saved in browser)' : 'Live Image URL'}</span>
          </div>
        </div>
      ) : (
        /* Empty / Upload State */
        <div className="rounded-2xl border border-gray-200 bg-gray-50/70 p-3 space-y-3">
          {/* Tabs */}
          <div className="flex rounded-xl bg-gray-200/70 p-1 text-[11px] font-semibold text-gray-600">
            <button
              type="button"
              onClick={() => setActiveTab('upload')}
              className={`flex-1 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'upload'
                  ? 'bg-white text-[#701F3D] shadow-xs font-bold'
                  : 'hover:text-gray-900'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload from Device</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('url')}
              className={`flex-1 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'url'
                  ? 'bg-white text-[#701F3D] shadow-xs font-bold'
                  : 'hover:text-gray-900'
              }`}
            >
              <LinkIcon className="w-3.5 h-3.5" />
              <span>Paste Image URL</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('samples')}
              className={`flex-1 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'samples'
                  ? 'bg-white text-[#701F3D] shadow-xs font-bold'
                  : 'hover:text-gray-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#D6B36A]" />
              <span>Stock Ideas</span>
            </button>
          </div>

          {/* Tab 1: Upload from Device */}
          {activeTab === 'upload' && (
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all ${
                dragActive
                  ? 'border-[#701F3D] bg-[#F8E7EC]/40 scale-[1.01]'
                  : 'border-gray-300 hover:border-[#D6B36A] hover:bg-white'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />

              {isCompressing ? (
                <div className="py-4 flex flex-col items-center justify-center gap-2">
                  <Loader2 className="w-6 h-6 text-[#701F3D] animate-spin" />
                  <p className="text-xs font-semibold text-gray-700">Compressing & optimizing photo...</p>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <div className="w-10 h-10 rounded-full bg-[#F8E7EC] text-[#701F3D] flex items-center justify-center mx-auto">
                    <Upload className="w-5 h-5" />
                  </div>
                  <p className="text-xs font-bold text-gray-800">
                    Click to browse or drag & drop photo here
                  </p>
                  <p className="text-[10px] text-gray-500">
                    Supports JPG, PNG, WebP (from mobile camera, gallery, or computer)
                  </p>
                  <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-semibold border border-emerald-200">
                    ✓ Automatically optimized for instant loading
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Paste Image URL */}
          {activeTab === 'url' && (
            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="https://example.com/decoration-photo.jpg"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      applyUrl();
                    }
                  }}
                  className="flex-1 px-3 py-2 text-xs rounded-xl border border-gray-300 focus:border-[#701F3D] focus:outline-hidden bg-white"
                />
                <button
                  type="button"
                  onClick={applyUrl}
                  className="px-3.5 py-2 bg-[#701F3D] hover:bg-[#52132A] text-white text-xs font-bold rounded-xl cursor-pointer"
                >
                  Apply
                </button>
              </div>
              <p className="text-[10px] text-gray-400">
                You can paste image links from Unsplash, Cloudinary, Imgur, or any hosting URL.
              </p>
            </div>
          )}

          {/* Tab 3: Curated Stock Decor */}
          {activeTab === 'samples' && (
            <div className="space-y-2">
              <p className="text-[10px] text-gray-500">
                Click any pre-curated high-res setup to use it instantly:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 max-h-48 overflow-y-auto p-1">
                {CURATED_SAMPLE_IMAGES.map((sample, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      onChange(sample.url);
                      setUploadError(null);
                    }}
                    className="relative aspect-video rounded-lg overflow-hidden border border-gray-200 hover:border-[#701F3D] hover:scale-105 transition-all text-left group cursor-pointer"
                  >
                    <img
                      src={sample.url}
                      alt={sample.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-1">
                      <span className="text-[9px] text-white font-medium line-clamp-1">
                        {sample.name}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {uploadError && (
            <p className="text-[11px] text-red-600 font-medium">{uploadError}</p>
          )}
        </div>
      )}

      {/* Hidden file input for when replacing */}
      {value && (
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      )}
    </div>
  );
};

const TrashIcon = () => (
  <svg
    className="w-3.5 h-3.5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
    />
  </svg>
);
