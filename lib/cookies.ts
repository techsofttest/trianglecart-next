export type CookieConsentStatus = 'accepted' | 'rejected' | 'unknown';

const COOKIE_CONSENT_NAME = 'cookie_consent';
const COOKIE_CONSENT_MAX_AGE_SECONDS = 365 * 24 * 60 * 60;

function getCookieValue(name: string): string | null {
  if (typeof document === 'undefined') {
    return null;
  }

  const cookiePairs = document.cookie.split(';').map((cookie) => cookie.trim());
  const match = cookiePairs.find((cookie) => cookie.startsWith(`${name}=`));

  if (!match) {
    return null;
  }

  return decodeURIComponent(match.substring(name.length + 1));
}

function setCookieValue(name: string, value: string, maxAgeSeconds = COOKIE_CONSENT_MAX_AGE_SECONDS) {
  if (typeof document === 'undefined') {
    return;
  }

  const secureFlag = typeof window !== 'undefined' && window.location.protocol === 'https:';
  const expires = new Date(Date.now() + maxAgeSeconds * 1000).toUTCString();
  const cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; max-age=${maxAgeSeconds}; path=/; sameSite=Lax; ${secureFlag ? 'secure; ' : ''}`;

  document.cookie = cookie;
}

export function getCookieConsent(): CookieConsentStatus {
  const value = getCookieValue(COOKIE_CONSENT_NAME);

  if (value === 'accepted' || value === 'rejected') {
    return value;
  }

  return 'unknown';
}

export function setCookieConsent(value: 'accepted' | 'rejected') {
  setCookieValue(COOKIE_CONSENT_NAME, value, COOKIE_CONSENT_MAX_AGE_SECONDS);
}

export function hasCookieConsent() {
  return getCookieConsent();
}

export function canLoadAnalytics(): boolean {
  return getCookieConsent() === 'accepted';
}
