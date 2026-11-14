import React from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight, ShieldCheck, HeartHandshake, Award } from 'lucide-react';

export const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-beige-light/60 via-ivory to-ivory py-16 lg:py-24 border-b border-beige">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center space-x-2 bg-burgundy/10 border border-burgundy/20 px-3.5 py-1.5 rounded-full text-xs font-semibold text-burgundy tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-gold-dark" />
              <span>India&apos;s Premier Bespoke Gifting Studio</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-charcoal tracking-tight leading-[1.15]">
              Thoughtful Gifts. <br />
              <span className="text-burgundy italic">Beautifully Personalized.</span>
            </h1>

            <p className="text-base sm:text-lg text-charcoal-muted max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Turn your favorite memories into meaningful gifts. Customize, preview in real-time with our interactive studio, and order something truly special.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link
                href="/shop"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-burgundy hover:bg-burgundy-dark text-white font-semibold text-sm tracking-wide shadow-premium hover:shadow-premium-hover transition-all flex items-center justify-center space-x-2"
              >
                <span>Explore All Gifts</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/customize/artisan-walnut-wood-photo-frame"
                className="w-full sm:w-auto px-8 py-4 rounded-xl border-2 border-gold bg-white hover:bg-beige-light text-burgundy font-semibold text-sm tracking-wide transition-all flex items-center justify-center space-x-2 shadow-sm"
              >
                <Sparkles className="w-4 h-4 text-gold-dark" />
                <span>Open Custom Studio</span>
              </Link>
            </div>

            <div className="pt-6 border-t border-beige grid grid-cols-3 gap-4 text-center lg:text-left">
              <div className="flex flex-col lg:flex-row items-center space-x-0 lg:space-x-2">
                <ShieldCheck className="w-5 h-5 text-gold-dark mb-1 lg:mb-0" />
                <div>
                  <span className="block text-xs font-bold text-charcoal">Museum Grade</span>
                  <span className="text-[10px] text-charcoal-muted">Solid woods & acrylic</span>
                </div>
              </div>
              <div className="flex flex-col lg:flex-row items-center space-x-0 lg:space-x-2">
                <HeartHandshake className="w-5 h-5 text-gold-dark mb-1 lg:mb-0" />
                <div>
                  <span className="block text-xs font-bold text-charcoal">Design Preview</span>
                  <span className="text-[10px] text-charcoal-muted">Instant live preview</span>
                </div>
              </div>
              <div className="flex flex-col lg:flex-row items-center space-x-0 lg:space-x-2">
                <Award className="w-5 h-5 text-gold-dark mb-1 lg:mb-0" />
                <div>
                  <span className="block text-xs font-bold text-charcoal">4.9 / 5 Rating</span>
                  <span className="text-[10px] text-charcoal-muted">10,000+ happy patrons</span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <div className="absolute -inset-2 bg-gradient-to-r from-gold/30 to-burgundy/20 rounded-3xl blur-2xl opacity-70" />

              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white bg-white">
                <img
                  src="https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=900&q=80"
                  alt="Personalized Walnut Wood Photo Frame by Giftora"
                  className="w-full h-[420px] object-cover hover:scale-105 transition-transform duration-700"
                />

                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-3.5 rounded-xl border border-beige shadow-lg flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-lg bg-burgundy/10 flex items-center justify-center text-burgundy">
                      <Sparkles className="w-5 h-5 text-gold" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-charcoal">Artisan Walnut Keepsake</p>
                      <p className="text-[11px] text-charcoal-muted">Engraved with your precious dates</p>
                    </div>
                  </div>
                  <Link
                    href="/customize/artisan-walnut-wood-photo-frame"
                    className="bg-burgundy text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-burgundy-dark transition-colors"
                  >
                    Personalize
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
