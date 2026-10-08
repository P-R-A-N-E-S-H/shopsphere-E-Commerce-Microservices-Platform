'use client';

import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import HeroBanner from '../components/HeroBanner';
import CategoryFilter from '../components/CategoryFilter';
import ProductCard from '../components/ProductCard';
import ProductModal from '../components/ProductModal';
import CheckoutModal from '../components/CheckoutModal';
import OrderTrackerModal from '../components/OrderTrackerModal';
import OrderHistoryModal from '../components/OrderHistoryModal';
import ProfileModal from '../components/ProfileModal';
import ReviewsModal from '../components/ReviewsModal';
import AdminDashboardModal from '../components/AdminDashboardModal';
import AIAssistantWidget from '../components/AIAssistantWidget';
import Footer from '../components/Footer';
import { api, INITIAL_PRODUCTS } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';
import { Sparkles, Clock, Zap, ShieldCheck, Database, Radio, RefreshCcw, Layers, SlidersHorizontal, DollarSign } from 'lucide-react';

export default function HomePage() {
  const { isAdminOpen, setIsAdminOpen } = useAuth();
  const { formatPrice } = useCurrency();

  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedBrand, setSelectedBrand] = useState('ALL');
  const [sortBy, setSortBy] = useState('featured');
  const [maxPrice, setMaxPrice] = useState(4000);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Modals state
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [reviewsProduct, setReviewsProduct] = useState(null);
  const [trackedOrder, setTrackedOrder] = useState(null);
  const [isTrackerOpen, setIsTrackerOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Flash deal countdown timer
  const [timeLeft, setTimeLeft] = useState({ hours: 4, minutes: 35, seconds: 12 });

  const catalogRef = useRef(null);

  useEffect(() => {
    // Load products from backend
    api.getProducts().then((res) => {
      if (res && res.length > 0) {
        setProducts(res);
      }
    });
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Filtered and Sorted products
  const categoryKeywords = {
    electronics: 'Electronics',
    audio: 'Audio',
    fashion: 'Fashion',
    'home-living': 'Home'
  };

  const filteredProducts = products.filter((p) => {
    // Category match
    if (selectedCategory !== 'all') {
      const keyword = categoryKeywords[selectedCategory];
      if (keyword && !p.categoryName.toLowerCase().includes(keyword.toLowerCase())) {
        return false;
      }
    }
    // Brand match
    if (selectedBrand !== 'ALL' && p.brand !== selectedBrand) {
      return false;
    }
    // Price filter
    const currentPrice = p.discountPrice || p.price;
    if (currentPrice > maxPrice) {
      return false;
    }
    // In stock filter
    if (inStockOnly && p.stock <= 0) {
      return false;
    }
    // Search query match
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.categoryName.toLowerCase().includes(q) ||
        (p.description && p.description.toLowerCase().includes(q));
      if (!match) return false;
    }
    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const priceA = a.discountPrice || a.price;
    const priceB = b.discountPrice || b.price;
    if (sortBy === 'price-asc') return priceA - priceB;
    if (sortBy === 'price-desc') return priceB - priceA;
    if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
    return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
  });

  const availableBrands = Array.from(new Set(products.map((p) => p.brand))).filter(Boolean);

  const handleOrderPlaced = (order) => {
    setTrackedOrder(order);
    setIsTrackerOpen(true);
  };

  const scrollToCatalog = () => {
    catalogRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      {/* Navbar */}
      <Navbar
        onSelectProduct={(prod) => setQuickViewProduct(prod)}
        onSearch={setSearchQuery}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenOrders={() => setIsOrdersOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
      />

      {/* Hero Section */}
      <HeroBanner onExploreClick={scrollToCatalog} />

      {/* Flash Sale Banner */}
      <div className="bg-gradient-to-r from-indigo-900/40 via-purple-900/40 to-pink-900/40 border-y border-slate-800/80 py-3 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-lg bg-rose-500/20 text-rose-400">
              <Zap className="w-4 h-4" />
            </span>
            <span className="font-bold text-slate-100">SPRING DEALS EVENT:</span>
            <span className="text-slate-300">Save up to 35% on top electronics, audio gear & home ergonomics</span>
          </div>

          <div className="flex items-center gap-2 font-mono text-slate-200">
            <Clock className="w-3.5 h-3.5 text-indigo-400" />
            <span>Offer expires in:</span>
            <div className="flex gap-1">
              <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 font-bold text-indigo-300">
                {String(timeLeft.hours).padStart(2, '0')}h
              </span>
              <span>:</span>
              <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 font-bold text-indigo-300">
                {String(timeLeft.minutes).padStart(2, '0')}m
              </span>
              <span>:</span>
              <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 font-bold text-indigo-300">
                {String(timeLeft.seconds).padStart(2, '0')}s
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Catalog Section */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10" ref={catalogRef}>
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight flex items-center gap-2">
              <span>Explore Catalog</span>
              <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300">
                {sortedProducts.length} Items
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Real-time stock synchronization across microservices with optimistic version locking
            </p>
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition flex items-center gap-2 ${
              showFilters
                ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>{showFilters ? 'Hide Price Filter' : 'Price & Stock Filters'}</span>
          </button>
        </div>

        {/* Expandable Advanced Filters */}
        {showFilters && (
          <div className="p-4 mb-6 rounded-2xl bg-slate-900/90 border border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 duration-200">
            <div>
              <div className="flex justify-between text-xs font-medium text-slate-300 mb-1.5">
                <span>Max Price Limit:</span>
                <span className="font-bold text-indigo-400">{formatPrice(maxPrice)}</span>
              </div>
              <input
                type="range"
                min="100"
                max="4000"
                step="50"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0">
              <label className="flex items-center gap-2 text-xs font-medium text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-950 text-indigo-600 focus:ring-0 w-4 h-4 cursor-pointer"
                />
                <span>Show In-Stock Only</span>
              </label>

              <button
                onClick={() => {
                  setMaxPrice(4000);
                  setInStockOnly(false);
                }}
                className="text-[11px] text-slate-500 hover:text-slate-300"
              >
                Reset
              </button>
            </div>
          </div>
        )}

        <CategoryFilter
          activeCategory={selectedCategory}
          onSelectCategory={(slug) => {
            setSelectedCategory(slug);
            setSearchQuery('');
          }}
          sortBy={sortBy}
          onSelectSort={setSortBy}
          selectedBrand={selectedBrand}
          onSelectBrand={setSelectedBrand}
          brands={availableBrands}
        />

        {/* Product Cards Grid */}
        {sortedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={(p) => setQuickViewProduct(p)}
              />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center rounded-3xl bg-slate-900/40 border border-slate-800 p-8 space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center text-slate-400 mx-auto">
              <Sparkles className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-200">No products match your criteria</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Try adjusting your search terms, increasing max price, or resetting filters.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSelectedBrand('ALL');
                setMaxPrice(4000);
                setInStockOnly(false);
                setSearchQuery('');
              }}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold inline-flex items-center gap-1.5 transition"
            >
              <RefreshCcw className="w-3.5 h-3.5" />
              <span>Reset All Filters</span>
            </button>
          </div>
        )}

        {/* Distributed Architecture Deep Dive Showcase */}
        <section className="mt-20 pt-12 border-t border-slate-800 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold">
              <Layers className="w-3.5 h-3.5" />
              <span>Distributed Engineering</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-100">
              Built for Infinite Scale & Reliability
            </h3>
            <p className="text-xs sm:text-sm text-slate-400">
              Explore how ShopSphere guarantees high availability and zero lost transactions under load.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/40 transition space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <Radio className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-100 text-base">Kafka Event Sagas</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Asynchronous checkout choreography with automatic compensatory rollbacks across Order, Inventory, Payment, and Shipping services.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-purple-500/40 transition space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <Database className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-100 text-base">Database Per Service</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Complete database autonomy. Each microservice manages its own PostgreSQL schema to eliminate shared-database bottlenecks.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/40 transition space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-100 text-base">Transactional Outbox</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Guaranteed at-least-once event delivery. Database mutations and outgoing Kafka events are committed atomically within local transactions.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />

      {/* Global Interactive Modals */}
      {quickViewProduct && (
        <ProductModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
          onOpenReviews={(p) => {
            setQuickViewProduct(null);
            setReviewsProduct(p);
          }}
        />
      )}

      {reviewsProduct && (
        <ReviewsModal
          product={reviewsProduct}
          isOpen={!!reviewsProduct}
          onClose={() => setReviewsProduct(null)}
        />
      )}

      <CheckoutModal onOrderPlaced={handleOrderPlaced} />

      <OrderTrackerModal
        order={trackedOrder}
        isOpen={isTrackerOpen}
        onClose={() => setIsTrackerOpen(false)}
      />

      <OrderHistoryModal
        isOpen={isOrdersOpen}
        onClose={() => setIsOrdersOpen(false)}
        onTrackOrder={(ord) => {
          setTrackedOrder(ord);
          setIsTrackerOpen(true);
        }}
      />

      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />

      <AdminDashboardModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
      />

      {/* AI Shopping Copilot Widget */}
      <AIAssistantWidget
        onSelectProduct={(p) => setQuickViewProduct(p)}
      />
    </div>
  );
}
