'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Store, Package } from 'lucide-react';

type Category = {
    id: number;
    name: string;
    slug: string;
    image_url: string | null;
    icon_url: string | null;
};

interface CategoryStripProps {
    categories: Category[];
}

export default function CategoryStrip({ categories }: CategoryStripProps) {
    const categoryNavRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    const navItems = [
        {
            id: -1,
            name: 'All Products',
            slug: 'products',
            icon_url: null,
        },
        ...categories,
    ];

    const handleMouseDown = (e: React.MouseEvent) => {
        if (!categoryNavRef.current) return;
        setIsDragging(true);
        setStartX(e.pageX - categoryNavRef.current.offsetLeft);
        setScrollLeft(categoryNavRef.current.scrollLeft);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging || !categoryNavRef.current) return;
        e.preventDefault();
        const x = e.pageX - categoryNavRef.current.offsetLeft;
        const walk = (x - startX) * 2;
        categoryNavRef.current.scrollLeft = scrollLeft - walk;
    };

    const handleMouseUpOrLeave = () => {
        setIsDragging(false);
    };

    const scrollCategories = (direction: 'left' | 'right') => {
        if (categoryNavRef.current) {
            const scrollAmount = 300;
            categoryNavRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    return (
        <div className="w-full relative group/carousel rounded-2xl shadow-md bg-white border border-gray-200 py-2 px-2 md:py-3 md:px-4">
            <div className="relative flex items-center justify-center">
                {/* Left Scroll Button */}
                <button
                    onClick={() => scrollCategories('left')}
                    className="absolute left-0 z-10 p-1.5 bg-brand-orange hover:bg-white border border-brand-orange rounded-full shadow-md text-white hover:text-brand-orange opacity-10 group-hover/carousel:opacity-100 transition-opacity"
                >
                    <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
                </button>

                {/* Draggable Carousel Container */}
                <div
                    ref={categoryNavRef}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUpOrLeave}
                    onMouseLeave={handleMouseUpOrLeave}
                    className={`flex items-center gap-2 overflow-x-auto scrollbar-hide scroll-smooth select-none w-full ${
                        isDragging ? 'cursor-grabbing' : 'cursor-grab'
                    }`}
                >
                    {navItems.map((cat) => {
                        const isAllProducts = cat.slug === 'products';
                        const href = isAllProducts ? '/products' : `/category/${cat.slug}`;

                        return (
                            <Link
                                key={cat.id}
                                href={href}
                                className="transition group flex-shrink-0 flex flex-col items-center justify-center px-2 md:px-4 pb-1 md:min-w-[100px] border-b-2 border-transparent hover:border-white"
                            >
                                <div className="transition p-2 rounded-xl text-brand-orange group-hover:text-green-800 group-hover:bg-white bg-white/10 mb-1">
                                    {isAllProducts ? (
                                        <Store className="w-6 h-6 md:w-10 md:h-10" />
                                    ) : cat.icon_url ? (
                                        <img src={cat.icon_url} alt={cat.name} className="w-6 h-6 md:w-10 md:h-10 object-contain filter brightness-100 group-hover:brightness-100" />
                                    ) : (
                                        <Package className="w-6 h-6 md:w-10 md:h-10" />
                                    )}
                                </div>
                                <span className="tracking-tight transition whitespace-nowrap text-[9px] md:text-[12px] font-bold">
                                    {cat.name}
                                </span>
                            </Link>
                        );
                    })}
                </div>

                {/* Right Scroll Button */}
                <button
                    onClick={() => scrollCategories('right')}
                    className="absolute right-0 z-10 p-1.5 bg-brand-orange hover:bg-white border border-brand-orange rounded-full shadow-md text-white hover:text-brand-orange opacity-10 group-hover/carousel:opacity-100 transition-opacity"
                >
                    <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
                </button>
            </div>
        </div>
    );
}
