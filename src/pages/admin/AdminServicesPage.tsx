import React, { useState } from 'react';
import {
  Package,
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Star,
  Sparkles,
  Search,
  CheckCircle2,
  X,
  Copy,
  Clock,
  Layers,
  IndianRupee,
  ChevronDown,
  AlertCircle,
} from 'lucide-react';
import { AdminLayout } from '../../components/AdminLayout';
import { useApp } from '../../context/AppContext';
import { ServiceItem, ServiceAddon } from '../../types';
import { ImageUploadField } from '../../components/admin/ImageUploadField';
import { MultiImageUploadField } from '../../components/admin/MultiImageUploadField';

export const AdminServicesPage: React.FC = () => {
  const { services, addService, updateService, deleteService, formatPrice } = useApp();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: 'birthday',
    categoryLabel: 'Birthday Decoration',
    startingPrice: 2999,
    discountPrice: 3499,
    shortDescription: '',
    fullDescription: '',
    image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=1200&q=80',
    additionalImages: [] as string[],
    inclusions: '120 Pastel & Metallic Balloons\nCustom Foil Name Bunting\nWarm Fairy Lights String (20ft)\nFree onsite setup & dismantling by crew',
    customizationOptions: 'Pastel Blue & Silver, Blush Pink & Rose Gold, Royal Gold & Black',
    availableAddons: [
      { id: 'neon-sign', name: 'Happy Birthday Neon Sign Rental', price: 799 },
      { id: 'welcome-board', name: 'Personalized Welcome Easel Board', price: 499 },
    ] as ServiceAddon[],
    setupTimeHours: 2,
    idealFor: 'Indoor' as 'Indoor' | 'Outdoor' | 'Both',
    tier: 'Standard' as 'Budget-Friendly' | 'Standard' | 'Luxury' | 'Grand',
    isFeatured: true,
    isTrending: false,
    isBestSeller: false,
    isPublished: true,
  });

  // New Addon temp inputs
  const [newAddonName, setNewAddonName] = useState('');
  const [newAddonPrice, setNewAddonPrice] = useState(499);

  const categoryLabels: Record<string, string> = {
    birthday: 'Birthday Decoration',
    anniversary: 'Anniversary Decoration',
    wedding: 'Wedding Decoration',
    romantic: 'Romantic Room Decoration',
    balloon: 'Balloon Decoration',
    'baby-shower': 'Baby Shower Decoration',
    customized: 'Customized Events',
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const filtered = services.filter((s) => {
    if (selectedCategory !== 'all' && s.category !== selectedCategory) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        s.title.toLowerCase().includes(q) ||
        s.categoryLabel.toLowerCase().includes(q) ||
        s.shortDescription.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const openAddModal = () => {
    setEditingService(null);
    setFormData({
      title: '',
      slug: '',
      category: 'birthday',
      categoryLabel: 'Birthday Decoration',
      startingPrice: 2999,
      discountPrice: 3499,
      shortDescription: '',
      fullDescription: '',
      image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=1200&q=80',
      additionalImages: [],
      inclusions: '120 Pastel & Metallic Balloons\nCustom Foil Name Bunting\nWarm Fairy Lights String\nProfessional Onsite Setup',
      customizationOptions: 'Pastel Blue & Silver, Blush Pink & Rose Gold, Gold & Black',
      availableAddons: [
        { id: `addon-${Date.now()}-1`, name: 'Neon LED Light Sign', price: 799 },
        { id: `addon-${Date.now()}-2`, name: 'Cake Stand Table Pedestal', price: 499 },
      ],
      setupTimeHours: 2,
      idealFor: 'Indoor',
      tier: 'Standard',
      isFeatured: false,
      isTrending: false,
      isBestSeller: false,
      isPublished: true,
    });
    setModalOpen(true);
  };

  const openEditModal = (service: ServiceItem) => {
    setEditingService(service);
    setFormData({
      title: service.title,
      slug: service.slug,
      category: service.category,
      categoryLabel: service.categoryLabel,
      startingPrice: service.startingPrice,
      discountPrice: service.discountPrice || service.startingPrice,
      shortDescription: service.shortDescription,
      fullDescription: service.fullDescription,
      image: service.image,
      additionalImages: service.additionalImages || [],
      inclusions: service.inclusions.join('\n'),
      customizationOptions: service.customizationOptions.join(', '),
      availableAddons: service.availableAddons || [],
      setupTimeHours: service.setupTimeHours,
      idealFor: service.idealFor,
      tier: service.tier,
      isFeatured: service.isFeatured,
      isTrending: service.isTrending,
      isBestSeller: service.isBestSeller,
      isPublished: service.isPublished,
    });
    setModalOpen(true);
  };

  const handleDuplicate = (service: ServiceItem) => {
    const copyTitle = `${service.title} (Copy)`;
    const copySlug = `${service.slug}-copy-${Date.now().toString().slice(-4)}`;
    addService({
      ...service,
      title: copyTitle,
      slug: copySlug,
      isPublished: true,
    });
    showToast(`Duplicated "${service.title}" successfully!`);
  };

  const handleAddAddon = () => {
    if (!newAddonName.trim()) return;
    setFormData({
      ...formData,
      availableAddons: [
        ...formData.availableAddons,
        {
          id: `addon-${Date.now()}`,
          name: newAddonName.trim(),
          price: Number(newAddonPrice) || 0,
        },
      ],
    });
    setNewAddonName('');
    setNewAddonPrice(499);
  };

  const handleRemoveAddon = (addonId: string) => {
    setFormData({
      ...formData,
      availableAddons: formData.availableAddons.filter((a) => a.id !== addonId),
    });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      alert('Please enter a service title');
      return;
    }

    if (!formData.image) {
      alert('Please upload or provide a primary photo for this service package');
      return;
    }

    const inclusionsArray = formData.inclusions
      .split('\n')
      .map((i) => i.trim())
      .filter(Boolean);

    const customizationArray = formData.customizationOptions
      .split(',')
      .map((c) => c.trim())
      .filter(Boolean);

    if (editingService) {
      updateService({
        ...editingService,
        title: formData.title,
        slug: formData.slug || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        category: formData.category,
        categoryLabel: formData.categoryLabel,
        startingPrice: Number(formData.startingPrice),
        discountPrice: formData.discountPrice ? Number(formData.discountPrice) : undefined,
        shortDescription: formData.shortDescription,
        fullDescription: formData.fullDescription,
        image: formData.image,
        additionalImages: formData.additionalImages,
        inclusions: inclusionsArray,
        customizationOptions: customizationArray,
        availableAddons: formData.availableAddons,
        setupTimeHours: Number(formData.setupTimeHours),
        idealFor: formData.idealFor,
        tier: formData.tier,
        isFeatured: formData.isFeatured,
        isTrending: formData.isTrending,
        isBestSeller: formData.isBestSeller,
        isPublished: formData.isPublished,
      });
      showToast(`Updated "${formData.title}" successfully!`);
    } else {
      addService({
        title: formData.title,
        slug: formData.slug || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        category: formData.category,
        categoryLabel: formData.categoryLabel,
        startingPrice: Number(formData.startingPrice),
        discountPrice: formData.discountPrice ? Number(formData.discountPrice) : undefined,
        shortDescription: formData.shortDescription,
        fullDescription: formData.fullDescription,
        image: formData.image,
        additionalImages: formData.additionalImages,
        inclusions: inclusionsArray,
        customizationOptions: customizationArray,
        availableAddons: formData.availableAddons,
        rating: 4.9,
        reviewsCount: 1,
        isFeatured: formData.isFeatured,
        isTrending: formData.isTrending,
        isBestSeller: formData.isBestSeller,
        isPublished: formData.isPublished,
        setupTimeHours: Number(formData.setupTimeHours),
        idealFor: formData.idealFor,
        tier: formData.tier,
      });
      showToast(`Created new service "${formData.title}"!`);
    }

    setModalOpen(false);
  };

  return (
    <AdminLayout pageTitle="Decoration Services & Packages Manager">
      <div className="space-y-6">
        {toastMessage && (
          <div className="fixed top-5 right-5 z-50 p-4 bg-emerald-600 text-white rounded-2xl shadow-xl flex items-center gap-2 text-xs font-bold animate-bounce">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Actions & Filters Header */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="Search packages..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-gray-300 focus:border-[#701F3D] focus:outline-hidden"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl border border-gray-300 focus:border-[#701F3D] focus:outline-hidden bg-white"
            >
              <option value="all">All Event Categories ({services.length})</option>
              <option value="birthday">Birthday Decoration</option>
              <option value="anniversary">Anniversary Decoration</option>
              <option value="wedding">Wedding Stage</option>
              <option value="romantic">Romantic Room</option>
              <option value="balloon">Balloon Arch</option>
              <option value="baby-shower">Baby Shower</option>
              <option value="customized">Customized Events</option>
            </select>
          </div>

          <button
            onClick={openAddModal}
            className="w-full sm:w-auto px-4 py-2.5 bg-[#701F3D] hover:bg-[#52132A] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Decoration Package</span>
          </button>
        </div>

        {/* Services Table */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FFFCFA] border-b border-gray-200 text-gray-500 font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Service & Photo</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Setup Info</th>
                  <th className="py-3 px-4">Badges</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-gray-400">
                      <Package className="w-8 h-8 mx-auto mb-2 opacity-40" />
                      <p className="font-semibold">No decoration services found matching your filter.</p>
                      <button
                        onClick={openAddModal}
                        className="mt-3 px-4 py-1.5 bg-[#701F3D] text-white rounded-xl text-xs font-bold"
                      >
                        Create First Service
                      </button>
                    </td>
                  </tr>
                ) : (
                  filtered.map((service) => (
                    <tr key={service.id} className="hover:bg-gray-50/70 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={service.image}
                            alt={service.title}
                            className="w-14 h-14 rounded-xl object-cover shrink-0 border border-gray-200 shadow-2xs"
                          />
                          <div>
                            <p className="font-bold text-gray-900 line-clamp-1">{service.title}</p>
                            <p className="text-[11px] text-gray-400 line-clamp-1">
                              {service.shortDescription}
                            </p>
                            {service.additionalImages && service.additionalImages.length > 0 && (
                              <span className="text-[10px] text-[#B9944A] font-semibold">
                                +{service.additionalImages.length} extra photos
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-gray-700 font-medium">
                        <span className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-700 text-[11px]">
                          {service.categoryLabel}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <span className="font-bold font-serif text-sm text-[#701F3D]">
                          {formatPrice(service.startingPrice)}
                        </span>
                        {service.discountPrice && (
                          <p className="text-[10px] text-gray-400 line-through">
                            {formatPrice(service.discountPrice)}
                          </p>
                        )}
                      </td>

                      <td className="py-3 px-4 text-gray-600">
                        <p className="font-medium text-emerald-700">Onsite Setup</p>
                        <span className="text-[10px] text-gray-400 font-semibold">{service.tier} • {service.idealFor}</span>
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1">
                          {service.isFeatured && (
                            <span className="bg-[#D6B36A] text-[#29252A] text-[9px] font-bold px-1.5 py-0.5 rounded">
                              Featured
                            </span>
                          )}
                          {service.isBestSeller && (
                            <span className="bg-amber-100 text-amber-800 text-[9px] font-bold px-1.5 py-0.5 rounded">
                              Best Seller
                            </span>
                          )}
                          {service.isTrending && (
                            <span className="bg-rose-100 text-rose-800 text-[9px] font-bold px-1.5 py-0.5 rounded">
                              Trending
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <button
                          onClick={() => {
                            updateService({ ...service, isPublished: !service.isPublished });
                            showToast(
                              `Service marked as ${!service.isPublished ? 'Live on Website' : 'Draft / Hidden'}`
                            );
                          }}
                          className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full cursor-pointer transition-colors ${
                            service.isPublished
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                              : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                          }`}
                        >
                          {service.isPublished ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                          <span>{service.isPublished ? 'Live' : 'Hidden'}</span>
                        </button>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleDuplicate(service)}
                            className="p-1.5 text-gray-500 hover:text-[#701F3D] hover:bg-[#F8E7EC] rounded-lg cursor-pointer"
                            title="Duplicate Service"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => openEditModal(service)}
                            className="p-1.5 text-gray-600 hover:text-[#701F3D] hover:bg-gray-100 rounded-lg cursor-pointer"
                            title="Edit Service"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`Are you sure you want to delete "${service.title}"?`)) {
                                deleteService(service.id);
                                showToast(`Deleted "${service.title}"`);
                              }
                            }}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
                            title="Delete Service"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal: Add / Edit Service */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-gray-200 my-8 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                <div>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#701F3D]">
                    {editingService ? 'Edit Decoration Package' : 'Create New Decoration Package'}
                  </h3>
                  <p className="text-xs text-gray-500">
                    Upload photos directly from your phone/computer, set pricing, inclusions, and addons.
                  </p>
                </div>
                <button
                  onClick={() => setModalOpen(false)}
                  className="p-1.5 text-gray-400 hover:text-gray-700 rounded-xl hover:bg-gray-100 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSave} className="mt-6 space-y-6 text-xs">
                {/* 1. Basic Info */}
                <div className="space-y-4 bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
                  <h4 className="font-serif text-sm font-bold text-[#701F3D] flex items-center gap-1.5">
                    <Package className="w-4 h-4 text-[#D6B36A]" />
                    <span>Package Title & Classification</span>
                  </h4>

                  <div>
                    <label className="block font-semibold text-gray-800 mb-1">
                      Package Name / Title *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ring Arch Pastel Birthday Backdrop"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-[#701F3D] focus:outline-hidden bg-white text-xs font-medium"
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
                        <option value="birthday">Birthday Decoration</option>
                        <option value="anniversary">Anniversary Decoration</option>
                        <option value="wedding">Wedding Decoration</option>
                        <option value="romantic">Romantic Room Decoration</option>
                        <option value="balloon">Balloon Decoration</option>
                        <option value="baby-shower">Baby Shower Decoration</option>
                        <option value="customized">Customized Events</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-gray-800 mb-1">
                        Package Tier
                      </label>
                      <select
                        value={formData.tier}
                        onChange={(e) => setFormData({ ...formData, tier: e.target.value as any })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-[#701F3D] focus:outline-hidden bg-white text-xs"
                      >
                        <option value="Budget-Friendly">Budget-Friendly (Simple & Sweet)</option>
                        <option value="Standard">Standard (Popular Choice)</option>
                        <option value="Luxury">Luxury (Premium Props & Flowers)</option>
                        <option value="Grand">Grand Royale (Turnkey Celebrity Style)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* 2. Photo Uploads (PRIMARY + EXTRA PHOTOS) */}
                <div className="space-y-4 bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
                  <h4 className="font-serif text-sm font-bold text-[#701F3D] flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-[#D6B36A]" />
                    <span>Visuals & Photo Uploads (No Code Needed!)</span>
                  </h4>

                  {/* Primary Photo */}
                  <ImageUploadField
                    label="Primary Package Photo (Featured Cover)"
                    required
                    aspectRatio="video"
                    value={formData.image}
                    onChange={(url) => setFormData({ ...formData, image: url })}
                    helperText="Upload your setup photo directly from your device or choose a stock preset."
                  />

                  {/* Multi-Photo Gallery for Service */}
                  <div className="pt-2">
                    <MultiImageUploadField
                      images={formData.additionalImages}
                      onChange={(imgs) => setFormData({ ...formData, additionalImages: imgs })}
                      label="Additional Detail Photos (Up to 6)"
                      helperText="Add photos of cake table, backdrop details, lighting, or balloon arches."
                      maxImages={6}
                    />
                  </div>
                </div>

                {/* 3. Pricing & Logistics */}
                <div className="space-y-4 bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
                  <h4 className="font-serif text-sm font-bold text-[#701F3D] flex items-center gap-1.5">
                    <IndianRupee className="w-4 h-4 text-[#D6B36A]" />
                    <span>Pricing & Setup Duration</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block font-semibold text-gray-800 mb-1">
                        Starting Price (₹) *
                      </label>
                      <input
                        type="number"
                        required
                        value={formData.startingPrice}
                        onChange={(e) => setFormData({ ...formData, startingPrice: Number(e.target.value) })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-[#701F3D] focus:outline-hidden bg-white text-xs font-bold"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-gray-800 mb-1">
                        Discount / MRP Price (₹)
                      </label>
                      <input
                        type="number"
                        placeholder="Shown crossed out"
                        value={formData.discountPrice || ''}
                        onChange={(e) => setFormData({ ...formData, discountPrice: Number(e.target.value) })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-[#701F3D] focus:outline-hidden bg-white text-xs"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-gray-800 mb-1">
                        Setup Time (Hours)
                      </label>
                      <input
                        type="number"
                        step="0.5"
                        value={formData.setupTimeHours}
                        onChange={(e) => setFormData({ ...formData, setupTimeHours: Number(e.target.value) })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-[#701F3D] focus:outline-hidden bg-white text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-gray-800 mb-1">
                        Venue Suitability
                      </label>
                      <select
                        value={formData.idealFor}
                        onChange={(e) => setFormData({ ...formData, idealFor: e.target.value as any })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-[#701F3D] focus:outline-hidden bg-white text-xs"
                      >
                        <option value="Indoor">Indoor (Living room, Hall, Hotel)</option>
                        <option value="Outdoor">Outdoor (Terrace, Garden, Lawn)</option>
                        <option value="Both">Both Indoor & Outdoor</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-gray-800 mb-1">
                        Custom URL Slug (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="auto-generated from title"
                        value={formData.slug}
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-[#701F3D] focus:outline-hidden bg-white text-xs font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* 4. Descriptions & Inclusions */}
                <div className="space-y-4 bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
                  <h4 className="font-serif text-sm font-bold text-[#701F3D] flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-[#D6B36A]" />
                    <span>Descriptions & Package Inclusions</span>
                  </h4>

                  <div>
                    <label className="block font-semibold text-gray-800 mb-1">
                      Short Description (Card Summary) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="One-line summary for cards"
                      value={formData.shortDescription}
                      onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-[#701F3D] focus:outline-hidden bg-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-800 mb-1">
                      Full Detailed Description
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Describe what makes this decoration memorable, materials used, crew arrival details..."
                      value={formData.fullDescription}
                      onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-[#701F3D] focus:outline-hidden bg-white text-xs resize-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-800 mb-1">
                      Package Inclusions Checklist (One per line)
                    </label>
                    <textarea
                      rows={3}
                      value={formData.inclusions}
                      onChange={(e) => setFormData({ ...formData, inclusions: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-[#701F3D] focus:outline-hidden bg-white text-xs resize-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-800 mb-1">
                      Color Theme Options (Comma separated)
                    </label>
                    <input
                      type="text"
                      placeholder="Pastel Blue & Silver, Blush Pink & Rose Gold"
                      value={formData.customizationOptions}
                      onChange={(e) => setFormData({ ...formData, customizationOptions: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-[#701F3D] focus:outline-hidden bg-white text-xs"
                    />
                  </div>
                </div>

                {/* 5. Addons Builder */}
                <div className="space-y-3 bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
                  <h4 className="font-serif text-sm font-bold text-[#701F3D] flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Plus className="w-4 h-4 text-[#D6B36A]" />
                      <span>Customizable Addon Items</span>
                    </span>
                    <span className="text-[11px] text-gray-500 font-normal">
                      Customers can add these to their cart/booking
                    </span>
                  </h4>

                  <div className="space-y-2">
                    {formData.availableAddons.map((addon) => (
                      <div
                        key={addon.id}
                        className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-gray-200"
                      >
                        <span className="font-medium text-gray-800">{addon.name}</span>
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-[#701F3D]">{formatPrice(addon.price)}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveAddon(addon.id)}
                            className="text-red-500 hover:text-red-700 p-1 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}

                    {/* Add new addon input */}
                    <div className="flex flex-col sm:flex-row gap-2 pt-2">
                      <input
                        type="text"
                        placeholder="Addon name (e.g. Helium Balloon Bouquet)"
                        value={newAddonName}
                        onChange={(e) => setNewAddonName(e.target.value)}
                        className="flex-1 px-3 py-2 text-xs rounded-xl border border-gray-300 bg-white"
                      />
                      <div className="flex gap-2">
                        <input
                          type="number"
                          placeholder="Price ₹"
                          value={newAddonPrice}
                          onChange={(e) => setNewAddonPrice(Number(e.target.value))}
                          className="w-24 px-3 py-2 text-xs rounded-xl border border-gray-300 bg-white"
                        />
                        <button
                          type="button"
                          onClick={handleAddAddon}
                          className="px-4 py-2 bg-[#701F3D] text-white font-bold rounded-xl text-xs hover:bg-[#52132A] cursor-pointer"
                        >
                          + Add
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 6. Visibility & Badges Toggles */}
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex flex-wrap gap-6 items-center">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isPublished}
                      onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                      className="w-4 h-4 rounded text-[#701F3D] focus:ring-[#701F3D]"
                    />
                    <span className="font-semibold text-gray-800">Publish Live on Website</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isFeatured}
                      onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                      className="w-4 h-4 rounded text-[#701F3D] focus:ring-[#701F3D]"
                    />
                    <span className="font-semibold text-gray-800">Featured (Show on Homepage)</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isBestSeller}
                      onChange={(e) => setFormData({ ...formData, isBestSeller: e.target.checked })}
                      className="w-4 h-4 rounded text-[#701F3D] focus:ring-[#701F3D]"
                    />
                    <span className="font-semibold text-gray-800">Best Seller Tag</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isTrending}
                      onChange={(e) => setFormData({ ...formData, isTrending: e.target.checked })}
                      className="w-4 h-4 rounded text-[#701F3D] focus:ring-[#701F3D]"
                    />
                    <span className="font-semibold text-gray-800">Trending Now</span>
                  </label>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-bold hover:bg-gray-100 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-[#701F3D] hover:bg-[#52132A] text-white font-bold shadow-md cursor-pointer flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{editingService ? 'Save Changes' : 'Create Package'}</span>
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
