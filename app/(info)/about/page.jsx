import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Heart, Award, ArrowRight } from 'lucide-react';
export default function AboutPage() {
    return (<div className="bg-ivory min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Title */}
        <div className="text-center space-y-3">
          <span className="text-xs uppercase tracking-widest text-gold-dark font-semibold">
            Our Heritage & Story
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal">
            About Giftora Atelier
          </h1>
          <p className="text-sm text-charcoal-muted max-w-xl mx-auto leading-relaxed">
            Founded with a singular mission: to transform fleeting human memories into tactile, enduring works of bespoke art.
          </p>
        </div>

        {/* Narrative Card */}
        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-beige shadow-sm space-y-6 leading-relaxed text-sm text-charcoal">
          <h2 className="font-serif text-2xl font-bold text-burgundy">
            &ldquo;Make Every Gift Unforgettable.&rdquo;
          </h2>
          <p className="text-charcoal-muted">
            In an era of mass-produced generic merchandise and digital messages that disappear in feeds, Giftora was born out of an appreciation for physical keepsakes. A framed photograph isn&apos;t just paper and walnut wood—it is the memory of a wedding vows, a child’s first laugh, a reunion after years apart, or a milestone earned through perseverance.
          </p>
          <p className="text-charcoal-muted">
            We combined modern web technologies with old-world atelier craftsmanship. Our interactive Customization Studio allows customers across India to position their photography, select refined typography, and preview the finished piece with pixel perfection before placing an order.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-beige text-center">
            <div className="p-4 bg-beige-light/40 rounded-xl border border-beige">
              <span className="font-serif text-2xl font-bold text-burgundy block">10,000+</span>
              <span className="text-xs text-charcoal-muted font-medium">Bespoke Gifts Crafted</span>
            </div>
            <div className="p-4 bg-beige-light/40 rounded-xl border border-beige">
              <span className="font-serif text-2xl font-bold text-burgundy block">4.9 / 5</span>
              <span className="text-xs text-charcoal-muted font-medium">Customer Rating</span>
            </div>
            <div className="p-4 bg-beige-light/40 rounded-xl border border-beige">
              <span className="font-serif text-2xl font-bold text-burgundy block">100%</span>
              <span className="text-xs text-charcoal-muted font-medium">Archival Quality Woods</span>
            </div>
          </div>
        </div>

        {/* Values */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-beige shadow-sm text-center space-y-2">
            <ShieldCheck className="w-8 h-8 text-gold-dark mx-auto"/>
            <h3 className="font-serif text-base font-bold text-charcoal">Museum Grade Materials</h3>
            <p className="text-xs text-charcoal-muted">Solid American Walnut, Japanese quartz, and acid-free Italian leather.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-beige shadow-sm text-center space-y-2">
            <Heart className="w-8 h-8 text-burgundy mx-auto"/>
            <h3 className="font-serif text-base font-bold text-charcoal">Handcrafted with Love</h3>
            <p className="text-xs text-charcoal-muted">Every item is individually inspected and calibrated by our master printmakers.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-beige shadow-sm text-center space-y-2">
            <Award className="w-8 h-8 text-gold-dark mx-auto"/>
            <h3 className="font-serif text-base font-bold text-charcoal">Design Satisfaction</h3>
            <p className="text-xs text-charcoal-muted">If your print doesn&apos;t match the studio preview, we reprint and ship free.</p>
          </div>
        </div>

        <div className="text-center pt-4">
          <Link href="/shop" className="inline-flex items-center space-x-2 bg-burgundy hover:bg-burgundy-dark text-white text-xs font-semibold px-6 py-3.5 rounded-xl shadow-md transition-colors">
            <span>Explore the Giftora Collection</span>
            <ArrowRight className="w-4 h-4"/>
          </Link>
        </div>
      </div>
    </div>);
}
