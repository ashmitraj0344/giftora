'use client';

import React, { useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import confetti from 'canvas-confetti';
import { CheckCircle2, PackageCheck, ArrowRight, Truck } from 'lucide-react';

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId') || 'GFT-849201';

  useEffect(() => {
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#702C3B', '#C6A46A', '#EDE5D8', '#252323'],
      });
    } catch (e) {
      // ignore
    }
  }, []);

  return (
    <div className="max-w-xl w-full bg-white rounded-3xl border border-beige shadow-premium p-8 sm:p-12 text-center space-y-6">
      <div className="w-20 h-20 rounded-full bg-emerald-50 border-2 border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
        <CheckCircle2 className="w-10 h-10"/>
      </div>

      <div>
        <span className="text-xs uppercase tracking-widest text-gold-dark font-bold">
          Order Confirmed & Payment Verified
        </span>
        <h1 className="font-serif text-3xl font-bold text-charcoal mt-1">
          Thank You for Your Order!
        </h1>
        <p className="text-xs text-charcoal-muted mt-2 max-w-md mx-auto leading-relaxed">
          Your personalized design is now in the hands of our master artisans. We will handcraft your gift with meticulous care and express ship it to your address.
        </p>
      </div>

      <div className="bg-beige-light/50 p-6 rounded-2xl border border-beige text-left space-y-3">
        <div className="flex justify-between items-center text-xs pb-3 border-b border-beige">
          <span className="text-charcoal-muted">Order Number:</span>
          <span className="font-mono font-bold text-burgundy text-sm">{orderId}</span>
        </div>
        <div className="flex justify-between items-center text-xs pb-3 border-b border-beige">
          <span className="text-charcoal-muted">Payment Status:</span>
          <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
            Verified & Captured
          </span>
        </div>
        <div className="flex justify-between items-center text-xs">
          <span className="text-charcoal-muted flex items-center space-x-1">
            <Truck className="w-3.5 h-3.5 text-gold-dark"/>
            <span>Estimated Delivery:</span>
          </span>
          <span className="font-semibold text-charcoal">Within 4-5 Business Days</span>
        </div>
      </div>

      <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link href={`/orders/track/${orderId}`} className="w-full sm:w-auto px-6 py-3 rounded-xl bg-burgundy hover:bg-burgundy-dark text-white font-semibold text-xs transition-colors flex items-center justify-center space-x-2">
          <PackageCheck className="w-4 h-4"/>
          <span>Track Order Status</span>
        </Link>
        <Link href="/shop" className="w-full sm:w-auto px-6 py-3 rounded-xl border border-beige-dark bg-white hover:bg-beige-light text-charcoal font-semibold text-xs transition-colors flex items-center justify-center space-x-2">
          <span>Explore More Gifts</span>
          <ArrowRight className="w-4 h-4"/>
        </Link>
      </div>

      <p className="text-[11px] text-charcoal-muted">
        A receipt and tracking updates have been sent to your registered email.
      </p>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <div className="bg-ivory min-h-screen py-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <Suspense fallback={
        <div className="p-8 text-center text-xs text-charcoal-muted">Loading order confirmation...</div>
      }>
        <SuccessContent />
      </Suspense>
    </div>
  );
}
