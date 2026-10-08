'use client';

import React, { useState } from 'react';
import { X, CheckCircle2, ShieldCheck, CreditCard, Truck, ArrowRight, PackageCheck, Lock, Sparkles, MapPin } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';
import { api } from '../lib/api';

export default function CheckoutModal({ onOrderPlaced }) {
  const { isCheckoutOpen, setIsCheckoutOpen, items, totalAmount, subtotal, discountAmount, shippingFee, clearCart } = useCart();
  const { user } = useAuth();
  const { formatPrice } = useCurrency();

  const [step, setStep] = useState(1); // 1: Shipping, 2: Payment, 3: Confirmation
  const [formData, setFormData] = useState({
    firstName: user?.firstName || 'Pranesh',
    lastName: user?.lastName || 'M',
    email: user?.email || 'pranesh@example.com',
    street: '742 Evergreen Terrace',
    city: 'San Francisco',
    state: 'CA',
    zipCode: '94105',
    country: 'United States',
    paymentMethod: 'CREDIT_CARD',
    cardNumber: '4242 •••• •••• 4242',
    cardExpiry: '12/28',
    cardCvc: '888'
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [createdOrder, setCreatedOrder] = useState(null);

  if (!isCheckoutOpen) return null;

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    const orderPayload = {
      userId: user?.id || 'usr-100',
      items: items.map((item) => ({
        productId: item.product.id,
        productName: item.product.name,
        quantity: item.quantity,
        price: item.product.discountPrice || item.product.price
      })),
      totalAmount,
      shippingAddress: {
        street: formData.street,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        country: formData.country
      },
      paymentMethod: formData.paymentMethod
    };

    const order = await api.createOrder(orderPayload);
    setCreatedOrder(order);
    clearCart();
    setIsProcessing(false);
    setStep(3);
  };

  const handleClose = () => {
    setIsCheckoutOpen(false);
    setStep(1);
    setCreatedOrder(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto backdrop-blur-md bg-slate-950/80 animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-400" />
            <h3 className="font-bold text-slate-100 text-base sm:text-lg">
              {step === 3 ? 'Order Confirmed!' : 'Secure 256-Bit Checkout'}
            </h3>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step indicator */}
        {step < 3 && (
          <div className="px-6 py-3 bg-slate-950/60 border-b border-slate-800 flex items-center justify-between text-xs font-semibold">
            <div className={`flex items-center gap-2 ${step >= 1 ? 'text-indigo-400' : 'text-slate-500'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 1 ? 'bg-indigo-600 text-white' : 'bg-slate-800'}`}>1</span>
              <span>Shipping Address</span>
            </div>
            <div className="w-12 h-0.5 bg-slate-800" />
            <div className={`flex items-center gap-2 ${step >= 2 ? 'text-indigo-400' : 'text-slate-500'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 2 ? 'bg-indigo-600 text-white' : 'bg-slate-800'}`}>2</span>
              <span>Payment & Saga</span>
            </div>
            <div className="w-12 h-0.5 bg-slate-800" />
            <div className="flex items-center gap-2 text-slate-500">
              <span className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-[10px]">3</span>
              <span>Confirmation</span>
            </div>
          </div>
        )}

        {/* Step 1: Shipping */}
        {step === 1 && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setStep(2);
            }}
            className="p-6 space-y-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  required
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  required
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Email Address</label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Street Address</label>
              <input
                type="text"
                name="street"
                required
                value={formData.street}
                onChange={handleInputChange}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">City</label>
                <input
                  type="text"
                  name="city"
                  required
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">State</label>
                <input
                  type="text"
                  name="state"
                  required
                  value={formData.state}
                  onChange={handleInputChange}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Zip Code</label>
                <input
                  type="text"
                  name="zipCode"
                  required
                  value={formData.zipCode}
                  onChange={handleInputChange}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 flex items-center gap-2"
              >
                <span>Continue to Payment</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* Step 2: Payment */}
        {step === 2 && (
          <form onSubmit={handleSubmitOrder} className="p-6 space-y-5">
            {/* Payment Method Selector */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'CREDIT_CARD', label: 'Credit Card', icon: CreditCard },
                { id: 'APPLE_PAY', label: 'Apple Pay', icon: ShieldCheck },
                { id: 'CRYPTO', label: 'Crypto (USDC)', icon: Sparkles }
              ].map((m) => (
                <button
                  type="button"
                  key={m.id}
                  onClick={() => setFormData({ ...formData, paymentMethod: m.id })}
                  className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between h-20 ${
                    formData.paymentMethod === m.id
                      ? 'border-indigo-500 bg-indigo-500/10 text-slate-100'
                      : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <m.icon className={`w-5 h-5 ${formData.paymentMethod === m.id ? 'text-indigo-400' : 'text-slate-500'}`} />
                  <span className="text-xs font-bold">{m.label}</span>
                </button>
              ))}
            </div>

            {formData.paymentMethod === 'CREDIT_CARD' && (
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Card Number</label>
                  <input
                    type="text"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-slate-200 font-mono focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Expiration</label>
                    <input
                      type="text"
                      name="cardExpiry"
                      value={formData.cardExpiry}
                      onChange={handleInputChange}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-slate-200 font-mono focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">CVC / CVV</label>
                    <input
                      type="text"
                      name="cardCvc"
                      value={formData.cardCvc}
                      onChange={handleInputChange}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-slate-200 font-mono focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Microservice Saga Notice */}
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-400 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-slate-200">Distributed Saga Orchestration</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Your order coordinates with Inventory Service, Payment Service, and Shipping Service via Apache Kafka events.
                </p>
              </div>
            </div>

            {/* Cost Recap */}
            <div className="p-4 rounded-2xl bg-indigo-950/20 border border-indigo-500/20 flex justify-between items-center">
              <div>
                <span className="text-xs text-slate-400">Total Charge</span>
                <p className="text-2xl font-black text-slate-100">{formatPrice(totalAmount)}</p>
              </div>
              <div className="text-right text-xs text-slate-400">
                <span>Shipping: {shippingFee === 0 ? 'FREE' : formatPrice(shippingFee)}</span>
                {discountAmount > 0 && <p className="text-emerald-400 font-bold">Discount: -{formatPrice(discountAmount)}</p>}
              </div>
            </div>

            <div className="flex justify-between items-center pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-xs text-slate-400 hover:text-slate-200"
              >
                ← Back to Shipping
              </button>
              <button
                type="submit"
                disabled={isProcessing}
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-emerald-600/30 flex items-center gap-2 disabled:opacity-50"
              >
                {isProcessing ? (
                  <span>Executing Saga...</span>
                ) : (
                  <>
                    <PackageCheck className="w-4 h-4" />
                    <span>Pay {formatPrice(totalAmount)} & Place Order</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* Step 3: Confirmation */}
        {step === 3 && createdOrder && (
          <div className="p-8 text-center space-y-6">
            <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mx-auto shadow-lg shadow-emerald-500/20">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <h4 className="text-2xl font-black text-slate-100">Payment & Order Confirmed!</h4>
              <p className="text-xs text-slate-400 mt-1">
                Your checkout saga completed with 0 errors across 4 microservices.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 max-w-md mx-auto text-left space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Order Reference:</span>
                <span className="font-mono font-bold text-indigo-300">{createdOrder.orderNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Tracking Code:</span>
                <span className="font-mono font-bold text-emerald-400">{createdOrder.trackingNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Carrier:</span>
                <span className="font-semibold text-slate-200">{createdOrder.carrier}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-850">
                <span className="text-slate-400">Total Paid:</span>
                <span className="font-black text-slate-100">{formatPrice(createdOrder.totalAmount)}</span>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-3 pt-2">
              <button
                onClick={() => {
                  handleClose();
                  if (onOrderPlaced) onOrderPlaced(createdOrder);
                }}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 flex items-center gap-2"
              >
                <Truck className="w-4 h-4" />
                <span>Track Live Order Stepper</span>
              </button>
              <button
                onClick={handleClose}
                className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
