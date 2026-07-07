'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

export interface OfferItem {
    id: string | number;
    categoryName: string;
    discountText: string;
    imageUrl: string;
    link: string;
}

interface TopOffersCarouselProps {
    title?: string;
    subtitle?: string;
    offers: OfferItem[];
    // Allows overriding the energetic orange gradient if needed for other campaigns
    bgGradient?: string;
}

export default function TopOffersCarousel({
    title = "Top Offers of the Day",
    subtitle = "Grab these deals before they're gone!",
    offers,
    bgGradient = "from-orange-700 to-orange-600"
}: TopOffersCarouselProps) {

    const scrollRef = useRef<HTMLDivElement>(null);

    // Smooth scroll navigation for the carousel track
    const handleScroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const { scrollLeft, clientWidth } = scrollRef.current;
            const scrollAmount = clientWidth * 0.6; // Scroll by 60% of container width
            const targetScroll = direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount;
            scrollRef.current.scrollTo({
                left: targetScroll,
                behavior: 'smooth'
            });
        }
    };

    if (!offers || offers.length === 0) return null;

    return (
        <section className="relative w-full rounded-2xl overflow-hidden group border border-orange-100">

            {/* Vibrant Background with subtle decorative pattern (No shadows) */}
            <div className={`absolute inset-0 bg-gradient-to-r ${bgGradient}`}>
                {/* Subtle geometric overlay to mimic the textured background of the reference without the clutter */}
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
            </div>

            <div className="relative p-4 md:p-6">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 text-white gap-4">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-semibold flex items-center gap-2 drop-shadow-md tracking-tight">
                            {title} <Sparkles className="w-6 h-6 text-yellow-300" />
                        </h2>
                        {subtitle && (
                            <p className="text-orange-50 font-medium mt-1 text-sm md:text-base leading-tight">
                                {subtitle}
                            </p>
                        )}
                    </div>

                    {/* Custom Carousel Navigation Arrows (Desktop) - matches the standard carousel button style */}
                    <div className="hidden md:flex items-center gap-1.5">
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

                {/* Carousel Track (scrollbar-none with scroll styling) */}
                <div
                    ref={scrollRef}
                    className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 md:mx-0 md:px-0 snap-x scroll-smooth scrollbar-none"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {/* Embedded scrollbar hiding style tag */}
                    <style jsx global>{`
                        .scrollbar-none::-webkit-scrollbar {
                            display: none;
                        }
                    `}</style>

                    {offers.map((offer) => (
                        <Link
                            key={offer.id}
                            href={offer.link}
                            className="relative flex flex-col min-w-[140px] w-[140px] md:min-w-[180px] md:w-[180px] bg-white rounded-2xl snap-start transform transition-all duration-300 hover:-translate-y-1 overflow-hidden group/card border border-white/40"
                        >
                            {/* Image Area: Covers container fully and locks aspect ratio (no padding) */}
                            <div className="w-full h-[120px] md:h-[150px] p-0 relative overflow-hidden bg-gray-50">
                                {/* Decorative subtle shine effect on hover */}
                                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity z-10 pointer-events-none"></div>

                                <img
                                    src={offer.imageUrl}
                                    alt={offer.categoryName}
                                    className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-500"
                                />
                            </div>

                            {/* Offer Details Area (Yellow/White contrast similar to reference) */}
                            <div className="flex flex-col text-center mt-auto">
                                <div className="bg-[#f0f5ff] py-1.5 px-2">
                                    <span className="text-[12px] md:text-xs font-semibold text-[#0c4a9e] uppercase tracking-wider line-clamp-1">
                                        {offer.categoryName}
                                    </span>
                                </div>
                                <div className="bg-yellow-400 py-2 px-2">
                                    <span className="text-xs md:text-sm font-semibold text-gray-900 leading-tight block">
                                        {offer.discountText}
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

            </div>
        </section>
    );
}