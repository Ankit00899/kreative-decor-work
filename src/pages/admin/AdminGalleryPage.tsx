import React, { useState } from 'react';
import {
  Image as ImageIcon,
  Plus,
  Trash2,
  MapPin,
  X,
  CheckCircle2,
  Edit2,
  Search,
  Filter,
  Sparkles,
  Camera,
} from 'lucide-react';
import { AdminLayout } from '../../components/AdminLayout';
import { useApp } from '../../context/AppContext';
import { GalleryItem } from '../../types';
import { ImageUploadField } from '../../components/admin/ImageUploadField';

export const AdminGalleryPage: React.FC = () => {
  const { gallery, addGalleryItem, updateGalleryItem, deleteGalleryItem } = useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    category: 'birthday',
    categoryLabel: 'Birthday',
    imageUrl: '',
    description: '',
    eventLocation: 'Gurgaon Sector 50, Delhi NCR',
    isFeatured: true,
  });

  const categoryLabels: Record<string, string> = {
    birthday: 'Birthday',
    anniversary: 'Anniversary',
    romantic: 'Romantic Room',
    wedding: 'Wedding Stage',
    'baby-shower': 'Baby Shower',
    balloon: 'Balloon Decor',
    customized: 'Customized Events',
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const openAddModal = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      category: 'birthday',
      categoryLabel: 'Birthday',
      imageUrl: '',
      description: '',
      eventLocation: 'Gurgaon, Delhi NCR',
      isFeatured: true,
    });
    setModalOpen(true);
  };

  const openEditModal = (item: GalleryItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      category: item.category,
      categoryLabel: item.categoryLabel,
      imageUrl: item.imageUrl,
      description: item.description,
      eventLocation: item.eventLocation || 'Delhi NCR',
      isFeatured: item.isFeatured ?? true,
    });
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.imageUrl) {
      alert('Please provide a title and upload or select a photo.');
      return;
    }

    if (editingItem) {
      updateGalleryItem({
        ...editingItem,
        title: formData.title.trim(),
        category: formData.category,
        categoryLabel: formData.categoryLabel,
        imageUrl: formData.imageUrl,
        description: formData.description.trim(),
        eventLocation: formData.eventLocation.trim(),
        isFeatured: formData.isFeatured,
      });
      showToast(`Updated photo "${formData.title}"!`);
    } else {
      addGalleryItem({
        title: formData.title.trim(),
        category: formData.category,
        categoryLabel: formData.categoryLabel,
        imageUrl: formData.imageUrl,
        description: formData.description.trim(),
        eventLocation: formData.eventLocation.trim(),
        isFeatured: formData.isFeatured,
      });
      showToast(`Added new photo to gallery!`);
    }

    setModalOpen(false);
  };

  const filtered = gallery.filter((item) => {
    if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        (item.eventLocation && item.eventLocation.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <AdminLayout pageTitle="Event Gallery & Portfolio Manager">
      <div className="space-y-6">
        {toastMessage && (
          <div className="fixed top-5 right-5 z-50 p-4 bg-emerald-600 text-white rounded-2xl shadow-xl flex items-center gap-2 text-xs font-bold animate-bounce">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Action Header */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-serif text-lg font-bold text-[#29252A] flex items-center gap-2">
              <Camera className="w-5 h-5 text-[#D6B36A]" />
              <span>Live Portfolio Showcase ({gallery.length} Photos)</span>
            </h3>
            <p className="text-xs text-gray-500">
              Upload real client event setups directly from your phone/computer. Displays instantly on the public website.
            </p>
          </div>

          <button
            onClick={openAddModal}
            className="w-full sm:w-auto px-4 py-2.5 bg-[#701F3D] hover:bg-[#52132A] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Upload New Photo (No Code Needed)</span>
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-gray-200 text-xs">
          <div className="relative w-full sm:w-72">
            <input
              type="text"
              placeholder="Search by caption, venue, city..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-300 focus:border-[#701F3D] focus:outline-hidden"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            <span className="text-gray-400 text-[11px] font-semibold shrink-0">Filter Category:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 rounded-xl border border-gray-300 bg-white font-medium text-xs focus:border-[#701F3D] focus:outline-hidden"
            >
              <option value="all">All Events ({gallery.length})</option>
              <option value="birthday">Birthday</option>
              <option value="anniversary">Anniversary</option>
              <option value="romantic">Romantic Room</option>
              <option value="wedding">Wedding Stage</option>
              <option value="baby-shower">Baby Shower</option>
              <option value="balloon">Balloon Decor</option>
              <option value="customized">Customized Events</option>
            </select>
          </div>
        </div>

        {/* Gallery Grid */}
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center text-gray-400 space-y-3">
            <ImageIcon className="w-10 h-10 mx-auto text-gray-300" />
            <p className="font-semibold text-gray-600">No photos found matching your search.</p>
            <button
              onClick={openAddModal}
              className="px-4 py-2 bg-[#701F3D] text-white rounded-xl text-xs font-bold"
            >
              Upload Photo Now
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between group"
              >
                <div className="relative aspect-4/3 bg-gray-900 overflow-hidden">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-[#701F3D]/90 text-white text-[10px] font-bold backdrop-blur-xs shadow-xs">
                    {item.categoryLabel}
                  </span>

                  {item.isFeatured && (
                    <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-[#D6B36A] text-[#29252A] text-[9px] font-bold shadow-xs">
                      Featured
                    </span>
                  )}

                  {/* Hover Controls */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                    <button
                      onClick={() => openEditModal(item)}
                      className="p-2 rounded-xl bg-white text-gray-900 hover:bg-[#F8E7EC] hover:text-[#701F3D] shadow-md cursor-pointer transition-colors"
                      title="Edit Photo Details"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(`Delete photo "${item.title}"?`)) {
                          deleteGalleryItem(item.id);
                          showToast(`Deleted photo "${item.title}"`);
                        }
                      }}
                      className="p-2 rounded-xl bg-red-600 text-white hover:bg-red-700 shadow-md cursor-pointer transition-colors"
                      title="Delete Photo"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="p-4 space-y-1.5">
                  <h4 className="font-serif font-bold text-sm text-gray-900 line-clamp-1">
                    {item.title}
                  </h4>
                  <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                    {item.description || 'No caption provided.'}
                  </p>
                  {item.eventLocation && (
                    <p className="text-[11px] text-[#B9944A] flex items-center gap-1 pt-1 font-semibold">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{item.eventLocation}</span>
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal: Add / Edit Gallery Photo */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-gray-200 my-8 max-h-[90vh] overflow-y-auto space-y-5">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div>
                  <h3 className="font-serif text-xl font-bold text-[#701F3D]">
                    {editingItem ? 'Edit Portfolio Photo' : 'Upload Portfolio Photo'}
                  </h3>
                  <p className="text-xs text-gray-500">
                    Choose an image from your computer or phone gallery.
                  </p>
                </div>
                <button
                  onClick={() => setModalOpen(false)}
                  className="p-1.5 text-gray-400 hover:text-gray-700 rounded-xl hover:bg-gray-100 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-4 text-xs">
                {/* Photo Upload Component */}
                <ImageUploadField
                  label="Event Photograph"
                  required
                  aspectRatio="video"
                  value={formData.imageUrl}
                  onChange={(url) => setFormData({ ...formData, imageUrl: url })}
                  helperText="Select or drag a decoration setup image from your device."
                />

                <div>
                  <label className="block font-semibold text-gray-800 mb-1">
                    Photo Title / Event Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ring Arch Birthday setup at Grand Ballroom"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-[#701F3D] focus:outline-hidden text-xs"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-gray-800 mb-1">
                      Event Category *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => {
                        const val = e.target.value;
                        setFormData({
                          ...formData,
                          category: val,
                          categoryLabel: categoryLabels[val] || val,
                        });
                      }}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-[#701F3D] focus:outline-hidden bg-white text-xs"
                    >
                      <option value="birthday">Birthday</option>
                      <option value="anniversary">Anniversary</option>
                      <option value="romantic">Romantic Room</option>
                      <option value="wedding">Wedding Stage</option>
                      <option value="baby-shower">Baby Shower</option>
                      <option value="balloon">Balloon Decor</option>
                      <option value="customized">Customized Events</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-800 mb-1">
                      Event Location / City
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. DLF Phase 5, Gurgaon"
                      value={formData.eventLocation}
                      onChange={(e) => setFormData({ ...formData, eventLocation: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-[#701F3D] focus:outline-hidden text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-gray-800 mb-1">
                    Caption & Description
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Write details about the theme, balloon colors, lighting..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-[#701F3D] focus:outline-hidden text-xs resize-none"
                  />
                </div>

                <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isFeatured}
                      onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                      className="w-4 h-4 rounded text-[#701F3D] focus:ring-[#701F3D]"
                    />
                    <span className="font-semibold text-gray-800">
                      Feature on Homepage Highlights Carousel
                    </span>
                  </label>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-gray-300 text-gray-600 font-bold hover:bg-gray-100 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[#701F3D] hover:bg-[#52132A] text-white font-bold shadow-md cursor-pointer flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{editingItem ? 'Save Updates' : 'Upload to Gallery'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};
