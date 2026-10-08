'use client';

import React, { useState } from 'react';
import { X, User, MapPin, Plus, Trash2, CheckCircle2, ShieldCheck, Mail, Phone, Home, Building } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function ProfileModal({ isOpen, onClose }) {
  const { user } = useAuth();
  const { showToast } = useCart();

  const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'addresses'

  const [addresses, setAddresses] = useState([
    {
      id: 1,
      label: 'Home (Default)',
      street: '742 Evergreen Terrace',
      city: 'San Francisco',
      state: 'CA',
      zip: '94105',
      country: 'United States',
      isDefault: true
    },
    {
      id: 2,
      label: 'Tech Campus Office',
      street: '100 Silicon Valley Blvd, Suite 400',
      city: 'Palo Alto',
      state: 'CA',
      zip: '94301',
      country: 'United States',
      isDefault: false
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newAddr, setNewAddr] = useState({ label: '', street: '', city: '', state: '', zip: '', country: 'United States' });

  if (!isOpen) return null;

  const handleAddAddress = (e) => {
    e.preventDefault();
    if (!newAddr.street || !newAddr.city) return;
    const item = {
      id: Date.now(),
      label: newAddr.label || 'Other Address',
      street: newAddr.street,
      city: newAddr.city,
      state: newAddr.state,
      zip: newAddr.zip,
      country: newAddr.country,
      isDefault: false
    };
    setAddresses([...addresses, item]);
    setShowAddForm(false);
    setNewAddr({ label: '', street: '', city: '', state: '', zip: '', country: 'United States' });
    showToast('New shipping address saved!');
  };

  const handleDeleteAddress = (id) => {
    setAddresses(addresses.filter((a) => a.id !== id));
    showToast('Address removed', 'info');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto backdrop-blur-md bg-slate-950/85 animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden my-6 max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
              {user?.firstName ? user.firstName.charAt(0) : 'U'}
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-base sm:text-lg">Account & Address Settings</h3>
              <p className="text-xs text-slate-400">Manage profile and microservice shipping defaults</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="px-6 border-b border-slate-800 flex gap-4 text-xs font-semibold bg-slate-950/30">
          <button
            onClick={() => setActiveTab('profile')}
            className={`py-3 border-b-2 flex items-center gap-2 transition ${
              activeTab === 'profile' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Profile Details</span>
          </button>
          <button
            onClick={() => setActiveTab('addresses')}
            className={`py-3 border-b-2 flex items-center gap-2 transition ${
              activeTab === 'addresses' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Address Book ({addresses.length})</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {activeTab === 'profile' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">First Name</label>
                  <input
                    type="text"
                    readOnly
                    value={user?.firstName || 'Pranesh'}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Last Name</label>
                  <input
                    type="text"
                    readOnly
                    value={user?.lastName || 'M'}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Email Address</label>
                <div className="relative">
                  <input
                    type="email"
                    readOnly
                    value={user?.email || 'pranesh@shopsphere.io'}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3.5 py-2 text-xs sm:text-sm text-slate-200"
                  />
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Account Role & Permissions</label>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-mono">ROLE_{user?.role || 'CUSTOMER'}</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold text-[10px]">
                    ACTIVE SESSION
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-indigo-950/20 border border-indigo-500/20 text-xs text-indigo-300 flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-indigo-400 shrink-0" />
                <span>Synchronized with User Microservice (:8082) via JWT Claims.</span>
              </div>
            </div>
          )}

          {activeTab === 'addresses' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Saved Delivery Locations</h4>
                <button
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New</span>
                </button>
              </div>

              {showAddForm && (
                <form onSubmit={handleAddAddress} className="p-4 rounded-2xl bg-slate-950 border border-indigo-500/40 space-y-3">
                  <h5 className="text-xs font-bold text-slate-200">New Address</h5>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Label (e.g. Vacation Villa)"
                      value={newAddr.label}
                      onChange={(e) => setNewAddr({ ...newAddr, label: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-750 text-slate-200 text-xs rounded-xl px-3 py-2"
                    />
                    <input
                      type="text"
                      placeholder="Street Address"
                      required
                      value={newAddr.street}
                      onChange={(e) => setNewAddr({ ...newAddr, street: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-750 text-slate-200 text-xs rounded-xl px-3 py-2"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <input
                      type="text"
                      placeholder="City"
                      required
                      value={newAddr.city}
                      onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
                      className="bg-slate-900 border border-slate-750 text-slate-200 text-xs rounded-xl px-3 py-2"
                    />
                    <input
                      type="text"
                      placeholder="State"
                      value={newAddr.state}
                      onChange={(e) => setNewAddr({ ...newAddr, state: e.target.value })}
                      className="bg-slate-900 border border-slate-750 text-slate-200 text-xs rounded-xl px-3 py-2"
                    />
                    <input
                      type="text"
                      placeholder="Zip Code"
                      value={newAddr.zip}
                      onChange={(e) => setNewAddr({ ...newAddr, zip: e.target.value })}
                      className="bg-slate-900 border border-slate-750 text-slate-200 text-xs rounded-xl px-3 py-2"
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-slate-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold"
                    >
                      Save Address
                    </button>
                  </div>
                </form>
              )}

              <div className="space-y-3">
                {addresses.map((addr) => (
                  <div
                    key={addr.id}
                    className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-start justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-200 text-xs">{addr.label}</span>
                        {addr.isDefault && (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono text-[10px] font-bold">
                            DEFAULT
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400">{addr.street}</p>
                      <p className="text-xs text-slate-400">{addr.city}, {addr.state} {addr.zip}, {addr.country}</p>
                    </div>

                    {!addr.isDefault && (
                      <button
                        onClick={() => handleDeleteAddress(addr.id)}
                        className="p-1.5 text-slate-500 hover:text-rose-400 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
