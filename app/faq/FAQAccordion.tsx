'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

interface FaqItem {
    id: number;
    question: string;
    answer: string;
}

interface FAQAccordionProps {
    faqs: FaqItem[];
}

export default function FAQAccordion({ faqs }: FAQAccordionProps) {
    const [openId, setOpenId] = useState<number | null>(faqs[0]?.id || null);

    const toggleFAQ = (id: number) => {
        setOpenId(openId === id ? null : id);
    };

    if (faqs.length === 0) {
        return (
            <div className="text-center py-12 bg-gray-50 rounded-3xl border border-gray-100 p-8">
                <HelpCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-base font-bold text-gray-900 mb-2">No FAQs available</h3>
                <p className="text-sm text-gray-500 font-medium">Please check back later as we update our help center.</p>
            </div>
        );
    }

    return (
        <div className="divide-y divide-gray-100 border-t border-b border-gray-100">
            {faqs.map((faq) => {
                const isOpen = openId === faq.id;
                return (
                    <div key={faq.id} className="py-5">
                        <button 
                            onClick={() => toggleFAQ(faq.id)}
                            className="flex items-center justify-between w-full text-left group focus:outline-none"
                        >
                            <span className={`text-[16px] font-semibold transition-colors ${isOpen ? 'text-[#0c4a9e]' : 'text-gray-800 group-hover:text-gray-950'}`}>
                                {faq.question}
                            </span>
                            <span className="flex-shrink-0 ml-4">
                                {isOpen ? (
                                    <ChevronUp className="w-5 h-5 text-[#0c4a9e]" />
                                ) : (
                                    <ChevronDown className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
                                )}
                            </span>
                        </button>
                        {isOpen && (
                            <div className="mt-3 text-[14px] text-gray-500 leading-relaxed font-medium transition-all duration-300">
                                {faq.answer}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
