import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  ShieldCheck,
  CheckCircle,
  Heart,
  Instagram,
  Facebook,
  Youtube,
  Send,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Footer: React.FC = () => {
  const { settings } = useApp();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      setNewsletterSubmitted(true);
      setNewsletterEmail('');
      setTimeout(() => setNewsletterSubmitted(false), 5000);
    }
  };

  const cleanPhone = settings.phoneNumber.replace(/[^0-9]/g, '');

  return (
    <footer className="bg-[#29252A] text-[#FFFCFA] pt-16 pb-12 border-t-4 border-[#D6B36A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          {/* Col 1: Brand & Founder */}
          <div className="lg:col-span-2 space-y-4">
            <div className="space-y-3">
              <div className="inline-block bg-white px-3.5 py-2 rounded-2xl shadow-md">
                <img
                  src="/logo.png"
                  alt="The Kreative Decor"
                  className="h-9 sm:h-11 w-auto object-contain"
                />
              </div>
              <div>
                <span className="text-xs uppercase tracking-widest text-[#D6B36A] font-semibold block">
                  Bespoke Theme Decor Specialist • Sector 51, Gurgaon
                </span>
              </div>
            </div>

            <p className="text-sm text-gray-300 leading-relaxed max-w-sm">
              We make every celebration unforgettable. From dreamy birthdays and romantic candlelight suites to grand wedding stages, our team transforms spaces into breathtaking memories.
            </p>

            {/* Direct Connect Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                  'Hi Kreative Decor, I would like to inquire about event decoration packages for an upcoming celebration.'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#25D366] hover:bg-[#20b857] text-white text-xs font-semibold shadow-sm transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Us</span>
              </a>

              <a
                href={`tel:${cleanPhone}`}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#701F3D] hover:bg-[#8A264B] text-white text-xs font-semibold shadow-sm transition-all border border-[#D6B36A]/40"
              >
                <Phone className="w-4 h-4 text-[#D6B36A]" />
                <span>Call Now</span>
              </a>
            </div>

            <div className="flex items-center gap-3 text-xs text-gray-400 pt-2">
              <span>Primary Service Area:</span>
              <span className="text-[#D6B36A] font-medium">Sector 51, Gurgaon & Delhi NCR</span>
            </div>
          </div>

          {/* Col 2: Decoration Categories */}
          <div className="space-y-3">
            <h4 className="font-serif text-lg font-bold text-[#D6B36A] tracking-wide">
              Event Categories
            </h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <a href="/#birthday" className="hover:text-[#D6B36A] transition-colors">
                  Birthday Decoration
                </a>
              </li>
              <li>
                <a href="/#anniversary" className="hover:text-[#D6B36A] transition-colors">
                  Anniversary Decoration
                </a>
              </li>
              <li>
                <a href="/#baby-shower" className="hover:text-[#D6B36A] transition-colors">
                  Baby Shower Setups
                </a>
              </li>
              <li>
                <a href="/#baby-welcome" className="hover:text-[#D6B36A] transition-colors">
                  Baby Welcome Home
                </a>
              </li>
              <li>
                <a href="/#just-married" className="hover:text-[#D6B36A] transition-colors">
                  Just Married & Romantic Room
                </a>
              </li>
              <li>
                <a href="/#haldi-mehndi" className="hover:text-[#D6B36A] transition-colors">
                  Haldi & Mehndi Celebrations
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Quick Links & Support */}
          <div className="space-y-3">
            <h4 className="font-serif text-lg font-bold text-[#D6B36A] tracking-wide">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <a href="/#hero" className="hover:text-[#D6B36A] transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="/about" className="hover:text-[#D6B36A] transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="/#reviews" className="hover:text-[#D6B36A] transition-colors">
                  Client Reviews
                </a>
              </li>
              <li>
                <a href="/#faq" className="hover:text-[#D6B36A] transition-colors">
                  Booking FAQs
                </a>
              </li>
              <li>
                <a href="/#contact" className="hover:text-[#D6B36A] transition-colors">
                  Contact & Location
                </a>
              </li>
              <li>
                <a href="/#services" className="hover:text-[#D6B36A] transition-colors">
                  All Event Categories
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Newsletter */}
          <div className="space-y-4">
            <h4 className="font-serif text-lg font-bold text-[#D6B36A] tracking-wide">
              Direct Contact
            </h4>
            <div className="space-y-2.5 text-xs text-gray-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#D6B36A] shrink-0 mt-0.5" />
                <span>{settings.fullOfficeAddress}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#D6B36A] shrink-0" />
                <a href={`tel:${cleanPhone}`} className="hover:text-[#D6B36A]">
                  {settings.phoneNumber}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#D6B36A] shrink-0" />
                <a href={`mailto:${settings.contactEmail}`} className="hover:text-[#D6B36A]">
                  {settings.contactEmail}
                </a>
              </div>
            </div>

            {/* Newsletter */}
            <div className="pt-2">
              <p className="text-xs font-semibold text-[#D6B36A] mb-1.5 uppercase tracking-wider">
                Get Celebration Offers
              </p>
              {newsletterSubmitted ? (
                <div className="flex items-center gap-1.5 text-xs text-green-400 bg-green-900/30 p-2 rounded-lg border border-green-500/30">
                  <CheckCircle className="w-4 h-4" />
                  <span>Thank you! You will receive special festive discount codes.</span>
                </div>
              ) : (
                <form onSubmit={handleNewsletter} className="flex gap-1.5">
                  <input
                    type="email"
                    required
                    placeholder="Enter email address"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white/10 rounded-lg border border-white/20 text-white placeholder-gray-400 focus:outline-hidden focus:border-[#D6B36A]"
                  />
                  <button
                    type="submit"
                    className="p-2 bg-[#701F3D] hover:bg-[#8A264B] text-white rounded-lg transition-colors cursor-pointer"
                    title="Subscribe"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 gap-4">
          <p>
            © {new Date().getFullYear()} Webralecon India Pvt Ltd • Sector 51, Gurgaon. All rights reserved.
          </p>

          <div className="flex items-center gap-3 sm:gap-4 flex-wrap justify-center">
            <a
              href="mailto:webralecon@gmail.com"
              className="text-gray-400 hover:text-[#D6B36A] transition-colors"
            >
              Design by <span className="text-[#D6B36A] font-medium">webralecon@gmail.com</span>
            </a>
            <span>•</span>
            <Link to="/contact" className="hover:text-white transition-colors">
              Support
            </Link>
            <span>•</span>
            <Link
              to="/admin/login"
              className="text-gray-400 hover:text-[#D6B36A] transition-colors flex items-center gap-1"
            >
              <ShieldCheck className="w-3 h-3 text-[#D6B36A]" />
              <span>Admin Portal</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
