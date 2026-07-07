'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, MapPin, ChevronDown, Home, Briefcase } from 'lucide-react';
import { ALL_CATEGORIES } from '@/data/categories';
import { slugify } from '@/utils/slugify';
import LocationDrawer from './LocationDrawer';
import { useCustomerAuth } from '@/context/CustomerAuthContext';

export default function MobileHeader() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isLocationOpen, setIsLocationOpen] = useState(false);
    const { isAuthenticated } = useCustomerAuth();
    const [selectedLocation, setSelectedLocation] = useState<{ 
        title: string; 
        subtitle: string; 
    } | null>(null);

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

    return (
        <>
            <header className={`lg:hidden fixed top-0 left-0 w-full bg-white z-[60] transition-all duration-300 border-b border-gray-100 ${isScrolled ? 'shadow-md' : ''}`}>
                
                {/* Top Row: Logo & Location (Hidden on scroll) */}
                {!isScrolled && (
                    <div className="flex items-center justify-between px-4 py-3 animate-in fade-in slide-in-from-top-2 duration-300">
                        <Link href="/" className="flex-shrink-0">
                            <Image
                                src="/logo/mock-logo.png"
                                alt="Logo"
                                width={120}
                                height={32}
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
                    <div className="flex items-center w-full bg-gray-50 rounded-xl border border-gray-200 px-3 py-2.5 transition-all">
                        <Search className="w-4 h-4 text-gray-400 mr-2" />
                        <input 
                            type="text" 
                            placeholder="Search for groceries..." 
                            className="bg-transparent w-full text-sm outline-none text-gray-800 placeholder-gray-500 font-medium"
                        />
                    </div>
                </div>

                {/* Bottom Row: Categories Carousel */}
                <div className={`border-t border-gray-50 overflow-x-auto scrollbar-hide bg-white transition-all duration-300 ${isScrolled ? 'py-1.5' : 'py-3'}`}>
                    <div className="flex items-center gap-6 px-4 min-w-max">
                        {ALL_CATEGORIES.map((cat, idx) => (
                            <Link 
                                key={idx} 
                                href={`/category/${slugify(cat.name)}`}
                                className={`flex flex-col items-center transition-all ${isScrolled ? 'flex-row gap-2' : 'gap-1'}`}
                            >
                                {!isScrolled && (
                                    <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-400 animate-in zoom-in duration-300">
                                        {React.cloneElement(cat.icon as any, { className: "w-5 h-5 mb-0" })}
                                    </div>
                                )}
                                <span className={`text-[12px] font-bold text-gray-700 whitespace-nowrap ${isScrolled ? 'px-3 py-1 bg-gray-50 rounded-full border border-gray-100' : ''}`}>
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
