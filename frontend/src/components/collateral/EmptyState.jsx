import React from 'react';

export const EmptyState = ({ onAdd }) => {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-20 h-20 mx-auto rounded-2xl bg-neutral-100 flex items-center justify-center">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-neutral-400">
            <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M12 8v8"/><path d="M8 12h8"/>
          </svg>
        </div>
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-black">No collateral yet</h3>
          <p className="text-sm text-neutral-500">Create your first branded asset.</p>
        </div>
        <button type="button" onClick={onAdd} className="px-5 py-2.5 rounded-xl bg-black text-white text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors">
          + Add collateral
        </button>
      </div>
    </div>
  );
};
