const { VECTOR_MARKS } = require('./vectorLogoService');

const STYLE_TOKENS = Object.keys(VECTOR_MARKS);
const FONT_PAIRS = [
  ['Playfair Display', 'DM Sans'],
  ['Space Grotesk', 'DM Sans'],
  ['Cormorant Garamond', 'Manrope'],
  ['Syne', 'Plus Jakarta Sans'],
  ['DM Serif Display', 'Outfit'],
  ['Bodoni Moda', 'Work Sans'],
  ['Fraunces', 'Public Sans'],
  ['Archivo', 'Lora'],
  ['Unbounded', 'Inter'],
  ['Libre Baskerville', 'Montserrat'],
  ['Instrument Serif', 'Figtree'],
  ['Gloock', 'Public Sans'],
  ['Alegreya', 'Nunito Sans'],
  ['Spectral', 'Source Sans 3'],
  ['Crimson Pro', 'Plus Jakarta Sans'],
  ['Literata', 'IBM Plex Sans'],
  ['Prata', 'Urbanist'],
  ['Merriweather', 'Mulish'],
  ['Cardo', 'Assistant'],
  ['Young Serif', 'Libre Franklin'],
  ['Vollkorn', 'Noto Sans'],
  ['Bitter', 'Roboto'],
  ['Newsreader', 'Work Sans'],
  ['DM Serif Display', 'Karla'],
  ['Bodoni Moda', 'Manrope'],
  ['Fraunces', 'Outfit'],
  ['Lora', 'DM Sans'],
  ['Cormorant Garamond', 'Inter'],
  ['Playfair Display', 'IBM Plex Sans']
];
const MONO_FONTS = ['IBM Plex Mono', 'DM Mono', 'JetBrains Mono', 'Space Mono', 'Roboto Mono', 'Inconsolata', 'Source Code Pro', 'Fira Code', 'Azeret Mono', 'Red Hat Mono', 'Ubuntu Mono', 'Anonymous Pro', 'Fragment Mono', 'Cutive Mono', 'Share Tech Mono', 'Spline Sans Mono', 'Nova Mono', 'Oxygen Mono', 'Major Mono Display', 'Syne Mono', 'Geist Mono', 'Martian Mono', 'Commit Mono', 'Victor Mono'];

const FALLBACK_PALETTES = [
  ['#432630', '#714956', '#8D4153', '#FBF5F1'],
  ['#28483C', '#4B6957', '#805527', '#F4F3E9'],
  ['#222C3A', '#46556A', '#A84531', '#F3F3EF'],
  ['#38234E', '#624579', '#566A10', '#F6F1F8'],
  ['#292725', '#5B5650', '#935139', '#F3F0EA']
];

function validHex(value) {
  return typeof value === 'string' && /^#[0-9a-f]{6}$/i.test(value);
}

function channels(hex) {
  return [1, 3, 5].map((offset) => parseInt(hex.slice(offset, offset + 2), 16) / 255)
    .map((value) => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
}

function contrastRatio(first, second) {
  if (!validHex(first) || !validHex(second)) return 1;
  const luminance = (hex) => {
    const [r, g, b] = channels(hex);
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const a = luminance(first);
  const b = luminance(second);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

function hashSeed(value) {
  let hash = 2166136261;
  for (const character of String(value || 'brand')) hash = Math.imul(hash ^ character.charCodeAt(0), 16777619);
  return hash >>> 0;
}

function hexToHsl(hex) {
  const rgb = [1, 3, 5].map((offset) => parseInt(hex.slice(offset, offset + 2), 16) / 255);
  const max = Math.max(...rgb);
  const min = Math.min(...rgb);
  const delta = max - min;
  let hue = 0;
  if (delta) {
    if (max === rgb[0]) hue = ((rgb[1] - rgb[2]) / delta) % 6;
    else if (max === rgb[1]) hue = (rgb[2] - rgb[0]) / delta + 2;
    else hue = (rgb[0] - rgb[1]) / delta + 4;
  }
  hue = (hue * 60 + 360) % 360;
  const lightness = (max + min) / 2;
  const saturation = delta ? delta / (1 - Math.abs(2 * lightness - 1)) : 0;
  return [hue, saturation, lightness];
}

function hslToHex(hue, saturation, lightness) {
  const chroma = (1 - Math.abs(2 * lightness - 1)) * saturation;
  const x = chroma * (1 - Math.abs(((hue / 60) % 2) - 1));
  const match = lightness - chroma / 2;
  const rgb = hue < 60 ? [chroma, x, 0] : hue < 120 ? [x, chroma, 0] : hue < 180 ? [0, chroma, x] : hue < 240 ? [0, x, chroma] : hue < 300 ? [x, 0, chroma] : [chroma, 0, x];
  return '#' + rgb.map((channel) => Math.round((channel + match) * 255).toString(16).padStart(2, '0')).join('');
}

function softenColor(value, role) {
  if (!validHex(value)) return role === 'surface' ? '#F7F4EF' : '#34434A';
  const [hue, saturation, lightness] = hexToHsl(value);
  if (role === 'surface') {
    return hslToHex(hue, Math.min(saturation, 0.12), lightness > 0.45 ? Math.max(lightness, 0.94) : Math.min(lightness, 0.12));
  }
  const saturationLimits = {
    primary: { min: 0.24, max: 0.42 },
    secondary: { min: 0.22, max: 0.34 },
    accent: { min: 0.32, max: 0.40 }
  };
  const limits = saturationLimits[role] || { min: 0.2, max: 0.36 };
  return hslToHex(hue, Math.max(limits.min, Math.min(saturation, limits.max)), lightness);
}

function rotateHue(hex, degrees) {
  const [hue, saturation, lightness] = hexToHsl(hex);
  return hslToHex((hue + degrees + 360) % 360, saturation, lightness);
}

function mix(hex, target, amount) {
  const from = [1, 3, 5].map((offset) => parseInt(hex.slice(offset, offset + 2), 16));
  const to = [1, 3, 5].map((offset) => parseInt(target.slice(offset, offset + 2), 16));
  return `#${from.map((value, index) => Math.round(value + (to[index] - value) * amount).toString(16).padStart(2, '0')).join('')}`;
}

function ensureReadable(foreground, surface) {
  if (!validHex(foreground)) foreground = '#263238';
  if (!validHex(surface)) surface = '#F7F4EF';
  if (contrastRatio(foreground, surface) >= 4.5) return foreground;
  const target = contrastRatio('#000000', surface) >= contrastRatio('#FFFFFF', surface) ? '#000000' : '#FFFFFF';
  for (let step = 1; step <= 100; step += 1) {
    const candidate = mix(foreground, target, step / 100);
    if (contrastRatio(candidate, surface) >= 4.5) return candidate;
  }
  return target;
}

function rgbDistance(first, second) {
  if (!validHex(first) || !validHex(second)) return 0;
  const a = [1, 3, 5].map((offset) => parseInt(first.slice(offset, offset + 2), 16));
  const b = [1, 3, 5].map((offset) => parseInt(second.slice(offset, offset + 2), 16));
  return Math.sqrt(a.reduce((sum, value, index) => sum + (value - b[index]) ** 2, 0));
}

function normalizePalette(colors = {}) {
  const surface = softenColor(colors.surface, 'surface');
  const roles = ['primary', 'secondary', 'accent'];
  const normalized = { surface };
  const hueOffsets = {
    primary: [0, 24, -28, 48, -52, 82, -92, 135, 190, 245],
    secondary: [0, 42, -48, 76, -88, 125, -138, 185, 240, 290],
    accent: [0, 72, -78, 118, -132, 165, 205, 250, 300]
  };

  roles.forEach((role, index) => {
    const source = validHex(colors[role]) ? colors[role] : ['#34434A', '#62665E', '#846A54'][index];
    const base = softenColor(source, role);
    const earlier = roles.slice(0, index).map((key) => normalized[key]);
    const candidates = hueOffsets[role].map((offset) => ensureReadable(softenColor(rotateHue(base, offset), role), surface));
    const separation = (value) => earlier.length ? Math.min(...earlier.map((used) => rgbDistance(value, used))) : Infinity;
    const candidate = candidates.find((value) => (
      contrastRatio(value, surface) >= 4.5 && earlier.every((used) => rgbDistance(value, used) >= 18)
    )) || candidates.sort((a, b) => separation(b) - separation(a))[0] || ensureReadable(base, surface);
    normalized[role] = candidate;
  });

  return normalized;
}

function slug(value) {
  return String(value || 'brand').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 28) || 'brand';
}

function normalizeTypography(value, index, seed = 0) {
  const pair = FONT_PAIRS[(seed + index) % FONT_PAIRS.length];
  const display = value?.display?.family || pair[0];
  const body = value?.body?.family || pair[1];
  return {
    display: { family: display, size: Number(value?.display?.size) || 48, weight: String(value?.display?.weight || '700') },
    headline: { family: value?.headline?.family || body, size: Number(value?.headline?.size) || 28, weight: String(value?.headline?.weight || '600') },
    body: { family: body, size: Number(value?.body?.size) || 16, weight: String(value?.body?.weight || '400') },
    mono: { family: value?.mono?.family || MONO_FONTS[(seed + index) % MONO_FONTS.length], size: Number(value?.mono?.size) || 12, weight: String(value?.mono?.weight || '500') }
  };
}

function generatedFallback(index, options) {
  const seed = hashSeed(options.brandId || `${options.companyName || ''}|${options.industry || ''}`);
  const palette = FALLBACK_PALETTES[(seed + index) % FALLBACK_PALETTES.length];
  const base = options.baseColors || {};
  const angle = (seed + index * 67) % 360;
  const colors = {
    primary: ensureReadable(softenColor(rotateHue(validHex(base.primary) ? base.primary : palette[0], angle), 'primary'), validHex(base.surface) ? softenColor(base.surface, 'surface') : palette[3]),
    secondary: ensureReadable(softenColor(rotateHue(validHex(base.secondary) ? base.secondary : palette[1], angle), 'secondary'), validHex(base.surface) ? softenColor(base.surface, 'surface') : palette[3]),
    accent: ensureReadable(softenColor(rotateHue(validHex(base.accent) ? base.accent : palette[2], angle), 'accent'), validHex(base.surface) ? softenColor(base.surface, 'surface') : palette[3]),
    surface: validHex(base.surface) ? softenColor(base.surface, 'surface') : softenColor(palette[3], 'surface')
  };
  Object.assign(colors, normalizePalette(colors));
  const style = STYLE_TOKENS[(seed + index) % STYLE_TOKENS.length];
  const markIds = Object.keys(VECTOR_MARKS[style]);
  return {
    id: `${slug(options.companyName)}-${index + 1}`,
    name: ['Editorial Signature', 'Grounded Craft', 'Modern Signal', 'Expressive Form', 'Quiet Confidence'][index],
    mood: ['Distinctive · composed · memorable', 'Natural · tactile · assured', 'Clear · progressive · precise', 'Expressive · energetic · original', 'Understated · warm · enduring'][index],
    logoStyleToken: style,
    logoMarkId: markIds[(Math.floor(seed / STYLE_TOKENS.length) + index) % markIds.length],
    colors,
    typography: normalizeTypography(options.baseTypography, index, seed),
    rationale: { colors: 'A muted, brand-specific palette tuned for readable contrast and a calm, distinctive presence.', typography: 'A contrasting type pairing gives the identity a distinct voice while keeping everyday content legible.' }
  };
}
function normalizeDesignDirections(rawDirections, options = {}) {
  const input = Array.isArray(rawDirections) ? rawDirections.slice(0, 5) : [];
  const directions = [];
  const signatures = new Set();
  const usedStyles = new Set();
  const usedFontPairs = new Set();
  const usedMonoFonts = new Set();
  const usedPalettes = new Set();
  const seed = hashSeed(options.brandId || `${options.companyName || ''}|${options.industry || ''}`);
  for (let index = 0; index < 5; index += 1) {
    const raw = input[index] || {};
    let candidate = {
      ...generatedFallback(index, options),
      ...raw,
      colors: { ...generatedFallback(index, options).colors, ...(raw.colors || {}) },
      rationale: { ...generatedFallback(index, options).rationale, ...(raw.rationale || {}) }
    };
    if (!STYLE_TOKENS.includes(candidate.logoStyleToken) || usedStyles.has(candidate.logoStyleToken)) {
      candidate.logoStyleToken = STYLE_TOKENS.find((style) => !usedStyles.has(style)) || STYLE_TOKENS[index % STYLE_TOKENS.length];
    }
    usedStyles.add(candidate.logoStyleToken);
    const styleMarks = Object.keys(VECTOR_MARKS[candidate.logoStyleToken]);
    if (!styleMarks.includes(candidate.logoMarkId)) candidate.logoMarkId = styleMarks[index % styleMarks.length];
    candidate.id = `${slug(options.companyName)}-${index + 1}`;
    candidate.name = String(candidate.name || `Visual direction ${index + 1}`).slice(0, 48);
    candidate.mood = String(candidate.mood || 'Distinctive · considered · clear').slice(0, 90);
    candidate.colors = { ...candidate.colors, ...normalizePalette(candidate.colors) };
    candidate.typography = normalizeTypography(candidate.typography, index, seed);
    const fontPair = `${candidate.typography.display.family}|${candidate.typography.body.family}`.toLowerCase();
    if (usedFontPairs.has(fontPair)) {
      const [display, body] = FONT_PAIRS.find(([displayFamily, bodyFamily]) => !usedFontPairs.has(`${displayFamily}|${bodyFamily}`.toLowerCase())) || FONT_PAIRS[index % FONT_PAIRS.length];
      candidate.typography.display.family = display;
      candidate.typography.headline.family = body;
      candidate.typography.body.family = body;
    }
    usedFontPairs.add(`${candidate.typography.display.family}|${candidate.typography.body.family}`.toLowerCase());
    const monoName = String(candidate.typography.mono?.family || '').toLowerCase();
    if (usedMonoFonts.has(monoName)) {
      const alternateMono = MONO_FONTS.find((family) => !usedMonoFonts.has(family.toLowerCase()));
      if (alternateMono) candidate.typography.mono.family = alternateMono;
    }
    usedMonoFonts.add(String(candidate.typography.mono?.family || '').toLowerCase());
    const paletteSignature = ['primary', 'secondary', 'accent', 'surface'].map((role) => candidate.colors[role].toLowerCase()).join('|');
    if (usedPalettes.has(paletteSignature)) {
      candidate.colors = generatedFallback(index, { ...options, baseColors: candidate.colors }).colors;
    }
    usedPalettes.add(['primary', 'secondary', 'accent', 'surface'].map((role) => candidate.colors[role].toLowerCase()).join('|'));
    const signature = [candidate.colors.primary, candidate.colors.secondary, candidate.colors.accent, candidate.colors.surface, candidate.typography.display.family, candidate.typography.body.family, candidate.logoStyleToken, candidate.logoMarkId].join('|').toLowerCase();
    if (signatures.has(signature)) candidate = generatedFallback(index, options);
    signatures.add([candidate.colors.primary, candidate.colors.secondary, candidate.colors.accent, candidate.colors.surface, candidate.typography.display.family, candidate.typography.body.family, candidate.logoStyleToken].join('|').toLowerCase());
    directions.push(candidate);
  }
  return directions;
}

function ensureUniqueBrandIdentity(brandDNA, existingDnas = [], options = {}) {
  const directions = Array.isArray(brandDNA.designDirections) ? [...brandDNA.designDirections] : [];
  const lead = { ...(directions[0] || {}), colors: { ...(directions[0]?.colors || brandDNA.colors || {}) }, typography: { ...(directions[0]?.typography || brandDNA.typography || {}) } };
  const signature = (colors) => ['primary', 'secondary', 'accent', 'surface'].map((role) => String(colors?.[role] || '').toLowerCase()).join('|');
  const otherDirections = directions.slice(1);
  const occupiedPalettes = new Set([...existingDnas.map((item) => item.colors), ...otherDirections.map((item) => item.colors)].map(signature).filter((value) => value !== '|||'));
  const occupiedLogoMarks = new Set([...existingDnas, ...otherDirections].map((item) => [item.logoStyleToken || '', item.logoMarkId || ''].join('|').toLowerCase()));
  const occupiedDisplayFonts = new Set([...existingDnas, ...otherDirections].map((item) => item.typography?.display?.family).filter(Boolean).map((family) => family.toLowerCase()));
  const occupiedBodyFonts = new Set([...existingDnas, ...otherDirections].map((item) => item.typography?.body?.family).filter(Boolean).map((family) => family.toLowerCase()));
  const occupiedMonoFonts = new Set([...existingDnas, ...otherDirections].map((item) => item.typography?.mono?.family).filter(Boolean).map((family) => family.toLowerCase()));
  const baseOptions = { ...options, baseColors: lead.colors, baseTypography: lead.typography };

  lead.colors = { ...lead.colors, ...normalizePalette(lead.colors) };
  if (occupiedPalettes.has(signature(lead.colors))) {
    for (let attempt = 1; attempt <= 360; attempt += 1) {
      const alternate = generatedFallback(0, { ...baseOptions, brandId: String(options.brandId || options.companyName || 'brand') + '-palette-' + attempt });
      if (!occupiedPalettes.has(signature(alternate.colors))) {
        lead.colors = alternate.colors;
        lead.rationale = { ...(lead.rationale || {}), colors: alternate.rationale.colors };
        break;
      }
    }
  }

  const fontStart = hashSeed(options.brandId || options.companyName) % FONT_PAIRS.length;
  const fontPair = Array.from({ length: FONT_PAIRS.length }, (_, index) => FONT_PAIRS[(fontStart + index) % FONT_PAIRS.length])
    .find(([display, body]) => !occupiedDisplayFonts.has(display.toLowerCase()) && !occupiedBodyFonts.has(body.toLowerCase()));
  if (fontPair) {
    lead.typography.display = { ...(lead.typography.display || {}), family: fontPair[0] };
    lead.typography.headline = { ...(lead.typography.headline || {}), family: fontPair[1] };
    lead.typography.body = { ...(lead.typography.body || {}), family: fontPair[1] };
  }
  const monoFont = MONO_FONTS.find((family) => !occupiedMonoFonts.has(family.toLowerCase()));
  if (monoFont) lead.typography.mono = { ...(lead.typography.mono || {}), family: monoFont };
  lead.rationale = {
    ...(lead.rationale || {}),
    colors: 'A muted, brand-specific palette balances restrained hues with accessible contrast.',
    typography: 'A distinct display and body pairing gives the brand its own voice while keeping everyday copy legible.'
  };

  const styleStart = hashSeed(options.brandId || options.companyName) % STYLE_TOKENS.length;
  const logoChoices = Array.from({ length: STYLE_TOKENS.length }, (_, offset) => STYLE_TOKENS[(styleStart + offset) % STYLE_TOKENS.length])
    .flatMap((style) => Object.keys(VECTOR_MARKS[style]).map((mark) => ({ style, mark })));
  const logo = logoChoices.find(({ style, mark }) => !occupiedLogoMarks.has([style, mark].join('|').toLowerCase()));
  if (logo) {
    lead.logoStyleToken = logo.style;
    lead.logoMarkId = logo.mark;
  }

  directions[0] = lead;
  brandDNA.designDirections = directions;
  brandDNA.colors = { ...(brandDNA.colors || {}), ...lead.colors, background: lead.colors.surface, text: lead.colors.primary };
  brandDNA.typography = { ...(brandDNA.typography || {}), ...lead.typography, heading_font: lead.typography.display?.family, body_font: lead.typography.body?.family };
  brandDNA.logoStyleToken = lead.logoStyleToken || brandDNA.logoStyleToken;
  brandDNA.logoMarkId = lead.logoMarkId || brandDNA.logoMarkId;
  brandDNA.rationale = { ...(brandDNA.rationale || {}), ...(lead.rationale || {}) };
  return brandDNA;
}

module.exports = { normalizeDesignDirections, ensureUniqueBrandIdentity, contrastRatio, softenColor, ensureReadable, normalizePalette, rotateHue, hashSeed, FONT_PAIRS, MONO_FONTS, STYLE_TOKENS };
