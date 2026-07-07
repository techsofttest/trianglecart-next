'use client';

import React, { useEffect, useState } from 'react';
import ProductRow from './ProductRow';
import { Product } from './ProductCard';

interface BuyItAgainRowProps {
    fallbackProducts: Product[];
}

export default function BuyItAgainRow({ fallbackProducts }: BuyItAgainRowProps) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const checkUser = () => {
            const userStr = localStorage.getItem('user');
            if (userStr) {
                try {
                    const user = JSON.parse(userStr);
                    if (user && user.isLoggedIn) {
                        setIsLoggedIn(true);
                        return;
                    }
                } catch (e) {
                    // ignore
                }
            }
            setIsLoggedIn(false);
        };
        checkUser();
        window.addEventListener('userUpdate', checkUser);
        return () => window.removeEventListener('userUpdate', checkUser);
    }, []);

    if (!isLoggedIn) return null;

    return (
        <ProductRow
            title="Buy It Again"
            products={fallbackProducts}
viewAllLink="/profile/orders"
        />
    );
}
