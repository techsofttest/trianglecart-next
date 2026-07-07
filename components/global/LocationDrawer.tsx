'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, MapPin, Search, Navigation, Home, Briefcase, Plus } from 'lucide-react';

import { MOCK_ADDRESSES } from '@/data/mockData';

interface LocationDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectLocation: (location: {
        title: string;
        subtitle: string;
        id?: string | number;
        phone?: string;
        email?: string;
        name?: string;
    }) => void;
}

const AUSTRALIAN_LOCATIONS = [
    { title: 'Sydney Opera House', subtitle: 'Bennelong Point, Sydney NSW 2000, Australia' },
    { title: 'Melbourne Cricket Ground', subtitle: 'Brunton Ave, Richmond VIC 3002, Australia' },
    { title: 'Bondi Beach', subtitle: 'Bondi Beach, NSW 2026, Australia' },
    { title: 'Surfers Paradise', subtitle: 'Gold Coast, QLD 4217, Australia' },
    { title: 'Port Arthur', subtitle: 'Arthur Hwy, Port Arthur TAS 7182, Australia' },
    { title: 'The Twelve Apostles', subtitle: 'Great Ocean Rd, Princetown VIC 3269, Australia' },
    { title: 'Darling Harbour', subtitle: 'Sydney, NSW 2000, Australia' },
    { title: 'Federation Square', subtitle: 'Swanston St & Flinders St, Melbourne VIC 3000, Australia' },
];

const getIcon = (type?: string) => {
    switch ((type ?? '').toUpperCase()) {
        case 'HOME': return Home;
        case 'WORK': return Briefcase;
        default: return MapPin;
    }
};

export default function LocationDrawer({ isOpen, onClose, onSelectLocation }: LocationDrawerProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [isLocating, setIsLocating] = useState(false);
    const [savedAddresses, setSavedAddresses] = useState<any[]>([]);
    const router = useRouter();

    useEffect(() => {
        const loadAddresses = () => {
            const saved = localStorage.getItem('triangle-saved-addresses');
            if (saved) {
                setSavedAddresses(JSON.parse(saved));
            }
        };

        loadAddresses();
        window.addEventListener('addressUpdate', loadAddresses);
        return () => window.removeEventListener('addressUpdate', loadAddresses);
    }, []);

    const filteredLocations = AUSTRALIAN_LOCATIONS.filter(location =>
        location.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        location.subtitle.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSelect = (title: string, subtitle: string, id?: string | number, phone?: string, name?: string, email?: string) => {
        onSelectLocation({ title, subtitle, id, phone, name, email });
        onClose();
    };

    const handleGetCurrentLocation = () => {
        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser");
            return;
        }

        setIsLocating(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                // Mocking a reverse geocode result for the demo
                // In a real app, you would use the lat/long with a Geocoding API
                setTimeout(() => {
                    handleSelect("Current", "Surfers Paradise, QLD 4217, Australia");
                    setIsLocating(false);
                }, 1500);
            },
            (error) => {
                setIsLocating(false);
                if (error.code === error.PERMISSION_DENIED) {
                    alert("Please enable location access in your browser settings.");
                } else {
                    alert("Unable to retrieve your location. Please try again.");
                }
            }
        );
    };

    // Prevent scrolling when drawer is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    return (
        <div className={`fixed inset-0 z-[100] flex justify-end transition-all duration-300 ${isOpen ? 'visible' : 'invisible pointer-events-none'}`}>
            {/* Backdrop */}
            <div
                className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
                onClick={onClose}
            />

            {/* Drawer Content */}
            <div className={`relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col transform transition-transform duration-300 ease-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                {/* Header */}
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Select Location</h2>
                        <p className="text-sm text-gray-500 mt-1">To see products and offers available in your area</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="w-6 h-6 text-gray-400" />
                    </button>
                </div>

                {/* Content Area */}
                <div className="p-6 space-y-6 flex-1 overflow-y-auto scrollbar-thin">
                    {/* Search Input */}
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#0c4a9e] transition-colors" />
                        <input
                            type="text"
                            placeholder="Enter pincode or suburb"
                            className="w-full pl-12 pr-12 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#0c4a9e]/10 focus:border-[#0c4a9e] transition-all text-[15px]"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm('')}
                                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 rounded-full transition-colors"
                            >
                                <X className="w-4 h-4 text-gray-500" />
                            </button>
                        )}
                    </div>

                    {searchTerm ? (
                        /* Search Results View */
                        <div className="space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
                            {filteredLocations.length > 0 ? (
                                filteredLocations.map((result, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleSelect(result.title, result.subtitle)}
                                        className="w-full flex items-start gap-4 text-left group"
                                    >
                                        <MapPin className="w-5 h-5 text-gray-400 mt-0.5 group-hover:text-[#0c4a9e] transition-colors" />
                                        <div>
                                            <span className="block text-[15px] font-semibold text-gray-900 leading-tight">{result.title}</span>
                                            <span className="text-sm text-gray-500 mt-1 block">{result.subtitle}</span>
                                        </div>
                                    </button>
                                ))
                            ) : (
                                <div className="text-center py-10">
                                    <Search className="w-10 h-10 text-gray-200 mx-auto mb-4" />
                                    <p className="text-gray-500 text-sm font-medium">No results found for "{searchTerm}"</p>
                                    <p className="text-gray-400 text-xs mt-1">Try searching for a different suburb or street</p>
                                </div>
                            )}
                        </div>
                    ) : (
                        /* Default View */
                        <>
                            {/* Current Location Button */}
                            <button
                                onClick={handleGetCurrentLocation}
                                disabled={isLocating}
                                className="w-full flex items-center gap-4 p-4 rounded-2xl border border-[#0c4a9e] bg-[#0c4a9e]/5 hover:bg-[#0c4a9e]/10 transition-colors group disabled:opacity-90 disabled:cursor-not-allowed"
                            >
                                <div className={`w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#0c4a9e] group-hover:scale-110 transition-transform ${isLocating ? 'animate-pulse' : ''}`}>
                                    {isLocating ? (
                                        <div className="w-5 h-5 border-2 border-[#0c4a9e] border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        <Navigation className="w-5 h-5" />
                                    )}
                                </div>
                                <div className="text-left">
                                    <span className="block text-sm font-bold text-[#0c4a9e]">
                                        {isLocating ? 'Locating...' : 'Use my current location'}
                                    </span>
                                    <span className="text-[12px] text-gray-500">
                                        {isLocating ? 'Accessing GPS data...' : 'Enable GPS for accurate delivery'}
                                    </span>
                                </div>
                            </button>

                            {/* Saved Addresses Section */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between px-1">
                                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Saved Address</h3>
                                    {/* <button
                                        onClick={() => {
                                            onClose();
router.push('/profile/addresses');
                                        }}
                                        className="text-[13px] font-bold text-[#0c4a9e] hover:bg-blue-50 px-2 py-1 rounded-lg transition-colors flex items-center gap-1.5"
                                    >
                                        <Plus className="w-3.5 h-3.5" />
                                        Add New
                                    </button> */}
                                </div>

                                <div className="space-y-3">
                                    {savedAddresses.map((item) => {
                                        const Icon = getIcon(item.type);
                                        return (
                                            <button
                                                key={item.id}
                                                onClick={() => handleSelect(item.type, item.address, item.id, item.phone, item.name, item.email)}
                                                className="w-full flex items-start gap-4 p-4 rounded-2xl border border-gray-50 hover:border-gray-200 hover:bg-gray-50/50 transition-all text-left group"
                                            >
                                                <div className="w-6 h-6 flex items-center justify-center text-gray-400 mt-1 group-hover:text-[#0c4a9e] transition-colors">
                                                    <Icon className="w-5 h-5" />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="block text-sm font-bold text-gray-900">{item.name}</span>
                                                        <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded">
                                                            {item.type}
                                                        </span>
                                                        {/* Primary removed */}
                                                    </div>
                                                    <span className="text-xs text-gray-500 leading-relaxed line-clamp-2">{item.address}</span>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Popular Suburbs (Mock) */}
                            {/* <div className="space-y-4 pt-4">
                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Nearby Areas</h3>
                                <div className="flex flex-wrap gap-2">
                                    {['Sydney CBD', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide', 'Gold Coast'].map((city) => (
                                        <button key={city} className="px-4 py-2 rounded-full border border-gray-100 text-sm text-gray-600 hover:border-[#0c4a9e] hover:text-[#0c4a9e] hover:bg-blue-50/30 transition-all font-medium">
                                            {city}
                                        </button>
                                    ))}
                                </div>
                            </div> */}
                        </>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-100 bg-gray-50/50">
                    <p className="text-[11px] text-gray-400 text-center leading-relaxed font-medium">
                        Delivery availability depends on your location. <br />
                        Need help? <a href="#" className="text-[#0c4a9e] hover:underline">Contact Support</a>
                    </p>
                </div>
            </div>
        </div>
    );
}
