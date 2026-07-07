'use client';

import React from 'react';

export type ProductVariant = {
    id: number;
    sku: string | null;
    unit: string | null;
    size: string | null;
    price: number;
    stock: number;
};

interface VariantSelectorProps {
    variants: ProductVariant[];
    selectedVariantId: number | null;
    onSelectVariant: (variant: ProductVariant) => void;
}

const formatLabel = (variant: ProductVariant) => {
    const size = [variant.size, variant.unit].filter(Boolean).join(' ');
    return size || variant.sku || `Variant ${variant.id}`;
};

export default function VariantSelector({ variants, selectedVariantId, onSelectVariant }: VariantSelectorProps) {
    if (!variants.length) return null;

    return (
        <div className="space-y-3">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">Pack Size</label>
            <div className="flex flex-wrap gap-2">
                {variants.map((variant) => {
                    const active = selectedVariantId === variant.id;
                    const outOfStock = variant.stock <= 0;

                    return (
                        <button
                            key={variant.id}
                            type="button"
                            onClick={() => onSelectVariant(variant)}
                            disabled={outOfStock}
                            className={`px-4 py-2.5 rounded-xl border-2 font-semibold text-[13px] transition-all ${
                                active
                                    ? 'border-[#0c4a9e] bg-[#0c4a9e]/5 text-[#0c4a9e]'
                                    : 'border-gray-100 text-gray-500 hover:border-gray-200'
                            } ${outOfStock ? 'opacity-50 cursor-not-allowed line-through' : ''}`}
                        >
                            {formatLabel(variant)}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
