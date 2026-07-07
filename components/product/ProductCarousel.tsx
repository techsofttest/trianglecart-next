'use client';

import React, { useRef } from 'react';
import ProductCard, { Product } from './ProductCard';
import { ChevronRight, ChevronLeft } from 'lucide-react';

interface ProductCarouselProps {
    title: string;
    products: Product[];
}

export default function ProductCarousel({ title, products }: ProductCarouselProps) {
    const scrollRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const { scrollLeft, clientWidth } = scrollRef.current;
            const scrollTo = direction === 'left' 
                ? scrollLeft - clientWidth * 0.8 
                : scrollLeft + clientWidth * 0.8;
            
            scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
        }
    };

    if (!products || products.length === 0) return null;

    return (
        <section className="w-full bg-white py-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg md:text-xl font-bold text-gray-900 tracking-tight">{title}</h2>
                <div className="flex gap-2">
                    <button 
                        onClick={() => scroll('left')}
                        className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-[#0c4a9e] hover:text-white transition-all shadow-sm"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button 
                        onClick={() => scroll('right')}
                        className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-[#0c4a9e] hover:text-white transition-all shadow-sm"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div 
                ref={scrollRef}
                className="flex gap-4 overflow-x-auto no-scrollbar scroll-smooth pb-4 px-1"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {products.map((product) => (
                    <div key={product.id} className="min-w-[160px] sm:min-w-[200px] max-w-[200px]">
                        <ProductCard product={product} />
                    </div>
                ))}
            </div>
        </section>
    );
}
