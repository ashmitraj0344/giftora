'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Lock, Mail, User, Phone, AlertCircle } from 'lucide-react';
export default function RegisterPage() {
    const router = useRouter();
    const { register } = useAuth();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState(null);
    const [loading, setLoading] = useState(false);
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password.length < 6) {
            setErrorMsg('Password must be at least 6 characters long.');
            return;
        }
        setLoading(true);
        setErrorMsg(null);
        const res = await register(name, email, password, phone);
        setLoading(false);
        if (res.success) {
            router.push('/');
        }
        else {
            setErrorMsg(res.error || 'Registration failed.');
        }
    };
    return (<div className="bg-ivory min-h-screen py-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-3xl border border-beige shadow-premium p-8 sm:p-10 space-y-6">
        <div className="text-center space-y-1">
          <div className="w-12 h-12 rounded-xl bg-burgundy flex items-center justify-center text-gold mx-auto shadow-md mb-3">
            <span className="font-serif text-2xl font-bold">G</span>
          </div>
          <h1 className="font-serif text-2xl font-bold text-charcoal">Create an Account</h1>
          <p className="text-xs text-charcoal-muted">
            Join the Giftora circle for custom studio designs & gift tracking
          </p>
        </div>

        {errorMsg && (<div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0"/>
            <span>{errorMsg}</span>
          </div>)}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-charcoal mb-1">Full Name</label>
            <div className="relative">
              <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Aarav Sharma" className="w-full border border-beige-dark rounded-xl py-2.5 pl-10 pr-4 text-xs text-charcoal focus:outline-none focus:border-burgundy"/>
              <User className="w-4 h-4 text-charcoal-muted absolute left-3.5 top-3"/>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-charcoal mb-1">Email Address</label>
            <div className="relative">
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" className="w-full border border-beige-dark rounded-xl py-2.5 pl-10 pr-4 text-xs text-charcoal focus:outline-none focus:border-burgundy"/>
              <Mail className="w-4 h-4 text-charcoal-muted absolute left-3.5 top-3"/>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-charcoal mb-1">Mobile Phone Number</label>
            <div className="relative">
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 98765 43210" className="w-full border border-beige-dark rounded-xl py-2.5 pl-10 pr-4 text-xs text-charcoal focus:outline-none focus:border-burgundy"/>
              <Phone className="w-4 h-4 text-charcoal-muted absolute left-3.5 top-3"/>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-charcoal mb-1">Password (min 6 characters)</label>
            <div className="relative">
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full border border-beige-dark rounded-xl py-2.5 pl-10 pr-4 text-xs text-charcoal focus:outline-none focus:border-burgundy"/>
              <Lock className="w-4 h-4 text-charcoal-muted absolute left-3.5 top-3"/>
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-burgundy hover:bg-burgundy-dark text-white font-semibold py-3 rounded-xl shadow-sm transition-colors disabled:opacity-50 mt-2">
            {loading ? 'Creating Account...' : 'Complete Registration'}
          </button>
        </form>

        <div className="text-center text-xs text-charcoal-muted pt-2 border-t border-beige">
          Already registered?{' '}
          <Link href="/login" className="text-burgundy font-bold hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>);
}
