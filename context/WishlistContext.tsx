'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '@/components/product/ProductCard';
import { apiUrl } from '@/lib/api';
import { useCustomerAuth } from '@/context/CustomerAuthContext';

interface WishlistContextType {
    wishlist: Product[];
    addToWishlist: (product: Product) => void;
    removeFromWishlist: (productId: string | number) => void;
    isInWishlist: (productId: string | number) => boolean;
    toggleWishlist: (product: Product) => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
    const [wishlist, setWishlist] = useState<Product[]>([]);
    const { isAuthenticated } = useCustomerAuth();

    useEffect(() => {
        if (!isAuthenticated) {
            try {
                const saved = localStorage.getItem('wishlist');
                if (saved) {
                    setWishlist(JSON.parse(saved));
                } else {
                    setWishlist([]);
                }
            } catch (error) {
                console.error('Failed to load guest wishlist', error);
                setWishlist([]);
            }
            return;
        }

        const loadWishlist = async () => {
            try {
                const res = await fetch(apiUrl('/api/customer/wishlist'), {
                    method: 'GET',
                    headers: {'Accept': 'application/json'},
                    credentials: 'include',
                });

                if (!res.ok) {
                    throw new Error('Failed to load wishlist');
                }

                const data = await res.json();
                setWishlist(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error('Failed to load wishlist', error);
                setWishlist([]);
            }
        };

        loadWishlist();
    }, [isAuthenticated]);

    useEffect(() => {
        if (!isAuthenticated) {
            localStorage.setItem('wishlist', JSON.stringify(wishlist));
        }
    }, [isAuthenticated, wishlist]);

    const addToWishlist = (product: Product) => {
        if (!isAuthenticated) {
            setWishlist(prev => {
                const exists = prev.some(item => item.id === product.id);
                const next = exists ? prev : [...prev, product];
                localStorage.setItem('wishlist', JSON.stringify(next));
                return next;
            });
            return;
        }

        const addToWishlistApi = async () => {
            try {
                const res = await fetch(apiUrl('/api/customer/wishlist'), {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
                    body: JSON.stringify({ product_id: product.id }),
                    credentials: 'include',
                });

                if (!res.ok) {
                    throw new Error('Failed to add wishlist item');
                }

                const updated = await res.json();
                setWishlist(Array.isArray(updated) ? updated : prev => prev);
            } catch (error) {
                console.error('Failed to add wishlist item', error);
            }
        };

        addToWishlistApi();
    };

    const removeFromWishlist = (productId: string | number) => {
        if (!isAuthenticated) {
            setWishlist(prev => {
                const next = prev.filter(item => item.id !== productId);
                localStorage.setItem('wishlist', JSON.stringify(next));
                return next;
            });
            return;
        }

        const removeFromWishlistApi = async () => {
            try {
                const res = await fetch(apiUrl(`/api/customer/wishlist/${productId}`), {
                    method: 'DELETE',
                    headers: {'Accept': 'application/json'},
                    credentials: 'include',
                });

                if (!res.ok) {
                    throw new Error('Failed to remove wishlist item');
                }

                const updated = await res.json().catch(() => null);
                if (Array.isArray(updated)) {
                    setWishlist(updated);
                } else {
                    setWishlist(prev => prev.filter(item => item.id !== productId));
                }
            } catch (error) {
                console.error('Failed to remove wishlist item', error);
            }
        };

        removeFromWishlistApi();
    };

    const isInWishlist = (productId: string | number) => {
        return wishlist.some(p => p.id === productId);
    };

    const toggleWishlist = (product: Product) => {
        if (isInWishlist(product.id)) {
            removeFromWishlist(product.id);
        } else {
            addToWishlist(product);
        }
    };

    return (
        <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist, toggleWishlist }}>
            {children}
        </WishlistContext.Provider>
    );
}

export function useWishlist() {
    const context = useContext(WishlistContext);
    if (context === undefined) {
        throw new Error('useWishlist must be used within a WishlistProvider');
    }
    return context;
}
