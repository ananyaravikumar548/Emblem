import React from 'react';
import { useBrand } from '../../context/BrandContext';

export const EditPanel = ({ brand, onUpdate }) => {
  const { brand: currentBrand } = useBrand();
  const b = brand || currentBrand;
  const colors = b?.colors || {};
  const typography = b?.typography || {};

  return (
    <div className="w-72 border-l border-neutral-200 bg-white p-4 overflow-y-auto shrink-0">
      <h3 className="text-xs font-bold text-black mb-4 flex items-center justify-between">
        Edit Template
        <span className="text-[9px] font-mono text-neutral-400 font-normal">{b?.companyName || ''}</span>
      </h3>

      <div className="space-y-5">
        {/* Logo */}
        <div className="space-y-2">
          <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 font-semibold block">Logo</span>
          <div className="h-12 bg-neutral-50 border border-neutral-200 rounded-lg flex items-center justify-center text-xs text-neutral-400">
            Mark Preview
          </div>
        </div>

        {/* Colors */}
        <div className="space-y-2">
          <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 font-semibold block">Colors</span>
          {Object.entries(colors).map(([key, hex]) => (
            <div key={key} className="flex items-center justify-between">
              <span className="text-[11px] text-neutral-600 capitalize">{key}</span>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={hex}
                  onChange={e => onUpdate?.('colors', { ...colors, [key]: e.target.value })}
                  className="w-5 h-5 rounded cursor-pointer border-0 p-0"
                />
                <span className="text-[10px] font-mono text-neutral-400">{hex}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Typography */}
        <div className="space-y-2">
          <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 font-semibold block">Typography</span>
          {Object.entries(typography).filter(([k]) => ['display', 'headline', 'body', 'mono'].includes(k)).map(([key, val]) => (
            <div key={key} className="space-y-1">
              <label className="text-[10px] text-neutral-400 capitalize">{key}</label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={val?.family || ''}
                  onChange={e => onUpdate?.('typography', { ...typography, [key]: { ...val, family: e.target.value } })}
                  className="flex-1 px-2 py-1 text-[11px] border border-neutral-200 rounded focus:outline-none focus:border-black"
                  placeholder="Font"
                />
                <input
                  type="number"
                  value={val?.size || ''}
                  onChange={e => onUpdate?.('typography', { ...typography, [key]: { ...val, size: Number(e.target.value) } })}
                  className="w-12 px-2 py-1 text-[11px] border border-neutral-200 rounded focus:outline-none focus:border-black"
                  placeholder="Size"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="space-y-2">
          <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 font-semibold block">Content</span>
          <div className="space-y-1">
            <label className="text-[10px] text-neutral-400">Company Name</label>
            <input type="text" defaultValue={b?.companyName || ''} className="w-full px-2 py-1 text-[11px] border border-neutral-200 rounded focus:outline-none focus:border-black" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] text-neutral-400">Tagline</label>
            <input type="text" defaultValue={b?.tagline || ''} className="w-full px-2 py-1 text-[11px] border border-neutral-200 rounded focus:outline-none focus:border-black" />
          </div>
        </div>
      </div>
    </div>
  );
};
