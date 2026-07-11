'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ShoppingCart, Share2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';



interface ProductActionsProps {
    product: {
        id: string | number;
        title: string;
        price: number;
        stock?: number;
        selectedVariantId?: number | null;
        selectedVariant?: { id: number; stock: number } | null;
        image?: string;
        brand?: string;
        weight?: string;
        originalPrice?: number;
    };
    quantity: number;
}

export default function ProductActions({ product, quantity }: ProductActionsProps) {
    const { addToCart } = useCart();
    const { toggleWishlist, isInWishlist } = useWishlist();
    const [isSticky, setIsSticky] = useState(false);
    const triggerRef = useRef<HTMLDivElement>(null);

    const isWishlisted = isInWishlist(product.id);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                // Show sticky bar if the original buttons are BELOW the viewport
                // (i.e., user hasn't scrolled down to them yet)
                setIsSticky(!entry.isIntersecting && entry.boundingClientRect.top > 0);
            },
            { threshold: 0 }
        );

        if (triggerRef.current) {
            observer.observe(triggerRef.current);
        }

        return () => observer.disconnect();
    }, []);

    const handleToggleWishlist = () => {
        toggleWishlist({
            id: String(product.id),
            title: product.title,
            price: product.price,
            image: product.image || '',
            weight: product.weight || '1 unit',
            brand: product.brand || 'General',
            originalPrice: product.originalPrice ?? product.price,
        });
    };

    const handleAddToCart = () => {
        if ((product.selectedVariant?.stock ?? product.stock ?? 1) <= 0) return;
        // Map 'title' to 'name' for the context
        addToCart({ ...product, name: product.title }, quantity);
    };


    const [copied, setCopied] = useState(false);

    const handleShare = async () => {
        const url = window.location.href;

        try {
            if (navigator.share) {
                await navigator.share({
                    title: product.title,
                    url,
                });
                return;
            }

            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch { }
    };

    const isOutOfStock = (product.selectedVariant?.stock ?? product.stock ?? 1) <= 0;

    return (
        <div className="space-y-6">
            {/* Main Action Section (Reference for Sticky) */}
            <div ref={triggerRef} className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                    onClick={handleAddToCart}
                    disabled={isOutOfStock}
                    className="flex-1 flex items-center justify-center gap-2 bg-white border-2 border-[#008446] text-[#008446] font-bold py-3.5 px-6 rounded-xl hover:bg-[#008446]/5 transition-all active:scale-95 text-[14px] animate-pulse"
                >
                    <ShoppingCart className="w-4 h-4" />
                    {isOutOfStock ? 'OUT OF STOCK' : 'ADD TO CART'}
                </button>

                <button
                    onClick={handleShare}
                    className="flex h-[54px] w-[54px] items-center justify-center rounded-xl border-2 border-gray-200 bg-white transition hover:border-[#008446] hover:text-[#008446]"
                    aria-label="Share product"
                >
                    <Share2 className="h-5 w-5" />
                </button>

            </div>

            {/* Sticky Bottom Bar (Visible until original buttons are reached) */}
            <div className={`fixed bottom-0 left-0 right-0 z-50 transition-all duration-500 transform pointer-events-none ${isSticky ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
                }`}>
                <div className="max-w-7xl mx-auto px-0 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
                        {/* Empty left side on desktop */}
                        <div className="hidden lg:block lg:col-span-6" />

                        <div className="lg:col-span-6 bg-white p-3 sm:p-4 lg:rounded-t-2xl border-t lg:border-x lg:border-t border-gray-100 pointer-events-auto flex gap-3 shadow-[0_-10px_25px_-5px_rgba(0,0,0,0.1)]">
                            <button
                                onClick={handleAddToCart}
                                disabled={isOutOfStock}
                                className="flex-1 flex items-center justify-center gap-2 bg-white border-2 border-[#008446] text-[#008446] font-bold py-3.5 rounded-xl text-[14px] hover:bg-[#008446]/5 transition-all animate-pulse"
                            >
                                <ShoppingCart className="w-4 h-4" />
                                <span className="hidden sm:inline">{isOutOfStock ? 'OUT OF STOCK' : 'ADD TO CART'}</span>
                                <span className="sm:hidden">{isOutOfStock ? 'OUT' : 'ADD'}</span>
                            </button>


                            <button
                                onClick={handleShare}
                                className="flex h-[54px] w-[54px] shrink-0 items-center justify-center rounded-xl bg-[#008446] text-white shadow-xl shadow-[#008446]/20 transition hover:bg-[#008446]/90"
                                aria-label="Share product"
                            >
                                <Share2 className="h-5 w-5" />
                            </button>


                            {copied && (
                                <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-black text-white px-4 py-2 rounded-lg text-sm shadow-lg z-[9999]">
                                    Link copied!
                                </div>
                            )}


                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
