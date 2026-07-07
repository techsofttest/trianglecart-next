'use client';

import React, { useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { Loader2, Lock, AlertCircle } from 'lucide-react';

interface StripePaymentFormProps {
    orderNumber: string;
    totalAmount: number;
    onPaymentSuccess?: () => void;
}

export default function StripePaymentForm({ orderNumber, totalAmount, onPaymentSuccess }: StripePaymentFormProps) {
    const stripe = useStripe();
    const elements = useElements();

    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setIsProcessing(true);
        setErrorMessage(null);

        // Confirm the payment using Stripe.js
        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: `${window.location.origin}/checkout?status=success&orderNumber=${orderNumber}`,
            },
        });

        // This point will only be reached if there is an immediate error when
        // confirming the payment. Otherwise, the customer will be redirected.
        if (error) {
            if (error.type === "card_error" || error.type === "validation_error") {
                setErrorMessage(error.message ?? 'An error occurred.');
            } else {
                setErrorMessage("An unexpected error occurred.");
            }
        }

        setIsProcessing(false);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center text-[#0c4a9e]">
                        <Lock className="w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">Secure Payment</h2>
                        <p className="text-xs text-gray-500 font-medium">Order: #{orderNumber}</p>
                    </div>
                </div>

                <PaymentElement options={{ layout: 'tabs' }} />

                {errorMessage && (
                    <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-2.5 text-red-700 text-xs font-semibold">
                        <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                        <span>{errorMessage}</span>
                    </div>
                )}

                <button
                    type="submit"
                    disabled={!stripe || isProcessing}
                    className="w-full mt-6 bg-[#0c4a9e] hover:bg-[#093a7d] disabled:bg-gray-200 text-white font-bold text-sm py-4 px-6 rounded-2xl shadow-md transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
                >
                    {isProcessing ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Processing Payment...
                        </>
                    ) : (
                        <>
                            <Lock className="w-4 h-4" />
                            Pay AUD ${(totalAmount).toFixed(2)} Now
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}
