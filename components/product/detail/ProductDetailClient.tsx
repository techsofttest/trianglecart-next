'use client';

import React, { useMemo, useState } from 'react';
import ProductActions from './ProductActions';
import VariantSelector, { ProductVariant } from '../VariantSelector';
import ProductFeatures from './ProductFeatures';
import ProductGallery from './ProductGallery';
import ProductInfo from './ProductInfo';

type ProductDetailClientProps = {
    product: {
        id: string | number;
        slug: string;
        title: string;
        brand: string;
        price: number;
        originalPrice: number;
        rating: number;
        reviews: number;
        description: string;
        highlights: string[];
        images: string[];
        variants: ProductVariant[];
    };
};

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
    const firstVariant = product.variants[0] ?? null;
    const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(firstVariant);
    const [quantity, setQuantity] = useState(1);

    const selectedPrice = selectedVariant?.price ?? product.price;
    const selectedStock = selectedVariant?.stock ?? 0;
    const selectedWeight = selectedVariant
        ? [selectedVariant.size, selectedVariant.unit].filter(Boolean).join(' ')
        : '1 unit';
    const discount = product.originalPrice > selectedPrice
        ? `${Math.max(1, Math.round((1 - (selectedPrice / product.originalPrice)) * 100))}%`
        : '0%';

    const productForActions = useMemo(() => ({
        id: product.id,
        slug: product.slug,
        title: product.title,
        price: selectedPrice,
        weight: selectedWeight,
        selectedVariantId: selectedVariant?.id,
        selectedVariant,
        stock: selectedStock,
        image: product.images?.[0] || '',
        brand: product.brand,
    }), [product.id, product.slug, product.title, selectedPrice, selectedWeight, selectedVariant, selectedStock, product.images, product.brand]);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
            <div className="lg:col-span-6">
                <div className="lg:sticky lg:top-24">
                    <ProductGallery
                        images={product.images}
                        title={product.title}
                        id={product.id}
                        product={productForActions}
                    />
                </div>
            </div>

            <div className="lg:col-span-6 space-y-8">
                <ProductInfo
                    brand={product.brand}
                    title={product.title}
                    rating={product.rating}
                    reviews={product.reviews}
                    price={selectedPrice}
                    originalPrice={product.originalPrice}
                    discount={discount}
                />

                <VariantSelector
                    variants={product.variants}
                    selectedVariantId={selectedVariant?.id || null}
                    onSelectVariant={setSelectedVariant}
                />

                <div className="space-y-3 pt-2">
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

                <ProductFeatures
                    highlights={product.highlights}
                    description={product.description}
                />

                <ProductActions product={productForActions} quantity={quantity} />
            </div>
        </div>
    );
}
