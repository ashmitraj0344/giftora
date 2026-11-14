'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  ExternalLink,
} from 'lucide-react';

export const AdminSidebar = () => {
  const pathname = usePathname();

  const links = [
    { href: '/admin', label: 'Overview Dashboard', icon: LayoutDashboard },
    { href: '/admin/orders', label: 'Order Management', icon: Package },
    { href: '/admin/products', label: 'Product Catalog', icon: ShoppingBag },
    { href: '/admin/customers', label: 'Customer Directory', icon: Users },
  ];

  return (
    <aside className="w-64 bg-white border-r border-beige p-6 space-y-8 flex-shrink-0 min-h-screen">
      <div>
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-burgundy flex items-center justify-center text-gold">
            <span className="font-serif font-bold text-lg">G</span>
          </div>
          <div>
            <h2 className="font-serif text-lg font-bold text-charcoal">Giftora Admin</h2>
            <span className="text-[10px] uppercase tracking-wider font-semibold text-gold-dark block -mt-1">
              Atelier Management
            </span>
          </div>
        </div>
      </div>

      <nav className="space-y-1.5 text-xs font-semibold">
        {links.map((lnk) => {
          const Icon = lnk.icon;
          const active = pathname === lnk.href;
          return (
            <Link
              key={lnk.href}
              href={lnk.href}
              className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-xl transition-all ${
                active
                  ? 'bg-burgundy text-white shadow-sm'
                  : 'text-charcoal-muted hover:text-charcoal hover:bg-beige-light'
              }`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span>{lnk.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="pt-6 border-t border-beige space-y-2">
        <Link
          href="/"
          className="flex items-center justify-between p-3 bg-beige-light/60 hover:bg-beige rounded-xl text-xs font-semibold text-charcoal transition-colors"
        >
          <span>View Public Store</span>
          <ExternalLink className="w-3.5 h-3.5 text-charcoal-muted" />
        </Link>
      </div>
    </aside>
  );
};
