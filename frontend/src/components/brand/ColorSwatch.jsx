import React, { useState } from 'react';

export const ColorSwatch = ({ label, hex }) => {
  const [copied, setCopied] = useState(false);

  const copyHex = () => {
    navigator.clipboard.writeText(hex);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div onClick={copyHex} className="cursor-pointer group space-y-2">
      <div 
        className="h-20 w-full rounded-xl border border-white/10 shadow-lg transition-transform group-hover:scale-105"
        style={{ backgroundColor: hex }}
      />
      <div className="flex justify-between items-center text-xs">
        <span className="text-neutral-400 capitalize">{label}</span>
        <span className="font-mono text-neutral-200">{copied ? "Copied!" : hex}</span>
      </div>
    </div>
  );
};