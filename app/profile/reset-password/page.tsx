'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCustomerAuth } from '@/context/CustomerAuthContext';
import { apiUrl } from '@/lib/api';

export default function ResetPasswordPage() {
  const { isAuthenticated, isLoaded } = useCustomerAuth();
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isLoaded && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isLoaded, isAuthenticated, router]);

  if (!isLoaded || !isAuthenticated) {
    return null;
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null);
    setError(null);

    if (newPassword !== confirmPassword) {
      setError('New password and confirmation do not match.');
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(apiUrl('/api/customer/change-password'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword,
          new_password_confirmation: confirmPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Unable to update password.');
      } else {
        setMessage(data.message || 'Password updated successfully.');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (err) {
      setError('Unable to update password. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-full mx-auto min-h-[80vh] px-0">
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 flex flex-col lg:flex-row overflow-hidden">
        <div className="lg:w-72 border-b lg:border-b-0 lg:border-r border-gray-200/60">
          <div className="w-full h-full py-8 px-6">
            <div className="rounded-3xl border border-gray-100 bg-gray-50 p-6">
              <h2 className="text-lg font-semibold text-gray-900">Reset Password</h2>
              <p className="text-sm text-gray-600 mt-2">Change your account password securely.</p>
            </div>
          </div>
        </div>
        <div className="flex-1 min-w-0 transition-all duration-300 p-8 md:p-12">
          <div className="max-w-xl mx-auto">
            <div className="flex flex-col gap-2 mb-8">
              <h1 className="text-2xl font-semibold text-gray-900">Reset Password</h1>
              <p className="text-sm text-gray-600">Enter your current password and choose a new one.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none focus:border-[#0c4a9e] focus:bg-white focus:ring-2 focus:ring-[#0c4a9e]/10 transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={8}
                  className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none focus:border-[#0c4a9e] focus:bg-white focus:ring-2 focus:ring-[#0c4a9e]/10 transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={8}
                  className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none focus:border-[#0c4a9e] focus:bg-white focus:ring-2 focus:ring-[#0c4a9e]/10 transition-all"
                />
              </div>

              {error && (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              {message && (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                  {message}
                </div>
              )}

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full sm:w-auto inline-flex items-center justify-center rounded-2xl bg-[#0c4a9e] px-6 py-3 text-sm font-semibold text-white hover:bg-[#0a3d82] transition-all disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? 'Updating…' : 'Update Password'}
                </button>
                <Link
                  href="/profile/personal"
                  className="w-full sm:w-auto inline-flex items-center justify-center rounded-2xl border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-700 hover:border-gray-300 hover:bg-gray-50 transition-all"
                >
                  Back to Personal Info
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
