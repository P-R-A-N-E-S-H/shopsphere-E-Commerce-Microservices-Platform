'use client';

import React from 'react';
import { ArrowLeftRight, X } from 'lucide-react';
import { useCompare } from '../context/CompareContext';

export default function CompareFloatingBar() {
  const { compareItems, compareCount, setIsCompareOpen, clearCompare } = useCompare();

  if (compareCount === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 animate-in fade-in slide-in-from-bottom-6 duration-300">
      <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-slate-900/95 border border-indigo-500/50 shadow-2xl backdrop-blur-2xl text-slate-100">
        <div className="flex items-center -space-x-2">
          {compareItems.map((item) => (
            <img
              key={item.id}
              src={item.images[0]}
              alt={item.name}
              className="w-8 h-8 rounded-full border-2 border-slate-900 object-cover"
            />
          ))}
        </div>

        <span className="text-xs font-bold text-slate-200">
          {compareCount} {compareCount === 1 ? 'item' : 'items'} in comparison
        </span>

        <button
          onClick={() => setIsCompareOpen(true)}
          className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5"
        >
          <ArrowLeftRight className="w-3.5 h-3.5" />
          <span>Compare Now</span>
        </button>

        <button
          onClick={clearCompare}
          className="p-1 text-slate-400 hover:text-rose-400 transition"
          title="Clear"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
