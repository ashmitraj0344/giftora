'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  Lock,
  Mail,
  AlertCircle,
  ArrowRight,
  LogOut,
  CheckCircle2,
  Shield,
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { user, login, logout } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const res = await login(email.trim(), password);
    setLoading(false);
    if (res.success) {
      if (res.user?.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/');
      }
    } else {
      setErrorMsg(res.error || 'Login failed. Please verify your email and password.');
    }
  };

  return (
    <div className="bg-ivory min-h-screen py-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-3xl border border-beige shadow-premium p-8 sm:p-10 space-y-6">
        {/* Header */}
        <div className="text-center space-y-1">
          <div className="w-12 h-12 rounded-xl bg-burgundy flex items-center justify-center text-gold mx-auto shadow-md mb-3">
            <span className="font-serif text-2xl font-bold">G</span>
          </div>
          <h1 className="font-serif text-2xl font-bold text-charcoal">Sign In to Giftora</h1>
          <p className="text-xs text-charcoal-muted">
            Access your saved customizations, track orders & manage your atelier
          </p>
        </div>

        {/* Current Identity Cross-Check (If already logged in) */}
        {user && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-3 animate-in fade-in">
            <div className="flex items-center space-x-2 text-emerald-900 font-bold text-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>You are currently signed in:</span>
            </div>
            <div className="bg-white p-3 rounded-xl border border-emerald-100 text-xs space-y-1">
              <div className="flex justify-between items-center">
                <span className="font-bold text-charcoal">{user.name}</span>
                <span className="uppercase text-[9px] font-bold px-2 py-0.5 rounded bg-gold/20 text-gold-dark">
                  {user.role}
                </span>
              </div>
              <p className="text-charcoal-muted text-[11px] truncate">{user.email}</p>
            </div>
            <div className="flex gap-2">
              {user.role === 'admin' ? (
                <Link
                  href="/admin"
                  className="flex-grow bg-burgundy hover:bg-burgundy-dark text-white text-xs font-semibold py-2 rounded-xl text-center shadow-xs transition-colors"
                >
                  Admin Portal ↗
                </Link>
              ) : (
                <Link
                  href="/orders"
                  className="flex-grow bg-burgundy hover:bg-burgundy-dark text-white text-xs font-semibold py-2 rounded-xl text-center shadow-xs transition-colors"
                >
                  My Orders ↗
                </Link>
              )}
              <button
                type="button"
                onClick={() => logout()}
                className="px-3 py-2 border border-beige-dark bg-white hover:bg-red-50 text-red-600 font-semibold text-xs rounded-xl flex items-center space-x-1 transition-colors"
                title="Switch account"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Switch</span>
              </button>
            </div>
          </div>
        )}

        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Standard Secure Authentication Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-charcoal mb-1">Email Address</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full border border-beige-dark rounded-xl py-2.5 pl-10 pr-4 text-xs text-charcoal focus:outline-none focus:border-burgundy"
              />
              <Mail className="w-4 h-4 text-charcoal-muted absolute left-3.5 top-3" />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-semibold text-charcoal">Password</label>
              <Link href="/forgot-password" className="text-[11px] text-burgundy hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full border border-beige-dark rounded-xl py-2.5 pl-10 pr-4 text-xs text-charcoal focus:outline-none focus:border-burgundy"
              />
              <Lock className="w-4 h-4 text-charcoal-muted absolute left-3.5 top-3" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-burgundy hover:bg-burgundy-dark text-white font-semibold text-xs py-3 rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {loading ? (
              <span>Verifying Credentials...</span>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Informational Academic Note (Passive credentials, no auto-login) */}
        <div className="p-3 bg-beige-light/40 border border-beige rounded-2xl text-[11px] text-charcoal-muted space-y-1">
          <div className="flex items-center space-x-1.5 text-charcoal font-semibold">
            <Shield className="w-3.5 h-3.5 text-gold-dark" />
            <span>Academic Evaluation Credentials:</span>
          </div>
          <p className="text-[10px] text-charcoal-muted leading-relaxed">
            Enter manually to test role-based access control:
          </p>
          <div className="font-mono text-[10px] text-charcoal pt-0.5 space-y-0.5">
            <div>
              <span className="text-burgundy font-semibold">Admin:</span> admin@giftora.com / abc@123
            </div>
            <div>
              <span className="text-burgundy font-semibold">Customer:</span> customer@giftora.com / abc@123
            </div>
          </div>
        </div>

        <div className="text-center text-xs text-charcoal-muted pt-2 border-t border-beige">
          Don&apos;t have an account yet?{' '}
          <Link href="/register" className="font-semibold text-burgundy hover:underline">
            Register Here
          </Link>
        </div>
      </div>
    </div>
  );
}
