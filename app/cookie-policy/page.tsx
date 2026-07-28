import Link from 'next/link';
import React from 'react';

const sections = [
  { id: 'what-are-cookies', title: 'What Are Cookies?' },
  { id: 'essential-cookies', title: 'Essential Cookies' },
  { id: 'analytics-cookies', title: 'Analytics Cookies' },
  { id: 'manage-settings', title: 'Manage Browser Cookie Settings' },
];

export default function CookiePolicyPage() {
  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <aside className="hidden lg:block lg:col-span-3">
            <div className="sticky top-24 space-y-4">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-[0.2em] mb-6">Contents</h3>
              <nav className="flex flex-col space-y-3 text-sm">
                {sections.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="font-medium text-gray-600 hover:text-slate-900 transition-colors border-l-2 border-transparent pl-4 py-1 hover:border-slate-300"
                  >
                    {section.title}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          <main className="lg:col-span-9 max-w-3xl">
            <header className="mb-20 border-b border-gray-100 pb-12">
              <div className="inline-flex items-center rounded-full border border-gray-100 bg-gray-50 px-3 py-1 text-sm font-bold uppercase tracking-widest text-gray-600 mb-6">
                Privacy & Cookies
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight">Cookie Policy</h1>
              <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 font-medium">
                <span>Version 1.0</span>
                <span className="w-1 h-1 rounded-full bg-gray-300" />
                <span>Updated July 2026</span>
              </div>
            </header>

            <div className="space-y-20 pb-20">
              <section id="what-are-cookies" className="scroll-mt-24 group">
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-[0.2em] mb-6">What Are Cookies?</h2>
                <div className="prose prose-slate">
                  <p>
                    Cookies are small text files stored in your browser that help websites remember information about your visit. They support essential features like keeping you signed in, storing items in your cart, and making your browsing faster and more reliable.
                  </p>
                </div>
              </section>

              <section id="essential-cookies" className="scroll-mt-24 group">
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-[0.2em] mb-6">Essential Cookies</h2>
                <div className="prose prose-slate space-y-4">
                  <p>
                    Essential cookies are required for the website to function. They are always enabled and are not optional. This includes cookies used for:
                  </p>
                  <ul>
                    <li>Session management</li>
                    <li>Authentication and OTP login</li>
                    <li>Shopping cart and checkout</li>
                    <li>CSRF protection</li>
                    <li>Customer account access</li>
                    <li>Storing your cookie consent choice</li>
                  </ul>
                </div>
              </section>

              <section id="analytics-cookies" className="scroll-mt-24 group">
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-[0.2em] mb-6">Analytics Cookies</h2>
                <div className="prose prose-slate space-y-4">
                  <p>
                    Analytics cookies help us understand how visitors use the site so we can improve performance and product experience. These cookies are non-essential and are only enabled after you accept cookie consent.
                  </p>
                  <p>
                    If you reject analytics cookies, we will not load tracking scripts such as Google Analytics, Google Tag Manager, or other marketing tools on this website.
                  </p>
                </div>
              </section>

              <section id="manage-settings" className="scroll-mt-24 group">
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-[0.2em] mb-6">Manage Browser Cookie Settings</h2>
                <div className="prose prose-slate space-y-4">
                  <p>
                    You can change your cookie settings directly in your browser at any time. Most browsers allow you to review or delete cookies in the privacy or security settings panel.
                  </p>
                  <p>
                    To update your choice for this website, clear the <code>cookie_consent</code> cookie in your browser or use your browser&apos;s cookie settings. After clearing this preference, the cookie banner will display again.
                  </p>
                  <p>
                    For more details on browser controls, check the support pages for your browser (Chrome, Safari, Edge, Firefox, or mobile browser settings).
                  </p>
                </div>
              </section>

              <footer className="pt-20 border-t border-gray-100">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm text-gray-500 font-medium">
                    Questions about cookies? Reach out to <a href="mailto:support@trianglecart.com.au" className="text-slate-900 underline">support@trianglecart.com.au</a>.
                  </p>
                  <Link href="/cookie-policy" className="inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-50">
                    View full policy
                  </Link>
                </div>
              </footer>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
