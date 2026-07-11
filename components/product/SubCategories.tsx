import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

// 1. Define the TypeScript interface for a single subcategory item
export interface SubCategoryItem {
    imageUrl: string;
    label1: string;
    label2: string;
    linkUrl: string;
}

// 2. Define the props the main component will accept to be reusable
interface SubCategoriesProps {
    sectionTitle: string;
    mainLink?: string;
    items: SubCategoryItem[];
    sectionBgColor?: string;
    showViewAll?: boolean;
}

export default function SubCategories({
    sectionTitle,
    mainLink = '#',
    items,
    sectionBgColor = 'bg-[#f44336]',
    showViewAll = true,
}: SubCategoriesProps) {

    // Return null if there are no items to display
    if (!items || items.length === 0) {
        return null;
    }

    return (
        <section className={`w-full ${sectionBgColor} rounded-2xl p-4 sm:p-5 border border-white/10`}>
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

            {/* Inner grid container: Seamless floating white cards directly on colored background */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-5">

                {/* Map through items to generate cards */}
                {items.map((item, index) => (
                    <Link
                        key={index}
                        href={item.linkUrl}
                        className="group flex flex-col bg-white rounded-2xl p-2.5 sm:p-3 border border-gray-100/60 hover:border-[#0c4a9e]/30 transition duration-300"
                    >

                        {/* Product Card: Full-bleed image wrapper */}
                        <div className="w-full aspect-[4/3] rounded-xl overflow-hidden bg-gray-50 relative">
                            <img
                                src={item.imageUrl}
                                alt={item.label1}
                                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                        </div>

                        {/* Text Area: Minimalist labels using brand-colors on hover */}
                        <div className="pt-2.5 text-center flex-1 flex flex-col justify-center">
                            <span className="text-[12px] font-medium text-gray-500 uppercase tracking-wider mb-0.5 group-hover:text-[#0c4a9e] transition">
                                {item.label1}
                            </span>
                            <span className="text-sm sm:text-base text-gray-900 font-semibold leading-snug">
                                {item.label2}
                            </span>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}