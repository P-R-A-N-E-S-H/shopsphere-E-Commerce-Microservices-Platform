'use client';

import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Zap, Activity, Cpu, Layers, Terminal } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function HeroBanner({ onExploreClick }) {
  const { setIsAdminOpen } = useAuth();

  return (
    <div className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-24 border-b border-slate-800/60 bg-gradient-to-b from-slate-950 via-slate-900/40 to-slate-950">
      {/* Background glowing orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-indigo-600/15 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[400px] h-[300px] bg-purple-600/15 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          {/* Top Pill Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-indigo-500/30 text-xs font-semibold text-indigo-300 shadow-lg shadow-indigo-500/10 backdrop-blur-md">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500" />
            </span>
            <span className="font-mono text-indigo-200">ShopSphere Enterprise v2.4</span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-300 font-normal">Java 21 • Kafka Sagas • Redis Multi-Tier</span>
          </div>

          {/* Main Hero Heading */}
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-100 leading-[1.15]">
            Ultra-Fast, Resilient{' '}
            <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">
              Event-Driven
            </span>{' '}
            E-Commerce
          </h1>

          {/* Hero Subtitle */}
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Engineered with a 14-microservice distributed backbone. Powered by Spring Boot 3.3.4,
            transactional Outbox Kafka events, optimistic inventory locking, and sub-millisecond Redis caching.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={onExploreClick}
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
            >
              <span>Shop Featured Catalog</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsAdminOpen(true)}
              className="px-6 py-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700 hover:border-slate-600 font-semibold text-sm transition-all flex items-center gap-2.5 shadow-md group"
            >
              <Activity className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
              <span>Live Mesh & Analytics</span>
            </button>
          </div>

          {/* Metrics bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 pt-8 text-left">
            <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-md">
              <div className="flex items-center gap-2 text-indigo-400 mb-1">
                <Layers className="w-4 h-4" />
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Microservices</span>
              </div>
              <p className="text-2xl font-black text-slate-100">14 Services</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Isolated DBs & Kafka Mesh</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-md">
              <div className="flex items-center gap-2 text-purple-400 mb-1">
                <Zap className="w-4 h-4" />
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Redis Cache</span>
              </div>
              <p className="text-2xl font-black text-slate-100">&lt; 15 ms</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Sub-second P99 latency</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-md">
              <div className="flex items-center gap-2 text-emerald-400 mb-1">
                <ShieldCheck className="w-4 h-4" />
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Checkout Saga</span>
              </div>
              <p className="text-2xl font-black text-slate-100">100% ACID</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Outbox Pattern & Rollbacks</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-md">
              <div className="flex items-center gap-2 text-pink-400 mb-1">
                <Cpu className="w-4 h-4" />
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Architecture</span>
              </div>
              <p className="text-2xl font-black text-slate-100">Java 21 / Spring</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Dockerized Microservices</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
