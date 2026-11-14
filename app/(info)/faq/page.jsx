'use client';
import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
const FAQS = [
    {
        q: 'How does the interactive Customization Studio work?',
        a: 'Our Studio allows you to upload high-resolution photographs, input custom names or anniversary dates, choose from luxury serif and handwritten fonts, and adjust the scale and placement in real time. What you preview on the canvas is the exact rendering handed to our engraving and printing artisans.',
    },
    {
        q: 'What image formats and resolutions are supported?',
        a: 'We support JPG, JPEG, PNG, and WebP files up to 10MB in size. For crisp photo framing and canvas results, we recommend images of at least 1500x1500 pixels. Our artisans perform resolution pre-flight checks before printing.',
    },
    {
        q: 'How long does handcrafting and express delivery take?',
        a: 'Because every gift is bespoke, handcrafting and curing takes 1 to 2 business days. Express logistics with BlueDart / Delhivery takes 2 to 3 days depending on your city. Most orders arrive within 4-5 business days.',
    },
    {
        q: 'What if my gift arrives damaged or the print has flaws?',
        a: 'We offer an unconditional 100% Design & Quality Guarantee. If your order arrives damaged or with printing imperfections, simply email us a photo at concierge@giftora.com within 48 hours and we will reprint and express-ship a fresh replacement free of charge.',
    },
    {
        q: 'What payment methods do you accept?',
        a: 'We accept all major payment methods powered by Razorpay: UPI (Google Pay, PhonePe, Paytm), Credit & Debit cards (Visa, MasterCard, RuPay), Net Banking across 50+ Indian banks, and digital wallets.',
    },
    {
        q: 'Can I track my order status in real time?',
        a: 'Yes! Once your order is placed, you receive a unique Order Number (e.g. GFT-849201). You can visit our "Track Order" page at any time to see the live step-by-step progress from Design Approval to Handcrafting and Courier Dispatch.',
    },
];
export default function FAQPage() {
    const [openIdx, setOpenIdx] = useState(0);
    return (<div className="bg-ivory min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs uppercase tracking-widest text-gold-dark font-semibold">
            Knowledge Base
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal">
            Frequently Asked Questions
          </h1>
          <p className="text-xs text-charcoal-muted">
            Everything you need to know about custom gifting, print quality, shipping, and guarantees.
          </p>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (<div key={idx} className="bg-white rounded-2xl border border-beige shadow-sm overflow-hidden transition-all">
                <button onClick={() => setOpenIdx(isOpen ? null : idx)} className="w-full text-left p-5 flex items-center justify-between text-sm font-serif font-bold text-charcoal hover:text-burgundy transition-colors">
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-charcoal-muted transform transition-transform ${isOpen ? 'rotate-180 text-burgundy' : ''}`}/>
                </button>
                {isOpen && (<div className="px-5 pb-5 pt-1 text-xs text-charcoal-muted leading-relaxed border-t border-beige/60">
                    {faq.a}
                  </div>)}
              </div>);
        })}
        </div>
      </div>
    </div>);
}
