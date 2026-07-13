import React, { useEffect, useState } from 'react';
import { User, Package, MapPin, Heart, LogOut, Key } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCustomerAuth } from '@/context/CustomerAuthContext';
import { apiUrl } from '@/lib/api';

interface ProfileSidebarProps {
  activeTab: string;
  setActiveTab?: (tab: string) => void;
}

type MePayload = {
  id: number | null;
  name: string;
  email: string;
  profile_image?: string | null;
};

export default function ProfileSidebar({
  activeTab,
  setActiveTab,
}: ProfileSidebarProps) {
  const [me, setMe] = useState<MePayload | null>(null);
  const router = useRouter();
  const { customer, isAuthenticated, logout } = useCustomerAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      setMe(null);
      return;
    }

    const loadMe = async () => {
      if (customer?.name) {
        setMe({
          id: customer.id || null,
          name: customer.name || '',
          email: customer.email || '',
          profile_image: customer.profile_image || customer.avatar || null,
        });
      }

      try {
        const res = await fetch(apiUrl('/api/me'), {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
        });

        if (!res.ok) throw new Error('Failed to load /api/me');
        const data = (await res.json()) as MePayload;
        setMe(data);
      } catch {
        setMe({
          id: customer?.id || null,
          name: customer?.name || 'Customer',
          email: customer?.email || '',
          profile_image: customer?.profile_image || null,
        });
      }
    };

    loadMe();
  }, [customer, isAuthenticated]);

  const menuItems = [
    {
      id: 'personal',
      label: 'Personal Information',
      href: '/profile/personal',
      icon: <User className="w-[18px] h-[18px]" />,
    },
    {
      id: 'orders',
      label: 'My Orders',
      href: '/profile/orders',
      icon: <Package className="w-[18px] h-[18px]" />,
    },
    {
      id: 'addresses',
      label: 'Manage Addresses',
      href: '/profile/addresses',
      icon: <MapPin className="w-[18px] h-[18px]" />,
    },
    {
      id: 'wishlist',
      label: 'My Wishlist',
      href: '/profile/wishlist',
      icon: <Heart className="w-[18px] h-[18px]" />
    },
    {
      id: 'reset-password',
      label: 'Reset Password',
      href: '/profile/reset-password',
      icon: <Key className="w-[18px] h-[18px]" />
    },
  ];

  const name = me?.name || customer?.name || 'Customer';
  const email = me?.email || customer?.email || '';
  const avatarUrl = me?.profile_image || null;

  if (!isAuthenticated) {
    return (
      <div className="w-full h-full py-8 px-6">
        <div className="rounded-3xl border border-gray-100 bg-gray-50 p-6">
          <h2 className="text-lg font-semibold text-gray-900">Sign in to manage your account</h2>
          <p className="text-sm text-gray-600 mt-2">Orders, addresses, and wishlist items are only visible after login.</p>
          <div className="mt-4 flex gap-3">
            <Link href="/login" className="px-4 py-2 rounded-xl bg-[#0c4a9e] text-white text-sm font-semibold">
              Login
            </Link>
            <Link href="/register" className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700">
              Register
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full py-8">
      {/* Minimal User Profile Header */}
      <div className="flex items-center gap-4 mb-10 px-8">
        <div
          className="w-12 h-12 rounded-full bg-[#0c4a9e] flex items-center justify-center text-white text-base font-semibold shadow-sm overflow-hidden"
          aria-label="User avatar"
        >
          {avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={avatarUrl}
              alt="User avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            <span>{name.split(' ')[0]?.slice(0, 2).toUpperCase() || 'U'}</span>
          )}
        </div>
        <div>
          <h2 className="text-base font-semibold text-gray-900 tracking-tight">
            {name}
          </h2>
          <p className="text-sm text-gray-600 font-medium">{email}</p>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="space-y-1 px-4">
        {menuItems.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            onClick={() => setActiveTab && setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 
              ${
                activeTab === item.id
                  ? 'bg-[#0c4a9e] text-white shadow-lg shadow-[#0c4a9e]/20'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
          >
            <span
              className={`${
                activeTab === item.id ? 'text-white' : 'text-gray-600'
              }`}
            >
              {item.icon}
            </span>
            <span className="font-semibold text-sm tracking-tight">
              {item.label}
            </span>
          </Link>
        ))}

        <div className="pt-6 mt-6 border-t border-gray-100 px-4">
          <button 
            onClick={() => {
              logout();
              router.push('/');
            }}
            className="flex items-center gap-3 text-red-500 hover:text-red-600 transition-colors font-semibold text-sm tracking-tight group w-full text-left" 
            type="button"
          >
            <LogOut className="w-[18px] h-[18px] group-hover:-translate-x-0.5 transition-transform" />
            <span>Logout</span>
          </button>
        </div>
      </nav>
    </div>
  );
}

