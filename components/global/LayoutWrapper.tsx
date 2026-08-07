'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Header from "@/components/global/Header";
import MobileHeader from "@/components/global/MobileHeader";
import MobileBottomNav from "@/components/global/MobileBottomNav";
import Footer from "@/components/global/Footer";
import FeaturesBanner from "@/components/global/FeaturesBanner";
import CartDrawer from '../cart/CartDrawer';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAuthPage = pathname === '/signup';
    const isHome = pathname === '/';

    useEffect(() => {
        const handleContextMenu = (event: MouseEvent) => {
            event.preventDefault();
        };

        window.addEventListener('contextmenu', handleContextMenu);

        return () => {
            window.removeEventListener('contextmenu', handleContextMenu);
        };
    }, []);

    if (isAuthPage) {
        return <>{children}</>;
    }

    return (
        <>
            <Header />
            <MobileHeader />
            <main className={`flex-1 w-full mx-auto ${isHome ? 'pt-0 pb-4' : 'px-4 sm:px-6 lg:px-8 pt-4 lg:pt-8 pb-4'}`}>
                {children}
            </main>
            <Footer />
            <MobileBottomNav />
            <CartDrawer />
        </>
    );
}
