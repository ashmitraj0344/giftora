import React from 'react';
import { Truck, Clock } from 'lucide-react';
export default function ShippingReturnsPage() {
    return (<div className="bg-ivory min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white p-8 sm:p-12 rounded-3xl border border-beige shadow-sm space-y-8 text-xs text-charcoal leading-relaxed">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-gold-dark font-bold">Logistics & Assurances</span>
          <h1 className="font-serif text-3xl font-bold text-charcoal mt-1">Shipping, Delivery & Returns</h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 bg-beige-light/40 rounded-xl border border-beige space-y-1.5">
            <div className="flex items-center space-x-2 text-burgundy font-bold">
              <Clock className="w-4 h-4"/>
              <span>Curing & Assembly Time</span>
            </div>
            <p className="text-charcoal-muted">1 to 2 business days for printing, laser engraving, and quality testing.</p>
          </div>
          <div className="p-4 bg-beige-light/40 rounded-xl border border-beige space-y-1.5">
            <div className="flex items-center space-x-2 text-burgundy font-bold">
              <Truck className="w-4 h-4"/>
              <span>Express Logistics</span>
            </div>
            <p className="text-charcoal-muted">Complimentary express shipping on all orders above ₹999 across India.</p>
          </div>
        </div>

        <section className="space-y-2">
          <h2 className="font-serif text-base font-bold text-burgundy">Express Delivery Timeline</h2>
          <p className="text-charcoal-muted">
            We partner with premier express logistics carriers including BlueDart Air Express, Delhivery, and DTDC. Most major metros (Bengaluru, Delhi NCR, Mumbai, Hyderabad, Chennai, Kolkata) receive their orders within 3-4 business days. Regional destinations are fulfilled within 4-6 business days.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-base font-bold text-burgundy">Free Replacement Guarantee</h2>
          <p className="text-charcoal-muted">
            Because personalized gifts are made-to-order with custom photographs and names, standard returns for buyer change of mind are not accepted. However, if your order arrives damaged in transit or features printing defects, we will reprint and express-ship a fresh replacement free of charge.
          </p>
        </section>
      </div>
    </div>);
}
