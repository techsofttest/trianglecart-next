'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import ProductCard, { Product } from './ProductCard';

interface SubCategoriesProps {
    sectionTitle: string;
    mainLink?: string;
    products: Product[];
    sectionBgColor?: string;
    showViewAll?: boolean;
}

export default function SubCategories({
    sectionTitle,
    mainLink = '#',
    products,
    sectionBgColor = 'bg-[#f44336]',
    showViewAll = true,
}: SubCategoriesProps) {

    if (!products || products.length === 0) {
        return null;
    }

    return (
        <section className={`w-full ${sectionBgColor} rounded-2xl p-4 sm:p-5 border border-white/10 shadow-sm`}>
            {/* Header Section: Title and View All Arrow */}
            <div className="flex items-center justify-between mb-4 sm:mb-5 px-1">
                <h2 className="text-xl md:text-2xl font-semibold text-white tracking-tight">
                    {sectionTitle}
                </h2>

                {/* Circular View All Arrow with Brand Color Hover Transition */}
                {showViewAll && mainLink && (
                    <Link
                        href={mainLink}
                        className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 bg-white rounded-full text-[#0c4a9e] group hover:bg-[#0c4a9e] hover:text-white transition duration-300 focus:outline-none focus:ring-2 focus:ring-white/50"
                        aria-label={`View all in ${sectionTitle}`}
                    >
                        <ChevronRight className="w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                )}
            </div>

            {/* Inner horizontal scrollable track of ProductCards */}
            <div className="flex gap-3 sm:gap-4 overflow-x-auto custom-scrollbar-featured pb-3 px-1">
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
                .custom-scrollbar-featured::-webkit-scrollbar {
                    height: 6px;
                }
                .custom-scrollbar-featured::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 10px;
                }
                .custom-scrollbar-featured::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.3);
                    border-radius: 10px;
                    transition: background 0.2s;
                }
                .custom-scrollbar-featured::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.6);
                }
            `}</style>
        </section>
    );
}