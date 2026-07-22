'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Clock, AlertTriangle, Loader2 } from 'lucide-react';
import OrderSuccess from '@/components/checkout/OrderSuccess';
import { useCart } from '@/context/CartContext';
import { apiUrl } from '@/lib/api';

function CheckoutStatusContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { clearCart } = useCart();

    const [placedOrderNumber, setPlacedOrderNumber] = useState<string>('');
    const [isOrderPlaced, setIsOrderPlaced] = useState(false);
    const [paymentFailed, setPaymentFailed] = useState(false);
    const [paymentFailureMessage, setPaymentFailureMessage] = useState<string | null>(null);
    const [isPaymentStatusLoading, setIsPaymentStatusLoading] = useState(true);

    const processedRef = React.useRef(false);

    useEffect(() => {
        const status = searchParams.get('status');
        const redirectStatus = searchParams.get('redirect_status');
        const orderNumber = searchParams.get('orderNumber');
        const stripeError = searchParams.get('error') || searchParams.get('error_description');

        if (!orderNumber) {
            router.push('/');
            return;
        }

        if (processedRef.current) return;
        processedRef.current = true;

        setPlacedOrderNumber(orderNumber);

        const showOrderStatus = (success: boolean, failed: boolean, message: string | null) => {
            setIsOrderPlaced(success);
            setPaymentFailed(failed);
            setPaymentFailureMessage(message);
            setIsPaymentStatusLoading(false);
            if (success || failed) {
                clearCart();
                sessionStorage.removeItem('appliedCoupon');
            }
        };

        if (redirectStatus !== null) {
            if (redirectStatus === 'succeeded') {
                showOrderStatus(true, false, null);
            } else {
                showOrderStatus(false, true, stripeError || 'Payment could not be completed. Please try again.');
            }
            return;
        }

        if (status === 'success') {
            showOrderStatus(true, false, null);
            return;
        }

        if (status === 'failed') {
            showOrderStatus(false, true, stripeError || 'Payment could not be completed. Please try again.');
            return;
        }

        // Fetch status from API
        setIsPaymentStatusLoading(true);
        fetch(apiUrl('/api/checkout/payment-status'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ order_number: orderNumber }),
            credentials: 'include',
        })
            .then(async res => {
                const data = await res.json();
                if (res.ok && data.order_id) {
                    setIsOrderPlaced(data.is_success);
                    setPaymentFailed(data.is_failed);
                    setPaymentFailureMessage(data.is_failed ? data.message : null);
                    if (data.is_success || data.is_failed) {
                        clearCart();
                        sessionStorage.removeItem('appliedCoupon');
                    }
                } else {
                    // Default fallback if order exists but payment status isn't confirmed yet
                    setIsOrderPlaced(false);
                    setPaymentFailed(false);
                }
            })
            .catch(() => {
                setIsOrderPlaced(false);
                setPaymentFailed(false);
            })
            .finally(() => setIsPaymentStatusLoading(false));

    }, [searchParams, clearCart, router]);

    if (isPaymentStatusLoading) {
        return (
            <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 text-center animate-in zoom-in-95 duration-500">
                <div className="w-20 h-20 rounded-full flex items-center justify-center mb-6">
                    <Loader2 className="w-12 h-12 text-gray-500 animate-spin" />
                </div>
                <h1 className="text-3xl font-medium text-gray-900 mb-2">Checking Payment Status...</h1>
                <p className="text-gray-500 max-w-md mb-4 font-medium">Please wait while we confirm your payment.</p>
            </div>
        );
    }

    if (isOrderPlaced) {
        return <OrderSuccess orderNumber={placedOrderNumber} />;
    }

    if (paymentFailed) {
        return (
            <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 text-center animate-in zoom-in-95 duration-500">
                <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6">
                    <AlertTriangle className="w-12 h-12 text-red-500" />
                </div>
                <h1 className="text-3xl font-medium text-gray-900 mb-2">Payment Failed</h1>
                <p className="text-gray-500 max-w-md mb-4 font-medium">
                    {paymentFailureMessage || 'Your payment could not be completed. Please try again.'}
                </p>
                <button
                    type="button"
                    onClick={() => {
                        router.push('/checkout');
                    }}
                    className="bg-[#0c4a9e] text-white px-8 py-3 rounded-xl font-medium hover:bg-blue-800 transition-all"
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 text-center animate-in zoom-in-95 duration-500">
            <div className="w-20 h-20 bg-yellow-50 rounded-full flex items-center justify-center mb-6">
                <Clock className="w-12 h-12 text-yellow-500" />
            </div>
            <h1 className="text-3xl font-medium text-gray-900 mb-2">Payment Pending</h1>
            <p className="text-gray-500 max-w-md mb-4 font-medium">
                We are verifying your payment. Please wait and do not refresh this page.
            </p>
            <button
                type="button"
                onClick={() => {
                    router.push('/');
                }}
                className="bg-[#0c4a9e] text-white px-8 py-3 rounded-xl font-medium hover:bg-blue-800 transition-all"
            >
                Continue Shopping
            </button>
        </div>
    );
}

export default function CheckoutStatusPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-pulse flex flex-col items-center gap-4">
                    <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
                        <Loader2 className="w-6 h-6 text-[#0c4a9e] animate-spin" />
                    </div>
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Loading Status...</p>
                </div>
            </div>
        }>
            <CheckoutStatusContent />
        </Suspense>
    );
}
