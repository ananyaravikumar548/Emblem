import React from 'react';
import { useBrand } from '../../context/BrandContext';

export const BrandMark = () => {
  const { brand } = useBrand();
  const { primary, secondary, accent, background } = brand.colors;

  return (
    <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-3xl space-y-6">
      <h3 className="font-bold text-lg">Brand Identity Marks</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Primary Combination Mark */}
        <div className="p-6 rounded-2xl bg-neutral-950 border border-neutral-800 flex flex-col items-center justify-center space-y-3 min-h-[160px]">
          <svg className="w-12 h-12" viewBox="0 0 100 100" fill="none">
            <polygon points="50,10 90,85 10,85" fill={primary} />
            <circle cx="50" cy="55" r="18" fill={accent} />
          </svg>
          <span className="font-extrabold tracking-wider text-xl">{brand.company_name}</span>
          <span className="text-[10px] text-neutral-500 uppercase tracking-widest">Primary Mark</span>
        </div>

        {/* Icon / Favicon Mark */}
        <div className="p-6 rounded-2xl bg-neutral-950 border border-neutral-800 flex flex-col items-center justify-center space-y-3 min-h-[160px]">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ backgroundColor: primary }}>
            <svg className="w-10 h-10" viewBox="0 0 100 100" fill="none">
              <circle cx="50" cy="50" r="30" fill={accent} />
              <path d="M50 10 L85 80 L15 80 Z" stroke={background} strokeWidth="8" />
            </svg>
          </div>
          <span className="text-[10px] text-neutral-500 uppercase tracking-widest">App Icon / Favicon</span>
        </div>

        {/* Monochrome / Reversed Mark */}
        <div className="p-6 rounded-2xl bg-white text-black border border-neutral-200 flex flex-col items-center justify-center space-y-3 min-h-[160px]">
          <svg className="w-12 h-12" viewBox="0 0 100 100" fill="none">
            <polygon points="50,10 90,85 10,85" fill="#000000" />
            <circle cx="50" cy="55" r="18" fill="#ffffff" />
          </svg>
          <span className="font-extrabold tracking-wider text-xl text-black">{brand.company_name}</span>
          <span className="text-[10px] text-neutral-400 uppercase tracking-widest">Monochrome Reverse</span>
        </div>

      </div>
    </div>
  );
};