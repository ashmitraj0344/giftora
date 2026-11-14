'use client';

import React from 'react';
import Link from 'next/link';
import { useWishlist } from '@/context/WishlistContext';
import { Heart, Sparkles, Star } from 'lucide-react';

export const ProductCard = ({ product }) => {
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const wishlisted = isInWishlist(product._id);

  const toggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (wishlisted) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist(product);
    }
  };

  const discountPercent = product.discountPrice
    ? Math.round(((product.basePrice - product.discountPrice) / product.basePrice) * 100)
    : 0;

  return (
    <div className="group bg-white rounded-2xl border border-beige shadow-sm hover:shadow-premium transition-all duration-300 flex flex-col overflow-hidden">
      <div className="relative aspect-square overflow-hidden bg-beige-light">
        <Link href={`/products/${product.slug}`}>
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </Link>

        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {product.isBestseller && (
            <span className="bg-burgundy text-white text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full shadow-sm">
              Bestseller
            </span>
          )}
          {discountPercent > 0 && (
            <span className="bg-gold text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
              {discountPercent}% OFF
            </span>
          )}
        </div>

        <button
          onClick={toggleWishlist}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-charcoal hover:text-burgundy transition-colors shadow-sm"
          title={wishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <Heart
            className={`w-4 h-4 ${
              wishlisted ? 'text-burgundy fill-burgundy' : 'text-charcoal'
            }`}
          />
        </button>

        <div className="absolute bottom-3 inset-x-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Link
            href={`/customize/${product.slug}`}
            className="w-full bg-burgundy/90 hover:bg-burgundy text-white text-xs font-semibold py-2.5 px-3 rounded-xl shadow-lg flex items-center justify-center space-x-1.5 backdrop-blur-xs transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-gold-shimmer" />
            <span>Customize Design</span>
          </Link>
        </div>
      </div>

      <div className="p-4 flex-grow flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-[11px] text-charcoal-muted mb-1">
            <span className="uppercase tracking-wider font-semibold">{product.category}</span>
            <div className="flex items-center space-x-1 text-amber-500 font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{product.rating || 4.8}</span>
              <span className="text-charcoal-muted font-normal">({product.reviewCount || 18})</span>
            </div>
          </div>

          <Link href={`/products/${product.slug}`}>
            <h3 className="font-serif text-sm font-bold text-charcoal group-hover:text-burgundy transition-colors line-clamp-1">
              {product.name}
            </h3>
          </Link>

          <p className="text-xs text-charcoal-muted mt-1 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-beige flex items-center justify-between">
          <div className="flex items-baseline space-x-2">
            <span className="font-serif text-base font-bold text-burgundy">
              ₹{product.discountPrice ?? product.basePrice}
            </span>
            {product.discountPrice && (
              <span className="text-xs text-charcoal-muted line-through">
                ₹{product.basePrice}
              </span>
            )}
          </div>

          <Link
            href={`/customize/${product.slug}`}
            className="text-xs font-semibold text-burgundy hover:text-burgundy-light flex items-center space-x-1"
          >
            <span>Personalize</span>
            <Sparkles className="w-3 h-3 text-gold" />
          </Link>
        </div>
      </div>
    </div>
  );
};
