'use client';

import React from 'react';
import { CreditCard, Banknote } from 'lucide-react';

interface PaymentMethodSectionProps {
    paymentMethod: string;
    setPaymentMethod: (method: string) => void;
}

export default function PaymentMethodSection({ paymentMethod, setPaymentMethod }: PaymentMethodSectionProps) {
    return (
        <section className="bg-white rounded-3xl border border-gray-100 p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center text-[#0c4a9e]">
                    <CreditCard className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-medium text-gray-900">Payment Method</h2>
            </div>

            <div className="grid grid-cols-1 gap-3">
                <div className="flex items-center justify-between p-4 rounded-2xl border-2 border-[#0c4a9e] bg-blue-50/10 shadow-sm">
                    <div className="flex items-center gap-3">
                        <input
                            type="radio"
                            name="payment"
                            checked={true}
                            readOnly={true}
                            className="w-4 h-4 text-[#0c4a9e]"
                        />
                        <div>
                            <p className="text-sm font-bold text-gray-900">Online Payment Only</p>
                            <p className="text-sm text-gray-600 font-medium">Credit/Debit Card</p>
                        </div>
                    </div>
                    <CreditCard className="w-5 h-5 text-[#0c4a9e]" />
                </div>
            </div>
        </section>
    );
}
