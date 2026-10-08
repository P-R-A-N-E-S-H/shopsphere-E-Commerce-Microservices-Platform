'use client';

import React from 'react';
import { useCart } from '../context/CartContext';
import { CheckCircle2, Info, AlertTriangle } from 'lucide-react';

export default function ToastContainer() {
  const { toast } = useCart();

  if (!toast) return null;

  const isSuccess = toast.type === 'success' || !toast.type;
  const isInfo = toast.type === 'info';

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-5 duration-300 pointer-events-none">
      <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-slate-900/95 border border-slate-700 shadow-2xl backdrop-blur-xl text-slate-100 text-xs sm:text-sm font-medium">
        {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
        {isInfo && <Info className="w-5 h-5 text-indigo-400 shrink-0" />}
        {!isSuccess && !isInfo && <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />}
        <span>{toast.message}</span>
      </div>
    </div>
  );
}
