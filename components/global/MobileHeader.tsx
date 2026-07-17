'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { apiUrl } from '@/lib/api';
import { MapPin, ChevronDown, Home, Briefcase, Package, Store } from 'lucide-react';
import LocationDrawer from './LocationDrawer';
import HeaderSearch from './HeaderSearch';
import { useCustomerAuth } from '@/context/CustomerAuthContext';
import { fetchStorefront } from '@/lib/storefront';

type HeaderCategory = {
    id: number;
    name: string;
    slug: string;
    href: string;
    image_url: string | null;
    icon_url: string | null;
};

export default function MobileHeader() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isLocationOpen, setIsLocationOpen] = useState(false);
    const { isAuthenticated } = useCustomerAuth();
    const [selectedLocation, setSelectedLocation] = useState<{ 
        title: string; 
        subtitle: string; 
    } | null>(null);

    const [categories, setCategories] = useState<HeaderCategory[]>([]);
    const [brandLogo, setBrandLogo] = useState<string>(apiUrl('/images/logo/brand-logo-nobg.png?v1'));

    useEffect(() => {
        const fetchCategories = async () => {
            const data = await fetchStorefront<{ brand: { logo: string }; categories: HeaderCategory[] }>('/api/storefront/header');
            if (data?.categories) {
                setCategories(data.categories);
            }
            if (data?.brand?.logo) {
                setBrandLogo(data.brand.logo);
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
                    <div className="flex items-center justify-between px-4 py-3 animate-in fade-in slide-in-from-top-2 duration-300">
                        <Link href="/" className="flex-shrink-0">
                            <img
                                src={brandLogo}
                                alt="Logo"
                                className="h-8 w-auto object-contain"
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
                        {!isAuthenticated && (
                            <Link href="/login" className="text-sm font-semibold text-[#0c4a9e]">
                                Login
                            </Link>
                        )}
                    </div>
                )}

                {/* Middle Row: Search Bar (Always visible, moves up on scroll) */}
                <div className={`px-4 ${isScrolled ? 'py-2' : 'pb-3'}`}>
                    <HeaderSearch />
                </div>

                {/* Bottom Row: Categories Carousel */}
                <div className={`border-t border-gray-50 overflow-x-auto scrollbar-hide bg-white transition-all duration-300 ${isScrolled ? 'py-1.5' : 'py-3'}`}>
                    <div className="flex items-center gap-6 px-4 min-w-max">
                        {navItems.map((cat) => (
                            <Link 
                                key={cat.id} 
                                href={cat.slug === 'products' ? '/products' : `/category/${cat.slug}`}
                                className={`flex items-center transition-all ${isScrolled ? 'gap-2 px-3 py-1.5 rounded-full border border-gray-100 bg-gray-50/90' : 'flex-col gap-1'}`}
                            >
                                {!isScrolled && (
                                    <div className="w-10 h-10 rounded-full bg-orange-50/50 flex items-center justify-center text-orange-400 animate-in zoom-in duration-300">
                                        {cat.slug === 'products' ? (
                                            <Store className="w-5 h-5 text-[#0c4a9e]" />
                                        ) : cat.icon_url ? (
                                            <img src={cat.icon_url} alt={cat.name} className="w-5 h-5 object-contain" />
                                        ) : (
                                            <Package className="w-5 h-5 text-[#0c4a9e]" />
                                        )}
                                    </div>
                                )}
                                <span className={`text-[12px] font-bold text-gray-700 whitespace-nowrap ${isScrolled ? 'text-[11px] font-semibold' : ''}`}>
                                    {cat.name}
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>
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
            <div className={`lg:hidden ${isScrolled ? 'h-[100px]' : 'h-[180px]'}`} />
        </>
    );
}
