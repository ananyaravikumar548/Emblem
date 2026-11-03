import React from 'react';
import { CollateralThumbnail } from './CollateralThumbnail';

export const CollateralFilmstrip = ({ collateral, selectedId, onSelect }) => {
  return (
    <div className="border-t border-neutral-200 bg-white px-5 sm:px-6 py-3 shrink-0">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 font-semibold">Collateral Library</span>
        <span className="text-[10px] font-mono text-neutral-400">{collateral.length} items</span>
      </div>
      <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-hide" style={{ scrollbarWidth: 'none' }}>
        {collateral.length === 0 ? (
          <div className="text-sm text-neutral-400 py-4">No collateral yet</div>
        ) : (
          collateral.map(item => (
            <CollateralThumbnail key={item.id} item={item} isActive={item.id === selectedId} onClick={() => onSelect(item.id)} />
          ))
        )}
      </div>
    </div>
  );
};
