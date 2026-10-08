'use client';

import React from 'react';
import { X, Package, Truck, CheckCircle2, Clock, FileText, ArrowRight, RotateCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';
import { useCart } from '../context/CartContext';

export default function OrderHistoryModal({ isOpen, onClose, onTrackOrder }) {
  const { user } = useAuth();
  const { formatPrice } = useCurrency();
  const { showToast } = useCart();

  if (!isOpen) return null;

  const mockOrders = [
    {
      id: 'ord-101',
      orderNumber: 'ORD-849201',
      date: 'Oct 07, 2026',
      totalAmount: 348.00,
      status: 'SHIPPED',
      trackingNumber: 'TRK-FEDEX-94820194',
      carrier: 'FedEx Express',
      items: [
        {
          name: 'Sony WH-1000XM5 Wireless Headphones',
          image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
          price: 348.00,
          quantity: 1
        }
      ]
    },
    {
      id: 'ord-102',
      orderNumber: 'ORD-729184',
      date: 'Sep 28, 2026',
      totalAmount: 1199.00,
      status: 'DELIVERED',
      trackingNumber: 'TRK-FEDEX-88291039',
      carrier: 'FedEx 2-Day Air',
      items: [
        {
          name: 'Samsung Galaxy S24 Ultra Titanium',
          image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&q=80',
          price: 1199.00,
          quantity: 1
        }
      ]
    },
    {
      id: 'ord-103',
      orderNumber: 'ORD-551029',
      date: 'Sep 15, 2026',
      totalAmount: 115.00,
      status: 'DELIVERED',
      trackingNumber: 'TRK-FEDEX-44910283',
      carrier: 'FedEx Ground',
      items: [
        {
          name: "Nike Air Force 1 '07 Pro",
          image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&q=80',
          price: 115.00,
          quantity: 1
        }
      ]
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto backdrop-blur-md bg-slate-950/85 animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-3xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden my-6 max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60 shrink-0">
          <div className="flex items-center gap-2.5">
            <Package className="w-5 h-5 text-indigo-400" />
            <div>
              <h3 className="font-bold text-slate-100 text-base sm:text-lg">Your Order History</h3>
              <p className="text-xs text-slate-400">Account: {user?.email || 'Customer'}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Order List */}
        <div className="p-6 overflow-y-auto space-y-4 divide-y divide-slate-800/80">
          {mockOrders.map((ord) => (
            <div key={ord.id} className="pt-4 first:pt-0 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-sm text-slate-100">{ord.orderNumber}</span>
                  <span className="text-xs text-slate-500">• {ord.date}</span>
                </div>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                    ord.status === 'DELIVERED'
                      ? 'bg-emerald-500/15 text-emerald-400'
                      : 'bg-indigo-500/20 text-indigo-300'
                  }`}
                >
                  {ord.status}
                </span>
              </div>

              {/* Items in order */}
              <div className="space-y-2">
                {ord.items.map((it, idx) => (
                  <div key={idx} className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
                    <div className="flex items-center gap-3">
                      <img src={it.image} alt={it.name} className="w-12 h-12 object-cover rounded-lg border border-slate-800" />
                      <div>
                        <p className="text-xs font-semibold text-slate-200">{it.name}</p>
                        <p className="text-[11px] text-slate-400">Qty: {it.quantity}</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-slate-100">{formatPrice(it.price)}</span>
                  </div>
                ))}
              </div>

              {/* Footer row of order card */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-1 text-xs">
                <div>
                  <span className="text-slate-400">Order Total: </span>
                  <strong className="text-slate-100">{formatPrice(ord.totalAmount)}</strong>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => showToast(`Invoice for ${ord.orderNumber} generated!`)}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-semibold flex items-center gap-1 transition"
                  >
                    <FileText className="w-3.5 h-3.5 text-slate-400" />
                    <span>Receipt</span>
                  </button>

                  <button
                    onClick={() => {
                      onClose();
                      onTrackOrder(ord);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow transition"
                  >
                    <Truck className="w-3.5 h-3.5" />
                    <span>Track Shipment</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
