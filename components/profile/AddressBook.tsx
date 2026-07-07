'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Plus, Edit2, Trash2, ArrowLeft, Save, MapPin, Check, Star, ShieldAlert, Loader2 } from 'lucide-react';
import { apiUrl } from '@/lib/api';

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

export default function AddressBook() {
    // 1. Core State
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    // Form State
    const [formData, setFormData] = useState({
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

    // Refs for Google Places Autocomplete
    const autocompleteInputRef = useRef<HTMLInputElement>(null);
    const autocompleteRef = useRef<any>(null);

    // Fetch addresses from backend
    const loadAddresses = async () => {
        setIsLoading(true);
        setErrorMsg(null);
        try {
            const res = await fetch(apiUrl('/api/customer/addresses'), {
                method: 'GET',
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                credentials: 'include'
            });

            if (res.ok) {
                const data = await res.json();
                setAddresses(data);
                localStorage.setItem('triangle-saved-addresses', JSON.stringify(data));
                window.dispatchEvent(new Event('addressUpdate'));
            } else {
                throw new Error('API returned error');
            }
        } catch (e) {
            // Fallback to locally cached addresses
            const saved = localStorage.getItem('triangle-saved-addresses');
            const cached: Address[] = saved ? JSON.parse(saved) : [];
            setAddresses(cached);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadAddresses();
    }, []);

    // Load Google Maps Autocomplete script
    useEffect(() => {
        if (!isEditing) return;

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

            autocompleteRef.current.addListener('place_changed', () => {
                const inputValue = (autocompleteInputRef.current?.value || '').trim();
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
                        city = component.long_name; // Fallback city
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

                setFormData(prev => ({
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
    }, [isEditing]);

    const handleEdit = (addr: Address) => {
        setEditingId(addr.id);
        setFormData({
            label: addr.label || '',
            contact_name: addr.contact_name || '',
            phone: addr.phone || '',
            address_line_1: addr.address_line_1 || '',
            address_line_2: addr.address_line_2 || '',
            suburb: addr.suburb || '',
            city: addr.city || '',
            state: addr.state || '',
            postcode: addr.postcode || '',
            country: addr.country || 'Australia',
            latitude: addr.latitude || null,
            longitude: addr.longitude || null,
            google_place_id: addr.google_place_id || '',
            delivery_notes: addr.delivery_notes || ''
        });
        setErrorMsg(null);
        setIsEditing(true);
    };

    const handleAddNew = () => {
        if (addresses.length >= 20) {
            alert('Maximum address limit of 20 reached.');
            return;
        }
        setEditingId(null);
        setFormData({
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
        setErrorMsg(null);
        setIsEditing(true);
    };

    const handleSave = async () => {
        if (!formData.contact_name || !formData.phone || !formData.address_line_1 || !formData.city || !formData.state || !formData.postcode) {
            setErrorMsg('Please fill in all mandatory fields (*)');
            return;
        }

        try {
            const url = editingId
                ? apiUrl(`/api/customer/addresses/${editingId}`)
                : apiUrl('/api/customer/addresses');
            const method = editingId ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(formData),
                credentials: 'include'
            });



            if (res.ok) {
                setIsEditing(false);
                loadAddresses();
            } else if (res.status === 401) {
                throw new Error('Unauthenticated');
            } else {
                const data = await res.json().catch(() => ({}));
                setErrorMsg(data.message || 'Failed to save address details.');
            }
        } catch (e) {
            console.warn('Backend save failed, using local storage update fallback');
            let updated: Address[];
            if (editingId) {
                updated = addresses.map(addr =>
                    addr.id === editingId ? { ...addr, ...formData } : addr
                );
            } else {
                const newAddr: Address = {
                    ...formData,
                    id: Date.now(),
                    is_default_shipping: addresses.length === 0,
                    is_default_billing: addresses.length === 0
                };
                updated = [...addresses, newAddr];
            }
            setAddresses(updated);
            localStorage.setItem('triangle-saved-addresses', JSON.stringify(updated));
            window.dispatchEvent(new Event('addressUpdate'));
            setIsEditing(false);
        }
    };

    const handleDelete = async (id: number) => {
        const address = addresses.find(a => a.id === id);
        if (address?.is_default_shipping || address?.is_default_billing) {
            alert('Cannot delete default address. Please select another default shipping and billing address first.');
            return;
        }

        if (!confirm('Are you sure you want to delete this address?')) return;

        try {
            const res = await fetch(apiUrl(`/api/customer/addresses/${id}`), {
                method: 'DELETE',
                headers: { 'Accept': 'application/json' },
                credentials: 'include'
            });



            if (res.ok) {
                loadAddresses();
            } else if (res.status === 401) {
                throw new Error('Unauthenticated');
            } else {
                const data = await res.json().catch(() => ({}));
                alert(data.message || 'Failed to delete address.');
            }
        } catch (e) {
            console.warn('Backend delete failed, using local storage fallback');
            const updated = addresses.filter(addr => addr.id !== id);
            setAddresses(updated);
            localStorage.setItem('triangle-saved-addresses', JSON.stringify(updated));
            window.dispatchEvent(new Event('addressUpdate'));
        }
    };

    const handleSetDefaultShipping = async (id: number) => {
        try {
            const res = await fetch(apiUrl(`/api/customer/addresses/${id}/default-shipping`), {
                method: 'POST',
                headers: { 'Accept': 'application/json' },
                credentials: 'include'
            });



            if (res.ok) {
                loadAddresses();
            } else if (res.status === 401) {
                throw new Error('Unauthenticated');
            } else {
                alert('Failed to set default shipping');
            }
        } catch (e) {
            const updated = addresses.map(addr => ({
                ...addr,
                is_default_shipping: addr.id === id
            }));
            setAddresses(updated);
            localStorage.setItem('triangle-saved-addresses', JSON.stringify(updated));
            window.dispatchEvent(new Event('addressUpdate'));
        }
    };

    const handleSetDefaultBilling = async (id: number) => {
        try {
            const res = await fetch(apiUrl(`/api/customer/addresses/${id}/default-billing`), {
                method: 'POST',
                headers: { 'Accept': 'application/json' },
                credentials: 'include'
            });



            if (res.ok) {
                loadAddresses();
            } else if (res.status === 401) {
                throw new Error('Unauthenticated');
            } else {
                alert('Failed to set default billing');
            }
        } catch (e) {
            const updated = addresses.map(addr => ({
                ...addr,
                is_default_billing: addr.id === id
            }));
            setAddresses(updated);
            localStorage.setItem('triangle-saved-addresses', JSON.stringify(updated));
            window.dispatchEvent(new Event('addressUpdate'));
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-24 text-gray-500 font-medium">
                <Loader2 className="w-8 h-8 animate-spin text-[#0c4a9e] mb-4" />
                <span>Loading Address Book...</span>
            </div>
        );
    }

    if (isEditing) {
        return (
            <div className="p-8 md:p-12 animate-in fade-in duration-500">
                <div className="flex items-center justify-between mb-8">
                    <button 
                        onClick={() => setIsEditing(false)}
                        className="flex items-center gap-2 text-gray-500 hover:text-[#0c4a9e] transition-colors font-semibold text-sm group"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Back to Address Book
                    </button>
                </div>

                <div className="mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 tracking-tight">
                        {editingId ? 'Edit Address' : 'Add New Address'}
                    </h3>
                    <p className="text-sm text-gray-500 mt-2 font-medium">Please provide the delivery details below.</p>
                </div>

                {errorMsg && (
                    <div className="bg-red-50 text-red-600 text-sm font-semibold p-4 rounded-xl border border-red-100 flex items-center gap-2 mb-6 max-w-4xl">
                        <ShieldAlert className="w-5 h-5" />
                        <span>{errorMsg}</span>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 max-w-4xl">
                    {/* Google Autocomplete search */}
                    <div className="md:col-span-2 space-y-2">
                        <label className="text-xs font-bold text-gray-700 uppercase tracking-wider ml-1">Search Address (Google Places)*</label>
                        <div className="relative">
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input 
                                type="text"
                                ref={autocompleteInputRef}
                                placeholder="Search for address or enter manually..."
                                className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-3.5 pl-12 pr-6 text-sm font-semibold text-gray-900 outline-none focus:bg-white focus:border-[#0c4a9e] focus:ring-4 focus:ring-[#0c4a9e]/5 transition-all"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-700 uppercase tracking-wider ml-1">Label (e.g. Home, Work)*</label>
                        <input 
                            type="text" 
                            value={formData.label}
                            onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                            placeholder="Home / Work / Parents"
                            className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-3.5 px-6 text-sm font-semibold text-gray-900 outline-none focus:bg-white focus:border-[#0c4a9e] transition-all"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-700 uppercase tracking-wider ml-1">Recipient Name*</label>
                        <input 
                            type="text" 
                            value={formData.contact_name}
                            onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })}
                            placeholder="John Smith"
                            className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-3.5 px-6 text-sm font-semibold text-gray-900 outline-none focus:bg-white focus:border-[#0c4a9e] transition-all"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-700 uppercase tracking-wider ml-1">Contact Phone Number*</label>
                        <div className="relative">
                            <span className="absolute left-6 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-600">+61</span>
                            <input 
                                type="tel" 
                                value={formData.phone.startsWith('+61') ? formData.phone.replace(/^\+61\s?/, '') : formData.phone}
                                onChange={(e) => {
                                    const raw = e.target.value;
                                    const digitsOnly = raw.replace(/\D/g, '');
                                    setFormData({ ...formData, phone: `+61${digitsOnly}` });
                                }}
                                placeholder="4XX XXX XXX"
                                inputMode="numeric"
                                className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-3.5 pl-[3.5rem] pr-6 text-sm font-semibold text-gray-900 outline-none focus:bg-white focus:border-[#0c4a9e] transition-all"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-700 uppercase tracking-wider ml-1">Address Line 1*</label>
                        <input 
                            type="text" 
                            value={formData.address_line_1}
                            readOnly={true}
                            placeholder="Auto-filled via search"
                            className="w-full bg-gray-100 border border-gray-200 rounded-2xl py-3.5 px-6 text-sm font-medium text-gray-500 cursor-not-allowed outline-none focus:outline-none"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-700 uppercase tracking-wider ml-1">Address Line 2 (Optional)</label>
                        <input 
                            type="text" 
                            value={formData.address_line_2}
                            onChange={(e) => setFormData({ ...formData, address_line_2: e.target.value })}
                            placeholder="Suite, Apartment, etc."
                            className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-3.5 px-6 text-sm font-semibold text-gray-900 outline-none focus:bg-white focus:border-[#0c4a9e] transition-all"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-700 uppercase tracking-wider ml-1">Suburb</label>
                        <input 
                            type="text" 
                            value={formData.suburb}
                            readOnly={true}
                            placeholder="Auto-filled via search"
                            className="w-full bg-gray-100 border border-gray-200 rounded-2xl py-3.5 px-6 text-sm font-medium text-gray-500 cursor-not-allowed outline-none focus:outline-none"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-700 uppercase tracking-wider ml-1">City*</label>
                        <input 
                            type="text" 
                            value={formData.city}
                            readOnly={true}
                            placeholder="Auto-filled via search"
                            className="w-full bg-gray-100 border border-gray-200 rounded-2xl py-3.5 px-6 text-sm font-medium text-gray-500 cursor-not-allowed outline-none focus:outline-none"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-700 uppercase tracking-wider ml-1">State*</label>
                        <input 
                            type="text" 
                            value={formData.state}
                            readOnly={true}
                            placeholder="Auto-filled via search"
                            className="w-full bg-gray-100 border border-gray-200 rounded-2xl py-3.5 px-6 text-sm font-medium text-gray-500 cursor-not-allowed outline-none focus:outline-none"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-700 uppercase tracking-wider ml-1">Postcode*</label>
                        <input 
                            type="text" 
                            value={formData.postcode}
                            readOnly={true}
                            placeholder="Auto-filled via search"
                            className="w-full bg-gray-100 border border-gray-200 rounded-2xl py-3.5 px-6 text-sm font-medium text-gray-500 cursor-not-allowed outline-none focus:outline-none"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-700 uppercase tracking-wider ml-1">Country*</label>
                        <input 
                            type="text" 
                            value={formData.country}
                            readOnly={true}
                            placeholder="Auto-filled via search"
                            className="w-full bg-gray-100 border border-gray-200 rounded-2xl py-3.5 px-6 text-sm font-medium text-gray-500 cursor-not-allowed outline-none focus:outline-none"
                        />
                    </div>

                    <div className="md:col-span-2 space-y-2">
                        <label className="text-xs font-bold text-gray-700 uppercase tracking-wider ml-1">Delivery Notes (Optional)</label>
                        <textarea 
                            value={formData.delivery_notes}
                            onChange={(e) => setFormData({ ...formData, delivery_notes: e.target.value })}
                            rows={3}
                            placeholder="Drop off instructions (e.g. Leave at door if not home)"
                            className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-3.5 px-6 text-sm font-semibold text-gray-900 outline-none focus:bg-white focus:border-[#0c4a9e] transition-all resize-none"
                        />
                    </div>

                    <div className="md:col-span-2 pt-4">
                        <button 
                            onClick={handleSave}
                            className="w-full md:w-auto flex items-center justify-center gap-2 bg-[#0c4a9e] text-white font-bold py-4 px-12 rounded-2xl hover:bg-blue-800 transition-all shadow-xl shadow-[#0c4a9e]/10 active:scale-95 text-sm"
                        >
                            <Save className="w-5 h-5" /> {editingId ? 'Update Address' : 'Save Address'}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 md:p-12 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div>
                    <h3 className="text-2xl font-bold text-gray-900 tracking-tight">Delivery Address Book</h3>
                    <p className="text-sm text-gray-500 mt-2 font-medium">Your saved locations for faster checkout (max 20).</p>
                </div>
                <button 
                    onClick={handleAddNew}
                    className="flex items-center justify-center gap-2 bg-[#0c4a9e] text-white font-bold py-3.5 px-8 rounded-2xl hover:bg-blue-800 transition-all shadow-lg shadow-[#0c4a9e]/15 active:scale-95 text-sm"
                >
                    <Plus className="w-4 h-4" /> Add Address
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {addresses.map((addr) => (
                    <div key={addr.id} className="border border-gray-100 rounded-3xl p-6 bg-white shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow relative">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#0c4a9e] flex items-center justify-center text-sm font-bold">
                                        {addr.label?.slice(0, 1).toUpperCase() || '🏠'}
                                    </div>
                                    <span className="font-bold text-gray-900">{addr.label || 'Saved Location'}</span>
                                </div>

                                <div className="flex gap-2">
                                    {addr.is_default_shipping && (
                                        <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 bg-green-50 text-green-700 rounded-lg border border-green-100 flex items-center gap-1">
                                            <Check className="w-3 h-3" /> Default Shipping
                                        </span>
                                    )}
                                    {addr.is_default_billing && (
                                        <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 bg-blue-50 text-[#0c4a9e] rounded-lg border border-blue-100 flex items-center gap-1">
                                            <Check className="w-3 h-3" /> Default Billing
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-1 text-sm font-semibold text-gray-600">
                                <p className="text-gray-900 font-extrabold">{addr.contact_name}</p>
                                <p>{addr.address_line_1}</p>
                                {addr.address_line_2 && <p>{addr.address_line_2}</p>}
                                <p>{[addr.suburb, addr.city, addr.state, addr.postcode].filter(Boolean).join(', ')}</p>
                                <p>{addr.country}</p>
                                <p className="text-xs text-gray-400 font-medium mt-1">Phone: {addr.phone}</p>
                            </div>
                        </div>

                        <div className="border-t border-gray-50 mt-6 pt-4 flex flex-wrap gap-2 justify-between items-center">
                            <div className="flex gap-1">
                                <button 
                                    onClick={() => handleEdit(addr)}
                                    className="p-2 hover:bg-gray-50 text-gray-600 hover:text-gray-900 rounded-xl transition-colors font-bold text-xs flex items-center gap-1"
                                    title="Edit"
                                >
                                    <Edit2 className="w-4 h-4" /> Edit
                                </button>
                                <button 
                                    onClick={() => handleDelete(addr.id)}
                                    className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-600 rounded-xl transition-colors font-bold text-xs flex items-center gap-1"
                                    title="Delete"
                                >
                                    <Trash2 className="w-4 h-4" /> Delete
                                </button>
                            </div>

                            <div className="flex gap-1.5">
                                {!addr.is_default_shipping && (
                                    <button 
                                        onClick={() => handleSetDefaultShipping(addr.id)}
                                        className="px-3 py-1.5 bg-gray-50 hover:bg-[#0c4a9e]/5 text-gray-600 hover:text-[#0c4a9e] rounded-xl transition-colors text-xs font-bold"
                                    >
                                        Set Shipping
                                    </button>
                                )}
                                {!addr.is_default_billing && (
                                    <button 
                                        onClick={() => handleSetDefaultBilling(addr.id)}
                                        className="px-3 py-1.5 bg-gray-50 hover:bg-[#0c4a9e]/5 text-gray-600 hover:text-[#0c4a9e] rounded-xl transition-colors text-xs font-bold"
                                    >
                                        Set Billing
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}

                {addresses.length === 0 && (
                    <div className="md:col-span-2 py-20 text-center border border-dashed border-gray-100 rounded-3xl">
                        <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 font-semibold">No address saved yet.</p>
                        <p className="text-gray-400 text-xs mt-1">Add your first shipping address for delivery routing.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
