import { useMemo } from 'react';

export const COALESCAL_TYPES = ['business_card', 'letterhead', 'envelope', 'social_post', 'social_story', 'social_banner', 'email_signature', 'presentation'];
const OPTIONAL_TEMPLATES = ['email_signature', 'presentation'];

export function mapCollateral(assets) {
  if (!assets || !Array.isArray(assets)) return [];
  const supportedAssets = assets.filter(a => COALESCAL_TYPES.includes(a.type));
  if (!supportedAssets.length) return [];
  const existingTypes = new Set(supportedAssets.map(asset => asset.type));
  const withOptionalTemplates = [
    ...supportedAssets,
    ...OPTIONAL_TEMPLATES
      .filter(type => !existingTypes.has(type))
      .map(type => ({ id: `template-${type}`, type, svgOrConfig: {}, isTemplate: true }))
  ];

  return withOptionalTemplates
    .map(asset => ({
      id: asset._id || asset.id || asset.type,
      name: formatAssetName(asset.type),
      type: asset.type,
      description: '',
      category: getCategory(asset.type),
      format: getFormat(asset.type),
      dimensions: getDimensions(asset.type),
      previewUrl: asset.cloudinaryUrl || '',
      frontUrl: asset.svgOrConfig?.front ? '' : (typeof asset.svgOrConfig === 'string' ? asset.svgOrConfig : asset.svgOrConfig?.svg || ''),
      backUrl: asset.svgOrConfig?.back ? '' : '',
      thumbnailUrl: asset.cloudinaryUrl || '',
      hasFront: Boolean(asset.svgOrConfig?.front),
      hasBack: Boolean(asset.svgOrConfig?.back),
      svgOrConfig: asset.svgOrConfig,
      metadata: {
        stock: asset.svgOrConfig?.substrate || asset.svgOrConfig?.paper || '',
        bleed: getCategory(asset.type) === 'Print' ? '0.125in' : 'None',
        resolution: getCategory(asset.type) === 'Print' ? '300 DPI' : 'Digital',
      },
      consistencyScore: asset.consistencyScore || 95,
      asset,
    }));
}

function formatAssetName(type) {
  const names = {
    business_card: 'Business Cards',
    letterhead: 'Letterhead',
    envelope: 'Envelope',
    social_post: 'Social Post',
    social_story: 'Social Story',
    social_banner: 'Social Banner',
    email_signature: 'Email Signature',
    presentation: 'Presentation Cover',
  };
  return names[type] || type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

function getCategory(type) {
  if (['business_card', 'letterhead', 'envelope'].includes(type)) return 'Print';
  if (['social_post', 'social_story', 'social_banner', 'email_signature', 'presentation'].includes(type)) return 'Digital';
  return 'General';
}

function getFormat(type) {
  const formats = {
    business_card: '3.5" × 2.0"',
    letterhead: 'A4 (210 × 297mm)',
    envelope: '#10 Commercial',
    social_post: '1080 × 1080',
    social_story: '1080 × 1920',
    social_banner: '1500 × 500',
    email_signature: 'HTML · 640 × 200',
    presentation: '16:9 · 1920 × 1080',
  };
  return formats[type] || '';
}

function getDimensions(type) {
  const dims = {
    business_card: '1050 × 600',
    letterhead: '2480 × 3508',
    envelope: '9.5 × 4.125',
    social_post: '1080 × 1080',
    social_story: '1080 × 1920',
    social_banner: '1500 × 500',
    email_signature: '640 × 200',
    presentation: '1920 × 1080',
  };
  return dims[type] || '';
}

export function filterCollateral(collateral, filter, search) {
  return collateral.filter(item => {
    const matchFilter = filter === 'All' || item.category === filter;
    const matchSearch = !search || item.name.toLowerCase().includes(search.toLowerCase()) ||
      (item.type && item.type.toLowerCase().includes(search.toLowerCase()));
    return matchFilter && matchSearch;
  });
}

export function useCollateral(assets) {
  const collateral = useMemo(() => mapCollateral(assets), [assets]);
  return { collateral };
}
