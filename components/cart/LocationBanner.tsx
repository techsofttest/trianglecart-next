'use client';

import React from 'react';
import { MapPin } from 'lucide-react';

interface LocationBannerProps {
    selectedLocation: { title: string; subtitle: string } | null;
    onOpenDrawer: () => void;
}

export default function LocationBanner({ selectedLocation, onOpenDrawer }: LocationBannerProps) {
    return (
        <div className="bg-white p-3 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-[#0c4a9e]">
                    <MapPin className="w-5 h-5" />
                </div>
                <div>
                    <p className="text-xs font-medium text-gray-600 uppercase tracking-wider">Deliver to</p>
                    <p className="text-sm font-medium text-gray-900">
                        {selectedLocation ? (
                            <>{selectedLocation.title}, {selectedLocation.subtitle}</>
                        ) : (
                            <button onClick={onOpenDrawer} className="text-[#0c4a9e] hover:underline">
                                + Add delivery location
                            </button>
                        )}
                    </p>
                </div>
            </div>
            {selectedLocation && (
                <button
                    onClick={onOpenDrawer}
                    className="text-xs font-medium text-[#0c4a9e] border border-blue-200 px-4 py-2 rounded-lg hover:bg-blue-50 transition-all"
                >
                    Change
                </button>
            )}
        </div>
    );
}
