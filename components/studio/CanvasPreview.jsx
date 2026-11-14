'use client';

import React from 'react';

export const CanvasPreview = ({
  mockupType,
  productImage,
  uploadedImages = [],
  customTexts = [],
  designConfig = {},
  previewRef,
}) => {
  const activeImage = uploadedImages[0];

  const getPrintAreaStyles = () => {
    switch (mockupType) {
      case 'mug':
        return 'top-[28%] left-[28%] w-[44%] h-[46%] rounded-sm';
      case 'frame':
        return 'top-[16%] left-[22%] w-[56%] h-[68%] rounded-sm';
      case 'tshirt':
        return 'top-[30%] left-[33%] w-[34%] h-[40%] rounded-sm';
      case 'cushion':
        return 'top-[22%] left-[22%] w-[56%] h-[56%] rounded-lg';
      case 'lamp':
        return 'top-[18%] left-[25%] w-[50%] h-[54%] rounded-t-2xl';
      case 'keychain':
        return 'top-[36%] left-[34%] w-[32%] h-[32%] rounded-md';
      case 'album':
        return 'top-[20%] left-[24%] w-[52%] h-[60%] rounded-sm';
      case 'watch':
        return 'top-[32%] left-[32%] w-[36%] h-[36%] rounded-full';
      default:
        return 'top-[20%] left-[20%] w-[60%] h-[60%] rounded-md';
    }
  };

  return (
    <div
      ref={previewRef}
      className="relative w-full max-w-lg aspect-square bg-gradient-to-b from-[#FAF7F2] to-[#ECE5DB] rounded-2xl overflow-hidden shadow-2xl border border-beige-dark flex items-center justify-center p-4 select-none"
    >
      <div className="absolute inset-0 bg-radial-gradient from-white/60 to-transparent opacity-80 pointer-events-none" />

      <img
        src={productImage}
        alt="Product Base Mockup"
        className="w-full h-full object-contain relative z-10 drop-shadow-xl transition-all duration-300"
      />

      <div
        className={`absolute z-20 overflow-hidden flex flex-col items-center justify-center pointer-events-none ${getPrintAreaStyles()}`}
        style={{
          backgroundColor: designConfig.backgroundColor || 'transparent',
          boxShadow: 'inset 0 0 15px rgba(0,0,0,0.12)',
        }}
      >
        {activeImage && activeImage.url && (
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
              className="w-full h-full object-cover rounded shadow-sm pointer-events-none"
            />
          </div>
        )}

        {customTexts.map((textItem) => (
          <div
            key={textItem.id}
            className="absolute px-2 text-center"
            style={{
              top: `${textItem.y}%`,
              left: `${textItem.x}%`,
              transform: `translate(-50%, -50%) rotate(${textItem.rotation || 0}deg)`,
              color: textItem.color,
              fontFamily: textItem.fontFamily,
              fontSize: `${Math.max(12, textItem.fontSize * 0.7)}px`,
              fontWeight: textItem.fontWeight || '600',
              textShadow: textItem.color === '#FFFFFF' ? '0 1px 3px rgba(0,0,0,0.6)' : 'none',
              maxWidth: '90%',
              wordBreak: 'break-word',
              lineHeight: 1.2,
            }}
          >
            {textItem.text || 'Your Message Here'}
          </div>
        ))}

        {!activeImage && customTexts.length === 0 && (
          <div className="border-2 border-dashed border-burgundy/40 rounded-lg p-4 text-center bg-white/60 backdrop-blur-xs flex flex-col items-center">
            <span className="text-[11px] font-serif font-semibold text-burgundy">Your Personal Design</span>
            <span className="text-[9px] text-charcoal-muted mt-0.5">Upload a photo or add custom text</span>
          </div>
        )}
      </div>

      <div className="absolute inset-0 z-30 pointer-events-none mix-blend-overlay opacity-30 bg-gradient-to-tr from-transparent via-white/50 to-transparent" />
    </div>
  );
};
