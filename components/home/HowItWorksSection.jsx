import React from 'react';
import { Gift, Sliders, Eye, CheckCircle2 } from 'lucide-react';

export const HowItWorksSection = () => {
  const steps = [
    {
      num: '01',
      title: 'Choose Your Gift',
      desc: 'Browse our artisanal catalog of solid wood frames, ceramic mugs, couple tees, memory albums, and glowing lamps.',
      icon: Gift,
    },
    {
      num: '02',
      title: 'Personalize Your Design',
      desc: 'Upload personal photos, type dedications, choose luxury typography fonts, colors, and tailor positioning.',
      icon: Sliders,
    },
    {
      num: '03',
      title: 'Preview In Real-Time',
      desc: 'Witness an instant interactive live mockup of your finished heirloom before placing your order.',
      icon: Eye,
    },
    {
      num: '04',
      title: 'Handcrafted & Delivered',
      desc: 'Our artisans inspect your design, handcraft with archival precision, wrap in velvet ribbon, and express ship.',
      icon: CheckCircle2,
    },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-ivory border-b border-beige">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-widest text-gold-dark font-semibold">
            Seamless Craftsmanship
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal mt-2">
            How Giftora Works
          </h2>
          <p className="text-sm text-charcoal-muted mt-3">
            From your treasured photo album to their doorstep in four effortless steps.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {steps.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.num}
                className="relative bg-white p-6 rounded-2xl border border-beige shadow-sm hover:shadow-premium transition-all duration-300 flex flex-col items-start group"
              >
                <div className="flex items-center justify-between w-full mb-6">
                  <div className="w-12 h-12 rounded-xl bg-burgundy/10 text-burgundy flex items-center justify-center group-hover:bg-burgundy group-hover:text-white transition-colors">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="font-serif text-2xl font-bold text-gold-dark/40 group-hover:text-gold transition-colors">
                    {s.num}
                  </span>
                </div>
                <h3 className="font-serif text-lg font-bold text-charcoal group-hover:text-burgundy transition-colors mb-2">
                  {s.title}
                </h3>
                <p className="text-xs text-charcoal-muted leading-relaxed">
                  {s.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
