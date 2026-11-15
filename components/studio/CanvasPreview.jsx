'use client';

import React, { useState } from 'react';
import { Eye, Layers, Sparkles, Upload } from 'lucide-react';

export const CanvasPreview = ({
  mockupType = 'frame',
  productImage,
  uploadedImages = [],
  customTexts = [],
  designConfig = {},
  previewRef,
  onUploadClick,
}) => {
  const [viewMode, setViewMode] = useState('mockup'); // 'mockup' | 'photo'
  const activeImage = uploadedImages[0];

  const renderArtwork = () => {
    return (
      <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-white">
        {activeImage && activeImage.url ? (
          <div className="relative w-full h-full flex items-center justify-center">
            <img
              src={activeImage.url}
              alt="Customized Artwork"
              className="w-full h-full object-contain pointer-events-none"
              style={{
                filter: `brightness(${activeImage.brightness || 100}%) contrast(${activeImage.contrast || 100}%) ${
                  activeImage.grayscale ? 'grayscale(100%)' : 'grayscale(0%)'
                }`,
              }}
            />
          </div>
        ) : (
          <div
            onClick={onUploadClick}
            className="flex flex-col items-center justify-center p-6 text-center cursor-pointer hover:bg-beige-light/30 transition-colors w-full h-full"
          >
            <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center text-burgundy mb-2">
              <Upload className="w-6 h-6 text-burgundy" />
            </div>
            <span className="font-serif text-sm font-bold text-charcoal">Click to Upload Photo</span>
            <span className="text-[11px] text-charcoal-muted mt-1">
              Supports high-resolution JPG, PNG or WebP
            </span>
          </div>
        )}

        {/* Text Overlays on artwork if text is configured */}
        {customTexts.map((textItem) => (
          <div
            key={textItem.id}
            className="absolute px-3 py-1 text-center pointer-events-none"
            style={{
              bottom: '8%',
              left: '50%',
              transform: 'translateX(-50%)',
              color: textItem.color || '#702C3B',
              fontFamily: textItem.fontFamily || 'Playfair Display',
              fontSize: '15px',
              fontWeight: textItem.fontWeight || '600',
              textShadow: '0 1px 3px rgba(255,255,255,0.8)',
              maxWidth: '85%',
              wordBreak: 'break-word',
              lineHeight: 1.2,
            }}
          >
            {textItem.text || ''}
          </div>
        ))}
      </div>
    );
  };

  // Render Realistic Mockups (IGP.com-grade realistic standing photo frame and gifts)
  const renderRealisticMockup = () => {
    switch (mockupType) {
      case 'frame':
      default:
        return (
          <div className="relative w-full max-w-[420px] aspect-[4/5] mx-auto flex items-center justify-center">
            {/* Wooden Tabletop Surface Environment */}
            <div
              className="absolute inset-0 rounded-2xl overflow-hidden shadow-inner -z-10"
              style={{
                background: 'radial-gradient(ellipse at 50% 30%, #F5EFE6 0%, #E8DFD3 60%, #D8C8B5 100%)',
              }}
            >
              {/* Soft desk shadow */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-4/5 h-12 bg-black/20 rounded-full blur-xl pointer-events-none" />
            </div>

            {/* Standing Gold Desk Frame Assembly */}
            <div className="relative w-[78%] h-[84%] flex items-center justify-center">
              {/* Rear Standing Strut / Easel Leg (visible at the side, exactly like IGP) */}
              <div
                className="absolute right-0 top-[35%] w-6 h-[55%] rounded-r-md pointer-events-none"
                style={{
                  background: 'linear-gradient(135deg, #B38F38 0%, #8C6D23 100%)',
                  transform: 'skewY(-32deg) rotate(8deg)',
                  boxShadow: '4px 8px 15px rgba(0,0,0,0.3)',
                  zIndex: 0,
                }}
              />

              {/* Main Golden Frame Structure */}
              <div
                className="relative w-full h-full rounded-sm p-[10px] sm:p-[14px] flex flex-col items-center justify-center shadow-2xl transition-all"
                style={{
                  zIndex: 1,
                  background: 'linear-gradient(135deg, #ECCF80 0%, #FFFAEB 18%, #CDB064 45%, #8C6D23 75%, #F5DE9B 100%)',
                  boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.45), inset 0 1px 2px rgba(255,255,255,0.8), inset 0 -2px 4px rgba(0,0,0,0.4)',
                  border: '1px solid #B89745',
                }}
              >
                {/* Side Pivot Screws (Matching IGP hardware detail) */}
                <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#B38F38] border border-[#FFFAEB] shadow-xs" />
                <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#B38F38] border border-[#FFFAEB] shadow-xs" />

                {/* Inner Gold Bevel Rim */}
                <div
                  className="w-full h-full p-1 rounded-xs flex flex-col items-center justify-center relative shadow-inner overflow-hidden"
                  style={{
                    backgroundColor: '#FAF8F3',
                    border: '1.5px solid #8C6D23',
                  }}
                >
                  {/* Photo Display Window */}
                  <div className="relative w-full h-full overflow-hidden flex items-center justify-center bg-white">
                    {renderArtwork()}

                    {/* Realistic Glass Reflection Sheen */}
                    <div
                      className="absolute inset-0 pointer-events-none mix-blend-screen opacity-30"
                      style={{
                        background:
                          'linear-gradient(125deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.15) 35%, transparent 55%, rgba(255,255,255,0.2) 100%)',
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'mug':
        return (
          <div className="relative w-full max-w-[380px] aspect-square mx-auto flex items-center justify-center">
            {/* Ceramic Mug Body */}
            <div className="relative w-[65%] h-[82%] flex items-center">
              <div
                className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl border border-charcoal/10"
                style={{
                  background: 'linear-gradient(to right, #D8D4CC 0%, #FFFFFF 20%, #F5F3EF 65%, #CFCBC3 100%)',
                  boxShadow: '0 20px 35px -10px rgba(0,0,0,0.3), inset -10px 0 20px rgba(0,0,0,0.08)',
                }}
              >
                <div className="w-full h-4 bg-gradient-to-b from-[#ECE8E1] to-[#FFFFFF] rounded-t-2xl border-b border-charcoal/10" />
                <div className="relative w-[85%] h-[72%] mx-auto mt-3 rounded-lg overflow-hidden shadow-inner flex items-center justify-center bg-white">
                  {renderArtwork()}
                </div>
              </div>
              {/* Mug Handle */}
              <div
                className="absolute -right-12 top-[18%] w-16 h-[58%] rounded-r-3xl border-[14px] border-[#EDE9E1] border-l-0 shadow-lg"
                style={{ filter: 'drop-shadow(4px 4px 6px rgba(0,0,0,0.25))' }}
              />
            </div>
          </div>
        );

      case 'tshirt':
        return (
          <div className="relative w-full max-w-[380px] aspect-[4/5] mx-auto flex items-center justify-center">
            <div
              className="relative w-full h-[90%] rounded-3xl p-6 flex flex-col items-center shadow-xl border border-charcoal/10 overflow-hidden"
              style={{ backgroundColor: '#FAF9F6' }}
            >
              <div className="w-28 h-10 -mt-6 rounded-b-full border-4 border-[#DDD9D0] bg-[#ECE8E0] shadow-inner mb-4" />
              <div className="relative w-[75%] h-[65%] rounded-xl overflow-hidden shadow-xs border border-dashed border-charcoal/20 flex items-center justify-center bg-white">
                {renderArtwork()}
              </div>
              <span className="text-[10px] text-charcoal-muted uppercase tracking-widest font-semibold mt-4">
                100% Combed Organic Cotton
              </span>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="relative w-full flex flex-col items-center">
      {/* Top Preview Bar */}
      <div className="w-full flex justify-between items-center mb-3 px-1">
        <div className="flex items-center space-x-1.5 text-xs text-charcoal font-semibold">
          <Sparkles className="w-4 h-4 text-gold-dark" />
          <span>Interactive Preview Studio</span>
        </div>

        <div className="flex items-center bg-white border border-beige rounded-xl p-0.5 shadow-2xs">
          <button
            type="button"
            onClick={() => setViewMode('mockup')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center space-x-1 transition-all ${
              viewMode === 'mockup'
                ? 'bg-burgundy text-white shadow-xs'
                : 'text-charcoal-muted hover:text-charcoal'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>3D Mockup</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('photo')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center space-x-1 transition-all ${
              viewMode === 'photo'
                ? 'bg-burgundy text-white shadow-xs'
                : 'text-charcoal-muted hover:text-charcoal'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Product Base</span>
          </button>
        </div>
      </div>

      {/* Main Preview Container */}
      <div
        ref={previewRef}
        className="relative w-full max-w-lg aspect-square bg-[#FAF8F3] rounded-3xl overflow-hidden shadow-premium border border-beige-dark flex items-center justify-center p-4 sm:p-6 select-none"
      >
        {viewMode === 'mockup' ? (
          renderRealisticMockup()
        ) : (
          <div className="relative w-full h-full flex items-center justify-center">
            <img
              src={productImage}
              alt="Base Product Photo"
              className="w-full h-full object-contain drop-shadow-md rounded-2xl"
            />
          </div>
        )}
      </div>

      <p className="text-[11px] text-charcoal-muted mt-2 text-center">
        ✨ Live rendering: What you see on this preview is exactly what our artisans print and dispatch.
      </p>
    </div>
  );
};
