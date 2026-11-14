import React from 'react';
import { Palette, Gem, Lock, Gift, Truck } from 'lucide-react';

export const WhyChooseUsSection = () => {
  const points = [
    {
      title: 'Unique Customization',
      desc: 'Our interactive studio gives you granular control over typography, photo position, filters, and color palettes.',
      icon: Palette,
    },
    {
      title: 'Premium Quality Materials',
      desc: 'Solid American walnut, optical cast acrylic, 220 GSM combed organic cotton, and bonded Italian leather.',
      icon: Gem,
    },
    {
      title: 'Secure Payments',
      desc: 'Bank-grade 256-bit encrypted Razorpay checkout supporting UPI, Credit/Debit cards, Net Banking, and Wallets.',
      icon: Lock,
    },
    {
      title: 'Carefully Packaged Gifts',
      desc: 'Every gift is cushioned in custom molded foam, presented in a luxury velvet-feel box with gold embossed ribbons.',
      icon: Gift,
    },
    {
      title: 'Reliable Express Delivery',
      desc: 'Track your package step-by-step from artisan assembly to dispatch with BlueDart & Delhivery express couriers.',
      icon: Truck,
    },
  ];

  return (
    <section className="py-20 bg-ivory-light border-b border-beige">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-widest text-gold-dark font-semibold">
            The Giftora Standard
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal mt-2">
            Why Discerning Givers Choose Us
          </h2>
          <p className="text-sm text-charcoal-muted mt-3">
            We don’t mass-print merchandise. We craft personalized heirlooms built to evoke tears of joy.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {points.map((pt) => {
            const Icon = pt.icon;
            return (
              <div
                key={pt.title}
                className="bg-white p-6 rounded-2xl border border-beige shadow-sm hover:shadow-premium transition-all duration-300 text-center flex flex-col items-center group"
              >
                <div className="w-12 h-12 rounded-full bg-burgundy/10 text-burgundy flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-sm font-bold text-charcoal mb-2 group-hover:text-burgundy transition-colors">
                  {pt.title}
                </h3>
                <p className="text-xs text-charcoal-muted leading-relaxed">
                  {pt.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
