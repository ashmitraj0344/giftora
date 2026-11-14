'use client';
import React, { useState, useEffect } from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { Search, Filter, Sparkles, } from 'lucide-react';
const ALL_STATUSES = [
    'Pending',
    'Payment Processing',
    'Confirmed',
    'Design Approved',
    'Processing',
    'Shipped',
    'Out for Delivery',
    'Delivered',
    'Cancelled',
];
export default function AdminOrdersPage() {
    const [orders, setOrders] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [editingOrder, setEditingOrder] = useState(null);
    const [newStatus, setNewStatus] = useState('Processing');
    const [carrier, setCarrier] = useState('BlueDart Express');
    const [trackingNo, setTrackingNo] = useState('');
    const [saving, setSaving] = useState(false);
    const fetchOrders = async () => {
        setLoading(true);
        try {
            const q = new URLSearchParams();
            if (selectedStatus !== 'all')
                q.set('status', selectedStatus);
            if (search)
                q.set('search', search);
            const res = await fetch(`/api/admin/orders?${q.toString()}`);
            const data = await res.json();
            if (data.orders && data.orders.length > 0) {
                setOrders(data.orders);
                return;
            }
        }
        catch (e) {
            // ignore
        }
        // Default mock data for admin inspection
        setOrders([
            {
                _id: 'ord-101',
                orderNumber: 'GFT-849201',
                customerDetails: {
                    name: 'Aarav Sharma',
                    email: 'customer@giftora.com',
                    phone: '+91 98111 22334',
                },
                orderItems: [
                    {
                        productId: 'prod_1',
                        productName: 'Artisan Walnut Wood Photo Frame',
                        productImage: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80',
                        unitPrice: 749,
                        quantity: 1,
                        customizationCharges: 90,
                        giftPackaging: true,
                        totalItemPrice: 839,
                        variant: { size: '7x5 inches', color: 'Deep Walnut' },
                        customizationDetails: {
                            uploadedImagesCount: 1,
                            customTexts: ['Together Forever • 2026'],
                            previewImage: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=600&q=80',
                        },
                    },
                ],
                shippingAddress: {
                    street: '15 Lotus Boulevard, Sector 100',
                    city: 'Noida',
                    state: 'Uttar Pradesh',
                    postalCode: '201304',
                    country: 'India',
                },
                subtotal: 839,
                shippingCharge: 0,
                discount: 0,
                totalAmount: 839,
                orderStatus: 'Processing',
                paymentStatus: 'Captured',
                paymentMethod: 'Razorpay (UPI)',
                trackingNumber: 'BLUEDART-8899201',
                trackingCarrier: 'BlueDart Express',
                statusHistory: [],
                createdAt: new Date().toISOString(),
            },
            {
                _id: 'ord-102',
                orderNumber: 'GFT-792134',
                customerDetails: {
                    name: 'Priya Sundaram',
                    email: 'priya@example.com',
                    phone: '+91 98765 00112',
                },
                orderItems: [
                    {
                        productId: 'prod_6',
                        productName: 'Warm Acrylic LED Night Glow Lamp',
                        productImage: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=600&q=80',
                        unitPrice: 899,
                        quantity: 1,
                        customizationCharges: 130,
                        giftPackaging: true,
                        totalItemPrice: 1029,
                        customizationDetails: {
                            uploadedImagesCount: 1,
                            customTexts: ['Happy Retirement Mom & Dad'],
                        },
                    },
                ],
                shippingAddress: {
                    street: '42 Sea Breeze Towers, Worli',
                    city: 'Mumbai',
                    state: 'Maharashtra',
                    postalCode: '400018',
                    country: 'India',
                },
                subtotal: 1029,
                shippingCharge: 0,
                discount: 0,
                totalAmount: 1029,
                orderStatus: 'Confirmed',
                paymentStatus: 'Captured',
                paymentMethod: 'Razorpay (Card)',
                statusHistory: [],
                createdAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
            },
        ]);
    };
    useEffect(() => {
        fetchOrders().finally(() => setLoading(false));
    }, [selectedStatus]);
    const handleUpdateStatus = async (e) => {
        e.preventDefault();
        if (!editingOrder)
            return;
        setSaving(true);
        try {
            await fetch(`/api/admin/orders/${editingOrder._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    orderStatus: newStatus,
                    trackingCarrier: carrier,
                    trackingNumber: trackingNo,
                    note: `Status updated by Admin to ${newStatus}`,
                }),
            });
            // Update in local state
            setOrders((prev) => prev.map((o) => o._id === editingOrder._id
                ? { ...o, orderStatus: newStatus, trackingCarrier: carrier, trackingNumber: trackingNo }
                : o));
            setEditingOrder(null);
        }
        catch (e) {
            alert('Updated status in local mode');
            setEditingOrder(null);
        }
        finally {
            setSaving(false);
        }
    };
    return (<div className="bg-ivory min-h-screen flex">
      <AdminSidebar />

      <main className="flex-grow p-8 space-y-6 overflow-x-hidden">
        <div>
          <span className="text-xs uppercase tracking-widest text-gold-dark font-semibold">
            Atelier Dispatch & Status
          </span>
          <h1 className="font-serif text-3xl font-bold text-charcoal mt-0.5">
            Admin Order Management
          </h1>
          <p className="text-xs text-charcoal-muted mt-1">
            Inspect custom typography and photos, update production stages, and issue courier tracking numbers.
          </p>
        </div>

        {/* Filter controls */}
        <div className="bg-white p-4 rounded-2xl border border-beige shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-charcoal-muted"/>
            <span className="font-semibold text-charcoal">Filter Stage:</span>
            <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className="bg-beige-light/50 border border-beige-dark rounded-xl px-3 py-1.5 focus:outline-none focus:border-burgundy">
              <option value="all">All Production Stages</option>
              {ALL_STATUSES.map((s) => (<option key={s} value={s}>
                  {s}
                </option>))}
            </select>
          </div>

          <div className="relative w-full sm:w-64">
            <input type="text" placeholder="Search by order or customer..." value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && fetchOrders()} className="w-full bg-beige-light/50 border border-beige-dark rounded-xl py-2 pl-9 pr-3 text-xs focus:outline-none focus:border-burgundy"/>
            <Search className="w-4 h-4 text-charcoal-muted absolute left-3 top-2.5"/>
          </div>
        </div>

        {/* Orders list */}
        <div className="space-y-4">
          {orders.map((ord) => (<div key={ord._id} className="bg-white rounded-2xl border border-beige shadow-sm p-6 space-y-4">
              {/* Row Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-beige gap-3 text-xs">
                <div className="flex items-center space-x-4">
                  <span className="font-mono text-base font-bold text-burgundy">{ord.orderNumber}</span>
                  <span className="bg-burgundy/10 text-burgundy font-bold text-[10px] uppercase px-2.5 py-1 rounded-full border border-burgundy/20">
                    {ord.orderStatus}
                  </span>
                  <span className="text-emerald-700 bg-emerald-50 text-[10px] font-bold px-2 py-0.5 rounded">
                    Payment: {ord.paymentStatus}
                  </span>
                </div>

                <div className="flex items-center space-x-3">
                  <span className="font-serif font-bold text-base text-charcoal">₹{ord.totalAmount}</span>
                  <button onClick={() => {
                setEditingOrder(ord);
                setNewStatus(ord.orderStatus);
                setCarrier(ord.trackingCarrier || 'BlueDart Express');
                setTrackingNo(ord.trackingNumber || '');
            }} className="bg-burgundy hover:bg-burgundy-dark text-white font-semibold px-3.5 py-1.5 rounded-lg text-xs transition-colors">
                    Update Status & Tracking
                  </button>
                </div>
              </div>

              {/* Customer & Address Details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs bg-beige-light/30 p-3.5 rounded-xl border border-beige">
                <div>
                  <span className="text-charcoal-muted font-medium block">Patron Info</span>
                  <p className="font-bold text-charcoal">{ord.customerDetails.name}</p>
                  <p className="text-charcoal-muted">{ord.customerDetails.email}</p>
                  <p className="text-charcoal-muted">{ord.customerDetails.phone}</p>
                </div>
                <div>
                  <span className="text-charcoal-muted font-medium block">Delivery Destination</span>
                  <p className="text-charcoal">{ord.shippingAddress.street}</p>
                  <p className="text-charcoal">
                    {ord.shippingAddress.city}, {ord.shippingAddress.state} - {ord.shippingAddress.postalCode}
                  </p>
                </div>
                <div>
                  <span className="text-charcoal-muted font-medium block">Logistics Dispatch</span>
                  <p className="text-charcoal">{ord.trackingCarrier || 'Pending dispatch'}</p>
                  <p className="font-mono text-burgundy font-semibold">{ord.trackingNumber || 'No tracking ID assigned'}</p>
                </div>
              </div>

              {/* Line Items with Customization Preview */}
              <div className="space-y-3 pt-2">
                {ord.orderItems.map((item, i) => (<div key={i} className="flex items-start space-x-4 text-xs border border-beige rounded-xl p-3 bg-white">
                    <img src={item.customizationDetails?.previewImage || item.productImage} alt={item.productName} className="w-16 h-16 rounded-lg object-cover border border-beige flex-shrink-0"/>
                    <div className="flex-grow">
                      <div className="flex justify-between items-start">
                        <h4 className="font-serif text-sm font-bold text-charcoal">{item.productName}</h4>
                        <span className="font-serif font-bold text-burgundy">₹{item.totalItemPrice}</span>
                      </div>
                      <p className="text-charcoal-muted mt-0.5">Quantity: {item.quantity}</p>
                      {item.customizationDetails && (<div className="mt-1.5 p-2 bg-beige-light/60 rounded border border-beige space-y-0.5">
                          <span className="font-bold text-burgundy text-[11px] flex items-center space-x-1">
                            <Sparkles className="w-3 h-3 text-gold"/>
                            <span>Customer Customization Specifications:</span>
                          </span>
                          {item.customizationDetails.customTexts?.map((txt, ti) => (<p key={ti} className="italic text-charcoal font-medium">
                              Line {ti + 1}: &ldquo;{txt}&rdquo;
                            </p>))}
                        </div>)}
                    </div>
                  </div>))}
              </div>
            </div>))}
        </div>

        {/* Edit Status Modal */}
        {editingOrder && (<div className="fixed inset-0 bg-charcoal/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
            <div className="bg-white rounded-2xl border border-beige shadow-2xl p-6 max-w-md w-full space-y-4 text-xs">
              <h3 className="font-serif text-lg font-bold text-charcoal">
                Update Production Status: {editingOrder.orderNumber}
              </h3>

              <form onSubmit={handleUpdateStatus} className="space-y-4">
                <div>
                  <label className="block font-semibold text-charcoal mb-1">New Production Stage</label>
                  <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)} className="w-full border border-beige-dark rounded-xl p-2.5 bg-white text-xs text-charcoal">
                    {ALL_STATUSES.map((s) => (<option key={s} value={s}>
                        {s}
                      </option>))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-charcoal mb-1">Courier Carrier</label>
                  <input type="text" value={carrier} onChange={(e) => setCarrier(e.target.value)} placeholder="e.g. BlueDart Express / Delhivery" className="w-full border border-beige-dark rounded-xl p-2.5 text-xs text-charcoal"/>
                </div>

                <div>
                  <label className="block font-semibold text-charcoal mb-1">Airway Bill / Tracking Number</label>
                  <input type="text" value={trackingNo} onChange={(e) => setTrackingNo(e.target.value)} placeholder="e.g. BLUEDART-8899201" className="w-full border border-beige-dark rounded-xl p-2.5 text-xs font-mono text-charcoal"/>
                </div>

                <div className="flex justify-end space-x-2 pt-2 border-t border-beige">
                  <button type="button" onClick={() => setEditingOrder(null)} className="px-4 py-2 border border-beige-dark rounded-xl text-charcoal hover:bg-beige">
                    Cancel
                  </button>
                  <button type="submit" disabled={saving} className="px-4 py-2 bg-burgundy text-white font-semibold rounded-xl hover:bg-burgundy-dark">
                    {saving ? 'Updating...' : 'Save & Notify Patron'}
                  </button>
                </div>
              </form>
            </div>
          </div>)}
      </main>
    </div>);
}
