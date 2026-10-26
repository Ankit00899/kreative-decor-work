import React, { useRef, useState } from 'react';
import { Plus, X, Upload, Loader2, Image as ImageIcon } from 'lucide-react';
import { compressImageFile } from '../../utils/imageCompressor';

interface MultiImageUploadFieldProps {
  images: string[];
  onChange: (images: string[]) => void;
  label?: string;
  helperText?: string;
  maxImages?: number;
}

export const MultiImageUploadField: React.FC<MultiImageUploadFieldProps> = ({
  images,
  onChange,
  label = 'Additional Gallery Photos',
  helperText = 'Upload extra photos showing close-up details, angles, or past client setups',
  maxImages = 6,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList | File[]) => {
    setIsUploading(true);
    const newImages = [...images];

    for (let i = 0; i < files.length; i++) {
      if (newImages.length >= maxImages) break;
      const file = files[i];
      if (file.type.startsWith('image/')) {
        try {
          const compressed = await compressImageFile(file);
          newImages.push(compressed);
        } catch (e) {
          console.error('Failed to compress file', e);
        }
      }
    }

    onChange(newImages);
    setIsUploading(false);
  };

  const handleAddUrl = () => {
    if (urlInput.trim() && images.length < maxImages) {
      onChange([...images, urlInput.trim()]);
      setUrlInput('');
      setShowUrlInput(false);
    }
  };

  const removeImage = (index: number) => {
    const updated = images.filter((_, i) => i !== index);
    onChange(updated);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-gray-800">
          {label} ({images.length}/{maxImages})
        </label>
        {images.length < maxImages && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowUrlInput(!showUrlInput)}
              className="text-[11px] text-[#701F3D] hover:underline font-medium cursor-pointer"
            >
              {showUrlInput ? 'Hide URL input' : '+ Add via URL'}
            </button>
          </div>
        )}
      </div>

      {helperText && <p className="text-[11px] text-gray-500">{helperText}</p>}

      {showUrlInput && (
        <div className="flex gap-2 p-2 bg-gray-50 rounded-xl border border-gray-200">
          <input
            type="url"
            placeholder="Paste photo URL (https://...)"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-gray-300 bg-white"
          />
          <button
            type="button"
            onClick={handleAddUrl}
            className="px-3 py-1.5 bg-[#701F3D] text-white text-xs font-bold rounded-lg cursor-pointer"
          >
            Add
          </button>
        </div>
      )}

      {/* Grid of Images */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 pt-1">
        {images.map((img, idx) => (
          <div
            key={idx}
            className="relative aspect-square rounded-xl overflow-hidden border border-gray-200 bg-gray-100 group shadow-2xs"
          >
            <img
              src={img}
              alt={`Photo ${idx + 1}`}
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={() => removeImage(idx)}
              className="absolute top-1 right-1 p-1 rounded-full bg-red-600 text-white shadow-md hover:bg-red-700 opacity-90 hover:opacity-100 cursor-pointer"
              title="Remove this photo"
            >
              <X className="w-3 h-3" />
            </button>
            <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-black/60 text-[9px] font-bold text-white">
              #{idx + 1}
            </span>
          </div>
        ))}

        {/* Upload Button */}
        {images.length < maxImages && (
          <button
            type="button"
            disabled={isUploading}
            onClick={() => fileInputRef.current?.click()}
            className="aspect-square rounded-xl border-2 border-dashed border-gray-300 hover:border-[#701F3D] hover:bg-[#F8E7EC]/30 flex flex-col items-center justify-center gap-1 text-gray-500 hover:text-[#701F3D] transition-all cursor-pointer p-2 text-center"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin text-[#701F3D]" />
                <span className="text-[10px] font-bold">Uploading...</span>
              </>
            ) : (
              <>
                <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center">
                  <Plus className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-bold leading-tight">Add Photo</span>
              </>
            )}
          </button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={(e) => {
          if (e.target.files) {
            handleFiles(e.target.files);
          }
        }}
        className="hidden"
      />
    </div>
  );
};
