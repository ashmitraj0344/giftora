import React from 'react';
export default function PrivacyPolicyPage() {
    return (<div className="bg-ivory min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white p-8 sm:p-12 rounded-3xl border border-beige shadow-sm space-y-6 text-xs text-charcoal leading-relaxed">
        <span className="text-[10px] uppercase tracking-widest text-gold-dark font-bold">Legal Governance</span>
        <h1 className="font-serif text-3xl font-bold text-charcoal">Privacy & Data Security Policy</h1>
        <p className="text-charcoal-muted">Last revised: November 2026</p>

        <section className="space-y-2">
          <h2 className="font-serif text-base font-bold text-burgundy">1. Image & Personal Photo Privacy</h2>
          <p className="text-charcoal-muted">
            Photographs, memories, and personal text uploaded to the Giftora Personalization Studio are used exclusively for manufacturing and quality inspecting your ordered gifts. We never share, license, or publish customer photographs without explicit written consent.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-base font-bold text-burgundy">2. Information We Collect</h2>
          <p className="text-charcoal-muted">
            We collect personal identification information including your full name, email address, contact telephone, and delivery street address to process orders and provide express dispatch tracking.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-base font-bold text-burgundy">3. Payment Information Security</h2>
          <p className="text-charcoal-muted">
            Giftora never stores credit/debit card numbers or UPI PINs on our servers. All transactions are securely processed directly by Razorpay using 256-bit SSL encryption adhering to PCI-DSS Level 1 compliance.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-base font-bold text-burgundy">4. Cookies & Session Management</h2>
          <p className="text-charcoal-muted">
            We use secure httpOnly cookies to authenticate user sessions and retain customized gifts in your shopping bag.
          </p>
        </section>
      </div>
    </div>);
}
