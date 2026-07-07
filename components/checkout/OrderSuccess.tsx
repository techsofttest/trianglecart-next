'use client';

import React from 'react';
import Link from 'next/link';
import { CheckCircle2, ShoppingBag, ClipboardList } from 'lucide-react';

export default function OrderSuccess({ orderNumber }: { orderNumber?: string }) {
    const displayOrder = orderNumber ? `#${orderNumber}` : `#TR-${Math.floor(Math.random() * 1000000)}`;
    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 text-center animate-in zoom-in-95 duration-500">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6">
                <CheckCircle2 className="w-12 h-12 text-green-500" />
            </div>
            <h1 className="text-3xl font-medium text-gray-900 mb-2">Payment Successful!</h1>
            <p className="text-gray-500 max-w-md mb-2 font-medium">
                Thank you for your purchase. Your order {displayOrder} has been placed and payment has been confirmed.
            </p>
            <p className="text-sm text-gray-400 max-w-md mb-8">
                You will receive a confirmation email shortly. Your order status will be updated once payment is fully processed.
            </p>
            <div className="flex gap-4">
                <Link
                    href="/"
                    className="bg-[#0c4a9e] text-white px-8 py-3 rounded-xl font-medium hover:bg-blue-800 transition-all flex items-center gap-2"
                >
                    <ShoppingBag className="w-4 h-4" />
                    Continue Shopping
                </Link>
                <Link
                    href="/profile?tab=orders"
                    className="border border-gray-200 text-gray-700 px-8 py-3 rounded-xl font-medium hover:bg-gray-50 transition-all flex items-center gap-2"
                >
                    <ClipboardList className="w-4 h-4" />
                    View Orders
                </Link>
            </div>
        </div>
    );
}

