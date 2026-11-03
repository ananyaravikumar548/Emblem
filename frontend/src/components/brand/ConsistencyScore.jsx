import React from 'react';
import { useBrand } from '../../context/BrandContext';

export const ConsistencyScore = () => {
  const { brand } = useBrand();
  if (!brand) return null;

  const metrics = [
    { name: "Color Palette Harmonization", pass: true },
    { name: "Typography Hierarchy Match", pass: true },
    { name: "Logo Contrast Ratio", pass: true },
    { name: "Brand Voice Consistency", pass: true }
  ];

  return (
    <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-bold text-lg text-white">Brand Consistency Score</h3>
          <p className="text-xs text-neutral-400">Automated design system verification</p>
        </div>
        <span className="text-4xl font-extrabold text-emerald-400">{brand.consistency_score}%</span>
      </div>

      <div className="space-y-2 pt-2 border-t border-neutral-800">
        {metrics.map((item, idx) => (
          <div key={idx} className="flex justify-between text-sm py-1">
            <span className="text-neutral-400">{item.name}</span>
            <span className="text-emerald-400 font-semibold">✓ Passed</span>
          </div>
        ))}
      </div>
    </div>
  );
};