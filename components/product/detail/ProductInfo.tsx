'use client';

import React from 'react';

interface ProductInfoProps {
    brand: string;
    title: string;
    rating: number;
    reviews: number;
    price: number;
    originalPrice: number;
    discount: string;
}

export default function ProductInfo({ brand, title, rating, reviews, price, originalPrice, discount }: ProductInfoProps) {
    return (
        <div className="space-y-4">
            <div>
                <span className="text-[12px] font-semibold text-[#0c4a9e] uppercase tracking-[0.15em] mb-1.5 block">
                    {brand}
                </span>
                <h1 className="text-xl md:text-2xl font-semibold text-gray-900 leading-tight tracking-tight mb-3">
                    {title}
                </h1>

                <div className="flex items-baseline gap-3">
                    <span className="text-2xl font-semibold text-gray-900 tracking-tight">${price}</span>
                    <span className="text-base text-gray-400 line-through font-medium">${originalPrice}</span>
                    <span className="text-[14px] text-green-600 font-semibold">{discount} OFF</span>
                </div>
                <p className="text-[11px] text-gray-400 mt-1 font-medium italic">MRP Incl. of all taxes</p>
            </div>
        </div>
    );
}
