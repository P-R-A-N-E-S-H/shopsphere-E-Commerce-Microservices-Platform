'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Activity,
  Layers,
  TrendingUp,
  DollarSign,
  ShoppingBag,
  Users,
  ShieldCheck,
  Server,
  Zap,
  Cpu,
  RefreshCw,
  Radio,
  Clock,
  Play,
  AlertOctagon,
  RotateCcw,
  Truck,
  Flame,
  ShieldAlert,
  Database
} from 'lucide-react';
import { api } from '../lib/api';
import { useCurrency } from '../context/CurrencyContext';

const SERVICES = [
  { name: 'API Gateway', port: 8080, db: 'Spring Cloud', topic: 'Global Routes', latency: '4ms', status: 'HEALTHY' },
  { name: 'Auth Service', port: 8081, db: 'PostgreSQL + Redis', topic: 'user-events', latency: '12ms', status: 'HEALTHY' },
  { name: 'User Service', port: 8082, db: 'PostgreSQL', topic: 'user-events', latency: '14ms', status: 'HEALTHY' },
  { name: 'Product Service', port: 8083, db: 'PostgreSQL + Redis', topic: 'product-events', latency: '8ms', status: 'HEALTHY' },
  { name: 'Search Service', port: 8084, db: 'PostgreSQL FullText', topic: 'product-events', latency: '11ms', status: 'HEALTHY' },
  { name: 'Cart Service', port: 8085, db: 'Redis Multi-Key', topic: 'cart-events', latency: '3ms', status: 'HEALTHY' },
  { name: 'Wishlist Service', port: 8086, db: 'Redis Cluster', topic: 'wishlist-events', latency: '2ms', status: 'HEALTHY' },
  { name: 'Inventory Service', port: 8087, db: 'PostgreSQL (Versioned)', topic: 'inventory-events', latency: '18ms', status: 'HEALTHY' },
  { name: 'Order Service', port: 8088, db: 'PostgreSQL (Saga)', topic: 'order-events', latency: '15ms', status: 'HEALTHY' },
  { name: 'Payment Service', port: 8089, db: 'PostgreSQL (Idempotent)', topic: 'payment-events', latency: '22ms', status: 'HEALTHY' },
  { name: 'Coupon Service', port: 8090, db: 'PostgreSQL', topic: 'coupon-events', latency: '9ms', status: 'HEALTHY' },
  { name: 'Shipping Service', port: 8091, db: 'PostgreSQL', topic: 'shipping-events', latency: '16ms', status: 'HEALTHY' },
  { name: 'Review Service', port: 8092, db: 'PostgreSQL', topic: 'review-events', latency: '13ms', status: 'HEALTHY' },
  { name: 'Notification Service', port: 8093, db: 'PostgreSQL', topic: 'Multi-Topic Listener', latency: '10ms', status: 'HEALTHY' },
  { name: 'Analytics Service', port: 8094, db: 'PostgreSQL Aggregator', topic: 'Stream Ingestion', latency: '15ms', status: 'HEALTHY' },
  { name: 'AI Orchestrator Service', port: 8095, db: 'PostgreSQL + Vector Embeddings', topic: 'ai-insights-events', latency: '11ms', status: 'HEALTHY' }
];

export default function AdminDashboardModal({ isOpen, onClose }) {
  const { formatPrice } = useCurrency();
  const [stats, setStats] = useState({
    totalRevenue: 170766.00,
    totalOrders: 288,
    activeCustomers: 194,
    averageOrderValue: 592.93,
    conversionRate: 4.2,
    revenueGrowthPercent: 23.8
  });

  const [salesTrend, setSalesTrend] = useState([]);
  const [activeTab, setActiveTab] = useState('mesh'); // 'mesh' | 'events' | 'chaos' | 'charts'
  const [circuitBreakerState, setCircuitBreakerState] = useState('CLOSED'); // 'CLOSED' | 'OPEN' | 'HALF-OPEN'
  const [cacheStatus, setCacheStatus] = useState('WARM (100% HIT RATE)');
  const [simulatedEvents, setSimulatedEvents] = useState([
    { id: 1, type: 'OrderCreatedEvent', topic: 'order-events', data: 'ORD-849201 for $348.00 by usr-100', time: '1s ago' },
    { id: 2, type: 'InventoryReservedEvent', topic: 'inventory-events', data: 'SKU-SNY-WH1000XM5 qty: 1 reserved', time: '2s ago' },
    { id: 3, type: 'PaymentAuthorizedEvent', topic: 'payment-events', data: 'Charge $348.00 via VISA ****4242 OK', time: '3s ago' },
    { id: 4, type: 'ShipmentCreatedEvent', topic: 'shipping-events', data: 'TRK-FEDEX-94820194 tracking assigned', time: '4s ago' }
  ]);

  useEffect(() => {
    if (isOpen) {
      api.getAnalyticsDashboard().then((data) => {
        if (data) setStats(data);
      });
      api.getSalesTrend().then((trend) => {
        if (trend) setSalesTrend(trend);
      });
    }
  }, [isOpen]);

  // Push new event helper
  const pushEvent = (type, topic, data) => {
    setSimulatedEvents((prev) => [
      { id: Date.now() + Math.random(), type, topic, data, time: 'Just now' },
      ...prev.slice(0, 14)
    ]);
  };

  // Interactive Saga Simulators
  const handleSimulateSuccessfulSaga = () => {
    const ordId = Math.floor(100000 + Math.random() * 900000);
    const amount = Math.floor(250 + Math.random() * 950);
    pushEvent('OrderCreatedEvent', 'order-events', `ORD-${ordId} initiated for $${amount}.00`);
    setTimeout(() => pushEvent('InventoryReservedEvent', 'inventory-events', `Optimistic lock verified: stock reserved for ORD-${ordId}`), 400);
    setTimeout(() => pushEvent('PaymentAuthorizedEvent', 'payment-events', `Idempotent authorization of $${amount}.00 OK`), 900);
    setTimeout(() => pushEvent('ShipmentCreatedEvent', 'shipping-events', `TRK-FEDEX-${Math.floor(10000000 + Math.random() * 90000000)} generated`), 1400);
    setTimeout(() => {
      setStats((prev) => ({
        ...prev,
        totalOrders: prev.totalOrders + 1,
        totalRevenue: prev.totalRevenue + amount
      }));
    }, 1500);
  };

  const handleSimulateInventoryRollback = () => {
    const ordId = Math.floor(100000 + Math.random() * 900000);
    pushEvent('OrderCreatedEvent', 'order-events', `ORD-${ordId} initiated`);
    setTimeout(() => pushEvent('InventoryShortageException', 'inventory-events', `SKU-ITEM out of stock! Compensatory saga triggered for ORD-${ordId}`), 500);
    setTimeout(() => pushEvent('OrderCancelledEvent', 'order-events', `ORD-${ordId} status transitioned to CANCELLED`), 1000);
    setTimeout(() => pushEvent('CustomerNotificationSent', 'notification-events', `Stock shortage email sent for ORD-${ordId}`), 1400);
  };

  const handleSimulatePaymentBlock = () => {
    const ordId = Math.floor(100000 + Math.random() * 900000);
    pushEvent('OrderCreatedEvent', 'order-events', `ORD-${ordId} initiated`);
    setTimeout(() => pushEvent('InventoryReservedEvent', 'inventory-events', `Stock reserved for ORD-${ordId}`), 400);
    setTimeout(() => pushEvent('PaymentDeclinedEvent', 'payment-events', `Bank rejected card: 402 Card Declined for ORD-${ordId}`), 900);
    setTimeout(() => pushEvent('InventoryReleasedEvent', 'inventory-events', `Compensating rollback: released reserved stock for ORD-${ordId}`), 1300);
    setTimeout(() => pushEvent('OrderFailedEvent', 'order-events', `ORD-${ordId} marked FAILED`), 1700);
  };

  const handleSimulateFedExScan = () => {
    const trk = Math.floor(10000000 + Math.random() * 90000000);
    pushEvent('ShipmentInTransit', 'shipping-events', `TRK-FEDEX-${trk} scanned at Memphis Air Sorting Facility, TN`);
  };

  // Chaos controls
  const handleTripCircuitBreaker = () => {
    setCircuitBreakerState('OPEN');
    pushEvent('CircuitBreakerStateChanged', 'resilience-events', 'PaymentService Circuit Breaker tripped to OPEN due to 5 consecutive 503 failures!');
  };

  const handleHalfOpenCircuitBreaker = () => {
    setCircuitBreakerState('HALF-OPEN');
    pushEvent('CircuitBreakerTrialCall', 'resilience-events', 'Testing canary trial request in HALF-OPEN state...');
  };

  const handleResetCircuitBreaker = () => {
    setCircuitBreakerState('CLOSED');
    pushEvent('CircuitBreakerReset', 'resilience-events', 'PaymentService Circuit Breaker recovered to CLOSED. Normal traffic restored.');
  };

  const handleEvictCache = () => {
    setCacheStatus('COLD (EVICTED) ➔ POPULATING FROM POSTGRES...');
    pushEvent('RedisCacheEvicted', 'cache-events', 'FLUSHDB executed on products:catalog key. Fallback to SQL DB.');
    setTimeout(() => {
      setCacheStatus('WARM (RE-CACHED & READY)');
      pushEvent('RedisCacheWarmed', 'cache-events', 'PostgreSQL catalog query repopulated Redis with 1hr TTL.');
    }, 1800);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto backdrop-blur-md bg-slate-950/85 animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-5xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden my-6 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-100 text-base sm:text-lg">ShopSphere Enterprise Mesh Monitor</h3>
                <span className="flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  15/15 LIVE
                </span>
              </div>
              <p className="text-xs text-slate-400">Spring Cloud Gateway • Apache Kafka • Redis • PostgreSQL</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Top KPI Cards */}
        <div className="p-6 border-b border-slate-800/80 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 bg-slate-950/30 shrink-0">
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center justify-between text-indigo-400 mb-1">
              <span className="text-xs font-semibold text-slate-400">Total Revenue</span>
              <DollarSign className="w-4 h-4" />
            </div>
            <p className="text-2xl font-black text-slate-100">
              {formatPrice(stats.totalRevenue)}
            </p>
            <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" /> +{stats.revenueGrowthPercent}% this month
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center justify-between text-purple-400 mb-1">
              <span className="text-xs font-semibold text-slate-400">Total Orders</span>
              <ShoppingBag className="w-4 h-4" />
            </div>
            <p className="text-2xl font-black text-slate-100">{stats.totalOrders}</p>
            <span className="text-[11px] text-slate-400 mt-1 block">99.8% Saga success rate</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center justify-between text-pink-400 mb-1">
              <span className="text-xs font-semibold text-slate-400">Active Customers</span>
              <Users className="w-4 h-4" />
            </div>
            <p className="text-2xl font-black text-slate-100">{stats.activeCustomers}</p>
            <span className="text-[11px] text-indigo-400 mt-1 block">Avg: {formatPrice(stats.averageOrderValue)}</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center justify-between text-emerald-400 mb-1">
              <span className="text-xs font-semibold text-slate-400">Mesh Health</span>
              <Activity className="w-4 h-4" />
            </div>
            <p className="text-2xl font-black text-emerald-400">100% Up</p>
            <span className="text-[11px] text-slate-400 mt-1 block">P99 Latency &lt; 14ms</span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 border-b border-slate-800 flex gap-4 text-xs font-semibold bg-slate-950/20 shrink-0">
          <button
            onClick={() => setActiveTab('mesh')}
            className={`py-3 border-b-2 flex items-center gap-2 transition ${
              activeTab === 'mesh' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Server className="w-4 h-4" />
            <span>Architecture Matrix ({SERVICES.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('ai-ops')}
            className={`py-3 border-b-2 flex items-center gap-2 transition ${
              activeTab === 'ai-ops' ? 'border-cyan-400 text-cyan-300' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span>AI Swarm &amp; Fraud Ops</span>
          </button>
          <button
            onClick={() => setActiveTab('events')}
            className={`py-3 border-b-2 flex items-center gap-2 transition ${
              activeTab === 'events' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Radio className="w-4 h-4 text-rose-400 animate-pulse" />
            <span>Live Kafka Sagas</span>
          </button>
          <button
            onClick={() => setActiveTab('chaos')}
            className={`py-3 border-b-2 flex items-center gap-2 transition ${
              activeTab === 'chaos' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Flame className="w-4 h-4 text-amber-400" />
            <span>Chaos & Resilience4j</span>
          </button>
          <button
            onClick={() => setActiveTab('charts')}
            className={`py-3 border-b-2 flex items-center gap-2 transition ${
              activeTab === 'charts' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Revenue Trends</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* Tab 1: Microservices Matrix */}
          {activeTab === 'mesh' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {SERVICES.map((srv, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-indigo-500/40 transition flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-bold text-slate-200 text-xs">{srv.name}</span>
                        <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
                          :{srv.port}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 flex items-center gap-1.5">
                        <Cpu className="w-3 h-3 text-slate-500" />
                        <span>{srv.db}</span>
                      </p>
                      <p className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                        <Radio className="w-3 h-3 text-purple-400" />
                        <span className="font-mono">{srv.topic}</span>
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2 mt-2 border-t border-slate-855 text-[10px]">
                      <span className="text-emerald-400 flex items-center gap-1 font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        ONLINE
                      </span>
                      <span className="text-slate-400 font-mono">{srv.latency}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 2: Autonomous AI Swarm & Fraud Ops */}
          {activeTab === 'ai-ops' && (
            <div className="space-y-5">
              {/* AI Agent Swarm Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-cyan-950/60 to-slate-900 border border-cyan-500/30">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] text-cyan-400 font-bold">FRAUD SENTINEL</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  </div>
                  <h4 className="font-extrabold text-sm text-white mt-1">Sub-10ms Risk Gate</h4>
                  <p className="text-[11px] text-slate-400 mt-1">Evaluated 48 checkouts today. 0 false positives.</p>
                  <div className="mt-3 pt-2 border-t border-slate-800 flex justify-between text-[11px] font-mono">
                    <span className="text-slate-500">Threat Level:</span>
                    <span className="text-emerald-400 font-bold">LOW (0.04%)</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-950/60 to-slate-900 border border-amber-500/30">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] text-amber-400 font-bold">DYNAMIC BARGAINING</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  </div>
                  <h4 className="font-extrabold text-sm text-white mt-1">Automated Margin Merchant</h4>
                  <p className="text-[11px] text-slate-400 mt-1">Generated $24,890 in loyalty checkout deals.</p>
                  <div className="mt-3 pt-2 border-t border-slate-800 flex justify-between text-[11px] font-mono">
                    <span className="text-slate-500">Margin Retention:</span>
                    <span className="text-amber-400 font-bold">88.4%</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-950/60 to-slate-900 border border-purple-500/30">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] text-purple-400 font-bold">SUPPLY CHAIN AGENT</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  </div>
                  <h4 className="font-extrabold text-sm text-white mt-1">Predictive Restock Sentinel</h4>
                  <p className="text-[11px] text-slate-400 mt-1">100-unit supplier PO dispatched for Sony WH-1000XM5.</p>
                  <div className="mt-3 pt-2 border-t border-slate-800 flex justify-between text-[11px] font-mono">
                    <span className="text-slate-500">Stockout Risk:</span>
                    <span className="text-purple-300 font-bold">RESOLVED</span>
                  </div>
                </div>
              </div>

              {/* Live AI Decision Log Stream */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-cyan-400 flex items-center gap-1.5">
                    <Activity className="w-4 h-4" /> Live AI Autonomous Decision Stream
                  </span>
                  <span className="text-emerald-400">Kafka [ai-insights-events]</span>
                </div>

                <div className="space-y-2 text-[11px] font-mono">
                  <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
                    <span className="text-slate-300">🤖 [OmniCopilot] Executed vector search for audiophile headphones</span>
                    <span className="text-slate-500">14ms latency</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
                    <span className="text-amber-300">🏷️ [DynamicPricing] Authorized 12% margin counter-offer (code: COUNTER-99381)</span>
                    <span className="text-slate-500">9ms latency</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
                    <span className="text-emerald-300">🛡️ [FraudSentinel] Verified biometric &amp; card token fingerprint for ORD-849201</span>
                    <span className="text-slate-500">6ms latency</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Live Kafka Events Feed with Interactive Simulator */}
          {activeTab === 'events' && (
            <div className="space-y-4">
              {/* Simulator Action Controls */}
              <div className="p-4 rounded-2xl bg-indigo-950/20 border border-indigo-500/30 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-indigo-300 flex items-center gap-1.5">
                    <Play className="w-3.5 h-3.5" />
                    <span>Interactive Saga Simulator Triggers</span>
                  </span>
                  <span className="text-[11px] text-slate-400">Click to emit synthetic events</span>
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  <button
                    onClick={handleSimulateSuccessfulSaga}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow transition flex items-center gap-1.5"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>Execute Checkout Saga (Success)</span>
                  </button>

                  <button
                    onClick={handleSimulateInventoryRollback}
                    className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow transition flex items-center gap-1.5"
                  >
                    <AlertOctagon className="w-3.5 h-3.5" />
                    <span>Trigger Out-of-Stock Rollback</span>
                  </button>

                  <button
                    onClick={handleSimulatePaymentBlock}
                    className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow transition flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Trigger Payment Decline Rollback</span>
                  </button>

                  <button
                    onClick={handleSimulateFedExScan}
                    className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow transition flex items-center gap-1.5"
                  >
                    <Truck className="w-3.5 h-3.5" />
                    <span>FedEx Hub Scan Event</span>
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400 px-1">
                <span>Real-Time Ingestion (Transactional Outbox Pattern)</span>
                <span className="font-mono text-emerald-400">Live Polling Active</span>
              </div>

              <div className="divide-y divide-slate-800 rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden font-mono text-xs max-h-72 overflow-y-auto">
                {simulatedEvents.map((evt) => (
                  <div key={evt.id} className="p-3 hover:bg-slate-900/60 transition flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className={`px-2 py-0.5 rounded font-bold shrink-0 text-[10px] ${
                        evt.type.includes('Exception') || evt.type.includes('Failed') || evt.type.includes('Declined') || evt.type.includes('OPEN')
                          ? 'bg-rose-500/20 text-rose-300'
                          : evt.type.includes('Cancelled') || evt.type.includes('Released') || evt.type.includes('Evicted')
                          ? 'bg-amber-500/20 text-amber-300'
                          : 'bg-indigo-500/20 text-indigo-300'
                      }`}>
                        {evt.type}
                      </span>
                      <span className="text-slate-300 truncate">{evt.data}</span>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-[10px] text-purple-400 bg-purple-500/10 px-1.5 py-0.5 rounded">
                        {evt.topic}
                      </span>
                      <span className="text-[10px] text-slate-500 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {evt.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 3: Chaos Engineering & Resilience4j */}
          {activeTab === 'chaos' && (
            <div className="space-y-4">
              {/* Circuit Breaker Status */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="w-5 h-5 text-amber-400" />
                    <h4 className="font-bold text-slate-200 text-sm">Resilience4j Circuit Breaker (Payment Microservice)</h4>
                  </div>
                  <span className={`px-3 py-1 rounded-full font-mono text-xs font-black ${
                    circuitBreakerState === 'CLOSED'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : circuitBreakerState === 'OPEN'
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                      : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                  }`}>
                    STATE: {circuitBreakerState}
                  </span>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">
                  Automatic failure threshold detection. When open, requests fail-fast to fallback mocks with zero cascading microservice timeouts.
                </p>

                <div className="flex flex-wrap gap-2 pt-2">
                  <button
                    onClick={handleTripCircuitBreaker}
                    className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow transition flex items-center gap-1.5"
                  >
                    <Flame className="w-3.5 h-3.5" />
                    <span>Trip Circuit to OPEN</span>
                  </button>
                  <button
                    onClick={handleHalfOpenCircuitBreaker}
                    className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow transition flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Set to HALF-OPEN (Canary)</span>
                  </button>
                  <button
                    onClick={handleResetCircuitBreaker}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow transition flex items-center gap-1.5"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Reset Circuit to CLOSED</span>
                  </button>
                </div>
              </div>

              {/* Redis Multi-Tier Cache Invalidation */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Database className="w-5 h-5 text-indigo-400" />
                    <h4 className="font-bold text-slate-200 text-sm">Redis Multi-Tier Cache Status</h4>
                  </div>
                  <span className="font-mono text-xs font-bold text-indigo-300 bg-indigo-500/20 px-2.5 py-1 rounded-full">
                    {cacheStatus}
                  </span>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">
                  Tests Cache-Aside pattern. Evicting Redis cache forces transparent re-hydration from isolated PostgreSQL database without service degradation.
                </p>

                <button
                  onClick={handleEvictCache}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow transition flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Evict & Re-hydrate Redis Cache</span>
                </button>
              </div>
            </div>
          )}

          {/* Tab 4: Sales Trends & Chart */}
          {activeTab === 'charts' && (
            <div className="space-y-6">
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800">
                <h4 className="text-sm font-bold text-slate-200 mb-4 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  <span>7-Day Revenue & Daily Order Velocity</span>
                </h4>

                <div className="h-48 flex items-end justify-between gap-2 pt-4 px-2">
                  {salesTrend.map((d, i) => {
                    const heightPct = Math.round((d.revenue / 35000) * 100);
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                        <div className="text-[10px] font-mono text-indigo-300 opacity-0 group-hover:opacity-100 transition-opacity">
                          {formatPrice(d.revenue)}
                        </div>
                        <div
                          className="w-full max-w-[40px] bg-gradient-to-t from-indigo-600 via-purple-600 to-pink-500 rounded-t-xl transition-all duration-500 group-hover:brightness-125"
                          style={{ height: `${heightPct}%` }}
                        />
                        <span className="text-[10px] font-medium text-slate-400">{d.date}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
