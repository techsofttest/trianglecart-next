'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
    Home, ShoppingCart, User, Grid, Info, Mail, 
    ShieldQuestion, FileText, X, ChevronRight 
} from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function MobileBottomNav() {
    const pathname = usePathname();
    const { cartCount } = useCart();
    const [isMoreOpen, setIsMoreOpen] = useState(false);

    // Close menu when route changes
    useEffect(() => {
        setIsMoreOpen(false);
    }, [pathname]);

    const navItems = [
        { label: 'Home', icon: <Home className="w-6 h-6" />, href: '/' },
        { label: 'Cart', icon: <ShoppingCart className="w-6 h-6" />, href: '/cart', badge: cartCount },
        { label: 'Profile', icon: <User className="w-6 h-6" />, href: '/profile' },
        { label: 'More', icon: <Grid className="w-6 h-6" />, onClick: () => setIsMoreOpen(true) },
    ];

    const moreLinks = [
        { label: 'About Us', icon: <Info className="w-5 h-5" />, href: '/about' },
        { label: 'Contact Us', icon: <Mail className="w-5 h-5" />, href: '/contact' },
        { label: 'FAQ', icon: <ShieldQuestion className="w-5 h-5" />, href: '/faq' },
        { label: 'Terms of Service', icon: <FileText className="w-5 h-5" />, href: '/terms-of-service' },
    ];

    return (
        <>
            {/* Bottom Nav Bar */}
            <nav className="lg:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-100 z-50 px-2 py-2 shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
                <div className="flex items-center justify-around">
                    {navItems.map((item, idx) => {
                        const isActive = pathname === item.href;
                        const content = (
                            <div className="flex flex-col items-center gap-1 min-w-[64px] py-1 transition-all">
                                <div className={`relative ${isActive ? 'text-[#0c4a9e] scale-110' : 'text-gray-400'}`}>
                                    {item.icon}
                                    {item.badge !== undefined && item.badge > 0 && (
                                        <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white animate-in zoom-in duration-300">
                                            {item.badge}
                                        </span>
                                    )}
                                </div>
                                <span className={`text-[11px] font-bold uppercase tracking-wider ${isActive ? 'text-[#0c4a9e]' : 'text-gray-400'}`}>
                                    {item.label}
                                </span>
                            </div>
                        );

                        return item.href ? (
                            <Link key={idx} href={item.href}>
                                {content}
                            </Link>
                        ) : (
                            <button key={idx} onClick={item.onClick}>
                                {content}
                            </button>
                        );
                    })}
                </div>
            </nav>

            {/* More Options Sheet */}
            {isMoreOpen && (
                <div className="lg:hidden fixed inset-0 z-[70] animate-in fade-in duration-300">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsMoreOpen(false)} />
                    <div className="absolute bottom-0 left-0 w-full bg-white rounded-t-[32px] p-6 shadow-2xl animate-in slide-in-from-bottom-full duration-500">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xl font-bold text-gray-900 tracking-tight">More Options</h3>
                            <button onClick={() => setIsMoreOpen(false)} className="p-2 bg-gray-50 rounded-full text-gray-400 hover:text-gray-900 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 gap-3">
                            {moreLinks.map((link, idx) => (
                                <Link 
                                    key={idx} 
                                    href={link.href}
                                    className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:bg-blue-50 transition-all group"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[#0c4a9e] shadow-sm group-hover:bg-[#0c4a9e] group-hover:text-white transition-all">
                                            {link.icon}
                                        </div>
                                        <span className="font-bold text-gray-700 text-sm">{link.label}</span>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#0c4a9e] transition-all" />
                                </Link>
                            ))}
                        </div>

                        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Triangle Cart Pty Ltd</p>
                            <p className="text-[11px] text-gray-400 mt-1">© 2026 All Rights Reserved</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Spacer for bottom nav height */}
            <div className="lg:hidden h-[72px]" />
        </>
    );
}
