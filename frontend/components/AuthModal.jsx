'use client';

import React, { useState } from 'react';
import { X, Lock, Mail, User, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, authMode, setAuthMode, login, register } = useAuth();
  const { showToast } = useCart();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (authMode === 'login') {
      const res = await login(email, password);
      if (res.success) {
        showToast(`Welcome back, ${res.user.firstName || 'User'}!`);
      } else {
        setError(res.message || 'Invalid credentials');
      }
    } else {
      const res = await register({ email, password, firstName, lastName });
      if (res.success) {
        showToast(`Welcome to ShopSphere, ${firstName}! Account created.`);
      } else {
        setError(res.message || 'Registration failed');
      }
    }
    setIsLoading(false);
  };

  const handleDemoFill = (type) => {
    if (type === 'customer') {
      setEmail('pranesh@shopsphere.io');
      setPassword('password123');
      setFirstName('Pranesh');
      setLastName('M');
    } else {
      setEmail('admin@shopsphere.io');
      setPassword('adminpass123');
      setFirstName('Admin');
      setLastName('Superuser');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto backdrop-blur-md bg-slate-950/80 animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white">
              <Lock className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-slate-100 text-lg">
              {authMode === 'login' ? 'Sign in to ShopSphere' : 'Create an Account'}
            </h3>
          </div>
          <button
            onClick={closeAuthModal}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Demo Fast Login Bar */}
        <div className="bg-slate-950/80 px-6 py-3 border-b border-slate-800/80 flex items-center justify-between text-xs">
          <span className="text-slate-400 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Quick Demo Autofill:
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => handleDemoFill('customer')}
              className="px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 font-semibold hover:bg-indigo-500/30 transition text-[11px]"
            >
              Customer
            </button>
            <button
              type="button"
              onClick={() => handleDemoFill('admin')}
              className="px-2.5 py-1 rounded-lg bg-purple-500/20 text-purple-300 font-semibold hover:bg-purple-500/30 transition text-[11px]"
            >
              Admin
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-400">
              {error}
            </div>
          )}

          {authMode === 'register' && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">First Name</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Pranesh"
                    className="w-full bg-slate-950 border border-slate-750 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                  <User className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Last Name</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="M"
                    className="w-full bg-slate-950 border border-slate-750 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                  <User className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Email Address</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-slate-950 border border-slate-750 rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
              />
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Password</label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950 border border-slate-750 rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
              />
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs sm:text-sm shadow-xl shadow-indigo-600/30 transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <span>{authMode === 'login' ? 'Sign In' : 'Create Account'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="text-center pt-2 text-xs text-slate-400">
            {authMode === 'login' ? (
              <span>
                Don&apos;t have an account?{' '}
                <button
                  type="button"
                  onClick={() => setAuthMode('register')}
                  className="text-indigo-400 font-bold hover:underline"
                >
                  Sign Up
                </button>
              </span>
            ) : (
              <span>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setAuthMode('login')}
                  className="text-indigo-400 font-bold hover:underline"
                >
                  Sign In
                </button>
              </span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
