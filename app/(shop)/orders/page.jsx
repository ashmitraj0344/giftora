'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import {
  Package,
  ArrowRight,
  Truck,
  Sparkles,
  Search,
  CheckCircle2,
  Clock,
  ExternalLink,
  MapPin,
  CreditCard,
} from 'lucide-react';

export default function MyOrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function loadOrders() {
      setLoading(true);
      let combined = [];

      // 1. Load locally cached orders from client storage (instant zero-lag)
      try {
        const local = JSON.parse(localStorage.getItem('giftora_my_orders') || '[]');
        if (Array.isArray(local) && local.length > 0) {
          combined = [...local];
        }
      } catch (e) {
        // ignore
      }

      // 2. Fetch from MongoDB Atlas API
      try {
        const res = await fetch('/api/orders');
        const data = await res.json();
        if (data.orders && Array.isArray(data.orders)) {
          // Merge avoiding duplicate order numbers
          const seen = new Set(combined.map((o) => o.orderNumber));
          for (const ord of data.orders) {
            if (!seen.has(ord.orderNumber)) {
              combined.push(ord);
              seen.add(ord.orderNumber);
            }
          }
        }
      } catch (err) {
        // ignore
      }

      // 3. Fallback to rich sample order if brand new visitor
      if (combined.length === 0) {
        combined = [
          {
            _id: 'demo_ord_1',
            orderNumber: 'GFT-849201',
            customerDetails: {
              name: user?.name || 'Aarav Sharma',
              email: user?.email || 'customer@giftora.com',
              phone: '+91 98111 22334',
            },
            orderItems: [
              {
                productId: 'prod_1',
                productName: 'Artisan Walnut Wood Photo Frame',
                productImage: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=600&q=80',
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
            orderStatus: 'Dispatched',
            paymentStatus: 'Captured',
            paymentMethod: 'UPI (er2ashmitraj26@ybl)',
            trackingNumber: 'BLUEDART-8899201',
            trackingCarrier: 'BlueDart Express',
            createdAt: new Date().toISOString(),
          },
        ];
      }

      setOrders(combined);
      setLoading(false);
    }

    loadOrders();
  }, [user]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Confirmed':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Design Approved':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Processing':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Dispatched':
      case 'Shipped':
        return 'bg-amber-50 text-amber-800 border-amber-300 font-bold';
      case 'Delivered':
        return 'bg-emerald-100 text-emerald-900 border-emerald-300 font-bold';
      default:
        return 'bg-beige text-charcoal border-beige-dark';
    }
  };

  const filteredOrders = orders.filter((o) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      o.orderNumber?.toLowerCase().includes(q) ||
      o.customerDetails?.name?.toLowerCase().includes(q) ||
      o.orderItems?.some((it) => it.productName?.toLowerCase().includes(q))
    );
  });

  return (
    <div className="bg-ivory min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-beige pb-6">
          <div>
            <span className="text-xs uppercase tracking-widest text-gold-dark font-semibold">
              Patron Purchases
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-charcoal mt-1">
              My Orders & Customizations
            </h1>
            <p className="text-xs text-charcoal-muted mt-1">
              Review your customized gifts, preview your engraved messages, and track live dispatch.
            </p>
          </div>

          <Link
            href="/shop"
            className="self-start sm:self-auto px-4 py-2 bg-burgundy hover:bg-burgundy-dark text-white text-xs font-semibold rounded-xl shadow-xs transition-colors flex items-center space-x-1.5"
          >
            <span>Explore More Gifts</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Search Order Bar */}
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-charcoal-muted absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by Order ID (e.g. GFT-...) or gift name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-beige-dark bg-white text-xs text-charcoal placeholder:text-charcoal-muted/70 focus:outline-none focus:border-burgundy"
          />
        </div>

        {/* Orders List */}
        {loading ? (
          <div className="text-center py-16">
            <div className="w-8 h-8 border-4 border-burgundy border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs text-charcoal-muted font-medium">Loading your personalized orders...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-white rounded-3xl border border-beige p-12 text-center shadow-sm max-w-md mx-auto space-y-4">
            <Package className="w-12 h-12 text-gold mx-auto opacity-70" />
            <h3 className="font-serif text-lg font-bold text-charcoal">No Orders Found</h3>
            <p className="text-xs text-charcoal-muted leading-relaxed">
              We couldn&apos;t find any orders matching your search. Browse our catalogue to craft a personalized keepsake.
            </p>
            <Link
              href="/shop"
              className="inline-block bg-burgundy text-white text-xs font-semibold px-5 py-2.5 rounded-xl hover:bg-burgundy-dark transition-colors"
            >
              Start Personalizing
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <div
                key={order._id || order.orderNumber}
                className="bg-white rounded-3xl border border-beige shadow-sm overflow-hidden transition-all hover:shadow-md"
              >
                {/* Order Top Bar */}
                <div className="bg-gradient-to-r from-beige-light/70 to-ivory p-5 border-b border-beige flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center space-x-3">
                    <div>
                      <span className="text-[10px] text-charcoal-muted uppercase font-bold tracking-wider">
                        Order Number
                      </span>
                      <p className="font-mono font-bold text-burgundy text-sm sm:text-base">
                        {order.orderNumber}
                      </p>
                    </div>
                    <div className="hidden sm:block h-6 w-px bg-beige-dark" />
                    <div className="hidden sm:block">
                      <span className="text-[10px] text-charcoal-muted uppercase font-bold tracking-wider">
                        Date Placed
                      </span>
                      <p className="font-medium text-charcoal">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <span
                      className={`text-xs px-3 py-1 rounded-full border font-semibold flex items-center space-x-1.5 ${getStatusBadge(
                        order.orderStatus
                      )}`}
                    >
                      {order.orderStatus === 'Dispatched' || order.orderStatus === 'Shipped' ? (
                        <Truck className="w-3.5 h-3.5" />
                      ) : (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      )}
                      <span>{order.orderStatus}</span>
                    </span>

                    <span className="font-serif font-bold text-charcoal text-base">
                      ₹{order.totalAmount}
                    </span>
                  </div>
                </div>

                {/* Items Container */}
                <div className="p-6 space-y-5">
                  {order.orderItems?.map((item, idx) => {
                    const previewImg =
                      item.customizationDetails?.previewImage ||
                      item.productImage ||
                      'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=300&q=80';

                    return (
                      <div
                        key={idx}
                        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-beige last:border-b-0 last:pb-0"
                      >
                        <div className="flex items-start space-x-4">
                          {/* Live Customized Preview Thumbnail */}
                          <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border border-beige-dark bg-beige-light/40 flex-shrink-0 shadow-xs">
                            <img
                              src={previewImg}
                              alt={item.productName}
                              className="w-full h-full object-cover"
                            />
                            {item.customizationDetails && (
                              <span className="absolute bottom-1 right-1 bg-burgundy/90 text-gold text-[9px] font-bold px-1.5 py-0.5 rounded shadow-xs">
                                Customized
                              </span>
                            )}
                          </div>

                          <div className="space-y-1">
                            <h4 className="font-serif font-bold text-sm sm:text-base text-charcoal">
                              {item.productName}
                            </h4>
                            <div className="flex flex-wrap gap-2 text-xs text-charcoal-muted">
                              <span>Qty: {item.quantity}</span>
                              {item.variant?.size && <span>• Size: {item.variant.size}</span>}
                              {item.variant?.color && <span>• Shade: {item.variant.color}</span>}
                            </div>

                            {/* Customized Text Lines Preview */}
                            {item.customizationDetails?.customTexts?.length > 0 && (
                              <div className="mt-1.5 p-2 bg-beige-light/50 rounded-lg border border-gold/30 text-xs">
                                <span className="text-[10px] uppercase font-bold text-gold-dark block">
                                  Personalized Inscription:
                                </span>
                                <p className="font-serif italic text-burgundy font-semibold">
                                  &ldquo;{item.customizationDetails.customTexts.join(' • ')}&rdquo;
                                </p>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="text-right self-end sm:self-center">
                          <p className="font-serif font-bold text-burgundy text-base">
                            ₹{item.totalItemPrice || item.unitPrice * item.quantity}
                          </p>
                          <span className="text-[10px] text-charcoal-muted">
                            (₹{item.unitPrice} base + ₹{item.customizationCharges || 0} custom)
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Order Footer & Actions */}
                <div className="bg-beige-light/40 p-4 sm:p-5 border-t border-beige flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center space-x-2 text-charcoal-muted">
                    <MapPin className="w-4 h-4 text-gold-dark flex-shrink-0" />
                    <span className="truncate max-w-xs sm:max-w-md">
                      Deliver to: {order.shippingAddress?.street}, {order.shippingAddress?.city}
                    </span>
                  </div>

                  <div className="flex items-center space-x-3 w-full sm:w-auto">
                    <Link
                      href={`/orders/track/${order.orderNumber}`}
                      className="flex-grow sm:flex-grow-0 px-4 py-2 bg-burgundy hover:bg-burgundy-dark text-white font-semibold rounded-xl text-xs flex items-center justify-center space-x-1.5 transition-colors shadow-xs"
                    >
                      <Truck className="w-3.5 h-3.5" />
                      <span>Track Dispatch Live</span>
                    </Link>

                    <Link
                      href={`/shop`}
                      className="px-3.5 py-2 border border-beige-dark bg-white hover:bg-beige-light text-charcoal font-semibold rounded-xl text-xs transition-colors flex items-center space-x-1"
                    >
                      <span>Buy Again</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
