'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Flame,
  Bot,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  TrendingDown,
  ShieldCheck,
  Zap,
  Tag,
  Gift,
  RotateCcw
} from 'lucide-react';
import { api, INITIAL_PRODUCTS } from '../lib/api';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';

export default function AIBargainModal({ isOpen, onClose, initialProduct, onApplyCoupon }) {
  const [selectedProduct, setSelectedProduct] = useState(initialProduct || INITIAL_PRODUCTS[0]);
  const [offeredPrice, setOfferedPrice] = useState(selectedProduct ? (selectedProduct.discountPrice || selectedProduct.price) * 0.85 : 300);
  const [round, setRound] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [negotiationResult, setNegotiationResult] = useState(null);
  const [dialogueHistory, setDialogueHistory] = useState([]);
  const { addToCart } = useCart();
  const { formatPrice } = useCurrency();

  useEffect(() => {
    if (initialProduct) {
      setSelectedProduct(initialProduct);
      setOfferedPrice(Math.round((initialProduct.discountPrice || initialProduct.price) * 0.85));
    }
  }, [initialProduct]);

  useEffect(() => {
    if (selectedProduct) {
      setOfferedPrice(Math.round((selectedProduct.discountPrice || selectedProduct.price) * 0.85));
      setRound(1);
      setNegotiationResult(null);
      setDialogueHistory([
        {
          speaker: 'merchant',
          message: `Welcome to the AI Bargaining Arena! I am authorized to negotiate dynamic margin allowances on **${selectedProduct.name}**. Pitch your best offer!`,
          time: 'Just now'
        }
      ]);
    }
  }, [selectedProduct]);

  if (!isOpen) return null;

  const currentBasePrice = selectedProduct.discountPrice || selectedProduct.price;
  const discountPercent = Math.max(0, ((currentBasePrice - offeredPrice) / currentBasePrice) * 100);

  const handleSubmitOffer = async () => {
    setIsSubmitting(true);
    const currentRound = round;

    // Add user offer to dialogue
    setDialogueHistory((prev) => [
      ...prev,
      {
        speaker: 'user',
        message: `I would like to offer $${Number(offeredPrice).toFixed(2)} (${discountPercent.toFixed(1)}% discount).`,
        time: 'Just now'
      }
    ]);

    try {
      const response = await api.negotiateBargain({
        productId: selectedProduct.id,
        sku: selectedProduct.sku,
        productName: selectedProduct.name,
        currentPrice: currentBasePrice,
        offeredPrice: Number(offeredPrice),
        round: currentRound,
        customerId: 'vip-shopper',
        customerLoyaltyTier: 'VIP'
      });

      setNegotiationResult(response);
      setRound((prev) => prev + 1);

      setDialogueHistory((prev) => [
        ...prev,
        {
          speaker: 'merchant',
          message: response.aiAgentMessage,
          status: response.status,
          code: response.generatedCouponCode,
          perks: response.agentPerksIncluded,
          time: 'Just now'
        }
      ]);

      if (response.status === 'COUNTER_OFFER' && response.counterPrice) {
        setOfferedPrice(response.counterPrice);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClaimDeal = () => {
    if (negotiationResult && negotiationResult.generatedCouponCode) {
      addToCart(selectedProduct);
      if (onApplyCoupon) {
        onApplyCoupon(negotiationResult.generatedCouponCode);
      }
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-2xl rounded-3xl glass-panel dark:bg-dark-900/95 border border-amber-500/30 shadow-2xl shadow-amber-950/50 overflow-hidden flex flex-col max-h-[90vh] animate-slide-up">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-dark-950 via-amber-950/40 to-dark-900 border-b border-amber-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/30">
              <Flame className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-extrabold text-white font-outfit">AI Bargaining Arena</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  ROUND {Math.min(round, 3)} / 3
                </span>
              </div>
              <p className="text-xs text-amber-200/70">Real-Time Autonomous Pricing Merchant</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Product selector tabs */}
        <div className="px-6 py-3 bg-slate-900/80 border-b border-slate-800 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0">Item:</span>
          {INITIAL_PRODUCTS.slice(0, 4).map((p) => (
            <button
              key={p.id}
              onClick={() => setSelectedProduct(p)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all ${
                selectedProduct.id === p.id
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 shadow-sm'
                  : 'bg-slate-800/60 text-slate-400 hover:text-slate-200 border border-slate-700/50'
              }`}
            >
              {p.name.split(' ')[0]} {p.name.split(' ')[1]}
            </button>
          ))}
        </div>

        {/* Body content */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Target Product Bar */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-dark-950 to-amber-950/20 border border-amber-500/20 flex items-center gap-4">
            <img
              src={selectedProduct.images?.[0] || 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80'}
              alt={selectedProduct.name}
              className="w-16 h-16 rounded-xl object-cover bg-slate-800 shrink-0 border border-slate-700"
            />
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">{selectedProduct.categoryName}</span>
              <h4 className="font-extrabold text-sm text-white truncate">{selectedProduct.name}</h4>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-slate-400">List Price:</span>
                <span className="text-xs line-through text-slate-500">{formatPrice(selectedProduct.price)}</span>
                <span className="text-sm font-black text-amber-400">{formatPrice(currentBasePrice)}</span>
              </div>
            </div>
          </div>

          {/* Dialogue Feed */}
          <div className="space-y-3 p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 max-h-52 overflow-y-auto text-xs">
            {dialogueHistory.map((d, i) => (
              <div
                key={i}
                className={`flex gap-3 ${d.speaker === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {d.speaker === 'merchant' && (
                  <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                <div
                  className={`p-3 rounded-2xl max-w-[85%] leading-relaxed ${
                    d.speaker === 'user'
                      ? 'bg-amber-600 text-white rounded-tr-none font-medium'
                      : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none'
                  }`}
                >
                  <p className="whitespace-pre-line">{d.message}</p>
                  {d.perks && d.perks.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-slate-800 flex flex-wrap gap-1.5">
                      {d.perks.map((perk, pIdx) => (
                        <span key={pIdx} className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-300 text-[10px] font-semibold flex items-center gap-1">
                          <Gift className="w-3 h-3" /> {perk}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Interactive Offer Controls */}
          {(!negotiationResult || negotiationResult.status !== 'ACCEPTED') && round <= 3 && (
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-amber-500/20 space-y-4">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-300 flex items-center gap-1.5">
                  <TrendingDown className="w-4 h-4 text-amber-400" />
                  Your Pitch Offer:
                </span>
                <span className="font-mono font-black text-base text-amber-400">
                  ${Number(offeredPrice).toFixed(2)}{' '}
                  <span className="text-xs text-amber-300 font-semibold">({discountPercent.toFixed(1)}% OFF)</span>
                </span>
              </div>

              {/* Slider */}
              <input
                type="range"
                min={Math.round(currentBasePrice * 0.65)}
                max={Math.round(currentBasePrice * 0.95)}
                step="1"
                value={offeredPrice}
                onChange={(e) => setOfferedPrice(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
              />

              <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                <span>Wholesale Max (35% OFF)</span>
                <span>Standard Markdown (5% OFF)</span>
              </div>

              {/* Action Buttons */}
              <button
                onClick={handleSubmitOffer}
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-500/30 hover:brightness-110 active:scale-98 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Bot className="w-4 h-4 animate-spin" /> Evaluating Merchant Margin Floor...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" /> Submit Offer (Round {round}/3)
                  </>
                )}
              </button>
            </div>
          )}

          {/* Deal Acceptance Banner */}
          {negotiationResult && negotiationResult.generatedCouponCode && (
            <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-950/70 to-dark-950 border border-emerald-500/40 space-y-3 animate-fade-in shadow-xl shadow-emerald-950/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Authorized Merchant Coupon Issued!</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold">
                  {negotiationResult.validMinutes} MIN EXPIRY
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-emerald-500/30">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Checkout Promo Code:</span>
                  <div className="font-mono font-black text-lg text-emerald-300 tracking-wider">
                    {negotiationResult.generatedCouponCode}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Locked Price:</span>
                  <div className="font-black text-lg text-white">
                    ${(negotiationResult.acceptedPrice || negotiationResult.counterPrice || offeredPrice).toFixed(2)}
                  </div>
                </div>
              </div>

              <button
                onClick={handleClaimDeal}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/40 hover:brightness-110 active:scale-98 transition-all flex items-center justify-center gap-2"
              >
                <span>Add to Cart & Apply Bargain Promo</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
