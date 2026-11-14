import React from 'react';
import { Star, Quote, CheckCircle2 } from 'lucide-react';

export const TestimonialsSection = () => {
  const reviews = [
    {
      name: 'Rohan & Ananya Verma',
      location: 'Bengaluru, Karnataka',
      product: 'Artisan Walnut Wood Photo Frame',
      rating: 5,
      date: 'Ordered for 10th Anniversary',
      quote:
        'The live studio preview was so accurate! When the solid walnut frame arrived in the velvet box with our engraved wedding date, my wife was moved to tears. The print quality is sublime.',
    },
    {
      name: 'Dr. Priya Sundaram',
      location: 'Mumbai, Maharashtra',
      product: 'Warm Acrylic LED Night Glow Lamp',
      rating: 5,
      date: 'Ordered for Parents Retirement',
      quote:
        'Giftora exceeded every expectation. The warm glowing acrylic with our family picture on their bedside table brings them comfort every evening. Packaging was top-tier.',
    },
    {
      name: 'Karan Mehra',
      location: 'New Delhi',
      product: 'Embossed Leather Memories Album',
      rating: 5,
      date: 'Ordered for Silver Jubilee',
      quote:
        'The Italian bonded leather album with the gold foil monogram feels like a priceless heirloom. Fast shipping and the tracking timeline kept me updated at each artisan step.',
    },
  ];

  return (
    <section className="py-20 bg-ivory-light border-b border-beige">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-widest text-gold-dark font-semibold">
            Heartfelt Stories
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal mt-2">
            Loved by Thousands of Patrons
          </h2>
          <p className="text-sm text-charcoal-muted mt-3">
            Read real stories from customers who transformed simple photos into forever keepsakes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((rev, idx) => (
            <div
              key={idx}
              className="bg-white p-8 rounded-2xl border border-beige shadow-sm hover:shadow-premium transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex text-amber-400">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <Quote className="w-6 h-6 text-gold/30" />
                </div>
                <p className="text-xs text-charcoal leading-relaxed italic">
                  &ldquo;{rev.quote}&rdquo;
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-beige">
                <div className="flex items-center space-x-2">
                  <h4 className="font-serif text-sm font-bold text-charcoal">{rev.name}</h4>
                  <span title="Verified Patron">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  </span>
                </div>
                <p className="text-[11px] text-charcoal-muted">{rev.location}</p>
                <div className="mt-1.5 flex items-center justify-between text-[10px] text-gold-dark font-medium">
                  <span>{rev.product}</span>
                  <span className="text-charcoal-muted">{rev.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
