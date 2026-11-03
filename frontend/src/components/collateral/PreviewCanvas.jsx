import React from 'react';
import { useBrand } from '../../context/BrandContext';

export function PreviewCanvas({ selected, side }) {

  if (!selected) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-neutral-100 flex items-center justify-center mb-4">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-neutral-300"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>
          </div>
          <p className="text-sm font-bold text-neutral-800">Select an asset to preview</p>
          <p className="text-xs text-neutral-400 mt-1">Click a thumbnail from the filmstrip below</p>
        </div>
      </div>
    );
  }

  const type = selected.type || 'business_card';
  const svgConfig = selected.svgOrConfig;
  const isSvgString = typeof svgConfig === 'string';
  const isSvgObject = svgConfig && typeof svgConfig === 'object' && typeof svgConfig.svg === 'string';
  const isImage = selected.previewUrl;

  return (
    <div className="flex-1 flex items-center justify-center p-6 bg-[#FAFAFA] overflow-hidden">
      {isImage ? (
        <img src={selected.previewUrl} alt={selected.name} className="max-w-full max-h-full object-contain shadow-xl rounded-xl" />
      ) : isSvgString ? (
        <div className="w-full max-w-lg shadow-lg rounded-lg" dangerouslySetInnerHTML={{ __html: svgConfig }} />
      ) : isSvgObject ? (
        <div className="w-full max-w-lg shadow-lg rounded-lg" dangerouslySetInnerHTML={{ __html: svgConfig.svg }} />
      ) : (
        <AssetConfigRenderer type={type} config={svgConfig} side={side} />
      )}
    </div>
  );
}

function AssetConfigRenderer({ type, config, side }) {
  switch (type) {
    case 'business_card':
      return <BusinessCardFromConfig config={config} side={side || 'both'} />;
    case 'letterhead':
      return <LetterheadFromConfig config={config} />;
    case 'envelope':
      return <EnvelopeFromConfig config={config} />;
    case 'social_post':
    case 'social_story':
    case 'social_banner':
      return <SocialAssetFromConfig config={config} type={type} />;
    default:
      return (
        <div className="w-full h-64 bg-neutral-100 rounded-xl flex items-center justify-center">
          <span className="text-sm text-neutral-400">{config?.dimensions || type}</span>
        </div>
      );
  }
}

function BusinessCardFromConfig({ config, side }) {
  const { brand } = useBrand();
  const colors = brand?.colors || {};
  const typography = brand?.typography || {};

  const primary = colors.primary || '#0F172A';
  const surface = colors.surface || '#FFFFFF';
  const accent = colors.accent || '#738F80';
  const secondary = colors.secondary || '#1E293B';
  const headingFont = typography.display?.family || typography.heading_font || 'Syne, sans-serif';
  const bodyFont = typography.body?.family || typography.body_font || 'Inter, sans-serif';
  const companyName = config?.back?.name || brand?.companyName || brand?.company_name || 'NOVA';
  const title = config?.back?.title || '';
  const email = config?.back?.email || '';
  const phone = config?.back?.phone || '';
  const website = config?.back?.website || '';

  if (side === 'both' || side === 'back') {
    return (
      <div className="flex items-center justify-center gap-8">
        {side === 'both' && (
          <div>
            <span className="block text-[9px] font-mono uppercase tracking-widest text-neutral-400 text-center mb-2">FRONT</span>
            <div className="w-72" style={{ backgroundColor: config?.front?.background || primary }}>
              <div className="aspect-[1.75/1] p-5 text-white flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <span className="font-extrabold tracking-wider text-xl" style={{ fontFamily: headingFont }}>{companyName}</span>
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: config?.front?.accentBar || accent }}></div>
                </div>
                <div>
                  <p className="text-[10px] font-mono opacity-70 uppercase tracking-wider">{config?.front?.logoVariant || 'Logo'}</p>
                </div>
              </div>
            </div>
          </div>
        )}
        {side === 'both' && (
          <div>
            <span className="block text-[9px] font-mono uppercase tracking-widest text-neutral-400 text-center mb-2">BACK</span>
            <div className="w-72" style={{ backgroundColor: config?.back?.background || surface, color: config?.back?.textColor || primary }}>
              <div className="aspect-[1.75/1] p-5 flex flex-col justify-between">
                <div>
                  <p className="font-extrabold tracking-wider" style={{ fontFamily: headingFont }}>{companyName}</p>
                  <p className="text-xs mt-1 opacity-70">{title}</p>
                </div>
                <div className="text-[10px] font-mono space-y-0.5" style={{ color: config?.back?.accentColor || accent }}>
                  <p>{email}</p>
                  <p>{phone}</p>
                  <p>{website}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  const isBack = side === 'back';
  const bg = isBack ? config?.back?.background || primary : config?.front?.background || surface;
  const txt = isBack ? config?.back?.textColor || primary : primary;

  return (
    <div className="w-72 aspect-[1.75/1] p-5 flex flex-col justify-between border border-neutral-100 relative overflow-hidden" style={{ backgroundColor: bg, color: txt }}>
      <div className="flex justify-between items-start">
        <span className="font-extrabold tracking-wider text-xl" style={{ fontFamily: headingFont }}>{companyName}</span>
        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: accent }}></div>
      </div>
      <div className="space-y-1">
        <p className="text-sm font-bold" style={{ fontFamily: headingFont }}>{companyName}</p>
        <p className="text-[11px]" style={{ color: secondary, fontFamily: bodyFont }}>{title}</p>
      </div>
      <div className="text-[10px] font-mono space-y-0.5" style={{ color: secondary }}>
        <p>{email}</p>
        <p>{phone}</p>
        <p style={{ color: accent }}>{website}</p>
      </div>
    </div>
  );
}

function LetterheadFromConfig({ config }) {
  const { brand } = useBrand();
  const primary = config?.primaryColor || brand?.colors?.primary || '#0F172A';
  const accent = config?.accentColor || brand?.colors?.accent || '#738F80';
  const headingFont = config?.fontDisplay || brand?.typography?.display?.family || 'Syne, sans-serif';
  const companyName = brand?.companyName || brand?.company_name || 'NOVA';
  const tagline = config?.tagline || brand?.tagline || '';

  return (
    <div className="w-full max-w-lg aspect-[1/1.41] bg-white rounded-lg shadow-lg border border-neutral-200 p-8 flex flex-col relative overflow-hidden" style={{ color: primary }}>
      <div className="flex justify-between items-start border-b border-neutral-100 pb-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded flex items-center justify-center" style={{ backgroundColor: primary }}>
            <div className="w-4 h-0.5 bg-white"></div>
          </div>
          <div>
            <span className="font-bold tracking-wider text-sm uppercase block" style={{ fontFamily: headingFont }}>{companyName}</span>
            <span className="text-[8px] font-mono text-neutral-400">{tagline}</span>
          </div>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center opacity-[0.03] pointer-events-none absolute inset-0">
        <svg width="200" height="200" viewBox="0 0 48 48">
          <polygon points="24 4, 44 38, 4 38" fill={primary} />
        </svg>
      </div>
      <div className="space-y-3 z-10">
        <div className="w-3/4 h-2 rounded bg-neutral-200"></div>
        <div className="w-full h-1.5 rounded bg-neutral-100"></div>
        <div className="w-11/12 h-1.5 rounded bg-neutral-100"></div>
        <div className="w-full h-1.5 rounded bg-neutral-100"></div>
      </div>
      <div className="border-t-2 pt-4 flex justify-between items-center text-[8px] font-mono text-neutral-400" style={{ borderColor: accent }}>
        <span>CONFIDENTIAL</span>
        <span>{companyName.toUpperCase()}</span>
      </div>
    </div>
  );
}

function EnvelopeFromConfig({ config }) {
  const { brand } = useBrand();
  const primary = config?.primaryColor || brand?.colors?.primary || '#0F172A';
  const accent = config?.accentColor || brand?.colors?.accent || '#738F80';
  const companyName = brand?.companyName || brand?.company_name || 'NOVA';

  return (
    <div className="w-full max-w-2xl aspect-[9.5/4.125] bg-white rounded-lg shadow-lg border border-neutral-200 relative overflow-hidden flex flex-col justify-between p-6" style={{ color: primary }}>
      <div className="flex justify-between items-start">
        <div className="space-y-0.5">
          <div className="flex items-center space-x-2 mb-1">
            <div className="w-5 h-5 rounded flex items-center justify-center" style={{ backgroundColor: primary }}>
              <div className="w-2.5 h-0.5 bg-white"></div>
            </div>
            <span className="font-bold tracking-wider text-xs uppercase">{companyName}</span>
          </div>
          <div className="text-[8px] font-mono text-neutral-400 leading-tight">
            <p>100 MONTGOMERY ST. SUITE 2400</p>
            <p>SAN FRANCISCO, CA 94104</p>
          </div>
        </div>
        <div className="w-12 h-7 border border-dashed border-neutral-300 flex items-center justify-center text-[7px] font-mono text-neutral-400 uppercase">POSTAGE</div>
      </div>
      <div className="self-center w-48 h-2 bg-neutral-100 rounded-full overflow-hidden">
        <div className="h-full" style={{ width: '40%', backgroundColor: accent }}></div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-1" style={{ backgroundColor: accent }}></div>
    </div>
  );
}

function SocialAssetFromConfig({ config, type }) {
  const { brand } = useBrand();
  const bg = config?.background || brand?.colors?.primary || '#0F172A';
  const txt = config?.textColor || brand?.colors?.surface || '#FFFFFF';
  const accent = config?.accentColor || brand?.colors?.accent || '#738F80';
  const companyName = brand?.companyName || brand?.company_name || 'NOVA';
  const headline = config?.headline || brand?.tagline || '';
  const subhead = config?.subhead || brand?.coreMantra || '';

  const aspectClass = type === 'social_story' ? 'aspect-[9/16] max-h-[320px]' : type === 'social_banner' ? 'aspect-[3/1] max-h-[200px]' : 'aspect-square';

  return (
    <div className={`w-full ${aspectClass} p-6 rounded-xl flex flex-col justify-between border border-neutral-200 shadow-sm`} style={{ backgroundColor: bg, color: txt }}>
      <div className="flex justify-between items-center">
        <span className="font-black tracking-widest uppercase text-sm">{companyName}</span>
        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: accent }}></div>
      </div>
      <div className="space-y-1">
        <h4 className="text-xl font-bold leading-tight">{headline}</h4>
        <p className="text-xs opacity-70">{subhead}</p>
      </div>
      <div className="pt-3 border-t border-white/20 text-xs font-mono opacity-60">
        www.{companyName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com
      </div>
    </div>
  );
}
