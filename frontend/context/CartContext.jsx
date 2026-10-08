'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../lib/api';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');
  const [toast, setToast] = useState(null);

  // Load cart from localStorage on initial render
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('shopsphere_cart');
      if (savedCart) {
        setItems(JSON.parse(savedCart));
      }
    } catch (e) {
      console.error('Failed to parse cart from storage:', e);
    }
  }, []);

  // Save cart to localStorage whenever items change
  useEffect(() => {
    try {
      localStorage.setItem('shopsphere_cart', JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save cart to storage:', e);
    }
  }, [items]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => setToast(null), 3500);
  };

  const addToCart = (product, quantity = 1) => {
    setItems((prevItems) => {
      const existingIndex = prevItems.findIndex((item) => item.product.id === product.id);
      if (existingIndex > -1) {
        const newItems = [...prevItems];
        newItems[existingIndex].quantity += quantity;
        return newItems;
      } else {
        return [...prevItems, { product, quantity }];
      }
    });
    showToast(`Added "${product.name}" to cart!`);
  };

  const updateQuantity = (productId, delta) => {
    setItems((prevItems) => {
      return prevItems
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean);
    });
  };

  const removeFromCart = (productId) => {
    setItems((prevItems) => {
      const itemToRemove = prevItems.find((i) => i.product.id === productId);
      if (itemToRemove) {
        showToast(`Removed "${itemToRemove.product.name}" from cart`, 'info');
      }
      return prevItems.filter((i) => i.product.id !== productId);
    });
  };

  const clearCart = () => {
    setItems([]);
    setAppliedCoupon(null);
    setCouponError('');
  };

  const applyCoupon = async (code) => {
    if (!code || !code.trim()) {
      setCouponError('Please enter a coupon code');
      return false;
    }
    setCouponError('');
    const subtotal = items.reduce((sum, item) => sum + (item.product.discountPrice || item.product.price) * item.quantity, 0);
    const result = await api.validateCoupon(code.trim().toUpperCase(), subtotal);
    if (result && result.valid) {
      setAppliedCoupon(result);
      showToast(`Coupon "${result.code}" applied: ${result.message}`);
      return true;
    } else {
      setCouponError(result?.message || 'Invalid or expired coupon code');
      return false;
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponError('');
    showToast('Coupon removed', 'info');
  };

  const subtotal = items.reduce(
    (sum, item) => sum + (item.product.discountPrice || item.product.price) * item.quantity,
    0
  );

  const discountAmount = appliedCoupon ? appliedCoupon.discountAmount || 0 : 0;
  const shippingThreshold = 150;
  const shippingFee = subtotal >= shippingThreshold || subtotal === 0 ? 0 : 15.0;
  const totalAmount = Math.max(0, subtotal - discountAmount + shippingFee);
  const totalItemsCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        totalItemsCount,
        subtotal,
        discountAmount,
        shippingFee,
        shippingThreshold,
        totalAmount,
        appliedCoupon,
        couponError,
        isCartOpen,
        isCheckoutOpen,
        toast,
        setIsCartOpen,
        setIsCheckoutOpen,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        applyCoupon,
        removeCoupon,
        showToast
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
