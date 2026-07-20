'use client';

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { apiUrl } from '@/lib/api';

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
  isLoaded: boolean;
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
  const [isLoaded, setIsLoaded] = useState(false);

  const refresh = () => {
    setCustomer(readStoredCustomer());
  };

  const logout = React.useCallback(() => {
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
  }, []);

  useEffect(() => {
    refresh();
    setIsLoaded(true);

    const onCustomerUpdate = () => refresh();
    const onStorage = () => refresh();

    window.addEventListener('userUpdate', onCustomerUpdate);
    window.addEventListener('storage', onStorage);

    return () => {
      window.removeEventListener('userUpdate', onCustomerUpdate);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  // Proactive session validation on load / login
  useEffect(() => {
    if (!customer) return;

    fetch(apiUrl('/api/me'), {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      credentials: 'include',
    }).then((res) => {
      if (res.status === 401) {
        logout();
      }
    }).catch(() => {});
  }, [customer, logout]);

  // Global fetch interceptor for 401 responses
  useEffect(() => {
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const response = await originalFetch(...args);
      if (response.status === 401 && customer) {
        const urlStr = typeof args[0] === 'string' ? args[0] : (args[0] as any).url || '';
        if (urlStr.includes('/api/')) {
          logout();
        }
      }
      return response;
    };
    return () => {
      window.fetch = originalFetch;
    };
  }, [customer, logout]);

  const login = (nextCustomer: Record<string, any>) => {
    const payload = { ...nextCustomer, isLoggedIn: true };
    localStorage.setItem('user', JSON.stringify(payload));
    setCustomer(payload);
    window.dispatchEvent(new Event('userUpdate'));
  };

  const value = useMemo(
    () => ({
      customer,
      isAuthenticated: !!customer?.isLoggedIn,
      isLoaded,
      login,
      logout,
      refresh,
    }),
    [customer, isLoaded]
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
