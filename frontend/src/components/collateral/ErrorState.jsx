import React from 'react';

export const ErrorState = ({ error, onRetry }) => {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center space-y-4 p-8 bg-white border border-neutral-200 rounded-2xl max-w-sm">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-rose-500">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-bold text-black">Unable to load collateral</h3>
          <p className="text-xs text-neutral-500">{error || 'Something went wrong. Please check your connection.'}</p>
        </div>
        <button type="button" onClick={onRetry} className="px-5 py-2.5 rounded-xl bg-black text-white text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors">
          Retry
        </button>
      </div>
    </div>
  );
};
