import React from 'react';
import Link from 'next/link';
import { CATEGORIES } from '@/lib/sample-data';
import { ArrowRight } from 'lucide-react';

export const CategoriesSection = () => {
  return (
    <section className="py-20 bg-ivory border-b border-beige">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs uppercase tracking-widest text-gold-dark font-semibold">
            Artisanal Collections
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal mt-2">
            Shop Gifts by Category
          </h2>
          <p className="text-sm text-charcoal-muted mt-3">
            Explore carefully curated handcrafted categories designed for birthdays, anniversaries, weddings, and memorable milestones.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/shop?category=${encodeURIComponent(cat.name)}`}
              className="group relative rounded-2xl overflow-hidden border border-beige bg-white shadow-sm hover:shadow-premium transition-all duration-300 flex flex-col"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-beige-light">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                <span className="absolute top-2.5 right-2.5 bg-white/90 backdrop-blur-xs text-[10px] font-bold text-burgundy px-2 py-0.5 rounded-full">
                  {cat.count}
                </span>
              </div>

              <div className="p-4 flex-grow flex flex-col justify-between">
                <div>
                  <h3 className="font-serif text-base font-bold text-charcoal group-hover:text-burgundy transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-charcoal-muted mt-1 line-clamp-2 leading-relaxed">
                    {cat.description}
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-beige flex items-center text-xs font-semibold text-burgundy group-hover:text-burgundy-light">
                  <span>Explore category</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
