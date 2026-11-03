import React from 'react';

export const CollateralToolbar = ({ selectedCollateral, onEdit, showEditPanel, onToggleEdit, onExport }) => {
  return (
    <div className="flex items-center justify-between px-5 sm:px-6 py-3 border-b border-neutral-100 bg-white/50">
      <div className="flex items-center space-x-3">
        <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 font-semibold">
          {selectedCollateral ? selectedCollateral.name : 'Select an asset'}
        </span>
        {selectedCollateral && (
          <span className="text-[10px] font-mono text-neutral-400">
            {selectedCollateral.format && `${selectedCollateral.format} · `}
            {selectedCollateral.dimensions && `${selectedCollateral.dimensions}px`}
          </span>
        )}
      </div>
      <div className="flex items-center space-x-2">
        <button
          type="button"
          onClick={onToggleEdit}
          className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold uppercase tracking-wider transition-colors border ${showEditPanel ? 'bg-black text-white border-black' : 'bg-white text-neutral-600 border-neutral-200 hover:border-neutral-400'}`}
        >
          {showEditPanel ? 'Close Edit' : 'Edit Template'}
        </button>
        <button type="button" onClick={onExport} className="px-3 py-1.5 rounded-lg bg-black text-white text-xs font-mono font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors">
          Export
        </button>
      </div>
    </div>
  );
};
