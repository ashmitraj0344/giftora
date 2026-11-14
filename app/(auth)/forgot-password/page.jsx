'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, CheckCircle2, ArrowLeft } from 'lucide-react';
export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const handleSubmit = (e) => {
        e.preventDefault();
        if (email) {
            setSubmitted(true);
        }
    };
    return (<div className="bg-ivory min-h-screen py-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-3xl border border-beige shadow-premium p-8 sm:p-10 space-y-6 text-center">
        <div className="w-12 h-12 rounded-xl bg-burgundy flex items-center justify-center text-gold mx-auto shadow-md mb-3">
          <span className="font-serif text-2xl font-bold">G</span>
        </div>

        <h1 className="font-serif text-2xl font-bold text-charcoal">Password Recovery</h1>

        {submitted ? (<div className="space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6"/>
            </div>
            <p className="text-xs text-charcoal-muted leading-relaxed">
              If an account exists for <strong>{email}</strong>, we have dispatched secure password reset instructions to your inbox.
            </p>
            <Link href="/login" className="inline-block bg-burgundy text-white text-xs font-semibold px-6 py-2.5 rounded-xl hover:bg-burgundy-dark transition-colors">
              Return to Login
            </Link>
          </div>) : (<form onSubmit={handleSubmit} className="space-y-4 text-xs text-left">
            <p className="text-charcoal-muted text-center mb-2">
              Enter your registered email and we will send you a recovery link.
            </p>
            <div>
              <label className="block font-semibold text-charcoal mb-1">Email Address</label>
              <div className="relative">
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" className="w-full border border-beige-dark rounded-xl py-2.5 pl-10 pr-4 text-xs text-charcoal focus:outline-none focus:border-burgundy"/>
                <Mail className="w-4 h-4 text-charcoal-muted absolute left-3.5 top-3"/>
              </div>
            </div>

            <button type="submit" className="w-full bg-burgundy hover:bg-burgundy-dark text-white font-semibold py-3 rounded-xl shadow-sm transition-colors">
              Send Reset Instructions
            </button>
          </form>)}

        <div className="pt-2 border-t border-beige">
          <Link href="/login" className="inline-flex items-center space-x-1.5 text-xs text-charcoal-muted hover:text-burgundy">
            <ArrowLeft className="w-3.5 h-3.5"/>
            <span>Back to Sign In</span>
          </Link>
        </div>
      </div>
    </div>);
}
