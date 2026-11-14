'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { ShoppingBag, Trash2, Sparkles, ArrowRight, Gift, Tag, ShieldCheck, } from 'lucide-react';
export default function CartPage() {
    const router = useRouter();
    const { items, subtotal, discount, shipping, total, couponCode, updateQuantity, removeItem, applyCoupon, removeCoupon, } = useCart();
    const [inputCoupon, setInputCoupon] = useState('');
    const [couponMsg, setCouponMsg] = useState(null);
    const [isApplying, setIsApplying] = useState(false);
    const handleApplyCoupon = async (e) => {
        e.preventDefault();
        if (!inputCoupon.trim())
            return;
        setIsApplying(true);
        setCouponMsg(null);
        const res = await applyCoupon(inputCoupon.trim());
        setIsApplying(false);
        if (res.success) {
            setCouponMsg({ text: res.message || 'Coupon applied!', isError: false });
            setInputCoupon('');
        }
        else {
            setCouponMsg({ text: res.message || 'Invalid coupon code', isError: true });
        }
    };
    const freeShippingThreshold = 999;
    const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
    const shippingProgress = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));
    if (items.length === 0) {
        return (<div className="bg-ivory min-h-screen py-20 px-4">
        <div className="max-w-md mx-auto text-center bg-white p-10 rounded-2xl border border-beige shadow-sm">
          <div className="w-16 h-16 rounded-full bg-burgundy/10 text-burgundy flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="w-8 h-8"/>
          </div>
          <h2 className="font-serif text-2xl font-bold text-charcoal">Your Shopping Bag is Empty</h2>
          <p className="text-xs text-charcoal-muted mt-2 leading-relaxed">
            Discover our curated gifts and craft something unforgettable with personal photos and heartfelt messages.
          </p>
          <Link href="/shop" className="mt-6 inline-flex items-center space-x-2 bg-burgundy hover:bg-burgundy-dark text-white text-xs font-semibold px-6 py-3 rounded-xl shadow-sm transition-colors">
            <span>Explore Artisanal Gifts</span>
            <ArrowRight className="w-4 h-4"/>
          </Link>
        </div>
      </div>);
    }
    return (<div className="bg-ivory min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-xs uppercase tracking-widest text-gold-dark font-semibold">
              Review Bag
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-charcoal mt-0.5">
              Your Customized Gifts ({items.length})
            </h1>
          </div>
          <Link href="/shop" className="text-xs font-semibold text-burgundy hover:underline flex items-center space-x-1">
            <span>Continue Shopping</span>
            <ArrowRight className="w-3.5 h-3.5"/>
          </Link>
        </div>

        {/* Free Shipping Progress bar */}
        <div className="bg-white p-4 rounded-xl border border-beige shadow-sm mb-8">
          <div className="flex justify-between text-xs font-medium text-charcoal mb-1.5">
            <span>
              {remainingForFreeShipping > 0
            ? `Add ₹${remainingForFreeShipping} more for Free Luxury Express Shipping!`
            : '🎉 Congratulations! You have unlocked Free Luxury Express Shipping!'}
            </span>
            <span className="text-burgundy font-bold">{shippingProgress}%</span>
          </div>
          <div className="w-full h-2 bg-beige rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-gold to-burgundy transition-all duration-500" style={{ width: `${shippingProgress}%` }}/>
          </div>
        </div>

        {/* Cart Layout: Items (Cols 1-8) | Order Summary (Cols 9-12) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Cart Items List */}
          <div className="lg:col-span-8 space-y-4">
            {items.map((item, index) => {
            const unitTotal = (item.itemPrice || 0) + (item.customizationCharges || 0);
            const lineTotal = unitTotal * item.quantity;
            return (<div key={item._id || index} className="bg-white p-5 rounded-2xl border border-beige shadow-sm flex flex-col sm:flex-row gap-5">
                  {/* Thumbnail / Custom Preview */}
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-beige-light flex-shrink-0 relative border border-beige">
                    <img src={item.customization?.previewImage ||
                    item.product?.images?.[0] ||
                    'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=400&q=80'} alt={item.product?.name || 'Gift item'} className="w-full h-full object-cover"/>
                    {item.customizationId && (<span className="absolute bottom-1 right-1 bg-burgundy text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow">
                        Custom
                      </span>)}
                  </div>

                  {/* Item Details */}
                  <div className="flex-grow flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-serif text-base font-bold text-charcoal">
                            {item.product?.name || 'Personalized Gift'}
                          </h3>
                          {item.selectedVariant && (<p className="text-xs text-charcoal-muted mt-0.5">
                              {item.selectedVariant.size && `Size: ${item.selectedVariant.size}`}
                              {item.selectedVariant.color && ` • Finish: ${item.selectedVariant.color}`}
                            </p>)}
                        </div>
                        <span className="font-serif text-base font-bold text-burgundy">
                          ₹{lineTotal}
                        </span>
                      </div>

                      {/* Customization Details Summary */}
                      {item.customization && (<div className="mt-2 text-[11px] bg-beige-light/60 p-2.5 rounded-lg border border-beige space-y-1 text-charcoal">
                          <div className="flex items-center space-x-1 font-semibold text-burgundy">
                            <Sparkles className="w-3 h-3 text-gold"/>
                            <span>Bespoke Design Applied:</span>
                          </div>
                          {(item.customization.customTexts?.length ?? 0) > 0 && (<p className="italic text-charcoal-muted">
                              Lettering: &ldquo;{item.customization.customTexts?.join(', ')}&rdquo;
                            </p>)}
                          {item.giftPackaging && (<div className="flex items-center space-x-1 text-gold-dark font-medium">
                              <Gift className="w-3 h-3"/>
                              <span>Velvet Ribbon Box Included (+₹40)</span>
                            </div>)}
                        </div>)}
                    </div>

                    {/* Quantity controls & Remove */}
                    <div className="mt-4 pt-3 border-t border-beige flex items-center justify-between">
                      <div className="flex items-center border border-beige-dark rounded-lg overflow-hidden bg-white">
                        <button onClick={() => updateQuantity(index, item.quantity - 1)} className="px-2.5 py-1 text-xs text-charcoal hover:bg-beige">
                          -
                        </button>
                        <span className="px-3 py-1 text-xs font-bold">{item.quantity}</span>
                        <button onClick={() => updateQuantity(index, item.quantity + 1)} className="px-2.5 py-1 text-xs text-charcoal hover:bg-beige">
                          +
                        </button>
                      </div>

                      <button onClick={() => removeItem(index)} className="text-xs text-red-600 hover:text-red-800 font-semibold flex items-center space-x-1">
                        <Trash2 className="w-3.5 h-3.5"/>
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                </div>);
        })}
          </div>

          {/* Right Summary Column */}
          <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-beige shadow-premium space-y-6">
            <h3 className="font-serif text-lg font-bold text-charcoal">Order Summary</h3>

            {/* Promo Code Form */}
            <div>
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input type="text" placeholder="Promo Code (e.g. WELCOME10)" value={inputCoupon} onChange={(e) => setInputCoupon(e.target.value.toUpperCase())} className="flex-grow bg-beige-light/50 border border-beige-dark rounded-xl px-3 py-2 text-xs uppercase font-medium focus:outline-none focus:border-burgundy"/>
                <button type="submit" disabled={isApplying} className="bg-charcoal hover:bg-charcoal-dark text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors disabled:opacity-50">
                  Apply
                </button>
              </form>
              {couponMsg && (<p className={`text-xs mt-1.5 ${couponMsg.isError ? 'text-red-600' : 'text-emerald-700'}`}>
                  {couponMsg.text}
                </p>)}
              {couponCode && (<div className="mt-2 flex items-center justify-between bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg text-xs text-emerald-800">
                  <span className="flex items-center space-x-1 font-semibold">
                    <Tag className="w-3.5 h-3.5"/>
                    <span>Coupon: {couponCode}</span>
                  </span>
                  <button onClick={removeCoupon} className="text-red-600 hover:underline text-[11px] font-bold">
                    Remove
                  </button>
                </div>)}
            </div>

            {/* Price Calculations */}
            <div className="space-y-2.5 text-xs text-charcoal-muted border-t border-beige pt-4">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="text-charcoal font-medium">₹{subtotal}</span>
              </div>
              {discount > 0 && (<div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Coupon Discount</span>
                  <span>-₹{discount}</span>
                </div>)}
              <div className="flex justify-between">
                <span>Express Insured Shipping</span>
                <span className="text-charcoal font-medium">
                  {shipping === 0 ? (<span className="text-emerald-700 font-semibold">FREE</span>) : (`₹${shipping}`)}
                </span>
              </div>
              <div className="flex justify-between text-base font-bold text-charcoal pt-3 border-t border-beige">
                <span className="font-serif">Grand Total</span>
                <span className="font-serif text-xl text-burgundy">₹{total}</span>
              </div>
            </div>

            {/* Checkout CTA */}
            <button onClick={() => router.push('/checkout')} className="w-full bg-burgundy hover:bg-burgundy-dark text-white text-sm font-semibold py-4 rounded-xl shadow-md transition-all flex items-center justify-center space-x-2">
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4"/>
            </button>

            <div className="flex items-center justify-center space-x-2 text-[11px] text-charcoal-muted pt-2">
              <ShieldCheck className="w-3.5 h-3.5 text-gold-dark"/>
              <span>Razorpay 256-bit Secure Checkout</span>
            </div>
          </div>
        </div>
      </div>
    </div>);
}
