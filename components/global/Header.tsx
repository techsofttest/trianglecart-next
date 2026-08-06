'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { apiUrl } from '@/lib/api';
import {
    MapPin, User, ChevronDown, ShoppingCart, ChevronLeft, ChevronRight,
    Package, Heart, Store, Gift, CreditCard, Bell,
    HeadphonesIcon, TrendingUp, Sparkles, ShieldQuestion,
    Info, Mail, FileText, Shield, Sparkle,
    Flame, Wheat, Carrot, Cookie, Cake, CupSoda,
    Bath, Home, FlameKindling, Milk, Snowflake, Fish, UtensilsCrossed, Baby,
    Leaf, Utensils, Mountain, Croissant, Popcorn, ChefHat, Zap, Candy, Soup, Droplets, Coffee,
    LogOut, Briefcase, Download, Check
} from 'lucide-react';
import { useRouter, useParams, usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useCustomerAuth } from '@/context/CustomerAuthContext';
{/*import LocationDrawer from './LocationDrawer';*/}
import { fetchStorefront } from '@/lib/storefront';
import HeaderSearch from './HeaderSearch';
import { usePWAInstall } from '@/hooks/usePWAInstall';

type HeaderCategory = {
    id: number;
    name: string;
    slug: string;
    href: string;
    image_url: string | null;
    icon_url: string | null;
};

export default function Header() {
    const { cartCount } = useCart();
    const { customer, isAuthenticated, logout } = useCustomerAuth();
    const { isInstalled, isSupported, handleInstall } = usePWAInstall();
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isMoreOpen, setIsMoreOpen] = useState(false);
    const [isCategoryMoreOpen, setIsCategoryMoreOpen] = useState(false);
    const [isLocationOpen, setIsLocationOpen] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState<{
        title: string;
        subtitle: string;
        id?: string | number;
        phone?: string;
        name?: string
    } | null>(null);
    const headerRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const params = useParams();
    const pathname = usePathname();
    const isHome = pathname === '/';
    const hideHeaderCategories = ['/login', '/checkout', '/checkout/status'].some((route) => pathname.startsWith(route));

    // Check location state on mount
    useEffect(() => {
        const checkState = () => {
            const storedLoc = localStorage.getItem('selectedLocation');
            if (storedLoc) setSelectedLocation(JSON.parse(storedLoc));
        };

        checkState();

        window.addEventListener('locationUpdate', checkState);
        return () => {
            window.removeEventListener('locationUpdate', checkState);
        };
    }, []);

    // Close all dropdowns when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
                setIsLoginOpen(false);
                setIsMoreOpen(false);
                setIsCategoryMoreOpen(false);
                // We don't close location drawer here as it has its own backdrop
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const [categories, setCategories] = useState<HeaderCategory[]>([]);

    useEffect(() => {
        const fetchCategories = async () => {
            const [headerData, homeData] = await Promise.all([
                fetchStorefront<{ categories: { main: HeaderCategory[]; all: HeaderCategory[] } }>('/api/storefront/header'),
                fetchStorefront<any>('/api/storefront/home'),
            ]);

            if (headerData?.categories) {
                const mainCategories = headerData.categories.main || [];

                // Add featured non-main categories from home payload if present
                const mainIds = new Set(mainCategories.map((c) => c.id));
                const featured = (homeData?.featured_categories || []).filter((fc: any) => !mainIds.has(fc.id)).map((fc: any) => ({
                    id: fc.id,
                    name: fc.name,
                    slug: fc.slug,
                    href: `/category/${fc.slug}`,
                    image_url: fc.image_url ?? null,
                    icon_url: fc.icon_url ?? null,
                }));

                setCategories([...mainCategories, ...featured]);
            }
        };
        fetchCategories();
    }, []);

    const categoryNavRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    const handleMouseDown = (e: React.MouseEvent) => {
        if (!categoryNavRef.current) return;
        setIsDragging(true);
        setStartX(e.pageX - categoryNavRef.current.offsetLeft);
        setScrollLeft(categoryNavRef.current.scrollLeft);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging || !categoryNavRef.current) return;
        e.preventDefault();
        const x = e.pageX - categoryNavRef.current.offsetLeft;
        const walk = (x - startX) * 2; // scroll-fast
        categoryNavRef.current.scrollLeft = scrollLeft - walk;
    };

    const handleMouseUpOrLeave = () => {
        setIsDragging(false);
    };

    const scrollCategories = (direction: 'left' | 'right') => {
        if (categoryNavRef.current) {
            const scrollAmount = 300;
            categoryNavRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

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
        <header className="hidden lg:block bg-gray-700 shadow-sm border-b border-gray-200 sticky top-0 z-50" ref={headerRef}>

            {/* Top Row: Logo, Search, Actions */}
            <div className="mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-6">

                {/* Logo & Location */}
                <div className="flex items-center gap-6 flex-shrink-0">
                    <Link href="/" className="flex items-center">
                        <img
                            src={apiUrl('/images/logo/brand-logo-nobg.png?v2')}
                            alt="Triangle Cart Logo"
                            className="h-14 w-auto object-contain"
                        />
                    </Link>
                    <div
                        className="hidden items-center gap-3 cursor-pointer group hover:bg-gray-50/80 px-3 py-1.5 rounded-xl transition-all"
                        onClick={() => setIsLocationOpen(true)}
                    >
                        <div className="flex items-center gap-2.5">
                            {selectedLocation ? (
                                <>
                                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-white group-hover:bg-white transition-colors">
                                        {selectedLocation.title?.toUpperCase() === 'HOME' ? (
                                            <Home className="w-4 h-4" />
                                        ) : selectedLocation.title?.toUpperCase() === 'WORK' ? (
                                            <Briefcase className="w-4 h-4" />
                                        ) : (
                                            <MapPin className="w-4 h-4" />
                                        )}
                                    </div>
                                    <div className="flex flex-col overflow-hidden max-w-[240px]">
                                        {selectedLocation.title?.toUpperCase() !== 'OTHER' && (
                                            <span className="text-[11px] font-black text-white uppercase tracking-wider leading-tight">
                                                {selectedLocation.title}
                                            </span>
                                        )}
                                        <span className="text-[13px] text-gray-300 font-medium truncate leading-tight mt-0.5">
                                            {selectedLocation.subtitle}
                                        </span>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <MapPin className="w-5 h-5 text-[#0c4a9e]" />
                                    <div className="flex flex-col">
                                        <span className="text-[11px] text-gray-400 font-bold uppercase tracking-wider leading-none">Delivery to</span>
                                        <span className="text-[14px] font-bold text-[#0c4a9e]">Select Location</span>
                                    </div>
                                </>
                            )}
                        </div>
                        <ChevronDown className={`w-4 h-4 text-gray-500 group-hover:text-[#0c4a9e] transition-all duration-300 ${isLocationOpen ? 'rotate-180' : ''}`} />
                    </div>
                </div>

                {/* Center: Search Bar with Suggestions */}
                <HeaderSearch />

                {/* PWA Install Button */}
                <button
                    onClick={handleInstall}
                    disabled={isInstalled}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-bold transition-all duration-200 flex-shrink-0 ${
                        isInstalled
                            ? 'bg-green-600 text-white cursor-default'
                            : 'bg-brand-green text-white hover:bg-green-700 active:scale-95'
                    }`}
                >
                    {isInstalled ? (
                        <><Check className="w-4 h-4" /> Installed</>
                    ) : (
                        <><Download className="w-4 h-4" /> Install</>
                    )}
                </button>

                {/* Right: Actions (Login, More, Cart) */}
                <div className="flex items-center gap-2 md:gap-6 flex-shrink-0">

                    <Link href="/" className="flex items-center gap-1.5 text-white hover:text-brand-green px-4 py-2 rounded-md transition font-semibold text-sm">
                        <Home className="w-5 h-5" />
                        <span>Home</span>
                    </Link>

                    {/* Login / Profile Dropdown */}
                    {isAuthenticated ? (
                        <div className="relative">
                            <button
                                className="flex items-center gap-1.5 hover:bg-[#0c4a9e] hover:text-brand-green text-white px-4 py-2 rounded-md transition duration-200 group"
                                onMouseEnter={() => setIsLoginOpen(true)}
                                onClick={() => setIsLoginOpen(!isLoginOpen)}
                            >
                                <User className="w-5 h-5" />
                                <span className="font-semibold text-sm">
                                    {customer?.name || 'Profile'}
                                </span>
                                <ChevronDown className={`w-4 h-4 transition-transform ${isLoginOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {isLoginOpen && (
                                <div
                                    className="absolute right-0 top-full mt-1 w-64 bg-white border border-gray-200 shadow-xl rounded-md z-50 py-2"
                                    onMouseLeave={() => setIsLoginOpen(false)}
                                >
                                    <div className="px-4 py-2 border-b border-gray-100">
                                        <span className="text-sm font-bold text-gray-600 uppercase tracking-wider">My Account</span>
                                    </div>
                                    <nav className="flex flex-col py-1">
                                        <Link href="/profile/personal" className="flex items-center gap-4 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition"><User className="w-4 h-4" /> My Profile</Link>
                                        <Link href="/profile/orders" className="flex items-center gap-4 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition"><Package className="w-4 h-4" /> Orders</Link>
                                        <Link href="/profile/addresses" className="flex items-center gap-4 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition"><MapPin className="w-4 h-4" /> Addresses</Link>
                                        <Link href="/profile/wishlist" className="flex items-center gap-4 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition"><Heart className="w-4 h-4" /> Wishlist</Link>
                                        <button
                                            onClick={() => {
                                                logout();
                                                setIsLoginOpen(false);
                                            }}
                                            className="w-full flex items-center gap-4 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition border-t border-gray-100 mt-1"
                                        >
                                            <LogOut className="w-4 h-4" /> Logout
                                        </button>
                                    </nav>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Link href="/login" className="flex items-center gap-1.5 text-white hover:text-brand-green px-4 py-2 rounded-md transition font-semibold text-sm">
                                <User className="w-5 h-5" />
                                <span>Login</span>
                            </Link>
                        </div>
                    )}

                    {/* More Dropdown (Pages) */}
                    {/* <div className="relative hidden md:block">
                        <button
                            className="flex items-center gap-1 text-gray-800 hover:text-[#0c4a9e] transition font-medium text-sm"
                            onMouseEnter={() => setIsMoreOpen(true)}
                            onClick={() => setIsMoreOpen(!isMoreOpen)}
                        >
                            More <ChevronDown className={`w-4 h-4 transition-transform ${isMoreOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {isMoreOpen && (
                            <div
                                className="absolute right-0 top-full mt-3 w-48 bg-white border border-gray-200 shadow-xl rounded-md z-50 py-2"
                                onMouseLeave={() => setIsMoreOpen(false)}
                            >
                                <Link href="/about" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition"><Info className="w-4 h-4" /> About Us</Link>
                                <Link href="/contact" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition"><Mail className="w-4 h-4" /> Contact Us</Link>
                                <Link href="/faq" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition"><ShieldQuestion className="w-4 h-4" /> FAQ</Link>
                                <Link href="/terms-of-service" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition"><FileText className="w-4 h-4" /> Terms of Service</Link>
                            </div>
                        )}
                    </div> */}

                    {/* Cart */}
                    <Link href="/cart" className="flex items-center gap-2 text-white hover:text-brand-green transition font-semibold text-sm relative group">
                        <div className="relative">
                            <ShoppingCart className="w-5 h-5" />
                            {cartCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white animate-in zoom-in duration-300">
                                    {cartCount}
                                </span>
                            )}
                        </div>
                        <span className="hidden sm:block">Cart</span>
                    </Link>

                </div>
            </div>

            {/* Bottom Row: Categories Carousel */}
            {!isHome && !hideHeaderCategories && (
                <div className="border-t border-green-100 hidden md:block relative group/carousel bg-white">
                    <div className="mx-auto px-4 sm:px-6 lg:px-8 py-2 relative flex items-center justify-center">

                        {/* Left Scroll Button */}
                        <button
                            onClick={() => scrollCategories('left')}
                            className="absolute left-2 z-10 p-1.5 bg-orange border border-gray-200 rounded-full shadow-md text-brand-blue hover:text-brand-orange/80 opacity-0 group-hover/carousel:opacity-100 transition-opacity"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>

                        {/* Draggable Carousel Container */}
                        <div
                            ref={categoryNavRef}
                            onMouseDown={handleMouseDown}
                            onMouseMove={handleMouseMove}
                            onMouseUp={handleMouseUpOrLeave}
                            onMouseLeave={handleMouseUpOrLeave}
                            className={`flex items-center gap-2 overflow-x-auto scrollbar-hide scroll-smooth select-none ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
                        >
                            {navItems.map((cat) => {
                                const isAllProducts = cat.slug === 'products';
                                const isActive = isAllProducts
                                    ? pathname === '/products' || pathname.startsWith('/products')
                                    : params?.slug === cat.slug;
                                const href = isAllProducts ? '/products' : `/category/${cat.slug}`;

                                return (
                                    <Link
                                        key={cat.id}
                                        href={href}
                                        className={`transition group flex-shrink-0 flex items-center justify-center px-3 py-1.5 rounded-full border whitespace-nowrap bg-gray-50/80 border-brand-blue text-brand-blue hover:text-brand-blue hover:border-brand-orange ${isActive ? 'border-brand-orange text-brand-orange bg-white' : ''}`}
                                    >
                                        <span className="text-[11px] md:text-[12px] font-bold tracking-tight">
                                            {cat.name}
                                        </span>
                                    </Link>
                                );
                            })}
                        </div>

                        {/* Right Scroll Button */}
                        <button
                            onClick={() => scrollCategories('right')}
                            className="absolute right-2 z-10 p-1.5 bg-white border border-gray-200 rounded-full shadow-md text-brand-orange hover:text-brand-orange/80 opacity-20 group-hover/carousel:opacity-100 transition-opacity"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            )}

            {/* Location Selection Drawer */}
            {/*<LocationDrawer
                isOpen={isLocationOpen}
                onClose={() => setIsLocationOpen(false)}
                onSelectLocation={(loc) => {
                    setSelectedLocation(loc);
                    localStorage.setItem('selectedLocation', JSON.stringify(loc));
                    window.dispatchEvent(new Event('locationUpdate'));
                }}
            />*/}
        </header>
    );
}
