'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useCart } from './CartContext';

const CompareContext = createContext();

export function CompareProvider({ children }) {
  const [compareItems, setCompareItems] = useState([]);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const { showToast } = useCart();

  useEffect(() => {
    try {
      const saved = localStorage.getItem('shopsphere_compare');
      if (saved) setCompareItems(JSON.parse(saved));
    } catch (e) {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('shopsphere_compare', JSON.stringify(compareItems));
    } catch (e) {}
  }, [compareItems]);

  const toggleCompare = (product) => {
    setCompareItems((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) {
        showToast(`Removed "${product.name}" from comparison`, 'info');
        return prev.filter((p) => p.id !== product.id);
      } else {
        if (prev.length >= 4) {
          showToast('You can compare up to 4 items at once', 'info');
          return prev;
        }
        showToast(`Added "${product.name}" to comparison!`);
        return [...prev, product];
      }
    });
  };

  const removeFromCompare = (productId) => {
    setCompareItems((prev) => prev.filter((p) => p.id !== productId));
  };

  const clearCompare = () => {
    setCompareItems([]);
  };

  const isComparing = (productId) => {
    return compareItems.some((p) => p.id === productId);
  };

  return (
    <CompareContext.Provider
      value={{
        compareItems,
        compareCount: compareItems.length,
        isCompareOpen,
        setIsCompareOpen,
        toggleCompare,
        removeFromCompare,
        clearCompare,
        isComparing
      }}
    >
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  return useContext(CompareContext);
}
