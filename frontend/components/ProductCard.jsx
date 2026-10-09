'use client';

import React, { useState } from 'react';
import {
  Star,
  Heart,
  ShoppingBag,
  Eye,
  Check,
  ArrowLeftRight,
  Flame,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useCompare } from '../context/CompareContext';
import { useCurrency } from '../context/CurrencyContext';

export default function ProductCard({ product, onQuickView, onOpenBargain, onOpenSentiment }) {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { isComparing, toggleCompare } = useCompare();
  const { formatPrice } = useCurrency();
  const [isAdding, setIsAdding] = useState(false);

  const isFavorited = isInWishlist(product.id);
  const isCompared = isComparing(product.id);
  const currentPrice = product.discountPrice || product.price;
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  const handleAddToCart = (e) => {
    e.stopPropagation();
    setIsAdding(true);
    addToCart(product, 1);
    setTimeout(() => setIsAdding(false), 1200);
  };

  const handleWishlist = (e) => {
    e.stopPropagation();
    toggleWishlist(product);
  };

  const handleCompare = (e) => {
    e.stopPropagation();
    toggleCompare(product);
  };

  const handleBargain = (e) => {
    e.stopPropagation();
    if (onOpenBargain) {
      onOpenBargain(product);
    }
  };

  const handleSentiment = (e) => {
    e.stopPropagation();
    if (onOpenSentiment) {
      onOpenSentiment(product);
    }
  };

  return (
    <div
      onClick={() => onQuickView(product)}
      className="group relative bg-slate-900/70 hover:bg-slate-900 border border-indigo-500/20 hover:border-cyan-400/50 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-cyan-500/10 transition-all duration-300 flex flex-col cursor-pointer glass-card-hover"
    >
      {/* Image Container with Badges & Actions */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-950">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-500 ease-out"
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          <span className="px-2.5 py-0.5 rounded-full bg-cyan-950/90 border border-cyan-400/50 backdrop-blur-md text-cyan-300 font-mono font-bold text-[10px] shadow-md flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            98% AI Match
          </span>

          {hasDiscount && (
            <span className="px-2.5 py-0.5 rounded-full bg-rose-500/90 backdrop-blur-md text-white font-extrabold text-[10px] shadow-md tracking-wide">
              {discountPercent}% OFF
            </span>
          )}
        </div>

        {/* Top Right Action buttons (Wishlist, Compare & Sentiment) */}
        <div className="absolute top-3 right-3 flex flex-col gap-1.5 z-10">
          {/* Wishlist */}
          <button
            onClick={handleWishlist}
            className={`p-2 rounded-full backdrop-blur-md transition-all ${
              isFavorited
                ? 'bg-pink-500 text-white shadow-lg shadow-pink-500/40'
                : 'bg-slate-950/70 hover:bg-slate-900 text-slate-300 hover:text-pink-400'
            }`}
            title={isFavorited ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart className={`w-3.5 h-3.5 ${isFavorited ? 'fill-current' : ''}`} />
          </button>

          {/* Sentiment Radar */}
          <button
            onClick={handleSentiment}
            className="p-2 rounded-full backdrop-blur-md bg-slate-950/70 hover:bg-emerald-950 text-slate-300 hover:text-emerald-300 transition-all border border-emerald-500/20"
            title="Inspect AI Sentiment & Return Radar"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
          </button>

          {/* Compare */}
          <button
            onClick={handleCompare}
            className={`p-2 rounded-full backdrop-blur-md transition-all ${
              isCompared
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/40'
                : 'bg-slate-950/70 hover:bg-slate-900 text-slate-300 hover:text-cyan-400'
            }`}
            title={isCompared ? 'Remove from compare' : 'Compare product'}
          >
            <ArrowLeftRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Quick View Hover overlay */}
        <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
          <span className="px-3.5 py-1.5 rounded-xl bg-slate-900/90 border border-indigo-500/40 text-slate-200 text-xs font-semibold flex items-center gap-1.5 shadow-xl">
            <Eye className="w-3.5 h-3.5 text-cyan-400" />
            Inspect Specifications
          </span>
        </div>
      </div>

      {/* Content Container */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Brand */}
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
            <span className="font-bold text-cyan-400 font-outfit">{product.brand}</span>
            <span className="text-[11px] text-slate-500">{product.categoryName}</span>
          </div>

          {/* Title */}
          <h3 className="font-bold text-white text-sm sm:text-base line-clamp-1 group-hover:text-cyan-300 transition-colors">
            {product.name}
          </h3>

          {/* Description snippet */}
          <p className="text-xs text-slate-400 line-clamp-2 mt-1 mb-3">
            {product.description}
          </p>
        </div>

        <div>
          {/* Rating & Stock */}
          <div className="flex items-center justify-between mb-3 text-xs">
            <div className="flex items-center gap-1 text-amber-400">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span className="font-bold text-slate-200">{product.rating}</span>
              <span className="text-slate-500">({product.reviewCount})</span>
            </div>
            <span className="text-[11px] font-medium text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              {product.stock > 10 ? 'In Stock' : `Only ${product.stock} left`}
            </span>
          </div>

          {/* Price & Action Buttons */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 gap-2">
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-lg sm:text-xl font-black text-cyan-400 font-mono">
                  {formatPrice(currentPrice)}
                </span>
                {hasDiscount && (
                  <span className="text-xs text-slate-500 line-through">
                    {formatPrice(product.price)}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {/* Dynamic Bargain Trigger */}
              <button
                onClick={handleBargain}
                className="px-2.5 py-2 rounded-xl text-xs font-bold bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition-all flex items-center gap-1 shadow-sm"
                title="Bargain price with AI Merchant"
              >
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Bargain</span>
              </button>

              {/* Add to Cart */}
              <button
                onClick={handleAddToCart}
                disabled={isAdding}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-1.5 ${
                  isAdding
                    ? 'bg-emerald-600 text-white scale-95'
                    : 'bg-gradient-to-r from-cyan-500 to-indigo-600 hover:brightness-110 text-white shadow-md shadow-indigo-600/30 active:scale-95'
                }`}
              >
                {isAdding ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Added</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
