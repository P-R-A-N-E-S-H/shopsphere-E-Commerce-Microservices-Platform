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
import AIBargainModal from '../components/AIBargainModal';
import MultimodalVisualSearchModal from '../components/MultimodalVisualSearchModal';
import NeuralGraphModal from '../components/NeuralGraphModal';
import SpatialVoiceModal from '../components/SpatialVoiceModal';
import SentimentRadarModal from '../components/SentimentRadarModal';
import Footer from '../components/Footer';
import { api, INITIAL_PRODUCTS } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';
import {
  Sparkles,
  Clock,
  Zap,
  ShieldCheck,
  Database,
  Radio,
  RefreshCcw,
  Layers,
  SlidersHorizontal,
  DollarSign,
  Flame,
  Camera,
  Bot,
  Network,
  Cpu,
  Gift,
  ArrowRight,
  CheckCircle2,
  TrendingUp,
  Activity
} from 'lucide-react';

export default function HomePage() {
  const { isAdminOpen, setIsAdminOpen } = useAuth();
  const { addToCart } = useCart();
  const { formatPrice } = useCurrency();

  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedBrand, setSelectedBrand] = useState('ALL');
  const [sortBy, setSortBy] = useState('featured');
  const [maxPrice, setMaxPrice] = useState(4000);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [aiMode, setAiMode] = useState('AUTONOMOUS_AI'); // 'STANDARD' | 'AUTONOMOUS_AI' | 'NEURAL_OPS'

  // Modals state
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [reviewsProduct, setReviewsProduct] = useState(null);
  const [trackedOrder, setTrackedOrder] = useState(null);
  const [isTrackerOpen, setIsTrackerOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // New AI Modals state
  const [isBargainOpen, setIsBargainOpen] = useState(false);
  const [bargainProduct, setBargainProduct] = useState(null);
  const [isVisionOpen, setIsVisionOpen] = useState(false);
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);
  const [isNeuralOpen, setIsNeuralOpen] = useState(false);
  const [isSentimentOpen, setIsSentimentOpen] = useState(false);
  const [sentimentProduct, setSentimentProduct] = useState(null);

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
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.categoryName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const priceA = a.discountPrice || a.price;
    const priceB = b.discountPrice || b.price;
    if (sortBy === 'price-low') return priceA - priceB;
    if (sortBy === 'price-high') return priceB - priceA;
    if (sortBy === 'rating') return b.rating - a.rating;
    return b.featured ? 1 : -1;
  });

  const handleOrderPlaced = (orderData) => {
    setTrackedOrder(orderData);
    setIsTrackerOpen(true);
  };

  const handleOpenBargain = (prod) => {
    setBargainProduct(prod || products[0]);
    setIsBargainOpen(true);
  };

  const handleOpenSentiment = (prod) => {
    setSentimentProduct(prod || products[0]);
    setIsSentimentOpen(true);
  };

  const handleClaimSmartBundle = () => {
    const p1 = products.find((p) => p.slug.includes('macbook')) || products[0];
    const p2 = products.find((p) => p.slug.includes('sony')) || products[1];
    addToCart(p1);
    addToCart(p2);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500 selection:text-slate-950 cyber-grid">
      {/* Global Navbar */}
      <Navbar
        onSelectProduct={(p) => setQuickViewProduct(p)}
        onSearch={(q) => setSearchQuery(q)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenOrders={() => setIsOrdersOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenBargain={() => handleOpenBargain(products[0])}
        onOpenVision={() => setIsVisionOpen(true)}
        onOpenVoice={() => setIsVoiceOpen(true)}
        onOpenNeural={() => setIsNeuralOpen(true)}
      />

      {/* Hero Banner with AI triggers */}
      <HeroBanner
        onExploreClick={() => catalogRef.current?.scrollIntoView({ behavior: 'smooth' })}
        onOpenBargain={() => handleOpenBargain(products[0])}
        onOpenVision={() => setIsVisionOpen(true)}
        onOpenVoice={() => setIsVoiceOpen(true)}
        onOpenNeural={() => setIsNeuralOpen(true)}
      />

      {/* AI Platform Mode Switcher Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
        <div className="p-2 sm:p-2.5 rounded-2xl glass-panel dark:bg-dark-900/90 border border-indigo-500/30 shadow-xl flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-[11px] uppercase font-mono font-black text-cyan-400 flex items-center gap-1.5 px-2">
              <Bot className="w-4 h-4" /> AI Platform Mode:
            </span>
            <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setAiMode('AUTONOMOUS_AI')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                  aiMode === 'AUTONOMOUS_AI'
                    ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-200" />
                <span>Autonomous AI</span>
              </button>
              <button
                onClick={() => {
                  setAiMode('NEURAL_OPS');
                  setIsNeuralOpen(true);
                }}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                  aiMode === 'NEURAL_OPS'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Network className="w-3.5 h-3.5 text-purple-200" />
                <span>Neural Ops</span>
              </button>
              <button
                onClick={() => setAiMode('STANDARD')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  aiMode === 'STANDARD' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Standard
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3 text-[11px] font-mono text-slate-300">
            <span className="hidden sm:flex items-center gap-1 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Kafka Outbox Mesh Synchronized
            </span>
            <button
              onClick={() => setIsNeuralOpen(true)}
              className="text-cyan-300 hover:underline flex items-center gap-1"
            >
              <span>Inspect Swarm Topology</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12" ref={catalogRef}>
        {/* Flash Deal AI Discount Banner */}
        <section className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-indigo-950/80 via-purple-950/90 to-pink-950/80 border border-indigo-500/30 p-6 sm:p-8 shadow-2xl shadow-indigo-950/40">
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold font-mono">
                <Flame className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
                <span>AUTONOMOUS SURGE PRICING DEALS</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white font-outfit">
                AI Flash Markdowns End Soon
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-lg">
                Our dynamic pricing engine has unlocked instant discounts on flagship electronics and noise-canceling headsets.
              </p>
            </div>

            {/* Countdown timer */}
            <div className="flex items-center gap-3 font-mono">
              <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-indigo-500/30 text-center min-w-[64px] shadow-lg">
                <span className="text-2xl font-black text-white">{String(timeLeft.hours).padStart(2, '0')}</span>
                <span className="block text-[10px] text-slate-400 uppercase font-sans font-bold">Hours</span>
              </div>
              <span className="text-2xl font-bold text-indigo-400">:</span>
              <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-indigo-500/30 text-center min-w-[64px] shadow-lg">
                <span className="text-2xl font-black text-white">{String(timeLeft.minutes).padStart(2, '0')}</span>
                <span className="block text-[10px] text-slate-400 uppercase font-sans font-bold">Mins</span>
              </div>
              <span className="text-2xl font-bold text-indigo-400">:</span>
              <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-indigo-500/30 text-center min-w-[64px] shadow-lg">
                <span className="text-2xl font-black text-cyan-400">{String(timeLeft.seconds).padStart(2, '0')}</span>
                <span className="block text-[10px] text-slate-400 uppercase font-sans font-bold">Secs</span>
              </div>
            </div>
          </div>
        </section>

        {/* Smart Neural AI Bundle Section */}
        <section className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-dark-900 via-dark-950 to-indigo-950/40 border border-cyan-500/30 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 text-xs font-bold font-mono">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>NEURAL VECTOR SYNERGY BUNDLE</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white font-outfit mt-1">
                Ultimate AI Power Station &amp; Studio Suite
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Neural affinity graph detected 89% productivity uplift when combining Apple Silicon M3 Max with Sony WH-1000XM5.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 font-mono text-xs font-bold border border-emerald-500/30">
                98.4% SYNERGY SCORE
              </span>
              <button
                onClick={handleClaimSmartBundle}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:brightness-110 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/30 transition-all flex items-center gap-2"
              >
                <Gift className="w-4 h-4" />
                <span>Add AI Bundle ($3,399)</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-black/40 border border-slate-800 flex items-center gap-4">
              <img
                src={products[0]?.images?.[0] || 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80'}
                alt="MacBook Pro 16"
                className="w-16 h-16 rounded-xl object-cover bg-slate-800 shrink-0"
              />
              <div className="flex-1 min-w-0">
                <span className="text-[10px] uppercase font-bold text-cyan-400">Primary Powerhouse</span>
                <h4 className="font-bold text-sm text-white truncate">{products[0]?.name || 'MacBook Pro 16" M3 Max'}</h4>
                <p className="text-xs font-mono font-bold text-slate-300 mt-0.5">$3,299.00</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-black/40 border border-slate-800 flex items-center gap-4">
              <img
                src={products[1]?.images?.[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80'}
                alt="Sony WH-1000XM5"
                className="w-16 h-16 rounded-xl object-cover bg-slate-800 shrink-0"
              />
              <div className="flex-1 min-w-0">
                <span className="text-[10px] uppercase font-bold text-purple-400">Acoustic Shield</span>
                <h4 className="font-bold text-sm text-white truncate">{products[1]?.name || 'Sony WH-1000XM5'}</h4>
                <p className="text-xs font-mono font-bold text-slate-300 mt-0.5">$348.00</p>
              </div>
            </div>
          </div>
        </section>

        {/* Category Filters */}
        <section className="space-y-4">
          <CategoryFilter
            selectedCategory={selectedCategory}
            onSelectCategory={(c) => setSelectedCategory(c)}
          />
        </section>

        {/* Product Grid Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight font-outfit">
              {searchQuery ? `Search Results for "${searchQuery}"` : 'Autonomous AI Catalog'}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Showing <span className="font-mono text-cyan-400 font-bold">{sortedProducts.length}</span> verified microservice catalog items
            </p>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-slate-900 text-slate-200 text-xs px-3 py-2 rounded-xl border border-slate-800 focus:outline-none focus:border-cyan-400 transition"
            >
              <option value="featured">AI Featured Affinity</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Top Customer Ratings</option>
            </select>
          </div>
        </div>

        {/* Products Grid */}
        {sortedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={(p) => setQuickViewProduct(p)}
                onOpenBargain={(p) => handleOpenBargain(p)}
                onOpenSentiment={(p) => handleOpenSentiment(p)}
              />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center space-y-3">
            <p className="text-lg font-bold text-slate-300">No products match your active filter</p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSelectedBrand('ALL');
                setSearchQuery('');
              }}
              className="px-4 py-2 rounded-xl bg-cyan-600 text-white text-xs font-bold"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Distributed Architecture Deep Dive Showcase */}
        <section className="mt-20 pt-12 border-t border-slate-800 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-semibold font-mono">
              <Layers className="w-3.5 h-3.5" />
              <span>DISTRIBUTED AI COMMERCE</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-white font-outfit">
              Autonomous Intelligence at Cloud Scale
            </h3>
            <p className="text-xs sm:text-sm text-slate-400">
              Explore how ShopSphere combines event-driven Spring Cloud microservices with sub-12ms multi-agent inference.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-slate-900/80 border border-indigo-500/20 hover:border-cyan-400/40 transition space-y-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Bot className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-white text-base">Multi-Agent Swarm</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                6 specialized AI agents running concurrently: Conversational Concierge, Dynamic Bargaining, Vision Sentinel, Fraud Gate, and Supply Restock.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900/80 border border-indigo-500/20 hover:border-purple-500/40 transition space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <Radio className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-white text-base">Kafka Outbox Mesh</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Asynchronous checkout choreography with automatic compensatory rollbacks across 15 independent microservice databases.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900/80 border border-indigo-500/20 hover:border-emerald-500/40 transition space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-white text-base">Neural Fraud Shield</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Sub-10ms transactional threat analysis using device biometrics, IP velocity tensors, and explainable AI risk factors.
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

      {/* AI Modals */}
      <AIBargainModal
        isOpen={isBargainOpen}
        onClose={() => setIsBargainOpen(false)}
        initialProduct={bargainProduct}
      />

      <MultimodalVisualSearchModal
        isOpen={isVisionOpen}
        onClose={() => setIsVisionOpen(false)}
        onSelectProduct={(p) => setQuickViewProduct(p)}
      />

      <NeuralGraphModal
        isOpen={isNeuralOpen}
        onClose={() => setIsNeuralOpen(false)}
      />

      <SpatialVoiceModal
        isOpen={isVoiceOpen}
        onClose={() => setIsVoiceOpen(false)}
        onOpenBargain={(p) => handleOpenBargain(p)}
        onSearchKeyword={(k) => setSearchQuery(k)}
      />

      <SentimentRadarModal
        isOpen={isSentimentOpen}
        onClose={() => setIsSentimentOpen(false)}
        product={sentimentProduct}
      />

      {/* AI Shopping Copilot Widget */}
      <AIAssistantWidget
        onSelectProduct={(p) => setQuickViewProduct(p)}
        onOpenBargain={(p) => handleOpenBargain(p)}
        onOpenVoice={() => setIsVoiceOpen(true)}
      />
    </div>
  );
}
