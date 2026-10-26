import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Phone,
  Mail,
  User,
  MessageCircle,
  Palette,
  Home,
  Check,
} from 'lucide-react';
import { ServiceItem, ServiceAddon, Booking } from '../types';
import { useApp } from '../context/AppContext';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  service?: ServiceItem | null;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  service,
}) => {
  const { addBooking, settings, currentUser } = useApp();

  const [formData, setFormData] = useState({
    customerName: currentUser?.name || '',
    customerEmail: currentUser?.email || '',
    customerPhone: currentUser?.phone || '',
    eventType: service?.categoryLabel || 'Birthday Party',
    eventDate: '',
    eventTime: '05:00 PM',
    eventCity: currentUser?.city || 'Gurgaon',
    venueType: 'Home / Living Room',
    fullAddress: currentUser?.address || '',
    decorationPreferences: service?.customizationOptions?.[0] || '',
    customFoilText: '',
    additionalRequirements: '',
  });

  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdBooking, setCreatedBooking] = useState<Booking | null>(null);
  const [whatsappUrl, setWhatsappUrl] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleAddonToggle = (addonName: string) => {
    setSelectedAddons((prev) =>
      prev.includes(addonName)
        ? prev.filter((a) => a !== addonName)
        : [...prev, addonName]
    );
  };

  const cleanPhone = settings.whatsappNumber || settings.phoneNumber.replace(/[^0-9]/g, '') || '919878895539';

  const generateWhatsAppMessage = (bookingRef: string) => {
    return `🎉 *NEW EVENT DECORATION BOOKING REQUEST* 🎉
*The Kreative Decor (Sector 51, Gurgaon)*
-----------------------------------
📋 *Service / Setup:* ${service ? service.title : formData.eventType}
👤 *Customer Name:* ${formData.customerName.trim()}
📱 *WhatsApp Number:* ${formData.customerPhone.trim()}
${formData.customerEmail.trim() ? `✉️ *Email:* ${formData.customerEmail.trim()}\n` : ''}🗓️ *Event Date:* ${formData.eventDate}
⏰ *Preferred Setup Time:* ${formData.eventTime}
📍 *City / Area:* ${formData.eventCity}
🏠 *Venue Type:* ${formData.venueType}
🏢 *Full Address:* ${formData.fullAddress.trim() || 'Address will be provided'}
🎨 *Theme / Colors:* ${formData.decorationPreferences.trim() || 'As discussed'}
${formData.customFoilText.trim() ? `🎈 *Name/Age on Balloons:* ${formData.customFoilText.trim()}\n` : ''}${selectedAddons.length > 0 ? `✨ *Requested Add-ons:* ${selectedAddons.join(', ')}\n` : ''}${formData.additionalRequirements.trim() ? `📝 *Special Instructions:* ${formData.additionalRequirements.trim()}\n` : ''}🔖 *Booking Reference:* ${bookingRef}
-----------------------------------
Hi Kreative Decor, please check date availability and send quotation & setup confirmation on WhatsApp!`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.customerName.trim() || !formData.customerPhone.trim() || !formData.eventDate) {
      setErrorMsg('Please complete your name, WhatsApp phone number, and event date.');
      return;
    }

    setIsSubmitting(true);

    try {
      const newBooking = addBooking({
        serviceId: service?.id,
        serviceTitle: service?.title || `${formData.eventType} Custom Decoration`,
        customerName: formData.customerName.trim(),
        customerEmail: formData.customerEmail.trim(),
        customerPhone: formData.customerPhone.trim(),
        eventType: formData.eventType,
        eventDate: formData.eventDate,
        eventTime: formData.eventTime,
        eventCity: formData.eventCity,
        fullAddress: formData.fullAddress.trim(),
        expectedBudget: 0,
        guestCount: 20,
        decorationPreferences: [
          formData.decorationPreferences ? `Theme: ${formData.decorationPreferences}` : '',
          formData.customFoilText ? `Balloon Text: ${formData.customFoilText}` : '',
          formData.venueType ? `Venue: ${formData.venueType}` : '',
        ].filter(Boolean).join(' | '),
        additionalRequirements: formData.additionalRequirements.trim(),
        selectedAddons: selectedAddons.map((name) => ({ name, price: 0 })),
        totalEstimatedAmount: 0,
      });

      const waMsg = generateWhatsAppMessage(newBooking.referenceNumber);
      const waLink = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(waMsg)}`;
      setWhatsappUrl(waLink);
      setCreatedBooking(newBooking);

      // Open WhatsApp automatically
      try {
        window.open(waLink, '_blank');
      } catch (err) {
        // If popup blocker triggers, user can click the button
      }
    } catch (err) {
      setErrorMsg('Failed to record booking request. Please check your details and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setCreatedBooking(null);
    setWhatsappUrl('');
    setErrorMsg('');
    onClose();
  };

  // Default addons list if service does not have addons
  const availableOptions = service?.availableAddons?.map(a => a.name) || [
    'Vintage Cake Stand & Pedestal',
    'Party Smoke / Fog Entry Effect',
    'Extra Balloons for Room Ceiling',
    'Warm Fairy Lights String (20ft)',
    'Custom Neon LED Light Sign',
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-[#F8E7EC] my-8 overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#701F3D] to-[#8A264B] text-white p-6 relative">
          <button
            onClick={handleResetAndClose}
            className="absolute top-5 right-5 text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="flex items-center gap-2 text-[#D6B36A] text-xs font-semibold tracking-wider uppercase mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Direct WhatsApp Booking</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight">
            {service ? service.title : 'Book Event Decoration'}
          </h2>
          <p className="text-xs text-white/80 mt-1">
            Fill in your event details below. We will send the full booking directly to Kreative Decor on WhatsApp!
          </p>
        </div>

        {/* Content Area */}
        <div className="p-6 max-h-[75vh] overflow-y-auto">
          {createdBooking ? (
            /* Success confirmation screen */
            <div className="space-y-6 text-center py-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-2">
                <h3 className="font-serif text-2xl font-bold text-[#701F3D]">
                  Booking Saved & Ready to Send!
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 max-w-md mx-auto">
                  Thank you, <strong className="text-gray-900">{createdBooking.customerName}</strong>. Your event details have been organized. Click the button below to send it directly to our styling team on WhatsApp.
                </p>
              </div>

              {/* Reference Card */}
              <div className="bg-[#F8E7EC]/40 border-2 border-dashed border-[#701F3D]/30 rounded-2xl p-5 max-w-md mx-auto space-y-3 text-left">
                <div className="flex justify-between items-center border-b border-[#701F3D]/10 pb-2">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Booking Reference
                  </span>
                  <span className="text-sm font-mono font-bold text-[#701F3D] bg-white px-2.5 py-0.5 rounded border border-[#701F3D]/20">
                    {createdBooking.referenceNumber}
                  </span>
                </div>

                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-600">Event / Occasion:</span>
                  <span className="font-semibold text-gray-800">{createdBooking.serviceTitle}</span>
                </div>

                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-600">Date & Time:</span>
                  <span className="font-semibold text-gray-800">
                    {createdBooking.eventDate} at {createdBooking.eventTime}
                  </span>
                </div>

                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-600">Location:</span>
                  <span className="font-semibold text-gray-800">{createdBooking.eventCity}</span>
                </div>

                <div className="flex justify-between items-center text-xs pt-1 border-t border-[#701F3D]/10">
                  <span className="text-gray-600">Booking Status:</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                    Forwarded to WhatsApp
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#25D366] hover:bg-[#20b857] text-white text-xs font-bold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageCircle className="w-5 h-5 fill-current" />
                  <span>Open & Chat on WhatsApp</span>
                </a>

                <button
                  onClick={handleResetAndClose}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold transition-colors cursor-pointer"
                >
                  Close & Explore More
                </button>
              </div>
            </div>
          ) : (
            /* Booking Form */
            <form onSubmit={handleSubmit} className="space-y-6">
              {errorMsg && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Section 1: Customer Contact */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-[#701F3D] uppercase tracking-wider flex items-center gap-1.5 border-b border-[#F8E7EC] pb-1.5">
                  <User className="w-4 h-4 text-[#D6B36A]" />
                  <span>1. Contact Information</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Customer Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Priya Sharma"
                      value={formData.customerName}
                      onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 focus:border-[#701F3D] focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Mobile Number (WhatsApp) *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. +91 98765 43210"
                      value={formData.customerPhone}
                      onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 focus:border-[#701F3D] focus:outline-hidden"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      placeholder="e.g. priya.sharma@example.com"
                      value={formData.customerEmail}
                      onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 focus:border-[#701F3D] focus:outline-hidden"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Event Details */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-[#701F3D] uppercase tracking-wider flex items-center gap-1.5 border-b border-[#F8E7EC] pb-1.5">
                  <Calendar className="w-4 h-4 text-[#D6B36A]" />
                  <span>2. Event Date, Timing & Location</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Event Occasion *
                    </label>
                    <select
                      value={formData.eventType}
                      onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 focus:border-[#701F3D] focus:outline-hidden bg-white"
                    >
                      <option value="Birthday Party">Birthday Party</option>
                      <option value="1st Birthday / Baby Theme">1st Birthday Party</option>
                      <option value="Anniversary Celebration">Anniversary Celebration</option>
                      <option value="Romantic Room Setup">Romantic Room / Cabana</option>
                      <option value="Baby Shower">Baby Shower</option>
                      <option value="Wedding / Reception Stage">Wedding / Reception Stage</option>
                      <option value="Haldi / Mehendi Decor">Haldi / Mehendi Decor</option>
                      <option value="Custom Themed Event">Custom Themed Event</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Event Date *
                    </label>
                    <input
                      type="date"
                      required
                      min={new Date().toISOString().split('T')[0]}
                      value={formData.eventDate}
                      onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 focus:border-[#701F3D] focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Setup Time *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 05:00 PM"
                      value={formData.eventTime}
                      onChange={(e) => setFormData({ ...formData, eventTime: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 focus:border-[#701F3D] focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      City / Region *
                    </label>
                    <select
                      value={formData.eventCity}
                      onChange={(e) => setFormData({ ...formData, eventCity: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 focus:border-[#701F3D] focus:outline-hidden bg-white"
                    >
                      <option value="Gurgaon">Gurgaon / Gurugram</option>
                      <option value="Delhi">Delhi NCR</option>
                      <option value="Faridabad">Faridabad</option>
                      <option value="Ghaziabad">Ghaziabad</option>
                      <option value="Lucknow">Lucknow</option>
                      <option value="Kanpur">Kanpur</option>
                      <option value="Other">Other North India Location</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Venue Type *
                    </label>
                    <select
                      value={formData.venueType}
                      onChange={(e) => setFormData({ ...formData, venueType: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 focus:border-[#701F3D] focus:outline-hidden bg-white"
                    >
                      <option value="Home / Living Room">Home / Living Room</option>
                      <option value="Terrace / Rooftop">Terrace / Rooftop</option>
                      <option value="Banquet Hall / Club House">Banquet Hall / Club House</option>
                      <option value="Hotel Room / Suite">Hotel Room / Suite</option>
                      <option value="Lawn / Outdoor Garden">Lawn / Outdoor Garden</option>
                      <option value="Restaurant / Cafe">Restaurant / Cafe</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Full Address / Apartment *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Flat 502, Express Greens, Sec 44"
                      value={formData.fullAddress}
                      onChange={(e) => setFormData({ ...formData, fullAddress: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 focus:border-[#701F3D] focus:outline-hidden"
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Decoration Customization & Required Elements */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-[#701F3D] uppercase tracking-wider flex items-center gap-1.5 border-b border-[#F8E7EC] pb-1.5">
                  <Palette className="w-4 h-4 text-[#D6B36A]" />
                  <span>3. Decoration Preferences & Elements</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Color Theme / Styling Preference
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Pastel Rose Gold & Chrome Silver, Jungle Safari"
                      value={formData.decorationPreferences}
                      onChange={(e) => setFormData({ ...formData, decorationPreferences: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 focus:border-[#701F3D] focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Name / Age on Foil Balloons
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 'Aarohi Turns 1' / 'Happy 25th'"
                      value={formData.customFoilText}
                      onChange={(e) => setFormData({ ...formData, customFoilText: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 focus:border-[#701F3D] focus:outline-hidden"
                    />
                  </div>
                </div>

                {/* Optional Custom Elements */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Select Add-on Elements Desired:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {availableOptions.map((addonName, idx) => {
                      const isChecked = selectedAddons.includes(addonName);
                      return (
                        <label
                          key={idx}
                          className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-xs cursor-pointer transition-colors ${
                            isChecked
                              ? 'bg-[#F8E7EC] border-[#701F3D] text-[#701F3D] font-semibold'
                              : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleAddonToggle(addonName)}
                            className="rounded text-[#701F3D] focus:ring-[#701F3D]"
                          />
                          <span>{addonName}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Special Instructions / Notes
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Preferred setup timing, gate entry instructions, or custom theme notes."
                    value={formData.additionalRequirements}
                    onChange={(e) => setFormData({ ...formData, additionalRequirements: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 focus:border-[#701F3D] focus:outline-hidden resize-none"
                  />
                </div>
              </div>

              {/* Submit CTA Bar */}
              <div className="bg-[#FFFCFA] border border-[#F8E7EC] rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-center sm:text-left">
                  <span className="text-xs font-bold text-[#701F3D] block">
                    Fast WhatsApp Booking Confirmation
                  </span>
                  <span className="text-[11px] text-gray-500 block">
                    No advance payment required now. Our team will confirm details on WhatsApp.
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#25D366] hover:bg-[#20b857] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>{isSubmitting ? 'Sending...' : 'Book on WhatsApp'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
