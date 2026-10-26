import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Trash2,
  Calendar,
  MessageCircle,
  Phone,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BookingModal } from '../components/BookingModal';

export const CartPage: React.FC = () => {
  const {
    cart,
    removeFromCart,
    clearCart,
    settings,
  } = useApp();

  const [bookingModalOpen, setBookingModalOpen] = useState(false);

  const cleanPhone = settings.whatsappNumber || settings.phoneNumber.replace(/[^0-9]/g, '') || '919650246245';

  const handleWhatsAppBooking = () => {
    const itemsList = cart.map((item, idx) => {
      const addons = item.selectedAddons?.map(a => a.name).join(', ');
      return `${idx + 1}. *${item.title}*${addons ? ` (Addons: ${addons})` : ''}${item.eventDate ? ` [Date: ${item.eventDate}]` : ''}`;
    }).join('\n');

    const msg = `🎉 *NEW EVENT DECORATION INQUIRY / CART* 🎉
*The Kreative Decor (Sector 51, Gurgaon)*
-----------------------------------
Hello Kreative Decor, I would like to book the following decoration setup(s):

${itemsList}

Please let me know date availability, total quotation, and required details!`;

    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-[#F8E7EC] text-[#701F3D] flex items-center justify-center mx-auto">
          <Sparkles className="w-8 h-8 text-[#D6B36A]" />
        </div>
        <h2 className="font-serif text-3xl font-bold text-[#29252A]">
          Your Selected Setups List is Empty
        </h2>
        <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto">
          Browse our signature packages and tap "Book Now" or contact us directly on WhatsApp.
        </p>
        <div className="pt-2 flex flex-wrap justify-center gap-3">
          <Link
            to="/services"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#701F3D] text-white text-xs font-semibold hover:bg-[#52132A] transition-colors"
          >
            <Sparkles className="w-4 h-4 text-[#D6B36A]" />
            <span>Browse All Packages</span>
          </Link>
          <a
            href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent('Hi Kreative Decor, I want to inquire about event decorations.')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#25D366] text-white text-xs font-bold hover:bg-[#20b857] transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Chat on WhatsApp</span>
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Title */}
      <div className="flex items-center justify-between border-b border-[#F8E7EC] pb-6">
        <div>
          <span className="text-xs font-bold text-[#701F3D] uppercase tracking-widest bg-[#F8E7EC] px-3 py-1 rounded-full">
            Selected Setups
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#29252A] mt-2">
            Selected Decorations ({cart.length})
          </h1>
        </div>

        <button
          onClick={clearCart}
          className="text-xs text-red-600 hover:text-red-700 font-semibold flex items-center gap-1 cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear List</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Cart Items List (8 Cols) */}
        <div className="lg:col-span-8 space-y-4">
          {cart.map((item) => (
            <div
              key={item.serviceId}
              className="bg-white rounded-2xl p-4 sm:p-6 border border-[#F8E7EC] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-20 h-20 rounded-xl object-cover shrink-0"
                />
                <div className="space-y-1">
                  <h3 className="font-serif text-lg font-bold text-[#29252A]">
                    {item.title}
                  </h3>
                  <p className="text-xs text-emerald-700 font-medium">
                    Bespoke Theme & Setup Included
                  </p>
                  {item.selectedAddons && item.selectedAddons.length > 0 && (
                    <div className="text-[11px] text-gray-500">
                      Add-ons: {item.selectedAddons.map((a) => a.name).join(', ')}
                    </div>
                  )}
                  {item.eventDate && (
                    <p className="text-[11px] text-[#701F3D] flex items-center gap-1 font-semibold">
                      <Calendar className="w-3 h-3" />
                      <span>Target Date: {item.eventDate}</span>
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-0 border-gray-100">
                <button
                  onClick={() => removeFromCart(item.serviceId)}
                  className="p-2 text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
                  title="Remove Item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Action Panel (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-[#F8E7EC] shadow-sm space-y-5 sticky top-24">
            <h3 className="font-serif text-xl font-bold text-[#29252A]">
              Direct WhatsApp Booking
            </h3>

            <div className="space-y-3 text-xs text-gray-600 border-b border-[#F8E7EC] pb-4">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Send details directly to our styling team on WhatsApp</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Custom quotation & theme customization confirmed on chat</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>No payment gateway charges or card required</span>
              </div>
            </div>

            <button
              onClick={handleWhatsAppBooking}
              className="w-full py-3.5 rounded-xl bg-[#25D366] hover:bg-[#20b857] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>Book Setups on WhatsApp</span>
            </button>

            <button
              onClick={() => setBookingModalOpen(true)}
              className="w-full py-3 rounded-xl bg-[#701F3D] hover:bg-[#52132A] text-white text-xs font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#D6B36A]" />
              <span>Fill Detailed Booking Form</span>
            </button>

            <div className="text-center pt-2">
              <a
                href={`tel:${cleanPhone}`}
                className="text-xs text-gray-500 hover:text-[#701F3D] inline-flex items-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Us: {settings.phoneNumber}</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      <BookingModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
      />
    </div>
  );
};
