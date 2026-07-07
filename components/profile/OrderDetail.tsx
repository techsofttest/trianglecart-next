'use client';

import React, { useState } from 'react';
import {
    ArrowLeft, Package, Truck, Clock,
    MapPin, XCircle, Star, CheckCircle2,
    CreditCard, ShoppingBag, RefreshCcw, AlertCircle
} from 'lucide-react';
import OrderAction from './OrderAction';

interface OrderDetailProps {
    orderId: string;
    onBack: () => void;
}

export default function OrderDetail({ orderId, onBack }: OrderDetailProps) {
    // 1. Core Logic
    const orderStatus = orderId === 'TC-98421' ? 'Delivered' : orderId === 'TC-97812' ? 'Cancelled' : 'Processing';
    const isCancelled = orderStatus === 'Cancelled';
    const isDelivered = orderStatus === 'Delivered';

    const [order] = useState({
        id: orderId,
        date: 'May 10, 2026',
        status: orderStatus,
        total: 145.80,
        paymentMethod: 'Credit Card (**** 4242)',
        address: {
            name: 'John Doe',
            type: 'Home',
            street: '123 Bennelong Point',
            suburb: 'Sydney, NSW 2000',
            phone: '+61 400 000 000'
        },
        items: [
            { id: 1, name: 'Premium Organic Bananas', price: 4.99, quantity: 2, weight: '1kg', image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&q=80', brand: 'Nature\'s Best' },
            { id: 2, name: 'Fresh Hass Avocado', price: 3.50, quantity: 3, weight: '3 pcs', image: 'https://images.unsplash.com/photo-1512152272829-e3139592d56f?w=400&q=80', brand: 'Farm Fresh' },
        ],
        timeSlot: '10:00 AM - 12:00 PM',
    });

    // Default to false so user can see the confirm action, unless it's already delivered
    const [selectedSlot, setSelectedSlot] = useState<string | null>(order.timeSlot);
    const [isSlotConfirmed, setIsSlotConfirmed] = useState(isDelivered);
    const [rating, setRating] = useState(0);
    const [view, setView] = useState<'detail' | 'return' | 'cancel'>('detail');

    // 2. Dynamic Timeline
    const timeline = isCancelled
        ? [
            { label: 'Order Placed', time: 'May 10, 09:30 AM', done: true, icon: ShoppingBag },
            { label: 'Cancelled', time: 'May 10, 10:15 AM', done: true, icon: XCircle },
            { label: 'Refund Processing', time: 'May 11, 09:00 AM', done: true, icon: RefreshCcw },
            { label: 'Refund Completed', time: 'Expected May 14', done: false, icon: CheckCircle2 },
        ]
        : [
            { label: 'Order Placed', time: 'May 10, 09:30 AM', done: true, icon: ShoppingBag },
            { label: 'Processing', time: 'May 10, 11:45 AM', done: true, icon: Package },
            { label: 'Shipped', time: 'Pending', done: isDelivered, icon: Truck },
            { label: 'Delivered', time: isDelivered ? 'May 12, 10:00 AM' : 'Pending', done: isDelivered, icon: CheckCircle2 },
        ];

    const statusStyles = {
        'Delivered': 'bg-green-100 text-green-800 border-green-200',
        'Processing': 'bg-blue-100 text-blue-800 border-blue-200',
        'Cancelled': 'bg-red-100 text-red-800 border-red-200'
    };

    if (view === 'return' || view === 'cancel') {
        return <OrderAction order={order} mode={view} onBack={() => setView('detail')} />;
    }

    return (
        <div className="animate-in fade-in slide-in-from-right-4 duration-500 max-w-4xl mx-auto bg-white min-h-screen">

            {/* Sticky Header */}
            <div className="sticky top-0 z-40 bg-white border-b-2 border-gray-100 px-2 py-4 md:px-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onBack}
                        className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors"
                        aria-label="Go back"
                    >
                        <ArrowLeft className="w-5 h-5 text-gray-700" />
                    </button>
                    <div>
                        <h2 className="text-lg md:text-xl font-extrabold text-gray-900 leading-tight">Order #{order.id}</h2>
                        <div className="flex items-center gap-2 mt-0.5">
                            <span className={`text-[10px] md:text-xs font-bold uppercase px-2 py-0.5 rounded border ${statusStyles[order.status as keyof typeof statusStyles]}`}>
                                {order.status}
                            </span>
                            <span className="text-xs text-gray-500 font-medium">• {order.date}</span>
                        </div>
                    </div>
                </div>

                <div className="flex gap-3">
                    {order.status === 'Processing' && (
                        <button 
                            onClick={() => setView('cancel')}
                            className="text-[11px] font-medium text-red-600 bg-red-50 border-2 border-red-300 hover:bg-red-100 px-4 py-2 rounded-xl transition-all uppercase tracking-widest"
                        >
                            Cancel Order
                        </button>
                    )}
                    {order.status === 'Delivered' && (
                        <button 
                            onClick={() => setView('return')}
                            className="text-[11px] font-bold text-[#0c4a9e] bg-blue-50 border-2 border-blue-200 hover:bg-blue-100 px-4 py-2 rounded-xl transition-all uppercase tracking-widest"
                        >
                            Return Items
                        </button>
                    )}
                </div>
            </div>

            {/* Flat Layout Area */}
            <div className="px-2 md:px-4 pb-12">

                {/* 1. Dynamic Tracking Timeline */}
                <section className="py-8 border-b border-gray-200">
                    <h3 className="text-sm font-extrabold text-gray-900 mb-8 flex items-center gap-2">
                        {isCancelled ? <AlertCircle className="w-5 h-5 text-gray-500" /> : <Truck className="w-5 h-5 text-gray-500" />}
                        {isCancelled ? 'Cancellation & Refund Status' : 'Delivery Status'}
                    </h3>

                    <div className="flex flex-col md:flex-row justify-between relative px-2">
                        {timeline.map((step, idx) => {
                            const Icon = step.icon;

                            // Visual Logic for Node Colors
                            const isFirstStep = idx === 0;
                            const isDoneAndCancelled = step.done && isCancelled;

                            let nodeColor = 'bg-white border-gray-300 text-gray-400';
                            if (step.done) {
                                // Order Placed (idx 0) is always blue. Other cancelled steps are red.
                                if (isDoneAndCancelled && !isFirstStep) {
                                    nodeColor = 'bg-red-500 border-red-500 text-white';
                                } else {
                                    nodeColor = 'bg-[#0c4a9e] border-[#0c4a9e] text-white';
                                }
                            }

                            // Visual Logic for Connecting Line Colors
                            let lineColor = 'bg-gray-200';
                            if (step.done && timeline[idx + 1]?.done) {
                                lineColor = isCancelled ? 'bg-red-500' : 'bg-[#0c4a9e]';
                            }

                            return (
                                <div key={idx} className="flex md:flex-col items-start md:items-center gap-4 md:gap-3 relative flex-1 mb-6 md:mb-0">
                                    {/* Connection Line */}
                                    {idx !== timeline.length - 1 && (
                                        <div className="absolute left-4 top-8 md:top-4 md:left-[50%] w-[2px] h-full md:w-full md:h-[2px] -z-0">
                                            <div className={`w-full h-full ${lineColor}`} />
                                        </div>
                                    )}

                                    {/* Icon Node */}
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 border-2 ${nodeColor}`}>
                                        <Icon className="w-4 h-4" />
                                    </div>

                                    <div className="md:text-center mt-1 md:mt-0">
                                        <p className={`text-sm font-bold ${step.done ? 'text-gray-900' : 'text-gray-500'}`}>{step.label}</p>
                                        <p className="text-xs text-gray-500 mt-0.5">{step.time}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* 2. Address & Slot/Refund */}
                <section className="py-8 border-b border-gray-200 flex flex-col md:flex-row gap-8">

                    {/* Delivery Address */}
                    <div className="flex-1">
                        <h3 className="text-sm font-extrabold text-gray-900 mb-5 flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-gray-500" /> Delivery Address
                        </h3>
                        <div className="pl-7">
                            <div className="flex items-center gap-2 mb-1">
                                <p className="text-base font-bold text-gray-900">{order.address.name}</p>
                                <span className="text-[10px] font-bold px-2 py-0.5 bg-gray-100 text-gray-600 rounded uppercase">{order.address.type}</span>
                            </div>
                            <p className="text-sm text-gray-600 leading-relaxed mb-1">{order.address.street}, <br />{order.address.suburb}</p>
                            <p className="text-sm font-bold text-gray-800">{order.address.phone}</p>
                        </div>
                    </div>

                    {/* Visible Separators */}
                    <div className="hidden md:block w-px bg-gray-200" />
                    <div className="md:hidden h-px w-full bg-gray-200" />

                    {/* Slot / Refund Info */}
                    <div className="flex-1">
                        {isCancelled ? (
                            <>
                                <h3 className="text-sm font-extrabold text-gray-900 mb-5 flex items-center gap-2">
                                    <RefreshCcw className="w-5 h-5 text-gray-500" /> Refund Information
                                </h3>
                                <div className="pl-7">
                                    <p className="text-sm text-gray-800 font-medium leading-relaxed">
                                        A refund of <span className="font-bold">${order.total.toFixed(2)}</span> has been initiated to your original payment method.
                                        Please allow 3-5 business days for the amount to reflect.
                                    </p>
                                </div>
                            </>
                        ) : (
                            <>
                                <h3 className="text-sm font-extrabold text-gray-900 mb-5 flex items-center gap-2">
                                    <Clock className="w-5 h-5 text-gray-500" /> Delivery Slot
                                </h3>
                                <div className="pl-7">
                                    {isDelivered ? (
                                        // LOGIC FIX: Show this ONLY if delivered
                                        <div className="flex items-start gap-3 bg-green-50 p-4 rounded-lg border border-green-100">
                                            <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                                            <div>
                                                <p className="text-sm text-green-800 font-bold">Delivered Successfully</p>
                                                <p className="text-sm text-green-700 mt-1">Dropped off on {order.date} between {order.timeSlot}</p>
                                            </div>
                                        </div>
                                    ) : isSlotConfirmed ? (
                                        // LOGIC FIX: Show Confirmed state with Edit Button
                                        <div className="flex items-start justify-between bg-blue-50/50 p-4 rounded-lg border border-blue-100">
                                            <div className="flex items-start gap-3">
                                                <CheckCircle2 className="w-5 h-5 text-[#0c4a9e] shrink-0 mt-0.5" />
                                                <div>
                                                    <p className="text-sm text-[#0c4a9e] font-bold">Slot Confirmed</p>
                                                    <p className="text-sm text-blue-800 mt-1">Delivery expected during:<br />{selectedSlot}</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => setIsSlotConfirmed(false)}
                                                className="text-xs font-bold text-[#0c4a9e] hover:underline px-2"
                                            >
                                                Edit
                                            </button>
                                        </div>
                                    ) : (
                                        // Show selection grid
                                        <>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                                                {['08:00 AM - 10:00 AM', '10:00 AM - 12:00 PM', '12:00 PM - 02:00 PM', '04:00 PM - 06:00 PM'].map((slot) => (
                                                    <button
                                                        key={slot}
                                                        onClick={() => setSelectedSlot(slot)}
                                                        className={`text-left p-3 rounded-lg border text-xs font-bold transition-all ${selectedSlot === slot
                                                            ? 'border-[#0c4a9e] bg-blue-50 text-[#0c4a9e]'
                                                            : 'border-gray-300 text-gray-600 hover:border-gray-400 hover:bg-gray-50'
                                                            }`}
                                                    >
                                                        {slot}
                                                    </button>
                                                ))}
                                            </div>
                                            <button
                                                onClick={() => setIsSlotConfirmed(true)}
                                                disabled={!selectedSlot}
                                                className="w-full bg-[#0c4a9e] text-white font-bold py-3 rounded-lg hover:bg-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                Confirm Slot
                                            </button>
                                        </>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </section>

                {/* 3. Items List */}
                <section className="py-8 border-b border-gray-200">
                    <h3 className="text-sm font-extrabold text-gray-900 mb-6 flex items-center gap-2">
                        <Package className="w-5 h-5 text-gray-500" /> Items Ordered ({order.items.length})
                    </h3>

                    <div className="space-y-6 pl-7">
                        {order.items.map((item) => (
                            <div key={item.id} className="flex gap-4 md:gap-6 items-start">
                                <div className="w-20 h-20 bg-gray-50 rounded-lg p-2 shrink-0 border border-gray-200">
                                    <img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex flex-col sm:flex-row sm:justify-between items-start gap-2">
                                        <div>
                                            <p className="text-[10px] font-bold text-[#0c4a9e] uppercase tracking-wider mb-1">{item.brand}</p>
                                            <h4 className="text-sm font-bold text-gray-900 leading-tight">{item.name}</h4>
                                            <p className="text-xs text-gray-600 mt-1">{item.weight} • Qty: {item.quantity}</p>
                                        </div>
                                        <div className="sm:text-right mt-2 sm:mt-0">
                                            <p className="text-sm font-extrabold text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                                            <p className="text-xs text-gray-500">${item.price.toFixed(2)} / unit</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 4. Payment Summary */}
                <section className="py-8 border-b border-gray-200">
                    <h3 className="text-sm font-extrabold text-gray-900 mb-6 flex items-center gap-2">
                        <CreditCard className="w-5 h-5 text-gray-500" /> Payment Summary
                    </h3>

                    <div className="pl-7 space-y-4">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600 font-medium">Payment Method</span>
                            <span className="text-gray-900 font-bold flex items-center gap-2">
                                <CreditCard className="w-4 h-4 text-gray-400" />
                                {order.paymentMethod}
                            </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600 font-medium">Subtotal</span>
                            <span className="text-gray-900 font-medium">$135.81</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600 font-medium">Delivery Fee</span>
                            <span className="text-green-600 font-bold">FREE</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600 font-medium">GST (10%)</span>
                            <span className="text-gray-900 font-medium">$9.99</span>
                        </div>

                        <div className="pt-4 mt-2 border-t border-gray-200 flex items-center justify-between">
                            <p className="text-base font-extrabold text-gray-900">Total {isCancelled ? 'Refunded' : 'Amount Paid'}</p>
                            <p className="text-2xl font-black text-[#0c4a9e]">${order.total.toFixed(2)}</p>
                        </div>
                    </div>
                </section>

                {/* 5. Rating Section */}
                {isDelivered && (
                    <section className="py-8 text-center">
                        <h3 className="text-base font-extrabold text-gray-900 mb-1">Rate your delivery experience</h3>
                        <p className="text-sm text-gray-600 mb-5">How satisfied are you with this order?</p>
                        <div className="flex justify-center gap-3">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    onClick={() => setRating(star)}
                                    className={`p-1 transition-all transform hover:scale-110 focus:outline-none ${star <= (rating || 0) ? 'text-yellow-400' : 'text-gray-200 hover:text-gray-300'}`}
                                >
                                    <Star className={`w-10 h-10 ${star <= (rating || 0) ? 'fill-current' : ''}`} />
                                </button>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
}