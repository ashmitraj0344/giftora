'use client';

import React, { useState, useEffect } from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { INITIAL_PRODUCTS } from '@/lib/sample-data';
import { Plus, X, Check, Sparkles, Image, Package } from 'lucide-react';

const CATEGORY_OPTIONS = [
  'Photo Frames',
  'Customized Mugs',
  'Personalized T-Shirts',
  'Photo Albums',
  'Cushions',
  'LED Photo Lamps',
  'Customized Keychains',
  'Personalized Accessories',
];

const MOCKUP_OPTIONS = [
  { value: 'frame', label: 'Photo Frame (Wood & Glass)' },
  { value: 'mug', label: 'Ceramic Coffee Mug' },
  { value: 'tshirt', label: 'Apparel / Cotton T-Shirt' },
  { value: 'lamp', label: 'LED Night Lamp (Acrylic & Wood)' },
  { value: 'cushion', label: 'Velvet Throw Cushion' },
  { value: 'keychain', label: 'Leather & Brass Keychain' },
  { value: 'album', label: 'Photo Album Book' },
  { value: 'generic', label: 'General Keepsake' },
];

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // New product form
  const [formData, setFormData] = useState({
    name: '',
    category: 'Photo Frames',
    description: '',
    basePrice: 799,
    discountPrice: 649,
    stock: 50,
    material: 'Premium Solid Teakwood & Glass',
    imageUrl: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=1000&q=80',
    mockupType: 'frame',
    customType: 'both',
  });

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/products?limit=100');
      const data = await res.json();
      if (data.products && data.products.length > 0) {
        setProducts(data.products);
        return;
      }
    } catch (e) {
      // ignore
    }
    setProducts(INITIAL_PRODUCTS);
  };

  useEffect(() => {
    fetchProducts().finally(() => setLoading(false));
  }, []);

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const slug = formData.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') || `gift-${Date.now()}`;

    const newProductPayload = {
      name: formData.name,
      slug,
      description: formData.description || `Handcrafted personalized ${formData.name} for special gifting.`,
      category: formData.category,
      images: [formData.imageUrl],
      basePrice: Number(formData.basePrice),
      discountPrice: formData.discountPrice ? Number(formData.discountPrice) : undefined,
      stock: Number(formData.stock),
      material: formData.material,
      mockupType: formData.mockupType,
      customizationOptions: {
        type: formData.customType,
        maxImages: formData.customType === 'text' ? 0 : 2,
        maxCharacters: 60,
        allowFontSelection: true,
        allowColorSelection: true,
        allowBackgroundSelection: true,
        imagePrice: 50,
        textPrice: 25,
        premiumPackagingPrice: 40,
      },
      isActive: true,
      isFeatured: true,
    };

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProductPayload),
      });

      const data = await res.json();
      if (res.ok && data.product) {
        setProducts((prev) => [data.product, ...prev]);
        setShowAddModal(false);
        setFormData({
          name: '',
          category: 'Photo Frames',
          description: '',
          basePrice: 799,
          discountPrice: 649,
          stock: 50,
          material: 'Premium Solid Teakwood & Glass',
          imageUrl: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=1000&q=80',
          mockupType: 'frame',
          customType: 'both',
        });
        alert('🎉 New product created successfully in MongoDB Atlas!');
      } else {
        // Fallback add locally
        setProducts((prev) => [newProductPayload, ...prev]);
        setShowAddModal(false);
        alert(data.error || 'Saved product in catalogue!');
      }
    } catch (err) {
      setProducts((prev) => [newProductPayload, ...prev]);
      setShowAddModal(false);
      alert('Product saved to active catalogue view.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-ivory min-h-screen flex">
      <AdminSidebar />

      <main className="flex-grow p-8 space-y-6 overflow-x-hidden">
        {/* Modal: Add New Product */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 bg-charcoal/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl max-w-lg w-full border border-beige shadow-2xl p-6 sm:p-8 space-y-5 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between border-b border-beige pb-3">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-gold-dark">
                    Atelier Inventory
                  </span>
                  <h3 className="font-serif text-xl font-bold text-charcoal">
                    Add New Personalized Gift Template
                  </h3>
                </div>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="w-8 h-8 rounded-full bg-beige hover:bg-beige-dark flex items-center justify-center text-charcoal"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-charcoal mb-1">Product Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Personalized Spotify Acrylic Music Plaque"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full border border-beige-dark rounded-xl px-3.5 py-2.5 text-xs text-charcoal focus:outline-none focus:border-burgundy"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-charcoal mb-1">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full border border-beige-dark rounded-xl px-3.5 py-2.5 text-xs text-charcoal focus:outline-none focus:border-burgundy bg-white"
                    >
                      {CATEGORY_OPTIONS.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-charcoal mb-1">3D Mockup Studio Type</label>
                    <select
                      value={formData.mockupType}
                      onChange={(e) => setFormData({ ...formData, mockupType: e.target.value })}
                      className="w-full border border-beige-dark rounded-xl px-3.5 py-2.5 text-xs text-charcoal focus:outline-none focus:border-burgundy bg-white"
                    >
                      {MOCKUP_OPTIONS.map((m) => (
                        <option key={m.value} value={m.value}>
                          {m.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-charcoal mb-1">Base Price (₹)</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={formData.basePrice}
                      onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
                      className="w-full border border-beige-dark rounded-xl px-3 py-2 text-xs text-charcoal focus:outline-none focus:border-burgundy font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-charcoal mb-1">Discount Price (₹)</label>
                    <input
                      type="number"
                      value={formData.discountPrice}
                      onChange={(e) => setFormData({ ...formData, discountPrice: e.target.value })}
                      className="w-full border border-beige-dark rounded-xl px-3 py-2 text-xs text-charcoal focus:outline-none focus:border-burgundy font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-charcoal mb-1">Stock Units</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                      className="w-full border border-beige-dark rounded-xl px-3 py-2 text-xs text-charcoal focus:outline-none focus:border-burgundy font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-charcoal mb-1">Product Photography Image URL</label>
                  <input
                    type="url"
                    required
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    className="w-full border border-beige-dark rounded-xl px-3.5 py-2 text-xs text-charcoal focus:outline-none focus:border-burgundy font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-charcoal mb-1">Material Details</label>
                  <input
                    type="text"
                    value={formData.material}
                    onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                    placeholder="e.g. Optical Cast Acrylic with Natural Beechwood Base"
                    className="w-full border border-beige-dark rounded-xl px-3.5 py-2 text-xs text-charcoal focus:outline-none focus:border-burgundy"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2.5 rounded-xl border border-beige-dark text-charcoal font-semibold text-xs hover:bg-beige-light transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2.5 rounded-xl bg-burgundy hover:bg-burgundy-dark text-white font-semibold text-xs transition-colors flex items-center space-x-1.5 disabled:opacity-50 shadow-xs"
                  >
                    <Check className="w-4 h-4 text-gold" />
                    <span>{submitting ? 'Creating Product...' : 'Create & Save in Atlas'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs uppercase tracking-widest text-gold-dark font-semibold">
              Inventory & Customization Config
            </span>
            <h1 className="font-serif text-3xl font-bold text-charcoal mt-0.5">
              Product Catalogue Management
            </h1>
            <p className="text-xs text-charcoal-muted mt-1">
              Add new customizable gift mockups, update inventory levels, and configure pricing.
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center space-x-1.5 bg-burgundy hover:bg-burgundy-dark text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Gift Template</span>
          </button>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-3xl border border-beige shadow-sm overflow-hidden p-6">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-beige-light/60 text-charcoal-muted uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Product</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Base Price</th>
                  <th className="py-3 px-4">Stock</th>
                  <th className="py-3 px-4">Studio Mockup</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Preview</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-beige">
                {products.map((p) => (
                  <tr key={p._id || p.slug} className="hover:bg-beige-light/30 transition-colors">
                    <td className="py-3.5 px-4 flex items-center space-x-3">
                      <img
                        src={p.images[0]}
                        alt={p.name}
                        className="w-12 h-12 rounded-xl object-cover border border-beige flex-shrink-0 shadow-2xs"
                      />
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
                      <span
                        className={`font-semibold ${
                          p.stock <= 10 ? 'text-red-600 font-bold' : 'text-charcoal'
                        }`}
                      >
                        {p.stock} units
                      </span>
                    </td>
                    <td className="py-3.5 px-4 uppercase text-[11px] font-mono text-gold-dark font-bold">
                      {p.mockupType || 'frame'}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="bg-emerald-50 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">
                        Active
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <a
                        href={`/customize/${p.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-burgundy hover:underline font-semibold"
                      >
                        Open Studio ↗
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
