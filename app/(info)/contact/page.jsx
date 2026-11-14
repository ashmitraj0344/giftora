'use client';
import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, Clock } from 'lucide-react';
export default function ContactPage() {
    const [submitted, setSubmitted] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
    };
    return (<div className="bg-ivory min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-2">
          <span className="text-xs uppercase tracking-widest text-gold-dark font-semibold">
            Dedicated Concierge
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal">
            Get in Touch with Giftora
          </h1>
          <p className="text-xs text-charcoal-muted max-w-md mx-auto">
            Need design advice, corporate bulk gifting, or custom sizes? Our atelier consultants are here to assist you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Contact Details Card (Cols 1-5) */}
          <div className="md:col-span-5 bg-white p-6 rounded-2xl border border-beige shadow-sm space-y-6 text-xs text-charcoal">
            <h3 className="font-serif text-base font-bold text-burgundy">Atelier Concierge</h3>

            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-gold-dark mt-0.5 flex-shrink-0"/>
                <div>
                  <span className="font-bold block">Flagship Atelier</span>
                  <span className="text-charcoal-muted">Prestige Heritage Towers, MG Road, Bengaluru, Karnataka 560001</span>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Phone className="w-4 h-4 text-gold-dark mt-0.5 flex-shrink-0"/>
                <div>
                  <span className="font-bold block">Direct Phone</span>
                  <span className="text-charcoal-muted">+91 (080) 4120-7799 / +91 98765 43210</span>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Mail className="w-4 h-4 text-gold-dark mt-0.5 flex-shrink-0"/>
                <div>
                  <span className="font-bold block">Email Support</span>
                  <span className="text-charcoal-muted">concierge@giftora.com</span>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Clock className="w-4 h-4 text-gold-dark mt-0.5 flex-shrink-0"/>
                <div>
                  <span className="font-bold block">Concierge Hours</span>
                  <span className="text-charcoal-muted">Mon – Sat: 9:30 AM – 7:30 PM IST</span>
                </div>
              </div>
            </div>
          </div>

          {/* Form (Cols 6-12) */}
          <div className="md:col-span-7 bg-white p-8 rounded-2xl border border-beige shadow-sm">
            {submitted ? (<div className="text-center py-10 space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto"/>
                <h3 className="font-serif text-lg font-bold text-charcoal">Message Received</h3>
                <p className="text-xs text-charcoal-muted max-w-sm mx-auto">
                  Thank you for contacting Giftora. A senior gifting concierge will reply to your inquiry within 2 business hours.
                </p>
              </div>) : (<form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <h3 className="font-serif text-base font-bold text-charcoal mb-4">Send an Inquiry</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold mb-1">Your Name</label>
                    <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full border border-beige-dark rounded-xl p-2.5 focus:outline-none focus:border-burgundy"/>
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Your Email</label>
                    <input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full border border-beige-dark rounded-xl p-2.5 focus:outline-none focus:border-burgundy"/>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold mb-1">Subject</label>
                  <input type="text" required value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} placeholder="e.g. Bulk Corporate Gifting Inquiry" className="w-full border border-beige-dark rounded-xl p-2.5 focus:outline-none focus:border-burgundy"/>
                </div>

                <div>
                  <label className="block font-semibold mb-1">Message</label>
                  <textarea rows={4} required value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} placeholder="Tell us what you'd like to create..." className="w-full border border-beige-dark rounded-xl p-2.5 focus:outline-none focus:border-burgundy"/>
                </div>

                <button type="submit" className="w-full bg-burgundy hover:bg-burgundy-dark text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center space-x-2">
                  <Send className="w-3.5 h-3.5"/>
                  <span>Send Message</span>
                </button>
              </form>)}
          </div>
        </div>
      </div>
    </div>);
}
