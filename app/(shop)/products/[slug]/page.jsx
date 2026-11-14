'use client';
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { INITIAL_PRODUCTS } from '@/lib/sample-data';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { Sparkles, Heart, ShoppingBag, Star, Truck, ShieldCheck, RotateCcw, Check, ChevronRight, } from 'lucide-react';
export default function ProductDetailPage() {
    const params = useParams();
    const slug = params.slug;
    const router = useRouter();
    const { addItem } = useCart();
    const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
    const [product, setProduct] = useState(null);
    const [activeImage, setActiveImage] = useState('');
    const [selectedSize, setSelectedSize] = useState('');
    const [selectedColor, setSelectedColor] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [addedToast, setAddedToast] = useState(false);
    useEffect(() => {
        async function loadProduct() {
            try {
                const res = await fetch(`/api/products/${slug}`);
                const data = await res.json();
                if (data.product) {
                    setProduct(data.product);
                    setActiveImage(data.product.images[0]);
                    if (data.product.variants?.sizes?.length > 0)
                        setSelectedSize(data.product.variants.sizes[0]);
                    if (data.product.variants?.colors?.length > 0)
                        setSelectedColor(data.product.variants.colors[0]);
                    return;
                }
            }
            catch (err) {
                // ignore
            }
            const fallback = INITIAL_PRODUCTS.find((p) => p.slug === slug || p._id === slug);
            if (fallback) {
                setProduct(fallback);
                setActiveImage(fallback.images[0]);
                if (fallback.variants?.sizes?.length > 0)
                    setSelectedSize(fallback.variants.sizes[0]);
                if (fallback.variants?.colors?.length > 0)
                    setSelectedColor(fallback.variants.colors[0]);
            }
        }
        loadProduct();
    }, [slug]);
    if (!product) {
        return (<div className="min-h-screen bg-ivory flex items-center justify-center p-8">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-burgundy border-t-transparent rounded-full animate-spin mx-auto mb-4"/>
          <p className="text-xs text-charcoal-muted font-medium">Loading gift details...</p>
        </div>
      </div>);
    }
    const wishlisted = isInWishlist(product._id);
    const handleWishlist = () => {
        if (wishlisted)
            removeFromWishlist(product._id);
        else
            addToWishlist(product);
    };
    const handleQuickAdd = () => {
        addItem({
            product,
            quantity,
            selectedVariant: {
                size: selectedSize || undefined,
                color: selectedColor || undefined,
            },
        });
        setAddedToast(true);
        setTimeout(() => setAddedToast(false), 3000);
    };
    return (<div className="bg-ivory min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      {addedToast && (<div className="fixed bottom-6 right-6 z-50 bg-burgundy text-white px-6 py-4 rounded-xl shadow-2xl flex items-center space-x-3 border border-gold/40 animate-in fade-in slide-in-from-bottom-4">
          <Check className="w-5 h-5 text-gold"/>
          <div>
            <h5 className="font-semibold text-sm">Item added to your bag!</h5>
            <p className="text-xs text-gold-light">Want to personalize it first?</p>
          </div>
          <button onClick={() => router.push('/cart')} className="ml-4 bg-gold text-charcoal text-xs font-bold px-3 py-1.5 rounded-lg">
            View Bag
          </button>
        </div>)}

      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-xs text-charcoal-muted mb-8">
          <Link href="/" className="hover:text-burgundy">Home</Link>
          <ChevronRight className="w-3.5 h-3.5"/>
          <Link href="/shop" className="hover:text-burgundy">Shop</Link>
          <ChevronRight className="w-3.5 h-3.5"/>
          <span className="text-charcoal font-medium truncate">{product.name}</span>
        </nav>

        {/* Product Details Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Gallery Column (Cols 1-6) */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-white border border-beige shadow-sm">
              <img src={activeImage || product.images[0]} alt={product.name} className="w-full h-full object-cover"/>
              <button onClick={handleWishlist} className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-charcoal hover:text-burgundy shadow-sm">
                <Heart className={`w-5 h-5 ${wishlisted ? 'text-burgundy fill-burgundy' : ''}`}/>
              </button>
            </div>

            {/* Thumbnail row */}
            {product.images.length > 1 && (<div className="flex space-x-3">
                {product.images.map((img, idx) => (<button key={idx} onClick={() => setActiveImage(img)} className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${activeImage === img ? 'border-burgundy' : 'border-beige hover:border-beige-dark'}`}>
                    <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover"/>
                  </button>))}
              </div>)}
          </div>

          {/* Details & CTA Column (Cols 7-12) */}
          <div className="lg:col-span-6 space-y-6 bg-white p-8 rounded-2xl border border-beige shadow-sm">
            <div>
              <span className="text-xs uppercase tracking-widest text-gold-dark font-semibold">
                {product.category}
              </span>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-charcoal mt-1">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center space-x-2 mt-2">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (<Star key={i} className="w-4 h-4 fill-amber-400"/>))}
                </div>
                <span className="text-xs font-bold text-charcoal">{product.rating || 4.9}</span>
                <span className="text-xs text-charcoal-muted">
                  ({product.reviewCount || 48} verified patron reviews)
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-baseline space-x-3 py-3 border-y border-beige">
              <span className="font-serif text-3xl font-bold text-burgundy">
                ₹{product.discountPrice ?? product.basePrice}
              </span>
              {product.discountPrice && (<span className="text-sm text-charcoal-muted line-through">
                  ₹{product.basePrice}
                </span>)}
              <span className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded font-semibold">
                In Stock ({product.stock} units available)
              </span>
            </div>

            <p className="text-xs text-charcoal-muted leading-relaxed">
              {product.description}
            </p>

            {/* Variants */}
            {product.variants?.sizes && product.variants.sizes.length > 0 && (<div>
                <label className="block text-xs font-bold text-charcoal mb-2 uppercase tracking-wider">
                  Available Size Options:
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.variants.sizes.map((s) => (<button key={s} onClick={() => setSelectedSize(s)} className={`px-3.5 py-1.5 rounded-lg text-xs font-medium border transition-all ${selectedSize === s
                    ? 'border-burgundy bg-burgundy text-white'
                    : 'border-beige hover:border-beige-dark text-charcoal'}`}>
                      {s}
                    </button>))}
                </div>
              </div>)}

            {product.variants?.colors && product.variants.colors.length > 0 && (<div>
                <label className="block text-xs font-bold text-charcoal mb-2 uppercase tracking-wider">
                  Finish / Shade:
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.variants.colors.map((c) => (<button key={c} onClick={() => setSelectedColor(c)} className={`px-3.5 py-1.5 rounded-lg text-xs font-medium border transition-all ${selectedColor === c
                    ? 'border-burgundy bg-burgundy/10 text-burgundy font-semibold'
                    : 'border-beige hover:border-beige-dark text-charcoal'}`}>
                      {c}
                    </button>))}
                </div>
              </div>)}

            {/* Customization Highlight Card */}
            <div className="p-4 bg-gradient-to-r from-beige-light to-ivory rounded-xl border border-gold/40 space-y-3">
              <div className="flex items-center space-x-2 text-burgundy font-serif font-bold text-sm">
                <Sparkles className="w-4 h-4 text-gold-dark"/>
                <span>Personalize With Your Photos & Words</span>
              </div>
              <p className="text-xs text-charcoal-muted leading-relaxed">
                Open our Interactive Customization Studio to upload your photo, select elegant fonts, type personalized inscriptions, and see a live 3D preview.
              </p>
              <Link href={`/customize/${product.slug}`} className="w-full bg-burgundy hover:bg-burgundy-dark text-white text-xs font-semibold py-3 px-4 rounded-xl shadow-md flex items-center justify-center space-x-2 transition-all">
                <Sparkles className="w-4 h-4 text-gold"/>
                <span>Open Customization Studio</span>
              </Link>
            </div>

            {/* Quick Add Button without Studio */}
            <div className="flex items-center space-x-4 pt-2">
              <div className="flex items-center border border-beige-dark rounded-xl bg-white">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-3.5 py-2 text-charcoal hover:bg-beige">
                  -
                </button>
                <span className="px-3 py-2 text-xs font-bold">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="px-3.5 py-2 text-charcoal hover:bg-beige">
                  +
                </button>
              </div>

              <button onClick={handleQuickAdd} className="flex-grow border-2 border-burgundy text-burgundy hover:bg-burgundy hover:text-white text-xs font-semibold py-3 px-4 rounded-xl transition-all flex items-center justify-center space-x-2">
                <ShoppingBag className="w-4 h-4"/>
                <span>Quick Add to Bag (Plain)</span>
              </button>
            </div>

            {/* Guarantees */}
            <div className="pt-4 border-t border-beige grid grid-cols-3 gap-2 text-center text-[11px] text-charcoal-muted">
              <div className="flex flex-col items-center">
                <Truck className="w-4 h-4 text-gold-dark mb-1"/>
                <span>Express Delivery</span>
              </div>
              <div className="flex flex-col items-center">
                <ShieldCheck className="w-4 h-4 text-gold-dark mb-1"/>
                <span>Museum Quality</span>
              </div>
              <div className="flex flex-col items-center">
                <RotateCcw className="w-4 h-4 text-gold-dark mb-1"/>
                <span>Free Reprint Guarantee</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>);
}
