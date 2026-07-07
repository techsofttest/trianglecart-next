'use client';

import React from 'react';
import { ShieldCheck, Truck, RotateCcw, Zap } from 'lucide-react';

interface ProductFeaturesProps {
    highlights: string[];
    description: string;
}

export default function ProductFeatures({ highlights, description }: ProductFeaturesProps) {
    return (
        <div className="space-y-10">
            {/* Highlights */}
            <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 tracking-tight">Key Features</h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {highlights.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-[13px] text-gray-600 font-medium">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#0c4a9e] mt-1.5 flex-shrink-0 opacity-60" />
                            {item}
                        </li>
                    ))}
                </ul>
            </section>

            {/* Description */}
            <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 tracking-tight">About the Product</h3>
                <p className="text-[13px] text-gray-500 font-medium leading-relaxed max-w-3xl">
                    {description}
                </p>
            </section>

            {/* Trust Signals */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 py-10 border-y border-gray-100/50 bg-gray-50/20 rounded-3xl px-4">
                <div className="flex flex-col items-center text-center group">
                    <div className="w-12 h-12 bg-brand-orange/10 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                        <ShieldCheck className="w-6 h-6 text-brand-orange" />
                    </div>
                    <h4 className="text-[12px] font-bold text-gray-900 uppercase tracking-wider mb-1">Quality Assured</h4>
                    <p className="text-[10px] text-gray-400 font-medium leading-tight">100% Authentic Indian Products</p>
                </div>
                <div className="flex flex-col items-center text-center group">
                    <div className="w-12 h-12 bg-brand-orange/10 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                        <Truck className="w-6 h-6 text-brand-orange" />
                    </div>
                    <h4 className="text-[12px] font-bold text-gray-900 uppercase tracking-wider mb-1">Express Delivery</h4>
                    <p className="text-[10px] text-gray-400 font-medium leading-tight">Fast shipping across Australia</p>
                </div>
                <div className="flex flex-col items-center text-center group">
                    <div className="w-12 h-12 bg-brand-orange/10 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                        <RotateCcw className="w-6 h-6 text-brand-orange" />
                    </div>
                    <h4 className="text-[12px] font-bold text-gray-900 uppercase tracking-wider mb-1">Easy Returns</h4>
                    <p className="text-[10px] text-gray-400 font-medium leading-tight">Hassle-free 7-day return policy</p>
                </div>
                <div className="flex flex-col items-center text-center group">
                    <div className="w-12 h-12 bg-brand-orange/10 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                        <Zap className="w-6 h-6 text-brand-orange" />
                    </div>
                    <h4 className="text-[12px] font-bold text-gray-900 uppercase tracking-wider mb-1">Secure Checkout</h4>
                    <p className="text-[10px] text-gray-400 font-medium leading-tight">Fully encrypted payment gateway</p>
                </div>
            </div>
        </div>
    );
}
