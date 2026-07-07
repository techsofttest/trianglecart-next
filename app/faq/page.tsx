'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FAQ_DATA = [
    {
        category: "Orders & Delivery",
        questions: [
            {
                q: "What are your delivery hours?",
                a: "We deliver from 9:00 AM to 9:00 PM, seven days a week. Same-day delivery is available for orders placed before 4:00 PM."
            },
            {
                q: "Do you deliver to my suburb?",
                a: "We currently deliver to most metropolitan areas in Melbourne, Sydney, and Brisbane. You can check your postcode at the top of the page for specific availability."
            },
            {
                q: "Is there a minimum order value?",
                a: "Yes, the minimum order value for delivery is $30. Orders over $100 qualify for free standard shipping."
            }
        ]
    },
    {
        category: "Products & Quality",
        questions: [
            {
                q: "Are your Indian products authentic?",
                a: "Absolutely. We source our products directly from reputable manufacturers and authorized distributors in India to ensure 100% authenticity."
            },
            {
                q: "How do you ensure the freshness of vegetables?",
                a: "Our fresh produce is sourced daily from local markets and stored in temperature-controlled environments until the moment of delivery."
            }
        ]
    },
    {
        category: "Payments & Returns",
        questions: [
            {
                q: "What payment methods do you accept?",
                a: "We accept all major credit cards (Visa, Mastercard, Amex), PayPal, and Apple Pay for a secure and seamless checkout experience."
            },
            {
                q: "What is your return policy?",
                a: "If you're not satisfied with a product, you can return it within 7 days of delivery. For fresh items, please report any issues within 24 hours."
            }
        ]
    }
];

export default function FAQPage() {
    const [openIndex, setOpenIndex] = useState<string | null>("Orders & Delivery-0");

    const toggleFAQ = (id: string) => {
        setOpenIndex(openIndex === id ? null : id);
    };

    return (
        <div className="bg-white min-h-screen">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                
                {/* Header Section */}
                <div className="mb-16 border-b border-gray-100 pb-10">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4 tracking-tight">Frequently Asked Questions</h1>
                    <p className="text-[15px] text-gray-500 font-medium">
                        Everything you need to know about shopping with Triangle Cart.
                    </p>
                </div>

                <div className="space-y-12">
                    {FAQ_DATA.map((section, sIdx) => (
                        <div key={sIdx} className="space-y-6">
                            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
                                {section.category}
                            </h2>
                            <div className="divide-y divide-gray-200 border-t border-gray-200">
                                {section.questions.map((faq, qIdx) => {
                                    const id = `${section.category}-${qIdx}`;
                                    const isOpen = openIndex === id;
                                    return (
                                        <div key={qIdx} className="py-4">
                                            <button 
                                                onClick={() => toggleFAQ(id)}
                                                className="flex items-center justify-between w-full text-left group"
                                            >
                                                <span className={`text-[15px] font-semibold transition-colors ${isOpen ? 'text-[#0c4a9e]' : 'text-gray-700 group-hover:text-gray-900'}`}>
                                                    {faq.q}
                                                </span>
                                                {isOpen ? (
                                                    <ChevronUp className="w-4 h-4 text-[#0c4a9e]" />
                                                ) : (
                                                    <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
                                                )}
                                            </button>
                                            {isOpen && (
                                                <div className="mt-4 text-[14px] text-gray-500 leading-relaxed animate-in fade-in slide-in-from-top-2 duration-300">
                                                    {faq.a}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer / Contact */}
                <div className="mt-24 pt-16 border-t border-gray-100">
                    <p className="text-gray-500 text-[14px] text-center italic">
                        Can't find what you're looking for? <a href="/contact" className="text-[#0c4a9e] font-bold not-italic hover:underline ml-1">Contact our support team</a>
                    </p>
                </div>

            </div>
        </div>
    );
}
