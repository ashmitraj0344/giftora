'use client';

import React, { useState } from 'react';
import { Eye, Layers, Sparkles } from 'lucide-react';

export const CanvasPreview = ({
  mockupType = 'frame',
  productImage,
  uploadedImages = [],
  customTexts = [],
  designConfig = {},
  previewRef,
}) => {
  const [viewMode, setViewMode] = useState('mockup'); // 'mockup' | 'photo'
  const activeImage = uploadedImages[0];

  const renderArtwork = () => {
    return (
      <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
        {activeImage && activeImage.url ? (
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{
              transform: `translate(${activeImage.x - 50}%, ${activeImage.y - 50}%) scale(${activeImage.scale || 1}) rotate(${activeImage.rotation || 0}deg)`,
              filter: `brightness(${activeImage.brightness || 100}%) contrast(${activeImage.contrast || 100}%) ${activeImage.grayscale ? 'grayscale(100%)' : 'grayscale(0%)'}`,
              transition: 'transform 0.1s ease-out',
            }}
          >
            <img
              src={activeImage.url}
              alt="Customized Artwork"
              className="w-full h-full object-cover pointer-events-none"
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-4 text-center text-charcoal-muted">
            <Sparkles className="w-8 h-8 text-gold mb-2 opacity-70 animate-pulse" />
            <span className="font-serif text-xs font-semibold text-charcoal">Upload Your Photo</span>
            <span className="text-[10px] text-charcoal-muted/80 mt-0.5">Click &ldquo;Photo&rdquo; to preview your memories</span>
          </div>
        )}

        {/* Text Overlays on artwork */}
        {customTexts.map((textItem) => (
          <div
            key={textItem.id}
            className="absolute px-2 text-center pointer-events-none"
            style={{
              top: `${textItem.y}%`,
              left: `${textItem.x}%`,
              transform: `translate(-50%, -50%) rotate(${textItem.rotation || 0}deg)`,
              color: textItem.color,
              fontFamily: textItem.fontFamily,
              fontSize: `${Math.max(12, textItem.fontSize * 0.7)}px`,
              fontWeight: textItem.fontWeight || '600',
              textShadow: textItem.color === '#FFFFFF' ? '0 1px 3px rgba(0,0,0,0.7)' : '0 1px 2px rgba(255,255,255,0.4)',
              maxWidth: '90%',
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

  // Render Realistic 3D Mockups
  const renderRealisticMockup = () => {
    switch (mockupType) {
      case 'frame':
        return (
          <div className="relative w-full max-w-[380px] aspect-[4/5] mx-auto flex items-center justify-center">
            {/* Wooden Frame Outer Border */}
            <div
              className="relative w-full h-full rounded-xl shadow-2xl p-6 sm:p-7 flex flex-col items-center justify-between transition-all"
              style={{
                background: 'linear-gradient(135deg, #4A2E1B 0%, #2B180D 50%, #4A2E1B 100%)',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.45), inset 0 2px 4px rgba(255,255,255,0.2), inset 0 -4px 6px rgba(0,0,0,0.5)',
                border: '3px solid #6E4426',
              }}
            >
              {/* Inner Gold Foil Fillet */}
              <div className="w-full h-full p-1 rounded-sm bg-gradient-to-tr from-[#9B7D46] via-[#E2C98F] to-[#9B7D46] shadow-sm flex flex-col items-center">
                {/* Museum Mat Board (Passe-Partout) */}
                <div
                  className="w-full h-full p-4 sm:p-5 rounded-xs flex flex-col items-center justify-between relative shadow-inner"
                  style={{
                    backgroundColor: '#FAF8F3',
                    boxShadow: 'inset 0 3px 10px rgba(0,0,0,0.18)',
                  }}
                >
                  {/* Glass Aperture (Window) */}
                  <div
                    className="relative w-full flex-grow rounded-xs overflow-hidden shadow-md flex items-center justify-center border border-charcoal/15"
                    style={{
                      backgroundColor: designConfig.backgroundColor || '#EDE5D8',
                    }}
                  >
                    {renderArtwork()}

                    {/* Realistic Glass Reflection Sheen */}
                    <div
                      className="absolute inset-0 pointer-events-none mix-blend-screen opacity-35"
                      style={{
                        background: 'linear-gradient(125deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.1) 40%, transparent 60%, rgba(255,255,255,0.2) 100%)',
                      }}
                    />
                  </div>

                  {/* Engraved Brass Nameplate at Bottom of Mat */}
                  <div
                    className="mt-3 px-4 py-1.5 rounded-sm border border-[#9B7D46]/80 flex items-center justify-center shadow-xs"
                    style={{
                      background: 'linear-gradient(180deg, #EAD7A6 0%, #C4A769 50%, #9E7F41 100%)',
                      minWidth: '60%',
                    }}
                  >
                    <span
                      className="text-[11px] sm:text-xs font-serif font-bold text-[#3B260F] tracking-wider uppercase truncate"
                      style={{ textShadow: '0 1px 0 rgba(255,255,255,0.6)' }}
                    >
                      {customTexts[0]?.text || 'Together Forever • 2026'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'mug':
        return (
          <div className="relative w-full max-w-[360px] aspect-square mx-auto flex items-center justify-center">
            {/* Ceramic Mug Body */}
            <div className="relative w-[65%] h-[82%] flex items-center">
              {/* Mug Main Cylinder */}
              <div
                className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl border border-charcoal/10"
                style={{
                  background: 'linear-gradient(to right, #D8D4CC 0%, #FFFFFF 20%, #F5F3EF 65%, #CFCBC3 100%)',
                  boxShadow: '0 20px 35px -10px rgba(0,0,0,0.3), inset -10px 0 20px rgba(0,0,0,0.08), inset 10px 0 20px rgba(255,255,255,0.8)',
                }}
              >
                {/* Top Ceramic Rim */}
                <div className="w-full h-4 bg-gradient-to-b from-[#ECE8E1] to-[#FFFFFF] rounded-t-2xl border-b border-charcoal/10 shadow-xs" />

                {/* Sublimation Print Area */}
                <div className="relative w-[85%] h-[68%] mx-auto mt-4 rounded-lg overflow-hidden shadow-inner border border-charcoal/5 flex items-center justify-center">
                  {renderArtwork()}
                  {/* Cylindrical Highlight */}
                  <div className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-30 bg-gradient-to-r from-black/20 via-white/40 to-black/30" />
                </div>

                {/* Bottom Base Rim */}
                <div className="absolute bottom-0 w-full h-3 bg-gradient-to-t from-[#B8B4AC] to-transparent" />
              </div>

              {/* Ceramic Mug Handle */}
              <div
                className="absolute -right-12 top-[18%] w-16 h-[58%] rounded-r-3xl border-[14px] border-[#EDE9E1] border-l-0 shadow-lg"
                style={{
                  filter: 'drop-shadow(4px 4px 6px rgba(0,0,0,0.25))',
                  background: 'transparent',
                }}
              />
            </div>
          </div>
        );

      case 'tshirt':
        return (
          <div className="relative w-full max-w-[380px] aspect-[4/5] mx-auto flex items-center justify-center">
            {/* Cotton T-Shirt Silhouette */}
            <div
              className="relative w-full h-[90%] rounded-3xl p-6 flex flex-col items-center shadow-xl border border-charcoal/10 overflow-hidden"
              style={{
                backgroundColor: designConfig.backgroundColor && designConfig.backgroundColor !== 'transparent' ? designConfig.backgroundColor : '#FAF9F6',
                boxShadow: '0 20px 40px -10px rgba(0,0,0,0.2), inset 0 2px 4px rgba(255,255,255,0.8)',
              }}
            >
              {/* Crewneck Ribbed Collar */}
              <div className="w-28 h-10 -mt-6 rounded-b-full border-4 border-[#DDD9D0] bg-[#ECE8E0] shadow-inner mb-4" />

              {/* Shoulder & Chest Seam Line */}
              <div className="w-full h-px bg-charcoal/5 mb-4" />

              {/* Chest Direct-to-Garment Print Box */}
              <div className="relative w-[75%] h-[62%] rounded-xl overflow-hidden shadow-xs border border-dashed border-charcoal/20 flex items-center justify-center bg-white/40">
                {renderArtwork()}
                {/* Fabric Texture Effect */}
                <div
                  className="absolute inset-0 pointer-events-none mix-blend-multiply opacity-15"
                  style={{
                    backgroundImage: 'radial-gradient(#252323 1px, transparent 1px)',
                    backgroundSize: '4px 4px',
                  }}
                />
              </div>

              <span className="text-[10px] text-charcoal-muted uppercase tracking-widest font-semibold mt-4">
                100% Combed Organic Cotton (220 GSM)
              </span>
            </div>
          </div>
        );

      case 'lamp':
        return (
          <div className="relative w-full max-w-[360px] aspect-[4/5] mx-auto flex flex-col items-center justify-center">
            {/* Glowing Acrylic Panel */}
            <div
              className="relative w-[78%] h-[72%] rounded-t-3xl border-2 border-white/60 p-4 flex items-center justify-center shadow-2xl overflow-hidden"
              style={{
                background: 'linear-gradient(180deg, rgba(255, 248, 220, 0.4) 0%, rgba(255, 230, 160, 0.2) 60%, rgba(255, 215, 100, 0.6) 100%)',
                boxShadow: '0 0 35px rgba(255, 210, 120, 0.4), inset 0 0 20px rgba(255, 255, 255, 0.6)',
              }}
            >
              {renderArtwork()}
              {/* Acrylic Laser Edge Glow */}
              <div className="absolute inset-0 border-4 border-amber-200/50 rounded-t-3xl pointer-events-none" />
            </div>

            {/* Beechwood LED Stand Base */}
            <div
              className="w-[88%] h-14 rounded-xl shadow-2xl flex items-center justify-center border border-amber-900/30 -mt-2 z-10"
              style={{
                background: 'linear-gradient(180deg, #D4A373 0%, #A97142 50%, #7F4F24 100%)',
                boxShadow: '0 15px 30px rgba(0,0,0,0.35), inset 0 2px 4px rgba(255,255,255,0.4)',
              }}
            >
              <div className="w-[70%] h-2 bg-amber-200 rounded-full blur-[3px] opacity-90 shadow-[0_0_15px_#F6D365]" />
            </div>
          </div>
        );

      case 'cushion':
        return (
          <div className="relative w-full max-w-[360px] aspect-square mx-auto flex items-center justify-center">
            {/* Velvet Throw Cushion */}
            <div
              className="relative w-[88%] h-[88%] rounded-3xl p-5 flex items-center justify-center shadow-2xl overflow-hidden"
              style={{
                backgroundColor: designConfig.backgroundColor && designConfig.backgroundColor !== 'transparent' ? designConfig.backgroundColor : '#FAF7F2',
                boxShadow: '0 25px 45px -12px rgba(0,0,0,0.35), inset 0 0 30px rgba(0,0,0,0.1)',
                border: '6px double #DCD5C9',
              }}
            >
              {/* Velvet Center Print Zone */}
              <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-inner flex items-center justify-center">
                {renderArtwork()}
                {/* Velvet sheen */}
                <div className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-25 bg-gradient-to-tr from-black/20 via-white/50 to-black/20" />
              </div>
            </div>
          </div>
        );

      default:
        // Generic Gift Box / Luxury Keepsake Mockup
        return (
          <div className="relative w-full max-w-[360px] aspect-square mx-auto flex items-center justify-center">
            <div
              className="relative w-[85%] h-[85%] rounded-2xl p-6 shadow-2xl flex flex-col items-center justify-center border-2 border-gold/40 overflow-hidden"
              style={{
                backgroundColor: '#FAF8F3',
                boxShadow: '0 20px 40px -10px rgba(0,0,0,0.25), inset 0 0 20px rgba(198,164,106,0.15)',
              }}
            >
              <div className="relative w-full h-full rounded-xl overflow-hidden shadow-sm flex items-center justify-center border border-beige">
                {renderArtwork()}
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="relative w-full flex flex-col items-center">
      {/* View Switcher Bar */}
      <div className="w-full flex justify-between items-center mb-3 px-1">
        <div className="flex items-center space-x-1.5 text-xs text-charcoal font-semibold">
          <Sparkles className="w-4 h-4 text-gold-dark" />
          <span>Interactive Preview Studio</span>
        </div>

        <div className="flex items-center bg-white border border-beige rounded-xl p-0.5 shadow-2xs">
          <button
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
            onClick={() => setViewMode('photo')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center space-x-1 transition-all ${
              viewMode === 'photo'
                ? 'bg-burgundy text-white shadow-xs'
                : 'text-charcoal-muted hover:text-charcoal'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Studio Photo</span>
          </button>
        </div>
      </div>

      {/* Main Preview Container */}
      <div
        ref={previewRef}
        className="relative w-full max-w-lg aspect-square bg-gradient-to-b from-[#FAF8F3] via-[#F4EDE2] to-[#ECE5D8] rounded-3xl overflow-hidden shadow-premium border border-beige-dark flex items-center justify-center p-4 sm:p-6 select-none"
      >
        <div className="absolute inset-0 bg-radial-gradient from-white/70 to-transparent opacity-90 pointer-events-none" />

        {viewMode === 'mockup' ? (
          renderRealisticMockup()
        ) : (
          <div className="relative w-full h-full flex items-center justify-center">
            <img
              src={productImage}
              alt="Base Product Photo"
              className="w-full h-full object-contain drop-shadow-md rounded-2xl"
            />
            {/* Overlay preview on base photo */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-8">
              <div className="w-[60%] h-[60%] rounded-xl overflow-hidden shadow-lg border-2 border-white/80 bg-white/40">
                {renderArtwork()}
              </div>
            </div>
          </div>
        )}
      </div>

      <p className="text-[11px] text-charcoal-muted mt-2 text-center">
        💡 Real-time live renderer: Upload your photo & edit text to see your physical gift updated instantly.
      </p>
    </div>
  );
};
