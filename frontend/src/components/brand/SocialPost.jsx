import React from 'react';
import { useBrand } from '../../context/BrandContext';
import { readableTextColor } from '../../lib/colorUtils';

export const SocialPost = () => {
  const { brand } = useBrand();
  const colors = brand?.colors || {};
  const primaryInk = readableTextColor(colors.surface || '#fff', colors.primary || '#111', '#171313');
  const secondaryInk = readableTextColor('#fff', colors.secondary || '#555', '#171313');

  return (
    <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-3xl space-y-6">
      <h3 className="font-bold text-lg">Social Media Assets</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Instagram Post (1:1 Aspect Ratio) */}
        <div className="space-y-2">
          <span className="text-xs text-neutral-400 font-mono">1080 x 1080 (Square Post)</span>
          <div 
            className="aspect-square p-8 rounded-2xl flex flex-col justify-between border border-neutral-700 shadow-xl"
            style={{ backgroundColor: colors.primary, color: primaryInk }}
          >
            <div className="flex justify-between items-center">
              <span className="font-black tracking-widest uppercase text-sm">{brand.company_name}</span>
              <span className="text-xs px-2 py-1 rounded bg-white/10 backdrop-blur">#BrandIdentity</span>
            </div>
            <div className="space-y-2">
              <h4 className="text-2xl font-bold leading-tight">{brand.tagline}</h4>
              <p className="text-xs opacity-80">{brand.description}</p>
            </div>
            <div className="pt-4 border-t border-white/20 text-xs font-mono">
              {brand.company_name.toLowerCase().replace(/\s+/g, '')}.com
            </div>
          </div>
        </div>

        {/* LinkedIn Banner (16:9 Aspect Ratio) */}
        <div className="space-y-2">
          <span className="text-xs text-neutral-400 font-mono">1584 x 396 (Header Banner)</span>
          <div 
            className="h-48 p-6 rounded-2xl flex flex-col justify-between border border-neutral-700 shadow-xl"
            style={{ backgroundColor: colors.secondary, color: secondaryInk }}
          >
            <div className="flex justify-between items-start">
              <span className="font-extrabold text-xl">{brand.company_name}</span>
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: brand.colors.accent }} />
            </div>
            <div>
              <p className="text-lg font-semibold">{brand.tagline}</p>
              <p className="text-xs text-neutral-400 mt-1">{brand.personality.join(' • ')}</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
