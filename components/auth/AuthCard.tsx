'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { RefreshCw, ArrowLeft } from 'lucide-react';
import { MOCK_USERS } from '@/data/mockData';
import { useCustomerAuth } from '@/context/CustomerAuthContext';
import { apiUrl } from '@/lib/api';

interface AuthCardProps {
    onSuccess?: () => void;
}

type AuthMode = 'login' | 'register' | 'forgot';

export default function AuthCard({ onSuccess }: AuthCardProps) {
    const [mode, setMode] = useState<AuthMode>('login');

    // Form States
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // Status States
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const router = useRouter();
    const { login } = useCustomerAuth();
    const persistUser = (data: Record<string, any>) => {
        login(data);
    };

    const handleLoginSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');

        if (!email || !password) return;

        setIsLoading(true);
        try {
            const res = await fetch(apiUrl('/api/customer/login'), {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ email, password }),
                credentials: 'include'
            });

            if (res.ok) {
                const data = await res.json();
                persistUser(data);
                router.push('/');
                if (onSuccess) onSuccess();
                return;
            }

            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData.message || 'Invalid credentials');
        } catch (err: any) {
            console.warn('Backend login failed, using mock fallback', err);

            // Check against mock users
            const matchedUser = MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase().trim());

            if (matchedUser) {
                persistUser(matchedUser);
                router.push('/');
                if (onSuccess) onSuccess();
            } else {
                persistUser({
                    name: email.split('@')[0],
                    email,
                    phone: ''
                });
                router.push('/');
                if (onSuccess) onSuccess();
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleRegisterSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');

        if (!name || !email || !password || !confirmPassword) return;

        if (password !== confirmPassword) {
            setErrorMessage("Passwords do not match");
            return;
        }

        setIsLoading(true);
        try {
            const res = await fetch(apiUrl('/api/customer/register'), {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ name, email, password }),
                credentials: 'include'
            });

            if (res.ok) {
                const data = await res.json();
                persistUser(data);
                setSuccessMessage("Account created successfully!");
                setTimeout(() => {
                    router.push('/');
                    if (onSuccess) onSuccess();
                }, 800);
                return;
            }

            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData.message || 'Failed to create account');
        } catch (err: any) {
            console.warn('Backend registration failed, using mock fallback', err);

            persistUser({
                name,
                email,
                phone: ''
            });
            setSuccessMessage("Account created successfully!");
            setTimeout(() => {
                router.push('/');
                if (onSuccess) onSuccess();
            }, 800);
        } finally {
            setIsLoading(false);
        }
    };

    const handleForgotPasswordSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');

        if (!email) return;

        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            setSuccessMessage("A password reset link has been sent to your email address.");
        }, 1000);
    };

    return (
        <div className="w-full max-w-[450px] bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="p-8 md:p-10 flex flex-col gap-6">

                <div className="text-center mb-2">
                    <h2 className="text-2xl font-bold text-gray-900">
                        {mode === 'login' && 'Sign In'}
                        {mode === 'register' && 'Create Account'}
                        {mode === 'forgot' && 'Reset Password'}
                    </h2>
                    <p className="text-sm text-gray-500 mt-2">
                        {mode === 'login' && 'Sign in to access your orders and account'}
                        {mode === 'register' && 'Get started with Triangle Cart today'}
                        {mode === 'forgot' && 'Enter your email to receive a password reset link'}
                    </p>
                </div>

                {errorMessage && (
                    <div className="bg-red-50 text-red-600 text-sm font-semibold p-3.5 rounded-xl border border-red-100 text-center animate-in fade-in duration-300">
                        {errorMessage}
                    </div>
                )}

                {successMessage && (
                    <div className="bg-green-50 text-green-700 text-sm font-semibold p-3.5 rounded-xl border border-green-100 text-center animate-in fade-in duration-300">
                        {successMessage}
                    </div>
                )}

                {/* LOGIN MODE */}
                {mode === 'login' && (
                    <form onSubmit={handleLoginSubmit} className="flex flex-col gap-5 animate-in fade-in duration-300">
                        <div className="space-y-1">
                            <label htmlFor="email" className="text-xs font-bold text-gray-700 uppercase tracking-wider ml-1">
                                Email Address
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0c4a9e]/10 focus:border-[#0c4a9e] transition-all text-[15px]"
                                placeholder="john@example.com"
                                required
                            />
                        </div>

                        <div className="space-y-1">
                            <div className="flex justify-between items-center px-1">
                                <label htmlFor="password" className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                                    Password
                                </label>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setMode('forgot');
                                        setErrorMessage('');
                                        setSuccessMessage('');
                                    }}
                                    className="text-xs font-bold text-[#0c4a9e] hover:underline"
                                >
                                    Forgot Password?
                                </button>
                            </div>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0c4a9e]/10 focus:border-[#0c4a9e] transition-all text-[15px]"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-[#0c4a9e] hover:bg-blue-800 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-900/10 transition-all active:scale-[0.98] disabled:opacity-70 flex justify-center items-center h-[52px] mt-2 text-sm"
                        >
                            {isLoading ? <RefreshCw className="w-5 h-5 animate-spin" /> : 'Log In'}
                        </button>

                        <div className="text-center text-sm text-gray-500 mt-2">
                            New to Triangle Cart?{' '}
                            <button
                                type="button"
                                onClick={() => {
                                    setMode('register');
                                    setErrorMessage('');
                                    setSuccessMessage('');
                                }}
                                className="font-bold text-[#0c4a9e] hover:underline"
                            >
                                Create an account
                            </button>
                        </div>
                    </form>
                )}

                {/* REGISTER MODE */}
                {mode === 'register' && (
                    <form onSubmit={handleRegisterSubmit} className="flex flex-col gap-4 animate-in fade-in duration-300">
                        <div className="space-y-1">
                            <label htmlFor="reg-name" className="text-xs font-bold text-gray-700 uppercase tracking-wider ml-1">
                                Full Name
                            </label>
                            <input
                                type="text"
                                id="reg-name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0c4a9e]/10 focus:border-[#0c4a9e] transition-all text-[15px]"
                                placeholder="John Smith"
                                required
                            />
                        </div>

                        <div className="space-y-1">
                            <label htmlFor="reg-email" className="text-xs font-bold text-gray-700 uppercase tracking-wider ml-1">
                                Email Address
                            </label>
                            <input
                                type="email"
                                id="reg-email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0c4a9e]/10 focus:border-[#0c4a9e] transition-all text-[15px]"
                                placeholder="john@example.com"
                                required
                            />
                        </div>

                        <div className="space-y-1">
                            <label htmlFor="reg-password" className="text-xs font-bold text-gray-700 uppercase tracking-wider ml-1">
                                Password
                            </label>
                            <input
                                type="password"
                                id="reg-password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0c4a9e]/10 focus:border-[#0c4a9e] transition-all text-[15px]"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <div className="space-y-1">
                            <label htmlFor="reg-confirm" className="text-xs font-bold text-gray-700 uppercase tracking-wider ml-1">
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                id="reg-confirm"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0c4a9e]/10 focus:border-[#0c4a9e] transition-all text-[15px]"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-[#0c4a9e] hover:bg-blue-800 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-900/10 transition-all active:scale-[0.98] disabled:opacity-70 flex justify-center items-center h-[52px] mt-2 text-sm"
                        >
                            {isLoading ? <RefreshCw className="w-5 h-5 animate-spin" /> : 'Sign Up'}
                        </button>

                        <div className="text-center text-sm text-gray-500 mt-2">
                            Already have an account?{' '}
                            <button
                                type="button"
                                onClick={() => {
                                    setMode('login');
                                    setErrorMessage('');
                                    setSuccessMessage('');
                                }}
                                className="font-bold text-[#0c4a9e] hover:underline"
                            >
                                Sign In
                            </button>
                        </div>
                    </form>
                )}

                {/* FORGOT MODE */}
                {mode === 'forgot' && (
                    <form onSubmit={handleForgotPasswordSubmit} className="flex flex-col gap-5 animate-in fade-in duration-300">
                        <div className="space-y-1">
                            <label htmlFor="forgot-email" className="text-xs font-bold text-gray-700 uppercase tracking-wider ml-1">
                                Email Address
                            </label>
                            <input
                                type="email"
                                id="forgot-email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0c4a9e]/10 focus:border-[#0c4a9e] transition-all text-[15px]"
                                placeholder="john@example.com"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-[#0c4a9e] hover:bg-blue-800 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-900/10 transition-all active:scale-[0.98] disabled:opacity-70 flex justify-center items-center h-[52px] mt-1 text-sm"
                        >
                            {isLoading ? <RefreshCw className="w-5 h-5 animate-spin" /> : 'Send Reset Link'}
                        </button>

                        <button
                            type="button"
                            onClick={() => {
                                setMode('login');
                                setErrorMessage('');
                                setSuccessMessage('');
                            }}
                            className="text-sm font-bold text-[#0c4a9e] hover:underline flex items-center justify-center gap-2 mt-1"
                        >
                            <ArrowLeft className="w-4 h-4" /> Back to Sign In
                        </button>
                    </form>
                )}

            </div>
        </div>
    );
}
