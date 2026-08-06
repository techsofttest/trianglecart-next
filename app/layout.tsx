import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import LayoutWrapper from "@/components/global/LayoutWrapper";
import { CustomerAuthProvider } from "@/context/CustomerAuthContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { CartProvider } from "@/context/CartContext";
import ScrollToTop from "@/components/ui/ScrollToTop";
import RegisterSW from "@/components/ui/RegisterSW";
import { CookieConsentProvider } from "@/components/CookieConsentProvider";
import { OG_TITLE, OG_DESCRIPTION, OG_IMAGE, SITE_URL } from "@/lib/config";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});



export const metadata: Metadata = {
  title: OG_TITLE,
  description: OG_DESCRIPTION,
  openGraph: {
    title: OG_TITLE,
    description: OG_DESCRIPTION,
    images: [{ url: OG_IMAGE }],
    url: SITE_URL,
    siteName: "Triangle Cart",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: OG_TITLE,
    description: OG_DESCRIPTION,
    images: [OG_IMAGE],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Triangle Cart",
  },
};

export const viewport = {
  themeColor: "#00723D",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.addEventListener('beforeinstallprompt', (e) => {
                e.preventDefault();
                window.deferredPrompt = e;
              });
            `,
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-white">
        <ScrollToTop />
        <RegisterSW />
        <CookieConsentProvider>
          <CartProvider>
            <CustomerAuthProvider>
              <WishlistProvider>
                <LayoutWrapper>{children}</LayoutWrapper>
              </WishlistProvider>
            </CustomerAuthProvider>
          </CartProvider>
        </CookieConsentProvider>
      </body>
    </html>
  );
}
