'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardSummary, {
  DashboardSummaryPayload,
} from '@/components/profile/DashboardSummary';
import ProfileSidebar from '@/components/profile/ProfileSidebar';
import { useCustomerAuth } from '@/context/CustomerAuthContext';
import { apiUrl } from '@/lib/api';

export default function ProfilePage() {
  const [summary, setSummary] = useState<DashboardSummaryPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { isAuthenticated, isLoaded } = useCustomerAuth();

  useEffect(() => {
    if (!isLoaded) return;

    if (!isAuthenticated) {
      router.replace('/login');
      return;
    }

    const loadSummary = async () => {
      try {
        const res = await fetch(apiUrl('/api/customer/dashboard-summary'), {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
        });

        if (!res.ok) {
          throw new Error(`Failed to load summary (${res.status})`);
        }

        const data = (await res.json()) as DashboardSummaryPayload;
        setSummary(data);
      } catch (e) {
        setSummary(null);
      } finally {
        setLoading(false);
      }
    };

    loadSummary();
  }, [isLoaded, isAuthenticated, router]);

  if (!isLoaded || !isAuthenticated) {
    return null;
  }

  if (loading || !summary) {
    return (
      <div className="max-w-full mx-auto min-h-[80vh] px-0 p-8 md:p-12">
        <div className="rounded-3xl border border-gray-100 p-8 bg-white animate-pulse">
          Loading dashboard...
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-full mx-auto min-h-[80vh] px-0">
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 flex flex-col lg:flex-row overflow-hidden">
        <div className="lg:w-72 border-b lg:border-b-0 lg:border-r border-gray-200/60">
          <ProfileSidebar activeTab="dashboard" />
        </div>
        <div className="flex-1 min-w-0 transition-all duration-300">
          <DashboardSummary summary={summary} />
        </div>
      </div>
    </div>
  );
}
