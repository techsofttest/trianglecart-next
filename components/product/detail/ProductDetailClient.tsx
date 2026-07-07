'use client';

import React, { useMemo, useState } from 'react';
import ProductActions from './ProductActions';
import VariantSelector, { ProductVariant } from '../VariantSelector';
import ProductFeatures from './ProductFeatures';
import ProductGallery from './ProductGallery';
import ProductInfo from './ProductInfo';

type ProductDetailClientProps = {
    product: {
        id: number;
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
    }), [product.id, product.slug, product.title, selectedPrice, selectedWeight, selectedVariant, selectedStock]);

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

                <div className="flex items-center justify-between text-sm">
                    <span className={`font-semibold ${selectedStock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {selectedStock > 0 ? `${selectedStock} in stock` : 'Out of stock'}
                    </span>
                    <span className="text-gray-500">{selectedWeight}</span>
                </div>

                <ProductFeatures
                    highlights={product.highlights}
                    description={product.description}
                />

                <ProductActions product={productForActions} quantity={1} />
            </div>
        </div>
    );
}
