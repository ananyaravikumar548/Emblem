import React from 'react';
import { useBrand } from '../../context/BrandContext';

export const CollateralThumbnail = ({ item, isActive, onClick }) => {
  const { brand } = useBrand();

  return (
    <button
      type="button"
      onClick={onClick}
      className={`shrink-0 w-32 rounded-xl border overflow-hidden transition-all group text-left ${isActive ? 'border-black shadow-sm ring-1 ring-black' : 'border-neutral-200 hover:border-neutral-400'}`}
    >
      <div className="h-20 relative overflow-hidden">
        {item.previewUrl ? (
          <img src={item.previewUrl} alt={item.name} className="w-full h-full object-cover" />
        ) : item.svgOrConfig && typeof item.svgOrConfig === 'object' ? (
          <div className="w-full h-full" style={{ backgroundColor: item.svgOrConfig?.background || brand?.colors?.primary || '#0F172A' }}>
            <div className="w-full h-full flex items-center justify-center p-2">
              <span className="text-[8px] font-mono uppercase text-white/60">{item.type?.replace(/_/g, ' ')}</span>
            </div>
          </div>
        ) : item.svgOrConfig ? (
          <div className="w-full h-full flex items-center justify-center p-2">
            <div dangerouslySetInnerHTML={{ __html: typeof item.svgOrConfig === 'string' ? item.svgOrConfig : item.svgOrConfig.svg || '' }} className="w-full h-full" />
          </div>
        ) : (
          <div className="w-full h-full bg-neutral-100 flex items-center justify-center">
            <span className="text-[8px] font-mono text-neutral-400">{item.format || ''}</span>
          </div>
        )}
      </div>
      <div className="p-2 bg-white">
        <p className="text-[10px] font-bold text-black truncate">{item.name}</p>
        <p className="text-[9px] font-mono text-neutral-400 truncate">{item.dimensions || item.format || ''}</p>
      </div>
    </button>
  );
};
