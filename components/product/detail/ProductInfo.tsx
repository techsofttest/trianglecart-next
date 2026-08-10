'use client';

import React from 'react';
import ProductDeliveryReturnsInfo from './ProductDeliveryReturnsInfo';

interface ProductInfoProps {
    brand: string;
    title: string;
    rating: number;
    reviews: number;
    price: number;
    originalPrice: number;
    strikedPrice?: number;
    discount: string;
}

export default function ProductInfo({ brand, title, rating, reviews, price, originalPrice, strikedPrice, discount }: ProductInfoProps) {
    return (
        <div className="space-y-4">
            <div>
                <span className="text-[13px] font-semibold text-[#0c4a9e] uppercase tracking-[0.15em] mb-1.5 block">
                  Brand : {brand}
                </span>
                <h3 className="text-xl md:text-2xl font-semibold text-gray-900 leading-tight tracking-tight mb-1">
                    {title}
                </h3>

                <div className="flex items-center flex-wrap gap-2">
                    {strikedPrice && strikedPrice > price && (
                        <span className="text-lg font-medium text-red-600 line-through tracking-tight">$ {strikedPrice}</span>
                    )}
                    <span className="text-2xl font-semibold text-gray-900 tracking-tight">$ {price}</span>
                    <span className="inline-flex items-center rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">
                        In Stock
                    </span>
                </div>



                <div className="mt-1 hidden md:block">
                    <ProductDeliveryReturnsInfo />
                </div>



            </div>
        </div>
    );
}
