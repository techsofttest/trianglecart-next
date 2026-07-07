'use client';

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

export type CustomerProfile = {
  id?: number | null;
  name?: string;
  email?: string;
  phone?: string;
  profile_image?: string | null;
  isLoggedIn?: boolean;
  [key: string]: any;
} | null;

type CustomerAuthContextType = {
  customer: CustomerProfile;
  isAuthenticated: boolean;
  login: (customer: Record<string, any>) => void;
  logout: () => void;
  refresh: () => void;
};

const CustomerAuthContext = createContext<CustomerAuthContextType | undefined>(undefined);

function readStoredCustomer(): CustomerProfile {
  if (typeof window === 'undefined') return null;

  const stored = localStorage.getItem('user');
  if (!stored) return null;

  try {
    const parsed = JSON.parse(stored);
    return parsed?.isLoggedIn ? parsed : null;
  } catch {
    return null;
  }
}

export function CustomerAuthProvider({ children }: { children: React.ReactNode }) {
  const [customer, setCustomer] = useState<CustomerProfile>(null);

  const refresh = () => {
    setCustomer(readStoredCustomer());
  };

  useEffect(() => {
    refresh();

    const onCustomerUpdate = () => refresh();
    const onStorage = () => refresh();

    window.addEventListener('userUpdate', onCustomerUpdate);
    window.addEventListener('storage', onStorage);

    return () => {
      window.removeEventListener('userUpdate', onCustomerUpdate);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  const login = (nextCustomer: Record<string, any>) => {
    const payload = { ...nextCustomer, isLoggedIn: true };
    localStorage.setItem('user', JSON.stringify(payload));
    setCustomer(payload);
    window.dispatchEvent(new Event('userUpdate'));
  };

  const logout = () => {
    [
      'user',
      'triangle-saved-addresses',
      'triangle-default-shipping-address',
      'checkoutLocation',
      'selectedLocation',
    ].forEach((key) => localStorage.removeItem(key));

    setCustomer(null);
    window.dispatchEvent(new Event('userUpdate'));
    window.dispatchEvent(new Event('addressUpdate'));
    window.dispatchEvent(new Event('locationUpdate'));
  };

  const value = useMemo(
    () => ({
      customer,
      isAuthenticated: !!customer?.isLoggedIn,
      login,
      logout,
      refresh,
    }),
    [customer]
  );

  return <CustomerAuthContext.Provider value={value}>{children}</CustomerAuthContext.Provider>;
}

export function useCustomerAuth() {
  const context = useContext(CustomerAuthContext);
  if (!context) {
    throw new Error('useCustomerAuth must be used within a CustomerAuthProvider');
  }
  return context;
}
