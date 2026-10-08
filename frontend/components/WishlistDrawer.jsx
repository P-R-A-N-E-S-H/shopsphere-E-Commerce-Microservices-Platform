'use client';

import React from 'react';
import { X, Heart, ShoppingBag, Trash2, ArrowRight, ArrowLeftRight } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCurrency } from '../context/CurrencyContext';

export default function WishlistDrawer() {
  const { wishlist, isWishlistOpen, setIsWishlistOpen, removeFromWishlist, moveToCart, moveAllToCart, clearWishlist } = useWishlist();
  const { formatPrice } = useCurrency();

  if (!isWishlistOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden backdrop-blur-md bg-slate-950/70 animate-in fade-in duration-200">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-5 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Heart className="w-5 h-5 text-pink-400 fill-pink-500/20" />
              <h3 className="text-lg font-bold text-slate-100">Saved Wishlist</h3>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-pink-500/20 text-pink-300">
                {wishlist.length}
              </span>
            </div>
            <button
              onClick={() => setIsWishlistOpen(false)}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 divide-y divide-slate-800/60">
            {wishlist.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-16">
                <div className="w-16 h-16 rounded-2xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400 mb-4">
                  <Heart className="w-8 h-8" />
                </div>
                <h4 className="text-base font-bold text-slate-200">No saved items yet</h4>
                <p className="text-xs text-slate-400 mt-1 max-w-xs leading-relaxed">
                  Click the heart icon on any product card in the catalog to save it for later.
                </p>
              </div>
            ) : (
              wishlist.map((product) => {
                const price = product.discountPrice || product.price;
                return (
                  <div key={product.id} className="pt-4 first:pt-0 flex gap-4">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-20 h-20 object-cover rounded-xl border border-slate-800 bg-slate-950 shrink-0"
                    />
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <h4 className="text-sm font-semibold text-slate-200 truncate pr-2">{product.name}</h4>
                          <button
                            onClick={() => removeFromWishlist(product.id)}
                            className="text-slate-500 hover:text-rose-400 transition"
                            title="Remove from wishlist"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-xs text-indigo-400 font-medium mt-0.5">{product.brand}</p>
                      </div>

                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-850">
                        <span className="text-sm font-bold text-slate-100">
                          {formatPrice(price)}
                        </span>
                        <button
                          onClick={() => moveToCart(product)}
                          className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Move to Cart</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Actions */}
          {wishlist.length > 0 && (
            <div className="p-5 border-t border-slate-800 bg-slate-950/60 space-y-3">
              <button
                onClick={moveAllToCart}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold text-xs sm:text-sm shadow-xl shadow-pink-600/20 transition flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Move All ({wishlist.length}) to Cart</span>
              </button>
              <button
                onClick={clearWishlist}
                className="w-full py-2 text-center text-xs text-slate-500 hover:text-rose-400 transition"
              >
                Clear Entire Wishlist
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
