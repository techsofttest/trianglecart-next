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
    const pollTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
    const pollAttemptsRef = React.useRef(0);
    const pollIntervalMs = 5000;
    const maxPollAttempts = 24;

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

        const fetchPaymentStatus = async () => {
            setIsPaymentStatusLoading(true);
            try {
                const res = await fetch(apiUrl('/api/checkout/payment-status'), {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ order_number: orderNumber }),
                    credentials: 'include',
                });

                if (!res.ok) {
                    return null;
                }

                const data = await res.json();
                if (!data || !data.order_id) {
                    return null;
                }

                setIsOrderPlaced(Boolean(data.is_success));
                setPaymentFailed(Boolean(data.is_failed));
                setPaymentFailureMessage(data.is_failed ? data.message : null);

                if (data.is_success || data.is_failed) {
                    clearCart();
                    sessionStorage.removeItem('appliedCoupon');
                }

                return data;
            } catch (error) {
                return null;
            } finally {
                setIsPaymentStatusLoading(false);
            }
        };

        const scheduleNextPoll = () => {
            if (pollTimeoutRef.current) {
                clearTimeout(pollTimeoutRef.current);
            }

            if (pollAttemptsRef.current >= maxPollAttempts) {
                return;
            }

            pollTimeoutRef.current = setTimeout(async () => {
                pollAttemptsRef.current += 1;
                const data = await fetchPaymentStatus();
                if (!data || (!data.is_success && !data.is_failed)) {
                    scheduleNextPoll();
                }
            }, pollIntervalMs);
        };

        if (status === 'success' && !redirectStatus) {
            showOrderStatus(true, false, null);
            return;
        }

        if (status === 'failed' || redirectStatus === 'failed') {
            showOrderStatus(false, true, stripeError || 'Payment could not be completed. Please try again.');
            return;
        }

        fetchPaymentStatus().then((data) => {
            if (!data || (!data.is_success && !data.is_failed)) {
                scheduleNextPoll();
            }
        });

        return () => {
            if (pollTimeoutRef.current) {
                clearTimeout(pollTimeoutRef.current);
            }
        };
    }, [searchParams, clearCart, router]);

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
            <div className="w-20 h-20 rounded-full flex items-center justify-center mb-6">
                <Loader2 className="w-12 h-12 text-gray-500 animate-spin" />
            </div>
            <h1 className="text-3xl font-medium text-gray-900 mb-2">Confirming your payment</h1>
            <p className="text-gray-500 max-w-md mb-4 font-medium">
                Please wait while we finalize the payment and update your order status.
            </p>
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
