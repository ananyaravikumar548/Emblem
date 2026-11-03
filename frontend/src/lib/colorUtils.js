const isHexColor = (value) => typeof value === 'string' && /^#[\da-f]{6}$/i.test(value);

function relativeLuminance(hex) {
  if (!isHexColor(hex)) return 0;
  const rgb = [1, 3, 5].map((offset) => parseInt(hex.slice(offset, offset + 2), 16) / 255)
    .map((channel) => channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4);
  return rgb[0] * 0.2126 + rgb[1] * 0.7152 + rgb[2] * 0.0722;
}

export function contrastRatio(foreground, background) {
  const a = relativeLuminance(foreground);
  const b = relativeLuminance(background);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

export function readableTextColor(preferred, background, fallback = '#21191B') {
  if (isHexColor(preferred) && contrastRatio(preferred, background) >= 4.5) return preferred;
  return [fallback, '#FFFFFF', '#171313']
    .filter(isHexColor)
    .sort((a, b) => contrastRatio(b, background) - contrastRatio(a, background))[0] || '#171313';
}
