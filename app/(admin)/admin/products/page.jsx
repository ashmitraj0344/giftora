'use client';
import React, { useState, useEffect } from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { INITIAL_PRODUCTS } from '@/lib/sample-data';
import { Plus } from 'lucide-react';
export default function AdminProductsPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        async function fetchProducts() {
            try {
                const res = await fetch('/api/products?limit=100');
                const data = await res.json();
                if (data.products && data.products.length > 0) {
                    setProducts(data.products);
                    return;
                }
            }
            catch (e) {
                // ignore
            }
            setProducts(INITIAL_PRODUCTS);
        }
        fetchProducts().finally(() => setLoading(false));
    }, []);
    return (<div className="bg-ivory min-h-screen flex">
      <AdminSidebar />

      <main className="flex-grow p-8 space-y-6 overflow-x-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs uppercase tracking-widest text-gold-dark font-semibold">
              Inventory & Customization Config
            </span>
            <h1 className="font-serif text-3xl font-bold text-charcoal mt-0.5">
              Product Catalogue Management
            </h1>
          </div>
          <button onClick={() => alert('New product creation form is accessible via the admin API')} className="inline-flex items-center space-x-1.5 bg-burgundy hover:bg-burgundy-dark text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-sm transition-colors">
            <Plus className="w-4 h-4"/>
            <span>Add New Gift Template</span>
          </button>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-2xl border border-beige shadow-sm overflow-hidden p-6">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-beige-light/60 text-charcoal-muted uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Product</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Base Price</th>
                  <th className="py-3 px-4">Stock</th>
                  <th className="py-3 px-4">Mockup Studio Type</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-beige">
                {products.map((p) => (<tr key={p._id || p.slug} className="hover:bg-beige-light/30 transition-colors">
                    <td className="py-3.5 px-4 flex items-center space-x-3">
                      <img src={p.images[0]} alt={p.name} className="w-12 h-12 rounded-lg object-cover border border-beige flex-shrink-0"/>
                      <div>
                        <p className="font-serif font-bold text-charcoal text-sm">{p.name}</p>
                        <p className="text-[11px] text-charcoal-muted line-clamp-1">{p.material}</p>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-charcoal">{p.category}</td>
                    <td className="py-3.5 px-4 font-serif font-bold text-burgundy">
                      ₹{p.discountPrice ?? p.basePrice}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`font-semibold ${p.stock <= 10 ? 'text-red-600 font-bold' : 'text-charcoal'}`}>
                        {p.stock} units
                      </span>
                    </td>
                    <td className="py-3.5 px-4 uppercase text-[11px] font-mono text-gold-dark font-bold">
                      {p.mockupType || 'generic'}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="bg-emerald-50 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">
                        Active
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <button onClick={() => alert(`Editing template: ${p.name}`)} className="text-burgundy hover:underline font-semibold">
                        Edit
                      </button>
                    </td>
                  </tr>))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>);
}
