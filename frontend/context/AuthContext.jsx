'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../lib/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  useEffect(() => {
    // Check saved session on mount
    const savedToken = localStorage.getItem('shopsphere_token');
    const savedUser = localStorage.getItem('shopsphere_user');
    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('shopsphere_token');
        localStorage.removeItem('shopsphere_user');
      }
    }
  }, []);

  const login = async (email, password) => {
    const data = await api.login(email, password);
    if (data && data.user) {
      setUser(data.user);
      setToken(data.accessToken);
      localStorage.setItem('shopsphere_token', data.accessToken);
      localStorage.setItem('shopsphere_user', JSON.stringify(data.user));
      setIsAuthModalOpen(false);
      return { success: true, user: data.user };
    }
    return { success: false, message: 'Authentication failed' };
  };

  const register = async (payload) => {
    const data = await api.register(payload);
    if (data && data.user) {
      setUser(data.user);
      setToken(data.accessToken);
      localStorage.setItem('shopsphere_token', data.accessToken);
      localStorage.setItem('shopsphere_user', JSON.stringify(data.user));
      setIsAuthModalOpen(false);
      return { success: true, user: data.user };
    }
    return { success: false, message: 'Registration failed' };
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('shopsphere_token');
    localStorage.removeItem('shopsphere_user');
  };

  const openAuthModal = (mode = 'login') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'ADMIN',
        isAuthModalOpen,
        authMode,
        isAdminOpen,
        setIsAdminOpen,
        login,
        register,
        logout,
        openAuthModal,
        closeAuthModal,
        setAuthMode
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
