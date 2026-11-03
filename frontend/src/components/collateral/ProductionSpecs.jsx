import React from 'react';

export const ProductionSpecs = ({ specs, metadata }) => {
  const allSpecs = { ...specs, ...metadata };
  const entries = Object.entries(allSpecs).filter(([, v]) => v && v !== '—');

  if (entries.length === 0) return null;

  return (
    <div className="flex items-center gap-6 px-5 sm:px-6 py-3 border-t border-neutral-100 bg-white/50 overflow-x-auto">
      <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 font-semibold shrink-0">PRODUCTION SPECS</span>
      {entries.map(([key, value]) => (
        <div key={key} className="flex items-center space-x-1.5 shrink-0">
          <span className="text-[10px] font-mono text-neutral-500 uppercase">{key}:</span>
          <span className="text-[10px] font-mono font-bold text-black">{value}</span>
        </div>
      ))}
    </div>
  );
};
