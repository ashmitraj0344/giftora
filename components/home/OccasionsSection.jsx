import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export const OccasionsSection = () => {
  const occasions = [
    {
      name: 'Anniversaries & Weddings',
      tagline: 'Celebrate eternal companionship',
      image: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=600&q=80',
      category: 'Photo Frames',
    },
    {
      name: 'Milestone Birthdays',
      tagline: 'Memories across every golden year',
      image: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=600&q=80',
      category: 'Customized Mugs',
    },
    {
      name: 'Valentine & Couples',
      tagline: 'Every picture tells your love story',
      image: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=600&q=80',
      category: 'LED Photo Lamps',
    },
    {
      name: 'New Born & Family Roots',
      tagline: 'Welcome new beginnings tenderly',
      image: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=600&q=80',
      category: 'Photo Albums',
    },
  ];

  return (
    <section className="py-20 bg-ivory border-b border-beige">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs uppercase tracking-widest text-gold-dark font-semibold">
            Meaningful Moments
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal mt-2">
            Gifts for Every Special Occasion
          </h2>
          <p className="text-sm text-charcoal-muted mt-3">
            Handcrafted personalized selections tailored to make anniversaries, birthdays, and celebrations unforgettable.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {occasions.map((occ) => (
            <Link
              key={occ.name}
              href={`/shop?category=${encodeURIComponent(occ.category)}`}
              className="group relative rounded-2xl overflow-hidden aspect-[3/4] shadow-md hover:shadow-premium transition-all duration-500"
            >
              <img
                src={occ.image}
                alt={occ.name}
                className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/30 to-transparent opacity-85 group-hover:opacity-75 transition-opacity" />

              <div className="absolute inset-x-0 bottom-0 p-6 flex flex-col justify-end text-white">
                <span className="text-[10px] uppercase font-bold tracking-widest text-gold-shimmer mb-1">
                  Occasion Collection
                </span>
                <h3 className="font-serif text-xl font-bold text-white group-hover:text-gold-light transition-colors leading-snug">
                  {occ.name}
                </h3>
                <p className="text-xs text-gray-200 mt-1 opacity-90">
                  {occ.tagline}
                </p>
                <div className="mt-3 flex items-center text-xs font-semibold text-gold-light group-hover:text-white">
                  <span>Discover curated gifts</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
