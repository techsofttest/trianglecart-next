import React from 'react';

export default function ProductSkeleton() {
    return (
        <div className="bg-white rounded-xl border border-gray-100 p-3 flex flex-col h-full animate-pulse">
            {/* Image Placeholder */}
            <div className="relative w-full aspect-square bg-gray-100 rounded-lg mb-3 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
            </div>

            {/* Brand Placeholder */}
            <div className="h-3 w-1/3 bg-gray-100 rounded mb-2" />

            {/* Title Placeholder */}
            <div className="h-4 w-full bg-gray-100 rounded mb-1" />
            <div className="h-4 w-2/3 bg-gray-100 rounded mb-3" />

            {/* Price & Rating Placeholder */}
            <div className="mt-auto pt-3 border-t border-gray-50 flex items-center justify-between">
                <div className="h-5 w-1/4 bg-gray-100 rounded" />
                <div className="h-5 w-1/4 bg-gray-100 rounded" />
            </div>
        </div>
    );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
            {Array.from({ length: count }).map((_, i) => (
                <ProductSkeleton key={i} />
            ))}
        </div>
    );
}
