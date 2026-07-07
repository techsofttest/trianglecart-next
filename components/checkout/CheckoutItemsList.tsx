'use client';

import React from 'react';
import { ShoppingBag, Minus, Plus } from 'lucide-react';

interface CheckoutItemsListProps {
    items: any[];
    onUpdateQuantity: (id: string, delta: number) => void;
}

export default function CheckoutItemsList({ items, onUpdateQuantity }: CheckoutItemsListProps) {
    return (
        <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
            <div className="p-4 border-b border-gray-50 bg-gray-50/30">
                <h3 className="font-medium text-gray-900 flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 text-[#0c4a9e]" /> Items in your order
                </h3>
            </div>
            {items.map((item, idx) => (
                <div key={item.id} className={`p-4 flex gap-4 ${idx !== items.length - 1 ? 'border-b border-gray-50' : ''}`}>
                    <div className="w-20 h-20 bg-gray-50 rounded-xl flex-shrink-0 p-2">
                        <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                    </div>
                    <div className="flex-1 min-w-0">
                                <div className="flex flex-col sm:flex-row justify-between items-start gap-1">
                                    <div>
                                        <p className="text-[10px] sm:text-xs font-bold text-[#0c4a9e] uppercase tracking-widest">{item.brand}</p>
                                        <h4 className="font-medium text-gray-900 text-xs sm:text-sm mb-0.5 sm:mb-1">{item.name}</h4>
                                        <p className="text-xs text-gray-600 font-medium">{item.weight}</p>
                                    </div>
                                    <p className="font-bold text-gray-900 text-sm sm:text-base">${(item.price * item.quantity).toFixed(2)}</p>
                                </div>

                        <div className="flex items-center gap-4 mt-3">
                            <div className="flex items-center gap-3 bg-gray-50 rounded-lg px-2 py-1 border border-gray-100">
                                <button
                                    onClick={() => onUpdateQuantity(item.id, -1)}
                                    className="p-1 hover:bg-white hover:shadow-sm rounded transition-all text-gray-600"
                                >
                                    <Minus className="w-3 h-3" />
                                </button>
                                <span className="font-bold text-gray-900 text-sm w-4 text-center">{item.quantity}</span>
                                <button
                                    onClick={() => onUpdateQuantity(item.id, 1)}
                                    className="p-1 hover:bg-white hover:shadow-sm rounded transition-all text-gray-600"
                                >
                                    <Plus className="w-3 h-3" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
