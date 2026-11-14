'use client';
import React from 'react';
import Link from 'next/link';
import { useWishlist } from '@/context/WishlistContext';
import { ProductCard } from '@/components/shop/ProductCard';
import { Heart, ArrowRight } from 'lucide-react';
export default function WishlistPage() {
    const { wishlist } = useWishlist();
    return (<div className="bg-ivory min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <span className="text-xs uppercase tracking-widest text-gold-dark font-semibold">
            Saved Curations
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-charcoal mt-0.5">
            My Wishlist ({wishlist.length})
          </h1>
          <p className="text-xs text-charcoal-muted mt-1">
            Personalized gifts you have saved for upcoming birthdays, anniversaries, and holidays.
          </p>
        </div>

        {wishlist.length === 0 ? (<div className="bg-white p-12 rounded-2xl border border-beige shadow-sm text-center max-w-md mx-auto space-y-4">
            <Heart className="w-12 h-12 text-burgundy/40 mx-auto"/>
            <h3 className="font-serif text-lg font-bold text-charcoal">Your Wishlist is Empty</h3>
            <p className="text-xs text-charcoal-muted leading-relaxed">
              Click the heart icon on any personalized gift card to save your favorites here.
            </p>
            <Link href="/shop" className="inline-flex items-center space-x-2 bg-burgundy hover:bg-burgundy-dark text-white text-xs font-semibold px-5 py-2.5 rounded-xl transition-colors">
              <span>Explore Collection</span>
              <ArrowRight className="w-4 h-4"/>
            </Link>
          </div>) : (<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {wishlist.map((product) => (<ProductCard key={product._id} product={{ ...product, createdAt: new Date().toISOString() }}/>))}
          </div>)}
      </div>
    </div>);
}
