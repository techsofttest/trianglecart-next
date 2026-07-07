'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const mockSlides = [
    {
        id: 1,
        image: '/promo-banner/pr1.jpg',
        link: '/offers/street-food',
    },
    {
        id: 2,
        image: '/promo-banner/pr2.jpg',
        link: '/offers/grocery-deals',
    },
    {
        id: 3,
        image: '/promo-banner/pr3.jpg',
        link: '/category/fruits-vegetables',
    },
    {
        id: 4,
        image: '/promo-banner/pr4.jpg',
        link: '/category/snacks-chips',
    },
    {
        id: 5,
        image: '/promo-banner/pr5.jpg',
        link: '/category/dairy',
    }
];

interface BannerItem {
    id: number;
    image_url: string | null;
    url: string | null;
}

interface PromoSliderProps {
    banners?: BannerItem[];
}

export default function PromoSlider({ banners }: PromoSliderProps) {
    const [slides, setSlides] = useState<{ id: number; image_url: string; url: string }[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        if (banners && banners.length > 0) {
            setSlides(banners.map((b) => ({
                id: b.id,
                image_url: b.image_url || '/promo-banner/pr1.jpg',
                url: b.url || '#'
            })));
        } else {
            setSlides(mockSlides.map(s => ({
                id: s.id,
                image_url: s.image,
                url: s.link
            })));
        }
    }, [banners]);

    const nextSlide = useCallback(() => {
        if (slides.length === 0) return;
        setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, [slides]);

    const prevSlide = () => {
        if (slides.length === 0) return;
        setCurrentIndex((prevIndex) => (prevIndex - 1 + slides.length) % slides.length);
    };

    const goToSlide = (index: number) => {
        setCurrentIndex(index);
    };

    // Auto-play logic (slides every 5 seconds, pauses on hover)
    useEffect(() => {
        if (isHovered || slides.length === 0) return;
        const timer = setInterval(() => {
            nextSlide();
        }, 5000);
        return () => clearInterval(timer);
    }, [isHovered, nextSlide, slides]);

    if (slides.length === 0) return null;

    return (
        <div
            className="relative w-full aspect-[21/9] sm:aspect-[24/9] md:aspect-[28/9] max-h-[250px] rounded-3xl overflow-hidden shadow-md group border border-gray-100"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Slider Track */}
            <div
                className="flex w-full h-full transition-transform duration-500 ease-out"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
                {slides.map((slide) => (
                    // Entire slide content wrapped in a fully clickable link
                    <Link
                        key={slide.id}
                        href={slide.url}
                        className="w-full h-full flex-shrink-0 relative block"
                    >
                        <div className="w-full h-full relative bg-gray-50">
                            <img
                                src={slide.image_url}
                                alt={`Promo Banner ${slide.id}`}
                                className="object-cover w-full h-full"
                            />
                        </div>

                        {/* Visual feedback on hover for full slide clickability */}
                        <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                    </Link>
                ))}
            </div>

            {/* Left Navigation Arrow */}
            <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 bg-white/90 hover:bg-white text-gray-800 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-md focus:outline-none z-10"
                aria-label="Previous Slide"
            >
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 pr-0.5" />
            </button>

            {/* Right Navigation Arrow */}
            <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 bg-white/90 hover:bg-white text-gray-800 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-md focus:outline-none z-10"
                aria-label="Next Slide"
            >
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 pl-0.5" />
            </button>

            {/* Pagination Dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 md:gap-2 z-10">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`transition-all duration-300 rounded-full ${currentIndex === index
                            ? 'bg-white w-5 h-1.5 md:w-6 md:h-2 shadow-sm'
                            : 'bg-white/50 w-1.5 h-1.5 md:w-2 md:h-2 hover:bg-white/80'
                            }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
}
