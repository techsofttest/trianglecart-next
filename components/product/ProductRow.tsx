'use client';

import React from 'react';
import ProductCard, { Product } from './ProductCard';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface ProductRowProps {
    title: string;
    products: Product[];
    viewAllLink?: string;
}

export default function ProductRow({ title, products, viewAllLink }: ProductRowProps) {
    if (!products || products.length === 0) return null;

    return (
        <section className="w-full bg-white rounded-2xl border border-gray-100/80 shadow-sm p-4 sm:p-6">
            {/* Header Section without line divider for a cleaner modern look */}
            <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-xl md:text-2xl font-extrabold text-gray-900 tracking-tight">{title}</h2>
                {viewAllLink && (
                    <Link 
                        href={viewAllLink} 
                        className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 bg-gray-50 rounded-full text-gray-700 group hover:bg-[#008446] hover:text-white transition-all duration-300 border border-gray-100 shadow-sm"
                        aria-label={`View all in ${title}`}
                    >
                        <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                )}
            </div>

            {/* Horizontal scrollable track */}
            <div
                className="flex gap-3 sm:gap-4 overflow-x-auto custom-scrollbar pb-3 px-1"
            >
                {products.map((product, index) => (
                    <div
                        key={`${product.id}-${index}`}
                        className="shrink-0 w-[78%] sm:w-[48%] md:w-[32%] lg:w-[20%] xl:w-[20%]"
                    >
                        <ProductCard product={product} />
                    </div>
                ))}
            </div>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    height: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: #f8f9fa;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #cbd5e1;
                    border-radius: 10px;
                    transition: background 0.2s;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #008446;
                }
            `}</style>
        </section>
    );
}
