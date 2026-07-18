'use client';

import React from 'react';
import { Lock, AlertTriangle, ShieldCheck, Loader2 } from 'lucide-react';
import CouponSection from '@/components/cart/CouponSection';

interface OrderSummarySidebarProps {
    subtotal: number;
    discount: number;
    shipping: number | null;
    tax: number;
    total: number;
    isAddressComplete: boolean;
    appliedCoupon: string | null;
    onApplyCoupon: (code: string, discount: number) => void;
    onRemoveCoupon: () => void;
    onPlaceOrder: () => void;
    checkoutErrors?: string[];
    isPlacingOrder?: boolean;
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
    onPlaceOrder,
    checkoutErrors = [],
    isPlacingOrder = false
}: OrderSummarySidebarProps) {
    return (
        <div className="space-y-4">
            <CouponSection
                appliedCoupon={appliedCoupon}
                appliedDiscount={discount}
                subtotal={subtotal}
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
                            <span>Discount ({appliedCoupon || 'Coupon'})</span>
                            <span>-${discount.toFixed(2)}</span>
                        </div>
                    )}
                    <div className="flex justify-between text-sm font-medium text-gray-700">
                        <span>Shipping</span>
                        <span className={shipping === 0 ? "text-green-600 font-bold" : "text-gray-900"}>
                            {shipping === null ? '-' : (shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`)}
                        </span>
                    </div>

                    <div className="flex justify-between text-xl font-bold text-gray-900 pt-3 border-t border-gray-50">
                        <span>Total</span>
                        <span className="text-[#0c4a9e] tracking-tight">${total.toFixed(2)}</span>
                    </div>
                </div>

                <button
                    onClick={onPlaceOrder}
                    disabled={!isAddressComplete || isPlacingOrder}
                    className={`w-full text-white font-medium py-4 rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2 mb-4 active:scale-[0.98] ${!isAddressComplete || isPlacingOrder ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#0c4a9e] shadow-blue-900/10 hover:bg-blue-800'}`}
                >
                    {isPlacingOrder ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" /> Processing...
                        </>
                    ) : (
                        <>
                            <Lock className="w-4 h-4" /> Pay Now
                        </>
                    )}
                </button>

                {checkoutErrors && checkoutErrors.length > 0 && (
                    <div className="text-sm text-red-600 flex flex-col items-center justify-center gap-1.5 text-center tracking-widest mb-4">
                        {checkoutErrors.map((err, idx) => (
                            <p key={idx} className="flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4" />
                                <span>{err}</span>
                            </p>
                        ))}
                    </div>
                )}

                <div className="flex items-center justify-center gap-2 text-sm text-gray-500 font-bold uppercase tracking-widest">
                    <ShieldCheck className="w-4 h-4" /> Secure SSL Checkout
                </div>
            </div>
        </div>
    );
}
