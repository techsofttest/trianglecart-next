import React from 'react';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import { Truck, ShieldCheck, Heart, Sparkles } from 'lucide-react';

export default function AboutPage() {
    const breadcrumbItems = [
        { label: 'Home', href: '/' },
        { label: 'About Us' }
    ];

    const values = [
        {
            icon: <Truck className="w-6 h-6 text-[#0c4a9e]" />,
            title: "Prompt Local Delivery",
            description: "We dispatch orders swiftly using optimized routing to ensure your groceries and fresh produce reach your doorstep fresh and on time."
        },
        {
            icon: <ShieldCheck className="w-6 h-6 text-[#0c4a9e]" />,
            title: "Guaranteed Authenticity",
            description: "Directly sourced from trusted brands and distributors, we offer 100% genuine South Asian spices, ingredients, and everyday items."
        },
        {
            icon: <Heart className="w-6 h-6 text-[#0c4a9e]" />,
            title: "Community Focused",
            description: "Bridging the gap for communities across Australia by delivering taste of home and authentic culinary essentials."
        },
        {
            icon: <Sparkles className="w-6 h-6 text-[#0c4a9e]" />,
            title: "Freshness Commitment",
            description: "All fresh vegetables, herbs, and dairy items undergo strict quality checks before loading and delivery."
        }
    ];

    return (
        <div className="bg-white min-h-screen">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
                
                {/* Breadcrumbs */}
                <Breadcrumbs items={breadcrumbItems} />

                {/* Header Section */}
                <div className="mt-6 mb-16 border-b border-gray-100 pb-10">
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight mb-4">About Us</h1>
                    <p className="text-[16px] text-gray-500 font-medium max-w-2xl leading-relaxed">
                        Bringing authentic South Asian flavors and premium groceries straight to your home across Australia.
                    </p>
                </div>

                {/* Brand Story */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20">
                    <div className="lg:col-span-7 space-y-6">
                        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Our Story</h2>
                        <p className="text-[15px] text-gray-600 leading-relaxed font-medium">
                            Founded with a passion for quality and authentic heritage, Triangle Cart is Australia's premier online destination for Indian and South Asian groceries. We understand that food is more than sustenance—it is a connection to culture, family, and home.
                        </p>
                        <p className="text-[15px] text-gray-600 leading-relaxed font-medium">
                            What started as a vision to simplify grocery shopping has grown into a state-of-the-art logistics and storefront platform. We partner directly with premium brands and local growers to deliver everything from farm-fresh produce and artisanal flours to rare spices, traditional sweets, and daily household essentials.
                        </p>
                        <p className="text-[15px] text-gray-600 leading-relaxed font-medium">
                            With our advanced inventory system, expiration tracking safeguards, and temperature-controlled dispatch routing, we guarantee that you only receive the highest quality items, exactly when you expect them.
                        </p>
                    </div>
                    <div className="lg:col-span-5 flex flex-col justify-center bg-gray-50 p-8 rounded-3xl border border-gray-100">
                        <h3 className="text-sm font-bold text-[#0c4a9e] uppercase tracking-[0.2em] mb-4">Our Vision</h3>
                        <blockquote className="text-[17px] font-semibold text-gray-800 leading-relaxed italic mb-6">
                            "To make premium, authentic South Asian food products accessible, affordable, and easily deliverable to every household across Australia."
                        </blockquote>
                        <div className="border-t border-gray-200/60 pt-4">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Triangle Cart Team</p>
                        </div>
                    </div>
                </div>

                {/* Core Values */}
                <div className="space-y-10">
                    <div className="text-center lg:text-left">
                        <h2 className="text-2xl font-bold text-gray-900 tracking-tight mb-2">Our Core Values</h2>
                        <p className="text-sm text-gray-500 font-medium">What drives us to perform at our best every single day.</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {values.map((val, idx) => (
                            <div key={idx} className="flex gap-4 p-6 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                                <div className="p-3 bg-blue-50/50 rounded-xl h-fit">
                                    {val.icon}
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-[16px] font-bold text-gray-900">{val.title}</h3>
                                    <p className="text-sm text-gray-500 leading-relaxed font-medium">{val.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Call to Action */}
                <div className="mt-20 p-8 md:p-12 bg-gradient-to-r from-blue-50/30 via-white to-orange-50/20 rounded-3xl border border-gray-100 text-center space-y-6">
                    <h2 className="text-2xl font-bold text-gray-900">Ready to start shopping?</h2>
                    <p className="text-sm text-gray-500 font-medium max-w-md mx-auto leading-relaxed">
                        Explore our vast collection of fresh vegetables, high-quality spices, lentils, grains, and traditional South Asian brands.
                    </p>
                    <div>
                        <a 
                            href="/products" 
                            className="inline-flex items-center justify-center px-6 py-3 bg-[#0c4a9e] text-white text-sm font-semibold rounded-xl hover:bg-opacity-90 shadow-sm hover:shadow transition"
                        >
                            Browse Products
                        </a>
                    </div>
                </div>

            </div>
        </div>
    );
}
