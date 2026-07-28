'use client';

import Link from 'next/link';
import { useCookieConsent } from '@/components/CookieConsentProvider';

export default function CookieBanner() {
  const { status, acceptCookies, rejectCookies } = useCookieConsent();

  if (status !== 'unknown') {
    return null;
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 px-4 pb-4 sm:px-6">
      <div className="mx-auto max-w-7xl rounded-3xl border border-slate-700 bg-slate-950/95 p-4 shadow-xl backdrop-blur-sm sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-100">
              We use cookies to improve your browsing experience. Essential cookies are always enabled. By clicking Accept, you agree to the use of analytics cookies.
            </p>
            <p className="mt-2 text-xs text-slate-400 sm:text-sm">
              Essential cookies support session management, cart functionality, login security, and customer account features. You can change your browser cookie settings anytime.
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={acceptCookies}
              className="inline-flex justify-center rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-300 disabled:cursor-not-allowed disabled:opacity-70"
            >
              Accept
            </button>
            <button
              type="button"
              onClick={rejectCookies}
              className="inline-flex justify-center rounded-full border border-slate-600 bg-slate-900 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:border-slate-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-slate-500"
            >
              Reject
            </button>
          </div>
        </div>

        <div className="mt-3 text-xs text-slate-400 sm:text-sm">
          <Link href="/cookie-policy" className="font-medium text-slate-200 hover:text-white underline">
            Read our Cookie Policy
          </Link>
        </div>
      </div>
    </div>
  );
}
