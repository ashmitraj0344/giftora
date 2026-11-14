'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Heart,
  ShieldCheck,
  Truck,
  RotateCcw,
  Mail,
  Phone,
  MapPin,
  CheckCircle2,
  Lock,
} from 'lucide-react';

export const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletter = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-charcoal text-white pt-16 pb-12 border-t border-burgundy-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 border-b border-charcoal-light">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-burgundy/40 border border-gold/30 flex items-center justify-center text-gold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-semibold tracking-wide">Archival Quality</h4>
              <p className="text-xs text-charcoal-muted mt-0.5">Museum-grade prints & solid woods</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-burgundy/40 border border-gold/30 flex items-center justify-center text-gold">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-semibold tracking-wide">Secure Express Delivery</h4>
              <p className="text-xs text-charcoal-muted mt-0.5">Complimentary shipping over ₹999</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-burgundy/40 border border-gold/30 flex items-center justify-center text-gold">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-semibold tracking-wide">Design Guarantee</h4>
              <p className="text-xs text-charcoal-muted mt-0.5">Free reprints on print imperfections</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-burgundy/40 border border-gold/30 flex items-center justify-center text-gold">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-semibold tracking-wide">Razorpay Protected</h4>
              <p className="text-xs text-charcoal-muted mt-0.5">256-bit encrypted UPI & Card checkout</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-lg bg-burgundy flex items-center justify-center text-gold">
                <span className="font-serif text-xl font-bold">G</span>
              </div>
              <span className="font-serif text-3xl font-bold tracking-tight text-white">
                Giftora
              </span>
            </div>
            <p className="text-gold-light text-sm italic font-serif">
              &ldquo;Make Every Gift Unforgettable.&rdquo;
            </p>
            <p className="text-xs text-gray-300 leading-relaxed max-w-sm">
              We craft emotional, bespoke treasures that transform your fondest family moments, anniversaries, and milestones into enduring physical works of art.
            </p>
            <div className="pt-2 text-xs text-gray-300 space-y-2">
              <div className="flex items-center space-x-2.5">
                <MapPin className="w-4 h-4 text-gold flex-shrink-0" />
                <span>Prestige Heritage Towers, MG Road, Bengaluru, Karnataka</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <Phone className="w-4 h-4 text-gold flex-shrink-0" />
                <span>+91 (080) 4120-7799 / +91 98765 43210</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <Mail className="w-4 h-4 text-gold flex-shrink-0" />
                <span>concierge@giftora.com</span>
              </div>
            </div>
          </div>

          <div>
            <h5 className="font-serif text-base text-gold tracking-wide mb-4">Gifts Collection</h5>
            <ul className="space-y-2.5 text-xs text-gray-300">
              <li>
                <Link href="/shop?category=Photo%20Frames" className="hover:text-gold transition-colors">
                  Photo Frames
                </Link>
              </li>
              <li>
                <Link href="/shop?category=Customized%20Mugs" className="hover:text-gold transition-colors">
                  Customized Mugs
                </Link>
              </li>
              <li>
                <Link href="/shop?category=Personalized%20T-Shirts" className="hover:text-gold transition-colors">
                  Personalized T-Shirts
                </Link>
              </li>
              <li>
                <Link href="/shop?category=LED%20Photo%20Lamps" className="hover:text-gold transition-colors">
                  LED Night Glow Lamps
                </Link>
              </li>
              <li>
                <Link href="/shop?category=Photo%20Albums" className="hover:text-gold transition-colors">
                  Bonded Leather Albums
                </Link>
              </li>
              <li>
                <Link href="/shop?category=Cushions" className="hover:text-gold transition-colors">
                  Dutch Velvet Cushions
                </Link>
              </li>
              <li>
                <Link href="/shop?category=Personalized%20Accessories" className="hover:text-gold transition-colors">
                  Engraved Accessories
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="font-serif text-base text-gold tracking-wide mb-4">Customer Care</h5>
            <ul className="space-y-2.5 text-xs text-gray-300">
              <li>
                <Link href="/orders/track/search" className="hover:text-gold transition-colors">
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link href="/orders" className="hover:text-gold transition-colors">
                  Order History
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="hover:text-gold transition-colors">
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-gold transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-gold transition-colors">
                  Contact Concierge
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-gold transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-gold transition-colors">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="font-serif text-base text-gold tracking-wide mb-4">The Giftora Circle</h5>
            <p className="text-xs text-gray-300 leading-relaxed mb-4">
              Join 40,000+ patrons receiving exclusive curation previews, festival specials, and ₹100 off your first bespoke order.
            </p>
            {subscribed ? (
              <div className="bg-burgundy/40 border border-gold/40 p-3 rounded-lg flex items-center space-x-2 text-xs text-gold-light">
                <CheckCircle2 className="w-4 h-4 text-gold flex-shrink-0" />
                <span>Thank you for joining our private circle!</span>
              </div>
            ) : (
              <form onSubmit={handleNewsletter} className="space-y-2">
                <input
                  type="email"
                  required
                  placeholder="Enter your email..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-charcoal-light border border-charcoal-muted text-white text-xs px-3.5 py-2.5 rounded focus:outline-none focus:border-gold transition-all"
                />
                <button
                  type="submit"
                  className="w-full bg-burgundy hover:bg-burgundy-light text-white text-xs font-semibold py-2.5 rounded uppercase tracking-wider transition-all shadow-sm"
                >
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-charcoal-light flex flex-col sm:flex-row items-center justify-between text-xs text-charcoal-muted space-y-4 sm:space-y-0">
        <p>© {new Date().getFullYear()} Giftora Luxury Gifting Studio. All Rights Reserved.</p>
        <div className="flex items-center space-x-4">
          <span className="flex items-center space-x-1">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-burgundy-light fill-burgundy-light" />
            <span>for timeless memories</span>
          </span>
        </div>
      </div>
    </footer>
  );
};
