'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Lock, Loader2, Truck, Package, Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useCustomerAuth } from '@/context/CustomerAuthContext';

// Using live storefront data; removed mock data usage

import OrderSuccess from '@/components/checkout/OrderSuccess';
import AddressSection from '@/components/checkout/AddressSection';
import CheckoutItemsList from '@/components/checkout/CheckoutItemsList';
import OrderSummarySidebar from '@/components/checkout/OrderSummarySidebar';
import { useCart } from '@/context/CartContext';
import { apiUrl } from '@/lib/api';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import StripePaymentForm from '@/components/checkout/StripePaymentForm';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');


function CheckoutContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isMounted, setIsMounted] = useState(false);
    const [savedAddresses, setSavedAddresses] = useState<any[]>([]);
    const [selectedLocation, setSelectedLocation] = useState<{
        title: string;
        subtitle: string;
        id?: string | number;
        phone?: string;
        email?: string;
        name?: string
    } | null>(null);
    const { cartItems, clearCart } = useCart();
    const [checkoutItems, setCheckoutItems] = useState<any[]>([]);
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [isOrderPlaced, setIsOrderPlaced] = useState(false);
    const [paymentFailed, setPaymentFailed] = useState(false);
    const [paymentFailureMessage, setPaymentFailureMessage] = useState<string | null>(null);
    const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
    const [couponDiscount, setCouponDiscount] = useState(0);
    const [isAddressConfirmed, setIsAddressConfirmed] = useState(false);

    // Selected address and eligibility checking states
    const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
    const [isCheckingEligibility, setIsCheckingEligibility] = useState(false);
    const [isEligible, setIsEligible] = useState<boolean | null>(null);
    const [eligibilityMessage, setEligibilityMessage] = useState<string>('');
    const [deliveryType, setDeliveryType] = useState<'direct' | 'courier' | null>(null);

    // Dynamic Slots and Shipping Cost States
    const [availableDates, setAvailableDates] = useState<any[]>([]);
    const [selectedDateString, setSelectedDateString] = useState<string | null>(null);
    const [selectedSlotId, setSelectedSlotId] = useState<number | null>(null);
    const [shipping, setShipping] = useState<number | null>(null);

    const [placedOrderNumber, setPlacedOrderNumber] = useState<string>('');
    const [isPlacingOrder, setIsPlacingOrder] = useState(false);
    const { customer, isAuthenticated } = useCustomerAuth();
    const [paymentClientSecret, setPaymentClientSecret] = useState<string | null>(null);
    const [createdOrderNumber, setCreatedOrderNumber] = useState<string>('');
    const [checkoutErrors, setCheckoutErrors] = useState<string[]>([]);
    const [showPaymentStatusPage, setShowPaymentStatusPage] = useState(false);
    const [isPaymentStatusLoading, setIsPaymentStatusLoading] = useState(false);

    // Check url search params for payment redirect success or status-only redirect
    useEffect(() => {
        const status = searchParams.get('status');
        const redirectStatus = searchParams.get('redirect_status');
        const orderNumber = searchParams.get('orderNumber');
        const stripeError = searchParams.get('error') || searchParams.get('error_description');
        const statusKey = orderNumber ? `payment_status_viewed_${orderNumber}` : null;
        const hasViewed = statusKey ? sessionStorage.getItem(statusKey) === 'true' : false;

        const markViewed = () => {
            if (statusKey) {
                sessionStorage.setItem(statusKey, 'true');
            }
        };

        const showOrderStatus = (success: boolean, failed: boolean, message: string | null) => {
            if (orderNumber) {
                setPlacedOrderNumber(orderNumber);
            }
            setIsOrderPlaced(success);
            setPaymentFailed(failed);
            setPaymentFailureMessage(message);
            setShowPaymentStatusPage(true);
            if (success || failed) {
                clearCart();
                sessionStorage.removeItem('appliedCoupon');
            }
            markViewed();
        };

        if (redirectStatus !== null && orderNumber) {
            if (redirectStatus === 'succeeded') {
                showOrderStatus(true, false, null);
            } else {
                showOrderStatus(false, true, stripeError || 'Payment could not be completed. Please try again.');
            }
            window.history.replaceState({}, '', window.location.pathname);
            return;
        }

        if (status === 'success' && orderNumber) {
            showOrderStatus(true, false, null);
            window.history.replaceState({}, '', window.location.pathname);
            return;
        }

        if (status === 'failed' && orderNumber) {
            showOrderStatus(false, true, stripeError || 'Payment could not be completed. Please try again.');
            window.history.replaceState({}, '', window.location.pathname);
            return;
        }

        if (orderNumber && !hasViewed) {
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
                        setCreatedOrderNumber(data.order_number);
                        setPlacedOrderNumber(data.order_number);
                        setShowPaymentStatusPage(true);
                        setIsOrderPlaced(data.is_success);
                        setPaymentFailed(data.is_failed);
                        setPaymentFailureMessage(data.is_failed ? data.message : null);
                        if (data.is_success || data.is_failed) {
                            clearCart();
                            sessionStorage.removeItem('appliedCoupon');
                        }
                        markViewed();
                    }
                })
                .catch(() => { })
                .finally(() => setIsPaymentStatusLoading(false));
            return;
        }

        if (!paymentClientSecret) {
            // If we are currently displaying a status page (success or failure),
            // do not reset these states when the URL query parameters are cleared.
            setShowPaymentStatusPage(prev => {
                if (prev) return prev;

                setIsOrderPlaced(false);
                setPaymentFailed(false);
                setPaymentFailureMessage(null);
                setPlacedOrderNumber('');
                setCreatedOrderNumber('');
                return false;
            });
        }
    }, [searchParams, clearCart, paymentClientSecret]);

    // Redirect if cart is empty and not in payment flow
    useEffect(() => {
        if (!isMounted) return;

        if (
            !showPaymentStatusPage &&
            !isOrderPlaced &&
            !paymentFailed &&
            !isPaymentStatusLoading &&
            !paymentClientSecret &&
            checkoutItems.length === 0
        ) {
            const savedCartStr = localStorage.getItem('triangle-cart');
            let savedCart = [];
            try {
                savedCart = savedCartStr ? JSON.parse(savedCartStr) : [];
            } catch (e) {
                console.error(e);
            }
            const isBuyNow = searchParams.get('type') === 'buynow';

            if (isBuyNow) {
                router.push('/');
            } else if (savedCart.length === 0) {
                router.push('/cart');
            }
        }
    }, [isMounted, checkoutItems, showPaymentStatusPage, isOrderPlaced, paymentFailed, isPaymentStatusLoading, paymentClientSecret, router, searchParams]);


    // Form state for address completion
    const [addressForm, setAddressForm] = useState({
        name: '',
        phone: '',
        email: '',
        address: '',
        type: 'Home',
        contact_name: '',
        address_line_1: '',
        address_line_2: '',
        suburb: '',
        city: '',
        state: '',
        postcode: '',
        country: 'Australia',
        latitude: null as number | null,
        longitude: null as number | null,
        google_place_id: '',
        delivery_notes: '',
        label: 'Home'
    });

    // Initialize checkout items from cart or buy-now
    useEffect(() => {
        setIsMounted(true);

        const checkoutType = searchParams.get('type');
        const productId = searchParams.get('productId');
        const qty = parseInt(searchParams.get('qty') || '1');

        if (checkoutType === 'buynow' && productId) {
            (async () => {
                try {
                    // Try fetching product by id or slug
                    const res = await fetch(apiUrl(`/api/storefront/products/${productId}`), { cache: 'no-store' });
                    let product: any = null;
                    if (res.ok) product = await res.json();

                    // Fallback: try homepage product list to resolve slug -> fetch detailed
                    if (!product) {
                        try {
                            const homeRes = await fetch(apiUrl('/api/storefront/home'), { cache: 'no-store' });
                            if (homeRes.ok) {
                                const homeData = await homeRes.json();
                                const fallback = (homeData?.products || []).find((p: any) => String(p.id) === productId || p.slug === productId);
                                if (fallback?.slug) {
                                    const pRes = await fetch(apiUrl(`/api/storefront/products/${fallback.slug}`), { cache: 'no-store' });
                                    if (pRes.ok) product = await pRes.json();
                                }
                            }
                        } catch (e) {
                            // ignore
                        }
                    }

                    if (product) {
                        const variantIdParam = searchParams.get('variantId');
                        const variantId = variantIdParam ? Number(variantIdParam) : null;
                        setCheckoutItems([{
                            id: product.id,
                            product_id: product.id,
                            variant_id: variantId,
                            selectedVariantId: variantId,
                            name: product.name || product.title || '',
                            price: (product.variants?.[0]?.price ?? product.price) || 0,
                            image: product.featured_image || product.image || '',
                            quantity: qty,
                            weight: product.variants?.[0] ? `${product.variants[0].size || ''} ${product.variants[0].unit || ''}`.trim() : '1 unit',
                            brand: product.brand?.name || '',
                            category: product.category?.slug || '',
                            inStock: Boolean(product.variants && product.variants.some((v: any) => (v.stock ?? 0) > 0))
                        }]);
                        return;
                    }
                } catch (e) {
                    // ignore and fallback to cart
                }
            })();
        } else {
            setCheckoutItems(cartItems);
        }
    }, [searchParams, cartItems]);

    // Load customer addresses
    useEffect(() => {
        const loadCustomerAddresses = async () => {
            try {
                const res = await fetch(apiUrl('/api/customer/addresses'), {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include'
                });

                if (!res.ok) {
                    throw new Error('Failed to load addresses');
                }

                const data = await res.json();
                setSavedAddresses(data);
                localStorage.setItem('triangle-saved-addresses', JSON.stringify(data));
            } catch {
                setSavedAddresses([]);
            }
        };

        loadCustomerAddresses();
    }, []);

    // Set default shipping in localStorage
    useEffect(() => {
        if (!savedAddresses.length) return;
        const defaultShipping = savedAddresses.find(addr => addr.is_default_shipping) || savedAddresses[0];
        if (defaultShipping) {
            localStorage.setItem('triangle-default-shipping-address', JSON.stringify(defaultShipping));
        }
    }, [savedAddresses]);


    // Validate postcode eligibility when address or cart changes
    useEffect(() => {
        const validatePostcode = async () => {
            const postcode = addressForm.postcode || '';
            if (!postcode || checkoutItems.length === 0) {
                setIsEligible(null);
                setDeliveryType(null);
                setEligibilityMessage('');
                setShipping(null);
                return;
            }

            setIsCheckingEligibility(true);
            try {
                const res = await fetch(apiUrl('/api/delivery/check'), {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        postcode,
                        cart: checkoutItems.map(item => ({
                            product_id: item.id,
                            quantity: item.quantity,
                            price: item.price
                        }))
                    })
                });

                const data = await res.json();
                if (res.ok && data.valid) {
                    setIsEligible(true);
                    setDeliveryType(data.delivery_type);
                    setEligibilityMessage(data.delivery_type === 'direct' ? 'Fast Delivery Eligible!' : 'Courier Delivery Eligible');
                    setShipping(data.shipping_cost ?? 0);
                    setAvailableDates(data.available_dates || []);
                    if (data.available_dates && data.available_dates.length > 0) {
                        setSelectedDateString(data.available_dates[0].date);
                    } else {
                        setSelectedDateString(null);
                    }
                } else {
                    setIsEligible(false);
                    setDeliveryType(null);
                    setEligibilityMessage(data.message || 'Delivery not available for this postcode.');
                    setShipping(null);
                    setAvailableDates([]);
                    setSelectedDateString(null);
                }
            } catch (e) {
                setIsEligible(false);
                setDeliveryType(null);
                setEligibilityMessage('Unable to check delivery eligibility at this time.');
                setShipping(null);
                setAvailableDates([]);
                setSelectedDateString(null);
            } finally {
                setIsCheckingEligibility(false);
            }
        };

        validatePostcode();
    }, [addressForm.postcode, checkoutItems]);

    // Auto-hide checkout errors after 4 seconds
    useEffect(() => {
        if (checkoutErrors.length > 0) {
            const timer = setTimeout(() => {
                setCheckoutErrors([]);
            }, 4000);
            return () => clearTimeout(timer);
        }
    }, [checkoutErrors]);

    const updateQuantity = (id: string, delta: number) => {
        setCheckoutItems(prev => prev.map(item =>
            item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
        ));
    };

    const subtotal = checkoutItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    // Auto-restore and validate coupon on checkout
    useEffect(() => {
        const savedCoupon = sessionStorage.getItem('appliedCoupon');
        if (savedCoupon && subtotal > 0) {
            fetch(apiUrl('/api/coupons/validate'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ coupon_code: savedCoupon, subtotal }),
                credentials: 'include',
            })
                .then(res => res.json())
                .then(data => {
                    if (data.valid) {
                        setAppliedCoupon(data.coupon.coupon_code);
                        setCouponDiscount(Number(data.discount || 0));
                    } else {
                        setAppliedCoupon(null);
                        setCouponDiscount(0);
                        sessionStorage.removeItem('appliedCoupon');
                    }
                })
                .catch(() => { });
        }
    }, [subtotal]);

    const discount = couponDiscount;

    const tax = 0;
    const total = subtotal - discount + (shipping ?? 0) + tax;

    const isAddressComplete = !!(
        isAddressConfirmed &&
        addressForm.name &&
        addressForm.address &&
        addressForm.phone &&
        addressForm.email &&
        isEligible === true &&
        (deliveryType !== 'direct' || (selectedDateString && selectedSlotId))
    );

    const handlePlaceOrder = async () => {
        const validationErrors: string[] = [];

        if (!isAddressConfirmed) validationErrors.push('Please confirm your delivery address.');
        if (!addressForm.name) validationErrors.push('Recipient name is missing.');
        if (!addressForm.address && !addressForm.address_line_1) validationErrors.push('Delivery address is incomplete.');
        if (!addressForm.address_line_2) validationErrors.push('Address line 2 is required.');
        if (!addressForm.phone) validationErrors.push('Phone number is missing.');
        if (!addressForm.email) validationErrors.push('Email is missing or invalid.');
        if (isEligible === false) validationErrors.push(eligibilityMessage || 'Delivery is not available for this postcode.');
        if (deliveryType === 'direct') {
            if (!selectedDateString) validationErrors.push('Please select a delivery date.');
            if (!selectedSlotId) validationErrors.push('Please select a delivery slot.');
        }

        if (validationErrors.length > 0) {
            setCheckoutErrors(validationErrors);
            return;
        }

        setCheckoutErrors([]);
        setIsPlacingOrder(true);
        const payload = {
            cart: checkoutItems.map(item => ({
                product_id: item.product_id || item.id,
                quantity: item.quantity,
                variant_id: item.variant_id ?? item.selectedVariantId ?? null,
                price: item.price
            })),
            ...(isAuthenticated && customer?.id ? { customer_id: customer.id } : {}),
            customer_type: savedAddresses.length > 0 || localStorage.getItem('user') ? 'customer' : 'guest',
            customer_name: addressForm.contact_name || addressForm.name,
            customer_email: addressForm.email,
            customer_phone: addressForm.phone,
            address: {
                contact_name: addressForm.contact_name || addressForm.name,
                phone: addressForm.phone,
                address_line_1: addressForm.address_line_1 || addressForm.address,
                address_line_2: addressForm.address_line_2 || '',
                suburb: addressForm.suburb || '',
                city: addressForm.city || 'Sydney',
                state: addressForm.state || 'NSW',
                postcode: addressForm.postcode || '2000',
                country: addressForm.country || 'Australia',
                latitude: addressForm.latitude || null,
                longitude: addressForm.longitude || null,
                google_place_id: addressForm.google_place_id || '',
                delivery_notes: addressForm.delivery_notes || '',
                label: addressForm.label || addressForm.type || 'Home'
            },
            selected_address_id: selectedAddressId || null,
            delivery_date: deliveryType === 'direct' ? selectedDateString : null,
            delivery_slot_id: deliveryType === 'direct' ? selectedSlotId : null,
            payment_method: 'card',
            notes: addressForm.delivery_notes || '',
            coupon_code: appliedCoupon || null
        };

        try {
            const res = await fetch(apiUrl('/api/checkout'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
                credentials: 'include'
            });

            const data = await res.json();
            if (res.ok && data.valid) {
                sessionStorage.removeItem('appliedCoupon');
                if (data.payment_intent && data.payment_intent.client_secret) {
                    setCreatedOrderNumber(data.order_number);
                    setPaymentClientSecret(data.payment_intent.client_secret);
                } else {
                    setPlacedOrderNumber(data.order_number);
                    setIsOrderPlaced(true);
                }
                setCheckoutErrors([]);
            } else {
                // collect and show server-side validation messages
                const normalizeServerError = (error: string) => {
                    if (/not available for delivery|delivery is not available|delivery not available/i.test(error)) {
                        return 'Delivery not available for the selected postcode';
                    }
                    return error;
                };

                const serverErrors: string[] = [];
                if (data.errors) {
                    // Laravel validation errors shape
                    Object.values(data.errors).forEach((v: any) => {
                        if (Array.isArray(v)) serverErrors.push(...v.map((err) => normalizeServerError(String(err))));
                        else serverErrors.push(normalizeServerError(String(v)));
                    });
                }
                if (data.message) serverErrors.push(normalizeServerError(String(data.message)));
                if (data.error) serverErrors.push(normalizeServerError(String(data.error)));

                if (serverErrors.length > 0) setCheckoutErrors(serverErrors);
                else setCheckoutErrors([normalizeServerError(String(data.message || 'Failed to place order.'))]);
            }
        } catch (e) {
            console.error('Checkout error:', e);
            alert('An error occurred while placing the order. Please try again.');
        } finally {
            setIsPlacingOrder(false);
        }
    };

    // Sync address form to selectedLocation for OrderSummarySidebar calculation
    useEffect(() => {
        const updatedLoc = {
            title: addressForm.type,
            subtitle: addressForm.address,
            name: addressForm.name,
            phone: addressForm.phone,
            email: addressForm.email
        };
        setSelectedLocation(updatedLoc);
    }, [addressForm]);

    if (!isMounted) return null;

    if (showPaymentStatusPage) {
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
                            setPaymentFailed(false);
                            setPaymentFailureMessage(null);
                            setPlacedOrderNumber('');
                            setShowPaymentStatusPage(false);
                            router.push('/checkout');
                        }}
                        className="bg-[#0c4a9e] text-white px-8 py-3 rounded-xl font-medium hover:bg-blue-800 transition-all"
                    >
                        Try Again
                    </button>
                </div>
            );
        }

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
                        setShowPaymentStatusPage(false);
                        setPlacedOrderNumber('');
                        setPaymentFailureMessage(null);
                        setPaymentFailed(false);
                        router.push('/');
                    }}
                    className="bg-[#0c4a9e] text-white px-8 py-3 rounded-xl font-medium hover:bg-blue-800 transition-all"
                >
                    Continue Shopping
                </button>
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
                        setPaymentFailed(false);
                        setPaymentFailureMessage(null);
                        setPlacedOrderNumber('');
                        router.push('/checkout');
                    }}
                    className="bg-[#0c4a9e] text-white px-8 py-3 rounded-xl font-medium hover:bg-blue-800 transition-all"
                >
                    Try Again
                </button>
            </div>
        );
    }

    // Show Stripe Payment Element when client secret is available
    if (paymentClientSecret) {
        return (
            <div className="max-w-2xl mx-auto px-2 sm:px-4 lg:px-6 pt-1 pb-8 animate-in fade-in duration-700 text-gray-700">
                <div className="flex items-center gap-3 mb-6">
                    <button
                        onClick={() => {
                            setPaymentClientSecret(null);
                            setCreatedOrderNumber('');
                        }}
                        className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <h1 className="text-xl md:text-2xl font-medium text-gray-900 tracking-tight">Complete Payment</h1>
                </div>
                <Elements stripe={stripePromise} options={{ clientSecret: paymentClientSecret, appearance: { theme: 'stripe', variables: { colorPrimary: '#0c4a9e' } } }}>
                    <StripePaymentForm orderNumber={createdOrderNumber} totalAmount={total} />
                </Elements>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 pt-1 pb-8 animate-in fade-in duration-700 text-gray-700">
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
                <button
                    onClick={() => router.back()}
                    className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
                <h1 className="text-xl md:text-2xl font-medium text-gray-900 tracking-tight">Checkout</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                {/* Left Column: Details */}
                <div className="lg:col-span-2 space-y-3">
                    <AddressSection
                        addressForm={addressForm}
                        setAddressForm={setAddressForm}
                        onOpenLocation={() => { }}
                        isConfirmed={isAddressConfirmed}
                        setIsConfirmed={setIsAddressConfirmed}
                        selectedAddressId={selectedAddressId}
                        setSelectedAddressId={setSelectedAddressId}
                    />

                    {/* Delivery Eligibility Banner */}
                    {isAddressConfirmed && addressForm.postcode && (
                        <div className={`rounded-2xl border p-4 transition-all duration-500 animate-in fade-in slide-in-from-bottom-2 ${isCheckingEligibility
                            ? 'bg-gray-50 border-gray-200'
                            : isEligible === true
                                ? 'bg-green-50/60 border-green-200'
                                : isEligible === false
                                    ? 'bg-red-50/60 border-red-200'
                                    : 'bg-gray-50 border-gray-200'
                            }`}>
                            <div className="flex items-center gap-3">
                                {isCheckingEligibility ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                                        <span className="text-sm font-semibold text-gray-500">Checking delivery eligibility...</span>
                                    </>
                                ) : isEligible === true ? (
                                    <>
                                        {deliveryType === 'direct' ? (
                                            <Truck className="w-5 h-5 text-green-600" />
                                        ) : (
                                            <Package className="w-5 h-5 text-green-600" />
                                        )}
                                        <div>
                                            <span className="text-sm font-bold text-green-700">{eligibilityMessage}</span>
                                            <span className="text-[10px] font-bold uppercase tracking-wider ml-2 px-2 py-0.5 rounded bg-green-100 text-green-700">
                                                {deliveryType === 'direct' ? 'Direct' : 'Courier'}
                                            </span>
                                        </div>
                                    </>
                                ) : isEligible === false ? (
                                    <>
                                        <AlertTriangle className="w-5 h-5 text-red-500" />
                                        <span className="text-sm font-bold text-red-600">{eligibilityMessage}</span>
                                    </>
                                ) : null}
                            </div>
                        </div>
                    )}

                    {/* Delivery Slot Selection (only for direct delivery) */}
                    {isAddressConfirmed && deliveryType === 'direct' && isEligible && (
                        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-500 space-y-4">
                            {/* Date Selection */}
                            <div>
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0c4a9e] flex items-center justify-center">
                                        <Clock className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="text-base font-bold text-gray-900">Select Delivery Date</h3>
                                        <p className="text-xs text-gray-500 font-medium">Choose an available delivery date</p>
                                    </div>
                                </div>
                                {availableDates.length === 0 ? (
                                    <p className="text-xs text-amber-600 font-semibold flex items-center gap-1.5">
                                        <AlertTriangle className="w-3.5 h-3.5" /> No delivery dates available for this postcode.
                                    </p>
                                ) : (
                                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
                                        {availableDates.map((dateObj) => (
                                            <button
                                                key={dateObj.date}
                                                type="button"
                                                onClick={() => {
                                                    setSelectedDateString(dateObj.date);
                                                    setSelectedSlotId(null);
                                                }}
                                                className={`px-4 py-2.5 rounded-xl border-2 text-xs font-bold whitespace-nowrap transition-all duration-200 ${selectedDateString === dateObj.date
                                                    ? 'border-[#0c4a9e] bg-blue-50/30 text-[#0c4a9e]'
                                                    : 'border-gray-100 hover:border-gray-200 bg-white text-gray-600'
                                                    }`}
                                            >
                                                {dateObj.formatted_date}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Slot Selection */}
                            {selectedDateString && (
                                <div className="pt-2 border-t border-gray-100">
                                    <h4 className="text-xs font-bold text-gray-700 mb-3 uppercase tracking-wider">Available Slots</h4>

                                    {(() => {
                                        const dateObj = availableDates.find(d => d.date === selectedDateString);
                                        const slots = dateObj?.slots || [];

                                        if (slots.length === 0) {
                                            return (
                                                <p className="text-xs text-amber-600 font-semibold flex items-center gap-1.5">
                                                    <AlertTriangle className="w-3.5 h-3.5" /> No delivery slots available for the selected date.
                                                </p>
                                            );
                                        }

                                        return (
                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                                {slots.map((slot: any) => (
                                                    <button
                                                        key={slot.id}
                                                        type="button"
                                                        onClick={() => setSelectedSlotId(slot.id)}
                                                        className={`p-3 rounded-xl border-2 text-center transition-all duration-200 ${selectedSlotId === slot.id
                                                            ? 'border-[#0c4a9e] bg-blue-50/30 ring-2 ring-[#0c4a9e]/10'
                                                            : 'border-gray-100 hover:border-gray-200 bg-white'
                                                            }`}
                                                    >
                                                        <Clock className={`w-4 h-4 mx-auto mb-1.5 ${selectedSlotId === slot.id ? 'text-[#0c4a9e]' : 'text-gray-400'}`} />
                                                        <span className={`text-xs font-bold block ${selectedSlotId === slot.id ? 'text-[#0c4a9e]' : 'text-gray-600'}`}>
                                                            {slot.formatted_slot}
                                                        </span>
                                                        {selectedSlotId === slot.id && (
                                                            <CheckCircle2 className="w-3.5 h-3.5 text-[#0c4a9e] mx-auto mt-1" />
                                                        )}
                                                    </button>
                                                ))}
                                            </div>
                                        );
                                    })()}

                                    {!selectedSlotId && (
                                        <p className="text-xs text-amber-600 font-semibold mt-3 flex items-center gap-1.5">
                                            <AlertTriangle className="w-3.5 h-3.5" /> Please select a delivery slot to proceed
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    <CheckoutItemsList
                        items={checkoutItems}
                        onUpdateQuantity={updateQuantity}
                    />
                </div>

                {/* Right Column: Sticky Summary */}
                <div className="lg:sticky lg:top-24 self-start">
                    <OrderSummarySidebar
                        subtotal={subtotal}
                        discount={discount}
                        shipping={shipping}
                        tax={tax}
                        total={total}
                        isAddressComplete={isAddressComplete}
                        appliedCoupon={appliedCoupon}
                        checkoutErrors={checkoutErrors}
                        isPlacingOrder={isPlacingOrder}
                        onApplyCoupon={(code, discount) => {
                            setAppliedCoupon(code);
                            setCouponDiscount(discount ?? 0);
                            sessionStorage.setItem('appliedCoupon', code);
                        }}
                        onRemoveCoupon={() => {
                            setAppliedCoupon(null);
                            setCouponDiscount(0);
                            sessionStorage.removeItem('appliedCoupon');
                        }}
                        onPlaceOrder={handlePlaceOrder}
                    />
                </div>
            </div>
        </div>
    );
}

export default function CheckoutPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-pulse flex flex-col items-center gap-4">
                    <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
                        <Lock className="w-6 h-6 text-[#0c4a9e]" />
                    </div>
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Loading Checkout...</p>
                </div>
            </div>
        }>
            <CheckoutContent />
        </Suspense>
    );
}
