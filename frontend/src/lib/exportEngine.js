import JSZip from 'jszip';
import { pdf } from '@react-pdf/renderer';
import React from 'react';
import { buildBrandLogos } from './vectorEngine';
import { BrandGuidelinesPDFDocument } from '../components/export/BrandGuidelinesPDF';
import { readableTextColor } from './colorUtils';

/**
 * Generate and download the full brand identity .zip package
 */
export async function exportBrandKitZip(brand, consistency) {
  if (!brand || typeof brand !== 'object') {
    throw new Error('No brand identity is loaded. Select a brand and try again.');
  }
  const zip = new JSZip();
  const displayName = String(brand.companyName || brand.company_name || 'Your brand').trim() || 'Your brand';
  const companyName = displayName
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'brand';
  const logos = buildBrandLogos(brand);
  const colors = brand?.colors || {};
  const surface = colors.surface || colors.background || '#FFFFFF';
  const primary = colors.primary || '#111111';
  const secondary = colors.secondary || '#555555';
  const accent = colors.accent || '#FF4F00';
  const primaryInk = readableTextColor(primary, surface, '#171313');
  const secondaryInk = readableTextColor(secondary, surface, primaryInk);
  const accentInk = readableTextColor(accent, surface, primaryInk);
  const surfaceInk = readableTextColor(surface, primary, '#FFFFFF');
  const surfaceOnAccent = readableTextColor(surface, accent, primaryInk);
  const typography = brand?.typography || {};

  // 1. /logos/ folder
  const logoFolder = zip.folder('logos');
  logoFolder.file('logo-primary.svg', logos.primary);
  logoFolder.file('logo-stacked.svg', logos.stacked);
  logoFolder.file('logo-mark.svg', logos.mark);
  logoFolder.file('logo-mono-light.svg', logos.monoLight);
  logoFolder.file('logo-mono-dark.svg', logos.monoDark);
  logoFolder.file('LOGO-SPECS.txt', `EMBLEM BRAND LOGO SPECIFICATIONS
----------------------------------------
Company: ${brand?.companyName || brand?.company_name}
Date: ${new Date().toISOString()}

1. CLEAR SPACE SAFETY ZONE:
   - Minimum perimeter of 1x mark width must be maintained on all sides.
   - Do not place text, borders, or graphics within this protected perimeter.

2. MINIMUM DISPLAY SCALE:
   - Digital screens: Minimum 24px height.
   - Physical print: Minimum 15mm height.

3. COLOR INTEGRITY:
   - Use logo-primary.svg on white or surface backgrounds.
   - Use logo-mono-light.svg for single-color print on light paper.
   - Use logo-mono-dark.svg for dark mode interfaces or black substrates.
`);

  // 2. /stationery/ folder
  const stationeryFolder = zip.folder('stationery');
  const stationeryConfig = {
    businessCard: {
      dimensions: '3.5in x 2.0in (1050x600px)',
      substrate: '400gsm Heavyweight Cotton Stock',
      palette: brand?.colors
    },
    letterhead: {
      dimensions: '8.5in x 11in A4 (2480x3508px)',
      substrate: '120gsm Uncoated Linen',
      typography: brand?.typography
    },
    envelope: {
      dimensions: '#10 Commercial (9.5in x 4.125in)',
      substrate: '120gsm Matching Linen'
    }
  };
  stationeryFolder.file('stationery-specs.json', JSON.stringify(stationeryConfig, null, 2));

  // 3. /social/ folder
  const socialFolder = zip.folder('social');
  const socialConfig = {
    post: { width: 1080, height: 1080, format: 'Square 1:1' },
    story: { width: 1080, height: 1920, format: 'Vertical Story 9:16' },
    banner: { width: 1500, height: 500, format: 'Landscape Header' }
  };
  socialFolder.file('social-templates.json', JSON.stringify(socialConfig, null, 2));

  // 3a. /digital/ folder: ready-to-use email signature and presentation cover
  const digitalFolder = zip.folder('digital');
  const signatureEmail = `hello@${companyName.replace(/-/g, '')}.com`;
  const signatureWebsite = `www.${companyName.replace(/-/g, '')}.com`;
  const htmlEscape = (value = '') => String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]));
  const signatureHtml = `<!doctype html>
<html><body>
<table role="presentation" cellpadding="0" cellspacing="0" style="font-family:Arial,sans-serif;color:${primaryInk};border-left:4px solid ${accent};">
  <tr>
    <td style="padding:12px 18px;">
      <strong style="font-size:16px;">Alex Morgan</strong><br>
      <span style="font-size:12px;color:${secondaryInk};">Brand &amp; Communications</span><br>
      <a href="mailto:${signatureEmail}" style="font-size:12px;color:${primaryInk};text-decoration:none;">${signatureEmail}</a><br>
      <a href="https://${signatureWebsite}" style="font-size:12px;color:${accentInk};text-decoration:none;">${signatureWebsite}</a>
    </td>
    <td style="padding:12px 18px;border-left:1px solid #e8e2df;">
      <strong style="font-size:12px;letter-spacing:1px;">${htmlEscape(brand?.companyName || brand?.company_name || 'Your brand')}</strong><br>
      <span style="font-size:11px;color:#817679;">${htmlEscape(brand?.tagline || '')}</span>
    </td>
  </tr>
</table>
</body></html>`;
  digitalFolder.file('email-signature.html', signatureHtml);

  const brandName = htmlEscape(brand?.companyName || brand?.company_name || 'Your brand');
  const brandTagline = htmlEscape(brand?.tagline || 'A clearer way forward.');
  const brandMantra = htmlEscape(brand?.coreMantra || brand?.tagline || 'A clearer way forward.');
  const presentationCover = `<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080">
  <rect width="1920" height="1080" fill="${surface}"/><rect width="700" height="1080" fill="${primary}"/>
  <circle cx="1610" cy="170" r="500" fill="${accent}" opacity=".12"/><circle cx="1660" cy="180" r="340" fill="${accent}" opacity=".12"/>
  <rect x="110" y="112" width="112" height="112" rx="28" fill="${accent}"/>
  <svg x="135" y="137" width="62" height="62" viewBox="0 0 48 48"><g color="${surfaceOnAccent}">${logos.markPath}</g></svg>
  <text x="110" y="390" font-family="Arial,sans-serif" font-size="44" font-weight="700" letter-spacing="5" fill="${surfaceInk}">${brandName}</text>
  <text x="110" y="445" font-family="Arial,sans-serif" font-size="18" font-weight="700" letter-spacing="4" fill="${surfaceOnAccent}">BRAND PRESENTATION</text>
  <text x="840" y="500" font-family="Arial,sans-serif" font-size="74" font-weight="700" fill="${primaryInk}">${brandMantra}</text>
  <line x1="840" y1="610" x2="1630" y2="610" stroke="${accent}" stroke-width="8"/>
  <text x="840" y="710" font-family="Arial,sans-serif" font-size="30" fill="${secondaryInk}">${brandTagline}</text>
  <text x="840" y="980" font-family="Arial,sans-serif" font-size="18" font-weight="700" letter-spacing="4" fill="${secondaryInk}">A BRAND OVERVIEW</text>
  <text x="1760" y="980" text-anchor="end" font-family="Arial,sans-serif" font-size="18" font-weight="700" letter-spacing="2" fill="${primaryInk}">01 / 12</text>
</svg>`;
  digitalFolder.file('presentation-cover.svg', presentationCover);
  digitalFolder.file('README.txt', 'Email signature: open email-signature.html and copy the table into your email client signature settings.\nPresentation cover: import presentation-cover.svg into your slide editor, then duplicate the slide and replace the copy. The file uses editable vector shapes and text.\n');

  // 4. /tokens/ folder
  const tokenFolder = zip.folder('tokens');
  tokenFolder.file('brand-dna.json', JSON.stringify(brand, null, 2));

  const cssTokens = `/**
 * EMBLEM Design System Tokens
 * Brand: ${brand?.companyName || brand?.company_name}
 */
:root {
  /* Color Palette */
  --brand-color-primary: ${colors.primary || '#111111'};
  --brand-color-secondary: ${colors.secondary || '#555555'};
  --brand-color-accent: ${colors.accent || '#FF4F00'};
  --brand-color-surface: ${colors.surface || colors.background || '#FFFFFF'};

  /* Typography */
  --brand-font-display: "${typography.display?.family || typography.heading_font || 'Syne'}", sans-serif;
  --brand-font-body: "${typography.body?.family || typography.body_font || 'Inter'}", sans-serif;
  --brand-font-mono: "${typography.mono?.family || 'JetBrains Mono'}", monospace;

  /* Type Scale */
  --brand-text-display: ${typography.display?.size || 48}px;
  --brand-text-headline: ${typography.headline?.size || 28}px;
  --brand-text-body: ${typography.body?.size || 16}px;
  --brand-text-mono: ${typography.mono?.size || 12}px;
}
`;
  tokenFolder.file('tokens.css', cssTokens);

  const rawValues = brand?.coreValues || brand?.values || [];
  const values = Array.isArray(rawValues) ? rawValues : (rawValues ? [rawValues] : []);
  const valueNames = values.map(value => typeof value === 'string' ? value : value?.title).filter(Boolean);
  const personality = Array.isArray(brand?.personality) ? brand.personality : (brand?.personality ? [brand.personality] : []);
  const keywords = Array.isArray(brand?.keywords) && brand.keywords.length ? brand.keywords : personality;
  const packageReadme = `# ${brand?.companyName || brand?.company_name || 'Your brand'} — Brand Kit

> ${brand?.tagline || 'A clear point of view.'}

${brand?.coreMantra || brand?.missionStatement || brand?.visual_style_description || ''}

## Brand snapshot

- **Industry:** ${brand?.industry || '—'}
- **Audience:** ${brand?.targetAudience || brand?.audience || '—'}
- **Personality:** ${personality.join(', ') || '—'}
- **Keywords:** ${keywords.join(', ') || '—'}
- **Core values:** ${valueNames.join(', ') || '—'}

## Included

- \`logos/\` — primary, stacked, symbol, and monochrome SVG lockups with usage specifications
- \`stationery/\` — business card, letterhead, and envelope production specifications
- \`social/\` — post, story, and banner format specifications
- \`digital/\` — ready-to-copy email signature HTML and editable presentation cover SVG
- \`tokens/\` — complete Brand DNA JSON and CSS design tokens
- \`brand-guidelines.pdf\` — brand strategy, color, typography, and identity standards

Use the SVG files for scalable artwork. Replace the sample contact details in the email signature with your own before publishing.
`;
  zip.file('README.md', packageReadme);

  // 5. Generate Brand Guidelines PDF
  try {
    const blobPdf = await pdf(<BrandGuidelinesPDFDocument brand={brand} consistency={consistency} />).toBlob();
    zip.file('brand-guidelines.pdf', blobPdf);
  } catch (pdfErr) {
    console.warn('PDF generation failed, creating markdown fallback in zip:', pdfErr);
    zip.file('brand-guidelines.txt', `BRAND GUIDELINES FOR ${brand?.companyName || brand?.company_name}\nScore: ${consistency?.overallScore || 96}%\nTagline: ${brand?.tagline}`);
  }

  // Generate ZIP blob and trigger download
  const content = await zip.generateAsync({ type: 'blob' });
  const downloadUrl = URL.createObjectURL(content);
  const anchor = document.createElement('a');
  anchor.href = downloadUrl;
  anchor.download = `${companyName}-brand-kit.zip`;
  anchor.style.display = 'none';
  document.body.appendChild(anchor);
  anchor.click();
  window.setTimeout(() => {
    anchor.remove();
    URL.revokeObjectURL(downloadUrl);
  }, 60000);
}
