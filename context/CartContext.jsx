'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(undefined);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [couponCode, setCouponCode] = useState(null);
  const [discount, setDiscount] = useState(0);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('giftora_cart');
      if (saved) {
        setItems(JSON.parse(saved));
      }
      const savedCoupon = localStorage.getItem('giftora_coupon');
      if (savedCoupon) {
        setCouponCode(savedCoupon);
      }
    } catch (e) {
      console.warn('Could not read cart from localStorage');
    }
  }, []);

  // Save cart to localStorage on update
  useEffect(() => {
    try {
      localStorage.setItem('giftora_cart', JSON.stringify(items));
    } catch (e) {
      // ignore
    }
  }, [items]);

  const addItem = (newItem) => {
    setItems((prev) => {
      const basePrice = newItem.product.discountPrice ?? newItem.product.basePrice;
      const customCharge = newItem.customizationCharges ?? 0;
      const packCharge = newItem.giftPackaging ? (newItem.product.customizationOptions?.premiumPackagingPrice ?? 40) : 0;

      const itemRecord = {
        _id: `cart_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        productId: newItem.product._id,
        product: newItem.product,
        quantity: newItem.quantity,
        selectedVariant: newItem.selectedVariant,
        customizationId: newItem.customizationId,
        customization: newItem.customization,
        itemPrice: basePrice,
        customizationCharges: customCharge + packCharge,
        giftPackaging: newItem.giftPackaging,
      };

      return [...prev, itemRecord];
    });
  };

  const updateQuantity = (index, quantity) => {
    setItems((prev) => {
      if (quantity <= 0) {
        return prev.filter((_, i) => i !== index);
      }
      const updated = [...prev];
      updated[index] = { ...updated[index], quantity: Math.min(50, quantity) };
      return updated;
    });
  };

  const removeItem = (index) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const clearCart = () => {
    setItems([]);
    setCouponCode(null);
    setDiscount(0);
    localStorage.removeItem('giftora_cart');
    localStorage.removeItem('giftora_coupon');
  };

  const subtotal = items.reduce((acc, item) => {
    const unitPrice = (item.itemPrice || 0) + (item.customizationCharges || 0);
    return acc + unitPrice * item.quantity;
  }, 0);

  const shipping = subtotal >= 999 || subtotal === 0 ? 0 : 79;
  const total = Math.max(0, subtotal - discount + shipping);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const applyCoupon = async (code) => {
    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, orderAmount: subtotal }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, message: data.error || 'Invalid coupon code' };
      }
      setCouponCode(data.coupon.code);
      setDiscount(data.coupon.discountAmount);
      localStorage.setItem('giftora_coupon', data.coupon.code);
      return { success: true, message: `Coupon ${data.coupon.code} applied! Saved ₹${data.coupon.discountAmount}` };
    } catch (err) {
      return { success: false, message: err.message || 'Error validating coupon' };
    }
  };

  const removeCoupon = () => {
    setCouponCode(null);
    setDiscount(0);
    localStorage.removeItem('giftora_coupon');
  };

  return (
    <CartContext.Provider
      value={{
        items,
        subtotal,
        discount,
        shipping,
        total,
        couponCode,
        itemCount,
        addItem,
        updateQuantity,
        removeItem,
        applyCoupon,
        removeCoupon,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
