'use client';

import React from 'react';
import { Heart, ShoppingBag } from 'lucide-react';
import { useWishlist } from '@/context/WishlistContext';
import ProductCard from '@/components/product/ProductCard';

export default function WishlistView() {
    const { wishlist } = useWishlist();

    if (wishlist.length === 0) {
        return (
            <div className="p-8 md:p-12 text-center py-24 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Heart className="w-8 h-8 text-gray-300" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Your wishlist is empty</h3>
                <p className="text-gray-500 mt-2 font-medium">Save items that you like to find them easily later.</p>
            </div>
        );
    }

    return (
        <div className="p-8 md:p-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center justify-between mb-10">
                <div>
                    <h3 className="text-2xl font-semibold text-gray-900 tracking-tight">My Wishlist</h3>
                    <p className="text-[14px] text-gray-500 mt-2 font-medium">You have {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {wishlist.map((product) => (
                    <ProductCard 
                        key={product.id} 
                        product={product} 
                        showRemoveButton={true} 
                    />
                ))}
            </div>
        </div>
    );
}
