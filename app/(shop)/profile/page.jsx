'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { MapPin, Package, Heart, ShieldCheck, Plus, Phone, Mail, } from 'lucide-react';
export default function ProfilePage() {
    const { user } = useAuth();
    const [addresses, setAddresses] = useState([
        {
            id: 'addr-1',
            street: '15 Lotus Boulevard, Sector 100',
            city: 'Noida',
            state: 'Uttar Pradesh',
            postalCode: '201304',
            country: 'India',
            isDefault: true,
        },
    ]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newAddr, setNewAddr] = useState({
        street: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'India',
    });
    const handleAddAddress = (e) => {
        e.preventDefault();
        if (newAddr.street && newAddr.city) {
            setAddresses([...addresses, { ...newAddr, id: `addr-${Date.now()}`, isDefault: false }]);
            setShowAddModal(false);
            setNewAddr({ street: '', city: '', state: '', postalCode: '', country: 'India' });
        }
    };
    return (<div className="bg-ivory min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <div>
          <span className="text-xs uppercase tracking-widest text-gold-dark font-semibold">
            Personal Atelier Account
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-charcoal mt-0.5">
            My Profile & Preferences
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Summary Card */}
          <div className="bg-white p-6 rounded-2xl border border-beige shadow-sm space-y-6">
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-burgundy/10 text-burgundy font-serif font-bold text-3xl flex items-center justify-center mx-auto mb-3">
                {user ? user.name.charAt(0).toUpperCase() : 'G'}
              </div>
              <h2 className="font-serif text-lg font-bold text-charcoal">{user?.name || 'Patron'}</h2>
              <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-gold/15 text-gold-dark">
                {user?.role || 'Customer'}
              </span>
            </div>

            <div className="space-y-3 text-xs text-charcoal border-t border-beige pt-4">
              <div className="flex items-center space-x-2.5">
                <Mail className="w-4 h-4 text-gold-dark"/>
                <span className="text-charcoal-muted truncate">{user?.email || 'customer@giftora.com'}</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <Phone className="w-4 h-4 text-gold-dark"/>
                <span className="text-charcoal-muted">+91 98111 22334</span>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-beige">
              <Link href="/orders" className="w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold text-charcoal hover:bg-beige transition-colors">
                <div className="flex items-center space-x-2">
                  <Package className="w-4 h-4 text-burgundy"/>
                  <span>My Orders</span>
                </div>
                <span>→</span>
              </Link>
              <Link href="/wishlist" className="w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold text-charcoal hover:bg-beige transition-colors">
                <div className="flex items-center space-x-2">
                  <Heart className="w-4 h-4 text-burgundy"/>
                  <span>My Wishlist</span>
                </div>
                <span>→</span>
              </Link>
              {user?.role === 'admin' && (<Link href="/admin" className="w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold text-burgundy bg-gold/10 hover:bg-gold/20 transition-colors">
                  <div className="flex items-center space-x-2">
                    <ShieldCheck className="w-4 h-4"/>
                    <span>Admin Dashboard</span>
                  </div>
                  <span>→</span>
                </Link>)}
            </div>
          </div>

          {/* Right Address Manager (Cols 2-3) */}
          <div className="md:col-span-2 bg-white p-6 rounded-2xl border border-beige shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-beige">
              <div>
                <h3 className="font-serif text-base font-bold text-charcoal flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-gold-dark"/>
                  <span>Saved Delivery Addresses</span>
                </h3>
                <p className="text-xs text-charcoal-muted mt-0.5">
                  Addresses used for speedy checkout and gift dispatches.
                </p>
              </div>
              <button onClick={() => setShowAddModal(true)} className="bg-burgundy hover:bg-burgundy-dark text-white text-xs font-semibold px-3.5 py-2 rounded-xl flex items-center space-x-1.5 transition-colors">
                <Plus className="w-3.5 h-3.5"/>
                <span>Add Address</span>
              </button>
            </div>

            {/* Address cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {addresses.map((addr) => (<div key={addr.id} className="p-4 rounded-xl border border-beige bg-beige-light/30 space-y-2 text-xs relative">
                  {addr.isDefault && (<span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full inline-block mb-1">
                      Default Delivery Address
                    </span>)}
                  <p className="font-bold text-charcoal">{user?.name || 'Aarav Sharma'}</p>
                  <p className="text-charcoal-muted">{addr.street}</p>
                  <p className="text-charcoal-muted">
                    {addr.city}, {addr.state} - {addr.postalCode}
                  </p>
                  <p className="text-charcoal-muted">{addr.country}</p>
                </div>))}
            </div>

            {/* Add Address Modal Form */}
            {showAddModal && (<form onSubmit={handleAddAddress} className="mt-4 p-5 bg-beige-light/60 rounded-xl border border-beige space-y-4 text-xs animate-in fade-in">
                <h4 className="font-serif text-sm font-bold text-charcoal">New Address Details</h4>
                <div>
                  <label className="block font-semibold mb-1">Street Address</label>
                  <input type="text" required value={newAddr.street} onChange={(e) => setNewAddr({ ...newAddr, street: e.target.value })} placeholder="Apartment, Street name..." className="w-full border border-beige-dark rounded-lg p-2 bg-white"/>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block font-semibold mb-1">City</label>
                    <input type="text" required value={newAddr.city} onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })} className="w-full border border-beige-dark rounded-lg p-2 bg-white"/>
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">State</label>
                    <input type="text" required value={newAddr.state} onChange={(e) => setNewAddr({ ...newAddr, state: e.target.value })} className="w-full border border-beige-dark rounded-lg p-2 bg-white"/>
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Postal Code</label>
                    <input type="text" required value={newAddr.postalCode} onChange={(e) => setNewAddr({ ...newAddr, postalCode: e.target.value })} className="w-full border border-beige-dark rounded-lg p-2 bg-white"/>
                  </div>
                </div>
                <div className="flex justify-end space-x-2 pt-2">
                  <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 border border-beige-dark rounded-lg text-charcoal hover:bg-beige">
                    Cancel
                  </button>
                  <button type="submit" className="px-4 py-2 bg-burgundy text-white font-semibold rounded-lg hover:bg-burgundy-dark">
                    Save Address
                  </button>
                </div>
              </form>)}
          </div>
        </div>
      </div>
    </div>);
}
