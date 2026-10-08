'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useCart } from './CartContext';

const LoyaltyContext = createContext();

export const LOYALTY_TIERS = {
  BRONZE: { name: 'Bronze Explorer', minPoints: 0, multiplier: 1.0, color: 'from-amber-700 to-amber-900', badge: '🥉' },
  SILVER: { name: 'Silver Premier', minPoints: 500, multiplier: 1.25, color: 'from-slate-400 to-slate-600', badge: '🥈' },
  GOLD: { name: 'Gold Elite', minPoints: 1500, multiplier: 1.5, color: 'from-yellow-400 to-amber-600', badge: '🥇' },
  DIAMOND: { name: 'Diamond VIP', minPoints: 3000, multiplier: 2.0, color: 'from-cyan-400 to-blue-600', badge: '💎' }
};

export const REWARDS = [
  { id: 'rew-1', title: '$10 Store Credit', points: 200, code: 'REWARD10', discountAmount: 10, icon: 'Gift' },
  { id: 'rew-2', title: '$25 VIP Voucher', points: 450, code: 'REWARD25', discountAmount: 25, icon: 'Sparkles' },
  { id: 'rew-3', title: 'Free Express Air Shipping', points: 150, code: 'FREESHIPVIP', discountAmount: 15, icon: 'Truck' },
  { id: 'rew-4', title: '$50 Diamond Pass', points: 800, code: 'DIAMOND50', discountAmount: 50, icon: 'Crown' }
];

export function LoyaltyProvider({ children }) {
  const [points, setPoints] = useState(650); // initial demo points (Silver tier)
  const [isLoyaltyOpen, setIsLoyaltyOpen] = useState(false);
  const [redeemedRewards, setRedeemedRewards] = useState([]);
  const { showToast, applyCoupon } = useCart();

  useEffect(() => {
    try {
      const savedPoints = localStorage.getItem('shopsphere_loyalty_points');
      if (savedPoints) setPoints(Number(savedPoints));
    } catch (e) {}
  }, []);

  const savePoints = (newPoints) => {
    setPoints(newPoints);
    try {
      localStorage.setItem('shopsphere_loyalty_points', newPoints.toString());
    } catch (e) {}
  };

  const addPointsFromOrder = (orderAmount) => {
    const earned = Math.round(orderAmount * currentTier.multiplier);
    savePoints(points + earned);
    showToast(`Earned +${earned} Loyalty Points for this order! 🌟`);
  };

  const redeemReward = async (reward) => {
    if (points < reward.points) {
      showToast(`Need ${reward.points - points} more points to redeem ${reward.title}`, 'info');
      return false;
    }

    savePoints(points - reward.points);
    setRedeemedRewards((prev) => [...prev, reward]);
    showToast(`Redeemed ${reward.title}! Applied code ${reward.code}`);
    await applyCoupon(reward.code);
    return true;
  };

  // Determine Tier
  let currentTier = LOYALTY_TIERS.BRONZE;
  let nextTier = LOYALTY_TIERS.SILVER;
  let pointsToNext = 500 - points;

  if (points >= 3000) {
    currentTier = LOYALTY_TIERS.DIAMOND;
    nextTier = null;
    pointsToNext = 0;
  } else if (points >= 1500) {
    currentTier = LOYALTY_TIERS.GOLD;
    nextTier = LOYALTY_TIERS.DIAMOND;
    pointsToNext = 3000 - points;
  } else if (points >= 500) {
    currentTier = LOYALTY_TIERS.SILVER;
    nextTier = LOYALTY_TIERS.GOLD;
    pointsToNext = 1500 - points;
  }

  const tierProgressPct = nextTier
    ? Math.min(100, Math.round(((points - currentTier.minPoints) / (nextTier.minPoints - currentTier.minPoints)) * 100))
    : 100;

  return (
    <LoyaltyContext.Provider
      value={{
        points,
        currentTier,
        nextTier,
        pointsToNext,
        tierProgressPct,
        isLoyaltyOpen,
        setIsLoyaltyOpen,
        addPointsFromOrder,
        redeemReward,
        redeemedRewards
      }}
    >
      {children}
    </LoyaltyContext.Provider>
  );
}

export function useLoyalty() {
  return useContext(LoyaltyContext);
}
