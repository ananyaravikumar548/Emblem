/**
 * EMBLEM Vector Engine for Frontend
 * Provides client-side SVG composition, download utilities, and safety-zone overlay calculations.
 */
import { readableTextColor } from './colorUtils';

export const VECTOR_MARKS = {
  minimal: {
    geometric_prism: `<polygon points="24 4, 44 38, 4 38" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/><polygon points="24 16, 36 38, 12 38" fill="currentColor" fill-opacity="0.15" stroke="currentColor" stroke-width="1.5"/>`,
    minimal_circle_intersect: `<circle cx="20" cy="24" r="14" fill="none" stroke="currentColor" stroke-width="2.5"/><circle cx="28" cy="24" r="14" fill="currentColor" fill-opacity="0.2" stroke="currentColor" stroke-width="2.5"/>`,
    minimal_slash_square: `<rect x="8" y="8" width="32" height="32" rx="4" fill="none" stroke="currentColor" stroke-width="2.5"/><line x1="8" y1="40" x2="40" y2="8" stroke="currentColor" stroke-width="2.5"/>`,
    minimal_stacked_bars: `<rect x="6" y="10" width="36" height="5" rx="2.5" fill="currentColor"/><rect x="6" y="21.5" width="24" height="5" rx="2.5" fill="currentColor"/><rect x="6" y="33" width="16" height="5" rx="2.5" fill="currentColor"/>`,
    minimal_diamond_compass: `<rect x="10" y="10" width="28" height="28" rx="2" transform="rotate(45 24 24)" fill="none" stroke="currentColor" stroke-width="2.5"/><circle cx="24" cy="24" r="5" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="24" cy="24" r="2" fill="currentColor"/>`,
    minimal_offset_quad: `<rect x="8" y="8" width="24" height="24" rx="3" fill="none" stroke="currentColor" stroke-width="2.5"/><rect x="16" y="16" width="24" height="24" rx="3" fill="currentColor" fill-opacity="0.18" stroke="currentColor" stroke-width="2.5"/>`,
    minimal_bauhaus_portal: `<path d="M10 38 L10 24 A14 14 0 0 1 38 24 L38 38 Z" fill="none" stroke="currentColor" stroke-width="2.5"/><circle cx="24" cy="24" r="6" fill="currentColor" fill-opacity="0.25" stroke="currentColor" stroke-width="1.5"/><line x1="6" y1="38" x2="42" y2="38" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>`,
    minimal_zen_ring: `<path d="M24 6 A18 18 0 1 1 8 20" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/><circle cx="36" cy="12" r="3" fill="currentColor"/>`
  },
  tech: {
    circuit_node: `<rect x="6" y="6" width="36" height="36" rx="8" fill="none" stroke="currentColor" stroke-width="2.5"/><circle cx="24" cy="24" r="6" fill="currentColor"/><line x1="24" y1="6" x2="24" y2="18" stroke="currentColor" stroke-width="2"/><line x1="24" y1="30" x2="24" y2="42" stroke="currentColor" stroke-width="2"/><line x1="6" y1="24" x2="18" y2="24" stroke="currentColor" stroke-width="2"/><line x1="30" y1="24" x2="42" y2="24" stroke="currentColor" stroke-width="2"/>`,
    cube_dimension: `<path d="M24 4 L42 14 L42 34 L24 44 L6 34 L6 14 Z" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round"/><line x1="24" y1="24" x2="42" y2="14" stroke="currentColor" stroke-width="2"/><line x1="24" y1="24" x2="6" y2="14" stroke="currentColor" stroke-width="2"/><line x1="24" y1="24" x2="24" y2="44" stroke="currentColor" stroke-width="2"/>`,
    quantum_orbit: `<ellipse cx="24" cy="24" rx="18" ry="7" transform="rotate(30 24 24)" fill="none" stroke="currentColor" stroke-width="2.5"/><ellipse cx="24" cy="24" rx="18" ry="7" transform="rotate(-30 24 24)" fill="none" stroke="currentColor" stroke-width="2.5"/><circle cx="24" cy="24" r="5" fill="currentColor"/>`,
    neural_synapse: `<circle cx="12" cy="14" r="4" fill="currentColor"/><circle cx="12" cy="34" r="4" fill="currentColor"/><circle cx="36" cy="14" r="4" fill="currentColor"/><circle cx="36" cy="34" r="4" fill="currentColor"/><circle cx="24" cy="24" r="5" fill="currentColor" fill-opacity="0.25" stroke="currentColor" stroke-width="2"/><line x1="12" y1="14" x2="24" y2="24" stroke="currentColor" stroke-width="2"/><line x1="12" y1="34" x2="24" y2="24" stroke="currentColor" stroke-width="2"/><line x1="36" y1="14" x2="24" y2="24" stroke="currentColor" stroke-width="2"/><line x1="36" y1="34" x2="24" y2="24" stroke="currentColor" stroke-width="2"/><line x1="12" y1="14" x2="12" y2="34" stroke="currentColor" stroke-width="1.5"/><line x1="36" y1="14" x2="36" y2="34" stroke="currentColor" stroke-width="1.5"/>`,
    matrix_hex_core: `<polygon points="24 4, 42 14, 42 34, 24 44, 6 34, 6 14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round"/><polygon points="24 14, 33 19, 33 29, 24 34, 15 29, 15 19" fill="currentColor" fill-opacity="0.2" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><circle cx="24" cy="24" r="3" fill="currentColor"/>`,
    binary_brackets: `<path d="M16 10 L8 18 L8 30 L16 38" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M32 10 L40 18 L40 30 L32 38" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><line x1="20" y1="24" x2="28" y2="24" stroke="currentColor" stroke-width="3" stroke-linecap="round"/><circle cx="24" cy="24" r="2" fill="currentColor"/>`,
    satellite_radar: `<path d="M8 40 A22 22 0 0 1 40 8" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/><path d="M8 32 A14 14 0 0 1 32 8" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/><path d="M8 24 A6 6 0 0 1 24 8" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><circle cx="8" cy="8" r="4" fill="currentColor"/>`,
    spectrum_prism: `<polygon points="8 40, 24 8, 40 40" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round"/><line x1="6" y1="28" x2="20" y2="22" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="26" y1="23" x2="44" y2="18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="28" y1="27" x2="44" y2="28" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="29" y1="31" x2="44" y2="38" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>`
  },
  luxury: {
    crest_diamond: `<polygon points="24 4, 42 20, 24 44, 6 20" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round"/><polygon points="24 12, 34 20, 24 36, 14 20" fill="currentColor" fill-opacity="0.2" stroke="currentColor" stroke-width="1.5"/>`,
    crown_pillar: `<path d="M8 38 L40 38 M10 38 L6 14 L18 24 L24 10 L30 24 L42 14 L38 38 Z" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/><circle cx="24" cy="8" r="2" fill="currentColor"/><circle cx="6" cy="12" r="2" fill="currentColor"/><circle cx="42" cy="12" r="2" fill="currentColor"/>`,
    arch_monogram: `<path d="M12 40 L12 22 A12 12 0 0 1 36 22 L36 40" fill="none" stroke="currentColor" stroke-width="2.5"/><line x1="8" y1="40" x2="40" y2="40" stroke="currentColor" stroke-width="2.5"/><circle cx="24" cy="26" r="4" fill="currentColor"/>`,
    fleur_sovereign: `<path d="M24 6 C24 6 20 18 14 20 C8 22 6 16 6 16 C6 28 16 32 24 42 C32 32 42 28 42 16 C42 16 40 22 34 20 C28 18 24 6 24 6 Z" fill="currentColor" fill-opacity="0.15" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"/><line x1="24" y1="12" x2="24" y2="38" stroke="currentColor" stroke-width="2"/>`,
    interlocking_gem: `<rect x="9" y="9" width="22" height="22" rx="4" fill="none" stroke="currentColor" stroke-width="2.2"/><rect x="17" y="17" width="22" height="22" rx="4" fill="currentColor" fill-opacity="0.18" stroke="currentColor" stroke-width="2.2"/><circle cx="24" cy="24" r="3" fill="currentColor"/>`,
    palais_monolith: `<line x1="8" y1="8" x2="40" y2="8" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/><line x1="12" y1="13" x2="36" y2="13" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="16" y1="14" x2="16" y2="35" stroke="currentColor" stroke-width="2.2"/><line x1="24" y1="14" x2="24" y2="35" stroke="currentColor" stroke-width="2.2"/><line x1="32" y1="14" x2="32" y2="35" stroke="currentColor" stroke-width="2.2"/><line x1="10" y1="36" x2="38" y2="36" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="6" y1="41" x2="42" y2="41" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>`,
    solitaire_star: `<polygon points="24 4, 27 19, 42 24, 27 29, 24 44, 21 29, 6 24, 21 19" fill="currentColor" fill-opacity="0.2" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><circle cx="24" cy="24" r="3" fill="currentColor"/>`,
    shield_crest_regal: `<path d="M10 8 L38 8 C38 8 40 26 24 42 C8 26 10 8 10 8 Z" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round"/><line x1="24" y1="10" x2="24" y2="38" stroke="currentColor" stroke-width="1.8"/><line x1="11" y1="22" x2="37" y2="22" stroke="currentColor" stroke-width="1.8"/>`
  },
  organic: {
    botanical_leaf: `<path d="M10 38 C10 38 12 18 36 10 C36 10 38 30 14 38 Z" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round"/><path d="M10 38 C18 30 26 22 36 10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M20 28 C26 26 28 22 28 22" stroke="currentColor" stroke-width="1.5"/>`,
    solar_sprout: `<circle cx="24" cy="16" r="8" fill="none" stroke="currentColor" stroke-width="2.5"/><path d="M14 38 C14 30 24 28 24 28 C24 28 34 30 34 38" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/><line x1="24" y1="28" x2="24" y2="42" stroke="currentColor" stroke-width="2.5"/>`,
    wave_ripple: `<path d="M6 28 C12 22 18 34 24 28 C30 22 36 34 42 28" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/><path d="M6 20 C12 14 18 26 24 20 C30 14 36 26 42 20" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/><path d="M6 36 C12 30 18 42 24 36 C30 30 36 42 42 36" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>`,
    twin_flora: `<path d="M24 42 L24 16 M24 26 C16 26 12 18 16 12 C20 18 24 22 24 22 M24 32 C32 32 36 24 32 18 C28 24 24 28 24 28" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="24" cy="10" r="3" fill="currentColor"/>`,
    terra_strata: `<ellipse cx="24" cy="24" rx="19" ry="16" fill="none" stroke="currentColor" stroke-width="2.5"/><ellipse cx="24" cy="24" rx="12" ry="10" fill="none" stroke="currentColor" stroke-width="2"/><ellipse cx="24" cy="24" rx="5" ry="4" fill="currentColor" fill-opacity="0.3" stroke="currentColor" stroke-width="1.5"/>`,
    seed_of_life: `<circle cx="24" cy="24" r="18" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="24" cy="14" r="10" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="24" cy="34" r="10" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="15" cy="24" r="10" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="33" cy="24" r="10" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="24" cy="24" r="3" fill="currentColor"/>`,
    spiral_nautilus: `<path d="M24 24 A3 3 0 0 1 21 21 A6 6 0 0 1 27 15 A12 12 0 0 1 39 27 A18 18 0 0 1 21 45 A24 24 0 0 1 4 21" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>`,
    sun_horizon: `<path d="M12 24 A12 12 0 0 1 36 24 Z" fill="currentColor" fill-opacity="0.25" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round"/><line x1="6" y1="28" x2="42" y2="28" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/><line x1="10" y1="34" x2="38" y2="34" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="16" y1="40" x2="32" y2="40" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>`
  },
  bold: {
    lightning_apex: `<polygon points="26 4, 10 26, 22 26, 20 44, 38 20, 26 20" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>`,
    shield_valor: `<path d="M24 4 L40 10 L40 24 C40 33 24 42 24 42 C24 42 8 33 8 24 L8 10 Z" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round"/><path d="M24 12 L32 16 L32 24 C32 29 24 34 24 34 Z" fill="currentColor" fill-opacity="0.3"/>`,
    nexus_burst: `<circle cx="24" cy="24" r="8" fill="currentColor"/><line x1="24" y1="4" x2="24" y2="12" stroke="currentColor" stroke-width="3" stroke-linecap="round"/><line x1="24" y1="36" x2="24" y2="44" stroke="currentColor" stroke-width="3" stroke-linecap="round"/><line x1="4" y1="24" x2="12" y2="24" stroke="currentColor" stroke-width="3" stroke-linecap="round"/><line x1="36" y1="24" x2="44" y2="24" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>`,
    chevron_forge: `<path d="M10 8 L24 22 L10 36 M22 8 L36 22 L22 36" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>`,
    monolith_pillar: `<rect x="6" y="8" width="8" height="32" rx="2" fill="currentColor"/><rect x="20" y="4" width="8" height="40" rx="2" fill="currentColor"/><rect x="34" y="14" width="8" height="26" rx="2" fill="currentColor"/>`,
    impact_polygon: `<polygon points="12 4, 36 4, 44 20, 24 44, 4 20" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/><line x1="4" y1="20" x2="44" y2="20" stroke="currentColor" stroke-width="2.5"/><line x1="12" y1="4" x2="24" y2="44" stroke="currentColor" stroke-width="2.5"/><line x1="36" y1="4" x2="24" y2="44" stroke="currentColor" stroke-width="2.5"/>`,
    vortex_turbine: `<circle cx="24" cy="24" r="18" fill="none" stroke="currentColor" stroke-width="3"/><path d="M24 6 L24 24 L38 32 M24 24 L10 32" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="24" cy="24" r="4" fill="currentColor"/>`,
    barricade_cross: `<line x1="8" y1="8" x2="40" y2="40" stroke="currentColor" stroke-width="5" stroke-linecap="round"/><line x1="40" y1="8" x2="8" y2="40" stroke="currentColor" stroke-width="5" stroke-linecap="round"/><circle cx="24" cy="24" r="6" fill="#FFF" stroke="currentColor" stroke-width="3"/>`
  }
};

export function getMarkSvgPath(styleToken = 'minimal', companyName = 'EMBLEM') {
  const category = VECTOR_MARKS[styleToken] || VECTOR_MARKS.minimal;
  const keys = Object.keys(category);
  let hash = 0;
  for (let i = 0; i < companyName.length; i++) {
    hash = (hash << 5) - hash + companyName.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % keys.length;
  const key = keys[index];
  return category[key];
}

export function getMarkOptions(styleToken = 'minimal') {
  const category = VECTOR_MARKS[styleToken] || VECTOR_MARKS.minimal;
  return Object.entries(category).map(([id, svg]) => ({ id, svg }));
}

const escapeXml = (value) => String(value).replace(/[&<>"']/g, (character) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;'
}[character]));

const safeColor = (value, fallback) => /^#[\da-f]{3}(?:[\da-f]{3}|[\da-f]{5})?$/i.test(value || '') ? value : fallback;
const safeFont = (value, fallback) => {
  const cleaned = String(value || '').replace(/[^\w\s,'-]/g, '').trim();
  return cleaned || fallback;
};

export function buildBrandLogos(brand) {
  const rawName = brand?.companyName || brand?.company_name || 'EMBLEM';
  const rawTagline = brand?.tagline || '';
  const companyName = escapeXml(String(rawName).trim().toUpperCase() || 'EMBLEM');
  const tagline = escapeXml(String(rawTagline).trim().toUpperCase());
  const colors = brand?.colors || {};
  const primaryColor = safeColor(colors.primary, '#111111');
  const accentColor = safeColor(colors.accent, '#777777');
  const surfaceColor = safeColor(colors.surface || colors.background, '#FFFFFF');
  const accentOnSurface = readableTextColor(accentColor, surfaceColor, primaryColor);
  const typography = brand?.typography || {};
  const displayFont = escapeXml(safeFont(typography.display?.family || typography.heading_font, 'Arial, sans-serif'));
  const monoFont = escapeXml(safeFont(typography.mono?.family, 'Arial, sans-serif'));
  const logoStyleToken = brand?.logoStyleToken || 'minimal';
  const options = VECTOR_MARKS[logoStyleToken] || VECTOR_MARKS.minimal;
  let markPath = brand?.logoMarkId && options[brand.logoMarkId] ? options[brand.logoMarkId] : null;
  if (brand?.logoMarkId && !markPath) {
    for (const cat of Object.values(VECTOR_MARKS)) {
      if (cat[brand.logoMarkId]) {
        markPath = cat[brand.logoMarkId];
        break;
      }
    }
  }
  if (!markPath) {
    markPath = getMarkSvgPath(logoStyleToken, String(rawName));
  }

  // Give long brand names and taglines room so generated marks do not clip.
  const lockupWidth = Math.min(1000, Math.max(200, 88 + String(rawName).trim().length * 20, 90 + String(rawTagline).trim().length * 6.5));
  const stackedWidth = Math.min(480, Math.max(240, String(rawName).length * 14 + 48, String(rawTagline).length * 6 + 48));
  const stackedCenter = stackedWidth / 2;
  const markAndWordmark = (color, taglineColor = color) => `
  <g transform="translate(24, 26)" color="${color}">${markPath}</g>
  <text x="88" y="51" font-family="${displayFont}" font-size="26" font-weight="700" letter-spacing="3.2" fill="${color}">${companyName}</text>
  ${tagline ? `<text x="90" y="69" font-family="${monoFont}" font-size="8" font-weight="600" letter-spacing="1.8" fill="${taglineColor}">${tagline}</text>` : ''}`;

  const primary = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${lockupWidth} 100" width="${lockupWidth}" height="100">${markAndWordmark(primaryColor, accentOnSurface)}</svg>`;
  const stacked = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${stackedWidth} 150" width="${stackedWidth}" height="150">
    <g transform="translate(${stackedCenter - 24}, 10)" color="${primaryColor}">${markPath}</g>
    <text x="${stackedCenter}" y="82" text-anchor="middle" font-family="${displayFont}" font-size="22" font-weight="700" letter-spacing="2.5" fill="${primaryColor}">${companyName}</text>
    ${tagline ? `<text x="${stackedCenter}" y="103" text-anchor="middle" font-family="${monoFont}" font-size="7" font-weight="600" letter-spacing="1.4" fill="${accentOnSurface}">${tagline}</text>` : ''}
  </svg>`;
  const mark = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
    <rect width="120" height="120" rx="24" fill="${surfaceColor}" stroke="${primaryColor}" stroke-opacity=".15" stroke-width="1.5"/>
    <g transform="translate(36, 36)" color="${primaryColor}">${markPath}</g>
  </svg>`;
  const monoLight = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${lockupWidth} 100" width="${lockupWidth}" height="100">${markAndWordmark('#171516', '#555152')}</svg>`;
  const monoDark = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${lockupWidth} 100" width="${lockupWidth}" height="100">${markAndWordmark('#FFFFFF', '#D5CED0')}</svg>`;

  return {
    markPath,
    lockupWidth,
    primary,
    stacked,
    mark,
    monoLight,
    monoDark
  };
}

export function downloadSvg(svgContent, filename = 'logo.svg') {
  const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename.replace(/[\\/:*?"<>|]+/g, '-');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

