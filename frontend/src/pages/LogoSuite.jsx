import React, { useMemo, useState } from 'react';
import { ArrowDownToLine, Check, CircleHelp, Eye, LayoutTemplate, PanelsTopLeft, Sparkles } from 'lucide-react';
import { useBrand } from '../context/BrandContext';
import { buildBrandLogos, downloadSvg, getMarkOptions } from '../lib/vectorEngine';

const LOGO_FORMATS = [
  { id: 'primary', name: 'Primary', detail: 'Horizontal lockup', use: 'Headers, presentations, and signatures.', icon: PanelsTopLeft },
  { id: 'stacked', name: 'Stacked', detail: 'Centered lockup', use: 'Covers, square layouts, and compact spaces.', icon: LayoutTemplate },
  { id: 'mark', name: 'Symbol', detail: 'Mark only', use: 'Avatars, app tiles, and small brand moments.', icon: Sparkles },
];

const COLORWAYS = [
  { id: 'monoLight', name: 'Ink', detail: 'For light surfaces', background: '#fff', color: '#171516', slug: 'ink' },
  { id: 'monoDark', name: 'Reverse', detail: 'For dark surfaces', background: '#21191b', color: '#fff', slug: 'reverse' },
];

function LogoPreview({ svg, className = '', style }) {
  return <div className={`logo-svg-preview ${className}`} style={style} dangerouslySetInnerHTML={{ __html: svg }} />;
}

export const LogoSuite = () => {
  const { brand, applyBrandDirection, isApplyingDirection } = useBrand();
  const [selectedId, setSelectedId] = useState('primary');
  const [showGuides, setShowGuides] = useState(false);
  const [markError, setMarkError] = useState('');
  const companyName = brand?.companyName || brand?.company_name || 'Your brand';
  const colors = brand?.colors || {};
  const primaryColor = colors.primary || '#6B2438';
  const accentColor = colors.accent || '#C77B8F';
  const typography = brand?.typography || {};
  const logos = useMemo(() => buildBrandLogos(brand), [brand]);
  const previewWidth = Math.min(600, Math.max(250, logos.lockupWidth * 1.12));
  const colorwayWidth = Math.min(460, Math.max(220, logos.lockupWidth * 1.05));
  const markOptions = getMarkOptions(brand?.logoStyleToken || 'minimal');
  const selected = LOGO_FORMATS.find((item) => item.id === selectedId) || LOGO_FORMATS[0];

  const handleDownload = (id, slug) => {
    const safeName = companyName.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'brand';
    downloadSvg(logos[id], `${safeName}-${slug}.svg`);
  };

  const chooseMark = async (logoMarkId) => {
    setMarkError('');
    try {
      await applyBrandDirection({
        id: brand?.designDirection || `custom-${brand?.logoStyleToken || 'minimal'}`,
        colors,
        typography,
        logoStyleToken: brand?.logoStyleToken || 'minimal',
        logoMarkId
      });
    } catch (error) {
      setMarkError(error.message || 'Could not apply this logo mark.');
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-5 sm:px-7 sm:py-7 lg:px-10">
      <header className="flex flex-col gap-4 border-b border-[#eadfdb] pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[.18em] text-[#987c82]">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: accentColor }} /> Brand identity <span className="text-[#d1c3c0]">/</span> Logo system
          </div>
          <h1 className="text-3xl font-semibold tracking-[-.04em] text-[#241b1d] sm:text-4xl">A mark for every moment.</h1>
          <p className="mt-1.5 max-w-2xl text-sm leading-6 text-[#786b6d]">Choose a format for <strong className="font-semibold text-[#44373a]">{companyName}</strong>, preview it, then download the version you need.</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-[#8e7c80]"><span className="h-2 w-2 rounded-full" style={{ backgroundColor: accentColor }} /> One identity, three useful formats</div>
      </header>

      <section aria-labelledby="logo-formats-heading" className="space-y-3">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div><p className="text-[10px] font-semibold uppercase tracking-[.16em] text-[#a58d91]">01 / Choose a format</p><h2 id="logo-formats-heading" className="mt-1 text-xl font-semibold tracking-[-.03em] text-[#332629]">Your logo family</h2></div>
          <span className="text-xs text-[#928286]">Select a version to see it in detail</span>
        </div>
        <div className="flex flex-col divide-y divide-[#eadfdb] border-y border-[#eadfdb] sm:flex-row sm:divide-x sm:divide-y-0">
          {LOGO_FORMATS.map((item, index) => {
            const Icon = item.icon;
            const active = selectedId === item.id;
            return <button key={item.id} type="button" onClick={() => setSelectedId(item.id)} aria-pressed={active} className={`group relative flex flex-1 items-start gap-3 px-3 py-3.5 text-left transition sm:px-5 ${active ? 'bg-[#fbf5f5]' : 'hover:bg-[#fcfaf9]'}`}>
              <Icon size={17} className={`mt-0.5 shrink-0 ${active ? 'text-[#8d4356]' : 'text-[#a18e92]'}`} />
              <span className="min-w-0 flex-1"><span className="flex items-center justify-between gap-2"><span className={`text-sm font-semibold ${active ? 'text-[#392d30]' : 'text-[#67595c]'}`}>{item.name}</span>{active && <Check size={15} className="shrink-0 text-[#8d4356]" />}</span><span className="mt-0.5 block text-[9px] font-semibold uppercase tracking-wider text-[#a18e92]">{String(index + 1).padStart(2, '0')} · {item.detail}</span><span className="mt-1.5 block text-[10px] leading-4 text-[#857679]">{item.use}</span></span>
              {active && <span className="absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-[#8d4356] sm:inset-x-5" />}
            </button>;
          })}
        </div>
      </section>

      <section aria-label="Logo anatomy and selected preview" className="overflow-hidden rounded-[26px] border border-[#eadfdb] bg-white shadow-[0_12px_40px_rgba(66,37,42,.055)]">
      <div className="grid items-stretch lg:grid-cols-[minmax(270px,.82fr)_minmax(0,1.38fr)]">
      <div aria-labelledby="logo-anatomy-heading" className="border-b border-[#f0e8e5] lg:border-b-0 lg:border-r">
        <div className="px-5 py-4 sm:px-6">
          <p className="text-[10px] font-semibold uppercase tracking-[.16em] text-[#a58d91]">02 / Logo anatomy</p>
          <h2 id="logo-anatomy-heading" className="mt-1 text-lg font-semibold tracking-[-.025em] text-[#332629]">Built in considered parts.</h2>
          <p className="mt-1 text-xs leading-5 text-[#857679]">The primary lockup, mapped on a simple construction grid.</p>
        </div>
        <div className="relative mx-4 flex min-h-[190px] items-center justify-center overflow-hidden bg-[#faf7f4] px-5 py-8 sm:mx-5 sm:min-h-[220px]" style={{ backgroundImage: 'linear-gradient(rgba(141,67,86,.055) 1px, transparent 1px), linear-gradient(90deg, rgba(141,67,86,.055) 1px, transparent 1px)', backgroundSize: '22px 22px' }}>
          <div className="pointer-events-none absolute inset-4 border border-dashed border-[#c9aab1]" />
          <span className="absolute left-5 top-3 bg-[#faf7f4] px-2 text-[8px] font-semibold uppercase tracking-[.12em] text-[#a2707d]">1× safe area</span>
          <span className="absolute right-5 top-3 font-mono text-[8px] uppercase tracking-wider text-[#b29da1]">Grid / 8 pt</span>
          <LogoPreview svg={logos.primary} style={{ maxWidth: Math.min(330, Math.max(190, logos.lockupWidth * 0.82)) }} className="relative z-10 w-full" />
          <span className="absolute bottom-2 right-3 font-mono text-[8px] text-[#a18e92]">LOCKUP / 01</span>
        </div>
        <div className="flex items-center justify-around gap-2 px-4 py-3 sm:px-5">
          {[['01', 'Symbol'], ['02', 'Wordmark'], ['03', 'Tagline']].map(([number, label], index) => <React.Fragment key={number}><div className="min-w-0"><span className="font-mono text-[8px] font-semibold text-[#a2707d]">{number}</span><p className="mt-0.5 truncate text-[10px] font-semibold text-[#49383c] sm:text-xs">{label}</p></div>{index < 2 && <span className="h-px flex-1 bg-[#eadfdb]" />}</React.Fragment>)}
        </div>
      </div>

      <div aria-labelledby="selected-logo-heading" className="min-w-0">
        <div className="flex flex-col gap-3 border-b border-[#f0e8e5] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-7">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[.16em] text-[#a58d91]">03 / Selected logo</p>
            <h2 id="selected-logo-heading" className="mt-1 text-lg font-semibold text-[#332629]">{selected.name} <span className="font-normal text-[#a09092]">· {selected.detail}</span></h2>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button type="button" onClick={() => setShowGuides((value) => !value)} aria-pressed={showGuides} className={`inline-flex h-10 items-center gap-2 rounded-xl border px-3.5 text-xs font-medium transition ${showGuides ? 'border-[#6b2438] bg-[#f8eff0] text-[#6b2438]' : 'border-[#e7dcd8] bg-white text-[#534548] hover:border-[#cdaeb5]'}`}>
              <Eye size={15} strokeWidth={1.8} /> {showGuides ? 'Hide clear space' : 'Show clear space'}
            </button>
            <button type="button" onClick={() => handleDownload(selected.id, selected.id)} className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#6b2438] px-4 text-xs font-semibold text-white shadow-sm transition hover:bg-[#55202f]">
              <ArrowDownToLine size={15} /> Download SVG
            </button>
          </div>
        </div>

        <div className={`logo-system-canvas relative flex min-h-[230px] items-center justify-center overflow-hidden px-5 py-8 sm:min-h-[280px] sm:px-8 ${selected.id === 'mark' ? 'logo-system-canvas--dots' : ''}`}>
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(199,123,143,.12),transparent_64%)]" />
          {showGuides && <div className="pointer-events-none absolute inset-x-[8%] inset-y-[17%] rounded-2xl border border-dashed border-[#bb8491]" aria-hidden="true"><span className="absolute -top-2.5 left-3 bg-[#fbf8f6] px-2 text-[9px] font-semibold uppercase tracking-wider text-[#9a6875]">Clear space guide</span></div>}
          <LogoPreview svg={logos[selected.id]} style={selected.id === 'primary' ? { maxWidth: previewWidth } : undefined} className={`relative z-10 ${selected.id === 'mark' ? 'w-32 sm:w-36' : selected.id === 'stacked' ? 'w-full max-w-[240px]' : 'w-full'}`} />
        </div>

        <div className="flex flex-col gap-3 border-t border-[#f0e8e5] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-7">
          <p className="max-w-2xl text-sm leading-6 text-[#76686b]">{selected.use}</p>
          <span className="inline-flex shrink-0 items-center gap-2 text-xs font-medium text-[#8e7c80]"><Check size={15} className="text-[#9c6372]" /> Vector SVG · scales cleanly</span>
        </div>
      </div>
      </div>
      </section>

      <section aria-labelledby="logo-colorways-heading" className="space-y-3">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div><p className="text-[10px] font-semibold uppercase tracking-[.16em] text-[#a58d91]">04 / Color versions</p><h2 id="logo-colorways-heading" className="mt-1 text-xl font-semibold tracking-[-.03em] text-[#332629]">Ready for light or dark surfaces</h2></div>
          <span className="text-xs text-[#928286]">Transparent, one-color SVGs</span>
        </div>
        <div className="grid overflow-hidden border-y border-[#eadfdb] md:grid-cols-2 md:divide-x md:divide-[#eadfdb]">
          {COLORWAYS.map((way) => <div key={way.id} className="min-w-0">
            <div className="flex items-center justify-between gap-3 py-3 md:px-4">
              <div><h3 className="text-sm font-semibold text-[#3d3033]">{way.name}</h3><p className="mt-0.5 text-[11px] text-[#918184]">{way.detail} · {way.color}</p></div>
              <button type="button" onClick={() => handleDownload(way.id, way.slug)} aria-label={`Download ${way.name.toLowerCase()} logo SVG`} className="inline-flex items-center gap-1.5 px-2 py-2 text-xs font-semibold text-[#6b2438] transition hover:text-[#3f1625]"><ArrowDownToLine size={14} /> SVG</button>
            </div>
            <div className="flex min-h-[130px] items-center justify-center overflow-hidden px-5 py-5" style={{ backgroundColor: way.background }}>
              <LogoPreview svg={logos[way.id]} style={{ maxWidth: colorwayWidth }} className="w-full" />
            </div>
            <p className="py-2 text-[10px] text-[#8c7a7e] md:px-4">Use on {way.id === 'monoLight' ? 'light' : 'dark'} surfaces</p>
          </div>)}
        </div>
      </section>

      <section aria-labelledby="mark-options-heading" className="space-y-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[.16em] text-[#a58d91]">05 / Fine-tune the symbol</p>
          <h2 id="mark-options-heading" className="mt-1 text-xl font-semibold tracking-[-.03em] text-[#332629]">Explore mark concepts</h2>
          <p className="mt-1 text-sm text-[#786b6d]">Choose another symbol from the same visual direction. Your logo formats update with it.</p>
        </div>
        {markError && <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-800">{markError}</p>}
        <div className="grid divide-y divide-[#eadfdb] border-y border-[#eadfdb] sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {markOptions.map((option, index) => {
            const active = (brand?.logoMarkId && brand.logoMarkId === option.id) || (!brand?.logoMarkId && logos.markPath === option.svg);
            return <button key={option.id} type="button" onClick={() => chooseMark(option.id)} disabled={isApplyingDirection} aria-pressed={active} className={`group flex items-center gap-3 px-3 py-3 text-left transition sm:px-4 ${active ? 'bg-[#fbf5f5]' : 'hover:bg-[#fcfaf9]'}`}>
              <span className="flex h-12 w-12 shrink-0 items-center justify-center"><svg aria-hidden="true" viewBox="0 0 48 48" className="h-10 w-10" style={{ color: primaryColor }}><g>{option.svg}</g></svg></span>
              <span className="min-w-0 flex-1"><span className="flex items-center justify-between gap-2"><span className="text-xs font-semibold text-[#392d30]">Concept {String(index + 1).padStart(2, '0')}</span>{active && <Check size={14} className="text-[#8d4356]" />}</span><span className="mt-1 block truncate text-[10px] text-[#857679]">{option.id.replace(/_/g, ' ')}</span><span className="mt-1 block text-[8px] font-semibold uppercase tracking-wider text-[#a18e92]">{active ? 'Selected' : isApplyingDirection ? 'Saving…' : 'Select symbol'}</span></span>
            </button>;
          })}
        </div>
      </section>

      <footer className="flex flex-col gap-4 border-t border-[#eadfdb] pt-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2.5 text-[#8d4356]"><CircleHelp size={16} className="mt-0.5 shrink-0" /><p className="max-w-2xl text-[11px] leading-5 text-[#857679]">Leave clear space around the logo equal to the symbol’s width. Use the mark on its own only when people already recognize your brand. Minimum size: 15 mm in print, 24 px on screen.</p></div>
        <div className="flex shrink-0 flex-wrap items-center gap-4 text-[10px] text-[#786b6d]"><span className="inline-flex items-center gap-1.5"><i className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: primaryColor }} />Primary <strong className="font-mono font-medium">{primaryColor}</strong></span><span className="inline-flex items-center gap-1.5"><i className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: accentColor }} />Accent <strong className="font-mono font-medium">{accentColor}</strong></span></div>
      </footer>
    </div>
  );
};

export default LogoSuite;
