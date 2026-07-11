'use client';

import React, { useEffect, useState } from 'react';
import { X, ShoppingBag, Trash2, ChevronRight, Plus, Minus, ShoppingCart, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { resolveProductImageUrl } from '@/lib/product';

export default function CartDrawer() {
    const { 
        cartItems, 
        isCartDrawerOpen, 
        closeCartDrawer, 
        removeFromCart, 
        updateQuantity, 
        cartTotal, 
        cartCount 
    } = useCart();
    
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        if (isCartDrawerOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isCartDrawerOpen]);

    if (!isMounted) return null;

    return (
        <>
            {/* Backdrop */}
            <div 
                className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] transition-opacity duration-500 ${
                    isCartDrawerOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
                onClick={closeCartDrawer}
            />

            {/* Drawer */}
            <div 
                className={`fixed top-0 right-0 h-full w-full max-w-[400px] bg-white z-[110] shadow-2xl transition-transform duration-500 transform ${
                    isCartDrawerOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
            >
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
                        <div className="flex items-center gap-3">
                            <div className="bg-[#0c4a9e]/10 p-2 rounded-xl">
                                <ShoppingBag className="w-5 h-5 text-[#0c4a9e]" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-gray-900 leading-none">Your Cart</h2>
                                <p className="text-sm text-gray-600 mt-1 font-medium">{cartCount} {cartCount === 1 ? 'item' : 'items'}</p>
                            </div>
                        </div>
                        <button 
                            onClick={closeCartDrawer}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors group"
                        >
                            <X className="w-5 h-5 text-gray-500 group-hover:text-gray-900 transition-colors" />
                        </button>
                    </div>

                    {/* Cart Items List */}
                    <div className="flex-1 overflow-y-auto p-5 scrollbar-hide">
                        {cartItems.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center">
                                    <ShoppingCart className="w-10 h-10 text-gray-200" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900">Your cart is empty</h3>
                                    <p className="text-sm text-gray-600 max-w-[200px] mx-auto mt-1">Looks like you haven't added anything to your cart yet.</p>
                                </div>
                                <button 
                                    onClick={closeCartDrawer}
                                    className="px-6 py-2.5 bg-[#0c4a9e] text-white rounded-xl font-bold text-sm shadow-lg shadow-[#0c4a9e]/20"
                                >
                                    Start Shopping
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {cartItems.map((item) => (
                                    <div key={item.id} className="flex gap-4 group">
                                        <div className="w-20 h-20 bg-gray-50 rounded-2xl p-2 flex items-center justify-center shrink-0 border border-transparent group-hover:border-[#0c4a9e]/20 transition-all">
                                            <img src={resolveProductImageUrl(item.image)} alt={item.name} className="max-w-full max-h-full object-contain" />
                                        </div>
                                        <div className="flex-1 min-w-0 py-1">
                                            <div className="flex justify-between items-start">
                                                <h4 className="font-semibold text-gray-900 text-sm line-clamp-1 leading-tight group-hover:text-[#0c4a9e] transition-colors">{item.name}</h4>
                                                <button 
                                                    onClick={() => removeFromCart(item.id)}
                                                    className="p-1 hover:text-red-500 transition-colors"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                            <p className="text-sm text-gray-600 mt-0.5">{item.brand} • {item.weight}</p>
                                            <div className="flex items-center justify-between mt-3">
                                                <div className="flex items-center gap-3 bg-gray-50 p-1 rounded-lg border border-gray-100">
                                                    <button 
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                        className="w-6 h-6 rounded-md bg-white flex items-center justify-center text-sm font-bold hover:bg-gray-100 transition-all shadow-sm"
                                                    >-</button>
                                                    <span className="w-4 text-center font-bold text-gray-700 text-sm">{item.quantity}</span>
                                                    <button 
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        className="w-6 h-6 rounded-md bg-white flex items-center justify-center text-sm font-bold hover:bg-gray-100 transition-all shadow-sm"
                                                    >+</button>
                                                </div>
                                                <p className="font-bold text-gray-900 text-sm">${(item.price * item.quantity).toFixed(2)}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    {cartItems.length > 0 && (
                        <div className="p-5 border-t border-gray-100 bg-gray-50/50 space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-600">Subtotal</span>
                                <span className="text-lg font-bold text-gray-900">${cartTotal.toFixed(2)}</span>
                            </div>
                            <div className="space-y-3">
                                <Link 
                                    href="/cart" 
                                    onClick={closeCartDrawer}
                                    className="w-full bg-[#0c4a9e] text-white font-bold py-4 rounded-2xl hover:bg-[#0a3d82] transition-all shadow-lg shadow-[#0c4a9e]/15 flex items-center justify-center gap-2 text-sm"
                                >
                                    Go to Shopping Cart
                                    <ChevronRight className="w-4 h-4" />
                                </Link>
                                <Link 
                                    href="/checkout" 
                                    onClick={closeCartDrawer}
                                    className="w-full bg-white border-2 border-[#0c4a9e] text-[#0c4a9e] font-bold py-4 rounded-2xl hover:bg-[#0c4a9e]/5 transition-all flex items-center justify-center text-sm uppercase tracking-widest gap-2"
                                >
                                    Proceed to Checkout
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
