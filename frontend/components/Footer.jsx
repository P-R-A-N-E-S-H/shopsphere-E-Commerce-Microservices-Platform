'use client';

import React, { useState } from 'react';
import { Layers, ShieldCheck, Mail, ArrowRight, Github, Heart, Sparkles, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function Footer() {
  const { showToast } = useCart();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    showToast('Subscribed to ShopSphere developer & catalog updates!');
    setEmail('');
  };

  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Col 1: Brand & Overview */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                <Layers className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-slate-100">
                Shop<span className="text-indigo-400">Sphere</span>
              </span>
            </div>

            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              An enterprise-grade, event-driven e-commerce microservices platform built with Java 21, Spring Boot 3,
              Apache Kafka, Redis multi-tier caching, and PostgreSQL isolated databases.
            </p>

            {/* Newsletter input */}
            <form onSubmit={handleSubscribe} className="pt-2 flex gap-2 max-w-sm">
              <input
                type="email"
                required
                placeholder="Enter work email for release notes..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-slate-900 border border-slate-750 text-slate-200 text-xs rounded-xl px-3.5 py-2 flex-1 focus:outline-none focus:border-indigo-500 placeholder-slate-500"
              />
              <button
                type="submit"
                className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition flex items-center gap-1 shrink-0"
              >
                {subscribed ? <Check className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
              </button>
            </form>
          </div>

          {/* Col 2: Microservices Backend */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">Core Microservices</h4>
            <ul className="space-y-2 text-slate-400">
              <li><span className="hover:text-indigo-400 cursor-pointer transition">API Gateway (:8080)</span></li>
              <li><span className="hover:text-indigo-400 cursor-pointer transition">Auth & JWT (:8081)</span></li>
              <li><span className="hover:text-indigo-400 cursor-pointer transition">User Profiles (:8082)</span></li>
              <li><span className="hover:text-indigo-400 cursor-pointer transition">Product Catalog (:8083)</span></li>
              <li><span className="hover:text-indigo-400 cursor-pointer transition">FullText Search (:8084)</span></li>
            </ul>
          </div>

          {/* Col 3: Commerce Services */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">Saga Participants</h4>
            <ul className="space-y-2 text-slate-400">
              <li><span className="hover:text-indigo-400 cursor-pointer transition">Cart & Redis (:8085)</span></li>
              <li><span className="hover:text-indigo-400 cursor-pointer transition">Inventory Engine (:8087)</span></li>
              <li><span className="hover:text-indigo-400 cursor-pointer transition">Order Saga (:8088)</span></li>
              <li><span className="hover:text-indigo-400 cursor-pointer transition">Payment Mesh (:8089)</span></li>
              <li><span className="hover:text-indigo-400 cursor-pointer transition">FedEx Dispatch (:8091)</span></li>
            </ul>
          </div>

          {/* Col 4: Intelligence & Feed */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">Intelligence & Events</h4>
            <ul className="space-y-2 text-slate-400">
              <li><span className="hover:text-indigo-400 cursor-pointer transition">Coupon Engine (:8090)</span></li>
              <li><span className="hover:text-indigo-400 cursor-pointer transition">Review Analytics (:8092)</span></li>
              <li><span className="hover:text-indigo-400 cursor-pointer transition">Notification Feed (:8093)</span></li>
              <li><span className="hover:text-indigo-400 cursor-pointer transition">Telemetry & KPI (:8094)</span></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>100% Outbox Pattern & Saga Event Consistency</span>
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-500">
            <span>© 2026 ShopSphere Platform Inc. All rights reserved.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
