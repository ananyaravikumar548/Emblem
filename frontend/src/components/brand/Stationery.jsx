import React from 'react';
import { useBrand } from '../../context/BrandContext';

export const BusinessCard = () => {
  const { brand } = useBrand();

  // Fallbacks to prevent undefined property errors
  const headingFont = brand?.typography?.heading_font || 'Playfair Display';
  const bodyFont = brand?.typography?.body_font || 'Inter';
  const primaryColor = brand?.colors?.primary || '#1D2B3A';
  const backgroundColor = brand?.colors?.background || '#FFFFFF';

  return (
    <div 
      className="w-full max-w-sm aspect-[1.75/1] p-6 rounded-2xl shadow-2xl flex flex-col justify-between border border-neutral-800 text-white relative overflow-hidden"
      style={{ backgroundColor: primaryColor }}
    >
      <div className="flex justify-between items-start">
        <span 
          className="text-lg font-bold tracking-tight" 
          style={{ fontFamily: headingFont }}
        >
          {brand?.company_name || 'NOVA STUDIO'}
        </span>
        <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
      </div>

      <div className="space-y-1">
        <p className="text-xs font-mono tracking-wider opacity-80 uppercase">
          {brand?.personality?.[0] || 'CREATIVE DIRECTOR'}
        </p>
        <p 
          className="text-xs opacity-60" 
          style={{ fontFamily: bodyFont }}
        >
          {brand?.tagline || 'hello@nova.studio'}
        </p>
      </div>
    </div>
  );
};