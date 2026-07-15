'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Trash2, Heart } from 'lucide-react';
import { useWishlist } from '@/context/WishlistContext';
import ProductQuickAddModal from './ProductQuickAddModal';
import { slugify } from '@/utils/slugify';
import { resolveProductImageUrl } from '@/lib/product';

export interface Product {
    id: string;
    slug?: string;
    brand?: string;
    title: string;
    image: string;
    weight: string;
    price: number;
    originalPrice: number;
    discount?: string;
    rating?: number;
    reviews?: number;
    isSponsored?: boolean;
    promoText?: string;
    expiryDate?: string;
    category?: string;
    subCategory?: string;
    variants?: Array<{
        id: number;
        sku: string | null;
        unit: string | null;
        size: string | null;
        price: number;
        stock: number;
    }>;
}

export default function ProductCard({ product, showRemoveButton = false }: { product: Product, showRemoveButton?: boolean }) {
    const resolvedSlug = product.slug || slugify(product.title);
    const href = resolvedSlug ? `/product/${resolvedSlug}` : `/product/${product.id}`;
    const { isInWishlist, toggleWishlist, removeFromWishlist } = useWishlist();
    const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
    const isWishlisted = isInWishlist(product.id);

    return (
        <>
            <div className="group relative flex flex-col bg-white rounded-2xl p-2.5 sm:p-3 border border-gray-100 hover:border-[#0c4a9e]/30 hover:shadow-lg transition-all duration-300">
                {/* Top Actions/Badges */}
                <div className="absolute top-2.5 left-2.5 right-2.5 flex justify-between items-start z-10 pointer-events-none">
                    {/* {product.discount ? (
                        <div className="bg-red-500 text-white text-[10px] sm:text-[11px] font-bold px-2 py-1 rounded-lg shadow-sm uppercase tracking-wider animate-in fade-in zoom-in duration-300">
                            {product.discount} OFF
                        </div>
                    ) : <div />}
                     */}

                    <div className="flex flex-col gap-2 pointer-events-auto">
                        {showRemoveButton && (
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    removeFromWishlist(product.id);
                                }}
                                className="w-8 h-8 sm:w-9 sm:h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md text-gray-400 hover:text-red-600 transition-all active:scale-90"
                            >
                                <Trash2 className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
                            </button>
                        )}
                    </div>
                </div>

                <Link
                    href={href}
                    className="relative w-full aspect-square bg-gray-50 rounded-xl mb-2 overflow-hidden p-0"
                >
                    <img
                        src={resolveProductImageUrl(product.image)}
                        alt={product.title}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                    />
                </Link>

                <div className="flex flex-col flex-1">
                    <Link href={href} className="flex flex-col flex-1">
                        {product.brand && (
                            <span className="text-sm font-medium text-gray-600 uppercase tracking-wide mb-0.5">
                                {product.brand}
                            </span>
                        )}
                        <h3 className="text-sm sm:text-sm font-semibold text-gray-900 line-clamp-2 overflow-hidden text-ellipsis leading-tight group-hover:text-[#0c4a9e] transition-colors mb-1.5">
                            {product.title}
                        </h3>
                        <div className="flex items-center justify-between gap-1.5 mb-1.5">
                            <span className="text-sm sm:text-sm font-medium text-gray-700">
                                {product.weight}
                            </span>
                        </div>
                    </Link>

                    {product.promoText && (
                        <span className="text-sm font-medium text-green-700 mb-2 text-left leading-tight block">
                            • {product.promoText}
                        </span>
                    )}

                    <div className="mt-auto pt-2 border-t border-gray-50">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-sm sm:text-base font-semibold text-[#008446] leading-none">
                                ${product.price.toFixed(2)}
                            </span>
                            <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-semibold text-green-700">
                                In Stock
                            </span>
                        </div>

                        <div className="space-y-2">
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    setIsQuickAddOpen(true);
                                }}
                                className="w-full flex items-center justify-center gap-1 bg-[#008446] text-white hover:bg-white hover:border-2 hover:border-[#008446] hover:text-[#008446] text-xs sm:text-sm font-semibold px-3 py-2 sm:px-4 sm:py-2 rounded-lg text-sm sm:text-sm transition-all duration-200 shadow-sm active:scale-95"
                            >
                                <span>ADD TO CART</span>
                                <span className="font-normal text-sm sm:text-base leading-none mb-0.5">+</span>
                            </button>

                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    toggleWishlist(product);
                                }}
                                className={`w-full flex items-center justify-center gap-2 font-semibold text-xs sm:text-sm px-3 py-2 sm:px-4 sm:py-2 rounded-lg text-sm sm:text-sm transition-all duration-200 shadow-sm active:scale-95 group ${
                                    isWishlisted
                                        ? 'bg-red-600 text-white border-2 border-red-600'
                                        : 'bg-white border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white'
                                }`}
                            >
                                <Heart className={`w-4 h-4 ${isWishlisted ? 'text-white fill-current' : 'text-red-600 group-hover:text-white'}`} />
                                <span>{isWishlisted ? 'WISHLISTED' : 'WISHLIST'}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <ProductQuickAddModal
                product={product}
                isOpen={isQuickAddOpen}
                onClose={() => setIsQuickAddOpen(false)}
            />
        </>
    );
}
