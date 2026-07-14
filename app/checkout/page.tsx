'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Lock, Loader2, Truck, Package, Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';

import { MOCK_CART_ITEMS, MOCK_PRODUCTS, LARGE_MOCK_PRODUCTS } from '@/data/mockData';

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
    const [shipping, setShipping] = useState(9.99);
    
    const [placedOrderNumber, setPlacedOrderNumber] = useState<string>('');
    const [isPlacingOrder, setIsPlacingOrder] = useState(false);
    const [paymentClientSecret, setPaymentClientSecret] = useState<string | null>(null);
    const [createdOrderNumber, setCreatedOrderNumber] = useState<string>('');

    // Check url search params for payment redirect success
    useEffect(() => {
        const status = searchParams.get('status');
        const orderNumber = searchParams.get('orderNumber');
        if (status === 'success' && orderNumber) {
            setPlacedOrderNumber(orderNumber);
            setIsOrderPlaced(true);
            clearCart();
            sessionStorage.removeItem('appliedCoupon');
            // Clear URL search params immediately to prevent reload loop on subsequent navigations
            window.history.replaceState({}, '', window.location.pathname);
        }
    }, [searchParams, clearCart]);


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
            const allPossibleProducts = [...MOCK_PRODUCTS, ...LARGE_MOCK_PRODUCTS];
            const directItem = allPossibleProducts.find(p => p.id === productId);

            if (directItem) {
                setCheckoutItems([{
                    id: directItem.id,
                    name: directItem.title,
                    price: directItem.price,
                    image: directItem.image,
                    quantity: qty,
                    weight: directItem.weight,
                    brand: directItem.brand,
                    category: directItem.category,
                    inStock: true
                }]);
            }
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
                    setEligibilityMessage(data.delivery_type === 'direct' ? 'Direct delivery is available!' : 'Courier delivery is available.');
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
                    setAvailableDates([]);
                    setSelectedDateString(null);
                }
            } catch (e) {
                // If API fails (e.g. database not seeded), fallback to courier
                const currentSubtotal = checkoutItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
                setIsEligible(true);
                setDeliveryType('courier');
                setEligibilityMessage('Eligibility checked (courier fallback).');
                setShipping(currentSubtotal > 50 ? 0 : 9.99);
                setAvailableDates([]);
                setSelectedDateString(null);
            } finally {
                setIsCheckingEligibility(false);
            }
        };

        validatePostcode();
    }, [addressForm.postcode, checkoutItems]);

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
            .catch(() => {});
        }
    }, [subtotal]);

    const discount = couponDiscount;

    const tax = 0;
    const total = subtotal - discount + shipping + tax;

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
        if (!isAddressComplete) {
            alert('Please complete your delivery address details and select a delivery slot if required.');
            return;
        }

        setIsPlacingOrder(true);
        const payload = {
            cart: checkoutItems.map(item => ({
                product_id: item.id,
                quantity: item.quantity,
                variant_id: item.variant_id || null,
                price: item.price
            })),
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
            } else {
                alert(data.message || 'Failed to place order. ' + (data.error || ''));
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

    if (isOrderPlaced) {
        return <OrderSuccess orderNumber={placedOrderNumber} />;
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
                        onOpenLocation={() => {}}
                        isConfirmed={isAddressConfirmed}
                        setIsConfirmed={setIsAddressConfirmed}
                        selectedAddressId={selectedAddressId}
                        setSelectedAddressId={setSelectedAddressId}
                    />

                    {/* Delivery Eligibility Banner */}
                    {isAddressConfirmed && addressForm.postcode && (
                        <div className={`rounded-2xl border p-4 transition-all duration-500 animate-in fade-in slide-in-from-bottom-2 ${
                            isCheckingEligibility
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
                                                className={`px-4 py-2.5 rounded-xl border-2 text-xs font-bold whitespace-nowrap transition-all duration-200 ${
                                                    selectedDateString === dateObj.date
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
                                                        className={`p-3 rounded-xl border-2 text-center transition-all duration-200 ${
                                                            selectedSlotId === slot.id
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
