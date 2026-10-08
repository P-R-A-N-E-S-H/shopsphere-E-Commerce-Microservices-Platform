'use client';

import React, { useState } from 'react';
import { X, Truck, Package, CheckCircle2, Clock, MapPin, Search, ArrowRight, ShieldCheck } from 'lucide-react';

export default function OrderTrackerModal({ order, isOpen, onClose }) {
  const [searchCode, setSearchCode] = useState('');
  const [activeOrder, setActiveOrder] = useState(
    order || {
      orderNumber: 'ORD-849201',
      trackingNumber: 'TRK-FEDEX-94820194',
      status: 'SHIPPED',
      totalAmount: 348.00,
      carrier: 'FedEx Priority Express',
      estimatedDelivery: 'Tomorrow, Oct 09 by 4:30 PM',
      currentLocation: 'Memphis Hub Sorting Facility, TN',
      items: [
        { productName: 'Sony WH-1000XM5 Wireless Headphones', quantity: 1, price: 348.00 }
      ]
    }
  );

  if (!isOpen) return null;

  const steps = [
    { title: 'Order Placed', service: 'Order Service', desc: 'Saga initiated and persisted in PostgreSQL', done: true },
    { title: 'Inventory Locked', service: 'Inventory Service', desc: 'Stock decremented with optimistic locks', done: true },
    { title: 'Payment Captured', service: 'Payment Service', desc: 'Idempotency verified and charged', done: true },
    { title: 'FedEx Dispatched', service: 'Shipping Service', desc: 'Package scanned at origin facility', done: true },
    { title: 'Out for Delivery', service: 'FedEx Courier', desc: 'Courier en route to delivery address', done: false },
    { title: 'Delivered', service: 'Recipient Handover', desc: 'Signed and completed', done: false }
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchCode.trim()) return;
    setActiveOrder({
      orderNumber: searchCode.toUpperCase().startsWith('ORD') ? searchCode.toUpperCase() : 'ORD-729184',
      trackingNumber: searchCode.toUpperCase().startsWith('TRK') ? searchCode.toUpperCase() : 'TRK-FEDEX-88291039',
      status: 'SHIPPED',
      totalAmount: 1199.00,
      carrier: 'FedEx 2-Day Air',
      estimatedDelivery: 'Friday, Oct 10 by 2:00 PM',
      currentLocation: 'San Jose Logistics Center, CA',
      items: [{ productName: 'Samsung Galaxy S24 Ultra Titanium', quantity: 1, price: 1199.00 }]
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto backdrop-blur-md bg-slate-950/80 animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
          <div className="flex items-center gap-2.5">
            <Truck className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-slate-100 text-base sm:text-lg">Real-Time Order & Shipment Tracker</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Search bar */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Enter Order # or Tracking # (e.g., ORD-849201)"
                value={searchCode}
                onChange={(e) => setSearchCode(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono"
              />
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition flex items-center gap-1.5"
            >
              <span>Track</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Active order info card */}
          {activeOrder && (
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/60 pb-3">
                <div>
                  <span className="text-[11px] text-slate-400 font-mono">ORDER ID</span>
                  <p className="font-mono font-bold text-slate-100 text-sm">{activeOrder.orderNumber}</p>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 font-mono">TRACKING #</span>
                  <p className="font-mono font-bold text-indigo-400 text-sm">{activeOrder.trackingNumber}</p>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 font-mono">STATUS</span>
                  <span className="block px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold mt-0.5">
                    IN TRANSIT
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs pt-1">
                <div>
                  <span className="text-slate-400">Carrier & Service:</span>
                  <p className="font-semibold text-slate-200 mt-0.5">{activeOrder.carrier}</p>
                </div>
                <div>
                  <span className="text-slate-400">Estimated Delivery:</span>
                  <p className="font-bold text-amber-400 mt-0.5">{activeOrder.estimatedDelivery}</p>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center gap-2 text-xs text-slate-300">
                <MapPin className="w-4 h-4 text-rose-400 shrink-0" />
                <span>Last Scan: <strong>{activeOrder.currentLocation}</strong></span>
              </div>
            </div>
          )}

          {/* Stepper Timeline */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Kafka Event Saga Lifecycle</h4>

            <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
              {steps.map((s, idx) => (
                <div key={idx} className="relative group">
                  <div
                    className={`absolute -left-[27px] top-0.5 w-4 h-4 rounded-full border-2 transition-all flex items-center justify-center ${
                      s.done
                        ? 'bg-emerald-500 border-emerald-400 text-white shadow-lg shadow-emerald-500/40'
                        : 'bg-slate-950 border-slate-700 text-transparent'
                    }`}
                  >
                    {s.done && <CheckCircle2 className="w-3 h-3" />}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-bold ${s.done ? 'text-slate-100' : 'text-slate-500'}`}>
                        {s.title}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-indigo-300">
                        {s.service}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
