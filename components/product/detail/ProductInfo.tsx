'use client';

import React from 'react';
import { Star } from 'lucide-react';

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
                
                <div className="flex items-center gap-3 mb-5">
                    <div className="flex items-center gap-1 bg-amber-50 text-amber-700 px-2 py-0.5 rounded-md border border-amber-100 text-[12px] font-semibold">
                        <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                        {rating}
                    </div>
                    <span className="text-[12px] text-gray-500 font-medium">{reviews} Ratings</span>
                </div>

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
