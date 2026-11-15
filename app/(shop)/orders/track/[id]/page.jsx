'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  CheckCircle2,
  Clock,
  MapPin,
  Calendar,
  Sparkles,
  ArrowLeft,
  Search,
  Package,
  AlertCircle,
  Truck,
  ExternalLink,
} from 'lucide-react';

const ORDER_PIPELINE = [
  { status: 'Confirmed', label: 'Order Confirmed', desc: 'Payment verified & order queued' },
  { status: 'Design Approved', label: 'Design Approved', desc: 'Artisan checked resolution & typography' },
  { status: 'Processing', label: 'Artisan Handcrafting', desc: 'Sublimation printing, framing & assembly' },
  { status: 'Shipped', label: 'Dispatched with Courier', desc: 'Handed to express logistics partner' },
  { status: 'Delivered', label: 'Delivered to Doorstep', desc: 'Gift presented in signature packaging' },
];

export default function OrderTrackingPage() {
  const params = useParams();
  const rawId = params?.id || '';
  const router = useRouter();

  const [orderIdInput, setOrderIdInput] = useState(rawId === 'search' ? '' : rawId);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(rawId !== 'search');
  const [errorMsg, setErrorMsg] = useState(null);
  const [recentLocalOrders, setRecentLocalOrders] = useState([]);

  useEffect(() => {
    // Load local storage recent orders for quick lookup chips
    try {
      const local = JSON.parse(localStorage.getItem('giftora_my_orders') || '[]');
      if (Array.isArray(local)) {
        setRecentLocalOrders(local);
      }
    } catch (e) {
      // ignore
    }

    if (rawId && rawId !== 'search') {
      fetchOrder(rawId);
    } else {
      setLoading(false);
    }
  }, [rawId]);

  const fetchOrder = async (idToSearch) => {
    const cleanId = decodeURIComponent(idToSearch).trim();
    if (!cleanId) return;

    setLoading(true);
    setErrorMsg(null);

    // 1. First, check remote database via API
    try {
      const res = await fetch(`/api/orders/${encodeURIComponent(cleanId)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.order) {
          setOrder(data.order);
          setLoading(false);
          return;
        }
      }
    } catch (err) {
      console.warn('Network lookup failed, checking local storage', err);
    }

    // 2. Second, check localStorage for recent local orders
    try {
      const local = JSON.parse(localStorage.getItem('giftora_my_orders') || '[]');
      const match = local.find(
        (o) =>
          (o.orderNumber && o.orderNumber.toLowerCase() === cleanId.toLowerCase()) ||
          o._id === cleanId ||
          (o.customerDetails?.email && o.customerDetails.email.toLowerCase() === cleanId.toLowerCase()) ||
          (o.trackingNumber && o.trackingNumber.toLowerCase() === cleanId.toLowerCase())
      );
      if (match) {
        setOrder(match);
        setLoading(false);
        return;
      }
    } catch (e) {
      // ignore
    }

    // 3. Fallback demo order if testing mock order
    if (cleanId.toUpperCase().includes('GFT-DEMO') || cleanId.toUpperCase().includes('TEST')) {
      const demoOrder = {
        _id: 'mock_order_1',
        orderNumber: cleanId.startsWith('GFT') ? cleanId : `GFT-${cleanId.slice(-6)}`,
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
        paymentMethod: 'UPI (YouPI-PG)',
        trackingNumber: 'BLUEDART-EXP-8899201',
        trackingCarrier: 'BlueDart Air Express',
        statusHistory: [
          { status: 'Confirmed', timestamp: new Date(Date.now() - 36 * 3600 * 1000).toISOString(), note: 'Payment received via YouPI-PG.' },
          { status: 'Design Approved', timestamp: new Date(Date.now() - 20 * 3600 * 1000).toISOString(), note: 'Artisan approved photo alignment and typography.' },
          { status: 'Processing', timestamp: new Date(Date.now() - 6 * 3600 * 1000).toISOString(), note: 'Assembling frame and handcrafting finish.' },
        ],
        createdAt: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
        estimatedDeliveryDate: new Date(Date.now() + 3 * 24 * 3600 * 1000).toISOString(),
      };
      setOrder(demoOrder);
      setLoading(false);
      return;
    }

    // 4. Not found
    setOrder(null);
    setErrorMsg(`We couldn't find an active order matching "${cleanId}". Please verify your Order Number from your confirmation email or receipt.`);
    setLoading(false);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const clean = orderIdInput.trim();
    if (clean) {
      router.push(`/orders/track/${encodeURIComponent(clean)}`);
    }
  };

  const getStepStatus = (stepStatus) => {
    if (!order) return 'upcoming';
    const statusOrder = [
      'Pending',
      'Payment Processing',
      'Confirmed',
      'Design Approved',
      'Processing',
      'Dispatched',
      'Shipped',
      'Out for Delivery',
      'Delivered',
    ];

    const currentNorm = order.orderStatus === 'Dispatched' ? 'Shipped' : order.orderStatus;
    const targetNorm = stepStatus === 'Dispatched' ? 'Shipped' : stepStatus;

    const currentIdx = statusOrder.indexOf(currentNorm);
    const stepIdx = statusOrder.indexOf(targetNorm);

    if (currentIdx > stepIdx) return 'completed';
    if (currentIdx === stepIdx) return 'current';
    return 'upcoming';
  };

  return (
    <div className="bg-ivory min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Search header for tracking any order */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-beige shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div>
              <span className="text-xs uppercase tracking-widest text-gold-dark font-semibold">
                Live Dispatch & Atelier Center
              </span>
              <h1 className="font-serif text-2xl font-bold text-charcoal mt-0.5">
                Track Your Personalized Gift
              </h1>
            </div>
            <Link
              href="/orders"
              className="text-xs font-semibold text-burgundy hover:underline flex items-center space-x-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to My Orders</span>
            </Link>
          </div>

          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Enter Order Number (e.g. GFT-...) or email..."
                value={orderIdInput}
                onChange={(e) => setOrderIdInput(e.target.value)}
                className="w-full bg-beige-light/40 border border-beige-dark rounded-xl py-2.5 pl-10 pr-4 text-xs font-mono text-charcoal focus:outline-none focus:border-burgundy uppercase"
              />
              <Search className="w-4 h-4 text-charcoal-muted absolute left-3.5 top-3" />
            </div>
            <button
              type="submit"
              className="bg-burgundy hover:bg-burgundy-dark text-white text-xs font-semibold px-6 py-2.5 rounded-xl transition-colors shadow-xs"
            >
              Track Order
            </button>
          </form>

          {/* Quick Recent Orders Chips */}
          {recentLocalOrders.length > 0 && (
            <div className="mt-4 pt-4 border-t border-beige">
              <span className="text-[11px] font-semibold text-charcoal-muted block mb-2">
                Recent Orders from this browser:
              </span>
              <div className="flex flex-wrap gap-2">
                {recentLocalOrders.slice(0, 4).map((rec, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      setOrderIdInput(rec.orderNumber || rec._id);
                      router.push(`/orders/track/${encodeURIComponent(rec.orderNumber || rec._id)}`);
                    }}
                    className="inline-flex items-center space-x-1 px-3 py-1 bg-beige-light hover:bg-gold/20 text-charcoal text-xs rounded-lg border border-beige-dark font-mono transition-colors"
                  >
                    <Package className="w-3 h-3 text-burgundy" />
                    <span>{rec.orderNumber || rec._id}</span>
                    <span className="text-[10px] text-charcoal-muted font-sans">
                      ({rec.orderStatus || 'Confirmed'})
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Loading Spinner */}
        {loading && (
          <div className="bg-white p-12 rounded-2xl border border-beige shadow-sm text-center">
            <div className="w-8 h-8 border-4 border-burgundy border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs text-charcoal-muted">Retrieving live tracking updates from atelier database...</p>
          </div>
        )}

        {/* Error message */}
        {!loading && errorMsg && (
          <div className="bg-white p-8 rounded-2xl border border-red-200 shadow-sm text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-charcoal">Order Lookup</h3>
            <p className="text-xs text-charcoal-muted max-w-md mx-auto">{errorMsg}</p>
            <div className="pt-2 flex justify-center gap-3">
              <Link
                href="/orders"
                className="bg-burgundy text-white text-xs font-semibold px-5 py-2.5 rounded-xl hover:bg-burgundy-dark"
              >
                View All My Orders
              </Link>
              <Link
                href="/shop"
                className="border border-beige-dark bg-white text-charcoal text-xs font-semibold px-5 py-2.5 rounded-xl hover:bg-beige-light"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        )}

        {/* If Order Found */}
        {!loading && order && (
          <div className="space-y-6">
            {/* Status Timeline Card */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-beige shadow-sm space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-beige gap-4">
                <div>
                  <span className="text-xs text-charcoal-muted">Order Identifier:</span>
                  <p className="font-mono text-xl font-bold text-burgundy mt-0.5">{order.orderNumber}</p>
                  <span className="text-[11px] text-charcoal-muted">
                    Placed on {new Date(order.createdAt || Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div className="flex flex-col sm:items-end">
                  <span className="text-xs text-charcoal-muted">Estimated Delivery:</span>
                  <div className="flex items-center space-x-1 text-sm font-semibold text-charcoal mt-0.5">
                    <Calendar className="w-4 h-4 text-gold-dark" />
                    <span>
                      {new Date(order.estimatedDeliveryDate || Date.now()).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                  <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded mt-1">
                    On Schedule
                  </span>
                </div>
              </div>

              {/* Graphical Step-by-Step Timeline */}
              <div className="relative">
                <div className="hidden sm:block absolute top-1/2 left-0 right-0 h-0.5 bg-beige -translate-y-1/2 z-0" />
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-6 relative z-10">
                  {ORDER_PIPELINE.map((step, idx) => {
                    const st = getStepStatus(step.status);
                    return (
                      <div
                        key={idx}
                        className="flex sm:flex-col items-center sm:text-center space-x-3 sm:space-x-0"
                      >
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs shadow-sm transition-all flex-shrink-0 ${
                            st === 'completed'
                              ? 'bg-emerald-600 text-white'
                              : st === 'current'
                              ? 'bg-burgundy text-white ring-4 ring-burgundy/20 animate-pulse'
                              : 'bg-white border-2 border-beige-dark text-charcoal-muted'
                          }`}
                        >
                          {st === 'completed' ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                        </div>
                        <div className="sm:mt-3">
                          <h4
                            className={`text-xs font-bold leading-tight ${
                              st === 'current' ? 'text-burgundy' : 'text-charcoal'
                            }`}
                          >
                            {step.label}
                          </h4>
                          <p className="text-[10px] text-charcoal-muted mt-0.5 sm:line-clamp-2">
                            {step.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Carrier details */}
              <div className="bg-beige-light/40 p-4 rounded-xl border border-beige flex flex-col sm:flex-row justify-between text-xs text-charcoal-muted gap-2">
                <div className="flex items-center space-x-1.5">
                  <Truck className="w-4 h-4 text-burgundy flex-shrink-0" />
                  <span className="font-semibold text-charcoal">Courier Partner: </span>
                  <span>{order.trackingCarrier || 'BlueDart Air Express'}</span>
                </div>
                <div>
                  <span className="font-semibold text-charcoal">Airway Bill (AWB): </span>
                  <span className="font-mono text-burgundy font-bold">{order.trackingNumber || 'BLUEDART-8899201'}</span>
                </div>
              </div>
            </div>

            {/* Customized Item Preview Card */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-beige shadow-sm space-y-6">
              <h3 className="font-serif text-lg font-bold text-charcoal">
                Handcrafted Item Specifications
              </h3>

              <div className="divide-y divide-beige">
                {order.orderItems?.map((item, idx) => (
                  <div key={idx} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row gap-5">
                    {/* Visual Preview */}
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-beige-light border border-beige flex-shrink-0 shadow-xs">
                      <img
                        src={item.customizationDetails?.previewImage || item.productImage}
                        alt={item.productName}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-grow space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-serif text-base font-bold text-charcoal">
                            {item.productName}
                          </h4>
                          {item.variant && (
                            <p className="text-xs text-charcoal-muted">
                              {item.variant.size && `Size: ${item.variant.size} • `}
                              {item.variant.color && `Finish: ${item.variant.color}`}
                            </p>
                          )}
                          <p className="text-[11px] text-charcoal-muted">Qty: {item.quantity}</p>
                        </div>
                        <span className="font-serif text-base font-bold text-burgundy">
                          ₹{item.totalItemPrice}
                        </span>
                      </div>

                      {item.customizationDetails && (
                        <div className="bg-beige-light/60 p-3 rounded-lg border border-beige text-xs space-y-1">
                          <span className="font-bold text-burgundy flex items-center space-x-1">
                            <Sparkles className="w-3.5 h-3.5 text-gold-dark" />
                            <span>Preserved Customization Details:</span>
                          </span>
                          {item.customizationDetails.customTexts?.map((txt, i) => (
                            <p key={i} className="italic text-charcoal">
                              Line {i + 1}: &ldquo;{txt}&rdquo;
                            </p>
                          ))}
                          {item.customizationDetails.uploadedImagesCount > 0 && (
                            <p className="text-[11px] text-charcoal-muted">
                              ✓ {item.customizationDetails.uploadedImagesCount} High-Resolution Photograph Embedded
                            </p>
                          )}
                          {item.giftPackaging && (
                            <p className="text-gold-dark font-medium">Includes Luxury Velvet Gift Ribbon & Wax Seal</p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery & Payment Details Card */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-beige shadow-sm space-y-2 text-xs">
                <h4 className="font-serif text-sm font-bold text-charcoal flex items-center space-x-1.5 mb-2">
                  <MapPin className="w-4 h-4 text-gold-dark" />
                  <span>Delivery Destination</span>
                </h4>
                <p className="font-bold text-charcoal">{order.customerDetails?.name}</p>
                <p className="text-charcoal-muted">{order.shippingAddress?.street}</p>
                <p className="text-charcoal-muted">
                  {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.postalCode}
                </p>
                <p className="text-charcoal-muted">Phone: {order.customerDetails?.phone}</p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-beige shadow-sm space-y-2 text-xs">
                <h4 className="font-serif text-sm font-bold text-charcoal flex items-center space-x-1.5 mb-2">
                  <Clock className="w-4 h-4 text-gold-dark" />
                  <span>Payment & Invoice</span>
                </h4>
                <div className="flex justify-between text-charcoal-muted">
                  <span>Method:</span>
                  <span className="font-semibold text-charcoal">{order.paymentMethod || 'UPI (YouPI-PG)'}</span>
                </div>
                <div className="flex justify-between text-charcoal-muted">
                  <span>Status:</span>
                  <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    {order.paymentStatus || 'Captured'}
                  </span>
                </div>
                <div className="flex justify-between text-charcoal-muted pt-2 border-t border-beige text-sm font-bold text-charcoal">
                  <span>Total Paid:</span>
                  <span className="font-serif text-burgundy text-base">₹{order.totalAmount}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
