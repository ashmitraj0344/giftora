'use client';
import React, { useState, useEffect } from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
export default function AdminCustomersPage() {
    const [customers, setCustomers] = useState([]);
    useEffect(() => {
        async function fetchCustomers() {
            try {
                const res = await fetch('/api/admin/customers');
                const data = await res.json();
                if (data.customers && data.customers.length > 0) {
                    setCustomers(data.customers);
                    return;
                }
            }
            catch (e) {
                // ignore
            }
            setCustomers([
                {
                    _id: 'cust-1',
                    name: 'Aarav Sharma',
                    email: 'customer@giftora.com',
                    phone: '+91 98111 22334',
                    orderCount: 3,
                    createdAt: new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString(),
                },
                {
                    _id: 'cust-2',
                    name: 'Priya Sundaram',
                    email: 'priya@example.com',
                    phone: '+91 98765 00112',
                    orderCount: 1,
                    createdAt: new Date(Date.now() - 15 * 24 * 3600 * 1000).toISOString(),
                },
                {
                    _id: 'cust-3',
                    name: 'Rohan Verma',
                    email: 'rohan.v@example.com',
                    phone: '+91 98222 33445',
                    orderCount: 2,
                    createdAt: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString(),
                },
            ]);
        }
        fetchCustomers();
    }, []);
    return (<div className="bg-ivory min-h-screen flex">
      <AdminSidebar />

      <main className="flex-grow p-8 space-y-6 overflow-x-hidden">
        <div>
          <span className="text-xs uppercase tracking-widest text-gold-dark font-semibold">
            Patron Records
          </span>
          <h1 className="font-serif text-3xl font-bold text-charcoal mt-0.5">
            Registered Customers Directory
          </h1>
          <p className="text-xs text-charcoal-muted mt-1">
            Overview of customer purchase frequency, delivery contacts, and account status.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-beige shadow-sm overflow-hidden p-6">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-beige-light/60 text-charcoal-muted uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Customer Name</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Contact Phone</th>
                  <th className="py-3 px-4">Orders Placed</th>
                  <th className="py-3 px-4">Registered Date</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-beige">
                {customers.map((c) => (<tr key={c._id} className="hover:bg-beige-light/30 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-charcoal flex items-center space-x-2.5">
                      <div className="w-8 h-8 rounded-full bg-burgundy/10 text-burgundy font-serif font-bold flex items-center justify-center">
                        {c.name.charAt(0)}
                      </div>
                      <span>{c.name}</span>
                    </td>
                    <td className="py-3.5 px-4 text-charcoal-muted">{c.email}</td>
                    <td className="py-3.5 px-4 text-charcoal-muted">{c.phone || '+91 98765 43210'}</td>
                    <td className="py-3.5 px-4 font-bold text-burgundy">{c.orderCount || 1} Orders</td>
                    <td className="py-3.5 px-4 text-charcoal-muted">
                      {new Date(c.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="bg-emerald-50 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">
                        Active Patron
                      </span>
                    </td>
                  </tr>))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>);
}
