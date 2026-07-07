'use client';

import React from 'react';
import { 
    CheckCircle2, ArrowRight, ShoppingBag, 
    Calendar, Clock, ShieldCheck 
} from 'lucide-react';

interface Product {
    id: number | string;
    name: string;
    image: string;
    brand: string;
}

interface ActionConfirmationProps {
    mode: 'return' | 'cancel';
    orderId: string;
    selectedItems: Product[];
    onClose: () => void;
}

export default function ActionConfirmation({ mode, orderId, selectedItems, onClose }: ActionConfirmationProps) {
    const isReturn = mode === 'return';

    return (
        <div className="animate-in fade-in zoom-in duration-500 max-w-3xl mx-auto py-12 px-2 md:px-4">
            {/* 1. Success Icon & Main Title */}
            <div className="text-center mb-10">
                <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-green-200">
                    <ShieldCheck className="w-12 h-12 text-green-700" />
                </div>
                <h2 className="text-2xl font-medium text-gray-900 mb-3 tracking-tight">
                    {isReturn ? 'Return Request Received' : 'Cancellation Confirmed'}
                </h2>
                <p className="text-sm text-gray-700 max-w-sm mx-auto leading-relaxed">
                    Request for Order <span className="font-medium text-gray-900">#{orderId}</span> has been successfully logged. 
                    Our support team is now processing your request.
                </p>
            </div>

            {/* 2. Summary Box */}
            <div className="bg-gray-50 border border-gray-200 rounded-3xl p-8 mb-8">
                <h3 className="text-sm font-medium text-gray-900 uppercase tracking-wider mb-6 pb-2 border-b border-gray-200">
                    Request Summary
                </h3>
                
                <div className="space-y-6">
                    {/* Items involved */}
                    <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shrink-0 shadow-sm border border-gray-100">
                            <ShoppingBag className="w-5 h-5 text-gray-400" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-900">Items {isReturn ? 'to Return' : 'Cancelled'}</p>
                            <div className="mt-3 flex flex-wrap gap-2">
                                {selectedItems.map(item => (
                                    <div key={item.id} className="w-10 h-10 bg-white rounded-lg p-1 border border-gray-100 shadow-sm">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply" />
                                    </div>
                                ))}
                                {selectedItems.length === 0 && <p className="text-sm text-gray-500">Full Order</p>}
                            </div>
                        </div>
                    </div>

                    {/* Timeline */}
                    <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shrink-0 shadow-sm border border-gray-100">
                            <Clock className="w-5 h-5 text-gray-400" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-900">Estimated Processing Time</p>
                            <p className="text-sm text-gray-700">24 - 48 business hours</p>
                        </div>
                    </div>

                    {/* Next Steps */}
                    <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shrink-0 shadow-sm border border-gray-100">
                            <Calendar className="w-5 h-5 text-gray-400" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-900">Next Steps</p>
                            <p className="text-sm text-gray-700">
                                {isReturn 
                                    ? "Wait for the approval email with return labels and instructions." 
                                    : "Refund (if applicable) will be credited back to your original payment method."}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. Actions */}
            <div className="space-y-4">
                <button 
                    onClick={onClose}
                    className="w-full bg-[#0c4a9e] text-white font-medium py-4 px-10 rounded-2xl hover:bg-blue-800 transition-all shadow-xl shadow-blue-900/20 active:scale-95 text-sm flex items-center justify-center gap-2 whitespace-nowrap"
                >
                    Back to Order Details
                    <ArrowRight className="w-4 h-4" />
                </button>
                <p className="text-center text-sm text-gray-500">
                    Need help? <a href="#" className="text-[#0c4a9e] underline underline-offset-4 font-medium">Contact Customer Support</a>
                </p>
            </div>
        </div>
    );
}
