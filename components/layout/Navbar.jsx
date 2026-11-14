'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import {
  ShoppingBag,
  Heart,
  User as UserIcon,
  Search,
  Menu,
  X,
  Sparkles,
  PackageCheck,
  ShieldCheck,
  LogOut,
  ChevronDown,
} from 'lucide-react';

export const Navbar = () => {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const { wishlist } = useWishlist();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-ivory-light/95 backdrop-blur-md border-b border-beige">
      <div className="bg-burgundy text-white text-xs py-2 px-4 text-center tracking-wider font-light flex items-center justify-center space-x-2">
        <Sparkles className="w-3.5 h-3.5 text-gold-shimmer animate-pulse" />
        <span>Complimentary Luxury Gift Box & Ribbon on orders above ₹999 | Use Code: <strong>WELCOME10</strong></span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-charcoal hover:text-burgundy p-2"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          <Link href="/" className="flex items-center space-x-2.5 group">
            <div className="w-10 h-10 rounded-lg bg-burgundy flex items-center justify-center text-gold shadow-md group-hover:scale-105 transition-transform">
              <span className="font-serif text-2xl font-bold tracking-tighter">G</span>
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-burgundy">
                Giftora
              </span>
              <span className="text-[10px] tracking-[0.25em] text-gold-dark uppercase font-medium -mt-1">
                Personalized Gifts
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-charcoal">
            <Link href="/" className="hover:text-burgundy transition-colors">
              Home
            </Link>
            <Link href="/shop" className="hover:text-burgundy transition-colors">
              Shop All
            </Link>
            <Link href="/customize/artisan-walnut-wood-photo-frame" className="flex items-center space-x-1.5 text-burgundy font-semibold hover:text-burgundy-light transition-colors">
              <Sparkles className="w-4 h-4 text-gold" />
              <span>Studio</span>
            </Link>
            <Link href="/#how-it-works" className="hover:text-burgundy transition-colors">
              How It Works
            </Link>
            <Link href="/about" className="hover:text-burgundy transition-colors">
              About Us
            </Link>
            <Link href="/orders/track/search" className="hover:text-burgundy transition-colors">
              Track Order
            </Link>
          </nav>

          <div className="flex items-center space-x-4 sm:space-x-6">
            <form onSubmit={handleSearch} className="hidden lg:flex items-center relative w-48 xl:w-64">
              <input
                type="text"
                placeholder="Search luxury gifts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-beige-light/70 border border-beige text-charcoal text-xs rounded-full py-2 pl-9 pr-4 focus:outline-none focus:border-burgundy focus:bg-white transition-all"
              />
              <Search className="w-4 h-4 text-charcoal-muted absolute left-3 top-2.5" />
            </form>

            <Link
              href="/wishlist"
              className="text-charcoal hover:text-burgundy relative p-1.5 transition-colors"
              title="My Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-burgundy text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </Link>

            <Link
              href="/cart"
              className="text-charcoal hover:text-burgundy relative p-1.5 transition-colors flex items-center"
              title="Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-burgundy text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-bounce">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* Admin Portal Shortcut if logged in as Admin */}
            {user?.role === 'admin' && (
              <Link
                href="/admin"
                className="hidden md:inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-burgundy hover:bg-burgundy-dark text-gold text-xs font-bold shadow-xs transition-all border border-gold/40"
                title="Go to Admin Atelier Dashboard"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-gold" />
                <span>Admin Portal</span>
              </Link>
            )}

            {/* User Account / Identity Cross-Check */}
            <div className="relative">
              {user ? (
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center space-x-1.5 p-1 sm:px-2.5 sm:py-1 rounded-full bg-beige/60 hover:bg-beige border border-beige-dark hover:border-burgundy transition-all"
                  title={`Signed in as ${user.name} (${user.role})`}
                >
                  <div className="w-7 h-7 rounded-full bg-burgundy text-white flex items-center justify-center font-serif font-bold text-xs shadow-2xs">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="hidden sm:flex flex-col text-left leading-tight">
                    <span className="text-xs font-bold text-charcoal max-w-[85px] truncate">
                      {user.name.split(' ')[0]}
                    </span>
                    <span className="text-[9px] uppercase font-bold text-gold-dark tracking-wider">
                      {user.role}
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-charcoal-muted hidden sm:block ml-0.5" />
                </button>
              ) : (
                <Link
                  href="/login"
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full border border-beige-dark hover:border-burgundy text-xs font-semibold text-charcoal hover:text-burgundy transition-all bg-white"
                >
                  <UserIcon className="w-4 h-4 text-burgundy" />
                  <span className="hidden sm:inline">Sign In</span>
                </Link>
              )}

              {userDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40 bg-transparent"
                    onClick={() => setUserDropdownOpen(false)}
                  />
                  <div
                    className="absolute right-0 mt-2 w-64 bg-white border border-beige shadow-premium rounded-2xl py-2 z-50 text-sm animate-in fade-in slide-in-from-top-2"
                  >
                  {user ? (
                    <>
                      <div className="px-4 py-3 border-b border-beige bg-beige-light/40 rounded-t-xl">
                        <span className="text-[10px] text-charcoal-muted uppercase font-bold tracking-wider">
                          Signed In As
                        </span>
                        <p className="font-bold text-charcoal truncate text-sm mt-0.5">{user.name}</p>
                        <p className="text-xs text-charcoal-muted truncate">{user.email}</p>
                        <span className="inline-block mt-1 text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-gold/20 text-gold-dark border border-gold/30">
                          Role: {user.role}
                        </span>
                      </div>
                      {user.role === 'admin' && (
                        <Link
                          href="/admin"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center px-4 py-2 text-burgundy font-semibold hover:bg-beige-light transition-colors"
                        >
                          <ShieldCheck className="w-4 h-4 mr-2.5 text-burgundy" />
                          Admin Dashboard
                        </Link>
                      )}
                      <Link
                        href="/orders"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center px-4 py-2 text-charcoal hover:bg-beige-light transition-colors"
                      >
                        <PackageCheck className="w-4 h-4 mr-2.5 text-charcoal-muted" />
                        My Orders
                      </Link>
                      <Link
                        href="/profile"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center px-4 py-2 text-charcoal hover:bg-beige-light transition-colors"
                      >
                        <UserIcon className="w-4 h-4 mr-2.5 text-charcoal-muted" />
                        My Profile & Addresses
                      </Link>
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          logout();
                        }}
                        className="w-full text-left flex items-center px-4 py-2 text-red-600 hover:bg-red-50 transition-colors border-t border-beige mt-1"
                      >
                        <LogOut className="w-4 h-4 mr-2.5" />
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="px-4 py-2 text-xs text-charcoal-muted border-b border-beige">
                        Welcome to Giftora
                      </div>
                      <Link
                        href="/login"
                        onClick={() => setUserDropdownOpen(false)}
                        className="block px-4 py-2 text-charcoal hover:bg-beige-light font-medium"
                      >
                        Sign In
                      </Link>
                      <Link
                        href="/register"
                        onClick={() => setUserDropdownOpen(false)}
                        className="block px-4 py-2 text-burgundy hover:bg-beige-light font-medium"
                      >
                        Create an Account
                      </Link>
                    </>
                  )}
                </div>
              </>
              )}
            </div>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-ivory border-b border-beige px-4 pt-3 pb-6 space-y-4">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="Search gifts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-beige text-charcoal text-sm rounded-lg py-2.5 pl-10 pr-4 focus:outline-none focus:border-burgundy"
            />
            <Search className="w-4 h-4 text-charcoal-muted absolute left-3 top-3.5" />
          </form>

          <nav className="flex flex-col space-y-3 text-base font-medium text-charcoal">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="px-2 py-1.5 rounded-md hover:bg-beige"
            >
              Home
            </Link>
            <Link
              href="/shop"
              onClick={() => setMobileMenuOpen(false)}
              className="px-2 py-1.5 rounded-md hover:bg-beige"
            >
              Shop All Gifts
            </Link>
            <Link
              href="/customize/artisan-walnut-wood-photo-frame"
              onClick={() => setMobileMenuOpen(false)}
              className="px-2 py-1.5 rounded-md bg-burgundy/10 text-burgundy font-semibold flex items-center space-x-2"
            >
              <Sparkles className="w-4 h-4 text-gold" />
              <span>Personalization Studio</span>
            </Link>
            <Link
              href="/#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="px-2 py-1.5 rounded-md hover:bg-beige"
            >
              How It Works
            </Link>
            <Link
              href="/orders/track/search"
              onClick={() => setMobileMenuOpen(false)}
              className="px-2 py-1.5 rounded-md hover:bg-beige"
            >
              Track an Order
            </Link>
            <Link
              href="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="px-2 py-1.5 rounded-md hover:bg-beige"
            >
              About Giftora
            </Link>
            {user?.role === 'admin' && (
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="px-2 py-1.5 rounded-md bg-gold/15 text-burgundy font-semibold flex items-center space-x-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Admin Dashboard</span>
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};
