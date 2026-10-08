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
  Award
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
  onOpenProfile
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
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-slate-950/80 border-b border-slate-800/80 transition-all duration-300">
      {/* Top micro-announcement banner */}
      <div className="bg-gradient-to-r from-indigo-900/60 via-purple-900/60 to-pink-900/60 border-b border-indigo-500/20 px-4 py-1.5 text-xs text-center text-indigo-200 flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
        <span>⚡ <strong>Spring Microservices Architecture</strong>: 14 Services Live with Kafka Event Mesh & Redis. Code <span className="font-mono font-bold text-amber-300 bg-amber-500/20 px-1.5 py-0.5 rounded">SAVE20</span> for 20% off!</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <a href="#" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:scale-105 group-hover:shadow-indigo-500/40 transition-all duration-300">
                <Layers className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent">
                  Shop<span className="text-indigo-400">Sphere</span>
                </span>
                <span className="text-[10px] uppercase font-mono tracking-widest text-slate-400">Microservices Hub</span>
              </div>
            </a>
          </div>

          {/* Search Bar with live Suggestions */}
          <div className="hidden md:flex flex-1 max-w-xl relative" ref={searchRef}>
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search products, brands, tech, audio..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                className="w-full bg-slate-900/90 text-slate-100 placeholder-slate-400 text-sm rounded-full pl-11 pr-10 py-2.5 border border-slate-700/80 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all shadow-inner"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 p-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Suggestions Dropdown */}
            {isSearchFocused && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900/95 backdrop-blur-2xl border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in-50 slide-in-from-top-2 duration-200">
                <div className="px-4 py-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800 flex justify-between items-center">
                  <span>Product Suggestions</span>
                  <span className="text-indigo-400 font-mono">{suggestions.length} matched</span>
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
                        className="w-10 h-10 object-cover rounded-lg border border-slate-700 group-hover:border-indigo-500 transition"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-200 truncate group-hover:text-indigo-400 transition">
                          {product.name}
                        </p>
                        <p className="text-xs text-slate-400">{product.categoryName} • {product.brand}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-emerald-400">
                          {formatPrice(product.discountPrice || product.price)}
                        </p>
                        {product.discountPrice && (
                          <p className="text-[11px] text-slate-500 line-through">
                            {formatPrice(product.price)}
                          </p>
                        )}
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 transition" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* VIP Loyalty Points Trigger */}
            <button
              onClick={() => setIsLoyaltyOpen(true)}
              className="hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs font-bold text-amber-300 hover:bg-amber-500/20 transition shadow-sm"
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
                <Globe className="w-3.5 h-3.5 text-indigo-400" />
                <span>{currency}</span>
              </button>

              {currencyDropdownOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-slate-900/95 backdrop-blur-2xl border border-slate-800 rounded-2xl shadow-2xl py-2 z-50 divide-y divide-slate-855">
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
                          currency === c.code ? 'text-indigo-400 font-bold bg-indigo-500/10' : 'text-slate-300'
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
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-800/80 transition-all text-xs font-medium text-slate-200 group shadow-sm"
              title="Open Microservices Mesh & Analytics Dashboard"
            >
              <div className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </div>
              <Activity className="w-3.5 h-3.5 text-indigo-400 group-hover:scale-110 transition-transform" />
              <span className="hidden lg:inline">Admin & Mesh</span>
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
              className="relative flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:scale-[1.02] active:scale-[0.98] transition-all"
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
            <div className="relative">
              {isAuthenticated ? (
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 transition"
                >
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-xs font-bold text-white shadow">
                    {user.firstName ? user.firstName.charAt(0) : 'U'}
                  </div>
                  <span className="text-xs font-medium hidden sm:inline">{user.firstName}</span>
                </button>
              ) : (
                <button
                  onClick={() => openAuthModal('login')}
                  className="p-2 sm:px-3.5 sm:py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-2 transition hover:bg-slate-800"
                >
                  <User className="w-4 h-4 text-indigo-400" />
                  <span className="hidden sm:inline">Sign In</span>
                </button>
              )}

              {/* User Dropdown Menu */}
              {userDropdownOpen && isAuthenticated && (
                <div className="absolute right-0 mt-2 w-56 bg-slate-900/95 backdrop-blur-2xl border border-slate-800 rounded-2xl shadow-2xl py-2 z-50">
                  <div className="px-4 py-2.5 border-b border-slate-800">
                    <p className="text-xs text-slate-400">Signed in as</p>
                    <p className="text-sm font-semibold text-slate-200 truncate">{user.email}</p>
                    <span className="inline-block mt-1 text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
                      {user.role}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      if (onOpenOrders) onOpenOrders();
                    }}
                    className="w-full px-4 py-2 text-left text-xs text-slate-300 hover:bg-slate-800 flex items-center gap-2.5 transition"
                  >
                    <Package className="w-4 h-4 text-indigo-400" />
                    My Orders & Tracking
                  </button>

                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      if (onOpenProfile) onOpenProfile();
                    }}
                    className="w-full px-4 py-2 text-left text-xs text-slate-300 hover:bg-slate-800 flex items-center gap-2.5 transition"
                  >
                    <MapPin className="w-4 h-4 text-indigo-400" />
                    Saved Addresses & Profile
                  </button>

                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      setIsLoyaltyOpen(true);
                    }}
                    className="w-full px-4 py-2 text-left text-xs text-amber-300 hover:bg-slate-800 flex items-center gap-2.5 transition"
                  >
                    <Award className="w-4 h-4 text-amber-400" />
                    VIP Rewards ({points} Pts)
                  </button>

                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      setIsAdminOpen(true);
                    }}
                    className="w-full px-4 py-2 text-left text-xs text-slate-300 hover:bg-slate-800 flex items-center gap-2.5 transition"
                  >
                    <Activity className="w-4 h-4 text-indigo-400" />
                    Microservices Architecture
                  </button>

                  <div className="border-t border-slate-800 my-1" />

                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      logout();
                    }}
                    className="w-full px-4 py-2 text-left text-xs text-rose-400 hover:bg-slate-800/80 flex items-center gap-2.5 transition"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-slate-900 text-slate-400 hover:text-slate-200"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Search input */}
        <div className="md:hidden pb-3">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 text-slate-100 placeholder-slate-400 text-sm rounded-xl pl-10 pr-4 py-2 border border-slate-800 focus:outline-none focus:border-indigo-500"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>
    </header>
  );
}
