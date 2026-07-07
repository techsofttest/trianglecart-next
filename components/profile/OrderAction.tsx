'use client';

import React, { useState } from 'react';
import { 
    ArrowLeft, Check, Info, 
    ShieldCheck, AlertTriangle,
    ThumbsDown, Box, Clock, DollarSign,
    RotateCcw, MessageSquare, FileText,
    MousePointerClick, MapPin, Package,
    XCircle
} from 'lucide-react';

import ActionConfirmation from './ActionConfirmation';

interface Product {
    id: number | string;
    name: string;
    price: number;
    quantity: number;
    weight: string;
    image: string;
    brand: string;
}

interface OrderActionProps {
    order: {
        id: string;
        date: string;
        items: Product[];
    };
    onBack: () => void;
    mode: 'return' | 'cancel';
}

const REASONS = {
    return: [
        { label: "Item was damaged on arrival", icon: AlertTriangle },
        { label: "Product quality not as expected", icon: ThumbsDown },
        { label: "Wrong item sent", icon: Box },
        { label: "Item arrived too late", icon: Clock },
        { label: "Found a better price elsewhere", icon: DollarSign },
        { label: "Don't need it anymore", icon: RotateCcw },
        { label: "Other (please specify below)", icon: MessageSquare }
    ],
    cancel: [
        { label: "Order placed by mistake", icon: MousePointerClick },
        { label: "Items taking too long to arrive", icon: Clock },
        { label: "Found a better price elsewhere", icon: DollarSign },
        { label: "Need to change shipping address", icon: MapPin },
        { label: "Need to add/remove items", icon: Package },
        { label: "Changed my mind", icon: RotateCcw },
        { label: "Other (please specify below)", icon: MessageSquare }
    ]
};

const POLICIES = {
    return: {
        title: "Return & Refund Policy",
        content: "Items must be returned within 7 days of delivery in their original packaging. Perishable goods like fresh vegetables and dairy can only be returned if damaged upon arrival.",
        icon: FileText,
        color: "amber"
    },
    cancel: {
        title: "Cancellation Policy",
        content: "Orders can be cancelled anytime before they are shipped. Once shipped, you must wait for delivery and initiate a return request instead.",
        icon: XCircle,
        color: "red"
    }
};

export default function OrderAction({ order, onBack, mode }: OrderActionProps) {
    const [selectedItems, setSelectedItems] = useState<Set<number | string>>(new Set(
        mode === 'cancel' ? order.items.map(i => i.id) : []
    ));
    const [reason, setReason] = useState("");
    const [message, setMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const toggleItem = (id: number | string) => {
        const newSelected = new Set(selectedItems);
        if (newSelected.has(id)) {
            newSelected.delete(id);
        } else {
            newSelected.add(id);
        }
        setSelectedItems(newSelected);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedItems.size === 0) {
            alert(`Please select at least one item to ${mode}.`);
            return;
        }
        if (!reason) {
            alert(`Please select a reason for your ${mode}.`);
            return;
        }
        
        setIsSubmitting(true);
        setTimeout(() => {
            setIsSubmitting(false);
            setIsSubmitted(true);
        }, 1500);
    };

    if (isSubmitted) {
        return (
            <ActionConfirmation 
                mode={mode}
                orderId={order.id}
                selectedItems={order.items.filter(item => selectedItems.has(item.id))}
                onClose={onBack}
            />
        );
    }

    const config = mode === 'return' ? {
        title: "Return Items",
        heading: "Select product to return",
        button: "Submit Return",
        successTitle: "Return Request Received",
        policy: POLICIES.return
    } : {
        title: "Cancel Order",
        heading: "Select items to cancel",
        button: "Cancel Order",
        successTitle: "Cancellation Requested",
        policy: POLICIES.cancel
    };

    return (
        <div className="animate-in fade-in slide-in-from-right-4 duration-500 max-w-3xl mx-auto bg-white min-h-screen">
            {/* Header */}
            <div className="sticky top-0 z-40 bg-white border-b border-gray-200 px-2 py-4 md:px-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onBack}
                        className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 text-gray-900" />
                    </button>
                    <h2 className="text-sm font-medium text-gray-900">{config.title}</h2>
                </div>
                <div className="px-3 py-1 bg-gray-100 rounded-full border border-gray-200">
                    <p className="text-sm text-gray-800 font-medium tracking-tight">ID: #{order.id}</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="px-2 md:px-4 py-8 space-y-10">
                {/* 1. Policy Message Box */}
                <div className={`${mode === 'return' ? 'bg-amber-50 border-amber-200' : 'bg-red-50 border-red-200'} border rounded-2xl p-5 flex items-start gap-4 shadow-sm`}>
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm border border-inherit">
                        <config.policy.icon className={`w-5 h-5 ${mode === 'return' ? 'text-amber-700' : 'text-red-700'}`} />
                    </div>
                    <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-1">{config.policy.title}</h4>
                        <p className="text-sm text-gray-800 leading-relaxed">
                            {config.policy.content}
                        </p>
                    </div>
                </div>

                {/* 2. Product List */}
                <div className="space-y-4">
                    <h3 className="text-sm font-medium text-gray-900 uppercase tracking-wider px-1 border-b border-gray-100 pb-2">{config.heading}</h3>
                    <div className="space-y-1">
                        {order.items.map((item) => {
                            const isSelected = selectedItems.has(item.id);
                            return (
                                <div 
                                    key={item.id}
                                    onClick={() => toggleItem(item.id)}
                                    className={`group flex items-center gap-4 py-3 px-2 border-b border-gray-200 transition-all cursor-pointer hover:bg-gray-50/80 ${
                                        isSelected ? 'bg-blue-50/50' : ''
                                    }`}
                                >
                                    <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                                        isSelected ? 'bg-[#0c4a9e] border-[#0c4a9e]' : 'border-gray-400 group-hover:border-gray-500'
                                    }`}>
                                        {isSelected && <Check className="w-3.5 h-3.5 text-white stroke-[3px]" />}
                                    </div>
                                    
                                    <div className="w-12 h-12 bg-white rounded-lg p-1 shrink-0 border border-gray-200">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply" />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-sm font-medium text-gray-900 truncate">{item.name}</h4>
                                        <p className="text-sm text-gray-800">{item.weight} • Qty: {item.quantity} • {item.brand}</p>
                                    </div>

                                    <div className="text-right">
                                        <p className="text-sm font-medium text-[#0c4a9e] tracking-tight">${item.price.toFixed(2)}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* 3. Reason Selector */}
                <div className="space-y-4">
                    <label className="text-sm font-medium text-gray-900 uppercase tracking-wider px-1">Select reason for request*</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {REASONS[mode].map((r) => {
                            const Icon = r.icon;
                            const isActive = reason === r.label;
                            return (
                                <button
                                    key={r.label}
                                    type="button"
                                    onClick={() => setReason(r.label)}
                                    className={`flex items-center p-3 rounded-2xl border-2 transition-all gap-4 text-left h-16 ${
                                        isActive 
                                        ? 'border-[#0c4a9e] bg-blue-50/80 text-[#0c4a9e] shadow-sm' 
                                        : 'border-gray-200 text-gray-800 hover:border-gray-300 hover:bg-gray-50'
                                    }`}
                                >
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                                        isActive ? 'bg-[#0c4a9e] text-white' : 'bg-gray-100 text-gray-500'
                                    }`}>
                                        <Icon className="w-5 h-5" />
                                    </div>
                                    <span className="text-sm font-medium leading-tight flex-1">{r.label}</span>
                                    {isActive && <Check className="w-4 h-4 text-[#0c4a9e]" />}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* 4. Detailed Message */}
                <div className="space-y-4">
                    <label className="text-sm font-medium text-gray-900 uppercase tracking-wider px-1">Your message*</label>
                    <div className="relative group">
                        <textarea 
                            rows={4}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Please provide a detailed explanation..."
                            className="w-full bg-gray-50 border border-gray-400 rounded-2xl px-6 py-4 text-sm font-medium text-gray-900 focus:bg-white focus:border-[#0c4a9e] transition-all outline-none resize-none placeholder:text-gray-500"
                            required
                        />
                    </div>
                    <p className="text-sm text-gray-700 italic flex items-center gap-2 px-1">
                        <Info className="w-4 h-4 text-gray-500" />
                        {mode === 'return' ? "A clear explanation helps us process your refund faster." : "Please let us know why you are cancelling to help us improve."}
                    </p>
                </div>

                {/* 5. Policies & Submit */}
                <div className="pt-8 border-t border-gray-200">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                        <div className="text-sm font-medium text-gray-800 text-center sm:text-left">
                            By submitting, you agree to our <a href="#" className="text-[#0c4a9e] hover:underline underline-offset-4 decoration-1">{config.policy.title}</a>.
                        </div>
                        <button 
                            type="submit"
                            disabled={isSubmitting || selectedItems.size === 0 || !reason}
                            className={`w-full sm:w-auto px-8 py-4 rounded-2xl font-medium text-sm uppercase tracking-widest transition-all shadow-xl whitespace-nowrap ${
                                isSubmitting || selectedItems.size === 0 || !reason
                                ? 'bg-gray-200 text-gray-500 cursor-not-allowed shadow-none'
                                : mode === 'cancel' 
                                    ? 'bg-red-600 text-white hover:bg-red-700 shadow-red-900/20 active:scale-[0.98]'
                                    : 'bg-[#0c4a9e] text-white hover:bg-blue-800 shadow-blue-900/20 active:scale-[0.98]'
                            }`}
                        >
                            {isSubmitting ? (
                                <div className="flex items-center gap-3">
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Processing...
                                </div>
                            ) : (
                                config.button
                            )}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
