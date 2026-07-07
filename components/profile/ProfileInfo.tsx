import React, { useState, useEffect } from 'react';
import { Save, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { useCustomerAuth } from '@/context/CustomerAuthContext';

export default function ProfileInfo() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [dob, setDob] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);
    const { customer, isAuthenticated, login } = useCustomerAuth();

    // Load user data on mount
    useEffect(() => {
        if (isAuthenticated && customer) {
            setName(customer.name || '');
            setEmail(customer.email || '');
            setPhone(customer.phone || '');
            setDob(customer.dob || '');
        }
    }, [customer, isAuthenticated]);

    const handleSave = () => {
        login({
            name: name,
            email: email,
            phone: phone,
            dob: dob,
        });
        
        // Show success message
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
    };

    if (!isAuthenticated) {
        return (
            <div className="p-8 md:p-12">
                <div className="rounded-3xl border border-gray-100 bg-gray-50 p-8">
                    <h3 className="text-2xl font-semibold text-gray-900 tracking-tight">Personal Information</h3>
                    <p className="text-sm text-gray-600 mt-2 font-medium">Sign in to view and update your account details.</p>
                    <Link href="/login" className="inline-flex mt-4 px-4 py-2 rounded-xl bg-[#0c4a9e] text-white text-sm font-semibold">
                        Login
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 md:p-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div>
                    <h3 className="text-2xl font-semibold text-gray-900 tracking-tight">Personal Information</h3>
                    <p className="text-sm text-gray-600 mt-2 font-medium">Update your account details and how we contact you.</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                    <button 
                        onClick={handleSave}
                        className="flex items-center justify-center gap-2 bg-[#0c4a9e] text-white font-semibold py-3 px-8 rounded-2xl hover:bg-[#0a3d82] transition-all shadow-lg shadow-[#0c4a9e]/20 active:scale-95 text-sm"
                    >
                        <Save className="w-4 h-4" /> Save Changes
                    </button>
                    {showSuccess && (
                        <span className="text-green-600 text-sm font-bold flex items-center gap-1 animate-in fade-in slide-in-from-top-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Changes saved successfully!
                        </span>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                {/* Full Name */}
                <div className="space-y-3">
                    <label className="text-sm font-medium text-gray-600 uppercase tracking-[0.1em] ml-1">Full Name</label>
                    <div className="group">
                        <input 
                            type="text" 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. John Doe"
                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 text-sm font-medium text-gray-900 outline-none focus:bg-white focus:border-[#0c4a9e] focus:ring-4 focus:ring-[#0c4a9e]/5 transition-all placeholder:text-gray-400"
                        />
                    </div>
                </div>

                {/* Email Address */}
                <div className="space-y-3">
                    <label className="text-sm font-medium text-gray-600 uppercase tracking-[0.1em] ml-1">Email Address</label>
                    <div className="group">
                        <input 
                            type="email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="e.g. john@example.com"
                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 text-sm font-medium text-gray-900 outline-none focus:bg-white focus:border-[#0c4a9e] focus:ring-4 focus:ring-[#0c4a9e]/5 transition-all placeholder:text-gray-400"
                        />
                    </div>
                </div>

                {/* Phone Number */}
                <div className="space-y-3">
                    <label className="text-sm font-medium text-gray-600 uppercase tracking-[0.1em] ml-1">Phone Number</label>
                    <div className="group">
                        <input 
                            type="tel" 
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="e.g. +61 000 000 000"
                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 text-sm font-medium text-gray-900 outline-none focus:bg-white focus:border-[#0c4a9e] focus:ring-4 focus:ring-[#0c4a9e]/5 transition-all placeholder:text-gray-400"
                        />
                    </div>
                </div>

                {/* Date of Birth */}
                <div className="space-y-3">
                    <label className="text-sm font-medium text-gray-600 uppercase tracking-[0.1em] ml-1">Date of Birth</label>
                    <div className="group">
                        <input 
                            type="date" 
                            value={dob}
                            onChange={(e) => setDob(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 text-sm font-medium text-gray-900 outline-none focus:bg-white focus:border-[#0c4a9e] focus:ring-4 focus:ring-[#0c4a9e]/5 transition-all"
                        />
                    </div>
                </div>
            </div>

            {/* Subtle Footer Note */}
            <div className="mt-12 pt-8 border-t border-gray-50">
                <p className="text-sm text-gray-600 font-medium leading-relaxed max-w-md">
                    Your data is handled securely in accordance with our Privacy Policy. Some fields may require verification before they are permanently updated.
                </p>
            </div>
        </div>
    );
}
