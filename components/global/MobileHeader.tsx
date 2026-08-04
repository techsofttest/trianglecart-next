'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { apiUrl } from '@/lib/api';
import { MapPin, ChevronDown, Home, Briefcase, Package, Store, Download, Check } from 'lucide-react';
import LocationDrawer from './LocationDrawer';
import HeaderSearch from './HeaderSearch';
import { useCustomerAuth } from '@/context/CustomerAuthContext';
import { fetchStorefront } from '@/lib/storefront';
import { usePWAInstall } from '@/hooks/usePWAInstall';

type HeaderCategory = {
    id: number;
    name: string;
    slug: string;
    href: string;
    image_url: string | null;
    icon_url: string | null;
};

export default function MobileHeader() {
    const pathname = usePathname();
    const isHome = pathname === '/';
    const hideHeaderCategories = ['/login', '/checkout', '/checkout/status'].some((route) => pathname.startsWith(route));
    const [isScrolled, setIsScrolled] = useState(false);
    const [isLocationOpen, setIsLocationOpen] = useState(false);
    const { isAuthenticated } = useCustomerAuth();
    const { isInstalled, handleInstall } = usePWAInstall();
    const [selectedLocation, setSelectedLocation] = useState<{
        title: string;
        subtitle: string;
    } | null>(null);

    const [categories, setCategories] = useState<HeaderCategory[]>([]);

    useEffect(() => {
        const fetchCategories = async () => {
            const data = await fetchStorefront<{ categories: { main: HeaderCategory[]; all: HeaderCategory[] } }>('/api/storefront/header');
            if (data?.categories) {
                // Combine main categories first, then all categories
                const mainCategories = data.categories.main || [];
                const allCategories = data.categories.all || [];

                // Remove duplicates: keep main categories, then add any from all that aren't already included
                const mainIds = new Set(mainCategories.map(c => c.id));
                const additionalCategories = allCategories.filter(c => !mainIds.has(c.id));

                setCategories([...mainCategories, ...additionalCategories]);
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 40);
        };

        const checkLocation = () => {
            const storedLoc = localStorage.getItem('selectedLocation');
            if (storedLoc) setSelectedLocation(JSON.parse(storedLoc));
        };

        checkLocation();
        window.addEventListener('scroll', handleScroll);
        window.addEventListener('locationUpdate', checkLocation);
        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('locationUpdate', checkLocation);
        };
    }, []);

    const navItems: HeaderCategory[] = [
        {
            id: -1,
            name: 'All Products',
            slug: 'products',
            href: '/products',
            image_url: null,
            icon_url: null,
        },
        ...categories,
    ];

    return (
        <>
            <header className={`lg:hidden fixed top-0 left-0 w-full bg-white z-[60] transition-all duration-300 border-b border-gray-100 ${isScrolled ? 'shadow-md' : ''}`}>

                {/* Top Row: Logo & Location (Hidden on scroll) */}
                {!isScrolled && (
                    <div className="flex items-center bg-gray-700 justify-between px-4 py-3 animate-in fade-in slide-in-from-top-2 duration-300">
                        <Link href="/" className="flex-shrink-0">
                            <img
                                src={apiUrl('/images/logo/brand-logo-nobg.png?v2')}
                                alt="Logo"
                                className="h-8 md:h-8 w-auto object-contain"
                            />
                        </Link>

                        <div
                            className="hidden items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-full border border-gray-100 max-w-[180px]"
                            onClick={() => setIsLocationOpen(true)}
                        >
                            <div className="text-[#0c4a9e]">
                                {selectedLocation?.title?.toUpperCase() === 'HOME' ? (
                                    <Home className="w-3.5 h-3.5" />
                                ) : selectedLocation?.title?.toUpperCase() === 'WORK' ? (
                                    <Briefcase className="w-3.5 h-3.5" />
                                ) : (
                                    <MapPin className="w-3.5 h-3.5" />
                                )}
                            </div>
                            <span className="text-[12px] font-bold text-gray-700 truncate">
                                {selectedLocation ? selectedLocation.subtitle : 'Select Location'}
                            </span>
                            <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                        </div>
                        <button
                            onClick={handleInstall}
                            disabled={isInstalled}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${isInstalled
                                    ? 'bg-green-600 text-white cursor-default'
                                    : 'bg-brand-green text-white active:scale-95'
                                }`}
                        >
                            {isInstalled ? (
                                <><Check className="w-3.5 h-3.5" /> Installed</>
                            ) : (
                                <><Download className="w-3.5 h-3.5" /> Install</>
                            )}
                        </button>
                    </div>
                )}

                {/* Middle Row: Search Bar (Always visible, moves up on scroll) */}
                <div className={`px-4 ${isScrolled ? 'py-2' : 'pb-3'}`}>
                    <HeaderSearch />
                </div>

                {/* Bottom Row: Categories Carousel */}
                {!isHome && !pathname.startsWith('/product/') && !hideHeaderCategories && (
                    <div className={`border-t border-gray-50 overflow-x-auto scrollbar-hide bg-white transition-all duration-300 ${isScrolled ? 'py-1.5' : 'py-3'}`}>
                        <div className="flex items-center gap-2 px-4 min-w-max">
                            {navItems.map((cat) => (
                                <Link
                                    key={cat.id}
                                    href={cat.slug === 'products' ? '/products' : `/category/${cat.slug}`}
                                    className="flex items-center justify-center px-3 py-1.5 rounded-full border bg-gray-50/80 border-brand-blue text-brand-blue hover:text-brand-blue hover:border-brand-orange whitespace-nowrap"
                                >
                                    <span className="text-[11px] md:text-[12px] font-bold tracking-tight">
                                        {cat.name}
                                    </span>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </header>

            <LocationDrawer
                isOpen={isLocationOpen}
                onClose={() => setIsLocationOpen(false)}
                onSelectLocation={(loc) => {
                    setSelectedLocation(loc);
                    localStorage.setItem('selectedLocation', JSON.stringify(loc));
                    window.dispatchEvent(new Event('locationUpdate'));
                }}
            />

            {/* Spacer to prevent content overlap */}
            <div className={`lg:hidden ${(isHome || pathname.startsWith('/product/'))
                ? (isScrolled ? 'h-[60px]' : 'h-[160px]')
                : (isScrolled ? 'h-[100px]' : 'h-[160px]')}`} />
        </>
    );
}
