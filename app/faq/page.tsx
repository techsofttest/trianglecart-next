import React from 'react';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import { fetchStorefront } from '@/lib/storefront';
import FAQAccordion from './FAQAccordion';

interface FaqItem {
    id: number;
    question: string;
    answer: string;
}

export const revalidate = 60;

export default async function FAQPage() {
    const faqs = await fetchStorefront<FaqItem[]>('/api/storefront/faqs') || [];

    const breadcrumbItems = [
        { label: 'Home', href: '/' },
        { label: 'FAQ' }
    ];

    return (
        <div className="bg-white min-h-screen">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
                
                {/* Breadcrumbs */}
                <Breadcrumbs items={breadcrumbItems} />

                {/* Header Section */}
                <div className="mt-6 mb-12 border-b border-gray-100 pb-10">
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight mb-4">Frequently Asked Questions</h1>
                    <p className="text-[15px] text-gray-500 font-medium">
                        Everything you need to know about shopping, delivery, payments, and quality at Triangle Cart.
                    </p>
                </div>

                {/* FAQ Accordion */}
                <FAQAccordion faqs={faqs} />

                {/* Contact CTA */}
                <div className="mt-16 p-8 bg-gray-50/50 rounded-3xl border border-gray-100 text-center space-y-4">
                    <h3 className="text-lg font-bold text-gray-950">Still have questions?</h3>
                    <p className="text-sm text-gray-500 max-w-sm mx-auto font-medium leading-relaxed">
                        If you can't find what you are looking for in our FAQs, please contact our support team.
                    </p>
                    <div className="pt-2">
                        <a 
                            href="/contact" 
                            className="inline-flex items-center justify-center px-5 py-2.5 bg-[#0c4a9e] text-white text-sm font-semibold rounded-xl hover:bg-opacity-90 shadow-sm transition"
                        >
                            Contact Support
                        </a>
                    </div>
                </div>

            </div>
        </div>
    );
}
