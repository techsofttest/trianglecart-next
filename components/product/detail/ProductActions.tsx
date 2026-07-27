'use client';

import React, { useState } from 'react';
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

    const isWishlisted = isInWishlist(product.id);

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
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-2">
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

            {copied && (
                <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-black text-white px-4 py-2 rounded-lg text-sm shadow-lg z-[9999]">
                    Link copied!
                </div>
            )}

        </div>
    );
}
