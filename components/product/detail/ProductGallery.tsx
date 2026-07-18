'use client';

import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import { useWishlist } from '@/context/WishlistContext';
import { resolveProductImageUrl } from '@/lib/product';

interface ProductGalleryProps {
    images: string[];
    title: string;
    id: string | number;
    product: any;
}

export default function ProductGallery({ images, title, id, product }: ProductGalleryProps) {
    const [selectedImage, setSelectedImage] = useState(0);
    const { isInWishlist, toggleWishlist } = useWishlist();
    const isWishlisted = isInWishlist(id);
    
    // Zoom state
    const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
    const [isZooming, setIsZooming] = useState(false);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
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
                    className="relative aspect-[5/4] md:aspect-[4/3] lg:aspect-[5/4] bg-gray-50 rounded-2xl overflow-hidden group border border-gray-100 cursor-zoom-in"
                    onMouseEnter={() => setIsZooming(true)}
                    onMouseLeave={() => setIsZooming(false)}
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
                    <button 
                        onClick={() => toggleWishlist(product)}
                        className={`absolute top-4 right-4 p-2.5 rounded-full shadow-lg transition-all active:scale-125 border border-gray-100 z-10 ${
                            isWishlisted ? 'bg-red-50 text-red-500' : 'bg-white text-gray-400 hover:text-red-500'
                        }`}
                    >
                        <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                    </button>
                </div>
            </div>

            {/* Thumbnails */}
            <div className="flex gap-2 overflow-x-auto pb-1 min-w-0">
                {images.map((img, idx) => (
                    <button 
                        key={idx}
                        onClick={() => setSelectedImage(idx)}
                        className={`w-16 h-16 sm:w-20 sm:h-20 min-w-[4rem] min-h-[4rem] rounded-xl border-2 overflow-hidden transition-all flex-shrink-0 ${
                            selectedImage === idx ? 'border-[#0c4a9e]' : 'border-gray-100 hover:border-gray-200'
                        }`}
                    >
                        <img src={resolveProductImageUrl(img)} alt="" className="w-full h-full object-cover" />
                    </button>
                ))}
            </div>
        </div>
    );
}
