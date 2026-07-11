'use client';

import React from 'react';
import { Tag, CreditCard, Lock, AlertTriangle, ShieldCheck } from 'lucide-react';
import CouponSection from '@/components/cart/CouponSection';

interface OrderSummarySidebarProps {
    subtotal: number;
    discount: number;
    shipping: number;
    tax: number;
    total: number;
    isAddressComplete: boolean;
    appliedCoupon: string | null;
    onApplyCoupon: (code: string, discount: number) => void;
    onRemoveCoupon: () => void;
    onPlaceOrder: () => void;
}

export default function OrderSummarySidebar({
    subtotal,
    discount,
    shipping,
    tax,
    total,
    isAddressComplete,
    appliedCoupon,
    onApplyCoupon,
    onRemoveCoupon,
    onPlaceOrder
}: OrderSummarySidebarProps) {
    return (
        <div className="space-y-4">
            <CouponSection
                appliedCoupon={appliedCoupon}
                onApply={onApplyCoupon}
                onRemove={onRemoveCoupon}
            />

            <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
                <h2 className="text-lg font-medium text-gray-900 mb-4 border-b border-gray-50 pb-3">Order Summary</h2>

                <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm font-medium text-gray-700">
                        <span>Subtotal</span>
                        <span className="text-gray-900">${subtotal.toFixed(2)}</span>
                    </div>
                    {discount > 0 && (
                        <div className="flex justify-between text-emerald-600 font-bold text-sm">
                            <span>Discount (SAVE10)</span>
                            <span>-${discount.toFixed(2)}</span>
                        </div>
                    )}
                    <div className="flex justify-between text-sm font-medium text-gray-700">
                        <span>Shipping</span>
                        <span className={shipping === 0 ? "text-green-600 font-bold" : "text-gray-900"}>
                            {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                        </span>
                    </div>

                    <div className="flex justify-between text-xl font-bold text-gray-900 pt-3 border-t border-gray-50">
                        <span>Total</span>
                        <span className="text-[#0c4a9e] tracking-tight">${total.toFixed(2)}</span>
                    </div>
                </div>

                

                <button
                    onClick={onPlaceOrder}
                    className={`w-full text-white font-medium py-4 rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2 mb-4 active:scale-[0.98] ${!isAddressComplete ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#0c4a9e] shadow-blue-900/10 hover:bg-blue-800'}`}
                >
                    <Lock className="w-4 h-4" /> Pay Now
                </button>

                {!isAddressComplete && (
                    <p className="text-sm text-red-600 flex items-center justify-center gap-1.5 text-center tracking-widest mb-4">
                        <AlertTriangle className="w-4 h-4" />
                        Complete delivery address to proceed
                    </p>
                )}

                <div className="flex items-center justify-center gap-2 text-sm text-gray-500 font-bold uppercase tracking-widest">
                    <ShieldCheck className="w-4 h-4" /> Secure SSL Checkout
                </div>
            </div>
        </div>
    );
}
