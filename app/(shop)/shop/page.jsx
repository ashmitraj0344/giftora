'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ProductCard } from '@/components/shop/ProductCard';
import { INITIAL_PRODUCTS, CATEGORIES } from '@/lib/sample-data';
import { Search, Sparkles, SlidersHorizontal, X } from 'lucide-react';

function ShopContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';
  const initialSearch = searchParams.get('search') || '';

  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [sortBy, setSortBy] = useState('featured');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) setSelectedCategory(cat);
    const q = searchParams.get('search');
    if (q) setSearchQuery(q);
  }, [searchParams]);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (selectedCategory && selectedCategory !== 'All') {
          queryParams.set('category', selectedCategory);
        }
        if (searchQuery) {
          queryParams.set('search', searchQuery);
        }
        if (sortBy) {
          queryParams.set('sort', sortBy);
        }

        const res = await fetch(`/api/products?${queryParams.toString()}`);
        const data = await res.json();
        if (data.products && data.products.length > 0) {
          setProducts(data.products);
        } else {
          let list = [...INITIAL_PRODUCTS];
          if (selectedCategory && selectedCategory !== 'All') {
            list = list.filter((p) => p.category.toLowerCase() === selectedCategory.toLowerCase());
          }
          if (searchQuery) {
            const q = searchQuery.toLowerCase();
            list = list.filter(
              (p) =>
                p.name.toLowerCase().includes(q) ||
                p.description.toLowerCase().includes(q) ||
                p.category.toLowerCase().includes(q)
            );
          }
          if (sortBy === 'price-low') list.sort((a, b) => a.basePrice - b.basePrice);
          if (sortBy === 'price-high') list.sort((a, b) => b.basePrice - a.basePrice);
          if (sortBy === 'rating') list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
          setProducts(list);
        }
      } catch (err) {
        setProducts(INITIAL_PRODUCTS);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [selectedCategory, searchQuery, sortBy]);

  const clearFilters = () => {
    setSelectedCategory('All');
    setSearchQuery('');
    setSortBy('featured');
  };

  return (
    <div className="bg-ivory min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs uppercase tracking-widest text-gold-dark font-semibold">
            The Complete Atelier
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal mt-1">
            Shop All Bespoke Gifts
          </h1>
          <p className="text-sm text-charcoal-muted mt-2">
            Every piece is made-to-order with your photos, names, and customized artistic specifications.
          </p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-beige shadow-sm mb-8 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-grow max-w-md">
              <input
                type="text"
                placeholder="Search by name, wood type, occasion..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-beige-light/50 border border-beige-dark text-charcoal text-xs rounded-xl py-2.5 pl-10 pr-4 focus:outline-none focus:border-burgundy"
              />
              <Search className="w-4 h-4 text-charcoal-muted absolute left-3.5 top-3" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-3 text-charcoal-muted hover:text-charcoal"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 text-xs">
                <SlidersHorizontal className="w-3.5 h-3.5 text-charcoal-muted" />
                <span className="font-medium text-charcoal-muted">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-beige-light/50 border border-beige-dark rounded-xl px-3 py-2 text-xs text-charcoal focus:outline-none focus:border-burgundy"
                >
                  <option value="featured">Featured Curations</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Top Customer Rated</option>
                </select>
              </div>

              {(selectedCategory !== 'All' || searchQuery) && (
                <button
                  onClick={clearFilters}
                  className="text-xs font-semibold text-burgundy hover:underline"
                >
                  Clear All
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs scrollbar-none">
            <button
              onClick={() => setSelectedCategory('All')}
              className={`px-3.5 py-1.5 rounded-full font-medium whitespace-nowrap transition-all ${
                selectedCategory === 'All'
                  ? 'bg-burgundy text-white shadow-sm'
                  : 'bg-beige-light text-charcoal hover:bg-beige'
              }`}
            >
              All Categories
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.name}
                onClick={() => setSelectedCategory(cat.name)}
                className={`px-3.5 py-1.5 rounded-full font-medium whitespace-nowrap transition-all ${
                  selectedCategory.toLowerCase() === cat.name.toLowerCase()
                    ? 'bg-burgundy text-white shadow-sm'
                    : 'bg-beige-light text-charcoal hover:bg-beige'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-beige p-4 animate-pulse">
                <div className="aspect-square bg-beige-light rounded-xl mb-4" />
                <div className="h-4 bg-beige-light rounded w-3/4 mb-2" />
                <div className="h-3 bg-beige-light rounded w-1/2 mb-4" />
                <div className="h-5 bg-beige-light rounded w-1/3" />
              </div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <div>
            <div className="text-xs text-charcoal-muted mb-4 font-medium">
              Showing {products.length} personalized gifts
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((p) => (
                <ProductCard key={p.slug} product={{ ...p, _id: p._id || p.slug, createdAt: p.createdAt || new Date().toISOString() }} />
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-beige p-8">
            <Sparkles className="w-12 h-12 text-gold mx-auto mb-3 opacity-60" />
            <h3 className="font-serif text-lg font-bold text-charcoal">No gifts found</h3>
            <p className="text-xs text-charcoal-muted mt-1 max-w-sm mx-auto">
              We couldn&apos;t find any products matching your active filters. Try searching for &ldquo;Frame&rdquo;, &ldquo;Mug&rdquo;, or &ldquo;Lamp&rdquo;.
            </p>
            <button
              onClick={clearFilters}
              className="mt-4 px-4 py-2 bg-burgundy text-white text-xs font-semibold rounded-lg hover:bg-burgundy-dark transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-ivory flex items-center justify-center p-8">
        <div className="w-8 h-8 border-4 border-burgundy border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <ShopContent />
    </Suspense>
  );
}
