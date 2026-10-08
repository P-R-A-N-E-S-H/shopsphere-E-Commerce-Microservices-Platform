'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const CurrencyContext = createContext();

export const CURRENCIES = {
  USD: { code: 'USD', symbol: '$', rate: 1.0, name: 'US Dollar' },
  EUR: { code: 'EUR', symbol: '€', rate: 0.92, name: 'Euro' },
  GBP: { code: 'GBP', symbol: '£', rate: 0.78, name: 'British Pound' },
  INR: { code: 'INR', symbol: '₹', rate: 83.5, name: 'Indian Rupee' },
  JPY: { code: 'JPY', symbol: '¥', rate: 154.0, name: 'Japanese Yen' },
  CAD: { code: 'CAD', symbol: 'CA$', rate: 1.36, name: 'Canadian Dollar' },
  AUD: { code: 'AUD', symbol: 'A$', rate: 1.52, name: 'Australian Dollar' }
};

export function CurrencyProvider({ children }) {
  const [currency, setCurrency] = useState('USD');
  const [accentTheme, setAccentTheme] = useState('indigo'); // 'indigo' | 'emerald' | 'violet' | 'rose' | 'amber' | 'cyan'

  useEffect(() => {
    try {
      const savedCur = localStorage.getItem('shopsphere_currency');
      const savedTheme = localStorage.getItem('shopsphere_theme');
      if (savedCur && CURRENCIES[savedCur]) setCurrency(savedCur);
      if (savedTheme) setAccentTheme(savedTheme);
    } catch (e) {}
  }, []);

  const changeCurrency = (code) => {
    if (CURRENCIES[code]) {
      setCurrency(code);
      try {
        localStorage.setItem('shopsphere_currency', code);
      } catch (e) {}
    }
  };

  const changeTheme = (theme) => {
    setAccentTheme(theme);
    try {
      localStorage.setItem('shopsphere_theme', theme);
    } catch (e) {}
  };

  const formatPrice = (usdAmount) => {
    if (usdAmount === undefined || usdAmount === null) return '$0.00';
    const cur = CURRENCIES[currency] || CURRENCIES.USD;
    const converted = usdAmount * cur.rate;
    if (cur.code === 'JPY') {
      return `${cur.symbol}${Math.round(converted).toLocaleString()}`;
    }
    return `${cur.symbol}${converted.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        currentCurrency: CURRENCIES[currency] || CURRENCIES.USD,
        accentTheme,
        changeCurrency,
        changeTheme,
        formatPrice
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  return useContext(CurrencyContext);
}
