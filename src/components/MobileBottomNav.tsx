import React from 'react';
import { useLocation } from 'react-router-dom';
import { Home, Sparkles, MessageCircle, Phone, Grid } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const MobileBottomNav: React.FC = () => {
  const location = useLocation();
  const { settings } = useApp();

  // Don't show bottom nav inside admin panel
  if (location.pathname.startsWith('/admin')) {
    return null;
  }

  const cleanPhone = settings.whatsappNumber || settings.phoneNumber.replace(/[^0-9]/g, '') || '919878895539';

  const scrollTo = (id: string) => {
    if (location.pathname !== '/') {
      window.location.href = `/#${id}`;
      return;
    }
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/98 backdrop-blur-lg border-t border-[#F8E7EC] shadow-[0_-4px_25px_rgba(112,31,61,0.08)] px-2 pt-2 pb-[max(0.65rem,env(safe-area-inset-bottom))] transition-all"
      aria-label="Mobile Navigation"
    >
      <div className="max-w-md mx-auto grid grid-cols-5 items-end justify-items-center relative">
        {/* 1. Home */}
        <button
          onClick={() => scrollTo('hero')}
          className="flex flex-col items-center justify-center py-1 px-1 w-full text-gray-700 hover:text-[#701F3D] cursor-pointer"
        >
          <Home className="w-5 h-5 text-[#701F3D]" />
          <span className="text-[11px] mt-1 leading-none font-semibold text-[#701F3D]">
            Home
          </span>
        </button>

        {/* 2. Services */}
        <button
          onClick={() => scrollTo('categories')}
          className="flex flex-col items-center justify-center py-1 px-1 w-full text-gray-600 hover:text-[#701F3D] cursor-pointer"
        >
          <Grid className="w-5 h-5 text-gray-600" />
          <span className="text-[11px] mt-1 leading-none font-medium">
            Services
          </span>
        </button>

        {/* 3. Center Floating "Book Event" Button */}
        <button
          onClick={() => scrollTo('contact')}
          className="flex flex-col items-center justify-center -translate-y-2 group w-full cursor-pointer"
          title="Book Your Celebration"
        >
          <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-[#701F3D] to-[#8A264B] text-white flex items-center justify-center shadow-md border-2 border-[#D6B36A] group-hover:scale-105 group-active:scale-95 transition-all">
            <Sparkles className="w-5 h-5 text-[#D6B36A] animate-pulse" />
          </div>
          <span className="text-[10px] font-bold text-[#701F3D] mt-0.5 tracking-tight whitespace-nowrap">
            Book Event
          </span>
        </button>

        {/* 4. WhatsApp Direct */}
        <a
          href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(
            'Hi Kreative Decor, I would like to inquire about event decoration.'
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center py-1 px-1 w-full text-emerald-600 hover:text-emerald-700 cursor-pointer"
          title="WhatsApp Directly"
        >
          <MessageCircle className="w-5 h-5 text-[#25D366] fill-current" />
          <span className="text-[11px] mt-1 leading-none font-semibold text-[#25D366]">
            WhatsApp
          </span>
        </a>

        {/* 5. Call Direct */}
        <a
          href={`tel:${cleanPhone}`}
          className="flex flex-col items-center justify-center py-1 px-1 w-full text-gray-700 hover:text-[#701F3D] cursor-pointer"
          title="Call Directly"
        >
          <Phone className="w-5 h-5 text-[#701F3D]" />
          <span className="text-[11px] mt-1 leading-none font-medium text-gray-700">
            Call
          </span>
        </a>
      </div>
    </nav>
  );
};
