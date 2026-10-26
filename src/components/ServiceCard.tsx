import React from 'react';
import { MessageCircle, Sparkles } from 'lucide-react';
import { ServiceItem } from '../types';
import { useApp } from '../context/AppContext';

interface ServiceCardProps {
  service: ServiceItem;
  onQuickBook?: (service: ServiceItem) => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service, onQuickBook }) => {
  const { settings } = useApp();

  const cleanPhone = settings.whatsappNumber || settings.phoneNumber.replace(/[^0-9]/g, '') || '919878895539';

  const handleWhatsAppBook = (e: React.MouseEvent) => {
    e.stopPropagation();
    const msg = `🎉 Hi Kreative Decor, I want to book "${service.title}" (${service.categoryLabel}) in Gurgaon. Please share details and availability!`;
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const handleCardClick = () => {
    if (onQuickBook) {
      onQuickBook(service);
    } else {
      const msg = `🎉 Hi Kreative Decor, I want to book "${service.title}" (${service.categoryLabel}) in Gurgaon. Please share details and availability!`;
      window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`, '_blank');
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className="group bg-white rounded-2xl overflow-hidden border border-[#F8E7EC] shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col h-full transform hover:-translate-y-1 cursor-pointer"
    >
      {/* Image Container */}
      <div className="relative aspect-4/3 w-full overflow-hidden bg-gray-100">
        <img
          src={service.image}
          alt={service.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            const target = e.currentTarget;
            if (!target.dataset.fallbackApplied) {
              target.dataset.fallbackApplied = 'true';
              if (service.category === 'anniversary') {
                target.src = '/anniversary/anniversary1.jpeg';
              } else if (service.category === 'balloon') {
                target.src = '/balloon/balloon_restaurant_hall.jpg';
              } else if (service.category === 'baby-shower') {
                target.src = '/babyshower/baby_24x7_18.png';
              } else if (service.category === 'wedding') {
                target.src = '/wedding/wedding_mandap_stage.jpg';
              } else {
                target.src = '/birthday15.jpeg';
              }
            }
          }}
        />

        {/* Overlay Category Tag */}
        <div className="absolute top-3 left-3 z-10">
          <span className="px-2.5 py-1 rounded-full bg-[#701F3D]/90 text-white text-[11px] font-semibold backdrop-blur-xs tracking-wide">
            {service.categoryLabel}
          </span>
        </div>
      </div>

      {/* Content: Title, Description, and Book Button only */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          {/* Title */}
          <h3 className="font-serif text-lg font-bold text-[#29252A] group-hover:text-[#701F3D] transition-colors line-clamp-1">
            {service.title}
          </h3>

          {/* Description */}
          <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
            {service.shortDescription}
          </p>
        </div>

        {/* Action: Book on WhatsApp Button */}
        <div className="pt-3 border-t border-[#F8E7EC]">
          <button
            onClick={handleWhatsAppBook}
            className="w-full py-2.5 px-3 rounded-xl bg-[#25D366] hover:bg-[#20b857] text-white text-xs font-bold text-center shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 fill-current" />
            <span>Book on WhatsApp</span>
          </button>
        </div>
      </div>
    </div>
  );
};
