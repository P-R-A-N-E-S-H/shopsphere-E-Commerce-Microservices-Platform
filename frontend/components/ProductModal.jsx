'use client';

import React, { useState } from 'react';
import { X, Star, Heart, ShoppingBag, ShieldCheck, Truck, RotateCcw, Check, MessageSquare } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useCurrency } from '../context/CurrencyContext';
import AudioDemoPlayer from './AudioDemoPlayer';

export default function ProductModal({ product, onClose, onOpenReviews }) {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { formatPrice } = useCurrency();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  if (!product) return null;

  const isFavorited = isInWishlist(product.id);
  const currentPrice = product.discountPrice || product.price;
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  const isAudioProduct =
    product.categoryName?.toLowerCase().includes('audio') ||
    product.categoryName?.toLowerCase().includes('sound') ||
    product.name?.toLowerCase().includes('headphone') ||
    product.name?.toLowerCase().includes('earbuds');

  const handleAddToCart = () => {
    setIsAdded(true);
    addToCart(product, quantity);
    setTimeout(() => setIsAdded(false), 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto backdrop-blur-md bg-slate-950/80 animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-4xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 p-6 sm:p-8">
          {/* Gallery & Audio Demo Section */}
          <div className="space-y-4">
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800">
              <img
                src={product.images[selectedImageIndex] || product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover object-center"
              />
              {hasDiscount && (
                <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-rose-500 text-white font-black text-xs shadow-md">
                  {discountPercent}% OFF
                </span>
              )}
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 transition ${
                      selectedImageIndex === idx ? 'border-indigo-500 scale-105' : 'border-slate-800 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Interactive Audio Demo for sound gear */}
            {isAudioProduct && <AudioDemoPlayer productName={product.name} />}

            {/* Architecture guarantee pill */}
            <div className="p-3.5 rounded-2xl bg-indigo-950/30 border border-indigo-500/20 text-xs text-indigo-300 space-y-1">
              <div className="font-semibold flex items-center gap-1.5 text-indigo-200">
                <ShieldCheck className="w-4 h-4 text-indigo-400" />
                <span>Optimistic Inventory Protection</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Stock is locked with ACID saga isolation in the Inventory Microservice upon checkout.
              </p>
            </div>
          </div>

          {/* Product Details Section */}
          <div className="flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span className="font-mono text-indigo-400 font-bold uppercase">{product.brand}</span>
                  <span className="font-mono text-slate-500">{product.sku}</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-100 leading-tight">
                  {product.name}
                </h2>
              </div>

              {/* Rating and Reviews link */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 text-amber-400">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="font-bold text-slate-100">{product.rating}</span>
                </div>
                <span className="text-slate-600">•</span>
                <button
                  onClick={() => onOpenReviews(product)}
                  className="text-xs text-indigo-400 hover:text-indigo-300 hover:underline flex items-center gap-1"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>{product.reviewCount} customer reviews</span>
                </button>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3 py-2 border-y border-slate-800">
                <span className="text-3xl font-black text-slate-100">
                  {formatPrice(currentPrice)}
                </span>
                {hasDiscount && (
                  <span className="text-base text-slate-500 line-through">
                    {formatPrice(product.price)}
                  </span>
                )}
                {hasDiscount && (
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md">
                    Save {formatPrice(product.price - product.discountPrice)}
                  </span>
                )}
              </div>

              {/* Description */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Overview</h4>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Badges / Guarantees */}
              <div className="grid grid-cols-2 gap-3 pt-2 text-xs text-slate-300">
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
                  <Truck className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>Free FedEx 2-Day Shipping</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
                  <RotateCcw className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>30-Day Hassle-Free Returns</span>
                </div>
              </div>
            </div>

            {/* Quantity Selector & Action Buttons */}
            <div className="space-y-4 pt-4 border-t border-slate-800">
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-slate-700 rounded-xl bg-slate-800/80 p-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-300 hover:bg-slate-700 transition"
                  >
                    -
                  </button>
                  <span className="w-10 text-center font-bold text-sm text-slate-100">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-300 hover:bg-slate-700 transition"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={() => toggleWishlist(product)}
                  className={`p-3 rounded-xl border transition flex items-center gap-2 text-xs font-semibold ${
                    isFavorited
                      ? 'bg-pink-500/20 border-pink-500 text-pink-400'
                      : 'border-slate-700 hover:border-pink-500/50 text-slate-300 hover:text-pink-400 bg-slate-800/60'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
                  <span className="hidden sm:inline">{isFavorited ? 'Saved' : 'Wishlist'}</span>
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={isAdded}
                className={`w-full py-4 rounded-2xl font-bold text-sm shadow-xl transition-all duration-300 flex items-center justify-center gap-2 ${
                  isAdded
                    ? 'bg-emerald-600 text-white shadow-emerald-600/30'
                    : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-indigo-600/30 hover:scale-[1.01]'
                }`}
              >
                {isAdded ? (
                  <>
                    <Check className="w-5 h-5" />
                    <span>Added {quantity} to Cart!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-5 h-5" />
                    <span>Add to Cart • {formatPrice(currentPrice * quantity)}</span>
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
