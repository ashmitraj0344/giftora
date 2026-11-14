'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { CanvasPreview } from './CanvasPreview';
import { useCart } from '@/context/CartContext';
import {
  Upload,
  Type,
  Sliders,
  Palette,
  RotateCcw,
  Sparkles,
  ShoppingBag,
  Check,
  Trash2,
  Gift,
  Plus,
  ZoomIn,
  Move,
  SunMedium,
} from 'lucide-react';

const PRESET_FONTS = [
  { name: 'Playfair Display', label: 'Playfair (Classic Luxury)' },
  { name: 'Inter', label: 'Inter (Clean Modern)' },
  { name: 'Cinzel', label: 'Cinzel (Royal Serif)' },
  { name: 'Dancing Script', label: 'Dancing Script (Handwritten)' },
  { name: 'Montserrat', label: 'Montserrat (Geometric)' },
];

const PRESET_COLORS = [
  { name: 'Royal Burgundy', hex: '#702C3B' },
  { name: 'Champagne Gold', hex: '#C6A46A' },
  { name: 'Deep Charcoal', hex: '#252323' },
  { name: 'Crisp White', hex: '#FFFFFF' },
  { name: 'Navy Blue', hex: '#1B2A4A' },
  { name: 'Rose Petal', hex: '#B76E79' },
];

const SAMPLE_PHOTOS = [
  { label: 'Happy Couple', url: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=800&q=80' },
  { label: 'Warm Family', url: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=800&q=80' },
  { label: 'Cherished Pet', url: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=800&q=80' },
];

export const CustomizationStudio = ({ product }) => {
  const router = useRouter();
  const { addItem } = useCart();
  const fileInputRef = useRef(null);
  const previewRef = useRef(null);

  const [activeTab, setActiveTab] = useState('photo');
  const [selectedSize, setSelectedSize] = useState(product?.variants?.sizes?.[0] || '');
  const [selectedColor, setSelectedColor] = useState(product?.variants?.colors?.[0] || '');
  const [selectedMaterial, setSelectedMaterial] = useState(product?.variants?.materials?.[0] || '');
  const [giftPackaging, setGiftPackaging] = useState(true);
  const [quantity, setQuantity] = useState(1);

  const [uploadedImages, setUploadedImages] = useState([]);
  const [customTexts, setCustomTexts] = useState([
    {
      id: 'text-1',
      text: 'Together Forever',
      fontFamily: 'Playfair Display',
      fontSize: 26,
      color: '#702C3B',
      x: 50,
      y: 78,
      rotation: 0,
      fontWeight: '600',
      textAlign: 'center',
    },
  ]);

  const [designConfig, setDesignConfig] = useState({
    productMockupType: product?.mockupType || 'generic',
    backgroundColor: 'transparent',
  });

  const [activeTextId, setActiveTextId] = useState('text-1');
  const [isSaving, setIsSaving] = useState(false);
  const [addedToast, setAddedToast] = useState(false);

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
      const newImg = {
        id: `img-${Date.now()}`,
        url: dataUrl,
        x: 50,
        y: 44,
        scale: 1,
        rotation: 0,
        brightness: 100,
        contrast: 100,
        grayscale: false,
      };
      setUploadedImages([newImg]);
      setActiveTab('adjust');
    };
    reader.readAsDataURL(file);
  };

  const handleSelectPresetPhoto = (url) => {
    const newImg = {
      id: `img-${Date.now()}`,
      url,
      x: 50,
      y: 44,
      scale: 1,
      rotation: 0,
      brightness: 100,
      contrast: 100,
      grayscale: false,
    };
    setUploadedImages([newImg]);
    setActiveTab('adjust');
  };

  const removePhoto = () => {
    setUploadedImages([]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const updateActiveImage = (patch) => {
    setUploadedImages((prev) =>
      prev.map((img, i) => (i === 0 ? { ...img, ...patch } : img))
    );
  };

  const addTextElement = () => {
    if (customTexts.length >= 3) {
      alert('Maximum 3 custom text elements allowed per design.');
      return;
    }
    const newId = `text-${Date.now()}`;
    const newText = {
      id: newId,
      text: 'Special Memories',
      fontFamily: 'Playfair Display',
      fontSize: 22,
      color: '#C6A46A',
      x: 50,
      y: 86,
      rotation: 0,
      fontWeight: '600',
      textAlign: 'center',
    };
    setCustomTexts((prev) => [...prev, newText]);
    setActiveTextId(newId);
  };

  const updateActiveText = (patch) => {
    setCustomTexts((prev) =>
      prev.map((t) => (t.id === activeTextId ? { ...t, ...patch } : t))
    );
  };

  const removeTextElement = (id) => {
    setCustomTexts((prev) => prev.filter((t) => t.id !== id));
    if (activeTextId === id && customTexts.length > 1) {
      const remaining = customTexts.filter((t) => t.id !== id);
      setActiveTextId(remaining[0].id);
    }
  };

  const resetDesign = () => {
    if (confirm('Reset all your customization back to original defaults?')) {
      setUploadedImages([]);
      setCustomTexts([
        {
          id: 'text-1',
          text: 'Together Forever',
          fontFamily: 'Playfair Display',
          fontSize: 26,
          color: '#702C3B',
          x: 50,
          y: 78,
          rotation: 0,
          fontWeight: '600',
          textAlign: 'center',
        },
      ]);
      setDesignConfig({
        productMockupType: product?.mockupType || 'generic',
        backgroundColor: 'transparent',
      });
    }
  };

  const basePrice = product?.discountPrice ?? product?.basePrice ?? 0;
  const imageCharges = uploadedImages.length * (product?.customizationOptions?.imagePrice ?? 50);
  const textCharges = customTexts.length * (product?.customizationOptions?.textPrice ?? 20);
  const packagingCharges = giftPackaging ? (product?.customizationOptions?.premiumPackagingPrice ?? 40) : 0;
  const unitTotal = basePrice + imageCharges + textCharges + packagingCharges;
  const grandTotal = unitTotal * quantity;

  const handleAddToCart = async () => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/customizations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product._id,
          uploadedImages,
          customTexts,
          designConfiguration: designConfig,
          previewImage: uploadedImages[0]?.url || product.images[0],
        }),
      });

      const data = await res.json();
      const customizationId = data.customizationId || `local_custom_${Date.now()}`;

      addItem({
        product,
        quantity,
        selectedVariant: {
          size: selectedSize || undefined,
          color: selectedColor || undefined,
          material: selectedMaterial || undefined,
        },
        customizationId,
        customization: {
          previewImage: uploadedImages[0]?.url || product.images[0],
          uploadedImagesCount: uploadedImages.length,
          customTexts: customTexts.map((t) => t.text),
        },
        giftPackaging,
        customizationCharges: imageCharges + textCharges + packagingCharges,
      });

      setAddedToast(true);
      setTimeout(() => setAddedToast(false), 4000);
    } catch (err) {
      addItem({
        product,
        quantity,
        selectedVariant: {
          size: selectedSize || undefined,
          color: selectedColor || undefined,
        },
        giftPackaging,
        customizationCharges: imageCharges + textCharges + packagingCharges,
      });
      setAddedToast(true);
    } finally {
      setIsSaving(false);
    }
  };

  const activeImage = uploadedImages[0];
  const activeText = customTexts.find((t) => t.id === activeTextId) || customTexts[0];

  return (
    <div className="bg-ivory min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      {addedToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-burgundy text-white px-6 py-4 rounded-xl shadow-2xl flex items-center space-x-3 border border-gold/40 animate-in fade-in slide-in-from-bottom-4">
          <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center text-gold">
            <Check className="w-5 h-5" />
          </div>
          <div>
            <h5 className="font-semibold text-sm">Personalized Item Added!</h5>
            <p className="text-xs text-gold-light">Ready in your shopping bag.</p>
          </div>
          <button
            onClick={() => router.push('/cart')}
            className="ml-4 bg-gold hover:bg-gold-dark text-charcoal text-xs font-bold px-3.5 py-1.5 rounded-lg transition-colors"
          >
            View Bag
          </button>
        </div>
      )}

      <div className="max-w-7xl mx-auto mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest text-gold-dark font-semibold">
            Bespoke Customization Studio
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-charcoal mt-0.5">
            Personalize: {product?.name}
          </h1>
        </div>
        <button
          onClick={resetDesign}
          className="inline-flex items-center space-x-1.5 text-xs text-charcoal-muted hover:text-burgundy self-start sm:self-auto font-medium"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset All Customization</span>
        </button>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT PANEL */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-beige shadow-premium p-6 space-y-6">
          <div className="grid grid-cols-4 gap-1 p-1 bg-beige-light rounded-xl text-xs font-medium text-charcoal">
            <button
              onClick={() => setActiveTab('photo')}
              className={`py-2 rounded-lg flex flex-col items-center space-y-1 transition-all ${
                activeTab === 'photo'
                  ? 'bg-burgundy text-white shadow-sm'
                  : 'hover:text-burgundy'
              }`}
            >
              <Upload className="w-4 h-4" />
              <span>Photo</span>
            </button>
            <button
              onClick={() => setActiveTab('text')}
              className={`py-2 rounded-lg flex flex-col items-center space-y-1 transition-all ${
                activeTab === 'text'
                  ? 'bg-burgundy text-white shadow-sm'
                  : 'hover:text-burgundy'
              }`}
            >
              <Type className="w-4 h-4" />
              <span>Text</span>
            </button>
            <button
              onClick={() => setActiveTab('adjust')}
              className={`py-2 rounded-lg flex flex-col items-center space-y-1 transition-all ${
                activeTab === 'adjust'
                  ? 'bg-burgundy text-white shadow-sm'
                  : 'hover:text-burgundy'
              }`}
            >
              <Sliders className="w-4 h-4" />
              <span>Adjust</span>
            </button>
            <button
              onClick={() => setActiveTab('background')}
              className={`py-2 rounded-lg flex flex-col items-center space-y-1 transition-all ${
                activeTab === 'background'
                  ? 'bg-burgundy text-white shadow-sm'
                  : 'hover:text-burgundy'
              }`}
            >
              <Palette className="w-4 h-4" />
              <span>Palette</span>
            </button>
          </div>

          {activeTab === 'photo' && (
            <div className="space-y-5 animate-in fade-in">
              <div>
                <label className="block text-xs font-semibold text-charcoal uppercase tracking-wider mb-2">
                  Upload Your High-Res Photo
                </label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-beige-dark hover:border-burgundy rounded-xl p-6 text-center cursor-pointer transition-all bg-beige-light/40 hover:bg-beige-light"
                >
                  <Upload className="w-8 h-8 text-burgundy mx-auto mb-2" />
                  <p className="text-sm font-semibold text-charcoal">Click to browse file</p>
                  <p className="text-xs text-charcoal-muted mt-1">Supports JPG, JPEG, PNG, WebP (Max 10MB)</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png, image/jpeg, image/webp, image/jpg"
                    onChange={handleImageFile}
                    className="hidden"
                  />
                </div>
              </div>

              <div>
                <span className="block text-xs font-semibold text-charcoal-muted mb-2">
                  Or test with sample memories:
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {SAMPLE_PHOTOS.map((sample, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSelectPresetPhoto(sample.url)}
                      className="group relative rounded-lg overflow-hidden border border-beige hover:border-burgundy aspect-square"
                    >
                      <img
                        src={sample.url}
                        alt={sample.label}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                      />
                      <span className="absolute inset-x-0 bottom-0 bg-charcoal/80 text-[10px] text-white py-0.5 px-1 truncate">
                        {sample.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {activeImage && (
                <div className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800">
                  <span className="flex items-center space-x-1.5 font-medium">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Photo applied to canvas</span>
                  </span>
                  <button
                    onClick={removePhoto}
                    className="text-red-600 hover:text-red-800 font-semibold flex items-center space-x-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'text' && (
            <div className="space-y-5 animate-in fade-in">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-charcoal uppercase tracking-wider">
                  Text Elements ({customTexts.length}/3)
                </label>
                <button
                  onClick={addTextElement}
                  className="text-xs text-burgundy font-semibold hover:underline flex items-center space-x-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Line</span>
                </button>
              </div>

              <div className="flex space-x-2">
                {customTexts.map((item, idx) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTextId(item.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      activeTextId === item.id
                        ? 'bg-burgundy text-white'
                        : 'bg-beige-light text-charcoal hover:bg-beige'
                    }`}
                  >
                    Line {idx + 1}
                  </button>
                ))}
              </div>

              {activeText && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-charcoal mb-1">
                      Custom Message / Name
                    </label>
                    <input
                      type="text"
                      maxLength={50}
                      value={activeText.text}
                      onChange={(e) => updateActiveText({ text: e.target.value })}
                      placeholder="e.g., Happy 25th Anniversary"
                      className="w-full border border-beige-dark rounded-lg px-3.5 py-2.5 text-sm text-charcoal focus:outline-none focus:border-burgundy"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-charcoal mb-1">
                      Typography Font
                    </label>
                    <select
                      value={activeText.fontFamily}
                      onChange={(e) => updateActiveText({ fontFamily: e.target.value })}
                      className="w-full border border-beige-dark rounded-lg px-3.5 py-2.5 text-xs text-charcoal focus:outline-none focus:border-burgundy bg-white"
                    >
                      {PRESET_FONTS.map((font) => (
                        <option key={font.name} value={font.name}>
                          {font.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-medium text-charcoal mb-1">
                      <span>Font Size</span>
                      <span>{activeText.fontSize}px</span>
                    </div>
                    <input
                      type="range"
                      min={14}
                      max={44}
                      value={activeText.fontSize}
                      onChange={(e) => updateActiveText({ fontSize: Number(e.target.value) })}
                      className="w-full accent-burgundy"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-charcoal mb-2">
                      Text Color
                    </label>
                    <div className="flex items-center space-x-2">
                      {PRESET_COLORS.map((c) => (
                        <button
                          key={c.hex}
                          onClick={() => updateActiveText({ color: c.hex })}
                          title={c.name}
                          className={`w-7 h-7 rounded-full border-2 transition-transform ${
                            activeText.color === c.hex ? 'scale-125 border-burgundy' : 'border-beige-dark'
                          }`}
                          style={{ backgroundColor: c.hex }}
                        />
                      ))}
                    </div>
                  </div>

                  {customTexts.length > 1 && (
                    <button
                      onClick={() => removeTextElement(activeText.id)}
                      className="text-xs text-red-600 hover:text-red-800 flex items-center space-x-1 pt-2"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete this text line</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'adjust' && (
            <div className="space-y-4 animate-in fade-in">
              {!activeImage ? (
                <div className="text-center py-8 text-charcoal-muted text-xs">
                  Please upload a photo first under the <strong>Photo</strong> tab to enable adjustments.
                </div>
              ) : (
                <>
                  <div>
                    <div className="flex justify-between text-xs font-medium text-charcoal mb-1">
                      <span className="flex items-center space-x-1">
                        <ZoomIn className="w-3.5 h-3.5 text-charcoal-muted" />
                        <span>Scale / Zoom</span>
                      </span>
                      <span>{Math.round((activeImage.scale || 1) * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min={0.5}
                      max={2.5}
                      step={0.05}
                      value={activeImage.scale || 1}
                      onChange={(e) => updateActiveImage({ scale: parseFloat(e.target.value) })}
                      className="w-full accent-burgundy"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-medium text-charcoal mb-1">
                      <span className="flex items-center space-x-1">
                        <Move className="w-3.5 h-3.5 text-charcoal-muted" />
                        <span>Vertical Position</span>
                      </span>
                      <span>{activeImage.y || 50}%</span>
                    </div>
                    <input
                      type="range"
                      min={10}
                      max={90}
                      value={activeImage.y || 50}
                      onChange={(e) => updateActiveImage({ y: parseInt(e.target.value, 10) })}
                      className="w-full accent-burgundy"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-medium text-charcoal mb-1">
                      <span className="flex items-center space-x-1">
                        <Move className="w-3.5 h-3.5 text-charcoal-muted" />
                        <span>Horizontal Position</span>
                      </span>
                      <span>{activeImage.x || 50}%</span>
                    </div>
                    <input
                      type="range"
                      min={10}
                      max={90}
                      value={activeImage.x || 50}
                      onChange={(e) => updateActiveImage({ x: parseInt(e.target.value, 10) })}
                      className="w-full accent-burgundy"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-medium text-charcoal mb-1">
                      <span className="flex items-center space-x-1">
                        <SunMedium className="w-3.5 h-3.5 text-charcoal-muted" />
                        <span>Brightness</span>
                      </span>
                      <span>{activeImage.brightness || 100}%</span>
                    </div>
                    <input
                      type="range"
                      min={60}
                      max={140}
                      value={activeImage.brightness || 100}
                      onChange={(e) => updateActiveImage({ brightness: parseInt(e.target.value, 10) })}
                      className="w-full accent-burgundy"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-beige">
                    <span className="text-xs font-medium text-charcoal">Vintage Black & White</span>
                    <button
                      onClick={() => updateActiveImage({ grayscale: !activeImage.grayscale })}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        activeImage.grayscale ? 'bg-burgundy' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          activeImage.grayscale ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {activeTab === 'background' && (
            <div className="space-y-4 animate-in fade-in">
              <label className="block text-xs font-semibold text-charcoal uppercase tracking-wider mb-2">
                Artwork Background Tone
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  { label: 'Transparent', val: 'transparent' },
                  { label: 'Warm Ivory', val: '#FAF8F3' },
                  { label: 'Champagne', val: '#C6A46A' },
                  { label: 'Burgundy', val: '#702C3B' },
                  { label: 'Midnight Black', val: '#252323' },
                  { label: 'Rose Gold', val: '#F4EAE6' },
                ].map((bg) => (
                  <button
                    key={bg.val}
                    onClick={() => setDesignConfig({ ...designConfig, backgroundColor: bg.val })}
                    className={`flex items-center space-x-2 p-2 rounded-lg border text-left transition-all ${
                      designConfig.backgroundColor === bg.val
                        ? 'border-burgundy bg-burgundy/5 font-semibold text-burgundy'
                        : 'border-beige hover:border-beige-dark'
                    }`}
                  >
                    <span
                      className="w-4 h-4 rounded-full border border-gray-300"
                      style={{ backgroundColor: bg.val === 'transparent' ? '#FFF' : bg.val }}
                    />
                    <span>{bg.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* CENTER PANEL */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <CanvasPreview
            mockupType={product?.mockupType || 'generic'}
            productImage={product?.images?.[0]}
            uploadedImages={uploadedImages}
            customTexts={customTexts}
            designConfig={designConfig}
            previewRef={previewRef}
          />

          <div className="mt-4 flex items-center space-x-2 text-xs text-charcoal-muted">
            <Sparkles className="w-3.5 h-3.5 text-gold" />
            <span>Interactive Live Simulation | What you see is exactly what is crafted</span>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-beige shadow-premium p-6 space-y-5">
          <div>
            <h3 className="font-serif text-lg font-bold text-charcoal leading-snug">
              {product?.name}
            </h3>
            <span className="text-xs text-charcoal-muted mt-0.5 block">
              Category: {product?.category}
            </span>
          </div>

          {product?.variants?.sizes && product.variants.sizes.length > 0 && (
            <div>
              <label className="block text-xs font-semibold text-charcoal mb-1.5 uppercase tracking-wider">
                Select Size:
              </label>
              <select
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
                className="w-full border border-beige-dark rounded-lg px-3 py-2 text-xs text-charcoal bg-white focus:outline-none focus:border-burgundy"
              >
                {product.variants.sizes.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          )}

          {product?.variants?.colors && product.variants.colors.length > 0 && (
            <div>
              <label className="block text-xs font-semibold text-charcoal mb-1.5 uppercase tracking-wider">
                Select Color / Finish:
              </label>
              <select
                value={selectedColor}
                onChange={(e) => setSelectedColor(e.target.value)}
                className="w-full border border-beige-dark rounded-lg px-3 py-2 text-xs text-charcoal bg-white focus:outline-none focus:border-burgundy"
              >
                {product.variants.colors.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="p-3 bg-beige-light/50 border border-beige rounded-xl">
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
                  Includes personalized greeting card and wax-sealed seal.
                </p>
              </div>
            </label>
          </div>

          <div className="border-t border-beige pt-4 space-y-2 text-xs">
            <div className="flex justify-between text-charcoal-muted">
              <span>Base Product Price</span>
              <span>₹{basePrice}</span>
            </div>
            {imageCharges > 0 && (
              <div className="flex justify-between text-charcoal-muted">
                <span>HD Photo Sublimation ({uploadedImages.length})</span>
                <span className="text-charcoal font-medium">+₹{imageCharges}</span>
              </div>
            )}
            {textCharges > 0 && (
              <div className="flex justify-between text-charcoal-muted">
                <span>Custom Lettering ({customTexts.length})</span>
                <span className="text-charcoal font-medium">+₹{textCharges}</span>
              </div>
            )}
            {giftPackaging && (
              <div className="flex justify-between text-charcoal-muted">
                <span>Luxury Gift Packaging</span>
                <span className="text-charcoal font-medium">+₹{packagingCharges}</span>
              </div>
            )}
            <div className="flex justify-between text-charcoal font-bold text-sm pt-2 border-t border-beige">
              <span>Total Unit Price</span>
              <span className="font-serif text-base text-burgundy">₹{unitTotal}</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs font-semibold text-charcoal uppercase tracking-wider">Quantity:</span>
            <div className="flex items-center border border-beige-dark rounded-lg overflow-hidden bg-white">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-1 text-charcoal hover:bg-beige transition-colors"
              >
                -
              </button>
              <span className="px-3 py-1 text-xs font-semibold">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-3 py-1 text-charcoal hover:bg-beige transition-colors"
              >
                +
              </button>
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isSaving}
            className="w-full bg-burgundy hover:bg-burgundy-dark text-white font-semibold py-3.5 px-4 rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 text-sm disabled:opacity-50"
          >
            {isSaving ? (
              <span>Persisting Design...</span>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Bag – ₹{grandTotal}</span>
              </>
            )}
          </button>

          <p className="text-[11px] text-center text-charcoal-muted">
            Includes 100% Satisfaction Guarantee & Design Approval
          </p>
        </div>
      </div>
    </div>
  );
};
