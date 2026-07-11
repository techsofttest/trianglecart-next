'use client';

import React, { useState } from 'react';
import { Ticket, X } from 'lucide-react';
import { apiUrl } from '@/lib/api';

interface CouponSectionProps {
    appliedCoupon: string | null;
    onApply: (code: string, discount: number) => void;
    onRemove: () => void;
}

export default function CouponSection({ appliedCoupon, onApply, onRemove }: CouponSectionProps) {
    const [coupon, setCoupon] = useState('');
    const [error, setError] = useState('');
    const [isApplying, setIsApplying] = useState(false);

    const handleApply = async () => {
        const trimmed = coupon.trim();
        if (!trimmed) return;

        setIsApplying(true);
        setError('');

        try {
            const response = await fetch(apiUrl('/api/coupons/validate'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ coupon_code: trimmed, subtotal: 1000 }),
            });

            const data = await response.json();

            if (response.ok && data.valid) {
                onApply(data.coupon.coupon_code, Number(data.discount || 0));
            } else {
                setError(data.message || 'Invalid coupon code');
            }
        } catch {
            setError('Unable to validate coupon right now');
        } finally {
            setIsApplying(false);
        }
    };

    const handleRemove = () => {
        onRemove();
        setCoupon('');
    };

    return (
        <div className="bg-white rounded-3xl border border-gray-100 p-4 sm:p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
                <Ticket className="w-5 h-5 text-[#0c4a9e]" />
                <h3 className="font-semibold text-gray-900 text-sm uppercase tracking-wider">Coupons & Offers</h3>
            </div>

            {!appliedCoupon ? (
                <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row gap-2">
                        <input
                            type="text"
                            value={coupon}
                            onChange={(e) => setCoupon(e.target.value)}
                            placeholder="Enter coupon code"
                            className="flex-1 bg-gray-50 border border-gray-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-all placeholder:text-gray-400"
                        />
                        <button
                            onClick={handleApply}
                            disabled={!coupon.trim() || isApplying}
                            className="bg-[#0c4a9e] text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-blue-800 transition-all disabled:opacity-50 uppercase tracking-widest"
                        >
                            {isApplying ? 'Checking...' : 'Apply'}
                        </button>
                    </div>
                    {error && <p className="text-sm text-red-600 font-bold ml-1 animate-pulse">{error}</p>}
                    
                </div>
            ) : (
                <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-4 flex items-center justify-between animate-in zoom-in-95 duration-300">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 shadow-sm">
                            <Ticket className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-emerald-700 uppercase tracking-wider"></p>
                            <p className="text-sm text-emerald-600 font-medium"></p>
                        </div>
                    </div>
                    <button
                        onClick={handleRemove}
                        className="p-2 hover:bg-emerald-100 rounded-full transition-colors text-emerald-400 hover:text-emerald-600"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
            )}
        </div>
    );
}
