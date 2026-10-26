import React, { useState } from 'react';
import {
  Settings,
  Save,
  CheckCircle2,
  Tag,
  Plus,
  Trash2,
  Sparkles,
  Phone,
  Mail,
  MapPin,
  Building,
  Image as ImageIcon,
  QrCode,
  DollarSign,
  Megaphone,
  User,
  RotateCcw,
  Download,
  Upload,
  AlertTriangle,
} from 'lucide-react';
import { AdminLayout } from '../../components/AdminLayout';
import { useApp } from '../../context/AppContext';
import { ImageUploadField } from '../../components/admin/ImageUploadField';

export const AdminSettingsPage: React.FC = () => {
  const {
    settings,
    updateSettings,
    coupons,
    addCoupon,
    deleteCoupon,
    resetToDefaults,
    formatPrice,
    services,
    gallery,
  } = useApp();

  const [activeTab, setActiveTab] = useState<
    'business' | 'hero' | 'payment' | 'announcement' | 'about' | 'backup'
  >('business');

  // Business info state
  const [ownerName, setOwnerName] = useState(settings.ownerName || 'Kamal Kumar');
  const [businessName, setBusinessName] = useState(settings.businessName || 'Kreative Decor');
  const [contactEmail, setContactEmail] = useState(settings.contactEmail || 'kreativedecor.events@gmail.com');
  const [phoneNumber, setPhoneNumber] = useState(settings.phoneNumber || '+91 98788 95539');
  const [whatsappNumber, setWhatsappNumber] = useState(settings.whatsappNumber || '919878895539');
  const [fullOfficeAddress, setFullOfficeAddress] = useState(
    settings.fullOfficeAddress || 'Sector 51, Gurgaon'
  );
  const [citiesServed, setCitiesServed] = useState(
    (settings.citiesServed || ['Sector 51, Gurgaon', 'DLF Phase 1-5', 'Golf Course Road', 'Sohna Road', 'Gurgaon', 'Delhi NCR']).join(', ')
  );

  // Hero section state
  const [heroBadgeText, setHeroBadgeText] = useState(
    settings.heroBadgeText || 'The Kreative Decor • Unique Theme-Based Event Styling • Sector 51, Gurgaon'
  );
  const [heroTitle, setHeroTitle] = useState(
    settings.heroTitle || 'We Make Every Celebration Unforgettable.'
  );
  const [heroSubtitle, setHeroSubtitle] = useState(
    settings.heroSubtitle ||
      'From dreamy birthdays to romantic anniversaries, we transform your special moments into beautiful memories with bespoke balloon arches, fresh florals, and fairy lighting.'
  );
  const [heroBackgroundImage, setHeroBackgroundImage] = useState(
    settings.heroBackgroundImage ||
      'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=2000&q=85'
  );
  const [heroStartingPrice, setHeroStartingPrice] = useState(
    settings.heroStartingPrice || 1999
  );

  // Payment state
  const [upiId, setUpiId] = useState(settings.upiId || '9878895539@paytm');
  const [upiQrCodeImage, setUpiQrCodeImage] = useState(settings.upiQrCodeImage || '');

  // Announcement state
  const [announcementText, setAnnouncementText] = useState(settings.announcementText || '');
  const [showAnnouncement, setShowAnnouncement] = useState(settings.showAnnouncement ?? true);

  // About state
  const [aboutHeadline, setAboutHeadline] = useState(
    settings.aboutHeadline || 'Creating Magical Atmosphere for Life’s Most Cherished Celebrations'
  );
  const [aboutStory, setAboutStory] = useState(
    settings.aboutStory ||
      'The Kreative Decor is dedicated to turning ordinary spaces into magical celebration realms. Serving Sector 51, Gurgaon, and across Delhi NCR, our dedicated styling artisans bring bespoke theme dreams to reality.'
  );
  const [aboutFounderImage, setAboutFounderImage] = useState(
    settings.aboutFounderImage ||
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80'
  );
  const [experienceYears, setExperienceYears] = useState(settings.experienceYears || 7);
  const [completedEventsCount, setCompletedEventsCount] = useState(
    settings.completedEventsCount || 1450
  );

  // New Coupon state
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponValue, setNewCouponValue] = useState(15);
  const [newCouponType, setNewCouponType] = useState<'percentage' | 'fixed'>('percentage');
  const [newCouponMin, setNewCouponMin] = useState(2000);
  const [newCouponDesc, setNewCouponDesc] = useState('');

  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSaveAll = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const citiesArray = citiesServed
      .split(',')
      .map((c) => c.trim())
      .filter(Boolean);

    updateSettings({
      ownerName: ownerName.trim(),
      businessName: businessName.trim(),
      contactEmail: contactEmail.trim(),
      phoneNumber: phoneNumber.trim(),
      whatsappNumber: whatsappNumber.replace(/[^0-9]/g, ''),
      fullOfficeAddress: fullOfficeAddress.trim(),
      citiesServed: citiesArray,
      heroBadgeText: heroBadgeText.trim(),
      heroTitle: heroTitle.trim(),
      heroSubtitle: heroSubtitle.trim(),
      heroBackgroundImage,
      heroStartingPrice: Number(heroStartingPrice) || 1999,
      upiId: upiId.trim(),
      upiQrCodeImage,
      announcementText: announcementText.trim(),
      showAnnouncement,
      aboutHeadline: aboutHeadline.trim(),
      aboutStory: aboutStory.trim(),
      aboutFounderImage,
      experienceYears: Number(experienceYears) || 7,
      completedEventsCount: Number(completedEventsCount) || 1450,
    });

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 4000);
  };

  const handleAddCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode.trim()) return;

    addCoupon({
      code: newCouponCode.trim().toUpperCase(),
      discountType: newCouponType,
      discountValue: Number(newCouponValue),
      minOrderValue: Number(newCouponMin),
      isActive: true,
      description:
        newCouponDesc.trim() ||
        (newCouponType === 'percentage'
          ? `${newCouponValue}% OFF on orders above ${formatPrice(newCouponMin)}`
          : `Flat ${formatPrice(newCouponValue)} OFF on orders above ${formatPrice(newCouponMin)}`),
    });

    setNewCouponCode('');
    setNewCouponDesc('');
  };

  // Export data as JSON
  const handleExportData = () => {
    const fullBackup = {
      settings,
      services,
      gallery,
      coupons,
      exportDate: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(fullBackup, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kreative-decor-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AdminLayout pageTitle="Website Content & Master System Settings">
      <div className="space-y-6 max-w-5xl">
        {saveSuccess && (
          <div className="p-4 bg-emerald-600 text-white text-xs font-bold rounded-2xl flex items-center gap-2 shadow-lg animate-bounce">
            <CheckCircle2 className="w-5 h-5 shrink-0 text-white" />
            <span>Settings and photos updated successfully across the entire website!</span>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="bg-white p-2 rounded-2xl border border-gray-200 shadow-xs flex flex-wrap gap-1 text-xs">
          {[
            { id: 'business', label: '1. Business & Contact', icon: Building },
            { id: 'hero', label: '2. Homepage Banner & Hero', icon: Sparkles },
            { id: 'payment', label: '3. Payment & UPI QR', icon: QrCode },
            { id: 'announcement', label: '4. Offers & Coupons', icon: Megaphone },
            { id: 'about', label: '5. About Kamal & Story', icon: User },
            { id: 'backup', label: '6. Backup & Restore', icon: Download },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3.5 py-2 rounded-xl font-bold flex items-center gap-2 transition-all cursor-pointer ${
                  active
                    ? 'bg-[#701F3D] text-white shadow-xs'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-[#D6B36A]' : 'text-gray-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab 1: Business & Owner Details */}
        {activeTab === 'business' && (
          <form onSubmit={handleSaveAll} className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xs space-y-6">
            <div className="border-b border-gray-100 pb-3 flex items-center justify-between">
              <div>
                <h3 className="font-serif text-xl font-bold text-[#29252A] flex items-center gap-2">
                  <Building className="w-5 h-5 text-[#D6B36A]" />
                  <span>Business Brand & Direct Contact Channels</span>
                </h3>
                <p className="text-xs text-gray-500">
                  Controls the contact info, WhatsApp order numbers, and address on the header, footer, and booking receipts.
                </p>
              </div>
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#701F3D] hover:bg-[#52132A] text-white text-xs font-bold rounded-xl flex items-center gap-2 cursor-pointer shadow-md"
              >
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-gray-800 mb-1">
                  Business Owner Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-[#701F3D] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-800 mb-1">
                  Official Business Name *
                </label>
                <input
                  type="text"
                  required
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-[#701F3D] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-800 mb-1">
                  Support / Contact Email *
                </label>
                <input
                  type="email"
                  required
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-[#701F3D] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-800 mb-1">
                  Primary Phone Number (Calling) *
                </label>
                <input
                  type="text"
                  required
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-[#701F3D] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-800 mb-1">
                  WhatsApp Direct Booking Number (with country code, no +) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="919650246245"
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-[#701F3D] focus:outline-hidden font-mono"
                />
                <span className="text-[10px] text-gray-400">All customer WhatsApp buttons will open chats directly with this number.</span>
              </div>

              <div>
                <label className="block font-semibold text-gray-800 mb-1">
                  Cities Served (Comma separated)
                </label>
                <input
                  type="text"
                  value={citiesServed}
                  onChange={(e) => setCitiesServed(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-[#701F3D] focus:outline-hidden"
                />
              </div>
            </div>

            <div className="text-xs">
              <label className="block font-semibold text-gray-800 mb-1">
                Full Physical Office / Studio Address
              </label>
              <textarea
                rows={2}
                value={fullOfficeAddress}
                onChange={(e) => setFullOfficeAddress(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-[#701F3D] focus:outline-hidden resize-none"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#701F3D] hover:bg-[#52132A] text-white text-xs font-bold rounded-xl flex items-center gap-2 cursor-pointer shadow-md"
              >
                <Save className="w-4 h-4" />
                <span>Save Business Information</span>
              </button>
            </div>
          </form>
        )}

        {/* Tab 2: Homepage Hero & Banner Visuals */}
        {activeTab === 'hero' && (
          <form onSubmit={handleSaveAll} className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xs space-y-6">
            <div className="border-b border-gray-100 pb-3 flex items-center justify-between">
              <div>
                <h3 className="font-serif text-xl font-bold text-[#29252A] flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#D6B36A]" />
                  <span>Homepage Hero Section & Background Banner</span>
                </h3>
                <p className="text-xs text-gray-500">
                  Upload a new background cover photo and customize the hero text seen by every website visitor.
                </p>
              </div>
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#701F3D] hover:bg-[#52132A] text-white text-xs font-bold rounded-xl flex items-center gap-2 cursor-pointer shadow-md"
              >
                <Save className="w-4 h-4" />
                <span>Save Hero Changes</span>
              </button>
            </div>

            {/* Direct Image Upload for Hero Background */}
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <ImageUploadField
                label="Hero Background Photo (Dark Cinematic Banner)"
                required
                aspectRatio="banner"
                value={heroBackgroundImage}
                onChange={(url) => setHeroBackgroundImage(url)}
                helperText="Upload a high-res photo from your device. It will display with a cinematic gradient overlay."
              />
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-gray-800 mb-1">
                  Hero Top Pill Badge Text
                </label>
                <input
                  type="text"
                  value={heroBadgeText}
                  onChange={(e) => setHeroBadgeText(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-[#701F3D] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-800 mb-1">
                  Main Headline / Title *
                </label>
                <input
                  type="text"
                  required
                  value={heroTitle}
                  onChange={(e) => setHeroTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-[#701F3D] focus:outline-hidden font-serif text-sm font-bold"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-800 mb-1">
                  Hero Subtitle / Description *
                </label>
                <textarea
                  rows={3}
                  required
                  value={heroSubtitle}
                  onChange={(e) => setHeroSubtitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-[#701F3D] focus:outline-hidden resize-none"
                />
              </div>

              <div className="w-full sm:w-1/3">
                <label className="block font-semibold text-gray-800 mb-1">
                  Starting Packages Metric Display (₹)
                </label>
                <input
                  type="number"
                  value={heroStartingPrice}
                  onChange={(e) => setHeroStartingPrice(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-[#701F3D] focus:outline-hidden font-bold"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#701F3D] hover:bg-[#52132A] text-white text-xs font-bold rounded-xl flex items-center gap-2 cursor-pointer shadow-md"
              >
                <Save className="w-4 h-4" />
                <span>Save Hero Section</span>
              </button>
            </div>
          </form>
        )}

        {/* Tab 3: Payment & UPI Setup */}
        {activeTab === 'payment' && (
          <form onSubmit={handleSaveAll} className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xs space-y-6">
            <div className="border-b border-gray-100 pb-3 flex items-center justify-between">
              <div>
                <h3 className="font-serif text-xl font-bold text-[#29252A] flex items-center gap-2">
                  <QrCode className="w-5 h-5 text-[#D6B36A]" />
                  <span>Direct UPI & QR Code Payment Configuration</span>
                </h3>
                <p className="text-xs text-gray-500">
                  Upload your Paytm/PhonePe/GPay QR code photo so clients can scan and pay booking advances directly on checkout.
                </p>
              </div>
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#701F3D] hover:bg-[#52132A] text-white text-xs font-bold rounded-xl flex items-center gap-2 cursor-pointer shadow-md"
              >
                <Save className="w-4 h-4" />
                <span>Save Payment Settings</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
              <div className="space-y-4">
                <div>
                  <label className="block font-semibold text-gray-800 mb-1">
                    UPI ID (e.g. 9878895539@paytm / 9878895539@okaxis)
                  </label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="9650246245@paytm"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-[#701F3D] focus:outline-hidden font-mono font-bold"
                  />
                  <p className="text-[10px] text-gray-400 mt-1">
                    Displayed during checkout so customers can copy UPI ID directly.
                  </p>
                </div>

                <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-amber-900 space-y-1">
                  <p className="font-bold">Payment Flow Note:</p>
                  <p className="text-[11px] leading-relaxed">
                    When a customer submits a booking, they are prompted to pay a 30% advance via this UPI ID / QR code and share their transaction reference on WhatsApp.
                  </p>
                </div>
              </div>

              {/* QR Code Upload */}
              <div>
                <ImageUploadField
                  label="Business UPI QR Code Photo"
                  aspectRatio="square"
                  value={upiQrCodeImage}
                  onChange={(url) => setUpiQrCodeImage(url)}
                  helperText="Upload a screenshot of your Paytm, PhonePe, or Google Pay QR code."
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#701F3D] hover:bg-[#52132A] text-white text-xs font-bold rounded-xl flex items-center gap-2 cursor-pointer shadow-md"
              >
                <Save className="w-4 h-4" />
                <span>Save Payment Details</span>
              </button>
            </div>
          </form>
        )}

        {/* Tab 4: Offers, Announcements & Coupons */}
        {activeTab === 'announcement' && (
          <div className="space-y-6">
            {/* Announcement Bar Form */}
            <form onSubmit={handleSaveAll} className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xs space-y-4">
              <div className="border-b border-gray-100 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-xl font-bold text-[#29252A] flex items-center gap-2">
                    <Megaphone className="w-5 h-5 text-[#D6B36A]" />
                    <span>Top Promotional Announcement Banner</span>
                  </h3>
                  <p className="text-xs text-gray-500">
                    Appears across the very top of all public pages.
                  </p>
                </div>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#701F3D] hover:bg-[#52132A] text-white text-xs font-bold rounded-xl flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <Save className="w-4 h-4" />
                  <span>Update Banner</span>
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-gray-800 mb-1">
                    Banner Announcement Text
                  </label>
                  <input
                    type="text"
                    value={announcementText}
                    onChange={(e) => setAnnouncementText(e.target.value)}
                    placeholder="✨ Special Festive Offer: Get 15% OFF on Luxury Birthday & Anniversary Packages! Use Code: CELEBRATE15"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-[#701F3D] focus:outline-hidden"
                  />
                </div>

                <label className="flex items-center gap-2 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={showAnnouncement}
                    onChange={(e) => setShowAnnouncement(e.target.checked)}
                    className="w-4 h-4 rounded text-[#701F3D] focus:ring-[#701F3D]"
                  />
                  <span className="font-semibold text-gray-800">
                    Display Top Announcement Bar
                  </span>
                </label>
              </div>
            </form>

            {/* Coupons Management */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xs space-y-6">
              <div className="border-b border-gray-100 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-xl font-bold text-[#29252A] flex items-center gap-2">
                    <Tag className="w-5 h-5 text-[#D6B36A]" />
                    <span>Discount Coupons & Promo Codes</span>
                  </h3>
                  <p className="text-xs text-gray-500">
                    Create promo codes customers can apply in their cart for instant discounts.
                  </p>
                </div>
              </div>

              {/* Coupons List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {coupons.map((coupon) => (
                  <div
                    key={coupon.id}
                    className="p-4 rounded-2xl border-2 border-dashed border-[#D6B36A]/60 bg-[#FFFCFA] space-y-2 flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-sm font-extrabold text-[#701F3D] bg-[#F8E7EC] px-2.5 py-1 rounded-lg">
                        {coupon.code}
                      </span>
                      <button
                        onClick={() => deleteCoupon(coupon.id)}
                        className="text-red-500 hover:text-red-700 p-1 cursor-pointer"
                        title="Delete Coupon"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <p className="text-xs font-semibold text-gray-800">
                      {coupon.discountType === 'percentage'
                        ? `${coupon.discountValue}% OFF`
                        : `${formatPrice(coupon.discountValue)} FLAT OFF`}
                    </p>
                    <p className="text-[11px] text-gray-500 leading-tight">
                      Min. Order: {formatPrice(coupon.minOrderValue)}
                    </p>
                    <p className="text-[10px] text-gray-400 italic">
                      {coupon.description}
                    </p>
                  </div>
                ))}
              </div>

              {/* Add Coupon Form */}
              <form onSubmit={handleAddCoupon} className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-3 text-xs">
                <h4 className="font-bold text-gray-800 flex items-center gap-1.5">
                  <Plus className="w-4 h-4 text-[#701F3D]" />
                  <span>Create New Discount Coupon</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-gray-700 mb-1 font-semibold">Promo Code *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. SAVE20"
                      value={newCouponCode}
                      onChange={(e) => setNewCouponCode(e.target.value.toUpperCase())}
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 font-mono font-bold bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-1 font-semibold">Discount Type</label>
                    <select
                      value={newCouponType}
                      onChange={(e) => setNewCouponType(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white"
                    >
                      <option value="percentage">Percentage (%)</option>
                      <option value="fixed">Fixed Amount (₹)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-1 font-semibold">Discount Value *</label>
                    <input
                      type="number"
                      required
                      value={newCouponValue}
                      onChange={(e) => setNewCouponValue(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-1 font-semibold">Min Order (₹)</label>
                    <input
                      type="number"
                      value={newCouponMin}
                      onChange={(e) => setNewCouponMin(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white"
                    />
                  </div>
                </div>

                <div className="flex gap-2 items-center pt-1">
                  <input
                    type="text"
                    placeholder="Short description note (optional)"
                    value={newCouponDesc}
                    onChange={(e) => setNewCouponDesc(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl border border-gray-300 bg-white"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#701F3D] hover:bg-[#52132A] text-white font-bold rounded-xl cursor-pointer"
                  >
                    + Add Coupon
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Tab 5: About Kamal & Story */}
        {activeTab === 'about' && (
          <form onSubmit={handleSaveAll} className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xs space-y-6">
            <div className="border-b border-gray-100 pb-3 flex items-center justify-between">
              <div>
                <h3 className="font-serif text-xl font-bold text-[#29252A] flex items-center gap-2">
                  <User className="w-5 h-5 text-[#D6B36A]" />
                  <span>About Kamal Kumar & Brand Story</span>
                </h3>
                <p className="text-xs text-gray-500">
                  Update the About Us page, founder profile photo, and milestone numbers.
                </p>
              </div>
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#701F3D] hover:bg-[#52132A] text-white text-xs font-bold rounded-xl flex items-center gap-2 cursor-pointer shadow-md"
              >
                <Save className="w-4 h-4" />
                <span>Save Story</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
              <div className="space-y-4">
                <div>
                  <label className="block font-semibold text-gray-800 mb-1">
                    About Page Headline *
                  </label>
                  <input
                    type="text"
                    required
                    value={aboutHeadline}
                    onChange={(e) => setAboutHeadline(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-[#701F3D] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-800 mb-1">
                    Founder Bio & Story *
                  </label>
                  <textarea
                    rows={5}
                    required
                    value={aboutStory}
                    onChange={(e) => setAboutStory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-[#701F3D] focus:outline-hidden resize-none leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-gray-800 mb-1">
                      Experience in Years
                    </label>
                    <input
                      type="number"
                      value={experienceYears}
                      onChange={(e) => setExperienceYears(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-800 mb-1">
                      Completed Events Count
                    </label>
                    <input
                      type="number"
                      value={completedEventsCount}
                      onChange={(e) => setCompletedEventsCount(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* Founder Photo */}
              <div>
                <ImageUploadField
                  label="Founder Photo (Kamal Kumar)"
                  aspectRatio="square"
                  value={aboutFounderImage}
                  onChange={(url) => setAboutFounderImage(url)}
                  helperText="Upload Kamal Kumar's portrait photo for the About page."
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#701F3D] hover:bg-[#52132A] text-white text-xs font-bold rounded-xl flex items-center gap-2 cursor-pointer shadow-md"
              >
                <Save className="w-4 h-4" />
                <span>Save Profile & Story</span>
              </button>
            </div>
          </form>
        )}

        {/* Tab 6: Backup & Restore */}
        {activeTab === 'backup' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xs space-y-6">
            <div className="border-b border-gray-100 pb-3">
              <h3 className="font-serif text-xl font-bold text-[#29252A] flex items-center gap-2">
                <Download className="w-5 h-5 text-[#D6B36A]" />
                <span>Data Backup, Export & System Reset</span>
              </h3>
              <p className="text-xs text-gray-500">
                Download a complete copy of all your custom uploaded photos, services, bookings, and settings.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl border border-gray-200 bg-gray-50 space-y-3">
                <h4 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                  <Download className="w-4 h-4 text-[#701F3D]" />
                  <span>Export Website Backup</span>
                </h4>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Downloads a JSON file containing all current services, uploaded photos, inquiries, bookings, and settings.
                </p>
                <button
                  onClick={handleExportData}
                  className="px-4 py-2.5 bg-[#701F3D] hover:bg-[#52132A] text-white text-xs font-bold rounded-xl flex items-center gap-2 cursor-pointer shadow-xs"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Backup File</span>
                </button>
              </div>

              <div className="p-5 rounded-2xl border border-red-200 bg-red-50/50 space-y-3">
                <h4 className="font-bold text-red-900 text-sm flex items-center gap-2">
                  <RotateCcw className="w-4 h-4 text-red-600" />
                  <span>Reset to Original Sample Data</span>
                </h4>
                <p className="text-xs text-red-700/80 leading-relaxed">
                  Restores default decoration packages, sample gallery items, and initial settings.
                </p>
                <button
                  onClick={() => {
                    if (
                      window.confirm(
                        'Are you sure you want to restore demo sample data? Any unbacked custom changes will be reset.'
                      )
                    ) {
                      resetToDefaults();
                      window.location.reload();
                    }
                  }}
                  className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl flex items-center gap-2 cursor-pointer shadow-xs"
                >
                  <AlertTriangle className="w-4 h-4" />
                  <span>Reset All to Defaults</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};
