import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Sparkles,
  Phone,
  Mail,
  Menu,
  X,
  ChevronDown,
  MessageCircle,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Navbar: React.FC = () => {
  const { settings } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Smooth scroll helper for landing page sections
  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    setServicesDropdownOpen(false);

    if (location.pathname !== '/') {
      navigate(`/#${id}`);
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 150);
      return;
    }

    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Exactly the categories specified in the audio call:
  // Anniversary, Birthday, Baby Shower, Baby Welcome, Just Married, Haldi & Mehndi
  const serviceCategories = [
    { label: 'Anniversary Decoration', id: 'anniversary', icon: '💖', desc: 'Romantic cabanas, golden jubilee & floral setups' },
    { label: 'Birthday Decoration', id: 'birthday', icon: '🎈', desc: 'Ring arches, neon signs & shimmer walls' },
    { label: 'Baby Shower', id: 'baby-shower', icon: '🍼', desc: 'Hot air balloon clouds & 3D marquee blocks' },
    { label: 'Baby Welcome', id: 'baby-welcome', icon: '👶', desc: 'Homecoming cradle decor & entry arches' },
    { label: 'Just Married & Romantic', id: 'just-married', icon: '🌹', desc: 'Rose petal pathways & fairy light canopies' },
    { label: 'Haldi & Mehndi', id: 'haldi-mehndi', icon: '🌼', desc: 'Marigold tassels, royal brass urlis & photobooths' },
  ];

  const cleanPhone = settings.whatsappNumber || settings.phoneNumber.replace(/[^0-9]/g, '') || '919878895539';

  return (
    <header className="sticky top-0 z-50 bg-[#FFFCFA] border-b border-[#F8E7EC] shadow-xs">
      {/* 1. Top Announcement Bar */}
      {settings.showAnnouncement && (
        <div className="bg-[#701F3D] text-[#FFFCFA] text-xs sm:text-sm py-2 px-4 transition-all">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-center sm:text-left">
              <Sparkles className="w-4 h-4 text-[#D6B36A] animate-pulse shrink-0" />
              <span className="font-medium tracking-wide">
                {settings.announcementText}
              </span>
            </div>

            <div className="flex items-center gap-3 sm:gap-4 text-xs font-normal">
              <a
                href={`tel:${settings.phoneNumber.replace(/\s+/g, '')}`}
                className="flex items-center gap-1 hover:text-[#D6B36A] transition-colors"
                title="Call Kreative Decor directly"
              >
                <Phone className="w-3.5 h-3.5 text-[#D6B36A]" />
                <span className="hidden md:inline">{settings.phoneNumber}</span>
              </a>
              <span className="text-white/30 hidden md:inline">|</span>
              <a
                href={`mailto:${settings.contactEmail}`}
                className="flex items-center gap-1 hover:text-[#D6B36A] transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-[#D6B36A]" />
                <span className="hidden lg:inline">{settings.contactEmail}</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* 2. Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-2 sm:gap-3 group shrink min-w-0 pr-1">
            <img
              src="/logo.png"
              alt="The Kreative Decor"
              className="h-8 sm:h-11 w-auto object-contain group-hover:scale-102 transition-transform duration-300"
            />
            <div className="hidden sm:block border-l border-gray-200 pl-2.5 min-w-0">
              <span className="text-[10px] uppercase tracking-wider text-[#701F3D] font-bold block leading-tight truncate">
                Theme Decor Specialist
              </span>
              <span className="text-[9px] uppercase tracking-widest text-gray-500 font-medium block truncate">
                Sector 51, Gurgaon
              </span>
            </div>
          </Link>

          {/* Desktop Nav Items: Home, Services (Dropdown), About Us, Contact Us */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-3 text-sm font-medium text-[#29252A]">
            <button
              onClick={() => scrollToSection('hero')}
              className="px-3.5 py-2 rounded-lg transition-colors hover:text-[#701F3D] hover:bg-[#F8E7EC]/40 cursor-pointer font-medium"
            >
              Home
            </button>

            {/* Services Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setServicesDropdownOpen(true)}
              onMouseLeave={() => setServicesDropdownOpen(false)}
            >
              <button
                onClick={() => scrollToSection('anniversary')}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg transition-colors hover:text-[#701F3D] hover:bg-[#F8E7EC]/40 cursor-pointer font-medium"
              >
                <span>Services</span>
                <ChevronDown className={`w-4 h-4 text-[#701F3D] transition-transform duration-200 ${servicesDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {servicesDropdownOpen && (
                <div className="absolute top-full left-0 w-80 bg-white rounded-2xl shadow-2xl border border-[#F8E7EC] p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150 space-y-1">
                  <div className="px-3 py-1 text-[11px] font-bold text-[#701F3D] uppercase tracking-wider border-b border-[#F8E7EC] mb-1">
                    Event Services
                  </div>
                  {serviceCategories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => scrollToSection(cat.id)}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs hover:bg-[#F8E7EC]/60 transition-colors flex items-start gap-2.5 group cursor-pointer"
                    >
                      <span className="text-base leading-none mt-0.5">{cat.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 group-hover:text-[#701F3D] transition-colors">
                          {cat.label}
                        </p>
                        <p className="text-[10px] text-gray-500 truncate">
                          {cat.desc}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => scrollToSection('about')}
              className="px-3.5 py-2 rounded-lg transition-colors hover:text-[#701F3D] hover:bg-[#F8E7EC]/40 cursor-pointer font-medium"
            >
              About Us
            </button>

            <button
              onClick={() => scrollToSection('contact')}
              className="px-3.5 py-2 rounded-lg transition-colors hover:text-[#701F3D] hover:bg-[#F8E7EC]/40 cursor-pointer font-medium"
            >
              Contact Us
            </button>
          </nav>

          {/* Action Buttons: Direct WhatsApp, Direct Call, Book Event */}
          <div className="flex items-center gap-2 shrink-0">
            {/* WhatsApp Direct Chat Button */}
            <a
              href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                'Hi Kreative Decor, I would like to inquire about event decoration packages in Gurgaon!'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#25D366] hover:bg-[#20b857] text-white text-xs font-semibold shadow-xs transition-all"
              title="Chat on WhatsApp"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span className="hidden sm:inline">WhatsApp</span>
            </a>

            {/* Call Now CTA */}
            <a
              href={`tel:${cleanPhone}`}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#F8E7EC] hover:bg-[#701F3D] text-[#701F3D] hover:text-white text-xs font-semibold border border-[#701F3D]/20 transition-all shadow-xs"
              title={`Call Us: ${settings.phoneNumber}`}
            >
              <Phone className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Call Us</span>
            </a>

            {/* Book Event CTA Button */}
            <button
              onClick={() => scrollToSection('contact')}
              className="hidden md:inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-[#701F3D] to-[#8A264B] text-white text-xs font-semibold shadow-md hover:shadow-lg hover:brightness-110 transition-all border border-[#D6B36A]/30 shrink-0 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#D6B36A]" />
              <span>Book Event</span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-[#701F3D] rounded-lg hover:bg-[#F8E7EC] transition-colors cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* 3. Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-[#F8E7EC] px-4 pt-3 pb-6 space-y-4 animate-in fade-in slide-in-from-top-4 duration-200 max-h-[85vh] overflow-y-auto">
          {/* Direct WhatsApp & Call Buttons in Mobile Drawer */}
          <div className="grid grid-cols-2 gap-2 pb-3 border-b border-[#F8E7EC]">
            <a
              href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                'Hi Kreative Decor, I want to book event decoration.'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 px-3 rounded-xl bg-[#25D366] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>WhatsApp</span>
            </a>

            <a
              href={`tel:${cleanPhone}`}
              className="py-2.5 px-3 rounded-xl bg-[#701F3D] text-white font-bold text-xs flex items-center justify-center gap-1.5"
            >
              <Phone className="w-4 h-4 text-[#D6B36A]" />
              <span>Call Us</span>
            </a>
          </div>

          {/* Navigation Links: Home, Services, About, Contact */}
          <div className="space-y-1">
            <button
              onClick={() => scrollToSection('hero')}
              className="w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-semibold text-gray-800 hover:bg-[#F8E7EC] hover:text-[#701F3D] transition-colors"
            >
              Home
            </button>

            <div className="py-1">
              <p className="px-3.5 text-[10px] font-bold text-[#701F3D] uppercase tracking-wider mb-1">
                Services (Tap to Scroll)
              </p>
              <div className="grid grid-cols-1 gap-1">
                {serviceCategories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => scrollToSection(cat.id)}
                    className="w-full text-left px-3.5 py-2 rounded-xl text-xs font-medium text-gray-700 hover:bg-[#F8E7EC] hover:text-[#701F3D] transition-colors flex items-center gap-2"
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => scrollToSection('about')}
              className="w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-semibold text-gray-800 hover:bg-[#F8E7EC] hover:text-[#701F3D] transition-colors"
            >
              About Us
            </button>

            <button
              onClick={() => scrollToSection('contact')}
              className="w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-semibold text-gray-800 hover:bg-[#F8E7EC] hover:text-[#701F3D] transition-colors"
            >
              Contact Us
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
