// Unified API Client for ShopSphere Microservices Platform
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export const INITIAL_PRODUCTS = [
  {
    id: 'prod-1',
    sku: 'SKU-APPL-MBP-16',
    name: 'MacBook Pro 16" M3 Max',
    slug: 'macbook-pro-16-m3-max',
    description: 'Liquid Retina XDR display, 36GB Unified Memory, 1TB SSD storage, 22-hour battery life and space black aluminum unibody.',
    price: 3499.00,
    discountPrice: 3299.00,
    categoryName: 'Electronics & Gadgets',
    brand: 'Apple',
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80',
      'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&q=80'
    ],
    stock: 45,
    rating: 4.9,
    reviewCount: 128,
    featured: true,
    status: 'ACTIVE'
  },
  {
    id: 'prod-2',
    sku: 'SKU-SNY-WH1000XM5',
    name: 'Sony WH-1000XM5 Wireless Headphones',
    slug: 'sony-wh-1000xm5-wireless-headphones',
    description: 'Industry-leading active noise canceling with two processors and 8 microphones. Crystal clear hands-free calling and up to 30h battery life.',
    price: 399.99,
    discountPrice: 348.00,
    categoryName: 'Audio & Sound',
    brand: 'Sony',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&q=80'
    ],
    stock: 80,
    rating: 4.8,
    reviewCount: 254,
    featured: true,
    status: 'ACTIVE'
  },
  {
    id: 'prod-3',
    sku: 'SKU-NIKE-AF1-07',
    name: "Nike Air Force 1 '07 Pro",
    slug: 'nike-air-force-1-07-pro',
    description: "The radiance lives on in the Nike Air Force 1 '07, the basketball icon that puts a fresh spin on what you know best.",
    price: 130.00,
    discountPrice: 115.00,
    categoryName: 'Fashion & Apparel',
    brand: 'Nike',
    images: [
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&q=80',
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80'
    ],
    stock: 120,
    rating: 4.7,
    reviewCount: 95,
    featured: true,
    status: 'ACTIVE'
  },
  {
    id: 'prod-4',
    sku: 'SKU-BOSE-QC-ULTRA',
    name: 'Bose QuietComfort Ultra Earbuds',
    slug: 'bose-quietcomfort-ultra-earbuds',
    description: 'Spatialized audio for more immersive listening that makes your music feel realer than ever before. World-class active noise cancellation.',
    price: 299.00,
    discountPrice: 279.00,
    categoryName: 'Audio & Sound',
    brand: 'Bose',
    images: [
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&q=80'
    ],
    stock: 65,
    rating: 4.6,
    reviewCount: 64,
    featured: false,
    status: 'ACTIVE'
  },
  {
    id: 'prod-5',
    sku: 'SKU-SAMS-S24-ULTRA',
    name: 'Samsung Galaxy S24 Ultra Titanium',
    slug: 'samsung-galaxy-s24-ultra-titanium',
    description: 'Galaxy AI is here. 200MP camera with Quad Tele System, Titanium exterior shield, 6.8" Dynamic AMOLED 2X 120Hz display and built-in S Pen.',
    price: 1299.99,
    discountPrice: 1199.00,
    categoryName: 'Electronics & Gadgets',
    brand: 'Samsung',
    images: [
      'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&q=80'
    ],
    stock: 50,
    rating: 4.8,
    reviewCount: 180,
    featured: true,
    status: 'ACTIVE'
  },
  {
    id: 'prod-6',
    sku: 'SKU-CHAIR-ERGO-X',
    name: 'ErgoPulse Pro Herman-Style Desk Chair',
    slug: 'ergopulse-pro-desk-chair',
    description: 'Ergonomic high-back breathable mesh chair with 4D armrests, dynamic lumbar support, tilt limiter and aluminum wheelbase.',
    price: 599.00,
    discountPrice: 499.00,
    categoryName: 'Home & Living',
    brand: 'ShopSphere Living',
    images: [
      'https://images.unsplash.com/photo-1580481077197-2a54b391789c?w=800&q=80'
    ],
    stock: 30,
    rating: 4.9,
    reviewCount: 42,
    featured: false,
    status: 'ACTIVE'
  }
];

export const CATEGORIES = [
  { id: 'cat-all', name: 'All Products', slug: 'all', icon: 'Sparkles' },
  { id: 'cat-1', name: 'Electronics & Gadgets', slug: 'electronics', icon: 'Laptop' },
  { id: 'cat-2', name: 'Audio & Sound', slug: 'audio', icon: 'Headphones' },
  { id: 'cat-3', name: 'Fashion & Apparel', slug: 'fashion', icon: 'Shirt' },
  { id: 'cat-4', name: 'Home & Living', slug: 'home-living', icon: 'Home' },
];

async function request(endpoint, options = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('shopsphere_token') : null;
  const headers = {
    'Content-Type': 'application/json',
    'X-Correlation-Id': 'req-' + Math.random().toString(36).substring(2, 9),
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };

  try {
    const res = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers
    });
    const data = await res.json();
    return data;
  } catch (err) {
    console.warn(`[ShopSphere API] Live fetch failed for ${endpoint}: ${err.message}. Using fallback.`);
    return null;
  }
}

export const api = {
  // Auth
  login: async (email, password) => {
    const res = await request('/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    if (res && res.success) return res.data;
    // Fallback Mock Login
    return {
      accessToken: 'mock-jwt-token-' + Date.now(),
      user: {
        id: 'usr-100',
        email,
        firstName: email.includes('admin') ? 'Admin' : 'Pranesh',
        lastName: email.includes('admin') ? 'ShopSphere' : 'M',
        role: email.includes('admin') ? 'ADMIN' : 'CUSTOMER'
      }
    };
  },

  register: async (payload) => {
    const res = await request('/api/v1/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    if (res && res.success) return res.data;
    return {
      accessToken: 'mock-jwt-token-' + Date.now(),
      user: {
        id: 'usr-' + Date.now(),
        email: payload.email,
        firstName: payload.firstName,
        lastName: payload.lastName,
        role: 'CUSTOMER'
      }
    };
  },

  // Products
  getProducts: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const res = await request(`/api/v1/products${query ? '?' + query : ''}`);
    if (res && res.success) return res.data.content || res.data;
    return INITIAL_PRODUCTS;
  },

  // Search
  searchProducts: async (q) => {
    const res = await request(`/api/v1/search?q=${encodeURIComponent(q)}`);
    if (res && res.success) return res.data.content || [];
    return INITIAL_PRODUCTS.filter(p =>
      p.name.toLowerCase().includes(q.toLowerCase()) ||
      p.brand.toLowerCase().includes(q.toLowerCase()) ||
      p.categoryName.toLowerCase().includes(q.toLowerCase())
    );
  },

  // Coupons
  validateCoupon: async (code, orderAmount) => {
    const res = await request('/api/v1/coupons/validate', {
      method: 'POST',
      body: JSON.stringify({ code, orderAmount })
    });
    if (res && res.success) return res.data;
    const c = code.toUpperCase();
    if (c === 'WELCOME10') {
      const discountAmount = orderAmount * 0.10;
      return { valid: true, code: 'WELCOME10', discountAmount, finalAmount: orderAmount - discountAmount, message: '10% off applied!' };
    }
    if (c === 'SAVE20') {
      const discountAmount = orderAmount * 0.20;
      return { valid: true, code: 'SAVE20', discountAmount, finalAmount: orderAmount - discountAmount, message: '20% off applied!' };
    }
    if (c === 'FLAT50') {
      const discountAmount = 50.00;
      return { valid: true, code: 'FLAT50', discountAmount, finalAmount: Math.max(0, orderAmount - discountAmount), message: '$50 flat discount applied!' };
    }
    return { valid: false, message: 'Invalid or expired coupon' };
  },

  // Orders
  createOrder: async (orderPayload) => {
    const res = await request('/api/v1/orders', {
      method: 'POST',
      body: JSON.stringify(orderPayload)
    });
    if (res && res.success) return res.data;
    return {
      id: 'ord-' + Math.random().toString(36).substring(2, 9),
      orderNumber: 'ORD-' + Math.floor(100000 + Math.random() * 900000),
      status: 'CONFIRMED',
      totalAmount: orderPayload.totalAmount || 348.00,
      items: orderPayload.items,
      shippingAddress: orderPayload.shippingAddress,
      paymentMethod: orderPayload.paymentMethod,
      trackingNumber: 'TRK-FEDEX-' + Math.floor(10000000 + Math.random() * 90000000),
      carrier: 'FedEx Express',
      createdAt: new Date().toISOString()
    };
  },

  // Analytics
  getAnalyticsDashboard: async () => {
    const res = await request('/api/v1/analytics/dashboard');
    if (res && res.success) return res.data;
    return {
      totalRevenue: 170766.00,
      totalOrders: 288,
      activeCustomers: 194,
      averageOrderValue: 592.93,
      conversionRate: 4.2,
      revenueGrowthPercent: 23.8
    };
  },

  getSalesTrend: async () => {
    const res = await request('/api/v1/analytics/sales-trend');
    if (res && res.success) return res.data.trend || res.data;
    return [
      { date: 'Oct 02', revenue: 12400, orders: 22 },
      { date: 'Oct 03', revenue: 18250, orders: 34 },
      { date: 'Oct 04', revenue: 14800, orders: 27 },
      { date: 'Oct 05', revenue: 22100, orders: 41 },
      { date: 'Oct 06', revenue: 19500, orders: 38 },
      { date: 'Oct 07', revenue: 28400, orders: 52 },
      { date: 'Oct 08', revenue: 31200, orders: 60 }
    ];
  }
};
