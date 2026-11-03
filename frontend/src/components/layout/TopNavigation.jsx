import React from 'react';
import { useBrand } from '../../context/BrandContext';

export const TopNavigation = ({ activeNav, onNavigate, onMenuToggle, isMenuOpen }) => {
  const { brand, user } = useBrand();
  const companyName = brand?.companyName || brand?.company_name || 'NOVA';

  return (
    <header className="h-16 bg-white/95 backdrop-blur border-b border-neutral-200 px-4 sm:px-6 flex items-center justify-between shrink-0 z-30">
      <div className="flex items-center space-x-3 sm:space-x-4">
        <div className="flex items-center space-x-2.5">
          <div className="w-5 h-5 bg-black rotate-45 flex items-center justify-center shadow-xs">
            <div className="w-1.5 h-1.5 bg-white"></div>
          </div>
          <span className="font-extrabold text-sm tracking-tight uppercase">EMBLEM</span>
        </div>
        <span className="text-neutral-300 hidden sm:inline">/</span>
        <div className="hidden sm:block">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-sm">{companyName}</span>
            <span className="text-[10px] text-neutral-400 max-w-[160px] leading-tight">
              {brand?.industry || 'Studio-Grade Brand DNA'}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-2 sm:space-x-3">
        <button type="button" className="hidden sm:flex items-center px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-800 transition-colors">
          Studio
        </button>
        <button type="button" className="hidden sm:flex items-center px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg text-neutral-500 hover:bg-neutral-100 transition-colors">
          Assets
        </button>
        <button type="button" className="hidden sm:flex items-center px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg text-neutral-500 hover:bg-neutral-100 transition-colors">
          DNA
        </button>
        <button type="button" className="hidden sm:flex items-center px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg text-neutral-500 hover:bg-neutral-100 transition-colors">
          History
        </button>

        <div className="w-px h-5 bg-neutral-200 mx-1 hidden sm:block"></div>

        <button type="button" className="hidden sm:flex w-8 h-8 rounded-lg border border-neutral-200 items-center justify-center text-neutral-500 hover:bg-neutral-50 transition-colors">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
        </button>

        <button type="button" className="hidden sm:flex w-8 h-8 rounded-lg border border-neutral-200 items-center justify-center text-neutral-500 hover:bg-neutral-50 transition-colors relative">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-black rounded-full"></span>
        </button>

        <button type="button" className="hidden sm:flex w-8 h-8 rounded-lg border border-neutral-200 items-center justify-center text-neutral-500 hover:bg-neutral-50 transition-colors">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
        </button>

        {user ? (
          <div className="w-8 h-8 rounded-full bg-neutral-900 text-white flex items-center justify-center font-bold text-xs uppercase">
            {user.name ? user.name.charAt(0) : 'U'}
          </div>
        ) : (
          <div className="w-8 h-8 rounded-full bg-neutral-200 flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-neutral-500"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </div>
        )}

        <button type="button" onClick={onMenuToggle} className="sm:hidden w-9 h-9 rounded-lg border border-neutral-200 flex items-center justify-center text-lg leading-none">
          {isMenuOpen ? '×' : '☰'}
        </button>
      </div>
    </header>
  );
};
