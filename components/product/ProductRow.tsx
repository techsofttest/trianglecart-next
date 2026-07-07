'use client';

import { useEffect, useMemo, useRef } from 'react';
import ProductCard, { Product } from './ProductCard';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface ProductRowProps {
    title: string;
    products: Product[];
    viewAllLink?: string;
}

export default function ProductRow({ title, products, viewAllLink }: ProductRowProps) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const rafRef = useRef<number | null>(null);
    const pausedRef = useRef(false);
    const normalizedProducts = useMemo(() => products ?? [], [products]);

    const loopedProducts = useMemo(() => {
        if (normalizedProducts.length === 0) return [];
        return [...normalizedProducts, ...normalizedProducts];
    }, [normalizedProducts]);

    useEffect(() => {
        const el = scrollRef.current;
        if (!el || normalizedProducts.length === 0) return;

        const speed = 0.45;

        const tick = () => {
            if (!pausedRef.current) {
                el.scrollLeft += speed;

                const halfWidth = el.scrollWidth / 2;
                if (el.scrollLeft >= halfWidth) {
                    el.scrollLeft -= halfWidth;
                }
            }

            rafRef.current = window.requestAnimationFrame(tick);
        };

        rafRef.current = window.requestAnimationFrame(tick);

        return () => {
            if (rafRef.current !== null) {
                window.cancelAnimationFrame(rafRef.current);
            }
        };
    }, [normalizedProducts.length]);

    if (!products || products.length === 0) return null;

    return (
        <section className="w-full bg-white rounded-2xl border border-gray-100/80 shadow-sm p-4 sm:p-6">
            {/* Header Section without line divider for a cleaner modern look */}
            <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-xl md:text-2xl font-extrabold text-gray-900 tracking-tight">{title}</h2>
                {viewAllLink && (
                    <Link 
                        href={viewAllLink} 
                        className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 bg-gray-50 rounded-full text-gray-700 group hover:bg-[#0c4a9e] hover:text-white transition-all duration-300 border border-gray-100 shadow-sm"
                        aria-label={`View all in ${title}`}
                    >
                        <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                )}
            </div>

            {/* Infinite auto-scrolling track */}
            <div
                ref={scrollRef}
                className="flex gap-3 sm:gap-4 overflow-x-auto no-scrollbar scroll-smooth pb-2 px-1"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                onMouseEnter={() => {
                    pausedRef.current = true;
                }}
                onMouseLeave={() => {
                    pausedRef.current = false;
                }}
            >
                <style jsx global>{`
                    .no-scrollbar::-webkit-scrollbar {
                        display: none;
                    }
                `}</style>

                {loopedProducts.map((product, index) => (
                    <div
                        key={`${product.id}-${index}`}
                        className="shrink-0 w-[78%] sm:w-[48%] md:w-[32%] lg:w-[20%] xl:w-[20%]"
                    >
                        <ProductCard product={product} />
                    </div>
                ))}
            </div>
        </section>
    );
}
