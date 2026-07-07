'use client';

import React from 'react';

type LastOrder = {
  id: number;
  order_number: string;
  order_date: string;
  status: string;
  grand_total: number;
};

export type DashboardSummaryPayload = {
  total_orders: number;
  active_orders: number;
  saved_addresses_count: number;
  wishlist_count: number;
  reward_points: number;
  last_5_orders: LastOrder[];
};

export default function DashboardSummary({
  summary,
}: {
  summary: DashboardSummaryPayload;
}) {
  const last5 = summary?.last_5_orders ?? [];

  return (
    <div className="p-8 md:p-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <h3 className="text-3xl font-bold text-gray-900 tracking-tight">
        Dashboard
      </h3>
      <p className="text-sm text-gray-600 mt-2 font-medium">
        Overview of your recent activity.
      </p>

      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="rounded-2xl border border-gray-100 bg-gray-50/30 p-6">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            Total Orders
          </p>
          <p className="text-3xl font-bold text-[#0c4a9e] mt-2">
            {summary.total_orders}
          </p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-gray-50/30 p-6">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            Active Orders
          </p>
          <p className="text-3xl font-bold text-[#0c4a9e] mt-2">
            {summary.active_orders}
          </p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-gray-50/30 p-6">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            Saved Addresses
          </p>
          <p className="text-3xl font-bold text-[#0c4a9e] mt-2">
            {summary.saved_addresses_count}
          </p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-gray-50/30 p-6">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            Wishlist Count
          </p>
          <p className="text-3xl font-bold text-[#0c4a9e] mt-2">
            {summary.wishlist_count}
          </p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-gray-50/30 p-6 lg:col-span-2">
          <div className="flex items-center justify-between gap-6">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                Reward Points
              </p>
              <p className="text-3xl font-bold text-[#0c4a9e] mt-2">
                {summary.reward_points}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600 font-medium">
                Earn points on each order.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-10 rounded-2xl border border-gray-100 p-6 bg-white">
        <div className="flex items-start justify-between gap-6">
          <div>
            <h4 className="text-lg font-semibold text-gray-900">Recent Activity</h4>
            <p className="text-sm text-gray-500 mt-2 font-medium">
              Last 5 orders
            </p>
          </div>
        </div>

        {last5.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-gray-500 font-medium">No orders yet.</p>
          </div>
        ) : (
          <div className="mt-6 space-y-3">
            {last5.map((order) => (
              <div
                key={order.id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-xl border border-gray-100 bg-gray-50/20 px-4 py-3"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-gray-900">
                      {order.order_number}
                    </span>
                    <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                      {order.status}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 mt-1 font-medium">
                    Ordered on {order.order_date}
                  </div>
                </div>

                <div className="font-bold text-[#0c4a9e] text-lg">
                  ${Number(order.grand_total).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Quick Actions placeholders for Phase 1 */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {[
            'Reorder Last Purchase',
            'View Wishlist',
            'Track Current Order',
            'Manage Addresses',
            'Update Profile',
          ].map((label) => (
            <button
              key={label}
              className="flex items-center justify-center rounded-xl border border-gray-100 bg-white px-3 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
              type="button"
              onClick={() => {
                // Phase 1: no routing yet
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

