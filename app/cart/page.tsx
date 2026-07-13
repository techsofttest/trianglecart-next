'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Truck, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import LocationDrawer from '@/components/global/LocationDrawer';

// New Components
import EmptyCart from '@/components/cart/EmptyCart';
import LocationBanner from '@/components/cart/LocationBanner';
import CartItemCard from '@/components/cart/CartItemCard';
import CartSummary from '@/components/cart/CartSummary';
import CouponSection from '@/components/cart/CouponSection';
import { useCart } from '@/context/CartContext';
import { MOCK_ADDRESSES } from '@/data/mockData';

export default function CartPage() {
    const { cartItems, updateQuantity, removeFromCart, clearCart, cartTotal, cartCount } = useCart();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState<{
        title: string;
        subtitle: string;
        id?: string | number;
        phone?: string;
        name?: string;
    } | null>(null);
    const [isLocationOpen, setIsLocationOpen] = useState(false);
    const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
    const [couponDiscount, setCouponDiscount] = useState(0);
    const router = useRouter();

    useEffect(() => {
        setIsMounted(true);
        const userStr = localStorage.getItem('user');
        if (userStr) {
            setIsLoggedIn(JSON.parse(userStr).isLoggedIn);
        }

        const loadLocation = () => {
            const checkoutLocStr = localStorage.getItem('checkoutLocation');
            const globalLocStr = localStorage.getItem('selectedLocation');

            if (checkoutLocStr) {
                setSelectedLocation(JSON.parse(checkoutLocStr));
            } else if (globalLocStr) {
                setSelectedLocation(JSON.parse(globalLocStr));
            } else {
                const savedStr = localStorage.getItem('triangle-saved-addresses');
                const savedAddresses = savedStr ? JSON.parse(savedStr) : [];
                const defaultAddr = savedAddresses.length > 0 ? savedAddresses[0] : MOCK_ADDRESSES[0];

                if (defaultAddr) {
                    setSelectedLocation({ title: defaultAddr.type, subtitle: defaultAddr.address });
                }
            }
        };

        loadLocation();

        const handleGlobalUpdate = () => {
            if (!localStorage.getItem('checkoutLocation')) {
                loadLocation();
            }
        };

        window.addEventListener('locationUpdate', handleGlobalUpdate);
        return () => window.removeEventListener('locationUpdate', handleGlobalUpdate);
    }, []);

    const handleQuantityChange = (id: string, delta: number) => {
        const item = cartItems.find(i => String(i.id) === String(id));
        if (item) {
            updateQuantity(id, item.quantity + delta);
        }
    };

    const subtotal = cartTotal;
    const discount = couponDiscount;
    const shipping = 0; // Shipping is calculated at checkout based on postcode
    const total = subtotal - discount;

    if (!isMounted) return null;

    if (cartItems.length === 0) {
        return <EmptyCart isLoggedIn={isLoggedIn} />;
    }

    const handleClearCart = () => {
        if (window.confirm('Clear all items from your cart?')) {
            clearCart();
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 pt-1 pb-8 animate-in fade-in duration-700 text-gray-700">

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                <h1 className="text-xl md:text-2xl font-medium text-gray-900 tracking-tight">
                    Shopping Cart <span className="text-gray-600 font-medium ml-1">({cartCount} items)</span>
                </h1>
                <button
                    type="button"
                    onClick={handleClearCart}
                    className="inline-flex items-center gap-2 rounded-2xl bg-red-50 border border-red-100 text-red-700 hover:bg-red-100 hover:text-red-900 transition-all px-4 py-2 text-sm font-semibold"
                >
                    <Trash2 className="w-4 h-4" />
                    Clear all
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                <div className="lg:col-span-2 space-y-3">

                    {/* Temporarily hidden location banner */}
                    {/* <LocationBanner
                        selectedLocation={selectedLocation}
                        onOpenDrawer={() => setIsLocationOpen(true)}
                    /> */}

                    <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
                        {cartItems.map((item, idx) => (
                            <CartItemCard
                                key={item.id}
                                item={item}
                                onUpdateQuantity={handleQuantityChange}
                                onRemove={removeFromCart}
                                isLast={idx === cartItems.length - 1}
                            />
                        ))}
                    </div>

                    <div className="flex items-center gap-4 p-3 bg-blue-50/50 rounded-2xl border border-blue-100">
                        <Truck className="w-5 h-5 text-[#0c4a9e]" />
                        <span className="text-[10px] text-gray-600 font-medium uppercase tracking-tight leading-tight max-w-[70px]">
                            Secure Payments
                        </span>


                    </div>
                </div>

                <div className="space-y-4 sticky top-24 self-start">
                    <CouponSection
                        appliedCoupon={appliedCoupon}
                        onApply={(code, discount) => {
                            setAppliedCoupon(code);
                            setCouponDiscount(discount);
                        }}
                        onRemove={() => {
                            setAppliedCoupon(null);
                            setCouponDiscount(0);
                        }}
                    />
                    <CartSummary
                        subtotal={subtotal}
                        discount={discount}
                        shipping={shipping}
                        total={total}
                    />
                </div>
            </div>

            <LocationDrawer
                isOpen={isLocationOpen}
                onClose={() => setIsLocationOpen(false)}
                onSelectLocation={(loc) => {
                    setSelectedLocation(loc);
                    localStorage.setItem('checkoutLocation', JSON.stringify(loc));
                }}
            />
        </div>
    );
}
