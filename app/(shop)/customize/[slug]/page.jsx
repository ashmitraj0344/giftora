'use client';
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { INITIAL_PRODUCTS } from '@/lib/sample-data';
import { CustomizationStudio } from '@/components/studio/CustomizationStudio';
export default function CustomizeProductPage() {
    const params = useParams();
    const slug = params.slug;
    const [product, setProduct] = useState(null);
    useEffect(() => {
        async function loadProduct() {
            try {
                const res = await fetch(`/api/products/${slug}`);
                const data = await res.json();
                if (data.product) {
                    setProduct(data.product);
                    return;
                }
            }
            catch (err) {
                // ignore
            }
            const fallback = INITIAL_PRODUCTS.find((p) => p.slug === slug || p._id === slug);
            if (fallback) {
                setProduct(fallback);
            }
            else {
                // Fallback to first product if slug not found
                setProduct(INITIAL_PRODUCTS[0]);
            }
        }
        loadProduct();
    }, [slug]);
    if (!product) {
        return (<div className="min-h-screen bg-ivory flex items-center justify-center p-8">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-burgundy border-t-transparent rounded-full animate-spin mx-auto mb-4"/>
          <p className="text-xs text-charcoal-muted font-medium">Launching Personalization Studio...</p>
        </div>
      </div>);
    }
    return <CustomizationStudio product={product}/>;
}
