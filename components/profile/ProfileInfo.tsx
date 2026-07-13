import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCustomerAuth } from '@/context/CustomerAuthContext';
import { apiUrl } from '@/lib/api';

export default function ProfileInfo() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [registeredAt, setRegisteredAt] = useState('');
    const [loading, setLoading] = useState(true);
    const { customer, isAuthenticated } = useCustomerAuth();

    useEffect(() => {
        if (!isAuthenticated) {
            setLoading(false);
            return;
        }

        const fetchProfile = async () => {
            try {
                const res = await fetch(apiUrl('/api/me'), {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                });

                if (!res.ok) {
                    throw new Error('Failed to fetch profile.');
                }

                const data = await res.json();
                setName(data.name || customer?.name || '');
                setEmail(data.email || customer?.email || '');
                setRegisteredAt(data.registered_at || '');
            } catch {
                setName(customer?.name || '');
                setEmail(customer?.email || '');
                setRegisteredAt('');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [customer, isAuthenticated]);

    if (!isAuthenticated) {
        return (
            <div className="p-8 md:p-12">
                <div className="rounded-3xl border border-gray-100 bg-gray-50 p-8">
                    <h3 className="text-2xl font-semibold text-gray-900 tracking-tight">Personal Information</h3>
                    <p className="text-sm text-gray-600 mt-2 font-medium">Sign in to view your account details.</p>
                    <Link href="/login" className="inline-flex mt-4 px-4 py-2 rounded-xl bg-[#0c4a9e] text-white text-sm font-semibold">
                        Login
                    </Link>
                </div>
            </div>
        );
    }

    const formatDate = (dateString: string) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        if (Number.isNaN(date.getTime())) return dateString;
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = String(date.getFullYear());
        return `${day}-${month}-${year}`;
    };

    return (
        <div className="p-8 md:p-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div>
                    <h3 className="text-2xl font-semibold text-gray-900 tracking-tight">Personal Information</h3>
                    <p className="text-sm text-gray-600 mt-2 font-medium">Your account details are displayed for easy reference.</p>
                </div>
                <Link
                    href="/profile/reset-password"
                    className="inline-flex items-center justify-center rounded-2xl bg-red-600 text-white font-semibold py-3 px-6 hover:bg-red-700 transition-all text-sm"
                >
                    Reset Password
                </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <div className="rounded-3xl border border-gray-100 bg-gray-50 p-6">
                    <p className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-3">Full Name</p>
                    <p className="text-lg font-semibold text-gray-900">{loading ? 'Loading...' : name || '—'}</p>
                </div>
                <div className="rounded-3xl border border-gray-100 bg-gray-50 p-6">
                    <p className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-3">Email Address</p>
                    <p className="text-lg font-semibold text-gray-900">{loading ? 'Loading...' : email || '—'}</p>
                </div>
                <div className="rounded-3xl border border-gray-100 bg-gray-50 p-6 md:col-span-2">
                    <p className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-3">Registered On</p>
                    <p className="text-lg font-semibold text-gray-900">{loading ? 'Loading...' : formatDate(registeredAt) || '—'}</p>
                </div>
            </div>

            <div className="mt-12 pt-8 border-t border-gray-100">
                <p className="text-sm text-gray-600 leading-relaxed max-w-2xl">
                    This information is kept secure and only shared with you. If you need to update your profile details, please contact support.
                </p>
            </div>
        </div>
    );
}
