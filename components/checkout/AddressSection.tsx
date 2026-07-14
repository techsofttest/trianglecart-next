'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MapPin, CheckCircle2, Search, ArrowRight, ThumbsUp, Edit2, Plus, Loader2, Sparkles, Check, Save } from 'lucide-react';
import { apiUrl } from '@/lib/api';
import { useCustomerAuth } from '@/context/CustomerAuthContext';

interface Address {
    id: number;
    label?: string;
    contact_name: string;
    phone: string;
    address_line_1: string;
    address_line_2?: string;
    suburb?: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
    latitude?: number | null;
    longitude?: number | null;
    google_place_id?: string;
    delivery_notes?: string;
    is_default_shipping: boolean;
    is_default_billing: boolean;
}

interface AddressSectionProps {
    addressForm: any;
    setAddressForm: (form: any) => void;
    onOpenLocation: () => void;
    isConfirmed: boolean;
    setIsConfirmed: (val: boolean) => void;
    selectedAddressId?: number | null;
    setSelectedAddressId?: (id: number | null) => void;
}

export default function AddressSection({
    addressForm,
    setAddressForm,
    onOpenLocation,
    isConfirmed,
    setIsConfirmed,
    selectedAddressId: propSelectedAddressId,
    setSelectedAddressId: propSetSelectedAddressId
}: AddressSectionProps) {
    const { isAuthenticated } = useCustomerAuth();
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [localSelectedAddressId, setLocalSelectedAddressId] = useState<number | null>(null);
    const selectedAddressId = propSelectedAddressId !== undefined ? propSelectedAddressId : localSelectedAddressId;
    const setSelectedAddressId = propSetSelectedAddressId || setLocalSelectedAddressId;

    const [showNewAddressForm, setShowNewAddressForm] = useState(false);
    const [isSavingNewAddress, setIsSavingNewAddress] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [fieldErrors, setFieldErrors] = useState<Record<string, boolean>>({});

    // New Address Form State
    const [newAddress, setNewAddress] = useState({
        label: '',
        contact_name: '',
        phone: '',
        address_line_1: '',
        address_line_2: '',
        suburb: '',
        city: '',
        state: '',
        postcode: '',
        country: 'Australia',
        latitude: null as number | null,
        longitude: null as number | null,
        google_place_id: '',
        delivery_notes: ''
    });

    const autocompleteInputRef = useRef<HTMLInputElement>(null);
    const autocompleteRef = useRef<any>(null);

    // Fetch addresses from backend
    const loadAddresses = async () => {
        setIsLoading(true);
        try {
            const res = await fetch(apiUrl('/api/customer/addresses'), {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include'
            });

            if (res.ok) {
                const data = (await res.json()) as Address[];
                setAddresses(data);
                if (data.length > 0) {
                    // Auto-select the default address
                    const defaultAddress = data.find(a => a.is_default_shipping || a.is_default_billing);
                    const selected = defaultAddress || data[0];
                    setSelectedAddressId(selected.id);
                    selectAddressFields(selected);
                    setShowNewAddressForm(false);
                    setIsConfirmed(true);
                } else {
                    setShowNewAddressForm(true);
                }
            } else {
                throw new Error('Failed to load addresses');
            }
        } catch (e) {
            console.warn('Backend addresses load in checkout failed, loading fallback');
            const saved = localStorage.getItem('triangle-saved-addresses');
            const data: Address[] = saved ? JSON.parse(saved) : [];
            setAddresses(data);
            if (data.length > 0) {
                const defaultShipping = data.find(a => a.is_default_shipping || a.is_default_billing);
                const selected = defaultShipping || data[0];
                setSelectedAddressId(selected.id);
                selectAddressFields(selected);
                setShowNewAddressForm(false);
                setIsConfirmed(true);
            } else {
                setShowNewAddressForm(true);
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            loadAddresses();
        } else {
            setIsLoading(false);
            setShowNewAddressForm(true);
        }
    }, [isAuthenticated]);

    // Set checkout form address fields
    const selectAddressFields = (addr: Address) => {
        setAddressForm({
            name: addr.contact_name,
            phone: addr.phone,
            email: addressForm.email || 'customer@example.com',
            address: `${addr.address_line_1}${addr.address_line_2 ? ', ' + addr.address_line_2 : ''}, ${addr.suburb ? addr.suburb + ', ' : ''}${addr.city}, ${addr.state} ${addr.postcode}, ${addr.country}`,
            type: addr.label || 'Home',
            contact_name: addr.contact_name,
            address_line_1: addr.address_line_1,
            address_line_2: addr.address_line_2 || '',
            suburb: addr.suburb || '',
            city: addr.city,
            state: addr.state,
            postcode: addr.postcode,
            country: addr.country || 'Australia',
            latitude: addr.latitude || null,
            longitude: addr.longitude || null,
            google_place_id: addr.google_place_id || '',
            delivery_notes: addr.delivery_notes || '',
            label: addr.label || 'Home'
        });
    };

    // Listen to selection change
    const handleSelectAddress = (id: number) => {
        setSelectedAddressId(id);
        const addr = addresses.find(a => a.id === id);
        if (addr) {
            selectAddressFields(addr);
            setShowNewAddressForm(false);
        }
    };

    // Autocomplete script loading for new address form
    useEffect(() => {
        if (!showNewAddressForm) return;

        const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
        if (!apiKey) {
            console.warn('Google Maps API key missing. Autocomplete disabled.');
            return;
        }

        const initAutocomplete = () => {
            if (!autocompleteInputRef.current || !(window as any).google) return;

            autocompleteRef.current = new (window as any).google.maps.places.Autocomplete(
                autocompleteInputRef.current,
                {
                    types: ['address'],
                    componentRestrictions: { country: 'au' }
                }
            );
            // Only trigger Google Places after 3+ characters.
            // We can't rely on Autocomplete's internal threshold, so we guard the
            // selection callback.
            autocompleteRef.current.addListener('place_changed', () => {
                const inputValue = (autocompleteInputRef.current?.value || '').trim();
                // Guard: only accept place changes if user typed 3+ chars.
                if (inputValue.replace(/\s/g, '').length < 3) return;

                const place = autocompleteRef.current.getPlace();
                if (!place || !place.address_components) return;


                let streetNumber = '';
                let route = '';
                let suburb = '';
                let city = '';
                let state = '';
                let postcode = '';
                let country = 'Australia';

                for (const component of place.address_components) {
                    const types = component.types;
                    if (types.includes('street_number')) {
                        streetNumber = component.long_name;
                    }
                    if (types.includes('route')) {
                        route = component.long_name;
                    }
                    if (types.includes('sublocality_level_1') || types.includes('neighborhood') || types.includes('locality')) {
                        suburb = component.long_name;
                        city = component.long_name;
                    }
                    if (types.includes('locality')) {
                        city = component.long_name;
                    }
                    if (types.includes('administrative_area_level_1')) {
                        state = component.short_name;
                    }
                    if (types.includes('postal_code')) {
                        postcode = component.long_name;
                    }
                    if (types.includes('country')) {
                        country = component.long_name;
                    }
                }

                setNewAddress(prev => ({
                    ...prev,
                    address_line_1: `${streetNumber} ${route}`.trim() || place.name || '',
                    suburb: suburb,
                    city: city,
                    state: state,
                    postcode: postcode,
                    country: country,
                    latitude: place.geometry?.location?.lat() || null,
                    longitude: place.geometry?.location?.lng() || null,
                    google_place_id: place.place_id || ''
                }));
            });
        };

        if ((window as any).google) {
            initAutocomplete();
        } else {
            const scriptId = 'google-maps-places-script';
            let script = document.getElementById(scriptId) as HTMLScriptElement;
            if (!script) {
                script = document.createElement('script');
                script.id = scriptId;
                script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
                script.async = true;
                script.defer = true;
                script.onload = initAutocomplete;
                document.head.appendChild(script);
            } else {
                script.addEventListener('load', initAutocomplete);
            }
        }
    }, [showNewAddressForm, isConfirmed]);

    // Save new address from checkout
    const handleSaveNewAddress = async () => {
        const errors: Record<string, boolean> = {};
        if (!newAddress.contact_name) errors.contact_name = true;
        if (!newAddress.phone) errors.phone = true;
        if (!newAddress.address_line_1) errors.address_line_1 = true;
        if (!newAddress.city) errors.city = true;
        if (!newAddress.state) errors.state = true;
        if (!newAddress.postcode) errors.postcode = true;
        if (Object.keys(errors).length > 0) {
            setFieldErrors(errors);
            setErrorMsg('Please fill in all mandatory fields (*)');
            return;
        }

        setIsSavingNewAddress(true);
        setErrorMsg(null);
        try {
            const res = await fetch(apiUrl('/api/customer/addresses'), {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(newAddress),
                credentials: 'include'
            });

            if (res.ok) {
                const savedAddr = (await res.json()) as Address;
                setShowNewAddressForm(false);
                await loadAddresses();
                setSelectedAddressId(savedAddr.id);
                selectAddressFields(savedAddr);
            } else if (res.status === 401) {
                throw new Error('Unauthenticated');
            } else {
                const errorData = await res.json().catch(() => ({}));
                setErrorMsg(errorData.message || 'Failed to save address.');
            }
        } catch {
            // Local storage fallback
            const saved = localStorage.getItem('triangle-saved-addresses');
            const cached: Address[] = saved ? JSON.parse(saved) : [];
            const mockId = Date.now();
            const newAddrWithId = {
                ...newAddress,
                id: mockId,
                is_default_shipping: cached.length === 0,
                is_default_billing: cached.length === 0
            };
            const updated = [...cached, newAddrWithId];
            localStorage.setItem('triangle-saved-addresses', JSON.stringify(updated));
            window.dispatchEvent(new Event('addressUpdate'));
            
            setShowNewAddressForm(false);
            setSelectedAddressId(mockId);
            selectAddressFields(newAddrWithId);
        } finally {
            setIsSavingNewAddress(false);
        }
    };

    const handleConfirmTemporaryAddress = () => {
        const errors: Record<string, boolean> = {};
        if (!newAddress.contact_name) errors.contact_name = true;
        if (!newAddress.phone) errors.phone = true;
        if (!newAddress.address_line_1) errors.address_line_1 = true;
        if (!newAddress.city) errors.city = true;
        if (!newAddress.state) errors.state = true;
        if (!newAddress.postcode) errors.postcode = true;
        if (Object.keys(errors).length > 0) {
            setFieldErrors(errors);
            setErrorMsg('Please fill in all mandatory fields (*)');
            return;
        }

        setErrorMsg(null);
        const formattedAddress = `${newAddress.address_line_1}${newAddress.address_line_2 ? ', ' + newAddress.address_line_2 : ''}, ${newAddress.suburb ? newAddress.suburb + ', ' : ''}${newAddress.city}, ${newAddress.state} ${newAddress.postcode}, ${newAddress.country}`;

        setAddressForm({
            name: newAddress.contact_name,
            phone: newAddress.phone,
            email: addressForm.email || 'customer@example.com',
            address: formattedAddress,
            type: newAddress.label || 'Home',
            contact_name: newAddress.contact_name,
            address_line_1: newAddress.address_line_1,
            address_line_2: newAddress.address_line_2 || '',
            suburb: newAddress.suburb || '',
            city: newAddress.city,
            state: newAddress.state,
            postcode: newAddress.postcode,
            country: newAddress.country || 'Australia',
            latitude: newAddress.latitude || null,
            longitude: newAddress.longitude || null,
            google_place_id: newAddress.google_place_id || '',
            delivery_notes: newAddress.delivery_notes || '',
            label: newAddress.label || 'Home'
        });

        if (setSelectedAddressId) {
            setSelectedAddressId(null);
        }
        setIsConfirmed(true);
    };

    if (isLoading) {
        return (
            <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin text-[#0c4a9e] mr-3" />
                <span className="text-gray-500 font-semibold">Loading delivery locations...</span>
            </div>
        );
    }

    return (
        <div className={`bg-white p-6 rounded-[32px] border shadow-sm space-y-6 transition-all duration-500 ${isConfirmed ? 'border-green-100 bg-green-50/5' : 'border-gray-100'}`}>
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors duration-500 ${isConfirmed ? 'bg-green-100 text-green-600' : 'bg-blue-50 text-[#0c4a9e]'}`}>
                        {isConfirmed ? <CheckCircle2 className="w-5 h-5" /> : <MapPin className="w-5 h-5" />}
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">Delivery Address</h3>
                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                            {isConfirmed ? 'Address confirmed successfully!' : 'Where should we send your order?'}
                        </p>
                    </div>
                </div>
            </div>

            {isConfirmed ? (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 bg-green-50/50 border border-green-100 p-6 rounded-2xl">
                    <div className="flex items-start gap-4">
                        <div className="space-y-1">
                           
                            <p className="text-sm text-gray-600 leading-relaxed">
                                Shipping to <span className="font-bold text-gray-900">{addressForm.name}</span> at:
                            </p>
                            <p className="text-sm font-semibold text-gray-800 italic mt-1">
                                {addressForm.address}
                            </p>
                            <div className="pt-3 flex gap-2">
                                <button 
                                    onClick={() => setIsConfirmed(false)}
                                    className="flex items-center gap-1.5 text-xs font-bold text-[#0c4a9e] hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-all uppercase tracking-wider"
                                >
                                    <Edit2 className="w-3 h-3" />
                                    Change Delivery Location
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="space-y-6">
                    {/* Address Selection List */}
                    {addresses.length > 0 && !showNewAddressForm && (
                        <div className="space-y-3">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Select Delivery Address</label>
                            <div className="grid grid-cols-1 gap-3">
                                {addresses.map((item) => (
                                    <div 
                                        key={item.id}
                                        onClick={() => handleSelectAddress(item.id)}
                                        className={`flex items-start gap-4 p-4 rounded-2xl border-2 transition-all text-left cursor-pointer ${
                                            selectedAddressId === item.id 
                                                ? 'border-[#0c4a9e] bg-blue-50/10' 
                                                : 'border-gray-100 hover:border-gray-200 bg-white'
                                        }`}
                                    >
                                        <div className="mt-1 flex items-center justify-center shrink-0">
                                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedAddressId === item.id ? 'border-[#0c4a9e]' : 'border-gray-300'}`}>
                                                {selectedAddressId === item.id && (
                                                    <div className="w-2.5 h-2.5 bg-[#0c4a9e] rounded-full" />
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-sm font-bold text-gray-900">{item.contact_name}</span>
                                                <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded">
                                                    {item.label || 'Other'}
                                                </span>
                                                {(item.is_default_shipping || item.is_default_billing) && (
                                                    <span className="text-[9px] font-bold uppercase tracking-wider px-1 bg-green-50 text-green-600 rounded border border-green-100">
                                                        Default
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-xs text-gray-600 leading-relaxed font-semibold">
                                                {item.address_line_1}{item.address_line_2 ? ', ' + item.address_line_2 : ''}, {item.suburb ? item.suburb + ', ' : ''}{item.city}, {item.state} {item.postcode}
                                            </p>
                                            <p className="text-[11px] text-gray-400 font-medium mt-1">Phone: {item.phone}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <button 
                                onClick={() => {
                                    setShowNewAddressForm(true);
                                    setSelectedAddressId(null);
                                    setNewAddress({
                                        label: '',
                                        contact_name: '',
                                        phone: '',
                                        address_line_1: '',
                                        address_line_2: '',
                                        suburb: '',
                                        city: '',
                                        state: '',
                                        postcode: '',
                                        country: 'Australia',
                                        latitude: null,
                                        longitude: null,
                                        google_place_id: '',
                                        delivery_notes: ''
                                    });
                                }}
                                className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-gray-200 hover:border-[#0c4a9e] hover:text-[#0c4a9e] transition-colors py-3.5 rounded-2xl text-xs font-bold text-gray-500 mt-2"
                            >
                                <Plus className="w-4 h-4" /> Add New Address
                            </button>
                        </div>
                    )}

                    {/* New Address Form (Autocompleted via Google Places) */}
                    {(showNewAddressForm || addresses.length === 0) && (
                        <div className="space-y-5 animate-in fade-in duration-300">
                            <div className="flex justify-between items-center px-1">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Add New Address Details</label>
                                {addresses.length > 0 && (
                                    <button 
                                        onClick={() => {
                                            setShowNewAddressForm(false);
                                            if (addresses.length > 0) {
                                                const first = addresses[0];
                                                setSelectedAddressId(first.id);
                                                selectAddressFields(first);
                                            }
                                        }}
                                        className="text-xs font-bold text-[#0c4a9e] hover:underline"
                                    >
                                        Select Saved Address
                                    </button>
                                )}
                            </div>



                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-2 space-y-1.5">
                                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider ml-1">Search Address (Google Places)*</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type="text"
                                            ref={autocompleteInputRef}
                                            placeholder="Search your street address..."
                                            className="w-full bg-gray-50 border border-gray-300 rounded-2xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-blue-200 transition-all font-semibold"
                                        />
                                    </div>
                                </div>

                                {isAuthenticated && (
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-gray-700 uppercase tracking-wider ml-1">Label (e.g. Home, Work)*</label>
                                        <input
                                            type="text"
                                            value={newAddress.label}
                                            onChange={(e) => setNewAddress({ ...newAddress, label: e.target.value })}
                                            placeholder="Home / Work / Parents"
                                            className="w-full bg-gray-50 border border-gray-300 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-blue-200 transition-all"
                                        />
                                    </div>
                                )}

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider ml-1">Receiver Name*</label>
                                    <input
                                        type="text"
                                        value={newAddress.contact_name}
                                        onChange={(e) => setNewAddress({ ...newAddress, contact_name: e.target.value })}
                                        onFocus={() => setFieldErrors(prev => ({ ...prev, contact_name: false }))}
                                        placeholder="Receiver Name"
                                        className={`w-full bg-gray-50 border rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-blue-200 transition-all ${fieldErrors.contact_name ? 'border-red-400 bg-red-50/30' : 'border-gray-300'}`}
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider ml-1">Phone Number*</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-600">+61</span>
                                        <input
                                            type="tel"
                                            value={newAddress.phone.startsWith('+61') ? newAddress.phone.replace(/^\+61\s?/, '') : newAddress.phone}
                                            onChange={(e) => {
                                                const raw = e.target.value;
                                                const digitsOnly = raw.replace(/\D/g, '');
                                                setNewAddress({ ...newAddress, phone: `+61${digitsOnly}` });
                                            }}
                                            onFocus={() => setFieldErrors(prev => ({ ...prev, phone: false }))}
                                            placeholder="4XX XXX XXX"
                                            inputMode="numeric"
                                            className={`w-full bg-gray-50 border rounded-2xl pl-14 pr-4 py-3 text-sm focus:outline-none focus:border-blue-200 transition-all ${fieldErrors.phone ? 'border-red-400 bg-red-50/30' : 'border-gray-300'}`}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider ml-1">Street Address Line 1*</label>
                                    <input
                                        type="text"
                                        value={newAddress.address_line_1}
                                        readOnly={true}
                                        placeholder="Auto-filled via search"
                                        className={`w-full bg-gray-100 border rounded-2xl px-4 py-3 text-sm focus:outline-none cursor-not-allowed font-medium text-gray-500 ${fieldErrors.address_line_1 ? 'border-red-400 bg-red-50/30' : 'border-gray-300'}`}
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider ml-1">Address Line 2 (Optional)</label>
                                    <input
                                        type="text"
                                        value={newAddress.address_line_2}
                                        onChange={(e) => setNewAddress({ ...newAddress, address_line_2: e.target.value })}
                                        placeholder="Apartment, suite, unit"
                                        className="w-full bg-gray-50 border border-gray-300 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-blue-200 transition-all"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider ml-1">Suburb</label>
                                    <input
                                        type="text"
                                        value={newAddress.suburb}
                                        readOnly={true}
                                        placeholder="Auto-filled via search"
                                        className="w-full bg-gray-100 border border-gray-300 rounded-2xl px-4 py-3 text-sm focus:outline-none cursor-not-allowed font-medium text-gray-500"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider ml-1">City*</label>
                                    <input
                                        type="text"
                                        value={newAddress.city}
                                        readOnly={true}
                                        placeholder="Auto-filled via search"
                                        className={`w-full bg-gray-100 border rounded-2xl px-4 py-3 text-sm focus:outline-none cursor-not-allowed font-medium text-gray-500 ${fieldErrors.city ? 'border-red-400 bg-red-50/30' : 'border-gray-300'}`}
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider ml-1">State*</label>
                                    <input
                                        type="text"
                                        value={newAddress.state}
                                        readOnly={true}
                                        placeholder="Auto-filled via search"
                                        className={`w-full bg-gray-100 border rounded-2xl px-4 py-3 text-sm focus:outline-none cursor-not-allowed font-medium text-gray-500 ${fieldErrors.state ? 'border-red-400 bg-red-50/30' : 'border-gray-300'}`}
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider ml-1">Postcode*</label>
                                    <input
                                        type="text"
                                        value={newAddress.postcode}
                                        readOnly={true}
                                        placeholder="Auto-filled via search"
                                        className={`w-full bg-gray-100 border rounded-2xl px-4 py-3 text-sm focus:outline-none cursor-not-allowed font-medium text-gray-500 ${fieldErrors.postcode ? 'border-red-400 bg-red-50/30' : 'border-gray-300'}`}
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider ml-1">Country*</label>
                                    <input
                                        type="text"
                                        value={newAddress.country}
                                        readOnly={true}
                                        placeholder="Auto-filled via search"
                                        className="w-full bg-gray-100 border border-gray-300 rounded-2xl px-4 py-3 text-sm focus:outline-none cursor-not-allowed font-medium text-gray-500"
                                    />
                                </div>

                                <div className="md:col-span-2 space-y-1.5">
                                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider ml-1">Delivery Notes (Optional)</label>
                                    <textarea
                                        rows={2}
                                        value={newAddress.delivery_notes}
                                        onChange={(e) => setNewAddress({ ...newAddress, delivery_notes: e.target.value })}
                                        className="w-full bg-gray-50 border border-gray-300 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-blue-200 transition-all resize-none"
                                        placeholder="Drop off instructions..."
                                    />
                                </div>
                            </div>

                            {errorMsg && (
                                <div className="bg-red-50 text-red-600 text-xs font-bold p-3.5 rounded-xl border border-red-100">
                                    {errorMsg}
                                </div>
                            )}

                            {isAuthenticated ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                                    <button 
                                        onClick={handleSaveNewAddress}
                                        disabled={isSavingNewAddress}
                                        className="w-full bg-[#0c4a9e] text-white py-3.5 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-blue-800 transition-all flex items-center justify-center gap-2"
                                    >
                                        {isSavingNewAddress ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                                            </>
                                        ) : (
                                            <>
                                                <Save className="w-4 h-4" /> Save to Book & Use
                                            </>
                                        )}
                                    </button>
                                    <button 
                                        onClick={handleConfirmTemporaryAddress}
                                        className="w-full bg-gray-100 text-gray-700 py-3.5 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
                                    >
                                        Use Temporarily
                                    </button>
                                </div>
                            ) : (
                                <button 
                                    onClick={handleConfirmTemporaryAddress}
                                    className="w-full bg-[#0c4a9e] text-white py-3.5 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-blue-800 transition-all flex items-center justify-center gap-2"
                                >
                                    Confirm Address
                                </button>
                            )}
                        </div>
                    )}

                    {/* Confirm Button */}
                    {!showNewAddressForm && selectedAddressId && (
                        <div className="pt-2 flex justify-end">
                            <button
                                onClick={() => setIsConfirmed(true)}
                                className="w-full sm:w-auto bg-[#0c4a9e] text-white px-8 py-3.5 rounded-2xl font-bold text-sm uppercase tracking-widest shadow-xl shadow-blue-900/10 hover:bg-blue-800 transition-all flex items-center justify-center gap-3 group"
                            >
                                Confirm Address <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
