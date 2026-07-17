'use client';

import React, { useEffect, useState } from 'react';

import {
    ChevronRight, Calendar, Clock, CheckCircle2, Timer
} from 'lucide-react';

import OrderDetail from './OrderDetail';
import { apiUrl } from '@/lib/api';

export default function OrderHistory() {
    const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

    const [loading, setLoading] = useState(true);
    const [orders, setOrders] = useState<
        {
            id: number;
            order_number: string;
            order_date: string;
            status: string;
            grand_total: number;
        }[]
    >([]);

    useEffect(() => {
        const load = async () => {
            try {
                const res = await fetch(apiUrl('/api/customer/dashboard-summary'), {
                    method: 'GET',
                    credentials: 'include',
                });

                if (!res.ok) throw new Error('Failed to load orders');
                const data = await res.json();
                setOrders(data.last_5_orders ?? []);
            } catch {
                setOrders([]);
            } finally {
                setLoading(false);
            }
        };

        load();
    }, []);

    if (selectedOrderId) {
        return <OrderDetail orderId={selectedOrderId} onBack={() => setSelectedOrderId(null)} />;
    }

    return (
        <div className="p-6 md:p-10 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-5xl mx-auto">
            <div className="mb-12">
                <h3 className="text-3xl font-bold text-gray-900 tracking-tight">Purchase History</h3>
                <div className="flex items-center gap-4 mt-2">
                    <p className="text-sm text-gray-600 font-medium">Review your past orders.</p>
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                    <p className="text-sm font-bold text-[#0c4a9e] uppercase tracking-widest">{orders.length} Orders</p>
                </div>
            </div>

            {loading ? (
                <div className="py-20 text-center">Loading...</div>
            ) : orders.length === 0 ? (
                <div className="py-20 text-center">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Clock className="w-8 h-8 text-gray-300" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900">No orders yet</h4>
                    <p className="text-[14px] text-gray-500 mt-2 font-medium">When you shop, your orders will appear here.</p>
                </div>
            ) : (
                <div className="space-y-2">
                    {orders.map((order, idx) => {
                        const statusLower = String(order.status ?? '').toLowerCase();
                        const isCancelled = statusLower.includes('cancel');
                        const isDelivered = statusLower.includes('delivered');
                        const statusColor = isCancelled
                            ? 'bg-red-600/10 text-red-700'
                            : isDelivered
                                ? 'bg-green-600/10 text-green-700'
                                : 'bg-[#0c4a9e]/10 text-[#0c4a9e]';

                        const displayAmount = Number(order.grand_total ?? 0);

                        return (
                            <div key={order.id}>
                                <div className="group py-10 flex flex-col lg:flex-row gap-8 transition-all duration-500 relative">
                                    <div className="flex-1 space-y-6">
                                        <div className="flex wrap items-center gap-4">
                                            <h4 className="text-xl font-bold text-gray-900 tracking-tight">{order.order_number}</h4>
                                            <span className={`text-sm px-2.5 py-1 rounded tracking-widest ${statusColor}`}>
                                                {order.status}
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-500">
                                                    <Calendar className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500 tracking-widest">Ordered On</p>
                                                    
                                                    <p className="text-sm font-bold text-gray-700">
                                                        {new Intl.DateTimeFormat('en-GB', {
                                                            day: '2-digit',
                                                            month: 'short',
                                                            year: 'numeric',
                                                        }).format(new Date(order.order_date)).replace(/ /g, '-')}
                                                    </p>

                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <div
                                                    className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                                        isDelivered
                                                            ? 'bg-green-50 text-green-500'
                                                            : isCancelled
                                                                ? 'bg-red-50 text-red-500'
                                                                : 'bg-blue-50 text-[#0c4a9e]'
                                                    }`}
                                                >
                                                    {isDelivered ? <CheckCircle2 className="w-4 h-4" /> : <Timer className="w-4 h-4" />}
                                                </div>
                                                <div>
                                                    <p className="text-sm tracking-widest">
                                                        {isDelivered ? 'Delivered' : isCancelled ? 'Cancelled' : 'In progress'}
                                                    </p>
                                                    <p className="text-sm font-bold text-[#0c4a9e]">{order.status}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Phase 2 note: Products/rating require a new API; kept out for now */}
                                    </div>

                                    <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end justify-between lg:justify-center gap-6 lg:min-w-[240px]">
                                        <div className="lg:text-right">
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total</p>
                                            <p className="text-3xl font-bold text-gray-900 tracking-tighter">${displayAmount.toFixed(2)}</p>
                                            
                                        </div>

                                        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                                            <button
                                                onClick={() => setSelectedOrderId(String(order.id))}
                                                className="flex-1 sm:flex-none flex items-center justify-center gap-2 text-gray-800 border-2 border-gray-300 px-5 py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-wider hover:bg-gray-100 transition-all group/btn"
                                            >
                                                View Details <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {idx < orders.length - 1 && <div className="h-px bg-gray-300 w-full" />}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

