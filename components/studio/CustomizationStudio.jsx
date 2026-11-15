'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { CanvasPreview } from './CanvasPreview';
import { useCart } from '@/context/CartContext';
import {
  Upload,
  CheckCircle2,
  RotateCcw,
  Pencil,
  Sparkles,
  ShoppingBag,
  Gift,
  ShieldCheck,
  Printer,
  HeartHandshake,
  ArrowLeft,
  X,
  Check,
} from 'lucide-react';

const PRESET_FONTS = [
  { name: 'Playfair Display', label: 'Playfair (Classic Luxury)' },
  { name: 'Cinzel', label: 'Cinzel (Royal Serif)' },
  { name: 'Dancing Script', label: 'Dancing Script (Handwritten)' },
  { name: 'Inter', label: 'Inter (Modern Sans)' },
];

const SAMPLE_PHOTOS = [
  { label: 'Happy Couple', url: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=800&q=80' },
  { label: 'Family Portrait', url: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=800&q=80' },
  { label: 'College / Mascot', url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80' },
];

export const CustomizationStudio = ({ product }) => {
  const router = useRouter();
  const { addItem } = useCart();
  const fileInputRef = useRef(null);
  const previewRef = useRef(null);

  const [selectedSize, setSelectedSize] = useState(product?.variants?.sizes?.[0] || '7x5 inches');
  const [selectedColor, setSelectedColor] = useState(product?.variants?.colors?.[0] || 'Champagne Gold');
  const [giftPackaging, setGiftPackaging] = useState(true);
  const [quantity, setQuantity] = useState(1);

  // Photos state
  const [uploadedImages, setUploadedImages] = useState([]);

  // Inscription text state
  const [inscriptionText, setInscriptionText] = useState('Together Forever • 2026');
  const [selectedFont, setSelectedFont] = useState('Playfair Display');

  const [isSaving, setIsSaving] = useState(false);
  const [addedToast, setAddedToast] = useState(false);

  // Handle local file upload
  const handleImageFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert('File size exceeds 10MB. Please choose a smaller image.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result;
      setUploadedImages([
        {
          id: `img-${Date.now()}`,
          url: dataUrl,
          x: 50,
          y: 50,
          scale: 1,
        },
      ]);
    };
    reader.readAsDataURL(file);
  };

  const handleSelectPresetPhoto = (url) => {
    setUploadedImages([
      {
        id: `img-${Date.now()}`,
        url,
        x: 50,
        y: 50,
        scale: 1,
      },
    ]);
  };

  const resetAll = () => {
    setUploadedImages([]);
    setInscriptionText('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const basePrice = product?.discountPrice ?? product?.basePrice ?? 749;
  const imageCharges = uploadedImages.length > 0 ? (product?.customizationOptions?.imagePrice ?? 60) : 0;
  const textCharges = inscriptionText.trim() ? (product?.customizationOptions?.textPrice ?? 30) : 0;
  const packagingCharges = giftPackaging ? (product?.customizationOptions?.premiumPackagingPrice ?? 40) : 0;
  const unitTotal = basePrice + imageCharges + textCharges + packagingCharges;
  const grandTotal = unitTotal * quantity;

  const handleSaveAndContinue = async () => {
    setIsSaving(true);
    try {
      const customPayload = {
        productId: product?._id,
        uploadedImages,
        customTexts: inscriptionText.trim()
          ? [
              {
                id: 'text-1',
                text: inscriptionText.trim(),
                fontFamily: selectedFont,
                fontSize: 16,
                color: '#702C3B',
              },
            ]
          : [],
        designConfiguration: {
          productMockupType: product?.mockupType || 'frame',
        },
        previewImage: uploadedImages[0]?.url || product?.images?.[0],
      };

      let customizationId = `custom_${Date.now()}`;
      try {
        const res = await fetch('/api/customizations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(customPayload),
        });
        const data = await res.json();
        if (data.customizationId) {
          customizationId = data.customizationId;
        }
      } catch (e) {
        console.warn('Customization API fallback to client id', e);
      }

      // Add to bag
      addItem({
        product: product || {
          _id: 'default_frame',
          name: 'Artisan Standing Desk Photo Frame',
          basePrice: 749,
          images: [
            'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80',
          ],
        },
        quantity,
        selectedVariant: {
          size: selectedSize || undefined,
          color: selectedColor || undefined,
        },
        customizationId,
        customization: {
          previewImage: uploadedImages[0]?.url || product?.images?.[0],
          uploadedImagesCount: uploadedImages.length,
          customTexts: inscriptionText.trim() ? [inscriptionText.trim()] : [],
        },
        giftPackaging,
        customizationCharges: imageCharges + textCharges + packagingCharges,
      });

      setAddedToast(true);
      setTimeout(() => {
        router.push('/cart');
      }, 1000);
    } catch (err) {
      console.error('Failed to save customization:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const hasInputs = uploadedImages.length > 0 || inscriptionText.trim().length > 0;

  return (
    <div className="bg-ivory min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png, image/jpeg, image/webp, image/jpg"
        onChange={handleImageFile}
        className="hidden"
      />

      {/* Toast Notification */}
      {addedToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-burgundy text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center space-x-3 border border-gold/40 animate-in fade-in slide-in-from-bottom-4">
          <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <Check className="w-5 h-5" />
          </div>
          <div>
            <h5 className="font-semibold text-sm">Personalization Saved!</h5>
            <p className="text-xs text-gold-light">Proceeding to your shopping bag...</p>
          </div>
        </div>
      )}

      {/* Main IGP-Style Studio Container */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT / CENTER: High-Definition Live Preview */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <CanvasPreview
            mockupType={product?.mockupType || 'frame'}
            productImage={product?.images?.[0]}
            uploadedImages={uploadedImages}
            customTexts={
              inscriptionText.trim()
                ? [
                    {
                      id: 'txt-1',
                      text: inscriptionText.trim(),
                      fontFamily: selectedFont,
                      color: '#702C3B',
                    },
                  ]
                : []
            }
            previewRef={previewRef}
            onUploadClick={() => fileInputRef.current?.click()}
          />

          {/* Quick preset suggestions */}
          <div className="mt-4 w-full max-w-lg bg-white/70 p-3.5 rounded-2xl border border-beige flex items-center justify-between text-xs">
            <span className="text-charcoal-muted font-medium">Quick test photos:</span>
            <div className="flex gap-2">
              {SAMPLE_PHOTOS.map((sample, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectPresetPhoto(sample.url)}
                  className="px-2.5 py-1 bg-beige-light hover:bg-gold/20 rounded-lg text-charcoal border border-beige-dark text-[11px] font-medium transition-colors"
                >
                  {sample.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT: IGP.com-Style "Personalizing your product" Sidebar */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-beige shadow-premium p-6 sm:p-7 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-beige">
            <h2 className="font-serif text-xl font-bold text-charcoal">
              Personalizing your product
            </h2>
            <Link
              href={`/products/${product?.slug || ''}`}
              className="w-8 h-8 rounded-full bg-beige-light hover:bg-beige text-charcoal-muted flex items-center justify-center transition-colors"
              title="Close and return to product"
            >
              <X className="w-4 h-4" />
            </Link>
          </div>

          {/* Status Row */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center space-x-1.5 text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1 rounded-full">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{hasInputs ? 'All inputs added' : 'Awaiting your photo & text'}</span>
            </div>
            <button
              type="button"
              onClick={resetAll}
              className="text-charcoal-muted hover:text-burgundy flex items-center space-x-1 text-xs transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>

          {/* Photo 1 Slot Card (Exact match to IGP photo) */}
          <div className="space-y-2">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="group border border-beige-dark hover:border-burgundy rounded-2xl p-3 flex items-center justify-between bg-white hover:bg-beige-light/30 cursor-pointer transition-all shadow-xs"
            >
              <div className="flex items-center space-x-3.5">
                {uploadedImages[0]?.url ? (
                  <div className="w-12 h-12 rounded-xl overflow-hidden border border-beige bg-beige-light flex-shrink-0">
                    <img
                      src={uploadedImages[0].url}
                      alt="Photo 1 Thumbnail"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-xl border-2 border-dashed border-beige-dark bg-beige-light flex items-center justify-center text-charcoal-muted flex-shrink-0 group-hover:border-burgundy">
                    <Upload className="w-5 h-5 text-burgundy" />
                  </div>
                )}
                <div>
                  <h4 className="text-sm font-bold text-charcoal flex items-center space-x-1">
                    <span>Photo 1</span>
                    {uploadedImages.length > 0 && (
                      <span className="text-[10px] text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded font-sans">
                        Uploaded
                      </span>
                    )}
                  </h4>
                  <p className="text-[11px] text-charcoal-muted">
                    {uploadedImages.length > 0
                      ? 'Click pencil to change image'
                      : 'Upload your favorite photo'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                className="w-9 h-9 rounded-xl border border-beige-dark bg-white group-hover:bg-burgundy group-hover:text-white text-charcoal-muted flex items-center justify-center transition-all shadow-2xs"
                title="Edit / Replace Photo"
              >
                <Pencil className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Personal Message / Engraving Inscription */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-charcoal uppercase tracking-wider">
              Personal Message / Names
            </label>
            <input
              type="text"
              maxLength={40}
              value={inscriptionText}
              onChange={(e) => setInscriptionText(e.target.value)}
              placeholder="e.g. Together Forever, Happy Birthday..."
              className="w-full border border-beige-dark rounded-xl px-3.5 py-2.5 text-xs text-charcoal bg-white focus:outline-none focus:border-burgundy"
            />
            <div className="flex justify-between items-center text-[10px] text-charcoal-muted">
              <span>Engraved on metallic keepsake badge</span>
              <span>{40 - inscriptionText.length} chars left</span>
            </div>
          </div>

          {/* Typography Choice */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-semibold text-charcoal-muted uppercase tracking-wider">
              Inscription Font
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {PRESET_FONTS.map((font) => (
                <button
                  key={font.name}
                  type="button"
                  onClick={() => setSelectedFont(font.name)}
                  className={`p-2 rounded-xl border text-left text-xs transition-all ${
                    selectedFont === font.name
                      ? 'border-burgundy bg-burgundy/5 text-burgundy font-bold shadow-xs'
                      : 'border-beige hover:border-beige-dark text-charcoal'
                  }`}
                  style={{ fontFamily: font.name }}
                >
                  {font.label}
                </button>
              ))}
            </div>
          </div>

          {/* Variants (Size & Finish) */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div>
              <label className="block text-[11px] font-semibold text-charcoal-muted mb-1 uppercase tracking-wider">
                Size
              </label>
              <select
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
                className="w-full border border-beige-dark rounded-xl px-3 py-2 text-xs text-charcoal bg-white focus:outline-none focus:border-burgundy"
              >
                <option value="6x4 inches">6×4 inches (Desk)</option>
                <option value="7x5 inches">7×5 inches (Standard)</option>
                <option value="8x6 inches">8×6 inches (Grand)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-charcoal-muted mb-1 uppercase tracking-wider">
                Finish
              </label>
              <select
                value={selectedColor}
                onChange={(e) => setSelectedColor(e.target.value)}
                className="w-full border border-beige-dark rounded-xl px-3 py-2 text-xs text-charcoal bg-white focus:outline-none focus:border-burgundy"
              >
                <option value="Champagne Gold">Champagne Gold</option>
                <option value="Deep Walnut">Deep Walnut</option>
                <option value="Rose Gold">Rose Gold</option>
                <option value="Matte Black">Matte Black</option>
              </select>
            </div>
          </div>

          {/* Luxury Velvet Packaging Option */}
          <div className="p-3 bg-beige-light/50 border border-beige rounded-2xl">
            <label className="flex items-start space-x-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={giftPackaging}
                onChange={(e) => setGiftPackaging(e.target.checked)}
                className="mt-0.5 accent-burgundy"
              />
              <div className="text-xs">
                <span className="font-semibold text-charcoal flex items-center space-x-1">
                  <Gift className="w-3.5 h-3.5 text-burgundy" />
                  <span>Velvet Box & Hand-Tied Ribbon (+₹40)</span>
                </span>
                <p className="text-charcoal-muted text-[11px] mt-0.5">
                  Includes wax-sealed personalized greeting card.
                </p>
              </div>
            </label>
          </div>

          {/* Price Breakdown */}
          <div className="border-t border-beige pt-3 space-y-1.5 text-xs">
            <div className="flex justify-between text-charcoal-muted">
              <span>Base Product Price</span>
              <span>₹{basePrice}</span>
            </div>
            {imageCharges > 0 && (
              <div className="flex justify-between text-charcoal-muted">
                <span>HD Photo Sublimation</span>
                <span className="text-charcoal font-medium">+₹{imageCharges}</span>
              </div>
            )}
            {textCharges > 0 && (
              <div className="flex justify-between text-charcoal-muted">
                <span>Laser Inscription</span>
                <span className="text-charcoal font-medium">+₹{textCharges}</span>
              </div>
            )}
            {giftPackaging && (
              <div className="flex justify-between text-charcoal-muted">
                <span>Signature Velvet Packaging</span>
                <span className="text-charcoal font-medium">+₹{packagingCharges}</span>
              </div>
            )}
            <div className="flex justify-between items-center text-charcoal font-bold text-sm pt-2 border-t border-beige">
              <span>Total Price:</span>
              <span className="font-serif text-lg text-burgundy">₹{grandTotal}</span>
            </div>
          </div>

          {/* Primary Action Button: SAVE & CONTINUE (Exact match to IGP photo) */}
          <button
            type="button"
            onClick={handleSaveAndContinue}
            disabled={isSaving}
            className="w-full bg-[#B22234] hover:bg-[#921927] text-white font-bold py-4 px-6 rounded-2xl shadow-md transition-all flex items-center justify-center space-x-2 text-sm uppercase tracking-wider disabled:opacity-50"
          >
            {isSaving ? (
              <span>Saving Your Design...</span>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                <span>SAVE & CONTINUE</span>
              </>
            )}
          </button>

          {/* "Why personalize with us" Section (Exact match to IGP photo) */}
          <div className="pt-4 border-t border-beige space-y-3.5">
            <div className="flex items-center space-x-2 text-charcoal font-serif font-bold text-sm">
              <ShieldCheck className="w-4 h-4 text-purple-600" />
              <span>Why personalize with us</span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-start space-x-3">
                <HeartHandshake className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-semibold text-charcoal">Made just for you</h5>
                  <p className="text-[11px] text-charcoal-muted leading-relaxed">
                    Every order is created fresh after you confirm.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Printer className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-semibold text-charcoal">High resolution printing</h5>
                  <p className="text-[11px] text-charcoal-muted leading-relaxed">
                    Your photo and text will look great, exactly as you want.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Sparkles className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-semibold text-charcoal">We take it from here</h5>
                  <p className="text-[11px] text-charcoal-muted leading-relaxed">
                    Once you&apos;re done, no follow-up needed from your side.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
