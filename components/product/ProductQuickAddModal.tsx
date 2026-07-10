'use client';

import React, { useState } from 'react';
import { X, ShoppingCart } from 'lucide-react';
import { Product } from './ProductCard';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useRouter } from 'next/navigation';
import VariantSelector, { ProductVariant } from './VariantSelector';

interface ProductQuickAddModalProps {
    product: Product;
    isOpen: boolean;
    onClose: () => void;
}

export default function ProductQuickAddModal({ product, isOpen, onClose }: ProductQuickAddModalProps) {
    const [quantity, setQuantity] = useState(1);
    const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(product.variants?.[0] ?? null);
    const { addToCart, openCartDrawer } = useCart();
    const { toggleWishlist, isInWishlist } = useWishlist();
    const router = useRouter();

    if (!isOpen) return null;

    const selectedPrice = selectedVariant?.price ?? product.price;
    const selectedWeight = selectedVariant
        ? [selectedVariant.size, selectedVariant.unit].filter(Boolean).join(' ')
        : product.weight;
    const isOutOfStock = selectedVariant ? selectedVariant.stock <= 0 : false;
    const isWishlisted = isInWishlist(product.id);

    const handleAddToCart = () => {
        if (isOutOfStock) return;

        addToCart({
            ...product,
            name: product.title,
            weight: selectedWeight,
            selectedVariantId: selectedVariant?.id,
            selectedVariant,
        }, quantity);
        onClose();
        openCartDrawer();
    };

    const handleBuyNow = () => {
        if (isOutOfStock) return;
        onClose();
        const variantQuery = selectedVariant ? `&variantId=${selectedVariant.id}` : '';
        router.push(`/checkout?type=buynow&productId=${product.id}&qty=${quantity}${variantQuery}`);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-300">
                <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                    <h3 className="font-bold text-gray-900 tracking-tight">Quick Add</h3>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    <div className="flex gap-4">
                        <div className="w-20 h-20 bg-gray-50 rounded-2xl p-2 flex items-center justify-center shrink-0">
                            <img src={product.image} alt={product.title} className="max-w-full max-h-full object-contain" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-[10px] font-bold text-[#0c4a9e] uppercase tracking-widest mb-0.5">{product.brand}</p>
                            <h4 className="font-semibold text-gray-900 text-sm line-clamp-2 leading-tight mb-1">{product.title}</h4>
                            <p className="text-sm font-bold text-[#0c4a9e]">${selectedPrice.toFixed(2)}</p>
                        </div>
                    </div>

                    <VariantSelector
                        variants={product.variants || []}
                        selectedVariantId={selectedVariant?.id || null}
                        onSelectVariant={setSelectedVariant}
                    />

                    {selectedVariant && (
                        <div className="flex items-center justify-between text-xs">
                            <span className={`font-semibold ${isOutOfStock ? 'text-red-600' : 'text-green-600'}`}>
                                {isOutOfStock ? 'Out of stock' : `${selectedVariant.stock} in stock`}
                            </span>
                            <span className="text-gray-500">Selected: {selectedWeight}</span>
                        </div>
                    )}

                    <div className="space-y-3">
                        <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">Quantity</label>
                        <div className="flex items-center gap-4 w-max bg-gray-50/50 p-1 rounded-xl border border-gray-100">
                            <button
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-lg font-bold hover:bg-[#0c4a9e] hover:text-white transition-all shadow-sm border border-gray-100"
                            >
                                -
                            </button>
                            <span className="w-8 text-center font-bold text-gray-700 text-sm">{quantity}</span>
                            <button
                                onClick={() => setQuantity(quantity + 1)}
                                className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-lg font-bold hover:bg-[#0c4a9e] hover:text-white transition-all shadow-sm border border-gray-100"
                            >
                                +
                            </button>
                        </div>
                    </div>

                    <div className="space-y-3 pt-2">
                        <button
                            onClick={() => toggleWishlist(product)}
                            className="w-full bg-[#008446] text-white font-bold py-4 rounded-2xl hover:bg-[#008446]/90 transition-all shadow-lg shadow-[#008446]/15 flex items-center justify-center gap-2 text-sm"
                        >
                            {isWishlisted ? 'REMOVE FROM WISHLIST' : 'ADD TO WISHLIST'}
                        </button>
                        <button
                            onClick={handleAddToCart}
                            disabled={isOutOfStock}
                            className="w-full bg-white border-2 border-[#008446] disabled:border-gray-300 disabled:text-gray-400 disabled:cursor-not-allowed text-[#008446] font-bold py-4 rounded-2xl hover:bg-[#008446]/5 transition-all flex items-center justify-center gap-2 text-sm"
                        >
                            <ShoppingCart className="w-4 h-4" />
                            {isOutOfStock ? 'OUT OF STOCK' : 'ADD TO CART'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
