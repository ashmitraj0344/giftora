import React from 'react';
export default function TermsPage() {
    return (<div className="bg-ivory min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white p-8 sm:p-12 rounded-3xl border border-beige shadow-sm space-y-6 text-xs text-charcoal leading-relaxed">
        <span className="text-[10px] uppercase tracking-widest text-gold-dark font-bold">Terms of Service</span>
        <h1 className="font-serif text-3xl font-bold text-charcoal">Terms & Conditions</h1>
        <p className="text-charcoal-muted">Last updated: November 2026</p>

        <section className="space-y-2">
          <h2 className="font-serif text-base font-bold text-burgundy">1. Acceptance of Terms</h2>
          <p className="text-charcoal-muted">
            By accessing or ordering from Giftora (&ldquo;giftora.com&rdquo;), you agree to be bound by these Terms and Conditions and our Privacy Policy.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-base font-bold text-burgundy">2. Bespoke Customization & Preview</h2>
          <p className="text-charcoal-muted">
            Customers are responsible for reviewing their customized photos, spelling of names, and dates in the interactive preview studio prior to completing checkout. Once an order is confirmed and enters the curing stage, modifications cannot be guaranteed.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-base font-bold text-burgundy">3. Intellectual Property</h2>
          <p className="text-charcoal-muted">
            You represent and warrant that you own or possess the rights to all photographs and messages uploaded to the studio. You agree not to upload defamatory, illegal, or copyright-infringing media.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-base font-bold text-burgundy">4. Pricing & Currency</h2>
          <p className="text-charcoal-muted">
            All prices are denominated in Indian Rupees (₹ INR) and include applicable taxes unless specifically denoted otherwise.
          </p>
        </section>
      </div>
    </div>);
}
