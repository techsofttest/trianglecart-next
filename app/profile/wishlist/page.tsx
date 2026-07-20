'use client';

import React from 'react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import WishlistView from '@/components/profile/WishlistView';
import ProfileSidebar from '@/components/profile/ProfileSidebar';
import { useCustomerAuth } from '@/context/CustomerAuthContext';

export default function WishlistPage() {
  const router = useRouter();
  const { isAuthenticated, isLoaded } = useCustomerAuth();

  useEffect(() => {
    if (isLoaded && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isLoaded, isAuthenticated, router]);

  if (!isLoaded || !isAuthenticated) return null;

  return (
    <div className="max-w-full mx-auto min-h-[80vh] px-0">
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 flex flex-col lg:flex-row overflow-hidden">
        <div className="lg:w-72 border-b lg:border-b-0 lg:border-r border-gray-200/60">
          <ProfileSidebar activeTab="wishlist" setActiveTab={() => {}} />
        </div>
        <div className="flex-1 min-w-0 transition-all duration-300">
          <WishlistView />
        </div>
      </div>
    </div>
  );
}

