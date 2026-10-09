'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  ThumbsUp,
  CheckCircle2,
  Percent,
  Layers,
  Star
} from 'lucide-react';
import { api, INITIAL_PRODUCTS } from '../lib/api';

export default function SentimentRadarModal({ isOpen, onClose, product }) {
  const [radarData, setRadarData] = useState(null);
  const [loading, setLoading] = useState(true);

  const targetProduct = product || INITIAL_PRODUCTS[0];

  useEffect(() => {
    if (isOpen) {
      loadRadarData();
    }
  }, [isOpen, targetProduct]);

  const loadRadarData = async () => {
    setLoading(true);
    try {
      const res = await api.getSentimentRadar(targetProduct.id);
      setRadarData(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-2xl rounded-3xl glass-panel dark:bg-dark-900/95 border border-emerald-500/30 shadow-2xl shadow-emerald-950/50 overflow-hidden flex flex-col max-h-[90vh] animate-slide-up">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-dark-950 via-emerald-950/40 to-dark-900 border-b border-emerald-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-extrabold text-white font-outfit">
                  AI Sentiment &amp; Return Risk Radar
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono">
                  VERIFIED AI
                </span>
              </div>
              <p className="text-xs text-emerald-200/70">Aspect-Based Sentiment Extraction &amp; Buyer Trust Index</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* Top Product Summary */}
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-center gap-4">
            <img
              src={targetProduct.images?.[0] || 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80'}
              alt={targetProduct.name}
              className="w-14 h-14 rounded-xl object-cover bg-slate-800 shrink-0 border border-slate-700"
            />
            <div className="flex-1 min-w-0">
              <h3 className="font-extrabold text-sm text-white truncate">{targetProduct.name}</h3>
              <div className="flex items-center gap-3 mt-1">
                <span className="flex items-center gap-1 text-amber-400 font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400" /> {targetProduct.rating} ({targetProduct.reviewCount || 128} verified reviews)
                </span>
                <span className="text-slate-400">•</span>
                <span className="text-emerald-400 font-bold">Overwhelmingly Positive</span>
              </div>
            </div>
          </div>

          {/* Key Metrics Cards */}
          {radarData && (
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-950/50 to-slate-900/90 border border-emerald-500/30 text-center">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Verified Buyer Trust Score</span>
                <div className="text-2xl font-black text-emerald-400 font-mono mt-1">
                  {radarData.verifiedBuyerTrustIndex}%
                </div>
                <span className="text-[10px] text-emerald-300">Highest tier authenticity rating</span>
              </div>

              <div className="p-4 rounded-2xl bg-gradient-to-br from-cyan-950/50 to-slate-900/90 border border-cyan-500/30 text-center">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Predicted Return Risk</span>
                <div className="text-2xl font-black text-cyan-400 font-mono mt-1">
                  {radarData.returnProbabilityPercent}%
                </div>
                <span className="text-[10px] text-cyan-300">Ultra-low return rate trajectory</span>
              </div>
            </div>
          )}

          {/* Aspect Sentiment Progress Bars */}
          {radarData && radarData.aspectScores && (
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
              <h4 className="font-extrabold text-xs text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-400" /> Aspect Sentiment Analysis:
              </h4>

              <div className="space-y-2.5">
                {Object.entries(radarData.aspectScores).map(([aspect, score]) => (
                  <div key={aspect} className="space-y-1">
                    <div className="flex justify-between text-[11px] font-semibold text-slate-300">
                      <span>{aspect}</span>
                      <span className="font-mono text-emerald-400">{score}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400"
                        style={{ width: `${score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Key Positives & Concerns */}
          {radarData && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/20 space-y-2">
                <h5 className="font-bold text-emerald-300 text-xs flex items-center gap-1.5">
                  <ThumbsUp className="w-3.5 h-3.5" /> Key Verified Strengths:
                </h5>
                <ul className="space-y-1.5 text-slate-300 text-[11px]">
                  {radarData.topKeyPositives?.map((pos, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{pos}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/20 space-y-2">
                <h5 className="font-bold text-amber-300 text-xs flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" /> Keep in Mind:
                </h5>
                <ul className="space-y-1.5 text-slate-300 text-[11px]">
                  {radarData.topKeyConcerns?.map((con, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-amber-400 font-bold shrink-0">•</span>
                      <span>{con}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
