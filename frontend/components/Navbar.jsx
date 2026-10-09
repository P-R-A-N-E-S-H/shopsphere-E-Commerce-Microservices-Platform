'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  ShoppingBag,
  Heart,
  Search,
  User,
  ShieldCheck,
  Menu,
  X,
  Sparkles,
  ChevronRight,
  Globe,
  SlidersHorizontal,
  LogOut,
  Activity,
  Layers,
  Package,
  MapPin,
  Award,
  Camera,
  Mic,
  Flame,
  Network,
  Cpu,
  Bot
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useCurrency, CURRENCIES } from '../context/CurrencyContext';
import { useLoyalty } from '../context/LoyaltyContext';
import { api } from '../lib/api';

export default function Navbar({
  onSelectProduct,
  onSearch,
  searchQuery,
  setSearchQuery,
  onOpenOrders,
  onOpenProfile,
  onOpenBargain,
  onOpenVision,
  onOpenVoice,
  onOpenNeural
}) {
  const { user, isAuthenticated, logout, openAuthModal, setIsAdminOpen } = useAuth();
  const { totalItemsCount, subtotal, setIsCartOpen } = useCart();
  const { wishlistCount, setIsWishlistOpen } = useWishlist();
  const { currency, currentCurrency, changeCurrency, formatPrice } = useCurrency();
  const { points, currentTier, setIsLoyaltyOpen } = useLoyalty();

  const [suggestions, setSuggestions] = useState([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    if (searchQuery.trim().length > 1) {
      const timer = setTimeout(async () => {
        const results = await api.searchProducts(searchQuery);
        setSuggestions(results.slice(0, 5));
      }, 200);
      return () => clearTimeout(timer);
    } else {
      setSuggestions([]);
    }
  }, [searchQuery]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-slate-950/85 border-b border-indigo-500/20 transition-all duration-300">
      {/* Top AI live status banner */}
      <div className="bg-gradient-to-r from-cyan-950/70 via-indigo-950/80 to-purple-950/70 border-b border-indigo-500/20 px-4 py-1.5 text-xs text-center text-cyan-200 flex items-center justify-center gap-3">
        <span className="flex items-center gap-1.5 font-bold font-mono text-emerald-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          6 AI AGENTS ACTIVE
        </span>
        <span className="text-slate-600 hidden sm:inline">•</span>
        <span className="hidden sm:inline">Dynamic Margin Pricing &amp; Multimodal Neural Search Online</span>
        <span className="text-slate-600 hidden sm:inline">•</span>
        <span className="font-mono text-amber-300">Use code <strong className="bg-amber-500/20 px-1.5 py-0.5 rounded border border-amber-500/30">AIEXCLUSIVE15</strong> for 15% OFF</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <a href="#" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-cyan-500/25 group-hover:scale-105 group-hover:shadow-cyan-500/40 transition-all duration-300">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-cyan-100 to-indigo-300 bg-clip-text text-transparent font-outfit">
                  Shop<span className="text-cyan-400">Sphere</span> <span className="text-xs px-1.5 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 font-mono">AI</span>
                </span>
                <span className="text-[10px] uppercase font-mono tracking-widest text-slate-400">Autonomous Commerce</span>
              </div>
            </a>
          </div>

          {/* Search Bar with Multimodal Vision & Voice Triggers */}
          <div className="hidden md:flex flex-1 max-w-xl relative" ref={searchRef}>
            <div className="relative w-full flex items-center">
              <input
                type="text"
                placeholder="Search products with neural vector matching..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                className="w-full bg-slate-900/90 text-slate-100 placeholder-slate-400 text-sm rounded-full pl-11 pr-24 py-2.5 border border-indigo-500/30 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-400 transition-all shadow-inner"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-4 pointer-events-none" />

              {/* Multimodal Quick Triggers */}
              <div className="absolute right-2.5 flex items-center gap-1">
                {searchQuery ? (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="p-1 text-slate-400 hover:text-slate-200"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                ) : null}

                <button
                  onClick={onOpenVision}
                  className="p-1.5 rounded-full hover:bg-cyan-500/20 text-slate-400 hover:text-cyan-300 transition-all"
                  title="Multimodal Visual Search"
                >
                  <Camera className="w-4 h-4" />
                </button>

                <button
                  onClick={onOpenVoice}
                  className="p-1.5 rounded-full hover:bg-pink-500/20 text-slate-400 hover:text-pink-300 transition-all"
                  title="Spatial Voice Commerce"
                >
                  <Mic className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Suggestions Dropdown */}
            {isSearchFocused && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900/95 backdrop-blur-2xl border border-indigo-500/30 rounded-2xl shadow-2xl overflow-hidden z-50 animate-slide-up">
                <div className="px-4 py-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800 flex justify-between items-center">
                  <span>Neural Vector Matches</span>
                  <span className="text-cyan-400 font-mono">{suggestions.length} matched</span>
                </div>
                <div className="divide-y divide-slate-800/60 max-h-80 overflow-y-auto">
                  {suggestions.map((product) => (
                    <button
                      key={product.id}
                      onClick={() => {
                        onSelectProduct(product);
                        setIsSearchFocused(false);
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-slate-800/80 transition flex items-center gap-3 group"
                    >
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-10 h-10 object-cover rounded-lg border border-slate-700 group-hover:border-cyan-400 transition"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-200 truncate group-hover:text-cyan-300 transition">
                          {product.name}
                        </p>
                        <p className="text-xs text-slate-400">{product.categoryName} • {product.brand}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-cyan-400">
                          {formatPrice(product.discountPrice || product.price)}
                        </p>
                        {product.discountPrice && (
                          <p className="text-[11px] text-slate-500 line-through">
                            {formatPrice(product.price)}
                          </p>
                        )}
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* AI Bargaining Quick Trigger */}
            <button
              onClick={onOpenBargain}
              className="hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs font-bold text-amber-300 hover:bg-amber-500/20 transition shadow-sm"
              title="AI Dynamic Bargaining Arena"
            >
              <Flame className="w-4 h-4 text-amber-400 animate-pulse" />
              <span>AI Bargain</span>
            </button>

            {/* Neural Graph Modal Trigger */}
            <button
              onClick={onOpenNeural}
              className="hidden xl:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-purple-500/10 border border-purple-500/30 text-xs font-bold text-purple-300 hover:bg-purple-500/20 transition shadow-sm"
              title="View Neural Agent Swarm Mesh"
            >
              <Network className="w-4 h-4 text-purple-400" />
              <span>Agent Swarm</span>
            </button>

            {/* VIP Loyalty Points Trigger */}
            <button
              onClick={() => setIsLoyaltyOpen(true)}
              className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-200 hover:border-amber-500/40 transition shadow-sm"
              title="View VIP Loyalty Rewards & Points"
            >
              <Award className="w-4 h-4 text-amber-400" />
              <span>{points} PTS</span>
              <span className="text-[11px]">{currentTier.badge}</span>
            </button>

            {/* Currency Selector Dropdown */}
            <div className="relative hidden sm:block">
              <button
                onClick={() => setCurrencyDropdownOpen(!currencyDropdownOpen)}
                className="flex items-center gap-1.5 px-2.5 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-mono text-slate-300 transition"
                title="Select Display Currency"
              >
                <Globe className="w-3.5 h-3.5 text-cyan-400" />
                <span>{currency}</span>
              </button>

              {currencyDropdownOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-slate-900/95 backdrop-blur-2xl border border-slate-800 rounded-2xl shadow-2xl py-2 z-50 divide-y divide-slate-800">
                  <div className="px-3 py-1.5 text-[10px] uppercase font-bold text-slate-500">Currency</div>
                  <div className="py-1">
                    {Object.values(CURRENCIES).map((c) => (
                      <button
                        key={c.code}
                        onClick={() => {
                          changeCurrency(c.code);
                          setCurrencyDropdownOpen(false);
                        }}
                        className={`w-full px-3 py-1.5 text-left text-xs flex items-center justify-between hover:bg-slate-800 transition ${
                          currency === c.code ? 'text-cyan-400 font-bold bg-cyan-500/10' : 'text-slate-300'
                        }`}
                      >
                        <span>{c.name}</span>
                        <span className="font-mono text-slate-400">{c.symbol} {c.code}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Live System Architecture / Admin Modal trigger */}
            <button
              onClick={() => setIsAdminOpen(true)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-800/80 transition-all text-xs font-medium text-slate-200 group shadow-sm"
              title="Open Microservices Mesh & Analytics Dashboard"
            >
              <div className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </div>
              <Activity className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition-transform" />
              <span className="hidden lg:inline">Admin Ops</span>
            </button>

            {/* Wishlist Button */}
            <button
              onClick={() => setIsWishlistOpen(true)}
              className="relative p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-pink-500/50 hover:bg-slate-800 text-slate-300 hover:text-pink-400 transition-all group"
              title="Open Saved Wishlist"
            >
              <Heart className="w-5 h-5 group-hover:scale-110 transition-transform" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-[10px] font-bold h-4 min-w-[16px] px-1 rounded-full flex items-center justify-center shadow-lg shadow-pink-500/40">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart Drawer Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 hover:brightness-110 text-white font-medium text-sm shadow-lg shadow-indigo-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline font-bold">{formatPrice(subtotal)}</span>
              {totalItemsCount > 0 && (
                <span className="bg-white text-indigo-900 text-xs font-black h-5 min-w-[20px] px-1.5 rounded-full flex items-center justify-center">
                  {totalItemsCount}
                </span>
              )}
            </button>

            {/* User Profile / Auth Button */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/40 transition text-xs text-slate-200"
                >
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs">
                    {user?.fullName?.charAt(0) || 'U'}
                  </div>
                  <span className="hidden md:inline font-medium truncate max-w-[90px]">{user?.fullName?.split(' ')[0]}</span>
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-slate-900/95 backdrop-blur-2xl border border-slate-800 rounded-2xl shadow-2xl py-2 z-50 divide-y divide-slate-800 animate-slide-up">
                    <div className="px-4 py-2">
                      <p className="text-xs font-bold text-white truncate">{user?.fullName}</p>
                      <p className="text-[10px] text-slate-400 truncate">{user?.email}</p>
                    </div>
                    <div className="py-1">
                      <button
                        onClick={() => {
                          onOpenProfile();
                          setUserDropdownOpen(false);
                        }}
                        className="w-full px-4 py-2 text-left text-xs text-slate-300 hover:bg-slate-800 flex items-center gap-2"
                      >
                        <User className="w-4 h-4 text-slate-400" />
                        <span>Profile &amp; Addresses</span>
                      </button>
                      <button
                        onClick={() => {
                          onOpenOrders();
                          setUserDropdownOpen(false);
                        }}
                        className="w-full px-4 py-2 text-left text-xs text-slate-300 hover:bg-slate-800 flex items-center gap-2"
                      >
                        <Package className="w-4 h-4 text-slate-400" />
                        <span>Order History &amp; Tracking</span>
                      </button>
                    </div>
                    <div className="py-1">
                      <button
                        onClick={() => {
                          logout();
                          setUserDropdownOpen(false);
                        }}
                        className="w-full px-4 py-2 text-left text-xs text-rose-400 hover:bg-rose-500/10 flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={openAuthModal}
                className="px-3 py-2 rounded-xl bg-slate-900 border border-indigo-500/30 hover:border-cyan-400/60 text-xs font-bold text-white shadow-sm transition-all"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
