import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Sparkles,
  Phone,
  MessageCircle,
  Star,
  CheckCircle2,
  Clock,
  ShieldCheck,
  ChevronRight,
  MapPin,
  Send,
  PartyPopper,
  Heart,
  Baby,
  Footprints,
  Flower2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { TESTIMONIALS, FAQS } from '../data/initialData';
import { ServiceCard } from '../components/ServiceCard';
import { BookingModal } from '../components/BookingModal';
import { ServiceItem } from '../types';

export const HomePage: React.FC = () => {
  const { services, settings, addInquiry } = useApp();
  const location = useLocation();

  const [selectedServiceForBooking, setSelectedServiceForBooking] = useState<ServiceItem | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  // Quick Inquiry Form State
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryPhone, setInquiryPhone] = useState('');
  const [inquiryCategory, setInquiryCategory] = useState('Birthday Decoration');
  const [inquiryDate, setInquiryDate] = useState('');
  const [inquiryMessage, setInquiryMessage] = useState('');
  const [inquirySuccess, setInquirySuccess] = useState(false);

  // Smooth-scroll when URL has hash
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const el = document.getElementById(id);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 150);
      }
    }
  }, [location]);

  const cleanPhone = settings.whatsappNumber || settings.phoneNumber.replace(/[^0-9]/g, '') || '919878895539';

  const openBookingWithService = (service: ServiceItem) => {
    setSelectedServiceForBooking(service);
    setIsBookingModalOpen(true);
  };

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryName.trim() || !inquiryPhone.trim()) return;

    addInquiry({
      customerName: inquiryName.trim(),
      phone: inquiryPhone.trim(),
      email: '',
      eventCategory: inquiryCategory,
      eventDate: inquiryDate,
      estimatedBudget: 'Custom',
      message: inquiryMessage.trim() || 'Inquired via Homepage quick form.',
    });

    const waMsg = `🎉 *NEW EVENT DECORATION INQUIRY* 🎉
*The Kreative Decor (Sector 51, Gurgaon)*
-----------------------------------
👤 *Name:* ${inquiryName.trim()}
📱 *WhatsApp:* ${inquiryPhone.trim()}
🎈 *Occasion:* ${inquiryCategory}
${inquiryDate ? `🗓️ *Date:* ${inquiryDate}\n` : ''}📝 *Requirements:* ${inquiryMessage.trim() || 'Please share package details and pricing'}
-----------------------------------
Hi Kreative Decor, please share availability and quotation on WhatsApp!`;

    setInquirySuccess(true);
    const waLink = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(waMsg)}`;
    window.open(waLink, '_blank');
  };

  // Group exactly 4 items per dedicated section as requested in the audio
  const birthdayServices = services.filter((s) => s.category === 'birthday' && s.isPublished).slice(0, 4);
  const anniversaryServices = services.filter((s) => s.category === 'anniversary' && s.isPublished).slice(0, 4);
  const babyShowerServices = services.filter(
    (s) => s.category === 'baby-shower' && !s.title.toLowerCase().includes('welcome home') && s.isPublished
  ).slice(0, 4);
  const babyWelcomeServices = services.filter(
    (s) => (s.title.toLowerCase().includes('welcome') || s.slug.includes('welcome')) && s.isPublished
  ).slice(0, 4);
  const romanticServices = services.filter(
    (s) => (s.category === 'romantic' || s.title.toLowerCase().includes('rose petal') || s.title.toLowerCase().includes('canopy')) && s.isPublished
  ).slice(0, 4);
  const haldiServices = services.filter((s) => s.category === 'haldi' && s.isPublished).slice(0, 4);

  const categoriesOverview = [
    {
      id: 'birthday',
      label: 'Birthday Decoration',
      sub: 'Ring Arches & Neon',
      Icon: PartyPopper,
      badge: 'Popular',
      image: '/assets/aistudio/image_cba910e7.png',
    },
    {
      id: 'anniversary',
      label: 'Anniversary Decoration',
      sub: 'Cabana & Rose Petals',
      Icon: Heart,
      badge: 'Romantic',
      image: '/assets/aistudio/image_5c217f5c.png',
    },
    {
      id: 'baby-shower',
      label: 'Baby Shower',
      sub: 'Clouds & Marquee',
      Icon: Baby,
      badge: 'Pastel',
      image: '/assets/aistudio/image_adc4743b.png',
    },
    {
      id: 'baby-welcome',
      label: 'Baby Welcome',
      sub: 'Cradle & Entry Arch',
      Icon: Footprints,
      badge: 'Joyful',
      image: '/assets/aistudio/image_e4228c0c.png',
    },
    {
      id: 'just-married',
      label: 'Just Married & Room',
      sub: 'Canopy & Fairy Lights',
      Icon: Sparkles,
      badge: 'Intimate',
      image: '/assets/aistudio/image_9c505955.png',
    },
    {
      id: 'haldi-mehndi',
      label: 'Haldi & Mehndi',
      sub: 'Lotus Urli & Marigold',
      Icon: Flower2,
      badge: 'Traditional',
      image: '/assets/aistudio/image_0b93bff0.png',
    },
  ];

  return (
    <div className="space-y-16 lg:space-y-24 pb-16">
      {/* 1. Hero Banner (#hero) */}
      <section id="hero" className="relative min-h-[560px] lg:min-h-[640px] flex items-center justify-center overflow-hidden bg-[#29252A]">
        {/* Background image with cinematic gradient overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src={
              settings.heroBackgroundImage ||
              'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=2000&q=85'
            }
            alt="Luxury Event Decoration Setup"
            className="w-full h-full object-cover opacity-35 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#29252A] via-[#29252A]/80 to-transparent" />
          <div className="absolute inset-0 bg-radial from-transparent via-[#701F3D]/25 to-[#29252A]" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-12 pb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-[#D6B36A]/50 text-[#D6B36A] text-xs font-semibold mb-6 shadow-md">
            <Sparkles className="w-4 h-4 text-[#D6B36A]" />
            <span>
              {settings.heroBadgeText || 'The Kreative Decor • Bespoke Theme Decor Specialist • Sector 51, Gurgaon'}
            </span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-tight">
            {settings.heroTitle || 'We Make Every Celebration Unforgettable.'}
          </h1>

          <p className="mt-5 text-base sm:text-lg md:text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed font-light">
            From dreamy birthdays and romantic anniversaries to whimsical baby showers and auspicious haldi setups, our dedicated styling artisans turn your special occasions into magical memories.
          </p>

          {/* Quick CTA Action Bar */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <a
              href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                'Hi Kreative Decor Team, I would like to inquire about decoration packages for an upcoming celebration.'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-[#25D366] hover:bg-[#20b857] text-white font-bold text-sm shadow-xl transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>Book on WhatsApp</span>
            </a>

            <a
              href={`tel:${cleanPhone}`}
              className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-sm backdrop-blur-md border border-white/30 transition-all flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4 text-[#D6B36A]" />
              <span>Call: {settings.phoneNumber}</span>
            </a>

            <button
              onClick={() => {
                const el = document.getElementById('contact');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-gradient-to-r from-[#701F3D] to-[#8A264B] text-white font-semibold text-sm border border-[#D6B36A]/50 shadow-lg hover:brightness-110 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#D6B36A]" />
              <span>Get Free Quotation</span>
            </button>
          </div>

          {/* Trust Highlights */}
          <div className="mt-12 pt-8 border-t border-white/15 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto text-center">
            <div>
              <p className="font-serif text-2xl md:text-3xl font-bold text-[#D6B36A]">
                {settings.experienceYears || 7}+ Years
              </p>
              <p className="text-[11px] text-gray-300 uppercase tracking-wider mt-0.5">Experience</p>
            </div>
            <div>
              <p className="font-serif text-2xl md:text-3xl font-bold text-[#D6B36A]">
                {settings.completedEventsCount || 1450}+
              </p>
              <p className="text-[11px] text-gray-300 uppercase tracking-wider mt-0.5">Events Styled</p>
            </div>
            <div>
              <p className="font-serif text-2xl md:text-3xl font-bold text-[#D6B36A]">
                100%
              </p>
              <p className="text-[11px] text-gray-300 uppercase tracking-wider mt-0.5">On-Time Setup</p>
            </div>
            <div>
              <p className="font-serif text-2xl md:text-3xl font-bold text-[#D6B36A]">
                Gurgaon
              </p>
              <p className="text-[11px] text-gray-300 uppercase tracking-wider mt-0.5">& Delhi NCR</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. About Us Section (#about) */}
      <section id="about" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="bg-gradient-to-br from-[#FFFCFA] to-[#F8E7EC]/30 rounded-3xl p-6 sm:p-12 border border-[#F8E7EC] shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-center">
            <div className="lg:col-span-7 space-y-4">
              <span className="text-xs font-bold text-[#701F3D] uppercase tracking-widest bg-[#F8E7EC] px-3 py-1 rounded-full">
                About The Stylists
              </span>

              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#29252A] leading-tight">
                About The Kreative Decor • Bespoke Theme Stylists
              </h2>

              <p className="text-sm text-gray-700 leading-relaxed">
                {settings.aboutStory ||
                  'The Kreative Decor was born from a genuine passion to turn ordinary living spaces, hotel suites, banquet halls, and outdoor lawns into extraordinary celebratory realms. Serving Sector 51, Gurgaon, and across Delhi NCR, our dedicated styling artisans bring bespoke theme dreams to reality.'}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="flex items-start gap-2.5 bg-white p-3.5 rounded-xl border border-[#F8E7EC]">
                  <ShieldCheck className="w-5 h-5 text-[#701F3D] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-gray-900">Zero Wall & Paint Damage</p>
                    <p className="text-[11px] text-gray-500">Only removable painter-grade tapes & specialized mounts used.</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 bg-white p-3.5 rounded-xl border border-[#F8E7EC]">
                  <Clock className="w-5 h-5 text-[#701F3D] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-gray-900">Guaranteed On-Time Setup</p>
                    <p className="text-[11px] text-gray-500">Decor ready 1 hour before your guests arrive.</p>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <a
                  href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                    'Hi Kamal Kumar, I would like to know more about your decoration services in Gurgaon.'
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20b857] text-white text-xs font-bold shadow-sm transition-all flex items-center gap-2"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>Chat with Kamal Kumar</span>
                </a>

                <a
                  href={`tel:${cleanPhone}`}
                  className="px-5 py-2.5 rounded-xl bg-[#701F3D] hover:bg-[#8A264B] text-white text-xs font-bold shadow-sm transition-all flex items-center gap-2"
                >
                  <Phone className="w-4 h-4 text-[#D6B36A]" />
                  <span>Call: {settings.phoneNumber}</span>
                </a>
              </div>
            </div>

            <div className="lg:col-span-5 relative">
              <div className="aspect-4/3 rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                <img
                  src="/birthday/birthday15.jpeg"
                  alt="Kreative Decor Signature Setup by Kamal Kumar"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-4 -right-2 sm:-right-4 bg-[#701F3D] text-white p-4 rounded-2xl shadow-xl border border-[#D6B36A]/50 max-w-xs text-xs">
                <p className="font-serif font-bold text-sm text-[#D6B36A]">Direct Owner Commitment</p>
                <p className="text-gray-200 text-[11px] mt-0.5">Kamal Kumar personally oversees design curation and timeline commitments.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Services Categories Overview (#services) - Iconic Theme Navigation */}
      <section id="services" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-10">
          <span className="text-xs font-bold text-[#701F3D] uppercase tracking-widest bg-[#F8E7EC] px-3 py-1 rounded-full">
            Our Services
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#29252A]">
            Celebration Categories & Themes
          </h2>
          <p className="text-xs sm:text-sm text-gray-600">
            Tap any celebration icon to jump directly to its curated package setups.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-5">
          {categoriesOverview.map((cat) => {
            const IconComp = cat.Icon;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  const el = document.getElementById(cat.id);
                  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                className="group relative rounded-3xl bg-white border border-[#F8E7EC] hover:border-[#D6B36A] p-3.5 sm:p-4.5 shadow-xs hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 flex flex-col items-center text-center cursor-pointer overflow-visible"
              >
                {/* Top Badge */}
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#701F3D] bg-[#F8E7EC] px-2.5 py-0.5 rounded-full mb-3 shadow-2xs group-hover:bg-[#701F3D] group-hover:text-white transition-colors duration-300">
                  {cat.badge}
                </span>

                {/* Luxury Circular Avatar with Dual Gold & Wine Glow Ring */}
                <div className="relative mb-3">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full p-[3px] bg-gradient-to-tr from-[#D6B36A] via-[#E8C580] to-[#701F3D] shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all duration-300">
                    <div className="w-full h-full rounded-full overflow-hidden bg-gray-100 relative">
                      <img
                        src={cat.image}
                        alt={cat.label}
                        className="w-full h-full object-cover group-hover:scale-115 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 group-hover:opacity-20 transition-opacity" />
                    </div>
                  </div>
                  {/* Floating 3D Ruby-Gold Icon Badge */}
                  <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-[#701F3D] text-[#D6B36A] border-2 border-white shadow-md flex items-center justify-center group-hover:rotate-12 group-hover:scale-110 transition-transform duration-300">
                    <IconComp className="w-4 h-4" />
                  </div>
                </div>

                {/* Category Title */}
                <h3 className="font-serif font-bold text-xs sm:text-sm text-[#29252A] group-hover:text-[#701F3D] transition-colors leading-tight line-clamp-2 min-h-[2rem] flex items-center justify-center">
                  {cat.label}
                </h3>

                {/* Subtitle / Theme hint */}
                <span className="text-[10px] sm:text-[11px] text-[#701F3D] font-medium bg-[#F8E7EC]/70 group-hover:bg-[#F8E7EC] px-2 py-0.5 rounded-full mt-1.5 line-clamp-1 transition-colors">
                  {cat.sub}
                </span>

                {/* Action explore */}
                <div className="mt-3 pt-2 w-full border-t border-[#F8E7EC]/70 flex items-center justify-center gap-1 text-[11px] font-semibold text-[#701F3D] group-hover:text-[#D6B36A] transition-colors">
                  <span>Explore</span>
                  <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 4. Dedicated Section: Birthday Decoration (#birthday) - Exactly 4 cards */}
      <section id="birthday" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 pb-4 border-b border-[#F8E7EC]">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#701F3D] uppercase tracking-widest bg-[#F8E7EC] px-3 py-1 rounded-full mb-2">
              <span>🎈 Service Category</span>
              <span>•</span>
              <span>Birthday Specials</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#29252A]">
              Birthday Decoration Services
            </h2>
            <p className="text-sm text-gray-600 mt-1 max-w-2xl">
              Organic balloon arches, customized neon sign boards, pastel themes, and sequin shimmer walls.
            </p>
          </div>

          <a
            href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(
              'Hi Kreative Decor, I would like to book a Birthday Decoration setup in Gurgaon.'
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#25D366] text-white text-xs font-bold shadow-sm hover:bg-[#20b857] transition-all self-start md:self-auto"
          >
            <MessageCircle className="w-3.5 h-3.5 fill-current" />
            <span>Book Birthday on WhatsApp</span>
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {birthdayServices.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              onQuickBook={openBookingWithService}
            />
          ))}
        </div>
      </section>

      {/* 5. Dedicated Section: Anniversary Decoration (#anniversary) - Exactly 4 cards */}
      <section id="anniversary" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 pb-4 border-b border-[#F8E7EC]">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#701F3D] uppercase tracking-widest bg-[#F8E7EC] px-3 py-1 rounded-full mb-2">
              <span>💖 Service Category</span>
              <span>•</span>
              <span>Anniversary & Milestones</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#29252A]">
              Anniversary Decoration Services
            </h2>
            <p className="text-sm text-gray-600 mt-1 max-w-2xl">
              Romantic terrace sunset cabanas, golden jubilee setups, fresh rose petal pathways, and candlelight suites.
            </p>
          </div>

          <a
            href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(
              'Hi Kreative Decor, I would like to book an Anniversary Decoration setup in Gurgaon.'
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#25D366] text-white text-xs font-bold shadow-sm hover:bg-[#20b857] transition-all self-start md:self-auto"
          >
            <MessageCircle className="w-3.5 h-3.5 fill-current" />
            <span>Book Anniversary on WhatsApp</span>
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {anniversaryServices.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              onQuickBook={openBookingWithService}
            />
          ))}
        </div>
      </section>

      {/* 6. Dedicated Section: Baby Shower Decoration (#baby-shower) - Exactly 4 cards */}
      <section id="baby-shower" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 pb-4 border-b border-[#F8E7EC]">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#701F3D] uppercase tracking-widest bg-[#F8E7EC] px-3 py-1 rounded-full mb-2">
              <span>🍼 Service Category</span>
              <span>•</span>
              <span>Mom-to-Be Celebrations</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#29252A]">
              Baby Shower Decoration Setups
            </h2>
            <p className="text-sm text-gray-600 mt-1 max-w-2xl">
              Pastel hot air balloon clouds, illuminated 3D "B-A-B-Y" marquee light blocks, and whimsical safari animal cutouts.
            </p>
          </div>

          <a
            href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(
              'Hi Kreative Decor, I would like to book a Baby Shower Decoration setup.'
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#25D366] text-white text-xs font-bold shadow-sm hover:bg-[#20b857] transition-all self-start md:self-auto"
          >
            <MessageCircle className="w-3.5 h-3.5 fill-current" />
            <span>Book Baby Shower on WhatsApp</span>
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {babyShowerServices.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              onQuickBook={openBookingWithService}
            />
          ))}
        </div>
      </section>

      {/* 7. Dedicated Section: Baby Welcome Home (#baby-welcome) - Exactly 4 cards */}
      <section id="baby-welcome" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 pb-4 border-b border-[#F8E7EC]">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#701F3D] uppercase tracking-widest bg-[#F8E7EC] px-3 py-1 rounded-full mb-2">
              <span>👶 Service Category</span>
              <span>•</span>
              <span>Heartfelt Homecoming</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#29252A]">
              Baby Welcome Home Decorations
            </h2>
            <p className="text-sm text-gray-600 mt-1 max-w-2xl">
              Heartwarming arrival decor with cradle flower dressing, entrance balloon doorway arches, and welcome baby signage.
            </p>
          </div>

          <a
            href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(
              'Hi Kreative Decor, I would like to book a Baby Welcome Home Decoration setup.'
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#25D366] text-white text-xs font-bold shadow-sm hover:bg-[#20b857] transition-all self-start md:self-auto"
          >
            <MessageCircle className="w-3.5 h-3.5 fill-current" />
            <span>Book Baby Welcome on WhatsApp</span>
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {babyWelcomeServices.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              onQuickBook={openBookingWithService}
            />
          ))}
        </div>
      </section>

      {/* 8. Dedicated Section: Just Married & Romantic Room (#just-married) - Exactly 4 cards */}
      <section id="just-married" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 pb-4 border-b border-[#F8E7EC]">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#701F3D] uppercase tracking-widest bg-[#F8E7EC] px-3 py-1 rounded-full mb-2">
              <span>🌹 Service Category</span>
              <span>•</span>
              <span>Intimate Romance</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#29252A]">
              Just Married & Romantic Room Decor
            </h2>
            <p className="text-sm text-gray-600 mt-1 max-w-2xl">
              Dreamy fairy-light net canopies, Dutch rose petal pathways, tea-light candle pathways, and heart helium ceiling balloon setups.
            </p>
          </div>

          <a
            href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(
              'Hi Kreative Decor, I would like to book a Just Married / Romantic Room Decoration setup.'
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#25D366] text-white text-xs font-bold shadow-sm hover:bg-[#20b857] transition-all self-start md:self-auto"
          >
            <MessageCircle className="w-3.5 h-3.5 fill-current" />
            <span>Book Romantic Room on WhatsApp</span>
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {romanticServices.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              onQuickBook={openBookingWithService}
            />
          ))}
        </div>
      </section>

      {/* 9. Dedicated Section: Haldi & Mehndi (#haldi-mehndi) - Exactly 4 cards */}
      <section id="haldi-mehndi" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 pb-4 border-b border-[#F8E7EC]">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#701F3D] uppercase tracking-widest bg-[#F8E7EC] px-3 py-1 rounded-full mb-2">
              <span>🌼 Service Category</span>
              <span>•</span>
              <span>Traditional Ceremonies</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#29252A]">
              Haldi & Mehndi Decoration Setups
            </h2>
            <p className="text-sm text-gray-600 mt-1 max-w-2xl">
              Vibrant yellow & orange marigold tassels, authentic royal brass urlis with fresh rose petals, canopy draping, and festive photobooths.
            </p>
          </div>

          <a
            href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(
              'Hi Kreative Decor, I would like to book a Haldi & Mehndi Decoration setup.'
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#25D366] text-white text-xs font-bold shadow-sm hover:bg-[#20b857] transition-all self-start md:self-auto"
          >
            <MessageCircle className="w-3.5 h-3.5 fill-current" />
            <span>Book Haldi Setup on WhatsApp</span>
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {haldiServices.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              onQuickBook={openBookingWithService}
            />
          ))}
        </div>
      </section>

      {/* 10. Customer Reviews & Testimonials (#reviews) */}
      <section id="reviews" className="bg-white py-16 border-y border-[#F8E7EC] scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
            <span className="text-xs font-bold text-[#701F3D] uppercase tracking-widest bg-[#F8E7EC] px-3 py-1 rounded-full">
              Real Experiences
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#29252A]">
              What Our Happy Clients Say
            </h2>
            <p className="text-sm text-gray-600">
              Verified feedback from families and couples in Gurgaon & Delhi NCR who celebrated with Kreative Decor.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.id}
                className="bg-[#FFFCFA] p-6 rounded-2xl border border-[#F8E7EC] shadow-xs flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-1 text-[#D6B36A]">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-xs text-gray-700 italic leading-relaxed">
                    "{t.comment}"
                  </p>
                </div>

                <div className="pt-3 border-t border-[#F8E7EC] space-y-0.5">
                  <p className="text-xs font-bold text-[#29252A]">{t.name}</p>
                  <p className="text-[11px] text-[#701F3D] font-medium">{t.event}</p>
                  <p className="text-[10px] text-gray-400">{t.location} • {t.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 11. Frequently Asked Questions (#faq) */}
      <section id="faq" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="text-center space-y-3 mb-10">
          <span className="text-xs font-bold text-[#701F3D] uppercase tracking-widest bg-[#F8E7EC] px-3 py-1 rounded-full">
            Got Questions?
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#29252A]">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-gray-600">
            Timelines, customization options, safety guarantees, and advance booking policies.
          </p>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, i) => (
            <details
              key={i}
              className="group bg-white rounded-2xl border border-[#F8E7EC] p-5 [&_summary::-webkit-details-marker]:hidden shadow-xs"
            >
              <summary className="flex items-center justify-between cursor-pointer font-serif text-base font-bold text-[#29252A] group-open:text-[#701F3D]">
                <span>{faq.q}</span>
                <span className="text-lg font-mono text-[#701F3D] group-open:rotate-45 transition-transform">
                  +
                </span>
              </summary>
              <p className="mt-3 text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-[#F8E7EC] pt-3">
                {faq.a}
              </p>
            </details>
          ))}
        </div>
      </section>

      {/* 12. Contact & Quick Inquiry Section (#contact) */}
      <section id="contact" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="bg-[#29252A] text-white rounded-3xl p-6 sm:p-12 border-2 border-[#D6B36A] shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Col: Contact info */}
            <div className="lg:col-span-5 space-y-5">
              <span className="text-xs font-bold uppercase tracking-widest text-[#D6B36A] bg-white/10 px-3 py-1 rounded-full">
                Get In Touch
              </span>

              <h2 className="font-serif text-3xl sm:text-4xl font-bold leading-tight">
                Plan Your Event with Kreative Decor
              </h2>

              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                Send your date and celebration requirements to get instant pricing, customized color themes, and date confirmation.
              </p>

              <div className="space-y-3 pt-2 text-xs text-gray-200">
                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-[#D6B36A] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-white">Call Directly</p>
                    <a href={`tel:${cleanPhone}`} className="text-gray-300 hover:text-white transition-colors">
                      {settings.phoneNumber}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MessageCircle className="w-4 h-4 text-[#25D366] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-white">Direct WhatsApp</p>
                    <a
                      href={`https://wa.me/${cleanPhone}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#25D366] hover:underline"
                    >
                      Chat on WhatsApp (+91 98788 95539)
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#D6B36A] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-white">Office Location</p>
                    <p className="text-gray-300">
                      {settings.fullOfficeAddress || 'Sector 51, Gurgaon'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap gap-3">
                <a
                  href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                    'Hi Kreative Decor, I would like to book an event decoration.'
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 rounded-xl bg-[#25D366] hover:bg-[#20b857] text-white text-xs font-bold shadow-md transition-all flex items-center gap-2"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>WhatsApp Us Directly</span>
                </a>

                <a
                  href={`tel:${cleanPhone}`}
                  className="px-6 py-3 rounded-xl bg-[#701F3D] hover:bg-[#8A264B] text-white text-xs font-bold shadow-md transition-all border border-[#D6B36A]/40 flex items-center gap-2"
                >
                  <Phone className="w-4 h-4 text-[#D6B36A]" />
                  <span>Call Now</span>
                </a>
              </div>
            </div>

            {/* Right Col: Fast Inquiry Form */}
            <div className="lg:col-span-7 bg-white text-gray-900 p-6 sm:p-8 rounded-2xl shadow-xl">
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#701F3D] mb-1">
                Fast Event Booking Request
              </h3>
              <p className="text-xs text-gray-500 mb-5">
                Fill this 1-minute form to receive immediate quotation on WhatsApp.
              </p>

              {inquirySuccess && (
                <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Inquiry sent successfully! WhatsApp chat opened with your details.</span>
                </div>
              )}

              <form onSubmit={handleInquirySubmit} className="space-y-3.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={inquiryName}
                      onChange={(e) => setInquiryName(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-300 focus:border-[#701F3D] focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      WhatsApp Mobile Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={inquiryPhone}
                      onChange={(e) => setInquiryPhone(e.target.value)}
                      placeholder="e.g. 98765 43210"
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-300 focus:border-[#701F3D] focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Celebration Occasion *
                    </label>
                    <select
                      value={inquiryCategory}
                      onChange={(e) => setInquiryCategory(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-300 focus:border-[#701F3D] focus:outline-hidden bg-white"
                    >
                      <option value="Birthday Decoration">Birthday Decoration</option>
                      <option value="Anniversary Decoration">Anniversary Decoration</option>
                      <option value="Baby Shower Setup">Baby Shower Setup</option>
                      <option value="Baby Welcome Home">Baby Welcome Home</option>
                      <option value="Just Married / Romantic Room">Just Married / Romantic Room</option>
                      <option value="Haldi & Mehndi Ceremony">Haldi & Mehndi Ceremony</option>
                      <option value="Other Customized Celebration">Other Customized Celebration</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Target Date (Optional)
                    </label>
                    <input
                      type="date"
                      value={inquiryDate}
                      onChange={(e) => setInquiryDate(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-300 focus:border-[#701F3D] focus:outline-hidden bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Venue or Special Preferences
                  </label>
                  <textarea
                    rows={2}
                    value={inquiryMessage}
                    onChange={(e) => setInquiryMessage(e.target.value)}
                    placeholder="e.g. Living room setup in Sector 54 Gurgaon, pastel theme..."
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-300 focus:border-[#701F3D] focus:outline-hidden resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20b857] text-white text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit & Open WhatsApp Quotation</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        service={selectedServiceForBooking}
      />
    </div>
  );
};
