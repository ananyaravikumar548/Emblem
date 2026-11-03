import React from 'react';
import { useBrand } from '../../context/BrandContext';

export const CollateralHeader = ({ search, onSearchChange, onFilterChange, filter }) => {
  const { brand } = useBrand();
  const companyName = brand?.companyName || brand?.company_name || 'NOVA';

  return (
    <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4 border-b border-neutral-200 pb-4 px-5 sm:px-6 pt-5">
      <div>
        <div className="flex items-center space-x-2 mb-1">
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-neutral-400">COLLATERAL</span>
          <span className="px-2 py-0.5 rounded-full bg-black text-white text-[9px] font-mono font-bold uppercase tracking-wider">{companyName}</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-black" style={{ fontFamily: brand?.typography?.display?.family || 'Syne, sans-serif' }}>
          Brand Collateral
        </h1>
        <p className="text-neutral-500 text-sm mt-1 max-w-md">
          Every touchpoint, built from {companyName}'s brand system.
        </p>
      </div>

      <div className="flex items-center space-x-2 shrink-0">
        <div className="relative">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            type="text"
            placeholder="Search collateral..."
            value={search}
            onChange={e => onSearchChange(e.target.value)}
            className="w-52 pl-9 pr-3 py-2 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:border-black transition-colors bg-white"
          />
        </div>
        <select
          value={filter}
          onChange={e => onFilterChange(e.target.value)}
          className="px-3 py-2 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:border-black bg-white transition-colors"
        >
          <option>All</option>
          <option>Print</option>
          <option>Digital</option>
          <option>Presentation</option>
          <option>Social</option>
        </select>
        <button type="button" className="px-3 py-2 rounded-xl bg-white border border-neutral-200 text-xs font-bold text-neutral-600 hover:border-neutral-400 transition-colors">
          Preview
        </button>
        <button type="button" className="px-4 py-2 rounded-xl bg-black text-white text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors flex items-center space-x-1.5">
          <span>Export</span><span>↓</span>
        </button>
      </div>
    </div>
  );
};
