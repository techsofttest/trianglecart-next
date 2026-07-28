'use client';

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import CookieBanner from '@/components/CookieBanner';
import { getCookieConsent, setCookieConsent, CookieConsentStatus } from '@/lib/cookies';

interface CookieConsentContextValue {
  status: CookieConsentStatus;
  acceptCookies: () => void;
  rejectCookies: () => void;
}

const CookieConsentContext = createContext<CookieConsentContextValue | undefined>(undefined);

export function CookieConsentProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<CookieConsentStatus>('unknown');

  useEffect(() => {
    setStatus(getCookieConsent());
  }, []);

  const acceptCookies = () => {
    setCookieConsent('accepted');
    setStatus('accepted');
  };

  const rejectCookies = () => {
    setCookieConsent('rejected');
    setStatus('rejected');
  };

  const value = useMemo(
    () => ({
      status,
      acceptCookies,
      rejectCookies,
    }),
    [status]
  );

  return (
    <CookieConsentContext.Provider value={value}>
      {children}
      <CookieBanner />
    </CookieConsentContext.Provider>
  );
}

export function useCookieConsent() {
  const context = useContext(CookieConsentContext);

  if (!context) {
    throw new Error('useCookieConsent must be used within CookieConsentProvider');
  }

  return context;
}

export function CookieConsentGuard({ children }: { children: React.ReactNode }) {
  const { status } = useCookieConsent();

  if (status !== 'accepted') {
    return null;
  }

  return <>{children}</>;
}
