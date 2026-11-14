'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { XCircle, RotateCcw, ShoppingBag, ShieldAlert } from 'lucide-react';

function FailedContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error') || 'The transaction could not be processed by your bank or the payment gateway.';

  return (
    <div className="max-w-md w-full bg-white rounded-3xl border border-beige shadow-premium p-8 text-center space-y-6">
      <div className="w-16 h-16 rounded-full bg-red-50 border-2 border-red-200 text-red-600 flex items-center justify-center mx-auto">
        <XCircle className="w-8 h-8"/>
      </div>

      <div>
        <span className="text-xs uppercase tracking-widest text-red-600 font-bold">
          Payment Unsuccessful
        </span>
        <h1 className="font-serif text-2xl font-bold text-charcoal mt-1">
          Unable to Process Payment
        </h1>
        <p className="text-xs text-charcoal-muted mt-2 leading-relaxed">
          {error}
        </p>
      </div>

      <div className="p-4 bg-beige-light/40 rounded-xl border border-beige text-left text-xs text-charcoal-muted space-y-2">
        <div className="flex items-center space-x-2 text-charcoal font-semibold">
          <ShieldAlert className="w-4 h-4 text-gold-dark"/>
          <span>No funds were debited</span>
        </div>
        <p>
          If your account was debited, the amount is automatically refunded by your banking provider within 24-48 banking hours.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <Link href="/checkout" className="w-full sm:w-auto px-6 py-3 rounded-xl bg-burgundy hover:bg-burgundy-dark text-white font-semibold text-xs transition-colors flex items-center justify-center space-x-2">
          <RotateCcw className="w-4 h-4"/>
          <span>Try Payment Again</span>
        </Link>
        <Link href="/cart" className="w-full sm:w-auto px-6 py-3 rounded-xl border border-beige-dark bg-white hover:bg-beige-light text-charcoal font-semibold text-xs transition-colors flex items-center justify-center space-x-2">
          <ShoppingBag className="w-4 h-4"/>
          <span>Review Bag</span>
        </Link>
      </div>
    </div>
  );
}

export default function PaymentFailedPage() {
  return (
    <div className="bg-ivory min-h-screen py-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <Suspense fallback={
        <div className="p-8 text-center text-xs text-charcoal-muted">Loading payment details...</div>
      }>
        <FailedContent />
      </Suspense>
    </div>
  );
}
