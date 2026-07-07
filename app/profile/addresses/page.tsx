'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AddressBook from '@/components/profile/AddressBook';
import ProfileSidebar from '@/components/profile/ProfileSidebar';
import { useCustomerAuth } from '@/context/CustomerAuthContext';

export default function AddressesPage() {
  const router = useRouter();
  const { isAuthenticated } = useCustomerAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="max-w-full mx-auto min-h-[80vh] px-0">
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 flex flex-col lg:flex-row overflow-hidden">
        <div className="lg:w-72 border-b lg:border-b-0 lg:border-r border-gray-200/60">
          <ProfileSidebar activeTab="addresses" setActiveTab={() => {}} />
        </div>
        <div className="flex-1 min-w-0 transition-all duration-300">
          <AddressBook />
        </div>
      </div>
    </div>
  );
}

