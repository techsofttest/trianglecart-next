import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import LayoutWrapper from "@/components/global/LayoutWrapper";
import { CustomerAuthProvider } from "@/context/CustomerAuthContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { CartProvider } from "@/context/CartContext";
import ScrollToTop from "@/components/ui/ScrollToTop";
import RegisterSW from "@/components/ui/RegisterSW";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Triangle Cart | Indian Groceries in Australia",
  description: "Shop premium Indian and South Asian groceries, fresh produce, and spices. Delivering across Australia.",
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
      <body className="min-h-screen flex flex-col bg-white">
        <ScrollToTop />
        <RegisterSW />
        <CartProvider>
          <CustomerAuthProvider>
            <WishlistProvider>
              <LayoutWrapper>{children}</LayoutWrapper>
            </WishlistProvider>
          </CustomerAuthProvider>
        </CartProvider>
      </body>
    </html>
  );
}
