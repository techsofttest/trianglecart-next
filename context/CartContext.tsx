'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiUrl } from '@/lib/api';

export interface CartItem {
  id: string;
  product_id: string;
  variant_id?: number | null;
  selectedVariantId?: number | null;
  selectedVariant?: any;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  brand?: string;
  weight?: string;
  category?: string;
  inStock?: boolean;
  is_free?: boolean;
  is_free_gift?: boolean;
  promotion_id?: number | null;
  free_gift_promotion_id?: number | null;
}

export interface PromotionInfo {
  type?: string;
  offer_id?: number;
  name?: string;
  qualified?: boolean;
  eligible_quantity?: number;
  current_quantity?: number;
  remaining_quantity?: number;
  free_quantity?: number;
  free_product?: any;
  message?: string;
}

export interface FreeGiftOption {
  id: number;
  name: string;
  slug?: string;
  sku?: string;
  brand_name?: string;
  brand?: { id: number; name: string } | null;
  category_name?: string;
  featured_image?: string | null;
  stock: number;
  variant_id?: number | null;
}

export interface FreeGiftInfo {
  eligible: boolean;
  minimum_cart_amount: number;
  cart_subtotal: number;
  remaining_amount: number;
  has_excluded_category: boolean;
  excluded_category_message: string | null;
  gift_options: FreeGiftOption[];
  selected_gift: FreeGiftOption | null;
  promotion_id: number | null;
  promotion_name: string | null;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: any, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  promotionInfo: PromotionInfo | null;
  freeGiftInfo: FreeGiftInfo | null;
  selectedGiftId: number | null;
  selectFreeGift: (productId: number) => Promise<void>;
  removeFreeGift: () => void;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (isOpen: boolean) => void;
  openCartDrawer: () => void;
  closeCartDrawer: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [promotionInfo, setPromotionInfo] = useState<PromotionInfo | null>(null);
  const [freeGiftInfo, setFreeGiftInfo] = useState<FreeGiftInfo | null>(null);
  const [selectedGiftId, setSelectedGiftId] = useState<number | null>(null);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);

  const openCartDrawer = () => setIsCartDrawerOpen(true);
  const closeCartDrawer = () => setIsCartDrawerOpen(false);

  // Initial load from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('triangle-cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (e) {
        console.error('Failed to parse cart from localStorage', e);
      }
    }
  }, []);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('triangle-cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Recalculate promotions & free gifts with backend source of truth
  useEffect(() => {
    if (!cartItems) {
      setPromotionInfo(null);
      setFreeGiftInfo(null);
      return;
    }

    const userPaidCart = cartItems.filter(i => !i.is_free && !i.is_free_gift);
    if (userPaidCart.length === 0) {
      if (cartItems.some(i => i.is_free || i.is_free_gift)) {
        setCartItems([]);
      }
      setPromotionInfo(null);
      setFreeGiftInfo(null);
      return;
    }

    fetch(apiUrl('/api/cart/calculate'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cart: userPaidCart,
        selected_gift_id: selectedGiftId,
      }),
      credentials: 'include',
    })
      .then(res => res.json())
      .then(data => {
        setPromotionInfo(data.promotion || null);
        setFreeGiftInfo(data.free_gift || null);
        if (data.cart_items && Array.isArray(data.cart_items)) {
          const newIdsStr = data.cart_items.map((i: any) => `${i.id}:${i.quantity}:${i.price}:${i.is_free ? 'free' : 'paid'}`).sort().join(',');
          const curIdsStr = cartItems.map((i: any) => `${i.id}:${i.quantity}:${i.price}:${i.is_free ? 'free' : 'paid'}`).sort().join(',');

          if (newIdsStr !== curIdsStr) {
            setCartItems(data.cart_items);
          }
        }
      })
      .catch(() => {});
  }, [
    cartItems
      .filter(i => !i.is_free && !i.is_free_gift)
      .map(i => `${i.id}:${i.quantity}:${i.price}`)
      .join(','),
    selectedGiftId,
  ]);

  const selectFreeGift = async (productId: number) => {
    setSelectedGiftId(productId);
    const userPaidCart = cartItems.filter(i => !i.is_free && !i.is_free_gift);
    try {
      const res = await fetch(apiUrl('/api/free-gift/select'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_id: productId,
          cart: userPaidCart,
        }),
        credentials: 'include',
      });
      const data = await res.json();
      if (res.ok) {
        setFreeGiftInfo(data.free_gift || null);
        if (data.cart_items && Array.isArray(data.cart_items)) {
          setCartItems(data.cart_items);
        }
      }
    } catch (e) {
      console.error('Failed to select free gift', e);
    }
  };

  const removeFreeGift = () => {
    setSelectedGiftId(null);
    setCartItems(prev => prev.filter(i => !i.is_free_gift));
  };

  const addToCart = (product: any, quantity: number = 1) => {
    if (!product) return;
    const selectedVariant = product.selectedVariant ?? (
      product.variants && Array.isArray(product.variants)
        ? product.variants.find((v: any) => v.id === (product.selectedVariantId ?? product.variant_id))
        : null
    );
    const stock = selectedVariant?.stock ?? product.stock ?? (product.inStock === false ? 0 : 9999);
    if (product.is_active === false || product.inStock === false || stock <= 0) {
      return;
    }

    setCartItems(prev => {
      const selectedVariantId = product.selectedVariantId ?? product.variant_id ?? null;
      const existing = prev.find(item =>
        !item.is_free &&
        !item.is_free_gift &&
        item.id === String(product.id) &&
        (item.selectedVariantId ?? item.variant_id ?? null) === selectedVariantId
      );
      if (existing) {
        return prev.map(item => {
          if (!item.is_free && !item.is_free_gift && item.id === String(product.id) && (item.selectedVariantId ?? item.variant_id ?? null) === selectedVariantId) {
            const maxStock = item.selectedVariant?.stock ?? 9999;
            return { ...item, quantity: Math.min(item.quantity + quantity, maxStock) };
          }
          return item;
        });
      }
      const maxStock = product.selectedVariant?.stock ?? 9999;
      return [...prev, {
        id: String(product.id),
        product_id: String(product.id),
        variant_id: product.variant_id ?? selectedVariantId ?? null,
        selectedVariantId: selectedVariantId,
        selectedVariant: product.selectedVariant ?? null,
        name: product.name,
        price: product.price,
        image: product.image,
        brand: product.brand || 'General',
        weight: product.weight || 'N/A',
        category: product.category || 'General',
        inStock: product.inStock !== undefined ? product.inStock : true,
        quantity: Math.min(quantity, maxStock),
        is_free: false,
      }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCartItems(prev => prev.filter(item => item.id !== productId && !item.is_free && !item.is_free_gift));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems(prev =>
      prev.map(item => {
        if (item.id === productId && !item.is_free && !item.is_free_gift) {
          const maxStock = item.selectedVariant?.stock ?? 9999;
          return { ...item, quantity: Math.min(Math.max(1, quantity), maxStock) };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setSelectedGiftId(null);
    setCartItems([]);
  };

  const cartTotal = cartItems.reduce((acc, item) => acc + (((item.is_free || item.is_free_gift) ? 0 : item.price) * item.quantity), 0);
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      cartItems, addToCart, removeFromCart, updateQuantity, clearCart,
      cartTotal, cartCount, promotionInfo, freeGiftInfo, selectedGiftId,
      selectFreeGift, removeFreeGift,
      isCartDrawerOpen, setIsCartDrawerOpen, openCartDrawer, closeCartDrawer
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
