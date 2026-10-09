'use client';

import React from 'react';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Activity,
  Cpu,
  Layers,
  Flame,
  Camera,
  Network,
  Radio,
  Bot
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function HeroBanner({ onExploreClick, onOpenBargain, onOpenVision, onOpenVoice, onOpenNeural }) {
  const { setIsAdminOpen } = useAuth();

  return (
    <div className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-24 border-b border-indigo-500/20 bg-gradient-to-b from-dark-950 via-slate-950/60 to-dark-950">
      {/* Background glowing cyber orbs */}
      <div className="absolute top-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-cyan-500/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[450px] h-[320px] bg-purple-600/15 blur-[110px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          {/* Top Pill Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/30 text-xs font-semibold text-cyan-300 shadow-lg shadow-cyan-500/10 backdrop-blur-md">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
            <span className="font-mono text-white font-bold">ShopSphere AI v2.0 Platform</span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-300 font-normal">Autonomous Swarm • Dynamic Bargaining • Neural Search</span>
          </div>

          {/* Main Hero Heading */}
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-[1.12] font-outfit">
            Next-Gen Autonomous{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-indigo-300 to-pink-400 bg-clip-text text-transparent">
              AI Commerce
            </span>{' '}
            Ecosystem
          </h1>

          {/* Hero Subtitle */}
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Experience multi-agent shopping intelligence. Negotiate live wholesale margins with our AI Merchant,
            execute deep multimodal visual search, and stream distributed transactions across 15 microservices.
          </p>

          {/* Interactive AI Feature Trigger Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={onOpenBargain}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:brightness-110 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-500/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
            >
              <Flame className="w-4 h-4 text-slate-950" />
              <span>Negotiate with AI</span>
            </button>

            <button
              onClick={onOpenVision}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:brightness-110 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
            >
              <Camera className="w-4 h-4" />
              <span>Multimodal Vision Lab</span>
            </button>

            <button
              onClick={onOpenNeural}
              className="px-5 py-3 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-purple-300 border border-purple-500/40 font-bold text-xs uppercase tracking-wider hover:scale-105 transition-all flex items-center gap-2 shadow-md"
            >
              <Network className="w-4 h-4 text-purple-400" />
              <span>Neural Agent Mesh</span>
            </button>
          </div>

          {/* Metrics bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 pt-8 text-left">
            <div className="p-4 rounded-2xl bg-slate-900/70 border border-indigo-500/20 backdrop-blur-md">
              <div className="flex items-center gap-2 text-cyan-400 mb-1">
                <Bot className="w-4 h-4" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Agent Swarm</span>
              </div>
              <p className="text-2xl font-black text-white font-outfit">6 AI Agents</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Autonomous orchestration</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/70 border border-indigo-500/20 backdrop-blur-md">
              <div className="flex items-center gap-2 text-purple-400 mb-1">
                <Zap className="w-4 h-4" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Inference Speed</span>
              </div>
              <p className="text-2xl font-black text-cyan-400 font-mono">&lt; 12 ms</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Real-time vector matching</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/70 border border-indigo-500/20 backdrop-blur-md">
              <div className="flex items-center gap-2 text-emerald-400 mb-1">
                <ShieldCheck className="w-4 h-4" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Fraud Sentinel</span>
              </div>
              <p className="text-2xl font-black text-emerald-400 font-mono">99.96%</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Zero false positives</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/70 border border-indigo-500/20 backdrop-blur-md">
              <div className="flex items-center gap-2 text-amber-400 mb-1">
                <Layers className="w-4 h-4" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Microservices</span>
              </div>
              <p className="text-2xl font-black text-white font-outfit">15 Services</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Java 21 • Kafka Sagas</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
