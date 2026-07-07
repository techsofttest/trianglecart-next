'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface EmptyCartProps {
    isLoggedIn: boolean;
}

export default function EmptyCart({ isLoggedIn }: EmptyCartProps) {
    const router = useRouter();

    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 animate-in fade-in duration-700">
            <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-6">
                <ShoppingBag className="w-10 h-10 text-[#0c4a9e]" />
            </div>
            <h1 className="text-2xl md:text-3xl font-medium text-gray-900 mb-2">Your cart is hungry</h1>
            <p className="text-gray-600 text-center max-w-md mb-8">
                Add items to your cart to start shopping. Your items will stay here until you're ready to checkout.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-xs">
                <Link
                    href="/"
                    className="flex-1 bg-[#0c4a9e] text-white font-medium py-4 rounded-xl shadow-lg shadow-blue-900/10 hover:bg-blue-800 transition-all text-center flex items-center justify-center"
                >
                    Start Shopping
                </Link>
            </div>
        </div>
    );
}
