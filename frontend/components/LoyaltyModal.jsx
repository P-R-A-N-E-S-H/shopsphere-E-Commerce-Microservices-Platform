'use client';

import React from 'react';
import { X, Award, Gift, Sparkles, Truck, Crown, Check, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { useLoyalty, REWARDS, LOYALTY_TIERS } from '../context/LoyaltyContext';

export default function LoyaltyModal() {
  const { points, currentTier, nextTier, pointsToNext, tierProgressPct, isLoyaltyOpen, setIsLoyaltyOpen, redeemReward } = useLoyalty();

  if (!isLoyaltyOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto backdrop-blur-md bg-slate-950/85 animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden my-6 max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-600 flex items-center justify-center text-white shadow-lg shadow-amber-500/30">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-100 text-base sm:text-lg">ShopSphere VIP Rewards</h3>
                <span className="text-xs">{currentTier.badge}</span>
              </div>
              <p className="text-xs text-slate-400">Earn points on every microservice saga checkout</p>
            </div>
          </div>
          <button
            onClick={() => setIsLoyaltyOpen(false)}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Tier Overview Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-950/50 via-slate-900 to-purple-950/50 border border-indigo-500/30 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-semibold text-indigo-300">CURRENT STATUS</span>
                <h4 className="text-2xl font-black text-slate-100 flex items-center gap-2 mt-0.5">
                  <span>{currentTier.name}</span>
                </h4>
                <p className="text-xs text-slate-400 mt-1">Earning {currentTier.multiplier}x points per $1 spent</p>
              </div>

              <div className="text-right">
                <span className="text-xs font-semibold text-slate-400">AVAILABLE BALANCE</span>
                <p className="text-3xl font-black bg-gradient-to-r from-amber-300 to-yellow-400 bg-clip-text text-transparent">
                  {points.toLocaleString()} PTS
                </p>
              </div>
            </div>

            {/* Progress to Next Tier */}
            {nextTier && (
              <div className="space-y-1.5 pt-2 border-t border-slate-800">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300">
                    Progress to <strong>{nextTier.name}</strong> ({nextTier.badge})
                  </span>
                  <span className="text-indigo-400 font-bold">{pointsToNext} points to unlock</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-indigo-500 to-amber-400 h-full rounded-full transition-all duration-500"
                    style={{ width: `${tierProgressPct}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Tier Multipliers Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs text-center">
            {Object.values(LOYALTY_TIERS).map((t) => (
              <div
                key={t.name}
                className={`p-3 rounded-xl border transition ${
                  currentTier.name === t.name
                    ? 'border-amber-500 bg-amber-500/10 text-slate-100'
                    : 'border-slate-800 bg-slate-950 text-slate-400'
                }`}
              >
                <span className="text-lg block mb-0.5">{t.badge}</span>
                <p className="font-bold truncate">{t.name}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">{t.multiplier}x multiplier</p>
              </div>
            ))}
          </div>

          {/* Rewards to Redeem */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Claim Instant Rewards</h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {REWARDS.map((rew) => {
                const canAfford = points >= rew.points;
                return (
                  <div
                    key={rew.id}
                    className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3"
                  >
                    <div className="space-y-0.5">
                      <h5 className="font-bold text-slate-200 text-xs">{rew.title}</h5>
                      <span className="text-[11px] font-mono text-amber-400 block">{rew.points} Points</span>
                      <span className="text-[10px] text-slate-500">Auto-applies code: {rew.code}</span>
                    </div>

                    <button
                      onClick={() => redeemReward(rew)}
                      disabled={!canAfford}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 shadow ${
                        canAfford
                          ? 'bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-slate-950'
                          : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      }`}
                    >
                      <Gift className="w-3.5 h-3.5" />
                      <span>Redeem</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
