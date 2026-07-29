'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { apiUrl } from '@/lib/api';

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';
  const email = searchParams.get('email') || '';

  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = useMemo(() => Boolean(token && email), [token, email]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null);
    setError(null);

    if (!token || !email) {
      setError('This reset link is missing required information.');
      return;
    }

    if (password !== passwordConfirmation) {
      setError('Password and confirmation do not match.');
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(apiUrl('/api/reset-password'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          token,
          email,
          password,
          password_confirmation: passwordConfirmation,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || 'Unable to reset password.');
      }

      setMessage(data.message || 'Password reset successfully.');
      setPassword('');
      setPasswordConfirmation('');
      setTimeout(() => router.push('/login'), 1200);
    } catch (err: any) {
      setError(err?.message || 'Unable to reset password.');
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
              <p className="text-sm text-gray-600 mt-2">Choose a new password for your account.</p>
            </div>
          </div>
        </div>
        <div className="flex-1 min-w-0 transition-all duration-300 p-8 md:p-12">
          <div className="max-w-xl mx-auto">
            <div className="flex flex-col gap-2 mb-8">
              <h1 className="text-2xl font-semibold text-gray-900">Reset Password</h1>
              <p className="text-sm text-gray-600">
                {canSubmit ? 'Enter a new password to complete the reset.' : 'The reset link is incomplete or invalid.'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Email Address</label>
                <input
                  type="email"
                  value={email}
                  readOnly
                  className="w-full rounded-2xl border border-gray-200 bg-gray-100 px-4 py-3 text-sm text-gray-900 outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">New Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none focus:border-[#0c4a9e] focus:bg-white focus:ring-2 focus:ring-[#0c4a9e]/10 transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Confirm New Password</label>
                <input
                  type="password"
                  value={passwordConfirmation}
                  onChange={(e) => setPasswordConfirmation(e.target.value)}
                  required
                  minLength={8}
                  className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none focus:border-[#0c4a9e] focus:bg-white focus:ring-2 focus:ring-[#0c4a9e]/10 transition-all"
                />
              </div>

              {error && <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
              {message && <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</div>}

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <button
                  type="submit"
                  disabled={submitting || !canSubmit}
                  className="w-full sm:w-auto inline-flex items-center justify-center rounded-2xl bg-[#0c4a9e] px-6 py-3 text-sm font-semibold text-white hover:bg-[#0a3d82] transition-all disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? 'Resetting...' : 'Reset Password'}
                </button>
                <Link
                  href="/login"
                  className="w-full sm:w-auto inline-flex items-center justify-center rounded-2xl border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-700 hover:border-gray-300 hover:bg-gray-50 transition-all"
                >
                  Back to Sign In
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
