import React, { useMemo, useState } from 'react';
import { Check, ChevronDown, FileImage, Search, Sparkles, X } from 'lucide-react';
import { useBrand } from '../context/BrandContext';
import { useCollateral, filterCollateral } from '../hooks/useCollateral';
import { getMarkSvgPath } from '../lib/vectorEngine';

const DEFAULT_COLORS = { primary: '#0F172A', secondary: '#1E293B', accent: '#738F80', surface: '#F8FAFC' };
const FILTERS = ['All', 'Print', 'Digital'];

const escapeXml = (value = '') => String(value).replace(/[<>&"']/g, (char) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&apos;' }[char]));

function colorLuminance(hex) {
  const channels = [1, 3, 5].map((offset) => parseInt(hex.slice(offset, offset + 2), 16) / 255)
    .map((value) => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

function contrastRatio(a, b) {
  const first = colorLuminance(a);
  const second = colorLuminance(b);
  return (Math.max(first, second) + 0.05) / (Math.min(first, second) + 0.05);
}

function readableTextColor(preferred, background, fallback) {
  if (contrastRatio(preferred, background) >= 4.5) return preferred;
  return [fallback, '#FFFFFF', '#171313'].sort((a, b) => contrastRatio(b, background) - contrastRatio(a, background))[0];
}

function makeCollateralSvg(brand, item, side = 'front') {
  const name = escapeXml(brand.companyName || brand.company_name || 'EMBLEM');
  const tagline = escapeXml(brand.tagline || 'A clear point of view.');
  const colors = { ...DEFAULT_COLORS, ...(brand.colors || {}) };
  colors.surface = brand.colors?.surface || brand.colors?.background || DEFAULT_COLORS.surface;
  const primaryOnSurface = readableTextColor(colors.primary, colors.surface, '#171313');
  const surfaceOnPrimary = readableTextColor(colors.surface, colors.primary, '#FFFFFF');
  const accentOnPrimary = readableTextColor(colors.accent, colors.primary, colors.surface);
  const accentOnSurface = readableTextColor(colors.accent, colors.surface, colors.primary);
  const secondaryOnSurface = readableTextColor(colors.secondary, colors.surface, colors.primary);
  const type = item.type;
  const specs = {
    business_card: [side === 'both' ? 2100 : 1050, 600],
    letterhead: [2480, 3508],
    envelope: [2280, 990],
    social_post: [1080, 1080],
    social_story: [1080, 1920],
    social_banner: [1500, 500],
    email_signature: [640, 200],
    presentation: [1920, 1080]
  };
  const [width, height] = specs[type] || [1200, 800];
  const svgText = (x, y, text, size, fill, weight = 500, extra = '') => `<text x="${x}" y="${y}" font-family="Arial, sans-serif" font-size="${size}" font-weight="${weight}" fill="${fill}" ${extra}>${text}</text>`;
  const mark = getMarkSvgPath(brand.logoStyleToken || 'tech', name);
  let body = '';

  if (type === 'business_card') {
    const card = (x, back = false) => `<g transform="translate(${x},0)"><rect width="1050" height="600" fill="${back ? colors.surface : colors.primary}"/>${back ? svgText(72, 145, name, 54, primaryOnSurface, 700) + svgText(72, 205, 'CREATIVE DIRECTOR', 23, secondaryOnSurface, 500, 'letter-spacing="3"') + svgText(72, 385, `hello@${name.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`, 26, primaryOnSurface) + svgText(72, 440, `www.${name.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`, 26, accentOnSurface) : `<g transform="translate(76,74) scale(4)" style="color:${accentOnPrimary}">${mark}</g>${svgText(280, 315, name, 78, surfaceOnPrimary, 700, 'letter-spacing="5"')}${svgText(284, 370, tagline, 24, accentOnPrimary, 500, 'letter-spacing="2"')}`}</g>`;
    body = side === 'both' ? `${card(0)}${card(1050, true)}` : card(0, side === 'back');
  } else if (type === 'letterhead') {
    body = `<rect width="100%" height="100%" fill="${colors.surface}"/><rect x="100" y="100" width="16" height="${height - 200}" fill="${colors.accent}"/><g transform="translate(170,140) scale(2)" style="color:${primaryOnSurface}">${mark}</g>${svgText(300, 230, name, 78, primaryOnSurface, 700, 'letter-spacing="4"')}${svgText(300, 290, tagline, 27, secondaryOnSurface)}<line x1="170" y1="390" x2="${width - 170}" y2="390" stroke="${colors.accent}" stroke-width="5"/><rect x="170" y="620" width="1320" height="24" rx="12" fill="#DDE2E6"/><rect x="170" y="690" width="2050" height="16" rx="8" fill="#E8EBED"/><rect x="170" y="745" width="1980" height="16" rx="8" fill="#E8EBED"/><rect x="170" y="800" width="1850" height="16" rx="8" fill="#E8EBED"/><line x1="170" y1="${height - 240}" x2="${width - 170}" y2="${height - 240}" stroke="${colors.accent}" stroke-width="4"/>${svgText(170, height - 165, tagline, 22, secondaryOnSurface)}${svgText(width - 170, height - 165, name, 22, primaryOnSurface, 700, 'text-anchor="end"')}`;
  } else if (type === 'envelope') {
    body = `<rect width="100%" height="100%" fill="${colors.surface}"/><path d="M0 0 L${width / 2} ${height * 0.68} L${width} 0" fill="none" stroke="${colors.accent}" stroke-width="8"/><rect x="0" y="0" width="20" height="100%" fill="${colors.primary}"/>${svgText(100, 205, name, 48, primaryOnSurface, 700, 'letter-spacing="4"')}${svgText(100, 258, tagline, 22, secondaryOnSurface)}${svgText(width - 100, height - 120, 'BUSINESS REPLY', 18, accentOnSurface, 700, 'text-anchor="end" letter-spacing="4"')}`;
  } else if (type === 'email_signature') {
    const email = escapeXml(`hello@${name.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`);
    const website = escapeXml(`www.${name.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`);
    body = `<rect width="100%" height="100%" rx="18" fill="${colors.surface}"/><rect width="12" height="100%" rx="6" fill="${colors.accent}"/><rect x="40" y="42" width="116" height="116" rx="26" fill="${colors.primary}"/><g transform="translate(74,76) scale(1.4)" style="color:${accentOnPrimary}">${mark}</g><line x1="184" y1="36" x2="184" y2="164" stroke="${colors.accent}" stroke-width="3"/><text x="218" y="72" font-family="Arial,sans-serif" font-size="27" font-weight="700" fill="${colors.primary}">Alex Morgan</text><text x="218" y="101" font-family="Arial,sans-serif" font-size="15" fill="${secondaryOnSurface}">Brand &amp; Communications</text><text x="218" y="133" font-family="Arial,sans-serif" font-size="14" fill="${colors.primary}">${email}</text><text x="218" y="157" font-family="Arial,sans-serif" font-size="14" fill="${accentOnSurface}">${website}</text><text x="600" y="67" text-anchor="end" font-family="Arial,sans-serif" font-size="13" font-weight="700" letter-spacing="2" fill="${colors.primary}">${name}</text><text x="600" y="91" text-anchor="end" font-family="Arial,sans-serif" font-size="10" letter-spacing="1" fill="${secondaryOnSurface}">${tagline}</text>`;
  } else if (type === 'presentation') {
    const headline = escapeXml(brand.coreMantra || brand.tagline || 'A clearer way forward.');
    body = `<rect width="100%" height="100%" fill="${colors.surface}"/><rect x="0" y="0" width="700" height="1080" fill="${colors.primary}"/><circle cx="1610" cy="170" r="500" fill="${colors.accent}" opacity=".12"/><circle cx="1660" cy="180" r="340" fill="${colors.accent}" opacity=".12"/><rect x="110" y="112" width="112" height="112" rx="28" fill="${colors.accent}"/><g transform="translate(140,142) scale(1.6)" style="color:${colors.primary}">${mark}</g>${svgText(110, 390, name, 44, surfaceOnPrimary, 700, 'letter-spacing="5"')}${svgText(110, 445, 'BRAND PRESENTATION', 18, accentOnPrimary, 700, 'letter-spacing="4"')}${svgText(840, 500, headline, 74, colors.primary, 700)}<line x1="840" y1="610" x2="1630" y2="610" stroke="${colors.accent}" stroke-width="8"/>${svgText(840, 710, tagline, 30, secondaryOnSurface)}${svgText(840, 980, 'A BRAND OVERVIEW', 18, secondaryOnSurface, 700, 'letter-spacing="4"')}${svgText(1760, 980, '01 / 12', 18, colors.primary, 700, 'text-anchor="end" letter-spacing="2"')}`;
  } else {
    const isStory = type === 'social_story';
    const isBanner = type === 'social_banner';
    const titleSize = isBanner ? 56 : isStory ? 76 : 62;
    const left = isBanner ? 90 : isStory ? 95 : 100;
    const top = isBanner ? 210 : isStory ? 830 : 650;
    body = `<rect width="100%" height="100%" fill="${type === 'social_story' ? colors.surface : colors.primary}"/><circle cx="${width * 0.88}" cy="${height * 0.18}" r="${Math.min(width, height) * 0.23}" fill="${colors.accent}" opacity=".18"/><rect x="${left}" y="${isBanner ? 72 : 110}" width="${isBanner ? 105 : 92}" height="${isBanner ? 105 : 92}" rx="24" fill="${colors.accent}"/><g transform="translate(${left + (isBanner ? 26 : 22)},${(isBanner ? 72 : 110) + (isBanner ? 26 : 22)}) scale(1.05)" style="color:${type === 'social_story' ? primaryOnSurface : surfaceOnPrimary}">${mark}</g>${svgText(left, top, name, isBanner ? 42 : 32, type === 'social_story' ? accentOnSurface : accentOnPrimary, 700, 'letter-spacing="5"')}${svgText(left, top + titleSize + 28, tagline, titleSize, type === 'social_story' ? primaryOnSurface : surfaceOnPrimary, 700)}<rect x="${left}" y="${height - (isBanner ? 90 : 150)}" width="${isBanner ? 220 : 260}" height="8" rx="4" fill="${colors.accent}"/>`;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">${body}</svg>`;
}

function BrandMark({ brand, size = 38, inverse = false }) {
  const colors = { ...DEFAULT_COLORS, ...(brand.colors || {}) };
  colors.surface = brand.colors?.surface || brand.colors?.background || DEFAULT_COLORS.surface;
  const background = inverse ? colors.surface : colors.primary;
  const markColor = readableTextColor(inverse ? colors.primary : colors.accent, background, inverse ? colors.primary : colors.surface);
  const mark = getMarkSvgPath(brand.logoStyleToken || 'tech', brand.companyName || brand.company_name || 'EMBLEM');
  return <span className="inline-flex shrink-0 items-center justify-center rounded-xl" style={{ width: size, height: size, backgroundColor: background, color: markColor }}><svg width={size * 0.56} height={size * 0.56} viewBox="0 0 48 48" dangerouslySetInnerHTML={{ __html: mark }} /></span>;
}

function AssetArtwork({ brand, item, side }) {
  const colors = { ...DEFAULT_COLORS, ...(brand.colors || {}) };
  colors.surface = brand.colors?.surface || brand.colors?.background || DEFAULT_COLORS.surface;
  const primaryOnSurface = readableTextColor(colors.primary, colors.surface, '#171313');
  const surfaceOnPrimary = readableTextColor(colors.surface, colors.primary, '#FFFFFF');
  const accentOnPrimary = readableTextColor(colors.accent, colors.primary, colors.surface);
  const accentOnSurface = readableTextColor(colors.accent, colors.surface, colors.primary);
  const secondaryOnSurface = readableTextColor(colors.secondary, colors.surface, colors.primary);
  const companyName = brand.companyName || brand.company_name || 'EMBLEM';
  const title = item.svgOrConfig?.headline || brand.coreMantra || brand.tagline || 'A clearer way forward.';
  if (item.type === 'business_card') {
    const Card = ({ back = false }) => <article className="relative flex aspect-[1.75/1] w-full max-w-[420px] flex-col justify-between overflow-hidden rounded-2xl border border-black/5 p-6 shadow-2xl sm:p-8" style={{ backgroundColor: back ? colors.surface : colors.primary, color: back ? primaryOnSurface : surfaceOnPrimary }}>
      <div className="absolute -right-10 -top-14 h-44 w-44 rounded-full blur-3xl" style={{ backgroundColor: `${colors.accent}35` }} />
      <div className="relative flex items-start justify-between">
        {back ? <div><p className="text-lg font-bold" style={{ fontFamily: brand.typography?.display?.family }}>{companyName}</p><p className="mt-1 text-xs opacity-65">Creative Director</p></div> : <BrandMark brand={brand} size={38} inverse />}
        <span className="font-mono text-[9px] uppercase tracking-[.22em] opacity-45">{back ? 'Contact' : 'Identity'}</span>
      </div>
      <div className="relative">
        {!back && <p className="text-2xl font-extrabold tracking-[.1em] sm:text-3xl" style={{ fontFamily: brand.typography?.display?.family }}>{companyName}</p>}
        <p className="mt-2 max-w-[28rem] text-[10px] uppercase tracking-[.12em] opacity-70 sm:text-xs" style={{ color: back ? secondaryOnSurface : accentOnPrimary }}>{back ? `hello@${companyName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com` : brand.tagline}</p>
      </div>
      <div className="relative flex items-center justify-between border-t border-current/15 pt-3 font-mono text-[9px] uppercase tracking-wider opacity-65"><span>{back ? 'www.' + companyName.toLowerCase().replace(/[^a-z0-9]/g, '') + '.com' : 'Brand identity system'}</span><span>{back ? '+1 555 014 2026' : 'EST. 2026'}</span></div>
    </article>;
    return <div className={`flex w-full flex-wrap items-center justify-center gap-5 ${side === 'both' ? '' : 'max-w-[520px]'}`}>
      {side !== 'back' && <Card />}{side !== 'front' && <Card back />}
    </div>;
  }

  if (item.type === 'letterhead') return <div className="relative flex aspect-[.707/1] w-full max-w-[440px] flex-col bg-white p-7 shadow-2xl sm:p-10" style={{ color: primaryOnSurface }}><div className="absolute left-0 top-0 h-full w-1.5" style={{ backgroundColor: colors.accent }} /><div className="flex items-start gap-3 border-b border-neutral-100 pb-5"><BrandMark brand={brand} size={34} /><div><p className="font-bold tracking-wider" style={{ fontFamily: brand.typography?.display?.family }}>{companyName}</p><p className="mt-1 text-[9px] text-neutral-400">{brand.tagline}</p></div></div><div className="my-auto space-y-3"><span className="block h-2 w-1/3 rounded bg-neutral-300"/><span className="block h-1 w-full rounded bg-neutral-100"/><span className="block h-1 w-[94%] rounded bg-neutral-100"/><span className="block h-1 w-[82%] rounded bg-neutral-100"/><span className="block h-1 w-full rounded bg-neutral-100"/><span className="block h-1 w-3/4 rounded bg-neutral-100"/></div><div className="flex justify-between border-t-2 pt-3 font-mono text-[8px] text-neutral-400" style={{ borderColor: colors.accent }}><span>BRAND STATIONERY</span><span>{companyName.toUpperCase()}</span></div></div>;

  if (item.type === 'envelope') return <div className="relative flex aspect-[2.3/1] w-full max-w-[620px] flex-col justify-between overflow-hidden rounded-xl border border-neutral-200 bg-white p-6 shadow-2xl sm:p-8"><div className="absolute left-0 top-0 h-full w-2" style={{ backgroundColor: colors.primary }} /><div className="flex items-center gap-3"><BrandMark brand={brand} size={32} /><div><p className="font-bold tracking-wider" style={{ color: primaryOnSurface }}>{companyName}</p><p className="text-[9px] text-neutral-400">{brand.tagline}</p></div></div><div className="ml-auto mr-5 text-right text-xs leading-5 text-neutral-500">Alex Vance<br />1240 Market Street<br />San Francisco, CA 94103</div><div className="absolute bottom-0 left-0 h-1 w-full" style={{ backgroundColor: colors.accent }} /></div>;

  if (item.type === 'email_signature') return <div className="relative flex w-full max-w-[680px] items-center gap-5 overflow-hidden rounded-2xl border border-neutral-200 bg-white p-5 shadow-2xl sm:p-7">
    <div className="absolute inset-y-0 left-0 w-1.5" style={{ backgroundColor: colors.accent }} />
    <BrandMark brand={brand} size={58} />
    <div className="h-16 w-px shrink-0" style={{ backgroundColor: colors.accent }} />
    <div className="min-w-0 flex-1"><p className="truncate text-base font-bold text-neutral-900 sm:text-lg">Alex Morgan</p><p className="mt-0.5 text-[10px] text-neutral-500 sm:text-xs">Brand &amp; Communications</p><p className="mt-3 truncate text-[10px] font-medium sm:text-xs" style={{ color: primaryOnSurface }}>hello@{companyName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com</p><p className="mt-1 truncate text-[10px] sm:text-xs" style={{ color: accentOnSurface }}>www.{companyName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com</p></div>
    <div className="hidden max-w-40 border-l border-neutral-100 pl-4 text-right lg:block"><p className="text-[10px] font-bold uppercase tracking-[.16em]" style={{ color: primaryOnSurface }}>{companyName}</p><p className="mt-1 line-clamp-2 text-[9px] leading-4 text-neutral-400">{brand.tagline}</p></div>
  </div>;

  if (item.type === 'presentation') return <div className="relative flex aspect-video w-full max-w-[960px] overflow-hidden rounded-2xl bg-white shadow-2xl">
    <div className="relative flex w-[35%] shrink-0 flex-col justify-between overflow-hidden p-5 sm:p-9" style={{ backgroundColor: colors.primary, color: surfaceOnPrimary }}><div className="absolute -bottom-10 -left-16 h-48 w-48 rounded-full opacity-20 blur-2xl" style={{ backgroundColor: colors.accent }} /><div className="relative"><BrandMark brand={brand} size={42} inverse /><p className="mt-5 font-mono text-[8px] uppercase tracking-[.2em] opacity-70 sm:text-[10px]">Brand presentation</p></div><div className="relative"><p className="text-xs font-bold uppercase tracking-[.18em] sm:text-sm">{companyName}</p><p className="mt-1 text-[8px] opacity-55 sm:text-[10px]">Identity overview · 2026</p></div></div>
    <div className="relative flex min-w-0 flex-1 flex-col justify-center overflow-hidden p-5 sm:p-10"><div className="absolute -right-14 -top-20 h-48 w-48 rounded-full" style={{ backgroundColor: `${colors.accent}18` }} /><p className="relative font-mono text-[8px] font-semibold uppercase tracking-[.2em] sm:text-[10px]" style={{ color: accentOnSurface }}>A clear point of view</p><h3 className="relative mt-3 max-w-xl text-base font-bold leading-tight tracking-tight text-neutral-900 sm:text-3xl" style={{ fontFamily: brand.typography?.display?.family }}>{brand.coreMantra || brand.tagline || 'A clearer way forward.'}</h3><p className="relative mt-3 max-w-lg text-[8px] leading-relaxed text-neutral-500 sm:mt-5 sm:text-xs">{brand.visual_style_description || brand.visualDirection || brand.tagline}</p><div className="relative mt-5 h-1 w-12 rounded-full sm:mt-8 sm:w-20" style={{ backgroundColor: colors.accent }} /><p className="absolute bottom-4 right-5 font-mono text-[8px] text-neutral-400 sm:bottom-7 sm:right-9 sm:text-[10px]">01 / 12</p></div>
  </div>;

  const isStory = item.type === 'social_story';
  const isBanner = item.type === 'social_banner';
  const bg = item.type === 'social_story' ? colors.surface : colors.primary;
  const fg = item.type === 'social_story' ? primaryOnSurface : surfaceOnPrimary;
  return <div className={`relative flex w-full flex-col justify-between overflow-hidden rounded-2xl p-7 shadow-2xl sm:p-10 ${isBanner ? 'aspect-[3/1] max-w-[720px]' : isStory ? 'aspect-[9/16] max-w-[320px]' : 'aspect-square max-w-[440px]'}`} style={{ backgroundColor: bg, color: fg }}>
    <div className="absolute -right-12 -top-12 h-56 w-56 rounded-full blur-3xl" style={{ backgroundColor: `${colors.accent}25` }} />
    <div className="relative flex items-center gap-3"><BrandMark brand={brand} size={isBanner ? 36 : 42} inverse={item.type !== 'social_story'} /><span className="font-mono text-[10px] uppercase tracking-[.25em]" style={{ color: item.type === 'social_story' ? accentOnSurface : accentOnPrimary }}>{companyName}</span></div>
    <div className="relative"><p className="mb-3 font-mono text-[10px] uppercase tracking-[.24em]" style={{ color: item.type === 'social_story' ? accentOnSurface : accentOnPrimary }}>{item.type.replace('social_', 'SOCIAL / ').replace('_', ' ')}</p><h3 className={`font-extrabold leading-[1.04] tracking-tight ${isBanner ? 'text-2xl sm:text-4xl' : isStory ? 'text-3xl sm:text-4xl' : 'text-3xl sm:text-4xl'}`} style={{ fontFamily: brand.typography?.display?.family }}>{title}</h3><p className="mt-4 max-w-[28rem] text-xs opacity-65">{brand.visual_style_description || brand.visualDirection || brand.tagline}</p></div>
    <div className="relative flex items-center justify-between border-t border-current/15 pt-4 text-[9px] font-mono uppercase tracking-wider opacity-60"><span>Make your mark</span><span>{companyName}</span></div>
  </div>;
}

function EmptyAssets({ onCreate }) {
  return <div className="flex min-h-[440px] flex-col items-center justify-center rounded-3xl border border-dashed border-neutral-300 bg-white p-8 text-center"><span className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-neutral-100 text-neutral-500"><Sparkles size={22} /></span><h2 className="text-xl font-bold">Your collateral will appear here</h2><p className="mt-2 max-w-sm text-sm text-neutral-500">Generate a brand identity to build stationery and digital assets from its design system.</p><button type="button" onClick={onCreate} className="mt-5 rounded-full bg-black px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white">Create a brand</button></div>;
}

export default function BrandCollateral({ onCreate }) {
  const { brand, updateBrandTokens } = useBrand();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [side, setSide] = useState('both');
  const [isEditing, setIsEditing] = useState(false);
  const [copied, setCopied] = useState(false);
  const { collateral } = useCollateral(brand?.assets || []);
  const visibleAssets = useMemo(() => filterCollateral(collateral, filter, search), [collateral, filter, search]);
  const [selectedId, setSelectedId] = useState(null);
  const selected = visibleAssets.find((item) => item.id === selectedId) || visibleAssets[0] || null;
  const companyName = brand?.companyName || brand?.company_name || 'EMBLEM';
  const colors = { ...DEFAULT_COLORS, ...(brand?.colors || {}) };
  colors.surface = brand?.colors?.surface || brand?.colors?.background || DEFAULT_COLORS.surface;
  const accentOnSurface = readableTextColor(colors.accent, colors.surface, colors.primary);
  const secondaryOnSurface = readableTextColor(colors.secondary, colors.surface, colors.primary);

  const updateColor = (key, value) => updateBrandTokens({ paletteId: '', colors: { ...(brand.colors || DEFAULT_COLORS), [key]: value } });
  const copySpecs = async () => {
    if (!selected) return;
    const specs = `${selected.name}\nBrand: ${companyName}\nFormat: ${selected.format}\nDimensions: ${selected.dimensions}px\nBleed: ${selected.metadata?.bleed || '—'}\nResolution: ${selected.metadata?.resolution || '—'}`;
    try {
      await navigator.clipboard.writeText(specs);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch (error) {
      setCopied(false);
    }
  };

  const copyEmailSignature = async () => {
    const email = `hello@${companyName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`;
    const website = `www.${companyName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`;
    const html = `<table role="presentation" cellpadding="0" cellspacing="0" style="font-family:Arial,sans-serif;color:${colors.primary};border-left:4px solid ${colors.accent};"><tr><td style="padding:12px 18px;"><strong style="font-size:16px;">Alex Morgan</strong><br><span style="font-size:12px;color:${secondaryOnSurface};">Brand &amp; Communications</span><br><a href="mailto:${email}" style="font-size:12px;color:${colors.primary};text-decoration:none;">${email}</a><br><a href="https://${website}" style="font-size:12px;color:${accentOnSurface};text-decoration:none;">${website}</a></td><td style="padding:12px 18px;border-left:1px solid #e8e2df;"><strong style="font-size:12px;letter-spacing:1px;">${escapeXml(companyName)}</strong><br><span style="font-size:11px;color:#817679;">${escapeXml(brand?.tagline || '')}</span></td></tr></table>`;
    const plain = `Alex Morgan | Brand & Communications\n${email}\n${website}\n${companyName} · ${brand?.tagline || ''}`;
    try {
      if (navigator.clipboard?.write && window.ClipboardItem) {
        await navigator.clipboard.write([new window.ClipboardItem({
          'text/html': new Blob([html], { type: 'text/html' }),
          'text/plain': new Blob([plain], { type: 'text/plain' })
        })]);
      } else {
        await navigator.clipboard.writeText(plain);
      }
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch (error) {
      setCopied(false);
    }
  };

  if (!collateral.length) return <div className="mx-auto max-w-6xl p-5 sm:p-8"><EmptyAssets onCreate={onCreate} /></div>;

  return <div className="mx-auto max-w-[1440px] p-4 sm:p-6 lg:p-8">
    <div className="mb-6 flex flex-col gap-4 border-b border-neutral-200 pb-5 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <div className="mb-2 flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: colors.accent }} /><span className="font-mono text-[10px] font-bold uppercase tracking-[.22em] text-neutral-500">Studio / Applied Identity</span></div>
        <h1 className="text-3xl font-extrabold tracking-tight text-neutral-950 sm:text-4xl" style={{ fontFamily: brand?.typography?.display?.family }}>{companyName} <span className="font-normal text-neutral-400">Studio</span></h1>
        <p className="mt-1 max-w-2xl text-sm text-neutral-500">Preview and refine touchpoints generated from your brand system.</p>
      </div>
    </div>

    {!visibleAssets.length ? <div className="rounded-2xl border border-dashed border-neutral-300 bg-white p-10 text-center text-sm text-neutral-500">No assets match that search. Try another name or filter.</div> : <div className="space-y-5">
      <section className="rounded-3xl border border-neutral-200 bg-white p-4 shadow-sm sm:p-6">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div><p className="font-mono text-[10px] font-bold uppercase tracking-[.2em] text-neutral-400">Made for your brand</p><h2 className="mt-1 text-xl font-bold tracking-tight">Collateral library <span className="ml-1 align-middle font-mono text-xs font-medium text-neutral-400">{visibleAssets.length}</span></h2><p className="mt-1 text-sm text-neutral-500">Choose a touchpoint to preview and refine.</p></div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="flex w-fit gap-1 rounded-xl bg-neutral-100 p-1">{FILTERS.map((entry) => <button type="button" key={entry} onClick={() => { setFilter(entry); setSelectedId(null); }} aria-pressed={filter === entry} className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${filter === entry ? 'bg-white text-black shadow-sm' : 'text-neutral-500 hover:text-black'}`}>{entry}</button>)}</div>
            <label className="relative block w-full sm:w-56"><Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" /><input value={search} onChange={(event) => { setSearch(event.target.value); setSelectedId(null); }} placeholder="Find an asset" className="w-full rounded-xl border border-neutral-200 bg-neutral-50 py-2 pl-9 pr-3 text-xs outline-none transition focus:border-neutral-500 focus:bg-white" /></label>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-6">
          {visibleAssets.map((item) => <button type="button" key={item.id} onClick={() => { setSelectedId(item.id); setSide('both'); }} aria-pressed={selected?.id === item.id} className={`group rounded-2xl border p-2 text-left transition-all ${selected?.id === item.id ? 'border-neutral-900 bg-neutral-50 shadow-[0_0_0_2px_rgba(23,23,23,.08)]' : 'border-neutral-200 hover:-translate-y-0.5 hover:border-neutral-400 hover:shadow-md'}`}>
            <span className="relative mb-2 flex h-24 items-center justify-center overflow-hidden rounded-xl bg-[#F4F1EE] p-2 sm:h-28">
              <span className="absolute inset-0 opacity-50" style={{ backgroundImage: 'radial-gradient(#D3D1CC 0.7px,transparent 0.7px)', backgroundSize: '14px 14px' }} />
              <img src={`data:image/svg+xml;charset=utf-8,${encodeURIComponent(makeCollateralSvg(brand, item, 'front'))}`} alt="" className="relative h-full w-full object-contain drop-shadow-sm" />
              {selected?.id === item.id && <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-neutral-900 text-white"><Check size={12} /></span>}
            </span>
            <span className="block truncate px-1 text-xs font-bold">{item.name}</span><span className="mt-1 flex items-center justify-between gap-1 px-1 font-mono text-[9px] uppercase tracking-wider text-neutral-400"><span className="truncate">{item.format}</span><span>{item.category}</span></span>
          </button>)}
        </div>
      </section>

      <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
      <section className="min-w-0 overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-neutral-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="min-w-0"><p className="font-mono text-[9px] font-bold uppercase tracking-[.2em] text-neutral-400">Your selection</p><h2 className="truncate text-xl font-bold">{selected.name}</h2><p className="mt-0.5 text-xs text-neutral-500">A live preview using your current brand identity.</p></div>
          <div className="flex flex-wrap items-center gap-2">
            {selected.type === 'business_card' && <div className="flex rounded-lg border border-neutral-200 bg-neutral-50 p-0.5">{['both', 'front', 'back'].map((entry) => <button type="button" key={entry} onClick={() => setSide(entry)} aria-pressed={side === entry} className={`rounded-md px-2.5 py-1 text-[10px] font-semibold capitalize ${side === entry ? 'bg-black text-white' : 'text-neutral-500'}`}>{entry}</button>)}</div>}
            <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 font-mono text-[9px] font-semibold uppercase tracking-wider text-emerald-800"><Check size={11} className="mr-1 inline" />{selected.consistencyScore}% aligned</span>
            <button type="button" onClick={selected.type === 'email_signature' ? copyEmailSignature : copySpecs} className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 px-2.5 py-1.5 text-[10px] font-semibold text-neutral-600 hover:bg-neutral-50">{copied ? <Check size={12} /> : <FileImage size={12} />}{copied ? 'Copied' : selected.type === 'email_signature' ? 'Copy signature' : 'Copy specs'}</button>
          </div>
        </div>

        <div className="relative flex min-h-[360px] items-center justify-center overflow-hidden bg-[#F4F3F0] p-5 sm:min-h-[480px] sm:p-8">
          <div className="pointer-events-none absolute inset-0 opacity-60" style={{ backgroundImage: 'radial-gradient(#D3D1CC 0.8px,transparent 0.8px)', backgroundSize: '20px 20px' }} />
          <div className="relative z-10 flex w-full items-center justify-center"><AssetArtwork brand={brand} item={selected} side={side} /></div>
          <div className="absolute bottom-3 left-4 font-mono text-[9px] uppercase tracking-wider text-neutral-400">{selected.dimensions}px · {selected.format}</div>
        </div>
        <div className="grid grid-cols-2 gap-0 border-t border-neutral-100 sm:grid-cols-4">{[['Format', selected.format], ['Dimensions', `${selected.dimensions}px`], ['Bleed', selected.metadata?.bleed], ['Resolution', selected.metadata?.resolution]].map(([label, value]) => <div key={label} className="border-b border-r border-neutral-100 px-4 py-3 last:border-r-0 sm:border-b-0"><p className="font-mono text-[9px] uppercase tracking-widest text-neutral-400">{label}</p><p className="mt-1 truncate text-xs font-semibold text-neutral-700">{value || '—'}</p></div>)}</div>
      </section>

      <aside className="h-fit rounded-3xl border border-neutral-200 bg-white shadow-sm xl:sticky xl:top-24">
        <div className="flex items-center justify-between border-b border-neutral-100 px-4 py-3"><div><p className="font-mono text-[9px] font-bold uppercase tracking-[.18em] text-neutral-400">Identity controls</p><h2 className="text-sm font-bold">Brand tokens</h2></div><button type="button" className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 xl:hidden" onClick={() => setIsEditing(!isEditing)} aria-label={isEditing ? 'Close brand token editor' : 'Open brand token editor'}>{isEditing ? <X size={15} /> : <ChevronDown size={15} />}</button></div>
        <div className={`${isEditing ? 'block' : 'hidden'} space-y-5 p-4 xl:block`}>
          <label className="block space-y-1.5"><span className="font-mono text-[9px] font-bold uppercase tracking-wider text-neutral-500">Brand name</span><input value={companyName} onChange={(event) => updateBrandTokens({ companyName: event.target.value, company_name: event.target.value })} className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-xs outline-none focus:border-black" /></label>
          <label className="block space-y-1.5"><span className="font-mono text-[9px] font-bold uppercase tracking-wider text-neutral-500">Tagline</span><textarea rows={2} value={brand?.tagline || ''} onChange={(event) => updateBrandTokens({ tagline: event.target.value })} className="w-full resize-y rounded-lg border border-neutral-200 px-3 py-2 text-xs leading-relaxed outline-none focus:border-black" /></label>
          <div><p className="mb-2 font-mono text-[9px] font-bold uppercase tracking-wider text-neutral-500">Palette</p><div className="space-y-2">{[['primary', 'Primary'], ['secondary', 'Secondary'], ['accent', 'Accent'], ['surface', 'Surface']].map(([key, label]) => <label key={key} className="flex items-center justify-between rounded-lg border border-neutral-100 px-2.5 py-2"><span className="text-xs text-neutral-600">{label}</span><span className="flex items-center gap-2"><input aria-label={`${label} color`} type="color" value={colors[key]} onChange={(event) => updateColor(key, event.target.value)} className="h-6 w-7 cursor-pointer rounded border-0 bg-transparent p-0" /><span className="w-16 text-right font-mono text-[10px] text-neutral-500">{colors[key].toUpperCase()}</span></span></label>)}</div></div>
          <p className="rounded-xl bg-neutral-50 p-3 text-[10px] leading-relaxed text-neutral-500">Edits apply to this live preview and the kit you export in this session.</p>
          <button type="button" onClick={() => setIsEditing(false)} className="w-full rounded-xl bg-black py-2.5 text-xs font-bold text-white hover:bg-neutral-800">Apply changes</button>
        </div>
      </aside>
      </div>
    </div>}
  </div>;
}
