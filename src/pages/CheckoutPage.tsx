import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CheckCircle2,
  Calendar,
  Sparkles,
  MapPin,
  Phone,
  User,
  AlertCircle,
  MessageCircle,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const CheckoutPage: React.FC = () => {
  const { cart, addBooking, clearCart, currentUser, settings } = useApp();

  const [customerName, setCustomerName] = useState(currentUser?.name || '');
  const [customerEmail, setCustomerEmail] = useState(currentUser?.email || '');
  const [customerPhone, setCustomerPhone] = useState(currentUser?.phone || '');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('05:00 PM');
  const [city, setCity] = useState(currentUser?.city || 'Gurgaon');
  const [venueType, setVenueType] = useState('Home / Living Room');
  const [deliveryAddress, setDeliveryAddress] = useState(currentUser?.address || '');
  const [notes, setNotes] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmedBookingRef, setConfirmedBookingRef] = useState<string | null>(null);
  const [whatsappUrl, setWhatsappUrl] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const cleanPhone = settings.whatsappNumber || settings.phoneNumber.replace(/[^0-9]/g, '') || '919650246245';

  if (cart.length === 0 && !confirmedBookingRef) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold text-[#701F3D]">Your Booking List is Empty</h2>
        <p className="text-xs text-gray-500">Pick any decoration service and reserve it directly.</p>
        <Link to="/services" className="inline-block px-6 py-2.5 rounded-xl bg-[#701F3D] text-white text-xs font-semibold">
          Explore Services
        </Link>
      </div>
    );
  }

  const handleConfirmWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!customerName.trim() || !customerPhone.trim() || !eventDate || !deliveryAddress.trim()) {
      setErrorMessage('Please fill in your name, WhatsApp phone, event date, and full venue address.');
      return;
    }

    setIsProcessing(true);

    try {
      const titles = cart.map(i => i.title).join(', ');
      const newBooking = addBooking({
        serviceTitle: titles || 'Custom Event Setup',
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim(),
        customerPhone: customerPhone.trim(),
        eventType: cart[0]?.title || 'Celebration',
        eventDate,
        eventTime,
        eventCity: city,
        fullAddress: deliveryAddress.trim(),
        expectedBudget: 0,
        guestCount: 20,
        decorationPreferences: `Venue: ${venueType} | Items: ${titles}`,
        additionalRequirements: notes.trim(),
        selectedAddons: [],
        totalEstimatedAmount: 0,
      });

      const itemsSummary = cart.map((c, i) => `${i + 1}. ${c.title}`).join('\n');
      const waMsg = `🎉 *NEW EVENT DECORATION BOOKING* 🎉
*The Kreative Decor Team*
-----------------------------------
📋 *Selected Setup(s):*
${itemsSummary}

👤 *Name:* ${customerName.trim()}
📱 *WhatsApp Number:* ${customerPhone.trim()}
${customerEmail.trim() ? `✉️ *Email:* ${customerEmail.trim()}\n` : ''}🗓️ *Event Date:* ${eventDate}
⏰ *Preferred Time:* ${eventTime}
📍 *City:* ${city}
🏠 *Venue Type:* ${venueType}
🏢 *Full Address:* ${deliveryAddress.trim()}
${notes.trim() ? `📝 *Special Requests:* ${notes.trim()}\n` : ''}🔖 *Booking Reference:* ${newBooking.referenceNumber}
-----------------------------------
Hi Kreative Decor Team, please review my booking details and confirm quotation & availability on WhatsApp!`;

      const waLink = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(waMsg)}`;
      setWhatsappUrl(waLink);
      setConfirmedBookingRef(newBooking.referenceNumber);
      clearCart();

      try {
        window.open(waLink, '_blank');
      } catch (err) {
        // Handled by UI
      }
    } catch (err) {
      setErrorMessage('Could not record booking. Please try again or message on WhatsApp directly.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {confirmedBookingRef ? (
        /* Confirmed Screen */
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#F8E7EC] shadow-xl text-center space-y-6 max-w-2xl mx-auto">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Booking Saved & Transferred
            </span>
            <h1 className="font-serif text-3xl font-bold text-[#701F3D]">
              Booking Sent to WhatsApp!
            </h1>
            <p className="text-xs text-gray-500">
              Reference Number:{' '}
              <strong className="font-mono text-[#701F3D]">{confirmedBookingRef}</strong>
            </p>
          </div>

          <p className="text-xs sm:text-sm text-gray-600 max-w-md mx-auto">
            Your decoration details have been forwarded to The Kreative Decor styling team on WhatsApp for schedule confirmation and quotation.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#25D366] hover:bg-[#20b857] text-white text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>Open in WhatsApp</span>
            </a>
            <Link
              to="/my-bookings"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#701F3D] text-white text-xs font-semibold hover:bg-[#52132A] transition-colors"
            >
              View My Bookings
            </Link>
          </div>
        </div>
      ) : (
        /* Booking Confirmation Form */
        <form onSubmit={handleConfirmWhatsApp} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F8E7EC] shadow-sm space-y-6">
              <h2 className="font-serif text-2xl font-bold text-[#29252A] flex items-center gap-2">
                <User className="w-5 h-5 text-[#D6B36A]" />
                <span>Customer & Event Details</span>
              </h2>

              {errorMessage && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-300 focus:border-[#701F3D] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Mobile Number (WhatsApp) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="e.g. +91 98788 95539"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-300 focus:border-[#701F3D] focus:outline-hidden"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="customer@example.com"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-300 focus:border-[#701F3D] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Event Date *
                  </label>
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-300 focus:border-[#701F3D] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Setup Time *
                  </label>
                  <input
                    type="text"
                    value={eventTime}
                    onChange={(e) => setEventTime(e.target.value)}
                    placeholder="e.g. 05:00 PM"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-300 focus:border-[#701F3D] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    City / Area *
                  </label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-300 focus:border-[#701F3D] focus:outline-hidden bg-white"
                  >
                    <option value="Gurgaon">Gurgaon / Gurugram</option>
                    <option value="Delhi">Delhi NCR</option>
                    <option value="Gurugram">Gurugram</option>
                    <option value="Ghaziabad">Ghaziabad</option>
                    <option value="Lucknow">Lucknow</option>
                    <option value="Kanpur">Kanpur</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Venue Type *
                  </label>
                  <select
                    value={venueType}
                    onChange={(e) => setVenueType(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-300 focus:border-[#701F3D] focus:outline-hidden bg-white"
                  >
                    <option value="Home / Living Room">Home / Living Room</option>
                    <option value="Terrace / Rooftop">Terrace / Rooftop</option>
                    <option value="Banquet Hall / Club House">Banquet Hall / Club House</option>
                    <option value="Hotel Room / Suite">Hotel Room / Suite</option>
                    <option value="Lawn / Outdoor Garden">Lawn / Outdoor Garden</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Full Venue Address *
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="e.g. Tower B, Flat 402, DLF Phase 5, Sector 54, Gurgaon"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-300 focus:border-[#701F3D] focus:outline-hidden resize-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Special Notes / Entry Instructions
                  </label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Gate pass required at security entry."
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-300 focus:border-[#701F3D] focus:outline-hidden resize-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Review Items (4 Cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-[#F8E7EC] shadow-sm space-y-4 sticky top-24">
              <h3 className="font-serif text-xl font-bold text-[#29252A]">
                Selected Setups ({cart.length})
              </h3>

              <div className="space-y-3 max-h-60 overflow-y-auto divide-y divide-gray-100 text-xs">
                {cart.map((item) => (
                  <div key={item.serviceId} className="pt-2 flex justify-between gap-2">
                    <div>
                      <p className="font-semibold text-gray-800">{item.title}</p>
                      <p className="text-emerald-700 text-[11px]">Bespoke Setup</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-[#F8E7EC] pt-3 text-xs text-gray-600 space-y-2">
                <p>• Fast confirmation via WhatsApp with our styling team</p>
                <p>• Zero upfront payment needed</p>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-3.5 rounded-xl bg-[#25D366] hover:bg-[#20b857] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>{isProcessing ? 'Sending...' : 'Confirm on WhatsApp'}</span>
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};
