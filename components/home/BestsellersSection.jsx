import React from 'react';
import Link from 'next/link';
import { INITIAL_PRODUCTS } from '@/lib/sample-data';
import { ProductCard } from '@/components/shop/ProductCard';
import { ArrowRight, Sparkles } from 'lucide-react';

export const BestsellersSection = () => {
  const bestsellers = INITIAL_PRODUCTS.filter((p) => p.isBestseller || p.isFeatured).slice(0, 4);

  return (
    <section className="py-20 bg-ivory-light border-b border-beige">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-xs font-semibold text-gold-dark uppercase tracking-widest mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Patron Favorites</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal">
              Bestselling Personalized Gifts
            </h2>
            <p className="text-sm text-charcoal-muted mt-2 max-w-xl">
              Cherished by over 10,000 customers. Personalize each masterpiece with your photography and heartfelt words.
            </p>
          </div>
          <Link
            href="/shop"
            className="mt-4 md:mt-0 inline-flex items-center space-x-1.5 text-sm font-semibold text-burgundy hover:text-burgundy-dark"
          >
            <span>View all 50+ gifts</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestsellers.map((product) => (
            <ProductCard key={product.slug} product={{ ...product, _id: product._id || product.slug, createdAt: new Date().toISOString() }} />
          ))}
        </div>
      </div>
    </section>
  );
};
