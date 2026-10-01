'use client';

import React from 'react';
import { Trash2, Plus, Minus, Gift } from 'lucide-react';
import { resolveProductImageUrl } from '@/lib/product';

import { CartItem } from '@/context/CartContext';

interface CartItemProps {
    item: CartItem;
    onUpdateQuantity: (id: string, delta: number) => void;
    onRemove: (id: string) => void;
    isLast: boolean;
}

export default function CartItemCard({ item, onUpdateQuantity, onRemove, isLast }: CartItemProps) {
    const handleDecreaseQuantity = () => {
        if (item.is_free) return;
        if (item.quantity <= 1) {
            onRemove(item.id);
            return;
        }

        onUpdateQuantity(item.id, -1);
    };

    return (
        <div className={`p-4 flex flex-col sm:flex-row gap-4 ${!isLast ? 'border-b border-gray-50' : ''} ${item.is_free ? 'bg-amber-50/20' : ''}`}>
            <div className={`w-full sm:w-28 h-28 bg-gray-50 rounded-2xl flex items-center justify-center p-3 relative group shrink-0 ${!item.inStock ? 'grayscale' : ''}`}>
                <img src={resolveProductImageUrl(item.image)} alt={item.name} className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-500" />
                {item.is_free && (
                    <span className="absolute top-2 left-2 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                        <Gift className="w-3 h-3" /> FREE
                    </span>
                )}
            </div>
            <div className="flex-1 flex flex-col justify-between py-1">
                <div>
                    <div className="flex justify-between items-start mb-1">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <p className="text-[10px] font-medium text-[#0c4a9e] uppercase tracking-widest">{item.brand}</p>
                                {item.is_free ? (
                                    <span className="text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider bg-amber-100 text-amber-800 flex items-center gap-1">
                                        <Gift className="w-3 h-3" /> Promotional Free Item
                                    </span>
                                ) : (
                                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium uppercase tracking-wider ${item.inStock ? 'bg-blue-50 text-blue-600' : 'bg-red-50 text-red-500'}`}>
                                        {item.inStock ? 'In Stock' : 'Out of Stock'}
                                    </span>
                                )}
                            </div>
                            <h3 className="font-medium text-gray-900 leading-tight mb-1">{item.name}</h3>
                            <p className="text-xs text-gray-600 font-medium">{item.category} • {item.weight}</p>
                        </div>
                        <div className="text-right">
                            {item.is_free ? (
                                <p className="font-bold text-lg text-emerald-600">FREE</p>
                            ) : (
                                <p className="font-medium text-lg text-gray-900 ml-4">${(item.price * item.quantity).toFixed(2)}</p>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-3 mt-4">
                        {item.is_free ? (
                            <span className="text-xs font-semibold text-amber-700 bg-amber-100/60 px-3 py-1 rounded-xl">
                                Quantity: 1 (Promotional)
                            </span>
                        ) : (
                            <div className="flex items-center gap-4 bg-gray-50 rounded-xl px-2 py-1 border border-gray-100">
                                <button
                                    onClick={handleDecreaseQuantity}
                                    disabled={!item.inStock || item.quantity <= 1}
                                    className="p-1.5 hover:bg-white hover:shadow-sm rounded-lg transition-all text-gray-600 disabled:opacity-30"
                                >
                                    <Minus className="w-3 h-3" />
                                </button>
                                <span className="font-medium text-gray-900 w-4 text-center text-sm">{item.quantity}</span>
                                <button
                                    onClick={() => onUpdateQuantity(item.id, 1)}
                                    disabled={!item.inStock || item.quantity >= (item.selectedVariant?.stock ?? 9999)}
                                    className="p-1.5 hover:bg-white hover:shadow-sm rounded-lg transition-all text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                                >
                                    <Plus className="w-3 h-3" />
                                </button>
                            </div>
                        )}
                        {!item.inStock && !item.is_free && <span className="text-[11px] text-red-500 font-medium">Currently unavailable</span>}
                    </div>
                </div>

                {!item.is_free && (
                    <div className="flex items-center gap-4 mt-6">
                        <button
                            onClick={() => {
                                if (window.confirm(`Remove ${item.name} from your cart?`)) {
                                    onRemove(item.id);
                                }
                            }}
                            className="text-xs font-medium text-gray-600 hover:text-red-600 flex items-center gap-1.5 px-4 py-2 rounded-xl hover:bg-red-50 transition-all border border-transparent"
                        >
                            <Trash2 className="w-4 h-4" /> Remove
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
