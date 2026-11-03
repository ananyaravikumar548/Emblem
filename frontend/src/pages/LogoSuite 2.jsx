import React, { useState } from 'react';
import { useBrand } from '../context/BrandContext';
import { buildBrandLogos, downloadSvg } from '../lib/vectorEngine';

export const LogoSuite = () => {
  const { brand } = useBrand();
  const [showGuides, setShowGuides] = useState(false);

  const companyName = brand?.companyName || brand?.company_name || 'NOVA';
  const colors = brand?.colors || {};
  const primaryColor = colors.primary || '#0F172A';
  const accentColor = colors.accent || '#738F80';
  const typography = brand?.typography || {};
  const displayFont = typography.display?.family || typography.heading_font || 'Syne, sans-serif';

  const logos = buildBrandLogos(brand);

  const handleDownloadVariant = (svgString, variantSlug) => {
    const filename = `${companyName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${variantSlug}.svg`;
    downloadSvg(svgString, filename);
  };

  return (
    <div className="p-5 sm:p-8 max-w-6xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between sm:items-end border-b border-neutral-200/80 pb-6">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-full bg-neutral-100 text-[10px] font-mono font-bold uppercase tracking-widest text-neutral-600 mb-1">
            <span>VECTOR SUITE</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-black" style={{ fontFamily: displayFont }}>
            Deterministic Logo Suite
          </h1>
          <p className="text-neutral-500 text-sm max-w-2xl leading-relaxed">
            Pure SVG vector lockups for <strong className="text-black">{companyName}</strong>. Engineered with strict 1x safety zones and downloadable in production format.
          </p>
        </div>

        {/* Technical Guides Toggle */}
        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={() => setShowGuides(!showGuides)}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center space-x-2 border ${
              showGuides
                ? 'bg-black text-white border-black shadow-md'
                : 'bg-white text-neutral-700 border-neutral-200 hover:border-neutral-400'
            }`}
          >
            <span>{showGuides ? 'Hide Safety Overlays' : 'Show Safety Overlays'}</span>
            <span className="text-[10px]">{showGuides ? '●' : '○'}</span>
          </button>
        </div>
      </div>

      {/* Grid of Logo Variants */}
      <div className="grid grid-cols-12 gap-6">

        {/* 01. PRIMARY HORIZONTAL LOCKUP */}
        <div className="col-span-12 lg:col-span-8 bg-white border border-neutral-200/80 rounded-2xl p-6 sm:p-8 flex flex-col justify-between relative shadow-sm min-h-[380px]">
          <div className="flex justify-between items-center z-20">
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 rounded-full bg-neutral-100 border border-neutral-200 text-[10px] font-mono font-bold tracking-widest text-neutral-800 uppercase">
                01. PRIMARY HORIZONTAL
              </span>
              <span className="text-[10px] font-mono text-neutral-400">400 × 100 px</span>
            </div>

            <button
              onClick={() => handleDownloadVariant(logos.primary, 'primary')}
              className="px-3 py-1.5 rounded-lg bg-neutral-100 hover:bg-black hover:text-white transition-colors text-xs font-mono font-bold flex items-center space-x-1.5"
            >
              <span>Download .SVG</span>
              <span>↓</span>
            </button>
          </div>

          {/* SVG Canvas Area */}
          <div className="my-auto py-8 flex items-center justify-center relative w-full overflow-hidden">
            {showGuides && (
              <div className="absolute inset-2 border-2 border-dashed border-rose-400/70 pointer-events-none rounded flex flex-col justify-between p-2">
                <div className="flex justify-between text-[9px] font-mono text-rose-500 font-bold">
                  <span>1x CLEAR SPACE (TOP)</span>
                  <span>1x CLEAR SPACE (RIGHT)</span>
                </div>
                <div className="flex justify-between text-[9px] font-mono text-rose-500 font-bold">
                  <span>1x CLEAR SPACE (LEFT)</span>
                  <span>1x CLEAR SPACE (BOTTOM)</span>
                </div>
              </div>
            )}

            <div
              className="w-full max-w-lg transition-transform hover:scale-[1.02] duration-200"
              dangerouslySetInnerHTML={{ __html: logos.primary }}
            />
          </div>

          {/* Technical Specs Footer */}
          <div className="flex flex-wrap gap-6 pt-4 border-t border-neutral-100 text-xs font-mono z-20">
            <div>
              <p className="text-[9px] text-neutral-400 uppercase tracking-wider">Safety Zone</p>
              <p className="font-bold text-neutral-800 mt-0.5">1x Mark Width (48px Digital)</p>
            </div>
            <div>
              <p className="text-[9px] text-neutral-400 uppercase tracking-wider">Minimum Size</p>
              <p className="font-bold text-neutral-800 mt-0.5">24px Screen / 15mm Print</p>
            </div>
            <div>
              <p className="text-[9px] text-neutral-400 uppercase tracking-wider">Color Composition</p>
              <p className="font-bold text-neutral-800 mt-0.5">{primaryColor} + {accentColor}</p>
            </div>
          </div>
        </div>

        {/* 02. STACKED VERTICAL LOCKUP */}
        <div className="col-span-12 sm:col-span-6 lg:col-span-4 bg-white border border-neutral-200/80 rounded-2xl p-6 sm:p-8 flex flex-col justify-between relative shadow-sm min-h-[380px]">
          <div className="flex justify-between items-center z-20">
            <span className="px-3 py-1 rounded-full bg-neutral-100 border border-neutral-200 text-[10px] font-mono font-bold tracking-widest text-neutral-800 uppercase">
              02. STACKED LOCKUP
            </span>
            <button
              onClick={() => handleDownloadVariant(logos.stacked, 'stacked')}
              className="px-2.5 py-1 rounded-lg bg-neutral-100 hover:bg-black hover:text-white transition-colors text-[11px] font-mono font-bold"
            >
              .SVG ↓
            </button>
          </div>

          <div className="my-auto py-4 flex items-center justify-center relative">
            {showGuides && (
              <div className="absolute inset-1 border border-dashed border-rose-400/70 pointer-events-none rounded flex items-center justify-center">
                <span className="text-[8px] font-mono text-rose-500 font-bold bg-white px-1">240 × 240 px</span>
              </div>
            )}
            <div
              className="w-48 h-48 flex items-center justify-center"
              dangerouslySetInnerHTML={{ __html: logos.stacked }}
            />
          </div>

          <div className="pt-3 border-t border-neutral-100 text-[10px] font-mono text-neutral-500 flex justify-between">
            <span>Grid Alignment: Center</span>
            <span>Ratio 1:1</span>
          </div>
        </div>

        {/* 03. ISOLATED ICON MARK / APP ICON */}
        <div className="col-span-12 sm:col-span-6 lg:col-span-4 bg-white border border-neutral-200/80 rounded-2xl p-6 flex flex-col justify-between shadow-sm min-h-[300px]">
          <div className="flex justify-between items-center">
            <span className="px-3 py-1 rounded-full bg-neutral-100 border border-neutral-200 text-[10px] font-mono font-bold tracking-widest text-neutral-800 uppercase">
              03. APP ICON / MARK
            </span>
            <button
              onClick={() => handleDownloadVariant(logos.mark, 'mark')}
              className="px-2.5 py-1 rounded-lg bg-neutral-100 hover:bg-black hover:text-white transition-colors text-[11px] font-mono font-bold"
            >
              .SVG ↓
            </button>
          </div>

          <div className="my-auto flex items-center justify-center">
            <div
              className="w-32 h-32 flex items-center justify-center transition-transform hover:scale-105 duration-200"
              dangerouslySetInnerHTML={{ __html: logos.mark }}
            />
          </div>

          <div className="pt-2 border-t border-neutral-100 text-[10px] font-mono text-neutral-500 flex justify-between">
            <span>Isolated Vector Icon</span>
            <span>120 × 120 px</span>
          </div>
        </div>

        {/* 04. MONOCHROME LIGHT */}
        <div className="col-span-12 sm:col-span-6 lg:col-span-4 bg-white border border-neutral-200/80 rounded-2xl p-6 flex flex-col justify-between shadow-sm min-h-[300px]">
          <div className="flex justify-between items-center">
            <span className="px-3 py-1 rounded-full bg-neutral-100 border border-neutral-200 text-[10px] font-mono font-bold tracking-widest text-neutral-800 uppercase">
              04. MONO LIGHT
            </span>
            <button
              onClick={() => handleDownloadVariant(logos.monoLight, 'mono-light')}
              className="px-2.5 py-1 rounded-lg bg-neutral-100 hover:bg-black hover:text-white transition-colors text-[11px] font-mono font-bold"
            >
              .SVG ↓
            </button>
          </div>

          <div className="my-auto flex items-center justify-center p-2">
            <div
              className="w-full max-w-[280px]"
              dangerouslySetInnerHTML={{ __html: logos.monoLight }}
            />
          </div>

          <div className="pt-2 border-t border-neutral-100 text-[10px] font-mono text-neutral-500 flex justify-between">
            <span>#0A0A0A on White</span>
            <span>Contrast 19.8:1 AAA</span>
          </div>
        </div>

        {/* 05. MONOCHROME DARK */}
        <div className="col-span-12 sm:col-span-6 lg:col-span-4 bg-[#0A0A0A] text-white rounded-2xl p-6 flex flex-col justify-between shadow-md min-h-[300px]">
          <div className="flex justify-between items-center">
            <span className="px-3 py-1 rounded-full bg-white/10 text-[10px] font-mono font-bold tracking-widest text-white uppercase">
              05. MONO DARK
            </span>
            <button
              onClick={() => handleDownloadVariant(logos.monoDark, 'mono-dark')}
              className="px-2.5 py-1 rounded-lg bg-white/20 hover:bg-white hover:text-black transition-colors text-[11px] font-mono font-bold text-white"
            >
              .SVG ↓
            </button>
          </div>

          <div className="my-auto flex items-center justify-center p-2">
            <div
              className="w-full max-w-[280px]"
              dangerouslySetInnerHTML={{ __html: logos.monoDark }}
            />
          </div>

          <div className="pt-2 border-t border-white/10 text-[10px] font-mono text-neutral-400 flex justify-between">
            <span>White on #0A0A0A</span>
            <span>Contrast 19.8:1 AAA</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default LogoSuite;
