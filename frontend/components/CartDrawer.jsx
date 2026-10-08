'use client';

import React, { useState } from 'react';
import { X, Trash2, ArrowRight, Tag, ShieldCheck, ShoppingBag, Plus, Minus, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';

export default function CartDrawer() {
  const {
    items,
    totalItemsCount,
    subtotal,
    discountAmount,
    shippingFee,
    shippingThreshold,
    totalAmount,
    appliedCoupon,
    couponError,
    isCartOpen,
    setIsCartOpen,
    setIsCheckoutOpen,
    updateQuantity,
    removeFromCart,
    applyCoupon,
    removeCoupon
  } = useCart();

  const { formatPrice } = useCurrency();

  const [couponInput, setCouponInput] = useState('');
  const [isApplying, setIsApplying] = useState(false);

  if (!isCartOpen) return null;

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponInput) return;
    setIsApplying(true);
    await applyCoupon(couponInput);
    setIsApplying(false);
  };

  const freeShippingLeft = Math.max(0, shippingThreshold - subtotal);
  const freeShippingProgress = Math.min(100, Math.round((subtotal / shippingThreshold) * 100));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden backdrop-blur-md bg-slate-950/70 animate-in fade-in duration-200">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col">
          {/* Drawer Header */}
          <div className="p-5 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-indigo-400" />
              <h3 className="text-lg font-bold text-slate-100">Your Cart</h3>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300">
                {totalItemsCount}
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Bar */}
          <div className="bg-slate-950/60 p-3.5 border-b border-slate-800/80">
            <div className="flex justify-between text-xs font-medium mb-1.5">
              <span className="text-slate-300">
                {freeShippingLeft === 0 ? (
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    Unlocked Free Shipping!
                  </span>
                ) : (
                  <span>
                    Add <strong className="text-indigo-300">{formatPrice(freeShippingLeft)}</strong> for Free Shipping
                  </span>
                )}
              </span>
              <span className="text-slate-400">{freeShippingProgress}%</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-full transition-all duration-500"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 divide-y divide-slate-800/60">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-2xl bg-slate-800/60 flex items-center justify-center text-slate-500 mb-4">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h4 className="text-base font-bold text-slate-300">Your cart is empty</h4>
                <p className="text-xs text-slate-500 mt-1 max-w-xs">
                  Browse our curated catalog and discover high-performance electronics and audio gadgets.
                </p>
              </div>
            ) : (
              items.map((item) => {
                const p = item.product;
                const unitPrice = p.discountPrice || p.price;
                return (
                  <div key={p.id} className="pt-4 first:pt-0 flex gap-4">
                    <img
                      src={p.images[0]}
                      alt={p.name}
                      className="w-20 h-20 object-cover rounded-xl border border-slate-800 bg-slate-950 shrink-0"
                    />
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <h4 className="text-sm font-semibold text-slate-200 truncate pr-2">{p.name}</h4>
                          <button
                            onClick={() => removeFromCart(p.id)}
                            className="text-slate-500 hover:text-rose-400 transition"
                            title="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-xs text-indigo-400 font-medium mt-0.5">{p.brand}</p>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center border border-slate-800 rounded-lg bg-slate-950 p-0.5">
                          <button
                            onClick={() => updateQuantity(p.id, -1)}
                            className="p-1 text-slate-400 hover:text-white transition"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-6 text-center text-xs font-bold text-slate-200">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(p.id, 1)}
                            className="p-1 text-slate-400 hover:text-white transition"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-bold text-slate-100">
                            {formatPrice(unitPrice * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Coupon Code Section & Cost Summary */}
          {items.length > 0 && (
            <div className="p-5 border-t border-slate-800 bg-slate-950/60 space-y-4">
              {/* Coupon input */}
              <div>
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="Promo code (SAVE20, FLAT50)"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                      className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-xl px-3 py-2 uppercase placeholder:normal-case placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono"
                    />
                    <Tag className="w-3.5 h-3.5 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2" />
                  </div>
                  <button
                    type="submit"
                    disabled={isApplying || !couponInput}
                    className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 text-xs font-bold transition"
                  >
                    Apply
                  </button>
                </form>

                {couponError && <p className="text-[11px] text-rose-400 mt-1">{couponError}</p>}

                {appliedCoupon && (
                  <div className="mt-2 p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between text-xs text-emerald-400">
                    <span className="font-mono font-bold">✓ {appliedCoupon.code} applied (-{formatPrice(discountAmount)})</span>
                    <button onClick={removeCoupon} className="text-slate-400 hover:text-rose-400">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              {/* Price breakdown */}
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Subtotal</span>
                  <span className="font-medium text-slate-200">{formatPrice(subtotal)}</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Discount</span>
                    <span>-{formatPrice(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-400">
                  <span>Estimated Shipping</span>
                  <span>{shippingFee === 0 ? <strong className="text-emerald-400">FREE</strong> : formatPrice(shippingFee)}</span>
                </div>
                <div className="flex justify-between text-base font-black text-slate-100 pt-2 border-t border-slate-800">
                  <span>Total Amount</span>
                  <span className="text-lg bg-gradient-to-r from-indigo-400 to-purple-300 bg-clip-text text-transparent">
                    {formatPrice(totalAmount)}
                  </span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  setIsCheckoutOpen(true);
                }}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 hover:scale-[1.01] transition-all flex items-center justify-center gap-2"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
