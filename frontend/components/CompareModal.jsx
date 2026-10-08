'use client';

import React from 'react';
import { X, ArrowLeftRight, Trash2, ShoppingBag, Star, Check, ShieldCheck } from 'lucide-react';
import { useCompare } from '../context/CompareContext';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';

export default function CompareModal() {
  const { compareItems, isCompareOpen, setIsCompareOpen, removeFromCompare, clearCompare } = useCompare();
  const { addToCart } = useCart();
  const { formatPrice } = useCurrency();

  if (!isCompareOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto backdrop-blur-md bg-slate-950/85 animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-5xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden my-6 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
              <ArrowLeftRight className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-base sm:text-lg">Product Comparison Matrix</h3>
              <p className="text-xs text-slate-400">Comparing {compareItems.length} selected items side by side</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {compareItems.length > 0 && (
              <button
                onClick={clearCompare}
                className="text-xs text-slate-400 hover:text-rose-400 transition"
              >
                Clear All
              </button>
            )}
            <button
              onClick={() => setIsCompareOpen(false)}
              className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Comparison Content */}
        <div className="p-6 overflow-x-auto flex-1">
          {compareItems.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center text-slate-500 mx-auto">
                <ArrowLeftRight className="w-8 h-8" />
              </div>
              <h4 className="text-base font-bold text-slate-200">No products selected for comparison</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Click the compare button on any product card in the catalog to add items here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 min-w-[650px]">
              {compareItems.map((product) => {
                const price = product.discountPrice || product.price;
                return (
                  <div
                    key={product.id}
                    className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between space-y-4 relative group"
                  >
                    {/* Delete button */}
                    <button
                      onClick={() => removeFromCompare(product.id)}
                      className="absolute top-3 right-3 p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-rose-400 transition z-10"
                      title="Remove"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <div className="space-y-3">
                      <div className="aspect-square w-full rounded-xl overflow-hidden bg-slate-900 border border-slate-800">
                        <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                      </div>

                      <div>
                        <span className="text-[10px] font-mono text-indigo-400 uppercase">{product.brand}</span>
                        <h4 className="text-sm font-bold text-slate-100 line-clamp-2">{product.name}</h4>
                      </div>

                      <div className="space-y-1.5 text-xs text-slate-300 divide-y divide-slate-850 pt-2">
                        <div className="flex justify-between py-1">
                          <span className="text-slate-500">Price</span>
                          <span className="font-bold text-emerald-400">{formatPrice(price)}</span>
                        </div>
                        <div className="flex justify-between py-1">
                          <span className="text-slate-500">Category</span>
                          <span className="text-slate-300 truncate max-w-[120px]">{product.categoryName}</span>
                        </div>
                        <div className="flex justify-between py-1">
                          <span className="text-slate-500">Rating</span>
                          <span className="font-bold text-amber-400 flex items-center gap-1">
                            <Star className="w-3 h-3 fill-current" />
                            {product.rating} ({product.reviewCount})
                          </span>
                        </div>
                        <div className="flex justify-between py-1">
                          <span className="text-slate-500">Availability</span>
                          <span className="text-emerald-400 font-medium">
                            {product.stock > 10 ? 'In Stock' : `Only ${product.stock} left`}
                          </span>
                        </div>
                      </div>

                      <p className="text-[11px] text-slate-400 line-clamp-3 leading-relaxed pt-1">
                        {product.description}
                      </p>
                    </div>

                    <button
                      onClick={() => addToCart(product, 1)}
                      className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-1.5"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Add to Cart</span>
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
