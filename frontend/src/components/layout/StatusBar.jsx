import React from 'react';

export const StatusBar = () => {
  return (
    <div className="h-7 border-t border-neutral-200 bg-white/80 backdrop-blur px-4 flex items-center justify-between shrink-0">
      <div className="flex items-center space-x-4 text-[10px] font-mono text-neutral-400">
        <span className="flex items-center space-x-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          <span>Connected</span>
        </span>
        <span>EMBLEM Studio v2.0</span>
      </div>
      <div className="text-[10px] font-mono text-neutral-400">
        Deterministic Render Engine
      </div>
    </div>
  );
};
