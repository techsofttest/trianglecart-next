'use client';

import React, { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';
import { useCustomerAuth } from '@/context/CustomerAuthContext';
import { useWishlist } from '@/context/WishlistContext';
import { showLoginRequiredToast } from '@/utils/toast';
import { resolveProductImageUrl } from '@/lib/product';
import ProductNotice from './ProductNotice';

interface ProductGalleryProps {
    images: string[];
    title: string;
    id: string | number;
    product: any;
}

export default function ProductGallery({ images, title, id, product }: ProductGalleryProps) {
    const [selectedImage, setSelectedImage] = useState(0);
    const { isInWishlist, toggleWishlist } = useWishlist();
    const { isAuthenticated } = useCustomerAuth();
    const isWishlisted = isAuthenticated && isInWishlist(id);
    
    const [isMobile, setIsMobile] = useState(false);
    const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
    const [isZooming, setIsZooming] = useState(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(max-width: 767.98px)');
        const updateIsMobile = () => setIsMobile(mediaQuery.matches);

        updateIsMobile();
        mediaQuery.addEventListener('change', updateIsMobile);
        return () => mediaQuery.removeEventListener('change', updateIsMobile);
    }, []);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (isMobile) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        setZoomPos({ x, y });
    };

    return (
        <div className="flex flex-col gap-4">
            {/* Main Image */}
            <div className="w-full">
                <div 
                    className={`relative aspect-[5/4] md:aspect-[4/3] lg:aspect-[5/4] bg-gray-50 rounded-2xl overflow-hidden group border border-gray-100 ${isMobile ? 'cursor-auto' : 'cursor-zoom-in'}`}
                    onMouseEnter={() => !isMobile && setIsZooming(true)}
                    onMouseLeave={() => !isMobile && setIsZooming(false)}
                    onMouseMove={handleMouseMove}
                >
                    <img 
                        src={resolveProductImageUrl(images[selectedImage])} 
                        alt={title} 
                        className={`w-full h-full object-contain p-4 md:p-6 transition-transform duration-200 ease-out`}
                        style={{
                            transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                            transform: isZooming ? 'scale(2.5)' : 'scale(1)'
                        }}
                    />
                    {isAuthenticated ? (
                        <button 
                            type="button"
                            onClick={() => toggleWishlist(product)}
                            className={`absolute top-4 right-4 p-2.5 rounded-full shadow-lg transition-all active:scale-125 border-2 z-10 ${
                                isWishlisted ? 'bg-red-600 text-white border-red-600' : 'bg-white text-gray-400 hover:text-red-600 border-gray-100 hover:border-red-600'
                            }`}
                        >
                            <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={() => showLoginRequiredToast()}
                            className="absolute top-4 right-4 p-2.5 rounded-full shadow-lg transition-all active:scale-125 border-2 z-10 bg-white text-gray-400 hover:text-red-600 border-gray-100 hover:border-red-600"
                        >
                            <Heart className="w-5 h-5" />
                        </button>
                    )}
                </div>
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
                <div
                    className="flex flex-nowrap gap-2 overflow-x-auto pb-1 w-full"
                    style={{
                        WebkitOverflowScrolling: 'touch',
                        width: '100%',
                    }}
                >
                    {images.map((img, idx) => (
                        <button
                            key={idx}
                            onClick={() => setSelectedImage(idx)}
                            className={`shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 ${
                                selectedImage === idx
                                    ? 'border-[#0c4a9e]'
                                    : 'border-gray-100 hover:border-gray-200'
                            }`}
                        >
                            <img
                                src={resolveProductImageUrl(img)}
                                alt=""
                                className="block w-full h-full object-cover"
                            />
                        </button>
                    ))}
                </div>
            )}

            {/* Product Notice - Desktop only */}
            <div className="hidden md:block">
                <ProductNotice />
            </div>
            
        </div>
    );
}
