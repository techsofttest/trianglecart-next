"use client";

import { useRef } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { resolveProductImageUrl } from '@/lib/product';

export interface BrandItem {
    id: string | number;
    name: string;
    logoUrl: string;
    productImageUrl: string;
    // Tailwind gradient classes for a soft, premium background
    bgGradient: string;
    link: string;
}

interface OurBrandsProps {
    title?: string;
    brands: BrandItem[];
}

export default function OurBrands({ title = "Featured Brands", brands }: OurBrandsProps) {
    const carouselRef = useRef<HTMLDivElement>(null);

    if (!brands || brands.length === 0) return null;

    // Smooth scroll navigation for the carousel
    const handleScroll = (direction: 'left' | 'right') => {
        if (carouselRef.current) {
            const { scrollLeft, clientWidth } = carouselRef.current;
            const scrollAmount = clientWidth * 0.6; // Scroll by 60% of container width
            const targetScroll = direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount;
            carouselRef.current.scrollTo({
                left: targetScroll,
                behavior: 'smooth'
            });
        }
    };

    return (
        <section className="w-full bg-white rounded-2xl border border-gray-100 p-4 md:p-6 overflow-hidden">

            {/* Header: Title on left, Carousel controls on right (replaces View All) */}
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl md:text-2xl font-extrabold text-gray-900 tracking-tight">{title}</h2>

                {/* Carousel Arrow Navigation Controls */}
                <div className="flex items-center gap-1.5">
                    <button
                        onClick={() => handleScroll('left')}
                        className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 bg-white hover:bg-gray-50 hover:text-gray-900 transition active:scale-95 shadow-sm"
                        aria-label="Scroll left"
                    >
                        <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                    <button
                        onClick={() => handleScroll('right')}
                        className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 bg-white hover:bg-gray-50 hover:text-gray-900 transition active:scale-95 shadow-sm"
                        aria-label="Scroll right"
                    >
                        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                </div>
            </div>

            {/* Brands Scrolling Container (Carousel) with increased padding-top to prevent clipping */}
            <div
                ref={carouselRef}
                className="flex gap-4 md:gap-6 overflow-x-auto pb-4 pt-9 sm:pt-10 px-2 -mx-2 snap-x scroll-smooth scrollbar-none"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {/* Embedded scrollbar hiding fallback style */}
                <style jsx global>{`
                    .scrollbar-none::-webkit-scrollbar {
                        display: none;
                    }
                `}</style>

                {brands.map((brand) => (
                    <Link
                        key={brand.id}
                        href={brand.link}
                        className="relative group min-w-[140px] sm:min-w-[160px] md:min-w-[180px] snap-start flex-shrink-0"
                    >
                        {/* Main Card Background with Gradient and Full-bleed Product Image */}
                        <div className={`w-full h-[130px] sm:h-[150px] rounded-2xl bg-gradient-to-b ${brand.bgGradient} overflow-hidden transition-all duration-300 group-hover:-translate-y-1 border border-white/50 relative`}>
                            <img
                                src={resolveProductImageUrl(brand.productImageUrl)}
                                alt={`${brand.name} product`}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                        </div>

                        {/* Overlapping Circular Brand Logo: Covers fully, reduced size and top offset to prevent clipping */}
                        <div className="absolute -top-7 left-1/2 -translate-x-1/2 w-14 h-14 sm:w-16 sm:h-16 bg-white rounded-full border-4 border-white flex items-center justify-center overflow-hidden z-10 transition-transform duration-300 group-hover:scale-105">
                            <img
                                src={resolveProductImageUrl(brand.logoUrl)}
                                alt={`${brand.name} logo`}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </Link>
                ))}
            </div>

        </section>
    );
}