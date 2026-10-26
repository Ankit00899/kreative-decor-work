import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  ServiceItem,
  Booking,
  BookingStatus,
  Inquiry,
  InquiryStatus,
  User,
  CartItem,
  Order,
  GalleryItem,
  Coupon,
  WebsiteSettings,
  ServiceAddon,
} from '../types';
import {
  INITIAL_SERVICES,
  INITIAL_GALLERY,
  INITIAL_COUPONS,
  INITIAL_SETTINGS,
} from '../data/initialData';

interface AppContextType {
  // Services
  services: ServiceItem[];
  addService: (service: Omit<ServiceItem, 'id' | 'createdAt'>) => ServiceItem;
  updateService: (service: ServiceItem) => void;
  deleteService: (id: string) => void;
  getServiceById: (id: string) => ServiceItem | undefined;

  // Bookings
  bookings: Booking[];
  addBooking: (bookingInput: Omit<Booking, 'id' | 'referenceNumber' | 'status' | 'statusHistory' | 'createdAt'>) => Booking;
  updateBookingStatus: (id: string, status: BookingStatus, note?: string) => void;
  updateBookingNotes: (id: string, internalNotes: string) => void;
  deleteBooking: (id: string) => void;

  // Inquiries
  inquiries: Inquiry[];
  addInquiry: (inquiryInput: Omit<Inquiry, 'id' | 'referenceNumber' | 'status' | 'createdAt'>) => Inquiry;
  updateInquiryStatus: (id: string, status: InquiryStatus, internalNotes?: string, followUpDate?: string) => void;
  deleteInquiry: (id: string) => void;

  // Gallery
  gallery: GalleryItem[];
  addGalleryItem: (item: Omit<GalleryItem, 'id'>) => GalleryItem;
  updateGalleryItem: (item: GalleryItem) => void;
  deleteGalleryItem: (id: string) => void;

  // Reset & Backup
  resetToDefaults: () => void;

  // Coupons
  coupons: Coupon[];
  validateCoupon: (code: string, subtotal: number) => { valid: boolean; discount: number; message: string; coupon?: Coupon };
  addCoupon: (coupon: Omit<Coupon, 'id'>) => void;
  deleteCoupon: (id: string) => void;

  // Settings
  settings: WebsiteSettings;
  updateSettings: (newSettings: Partial<WebsiteSettings>) => void;

  // Cart & Wishlist
  cart: CartItem[];
  addToCart: (service: ServiceItem, addons?: ServiceAddon[], eventDate?: string, quantity?: number) => void;
  removeFromCart: (serviceId: string) => void;
  updateCartQuantity: (serviceId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  wishlist: string[];
  toggleWishlist: (serviceId: string) => void;
  isInWishlist: (serviceId: string) => boolean;

  // Orders
  orders: Order[];
  createOrder: (orderInput: Omit<Order, 'id' | 'orderNumber' | 'createdAt'>) => Order;

  // Authentication
  currentUser: User | null;
  loginUser: (email: string, password?: string) => Promise<{ success: boolean; message: string }>;
  signupUser: (name: string, email: string, phone: string, password?: string) => Promise<{ success: boolean; message: string }>;
  logoutUser: () => void;
  updateUserProfile: (data: Partial<User>) => void;

  // Admin Auth
  isAdminLoggedIn: boolean;
  adminUser: { email: string; name: string } | null;
  loginAdmin: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  logoutAdmin: () => void;

  // Helpers
  formatPrice: (amount: number) => string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const INITIAL_SAMPLE_BOOKINGS: Booking[] = [
  {
    id: 'b-101',
    referenceNumber: 'AED-2025-8831',
    serviceId: 'premium-birthday-decor',
    serviceTitle: 'Premium Ring Arch Birthday Backdrop',
    customerName: 'Priya Sharma',
    customerEmail: 'priya.sharma@example.com',
    customerPhone: '+91 98112 33445',
    eventType: 'Birthday Party',
    eventDate: '2025-03-28',
    eventTime: '05:30 PM',
    eventCity: 'Gurgaon',
    fullAddress: 'Tower B, Flat 402, DLF Phase 5, Sector 54, Gurgaon',
    expectedBudget: 5500,
    guestCount: 25,
    decorationPreferences: 'Rose gold, champagne gold, customized neon sign with name "Aarav turns 5"',
    additionalRequirements: 'Needs to be completed before 4:30 PM for cake photoshoot.',
    selectedAddons: [
      { name: 'Personalized Welcome Easel Board', price: 799 },
    ],
    status: 'Confirmed',
    statusHistory: [
      { status: 'Pending', timestamp: '2025-03-10T11:00:00Z', updatedBy: 'System' },
      { status: 'Confirmed', timestamp: '2025-03-11T09:30:00Z', note: 'Customer paid 30% advance via UPI. Team assigned.', updatedBy: 'Admin Team' },
    ],
    internalNotes: 'Staff Rohit & Manoj scheduled. Setup start time 2:00 PM.',
    totalEstimatedAmount: 5298,
    createdAt: '2025-03-10T11:00:00Z',
  },
  {
    id: 'b-102',
    referenceNumber: 'AED-2025-9120',
    serviceId: 'anniversary-room-decor',
    serviceTitle: 'Romantic Candlelight & Rose Petal Room Decor',
    customerName: 'Kabir Singhania',
    customerEmail: 'kabir.s@example.com',
    customerPhone: '+91 97110 56789',
    eventType: '1st Anniversary Surprise',
    eventDate: '2025-04-02',
    eventTime: '07:00 PM',
    eventCity: 'Delhi',
    fullAddress: 'House 14, Greater Kailash 1, New Delhi',
    expectedBudget: 4000,
    guestCount: 2,
    decorationPreferences: 'Deep red roses, warm fairy lights, memory clips on wall.',
    additionalRequirements: 'Strict secret setup while wife is at work.',
    selectedAddons: [
      { name: '30 Premium Red Rose Bouquet', price: 999 },
    ],
    status: 'Pending',
    statusHistory: [
      { status: 'Pending', timestamp: '2025-03-15T14:20:00Z', updatedBy: 'System' },
    ],
    internalNotes: 'Customer requested quick call back regarding gate entry permissions.',
    totalEstimatedAmount: 4198,
    createdAt: '2025-03-15T14:20:00Z',
  },
  {
    id: 'b-103',
    referenceNumber: 'AED-2025-9344',
    serviceId: 'wedding-stage-decor',
    serviceTitle: 'Grand Royal Mandap & Reception Stage Setup',
    customerName: 'Aditya & Ritu Mehra',
    customerEmail: 'mehra.events@example.com',
    customerPhone: '+91 99551 22334',
    eventType: 'Wedding Reception',
    eventDate: '2025-04-18',
    eventTime: '06:00 PM',
    eventCity: 'Lucknow',
    fullAddress: 'The Imperial Lawn, Shaheed Path, Lucknow',
    expectedBudget: 35000,
    guestCount: 400,
    decorationPreferences: 'Royal brass heritage look with mogra & marigold fresh flowers and velvet couch.',
    additionalRequirements: 'Low fog machine needed during groom & bride stage entry.',
    selectedAddons: [
      { name: 'Heavy Low Dry-Ice Cloud Fog for Couple Dance', price: 4999 },
      { name: '8 Synchronized Cold Pyro Fountains', price: 3499 },
    ],
    status: 'In Progress',
    statusHistory: [
      { status: 'Pending', timestamp: '2025-03-01T10:00:00Z', updatedBy: 'System' },
      { status: 'Confirmed', timestamp: '2025-03-02T16:00:00Z', note: 'Advance received ₹10,000.', updatedBy: 'Admin Team' },
      { status: 'In Progress', timestamp: '2025-03-12T12:00:00Z', note: 'Floral procurement and carpentry framing finalized.', updatedBy: 'Admin Team' },
    ],
    internalNotes: 'Site visit completed with venue manager. Extra generator approved.',
    totalEstimatedAmount: 33497,
    createdAt: '2025-03-01T10:00:00Z',
  },
  {
    id: 'b-104',
    referenceNumber: 'AED-2025-7809',
    serviceId: 'baby-shower-decor',
    serviceTitle: 'Dreamy Cloud & Hot Air Balloon Baby Shower',
    customerName: 'Sunita Arora',
    customerEmail: 'sunita.arora@example.com',
    customerPhone: '+91 98990 11223',
    eventType: 'Baby Shower',
    eventDate: '2025-02-14',
    eventTime: '04:00 PM',
    eventCity: 'Gurugram',
    fullAddress: 'Clubhouse, Nirvana Country, Sector 50, Gurugram',
    expectedBudget: 7500,
    guestCount: 45,
    decorationPreferences: 'Mint and pastel yellow, cloud arches.',
    additionalRequirements: 'Mom-to-be throne chair included.',
    status: 'Completed',
    statusHistory: [
      { status: 'Pending', timestamp: '2025-02-05T09:00:00Z', updatedBy: 'System' },
      { status: 'Confirmed', timestamp: '2025-02-06T11:00:00Z', updatedBy: 'Admin Team' },
      { status: 'Completed', timestamp: '2025-02-14T20:00:00Z', note: 'Event concluded smoothly. Customer left 5 star review.', updatedBy: 'Admin Team' },
    ],
    internalNotes: 'All props returned to warehouse in top condition.',
    totalEstimatedAmount: 7498,
    createdAt: '2025-02-05T09:00:00Z',
  },
];

const INITIAL_SAMPLE_INQUIRIES: Inquiry[] = [
  {
    id: 'inq-1',
    referenceNumber: 'INQ-2025-3011',
    customerName: 'Harsh Vardhan',
    email: 'harsh.v@gmail.com',
    phone: '+91 98101 98101',
    eventCategory: 'Corporate & Anniversary Gala',
    eventDate: '2025-04-12',
    estimatedBudget: '₹15,000 - ₹20,000',
    message: 'We are organizing our 10th startup anniversary at a terrace venue in DLF Phase 5. Need customized branding, ambient lighting, and floral stage.',
    status: 'New',
    createdAt: '2025-03-18T10:30:00Z',
  },
  {
    id: 'inq-2',
    referenceNumber: 'INQ-2025-2984',
    customerName: 'Meenakshi Iyer',
    email: 'meenakshi.iyer@yahoo.com',
    phone: '+91 99100 44556',
    eventCategory: 'Romantic Room Decoration',
    eventDate: '2025-03-30',
    estimatedBudget: '₹3,000 - ₹5,000',
    message: 'Want to decorate our hotel room in Gurgaon for my husband’s birthday surprise. Can you provide helium balloons and red rose pathway?',
    status: 'Contacted',
    internalNotes: 'Spoke over phone. Shared package PDF via WhatsApp.',
    followUpDate: '2025-03-22',
    createdAt: '2025-03-16T15:45:00Z',
  },
  {
    id: 'inq-3',
    referenceNumber: 'INQ-2025-2910',
    customerName: 'Rajeev Malhotra',
    email: 'rajeev.m@outlook.com',
    phone: '+91 98200 33445',
    eventCategory: 'Wedding Stage Decoration',
    eventDate: '2025-05-10',
    estimatedBudget: '₹40,000+',
    message: 'Looking for turnkey floral setup and mandap decoration for a destination wedding in Lucknow.',
    status: 'Converted',
    internalNotes: 'Converted to formal booking. Advanced discussion with venue manager.',
    createdAt: '2025-03-12T11:20:00Z',
  },
];

const CURRENT_DATA_VERSION = '2026-10-24-v30-sector51-gurgaon-clean-address';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Services
  const [services, setServices] = useState<ServiceItem[]>(() => {
    try {
      const storedVersion = localStorage.getItem('aed_data_version');
      if (storedVersion !== CURRENT_DATA_VERSION) {
        localStorage.setItem('aed_data_version', CURRENT_DATA_VERSION);
        localStorage.setItem('aed_services', JSON.stringify(INITIAL_SERVICES));
        localStorage.setItem('aed_gallery', JSON.stringify(INITIAL_GALLERY));
        localStorage.setItem('aed_settings', JSON.stringify(INITIAL_SETTINGS));
        localStorage.setItem('aed_coupons', JSON.stringify(INITIAL_COUPONS));
        // Clear old mock demo user
        localStorage.removeItem('aed_current_user');
        return INITIAL_SERVICES;
      }
    } catch {}

    const saved = localStorage.getItem('aed_services');
    if (!saved) return INITIAL_SERVICES;
    try {
      const parsed: ServiceItem[] = JSON.parse(saved);
      // Filter out purged categories
      const cleanParsed = parsed.filter((s) => s.category !== 'surprise' && s.id !== 'surprise-party-decor');
      // Update existing services with new data if they exist in INITIAL_SERVICES
      const updatedExisting = cleanParsed.map((item) => {
        const initial = INITIAL_SERVICES.find((s) => s.id === item.id);
        if (initial) {
          return {
            ...item,
            title: initial.title,
            image: initial.image,
            additionalImages: initial.additionalImages,
            startingPrice: initial.startingPrice,
            discountPrice: initial.discountPrice,
            shortDescription: initial.shortDescription,
            fullDescription: initial.fullDescription,
            inclusions: initial.inclusions,
            customizationOptions: initial.customizationOptions,
          };
        }
        return item;
      });
      // Append any new services from INITIAL_SERVICES that aren't in parsed
      const existingIds = new Set(cleanParsed.map((s) => s.id));
      const newServices = INITIAL_SERVICES.filter((s) => !existingIds.has(s.id));
      return [...updatedExisting, ...newServices];
    } catch {
      return INITIAL_SERVICES;
    }
  });

  // Bookings
  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem('aed_bookings');
    return saved ? JSON.parse(saved) : INITIAL_SAMPLE_BOOKINGS;
  });

  // Inquiries
  const [inquiries, setInquiries] = useState<Inquiry[]>(() => {
    const saved = localStorage.getItem('aed_inquiries');
    return saved ? JSON.parse(saved) : INITIAL_SAMPLE_INQUIRIES;
  });

  // Gallery
  const [gallery, setGallery] = useState<GalleryItem[]>(() => {
    try {
      const storedVersion = localStorage.getItem('aed_data_version');
      if (storedVersion !== CURRENT_DATA_VERSION) {
        return INITIAL_GALLERY;
      }
    } catch {}

    const saved = localStorage.getItem('aed_gallery');
    if (!saved) return INITIAL_GALLERY;
    try {
      const parsed: GalleryItem[] = JSON.parse(saved);
      const cleanParsed = parsed.filter((g) => g.category !== 'surprise' && g.id !== 'g-5');
      const updatedExisting = cleanParsed.map((item) => {
        const initial = INITIAL_GALLERY.find((g) => g.id === item.id);
        if (initial) {
          return {
            ...item,
            imageUrl: initial.imageUrl,
            title: initial.title,
            description: initial.description,
            eventLocation: initial.eventLocation,
          };
        }
        return item;
      });
      const existingIds = new Set(cleanParsed.map((g) => g.id));
      const newItems = INITIAL_GALLERY.filter((g) => !existingIds.has(g.id));
      return [...updatedExisting, ...newItems];
    } catch {
      return INITIAL_GALLERY;
    }
  });

  // Coupons
  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    const saved = localStorage.getItem('aed_coupons');
    return saved ? JSON.parse(saved) : INITIAL_COUPONS;
  });

  // Settings
  const [settings, setSettings] = useState<WebsiteSettings>(() => {
    const saved = localStorage.getItem('aed_settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Force update to The Kreative Decor, phone 9878895539, address Sector 51, Gurgaon
        if (
          !parsed.phoneNumber ||
          parsed.phoneNumber.includes('96502') ||
          parsed.phoneNumber.includes('4645') ||
          parsed.businessName !== 'The Kreative Decor' ||
          parsed.fullOfficeAddress?.includes('Sector 7') ||
          parsed.fullOfficeAddress?.includes('Sector 12') ||
          parsed.fullOfficeAddress?.includes('122003') ||
          !parsed.fullOfficeAddress?.includes('Sector 51') ||
          parsed.fullOfficeAddress?.includes('Noida') ||
          parsed.heroBadgeText?.includes('Noida') ||
          parsed.heroBadgeText?.includes('Sector 7')
        ) {
          localStorage.setItem('aed_settings', JSON.stringify(INITIAL_SETTINGS));
          return INITIAL_SETTINGS;
        }
        return {
          ...INITIAL_SETTINGS,
          ...parsed,
          businessName: 'The Kreative Decor',
          ownerName: 'Kamal Kumar',
          phoneNumber: '+91 98788 95539',
          whatsappNumber: '919878895539',
          fullOfficeAddress: 'Sector 51, Gurgaon',
          heroBadgeText: INITIAL_SETTINGS.heroBadgeText,
          aboutStory: INITIAL_SETTINGS.aboutStory,
          citiesServed: INITIAL_SETTINGS.citiesServed,
        };
      } catch (e) {
        return INITIAL_SETTINGS;
      }
    }
    return INITIAL_SETTINGS;
  });

  // Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('aed_cart');
    return saved ? JSON.parse(saved) : [];
  });

  // Wishlist
  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('aed_wishlist');
    return saved ? JSON.parse(saved) : ['premium-birthday-decor', 'anniversary-room-decor'];
  });

  // Orders
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('aed_orders');
    return saved ? JSON.parse(saved) : [];
  });

  // User Auth - Start with null so normal visitors see Login / Sign Up!
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('aed_current_user');
      if (!saved) return null;
      const parsed = JSON.parse(saved);
      // Clean legacy fake mock user
      if (parsed?.id === 'cust-demo-1' || parsed?.email === 'ankit.kumar@example.com' || parsed?.phone?.includes('98788')) {
        localStorage.removeItem('aed_current_user');
        return null;
      }
      return parsed;
    } catch {
      return null;
    }
  });

  // Admin Auth
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('aed_admin_auth') === 'true';
  });

  const [adminUser, setAdminUser] = useState<{ email: string; name: string } | null>(() => {
    const saved = localStorage.getItem('aed_admin_user');
    return saved ? JSON.parse(saved) : (localStorage.getItem('aed_admin_auth') === 'true' ? {
      email: 'kreativedecor.events@gmail.com',
      name: 'Kamal Kumar (Owner)',
    } : null);
  });

  // LocalStorage synchronizations
  useEffect(() => {
    localStorage.setItem('aed_services', JSON.stringify(services));
  }, [services]);

  useEffect(() => {
    localStorage.setItem('aed_bookings', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem('aed_inquiries', JSON.stringify(inquiries));
  }, [inquiries]);

  useEffect(() => {
    localStorage.setItem('aed_gallery', JSON.stringify(gallery));
  }, [gallery]);

  useEffect(() => {
    localStorage.setItem('aed_coupons', JSON.stringify(coupons));
  }, [coupons]);

  useEffect(() => {
    localStorage.setItem('aed_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('aed_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('aed_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('aed_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('aed_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('aed_current_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('aed_admin_auth', isAdminLoggedIn ? 'true' : 'false');
    if (adminUser) {
      localStorage.setItem('aed_admin_user', JSON.stringify(adminUser));
    } else {
      localStorage.removeItem('aed_admin_user');
    }
  }, [isAdminLoggedIn, adminUser]);

  // Service helpers
  const getServiceById = (id: string) => {
    return services.find(s => s.id === id || s.slug === id);
  };

  const addService = (serviceInput: Omit<ServiceItem, 'id' | 'createdAt'>) => {
    const id = serviceInput.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `service-${Date.now()}`;
    const newService: ServiceItem = {
      ...serviceInput,
      id,
      createdAt: new Date().toISOString(),
    };
    setServices(prev => [newService, ...prev]);
    return newService;
  };

  const updateService = (updated: ServiceItem) => {
    setServices(prev => prev.map(s => s.id === updated.id ? updated : s));
  };

  const deleteService = (id: string) => {
    setServices(prev => prev.filter(s => s.id !== id));
  };

  // Booking helpers
  const addBooking = (bookingInput: Omit<Booking, 'id' | 'referenceNumber' | 'status' | 'statusHistory' | 'createdAt'>) => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const refNum = `AED-${new Date().getFullYear()}-${randomSuffix}`;
    const newBooking: Booking = {
      ...bookingInput,
      id: `book-${Date.now()}`,
      referenceNumber: refNum,
      status: 'Pending',
      statusHistory: [
        {
          status: 'Pending',
          timestamp: new Date().toISOString(),
          note: 'Booking request received via website. Awaiting admin review.',
          updatedBy: 'System',
        },
      ],
      createdAt: new Date().toISOString(),
      userId: currentUser?.id,
    };
    setBookings(prev => [newBooking, ...prev]);
    return newBooking;
  };

  const updateBookingStatus = (id: string, status: BookingStatus, note?: string) => {
    setBookings(prev => prev.map(b => {
      if (b.id !== id) return b;
      const historyEntry = {
        status,
        timestamp: new Date().toISOString(),
        note: note || `Status updated to ${status}`,
        updatedBy: adminUser?.name || 'Admin',
      };
      return {
        ...b,
        status,
        statusHistory: [...b.statusHistory, historyEntry],
      };
    }));
  };

  const updateBookingNotes = (id: string, internalNotes: string) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, internalNotes } : b));
  };

  const deleteBooking = (id: string) => {
    setBookings(prev => prev.filter(b => b.id !== id));
  };

  // Inquiry helpers
  const addInquiry = (inquiryInput: Omit<Inquiry, 'id' | 'referenceNumber' | 'status' | 'createdAt'>) => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const refNum = `INQ-${new Date().getFullYear()}-${randomSuffix}`;
    const newInquiry: Inquiry = {
      ...inquiryInput,
      id: `inq-${Date.now()}`,
      referenceNumber: refNum,
      status: 'New',
      createdAt: new Date().toISOString(),
    };
    setInquiries(prev => [newInquiry, ...prev]);
    return newInquiry;
  };

  const updateInquiryStatus = (id: string, status: InquiryStatus, internalNotes?: string, followUpDate?: string) => {
    setInquiries(prev => prev.map(inq => {
      if (inq.id !== id) return inq;
      return {
        ...inq,
        status,
        ...(internalNotes !== undefined && { internalNotes }),
        ...(followUpDate !== undefined && { followUpDate }),
      };
    }));
  };

  const deleteInquiry = (id: string) => {
    setInquiries(prev => prev.filter(inq => inq.id !== id));
  };

  // Gallery helpers
  const addGalleryItem = (itemInput: Omit<GalleryItem, 'id'>) => {
    const newItem: GalleryItem = {
      ...itemInput,
      id: `gallery-${Date.now()}`,
    };
    setGallery(prev => [newItem, ...prev]);
    return newItem;
  };

  const updateGalleryItem = (updatedItem: GalleryItem) => {
    setGallery(prev => prev.map(g => g.id === updatedItem.id ? updatedItem : g));
  };

  const deleteGalleryItem = (id: string) => {
    setGallery(prev => prev.filter(g => g.id !== id));
  };

  const resetToDefaults = () => {
    setServices(INITIAL_SERVICES);
    setGallery(INITIAL_GALLERY);
    setCoupons(INITIAL_COUPONS);
    setSettings(INITIAL_SETTINGS);
    setBookings(INITIAL_SAMPLE_BOOKINGS);
    setInquiries(INITIAL_SAMPLE_INQUIRIES);
    localStorage.removeItem('aed_services');
    localStorage.removeItem('aed_gallery');
    localStorage.removeItem('aed_coupons');
    localStorage.removeItem('aed_settings');
    localStorage.removeItem('aed_bookings');
    localStorage.removeItem('aed_inquiries');
  };

  // Coupons
  const validateCoupon = (code: string, subtotal: number) => {
    const trimmed = code.trim().toUpperCase();
    const coupon = coupons.find(c => c.code.toUpperCase() === trimmed && c.isActive);
    if (!coupon) {
      return { valid: false, discount: 0, message: 'Invalid or expired coupon code.' };
    }
    if (subtotal < coupon.minOrderValue) {
      return {
        valid: false,
        discount: 0,
        message: `Minimum order amount of ${settings.currencySymbol}${coupon.minOrderValue} required for this coupon.`,
      };
    }
    const discount = coupon.discountType === 'percentage'
      ? Math.round((subtotal * coupon.discountValue) / 100)
      : coupon.discountValue;
    return {
      valid: true,
      discount,
      message: `Coupon ${coupon.code} applied successfully! You saved ${settings.currencySymbol}${discount}.`,
      coupon,
    };
  };

  const addCoupon = (couponInput: Omit<Coupon, 'id'>) => {
    const newCoupon: Coupon = {
      ...couponInput,
      id: `coupon-${Date.now()}`,
      code: couponInput.code.toUpperCase().trim(),
    };
    setCoupons(prev => [newCoupon, ...prev]);
  };

  const deleteCoupon = (id: string) => {
    setCoupons(prev => prev.filter(c => c.id !== id));
  };

  // Settings
  const updateSettings = (newSettings: Partial<WebsiteSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  // Cart
  const addToCart = (service: ServiceItem, addons: ServiceAddon[] = [], eventDate?: string, quantity = 1) => {
    const addonsTotal = addons.reduce((sum, a) => sum + a.price, 0);
    const calculatedPrice = (service.startingPrice + addonsTotal) * quantity;

    setCart(prev => {
      const existingIndex = prev.findIndex(item => item.serviceId === service.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
          selectedAddons: addons,
          eventDate: eventDate || updated[existingIndex].eventDate,
          calculatedPrice: (service.startingPrice + addonsTotal) * (updated[existingIndex].quantity + quantity),
        };
        return updated;
      }
      return [
        ...prev,
        {
          serviceId: service.id,
          title: service.title,
          image: service.image,
          basePrice: service.startingPrice,
          selectedAddons: addons,
          eventDate,
          quantity,
          calculatedPrice,
        },
      ];
    });
  };

  const removeFromCart = (serviceId: string) => {
    setCart(prev => prev.filter(item => item.serviceId !== serviceId));
  };

  const updateCartQuantity = (serviceId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(serviceId);
      return;
    }
    setCart(prev => prev.map(item => {
      if (item.serviceId !== serviceId) return item;
      const addonsTotal = item.selectedAddons.reduce((sum, a) => sum + a.price, 0);
      return {
        ...item,
        quantity,
        calculatedPrice: (item.basePrice + addonsTotal) * quantity,
      };
    }));
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce((sum, item) => sum + item.calculatedPrice, 0);

  // Wishlist
  const toggleWishlist = (serviceId: string) => {
    setWishlist(prev => {
      if (prev.includes(serviceId)) {
        return prev.filter(id => id !== serviceId);
      }
      return [...prev, serviceId];
    });
  };

  const isInWishlist = (serviceId: string) => wishlist.includes(serviceId);

  // Orders
  const createOrder = (orderInput: Omit<Order, 'id' | 'orderNumber' | 'createdAt'>) => {
    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const orderNumber = `ORD-${new Date().getFullYear()}-${randomSuffix}`;
    const newOrder: Order = {
      ...orderInput,
      id: `ord-${Date.now()}`,
      orderNumber,
      createdAt: new Date().toISOString(),
    };
    setOrders(prev => [newOrder, ...prev]);
    clearCart();
    return newOrder;
  };

  // Auth
  const loginUser = async (identifier: string, _password?: string): Promise<{ success: boolean; message: string }> => {
    const cleanId = identifier.trim().toLowerCase();
    
    // Check registered users in localStorage
    try {
      const savedReg = localStorage.getItem('aed_registered_users');
      if (savedReg) {
        const regUsers: User[] = JSON.parse(savedReg);
        const found = regUsers.find(
          (u) => u.email.toLowerCase() === cleanId || u.phone.replace(/[^0-9]/g, '').includes(cleanId.replace(/[^0-9]/g, ''))
        );
        if (found) {
          setCurrentUser(found);
          return { success: true, message: `Welcome back, ${found.name}!` };
        }
      }
    } catch {}

    // If new customer signs in directly, create user profile
    const namePart = cleanId.includes('@') ? cleanId.split('@')[0].replace(/[._-]/g, ' ') : `Customer ${cleanId.slice(-4)}`;
    const capitalizedName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
    const existing: User = {
      id: `cust-${Date.now()}`,
      name: capitalizedName,
      email: cleanId.includes('@') ? cleanId : `${cleanId}@customer.com`,
      phone: cleanId.includes('@') ? '+91 98788 95539' : cleanId,
      city: 'Gurgaon',
      role: 'customer' as const,
      createdAt: new Date().toISOString(),
    };
    setCurrentUser(existing);
    return { success: true, message: `Welcome, ${existing.name}!` };
  };

  const signupUser = async (name: string, email: string, phone: string, _password?: string): Promise<{ success: boolean; message: string }> => {
    const newUser: User = {
      id: `cust-${Date.now()}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      role: 'customer',
      createdAt: new Date().toISOString(),
    };
    
    try {
      const savedReg = localStorage.getItem('aed_registered_users');
      const regUsers: User[] = savedReg ? JSON.parse(savedReg) : [];
      regUsers.push(newUser);
      localStorage.setItem('aed_registered_users', JSON.stringify(regUsers));
    } catch {}

    setCurrentUser(newUser);
    return { success: true, message: 'Account created successfully! Welcome to Kreative Decor.' };
  };

  const logoutUser = () => {
    setCurrentUser(null);
  };

  const updateUserProfile = (data: Partial<User>) => {
    if (!currentUser) return;
    setCurrentUser(prev => prev ? { ...prev, ...data } : null);
  };

  // Admin Auth - Secure login for owner Kamal Kumar / Kreative Decor
  const loginAdmin = async (usernameOrEmail: string, password: string): Promise<{ success: boolean; message: string }> => {
    const cleanUser = usernameOrEmail.trim().toLowerCase();
    // Authorized admin credentials
    const validUsers = ['kamal', 'kamalkumar', '9878895539', '9650246245', 'admin', 'kreativedecor', 'kreativedecor.events@gmail.com'];
    const validPasswords = ['kamal@123', 'kreative123', 'admin123', 'kamal2026', 'ankit@123'];
    if (validUsers.includes(cleanUser) && validPasswords.includes(password)) {
      setIsAdminLoggedIn(true);
      setAdminUser({
        email: cleanUser.includes('@') ? cleanUser : 'kreativedecor.events@gmail.com',
        name: 'Kamal Kumar (Kreative Decor Owner)',
      });
      return { success: true, message: 'Admin login verified! Welcome to Kreative Decor Dashboard.' };
    }
    return {
      success: false,
      message: 'Invalid administrative credentials. Use Username: kamal (or 9878895539) and Password: kamal@123',
    };
  };

  const logoutAdmin = () => {
    setIsAdminLoggedIn(false);
    setAdminUser(null);
  };

  const formatPrice = (amount: number) => {
    return `${settings.currencySymbol}${amount.toLocaleString('en-IN')}`;
  };

  return (
    <AppContext.Provider
      value={{
        services,
        addService,
        updateService,
        deleteService,
        getServiceById,
        bookings,
        addBooking,
        updateBookingStatus,
        updateBookingNotes,
        deleteBooking,
        inquiries,
        addInquiry,
        updateInquiryStatus,
        deleteInquiry,
        gallery,
        addGalleryItem,
        updateGalleryItem,
        deleteGalleryItem,
        resetToDefaults,
        coupons,
        validateCoupon,
        addCoupon,
        deleteCoupon,
        settings,
        updateSettings,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartTotal,
        wishlist,
        toggleWishlist,
        isInWishlist,
        orders,
        createOrder,
        currentUser,
        loginUser,
        signupUser,
        logoutUser,
        updateUserProfile,
        isAdminLoggedIn,
        adminUser,
        loginAdmin,
        logoutAdmin,
        formatPrice,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
