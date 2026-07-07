'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, Truck, Tag, CreditCard } from 'lucide-react';

interface CartSummaryProps {
    subtotal: number;
    discount: number;
    shipping: number;
    total: number;
}

export default function CartSummary({ subtotal, discount, shipping, total }: CartSummaryProps) {
    return (
        <div className="space-y-4">
            <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
                <h2 className="text-xl font-medium text-gray-900 mb-4 border-b border-gray-50 pb-3">Order Summary</h2>
                <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-gray-700 font-medium text-sm">
                        <span>Subtotal</span>
                        <span className="text-gray-900 font-bold">${subtotal.toFixed(2)}</span>
                    </div>
                    {discount > 0 && (
                        <div className="flex justify-between text-emerald-600 font-bold text-sm">
                            <span>Discount (SAVE10)</span>
                            <span>-${discount.toFixed(2)}</span>
                        </div>
                    )}
                    <div className="flex justify-between text-gray-700 font-medium text-sm">
                        <span>Shipping</span>
                        <span className="text-gray-500 font-medium text-[13px] italic">
                            Calculated at checkout
                        </span>
                    </div>
                    <div className="pt-3 border-t border-gray-100 flex justify-between items-end">
                        <div>
                            <p className="text-lg font-bold text-gray-900">Order Total</p>
                        </div>
                        <span className="text-3xl font-bold text-[#0c4a9e] tracking-tight">${total.toFixed(2)}</span>
                    </div>
                </div>

                
                <Link 
                    href="/checkout"
                    className="w-full bg-[#0c4a9e] text-white font-bold py-4 rounded-2xl shadow-xl shadow-blue-900/10 hover:bg-blue-800 hover:shadow-2xl transition-all active:scale-[0.98] flex items-center justify-center gap-3 group text-sm uppercase tracking-widest"
                >
                    Proceed to Checkout <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>

                <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-around gap-2">
                    <div className="flex flex-col items-center gap-1.5 text-center">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shadow-sm">
                            <ShieldCheck className="w-5 h-5 text-blue-600" />
                        </div>
                        <span className="text-sm text-gray-600 font-bold uppercase tracking-tight leading-tight max-w-[90px]">
                            Secure Payments
                        </span>
                    </div>
                    <div className="flex flex-col items-center gap-1.5 text-center">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shadow-sm">
                            <Truck className="w-5 h-5 text-blue-600" />
                        </div>
                        <span className="text-sm text-gray-600 font-bold uppercase tracking-tight leading-tight max-w-[90px]">
                            Express Delivery
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
