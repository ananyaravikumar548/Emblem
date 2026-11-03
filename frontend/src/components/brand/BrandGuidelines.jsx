import React, { useState } from 'react';
import { ChevronDown, Package, Palette, ShieldCheck, Type } from 'lucide-react';
import { useBrand } from '../../context/BrandContext';
import { readableTextColor } from '../../lib/colorUtils';

const DEFAULT_COLORS = { primary: '#35202A', secondary: '#705B62', accent: '#C77B8F', surface: '#FBF7F4' };
const AUDIT_FILTERS = ['all', 'color', 'typography', 'logo'];

export const BrandGuidelines = () => {
  const { brand, complianceScore, exportKit, isExporting } = useBrand();
  const [activeTab, setActiveTab] = useState('all');
  const [copiedColor, setCopiedColor] = useState('');

  const companyName = brand?.companyName || brand?.company_name || 'Your brand';
  const tagline = brand?.tagline || 'A clear point of view.';
  const mission = brand?.missionStatement || brand?.mission || brand?.coreMantra || brand?.visual_style_description || 'A distinct point of view, carried consistently across every brand touchpoint.';
  const visualDirection = brand?.visualDirection || brand?.visual_style_description || '';
  const audience = brand?.targetAudience || brand?.audience || '';
  const industry = brand?.industry || '';
  const personality = Array.isArray(brand?.personality) ? brand.personality : (brand?.personality ? [brand.personality] : []);
  const keywords = Array.isArray(brand?.keywords) && brand.keywords.length ? brand.keywords : personality;
  const values = brand?.coreValues || brand?.values || [];
  const rationale = brand?.rationale || {};
  const colors = { ...DEFAULT_COLORS, ...(brand?.colors || {}) };
  colors.surface = brand?.colors?.surface || brand?.colors?.background || DEFAULT_COLORS.surface;
  const typography = brand?.typography || {};
  const headingFont = typography.display?.family || typography.heading_font || 'Plus Jakarta Sans';
  const bodyFont = typography.body?.family || typography.body_font || 'Inter';
  const monoFont = typography.mono?.family || 'IBM Plex Mono';
  const heroInk = readableTextColor('#fffaf8', colors.primary, '#251b1e');
  const heroButton = readableTextColor(colors.primary, heroInk, '#fffaf8');

  const report = complianceScore?.report || {};
  const totalScore = complianceScore?.total ?? null;
  const breakdown = complianceScore?.breakdown || {};
  const checks = Array.isArray(report.checks) ? report.checks : [];
  const filteredChecks = activeTab === 'all' ? checks : checks.filter(item => item.category === activeTab);
  const scoreLabel = score => Number.isFinite(score) ? `${score}%` : '—';
  const palette = [
    ['Primary', colors.primary],
    ['Secondary', colors.secondary],
    ['Accent', colors.accent],
    ['Surface', colors.surface],
  ];

  const copyColor = async (label, hex) => {
    try {
      await navigator.clipboard.writeText(hex);
      setCopiedColor(label);
      window.setTimeout(() => setCopiedColor(''), 1400);
    } catch (error) {
      setCopiedColor('');
    }
  };

  const scoreParts = [
    ['Color', report.colorScore ?? breakdown.contrast ?? null],
    ['Type', report.typographyScore ?? breakdown.typography ?? null],
    ['Logo', report.logoScore ?? breakdown.safetyZone ?? null],
  ];
  return (
    <div className="mx-auto max-w-7xl space-y-9 px-4 py-5 sm:px-7 sm:py-8 lg:px-10">
      <section aria-labelledby="kit-overview-heading" className="grid gap-7 rounded-[26px] px-6 py-7 sm:px-8 sm:py-9 lg:grid-cols-[.8fr_1.2fr] lg:items-center lg:gap-12 lg:px-10" style={{ backgroundColor: colors.primary, color: heroInk }}>
        <div>
          <p className="text-[9px] font-bold uppercase tracking-[.18em] opacity-70">Complete brand kit · {industry || 'Identity system'}</p>
          <h1 id="kit-overview-heading" className="mt-3 text-3xl font-semibold leading-tight tracking-[-.045em] sm:text-4xl">One download. Every brand essential.</h1>
          <p className="mt-3 max-w-lg text-sm leading-6 opacity-75">Your identity, tools, and standards are gathered and ready to use across every touchpoint.</p>
          <button type="button" onClick={exportKit} disabled={isExporting} className="mt-6 inline-flex h-12 items-center gap-2 rounded-full px-6 text-sm font-bold transition hover:-translate-y-0.5 disabled:opacity-60" style={{ backgroundColor: heroButton, color: readableTextColor(colors.primary, heroButton, '#fffaf8') }}><Package size={17} />{isExporting ? 'Preparing your kit…' : 'Download complete kit'}<span aria-hidden="true">↓</span></button>
        </div>
        <div className="grid gap-x-7 sm:grid-cols-2">
          {[
            ['Logo system', 'Primary, stacked, symbol, and light/dark SVGs'],
            ['Design tokens', 'Brand palette, typography, and CSS variables'],
            ['Digital templates', 'Copy-ready email signature and slide cover'],
            ['Brand standards', 'Strategy, visual rationale, and consistency report'],
            ['Social formats', 'Post, story, and banner dimensions'],
            ['Print specs', 'Business card, letterhead, and envelope details'],
          ].map(([title, detail], index) => <div key={title} className="flex gap-3 border-t border-current/20 py-3.5">
            <span className="font-mono text-[9px] opacity-65">0{index + 1}</span><div><p className="text-xs font-semibold">{title}</p><p className="mt-1 text-[10px] leading-4 opacity-70">{detail}</p></div>
          </div>)}
        </div>
      </section>

      <section aria-label="Brand consistency score" className="flex flex-col gap-4 border-b border-[#eadfdb] pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center text-[#8f4859]"><ShieldCheck size={18} /></span>
          <div><p className="text-[9px] font-semibold uppercase tracking-[.16em] text-[#a58d91]">Identity consistency</p><p className="mt-0.5 text-sm font-semibold text-[#332629]">{totalScore == null ? 'Your system is ready to review' : `${scoreLabel(totalScore)} consistency score`}</p></div>
        </div>
        <div className="grid grid-cols-3 gap-4 sm:min-w-[390px]">
          {scoreParts.map(([label, score]) => <div key={label}><div className="mb-1 flex items-center justify-between gap-2 text-[9px]"><span className="text-[#857679]">{label}</span><span className="font-mono text-[#6b2438]">{scoreLabel(score)}</span></div><div className="h-1 overflow-hidden rounded-full bg-[#eee5e2]"><div className="h-full rounded-full bg-[#8f4859]" style={{ width: `${Math.max(0, Math.min(100, score || 0))}%` }} /></div></div>)}
        </div>
      </section>

      <section aria-labelledby="brand-story-heading" className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div><p className="text-[9px] font-bold uppercase tracking-[.18em] text-[#8f4859]">01 / The foundation</p><h2 id="brand-story-heading" className="mt-1 text-2xl font-semibold tracking-[-.04em] text-[#302729]">What makes {companyName} distinct.</h2></div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#a08f91]">Strategy · character · audience</span>
        </div>
        <div className="grid gap-6 border-y border-[#eadfdb] py-5 lg:grid-cols-[1.1fr_.9fr] lg:gap-10">
          <div className="lg:border-r lg:border-[#eadfdb] lg:pr-10">
            <p className="text-[9px] font-semibold uppercase tracking-[.16em] text-[#a58d91]">The central idea</p>
            <blockquote className="mt-3 max-w-3xl text-xl font-medium leading-relaxed tracking-[-.02em] text-[#49383c] sm:text-2xl" style={{ fontFamily: headingFont }}>“{mission}”</blockquote>
            {visualDirection && <p className="mt-4 max-w-2xl text-xs leading-6 text-[#857679]">{visualDirection}</p>}
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:gap-7">
            <div><p className="text-[9px] font-semibold uppercase tracking-[.16em] text-[#a58d91]">Made for</p><p className="mt-2 text-sm font-medium leading-6 text-[#49383c]">{audience || 'An audience ready for a clearer point of view.'}</p><p className="mt-4 text-[9px] font-semibold uppercase tracking-[.16em] text-[#a58d91]">Industry</p><p className="mt-2 text-sm font-medium text-[#49383c]">{industry || 'Independent by design'}</p></div>
            <div><p className="text-[9px] font-semibold uppercase tracking-[.16em] text-[#a58d91]">Brand vocabulary</p><div className="mt-2 flex flex-wrap gap-x-2.5 gap-y-1.5">{(keywords.length ? keywords : ['Distinctive', 'Considered', 'Clear']).slice(0, 8).map((word, index) => <span key={`${word}-${index}`} className="text-xs text-[#67565a]">{word}{index < Math.min(keywords.length || 3, 8) - 1 ? <span className="ml-2.5 text-[#c5adb2]">/</span> : null}</span>)}</div>{values.length > 0 && <><p className="mt-5 text-[9px] font-semibold uppercase tracking-[.16em] text-[#a58d91]">Core values</p><div className="mt-2 space-y-1">{values.slice(0, 3).map((value, index) => <p key={index} className="text-xs text-[#49383c]">{typeof value === 'string' ? value : value.title}</p>)}</div></>}</div>
          </div>
        </div>
      </section>

      <section aria-labelledby="visual-system-heading" className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div><p className="text-[9px] font-bold uppercase tracking-[.18em] text-[#8f4859]">02 / The visual language</p><h2 id="visual-system-heading" className="mt-1 text-2xl font-semibold tracking-[-.04em] text-[#302729]">A system with its own point of view.</h2></div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#a08f91]">Color · type · mark</span>
        </div>
        <div className="grid gap-7 border-y border-[#eadfdb] py-5 lg:grid-cols-[1.1fr_.9fr] lg:gap-10">
          <div className="lg:border-r lg:border-[#eadfdb] lg:pr-10">
            <div className="flex items-end justify-between gap-3"><div><p className="text-[9px] font-semibold uppercase tracking-[.16em] text-[#a58d91]">Color palette</p><p className="mt-1 text-xs text-[#857679]">Tap any color to copy its value.</p></div><Palette size={17} className="text-[#a2707d]" /></div>
            <div className="mt-4 grid grid-cols-4 gap-2 sm:gap-3">
              {palette.map(([label, hex]) => <button key={label} type="button" onClick={() => copyColor(label, hex)} aria-label={`Copy ${label} color ${hex}`} className="group min-w-0 text-left">
                <span className="block h-20 rounded-xl transition group-hover:-translate-y-0.5 sm:h-28" style={{ backgroundColor: hex, boxShadow: label === 'Surface' ? 'inset 0 0 0 1px rgba(40,20,25,.08)' : 'none' }} />
                <span className="mt-2 block truncate text-[9px] font-semibold text-[#49383c] sm:text-[10px]">{copiedColor === label ? 'Copied' : label}</span><span className="mt-0.5 block truncate font-mono text-[8px] text-[#918184] sm:text-[9px]">{hex.toUpperCase()}</span>
              </button>)}
            </div>
            {rationale.colors && <p className="mt-4 border-t border-[#f0e8e5] pt-3 text-[10px] leading-5 text-[#857679]">{rationale.colors}</p>}
          </div>
          <div>
            <div className="flex items-end justify-between gap-3"><div><p className="text-[9px] font-semibold uppercase tracking-[.16em] text-[#a58d91]">Typography</p><p className="mt-1 text-xs text-[#857679]">A pairing that carries the voice.</p></div><Type size={17} className="text-[#a2707d]" /></div>
            <div className="mt-5 border-b border-[#f0e8e5] pb-4"><p className="text-[8px] font-semibold uppercase tracking-[.16em] text-[#a58d91]">Display · {headingFont}</p><p className="mt-2 text-3xl font-semibold leading-tight tracking-[-.04em] text-[#332629] sm:text-4xl" style={{ fontFamily: headingFont }}>{companyName}</p></div>
            <div className="py-4"><p className="text-[8px] font-semibold uppercase tracking-[.16em] text-[#a58d91]">Body · {bodyFont}</p><p className="mt-2 text-sm leading-6 text-[#67595c]" style={{ fontFamily: bodyFont }}>{tagline} {visualDirection && ` ${visualDirection}`}</p></div>
            <div className="border-t border-[#f0e8e5] pt-3"><p className="font-mono text-[8px] uppercase tracking-[.16em] text-[#a58d91]">Utility · {monoFont}</p><p className="mt-1 font-mono text-[10px] text-[#67595c]">Aa 0123456789 · #8F4859 · 01/04</p></div>
            {rationale.typography && <p className="mt-4 text-[10px] leading-5 text-[#857679]">{rationale.typography}</p>}
          </div>
        </div>
      </section>

      <section aria-labelledby="usage-rules-heading" className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div><p className="text-[9px] font-bold uppercase tracking-[.18em] text-[#8f4859]">03 / Using the identity</p><h2 id="usage-rules-heading" className="mt-1 text-2xl font-semibold tracking-[-.04em] text-[#302729]">Keep every touchpoint unmistakably {companyName}.</h2></div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#a08f91]">A quick field guide</span>
        </div>
        <div className="grid gap-x-8 sm:grid-cols-3 sm:border-y sm:border-[#eadfdb]">
          {[
            ['Logo', 'Use the supplied SVG lockups. Keep the full clear space around the mark, preserve its proportions, and select the light or dark version for contrast.', 'Avoid stretching, recoloring, or adding effects.'],
            ['Color', `Lead with ${colors.primary} for recognition. Use ${colors.accent} as a focused accent, and keep text contrast strong on ${colors.surface}.`, 'Avoid using every palette color at equal weight.'],
            ['Typography', `Use ${headingFont} for headlines and ${bodyFont} for readable supporting copy. Reserve ${monoFont} for labels, specs, and compact metadata.`, 'Avoid mixing in unapproved typefaces.'],
          ].map(([title, guidance, avoid], index) => <article key={title} className="border-t border-[#eadfdb] py-4 sm:border-t-0 sm:py-5">
            <p className="font-mono text-[9px] text-[#a2707d]">0{index + 1} / {title}</p><p className="mt-2 text-xs leading-5 text-[#67595c]">{guidance}</p><p className="mt-3 text-[10px] leading-4 text-[#8f4859]"><span className="font-semibold">Avoid</span> · {avoid}</p>
          </article>)}
        </div>
      </section>

      <details className="group border-t border-[#eadfdb] pt-5">
        <summary className="flex cursor-pointer list-none flex-wrap items-center justify-between gap-3 [&::-webkit-details-marker]:hidden">
          <div className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f5e9eb] text-[#8f4859]"><ShieldCheck size={17} /></span><div><p className="text-[9px] font-semibold uppercase tracking-[.16em] text-[#a58d91]">Quality assurance</p><h2 className="mt-0.5 text-base font-semibold text-[#332629]">Brand consistency audit <span className="ml-1 font-mono text-xs font-medium text-[#8f4859]">{scoreLabel(totalScore)}</span></h2></div></div>
          <ChevronDown size={17} className="text-[#a18e92] transition group-open:rotate-180" />
        </summary>
        <div className="mt-5 grid gap-6 lg:grid-cols-[.7fr_1.3fr]">
          <div className="space-y-4">
            {scoreParts.map(([label, score]) => <div key={label}><div className="mb-1 flex justify-between text-[10px]"><span className="font-medium text-[#67595c]">{label} consistency</span><span className="font-mono text-[#8f4859]">{scoreLabel(score)}</span></div><div className="h-1.5 overflow-hidden rounded-full bg-[#eee5e2]"><div className="h-full rounded-full bg-[#8f4859]" style={{ width: `${Math.max(0, Math.min(100, score || 0))}%` }} /></div></div>)}
          </div>
          <div>
            <div className="mb-3 flex flex-wrap gap-1 border-b border-[#eadfdb]">{AUDIT_FILTERS.map(tab => <button key={tab} type="button" onClick={() => setActiveTab(tab)} aria-pressed={activeTab === tab} className={`px-3 py-2 text-[9px] font-semibold uppercase tracking-wider transition ${activeTab === tab ? 'border-b-2 border-[#8f4859] text-[#6b2438]' : 'text-[#918184] hover:text-[#49383c]'}`}>{tab}</button>)}</div>
            {filteredChecks.length ? <div className="divide-y divide-[#f0e8e5]">{filteredChecks.map((item, index) => <div key={`${item.rule}-${index}`} className="flex gap-3 py-3"><span className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[9px] ${item.passed ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>{item.passed ? '✓' : '!'}</span><div className="min-w-0"><p className="text-[11px] font-semibold text-[#49383c]">{item.rule}</p><p className="mt-1 text-[10px] leading-4 text-[#857679]">{item.detail}</p></div><span className="ml-auto shrink-0 text-[8px] font-semibold uppercase tracking-wider text-[#a18e92]">{item.category}</span></div>)}</div> : <p className="py-5 text-xs text-[#857679]">No audit results yet. Your identity files are still ready in the brand kit.</p>}
          </div>
        </div>
      </details>
    </div>
  );
};

export default BrandGuidelines;
