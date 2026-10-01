'use client';

import React, { useState } from 'react';
import { useCart, FreeGiftOption } from '@/context/CartContext';
import { resolveProductImageUrl } from '@/lib/product';
import Image from 'next/image';

interface FreeGiftSectionProps {
  compact?: boolean;
}

export const FreeGiftSection: React.FC<FreeGiftSectionProps> = ({ compact = false }) => {
  const { freeGiftInfo, selectFreeGift } = useCart();
  const [isChanging, setIsChanging] = useState(false);

  if (!freeGiftInfo || (!freeGiftInfo.promotion_id && freeGiftInfo.gift_options.length === 0) || freeGiftInfo.has_excluded_category) {
    return null;
  }

  const {
    eligible,
    minimum_cart_amount,
    remaining_amount,
    has_excluded_category,
    excluded_category_message,
    gift_options,
    selected_gift,
    promotion_name,
  } = freeGiftInfo;

  return (
    <div className={`my-4 p-4 border rounded-xl bg-gradient-to-r from-amber-50/50 to-orange-50/50 border-amber-200/80 shadow-sm ${compact ? 'text-xs' : 'text-sm'}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-lg">🎁</span>
          <h3 className="font-bold text-gray-900 tracking-wide uppercase">
            {promotion_name || 'Free Gift Promotion'}
          </h3>
        </div>
        {eligible && selected_gift && !isChanging && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
            ✓ Gift Unlocked
          </span>
        )}
      </div>

      {!eligible ? (
        /* Locked State */
        <div>
          <p className="text-gray-600 mb-3">
            Unlock a free gift with orders over <span className="font-bold text-gray-900">${minimum_cart_amount}</span>
          </p>

          <div className="grid grid-cols-2 gap-2 mb-3">
            {gift_options.map((gift: FreeGiftOption) => (
              <div
                key={gift.id}
                className="flex items-center gap-2 p-2 border border-gray-200 rounded-lg bg-gray-50 opacity-50 pointer-events-none cursor-not-allowed select-none"
              >
                {gift.featured_image ? (
                  <img
                    src={resolveProductImageUrl(gift.featured_image)}
                    alt={gift.name}
                    className="w-10 h-10 object-cover rounded"
                  />
                ) : (
                  <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center text-xs">🎁</div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-gray-700 truncate">{gift.name}</p>
                  {gift.brand_name && <p className="text-xs text-gray-400">{gift.brand_name}</p>}
                </div>
              </div>
            ))}
          </div>

          <div className="p-2.5 bg-amber-100/60 border border-amber-300/50 rounded-lg text-amber-900 font-medium text-xs text-center">
            Add <span className="font-bold text-amber-950">${remaining_amount.toFixed(2)}</span> more to unlock your free gift.
          </div>
        </div>
      ) : (
        /* Eligible State */
        <div>
          {selected_gift && !isChanging ? (
            /* Selected Gift State */
            <div className="bg-white p-3 border border-emerald-300 rounded-lg flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3">
                {selected_gift.featured_image ? (
                  <img
                    src={resolveProductImageUrl(selected_gift.featured_image)}
                    alt={selected_gift.name}
                    className="w-12 h-12 object-cover rounded-md border border-gray-100"
                  />
                ) : (
                  <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-md flex items-center justify-center text-lg font-bold">🎁</div>
                )}
                <div>
                  <p className="font-semibold text-gray-900 flex items-center gap-1.5">
                    <span className="text-emerald-600">✓</span> {selected_gift.name}
                  </p>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-bold text-emerald-600">$0.00</span>
                    {selected_gift.brand_name && <span className="text-gray-400">• {selected_gift.brand_name}</span>}
                  </div>
                </div>
              </div>
              {gift_options.length > 1 && (
                <button
                  type="button"
                  onClick={() => setIsChanging(true)}
                  className="px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-md transition-colors"
                >
                  Change free gift
                </button>
              )}
            </div>
          ) : (
            /* Choose Gift Options State */
            <div>
              <p className="font-semibold text-gray-800 mb-2">
                {gift_options.length === 1 ? 'Your Free Gift:' : 'Choose 1 free gift:'}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
                {gift_options.map((gift: FreeGiftOption) => {
                  const isSelected = selected_gift?.id === gift.id;
                  return (
                    <button
                      key={gift.id}
                      type="button"
                      onClick={async () => {
                        await selectFreeGift(gift.id);
                        setIsChanging(false);
                      }}
                      className={`flex items-center justify-between p-2.5 border rounded-lg text-left transition-all ${
                        isSelected
                          ? 'border-emerald-500 bg-emerald-50 ring-2 ring-emerald-400'
                          : 'border-gray-200 bg-white hover:border-amber-400 hover:bg-amber-50/30'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        {gift.featured_image ? (
                          <img
                            src={resolveProductImageUrl(gift.featured_image)}
                            alt={gift.name}
                            className="w-10 h-10 object-cover rounded"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-amber-100 text-amber-700 rounded flex items-center justify-center font-bold text-xs">🎁</div>
                        )}
                        <div className="min-w-0">
                          <p className="font-medium text-gray-900 text-xs truncate">{gift.name}</p>
                          <p className="text-xs font-bold text-emerald-600">$0.00</p>
                        </div>
                      </div>
                      <span className={`px-2.5 py-1 text-xs font-semibold rounded-md ${
                        isSelected
                          ? 'bg-emerald-600 text-white'
                          : 'bg-amber-500 hover:bg-amber-600 text-white'
                      }`}>
                        {isSelected ? 'Selected' : 'Select'}
                      </span>
                    </button>
                  );
                })}
              </div>

              {selected_gift && isChanging && (
                <div className="text-right">
                  <button
                    type="button"
                    onClick={() => setIsChanging(false)}
                    className="text-xs text-gray-500 hover:text-gray-700 underline"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
