const Groq = require('groq-sdk');
const Brand = require('../models/Brand');
const BrandDNA = require('../models/BrandDNA');
const Asset = require('../models/Asset');
const ConsistencyReport = require('../models/ConsistencyReport');
const { VECTOR_MARKS, generateLogoSuite } = require('../services/vectorLogoService');
const { auditBrandConsistency } = require('../services/consistencyService');
const { normalizeDesignDirections, ensureUniqueBrandIdentity } = require('../services/designDirectionService');
const CURATED_PALETTES = require('../data/curatedPalettes');

// Initialize Groq SDK
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const isInvalidGroqKeyError = (error) => (
  error?.status === 401 ||
  error?.code === 'invalid_api_key' ||
  error?.error?.code === 'invalid_api_key'
);

const getGroqErrorMessage = (error) => {
  if (isInvalidGroqKeyError(error)) {
    return 'Groq rejected the API key configured in backend/.env. Replace GROQ_API_KEY with an active GroqCloud API key, then restart the backend.';
  }
  return error.message;
};

const COPY_STOP_WORDS = new Set(['this', 'that', 'with', 'from', 'your', 'their', 'they', 'them', 'into', 'about', 'which', 'when', 'where', 'what', 'while', 'will', 'have', 'has', 'for', 'the', 'and', 'our', 'are', 'was', 'were', 'who', 'how', 'can', 'its', 'through', 'every', 'more', 'than', 'brand', 'company']);
const meaningfulWords = (value = '', companyName = '') => {
  const companyWords = new Set(String(companyName).toLowerCase().split(/[^a-z0-9]+/).filter(Boolean));
  const words = String(value ?? '').toLowerCase().match(/[a-z0-9]+/g) || [];
  return new Set(words.filter((word) => word.length > 3 && !COPY_STOP_WORDS.has(word) && !companyWords.has(word)));
};
const echoesBrief = (copy, brief, companyName) => {
  const copyWords = meaningfulWords(copy, companyName);
  const briefWords = meaningfulWords(brief, companyName);
  if (copyWords.size < 3 || briefWords.size < 3) return false;
  let shared = 0;
  for (const word of copyWords) if (briefWords.has(word)) shared += 1;
  return shared >= 3 && shared / copyWords.size >= 0.5;
};

/**
 * Resolve a model that is active for this key and suitable for chat completions.
 * Keep speech, transcription, guard, and embedding models out of the chat picker.
 */
const getActiveGroqModel = async () => {
  let list;
  try {
    list = await groq.models.list();
  } catch (err) {
    throw new Error(`Could not list Groq models: ${getGroqErrorMessage(err)}`);
  }

  const activeIds = new Set((list.data || [])
    .filter((model) => model.active !== false)
    .map((model) => model.id));
  const excludedModelTerms = ['whisper', 'orpheus', 'speech', 'transcri', 'tts', 'audio', 'embedding', 'guard', 'safeguard', 'moderation'];
  const isChatModel = (id = '') => !excludedModelTerms.some((term) => id.toLowerCase().includes(term));
  const configuredModel = process.env.GROQ_MODEL;

  if (configuredModel && activeIds.has(configuredModel) && isChatModel(configuredModel)) {
    return configuredModel;
  }

  // Prefer current production chat models, but only when this API key reports them active.
  const priorityList = [
    'openai/gpt-oss-120b',
    'openai/gpt-oss-20b',
    'llama-3.3-70b-versatile',
    'qwen/qwen3.8-27b',
    'llama-3.1-8b-instant'
  ];
  const preferred = priorityList.find((id) => activeIds.has(id));
  if (preferred) return preferred;

  const availableChatModel = [...activeIds].find(isChatModel);
  if (availableChatModel) return availableChatModel;

  throw new Error('Groq returned no active chat models for this API key. Check the key and model access in GroqCloud.');
};

/**
 * Service function to synthesize elite-grade Brand DNA using Groq LLM
 */
const generateBrandDNAFromGroq = async ({ companyName, description, industry, targetAudience, brandId }) => {
  const selectedModel = await getActiveGroqModel();
  console.log(`[GeneratePipeline] Using resolved Groq model: ${selectedModel}`);

  const prompt = `
You are the Principal Design Director at Pentagram or Collins. You do not build generic corporate brands.
You design high-impact, iconic, award-winning brand systems with distinct aesthetic philosophies.

Brand Requirements:
- Name: "${companyName}"
- Industry: "${industry || 'Technology'}"
- Product Description: "${description}"
- Target Audience: "${targetAudience || 'Modern discerning professionals'}"

CRITICAL DESIGN LAWS YOU MUST FOLLOW:
1. COLOR PALETTE:
   - NEVER default to generic tech blue (#007BFF), basic purple (#6C5CE7), or bland gray dark modes (#121212).
   - First infer the brand's category, audience, price point, and personality. Build all five directions specifically for this brand; do not reuse standard palette templates or repeat the same palette across unrelated brands.
   - The five directions must explore meaningfully different color harmonies and light/dark balance while remaining coherent with this company's product and audience.
   - Use soft, muted, low-saturation palettes: mineral, botanical, ink, clay, soft blue, dusty rose, warm stone, and muted jewel tones.
   - Never use neon, electric, fluorescent, or hard primary colors. Keep accents restrained and surfaces calm, warm or cool neutrals.
   - Give primary, secondary, and accent clearly different color roles and hues; avoid making the swatches look like tints of one color. Keep primary and secondary text readable on the surface at WCAG AA. Treat accent as a highlight color, not default body text, and do not place accent text on primary backgrounds unless contrast is strong.

2. TYPOGRAPHY:
   - Give each visual direction its own appropriate display/body font pairing. Use real Google Fonts and vary the pairings across the five proposals; do not repeat one pair five times.
   - Choose type based on the brand's category and audience rather than a fixed list of archetypes.

3. VERBAL & POSITIONING:
   - BANNED BUZZWORDS: Avoid empty corporate filler like "innovative", "empower", "seamless", "cutting-edge", or "next-generation".
   - Write an original tagline, mission, and visual summary. Use the brief to understand the business, then express its value in fresh language. Do not copy, quote, summarize, or lightly reword any sentence or phrase from the description.
   - The tagline must be short, memorable, and commercially specific. The coreMantra must state the mission or belief behind the business, not repeat the tagline or the description. visualDirection and visual_style_description must describe a design idea, not restate the brief.

Return STRICTLY a JSON object matching this exact schema. The designDirections array must contain EXACTLY FIVE complete entries. Make every direction recognizably different in palette, typography, logo form, and art direction. Do not simply rename or slightly tint the same concept.
{
  "tagline": "A punchy, highly specific brand positioning statement",
  "targetAudience": "Detailed description of the target customer persona",
  "personality": ["Distinct Trait 1", "Distinct Trait 2", "Distinct Trait 3", "Distinct Trait 4", "Distinct Trait 5"],
  "coreValues": [
    { "title": "Value Title", "description": "Crisp 1-sentence principle" },
    { "title": "Value Title", "description": "Crisp 1-sentence principle" },
    { "title": "Value Title", "description": "Crisp 1-sentence principle" }
  ],
  "voiceTone": ["Tone 1", "Tone 2", "Tone 3"],
  "colors": {
    "primary": "#HEX",
    "secondary": "#HEX",
    "accent": "#HEX",
    "surface": "#HEX",
    "background": "#HEX",
    "text": "#HEX"
  },
  "typography": {
    "display": { "family": "Selected Google Font", "size": 52, "weight": "800" },
    "headline": { "family": "Selected Google Font", "size": 32, "weight": "700" },
    "body": { "family": "Selected Google Font", "size": 16, "weight": "400" },
    "mono": { "family": "JetBrains Mono", "size": 13, "weight": "500" },
    "heading_font": "Selected Google Font",
    "body_font": "Selected Google Font"
  },
  "coreMantra": "Inspirational mission statement",
  "visualDirection": "Detailed visual layout rules, elevation, contrast, and structural aesthetic style guide.",
  "visual_style_description": "A single evocative sentence describing the aesthetic feeling.",
  "logoStyleToken": "tech",
  "designDirections": [
    {
      "id": "direction-1",
      "name": "Short memorable direction name",
      "mood": "Three concise mood words",
      "logoStyleToken": "minimal",
      "logoMarkId": "geometric_prism",
      "colors": { "primary": "#HEX", "secondary": "#HEX", "accent": "#HEX", "surface": "#HEX" },
      "typography": {
        "display": { "family": "Google Font", "size": 48, "weight": "700" },
        "headline": { "family": "Google Font", "size": 28, "weight": "600" },
        "body": { "family": "Google Font", "size": 16, "weight": "400" },
        "mono": { "family": "IBM Plex Mono", "size": 12, "weight": "500" }
      },
      "rationale": { "colors": "Why these colors fit this brand", "typography": "Why this pairing fits this brand" }
    }
  ],
  "rationale": {
    "colors": "Strategic explanation for color palette and WCAG accessibility balance",
    "typography": "Rationale for font family pairings and character hierarchy",
    "tagline": "Positioning insight behind tagline",
    "personality": "Why these traits resonate with the target audience"
  }
}
`;

  const completion = await groq.chat.completions.create({
    model: selectedModel,
    messages: [
      {
        role: 'system',
        content: 'You are an award-winning Principal Design Director. Output strictly valid, highly polished JSON without markdown formatting or commentary.'
      },
      {
        role: 'user',
        content: prompt
      }
    ],
    response_format: { type: 'json_object' },
    temperature: 0.85
  });

  const responseContent = completion.choices[0]?.message?.content;
  if (!responseContent) {
    throw new Error('Received empty response from Groq API.');
  }

  const cleanJson = responseContent.replace(/```json\n?|\n?```/g, '').trim();
  const result = JSON.parse(cleanJson);
  if ([result.tagline, result.coreMantra, result.visualDirection, result.visual_style_description].some((copy) => echoesBrief(copy, description, companyName))) {
    try {
      const rewrite = await groq.chat.completions.create({
        model: selectedModel,
        messages: [
          { role: 'system', content: 'You are a senior brand copywriter. Write original, specific brand language. Never reuse wording from the supplied brief.' },
          { role: 'user', content: `Rewrite this brand tagline, mission, and visual summaries so they are memorable, specific, and clearly different from the source wording. Keep the business meaning, but do not copy or paraphrase its sentences. Return only JSON with tagline, coreMantra, visualDirection, and visual_style_description.\n\nBrand: ${companyName}\nIndustry: ${industry || 'General'}\nAudience: ${targetAudience || 'General audience'}\nSource brief: ${description}\nCurrent tagline: ${result.tagline}\nCurrent mission: ${result.coreMantra}\nCurrent visual summary: ${result.visualDirection}\nCurrent visual style: ${result.visual_style_description}` }
        ],
        response_format: { type: 'json_object' },
        temperature: 0.8
      });
      const revised = JSON.parse(rewrite.choices[0]?.message?.content || '{}');
      if (typeof revised.tagline === 'string' && revised.tagline.trim() && !echoesBrief(revised.tagline, description, companyName)) result.tagline = revised.tagline.trim();
      if (typeof revised.coreMantra === 'string' && revised.coreMantra.trim() && !echoesBrief(revised.coreMantra, description, companyName)) result.coreMantra = revised.coreMantra.trim();
      if (typeof revised.visualDirection === 'string' && revised.visualDirection.trim() && !echoesBrief(revised.visualDirection, description, companyName)) result.visualDirection = revised.visualDirection.trim();
      if (typeof revised.visual_style_description === 'string' && revised.visual_style_description.trim() && !echoesBrief(revised.visual_style_description, description, companyName)) result.visual_style_description = revised.visual_style_description.trim();
    } catch (error) {
      console.warn(`[GeneratePipeline] Copy refinement skipped: ${error.message}`);
    }
  }
  const designDirections = normalizeDesignDirections(result.designDirections, {
    companyName,
    brandId,
    industry,
    baseColors: result.colors,
    baseTypography: result.typography
  });
  const lead = designDirections[0];
  result.designDirections = designDirections;
  result.colors = { ...result.colors, ...lead.colors };
  result.typography = lead.typography;
  result.logoStyleToken = lead.logoStyleToken;
  result.logoMarkId = lead.logoMarkId;
  result.rationale = { ...result.rationale, ...lead.rationale };
  return result;
};

/**
 * List brands for the authenticated user
 */
exports.getUserBrands = async (req, res) => {
  try {
    const brands = await Brand.find({ userId: req.user.id }).sort({ updatedAt: -1 });
    return res.json({ success: true, brands });
  } catch (error) {
    console.error('[getUserBrands error]:', error);
    return res.status(500).json({ error: 'Failed to retrieve brands.' });
  }
};

/**
 * Create a new brand project draft
 */
exports.createBrand = async (req, res) => {
  try {
    const { companyName, description, industry, targetAudience } = req.body;
    if (!companyName || !description) {
      return res.status(400).json({ error: 'Company name and description are required.' });
    }

    const brand = new Brand({
      userId: req.user.id,
      companyName: companyName.trim(),
      description: description.trim(),
      industry: industry?.trim() || 'General',
      targetAudience: targetAudience?.trim() || 'General Audience',
      status: 'draft'
    });

    await brand.save();

    return res.status(201).json({ success: true, brand });
  } catch (error) {
    console.error('[createBrand error]:', error);
    return res.status(500).json({ error: 'Failed to create brand project.' });
  }
};

/**
 * Get brand details by ID, including DNA, assets, and consistency report
 */
exports.getBrandById = async (req, res) => {
  try {
    const { id } = req.params;
    const brand = await Brand.findOne({ _id: id, userId: req.user.id });
    if (!brand) {
      return res.status(404).json({ error: 'Brand not found or access denied.' });
    }

    const dna = await BrandDNA.findOne({ brandId: brand._id });
    const assets = await Asset.find({ brandId: brand._id });
    const consistency = await ConsistencyReport.findOne({ brandId: brand._id }).sort({ createdAt: -1 });

    return res.json({
      success: true,
      brand,
      dna,
      assets,
      consistency
    });
  } catch (error) {
    console.error('[getBrandById error]:', error);
    return res.status(500).json({ error: 'Failed to fetch brand details.' });
  }
};

/**
 * Full Brand Generation Pipeline
 */
exports.generateBrandAssets = async (req, res) => {
  try {
    const { id } = req.params;
    const brand = await Brand.findOne({ _id: id, userId: req.user.id });
    if (!brand) {
      return res.status(404).json({ error: 'Brand not found or access denied.' });
    }

    console.log(`[GeneratePipeline] Starting Groq generation for "${brand.companyName}" (${brand._id})`);

    // Step 1: Synthesize Brand DNA using Groq
    const dnaData = await generateBrandDNAFromGroq({
      companyName: brand.companyName,
      description: brand.description,
      industry: brand.industry,
      targetAudience: brand.targetAudience,
      brandId: String(brand._id)
    });

    const existingDnas = await BrandDNA.find({ brandId: { $ne: brand._id } })
      .select('colors typography logoStyleToken logoMarkId')
      .lean();
    ensureUniqueBrandIdentity(dnaData, existingDnas, {
      brandId: String(brand._id),
      companyName: brand.companyName,
      industry: brand.industry
    });

    // Upsert BrandDNA document
    const dna = await BrandDNA.findOneAndUpdate(
      { brandId: brand._id },
      { ...dnaData, brandId: brand._id },
      { new: true, upsert: true }
    );

    // Step 2: Generate Vector Logos
    const logoSuite = generateLogoSuite(brand, dna);

    // Delete existing assets before generating new suite
    await Asset.deleteMany({ brandId: brand._id });

    // Save Logo Assets
    const assetDocs = [];
    for (const [key, variant] of Object.entries(logoSuite.variants)) {
      assetDocs.push({
        brandId: brand._id,
        type: key,
        svgOrConfig: {
          svg: variant.svg,
          name: variant.name,
          dimensions: variant.dimensions,
          specs: logoSuite.specs
        },
        consistencyScore: 98
      });
    }

    // Generate Stationery and Social Assets
    const stationeryConfigs = [
      {
        type: 'business_card',
        svgOrConfig: {
          dimensions: '3.5in x 2.0in (1050x600)',
          front: {
            background: dna.colors.primary,
            logoVariant: 'logo_mark',
            accentBar: dna.colors.accent
          },
          back: {
            background: dna.colors.surface,
            textColor: dna.colors.primary,
            accentColor: dna.colors.accent,
            fontDisplay: dna.typography.display.family,
            fontBody: dna.typography.body.family,
            name: 'Alex Vance',
            title: 'Founding Partner & CEO',
            email: `contact@${brand.companyName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
            phone: '+1 (555) 249-8012',
            website: `www.${brand.companyName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`
          }
        },
        consistencyScore: 96
      },
      {
        type: 'letterhead',
        svgOrConfig: {
          dimensions: '8.5in x 11.0in A4 (2480x3508)',
          background: dna.colors.surface,
          primaryColor: dna.colors.primary,
          accentColor: dna.colors.accent,
          fontDisplay: dna.typography.display.family,
          fontBody: dna.typography.body.family,
          fontMono: dna.typography.mono.family,
          headerLogoVariant: 'logo_primary',
          tagline: dna.tagline
        },
        consistencyScore: 97
      },
      {
        type: 'envelope',
        svgOrConfig: {
          dimensions: '#10 Commercial (9.5in x 4.125in)',
          background: dna.colors.surface,
          primaryColor: dna.colors.primary,
          accentColor: dna.colors.accent,
          fontDisplay: dna.typography.display.family,
          fontBody: dna.typography.body.family,
          logoVariant: 'logo_primary'
        },
        consistencyScore: 95
      },
      {
        type: 'social_post',
        svgOrConfig: {
          dimensions: '1080x1080 Square',
          background: dna.colors.primary,
          textColor: dna.colors.surface,
          accentColor: dna.colors.accent,
          headline: dna.coreMantra,
          subhead: dna.tagline
        },
        consistencyScore: 94
      },
      {
        type: 'social_story',
        svgOrConfig: {
          dimensions: '1080x1920 Vertical Story',
          background: dna.colors.surface,
          textColor: dna.colors.primary,
          accentColor: dna.colors.accent,
          headline: dna.coreMantra,
          subhead: dna.tagline
        },
        consistencyScore: 95
      },
      {
        type: 'social_banner',
        svgOrConfig: {
          dimensions: '1500x500 Header Banner',
          background: dna.colors.primary,
          textColor: dna.colors.surface,
          accentColor: dna.colors.accent,
          headline: brand.companyName,
          subhead: dna.tagline
        },
        consistencyScore: 96
      }
    ];

    for (const item of stationeryConfigs) {
      assetDocs.push({
        brandId: brand._id,
        type: item.type,
        svgOrConfig: item.svgOrConfig,
        consistencyScore: item.consistencyScore
      });
    }

    const savedAssets = await Asset.insertMany(assetDocs);

    // Step 3: Run Consistency Audit Engine
    const auditReport = auditBrandConsistency(dna, savedAssets);

    const consistency = await ConsistencyReport.create({
      brandId: brand._id,
      overallScore: auditReport.overallScore,
      colorScore: auditReport.colorScore,
      typographyScore: auditReport.typographyScore,
      logoScore: auditReport.logoScore,
      checks: auditReport.checks
    });

    // Update brand status
    brand.status = 'generated';
    await brand.save();

    console.log(`[GeneratePipeline] Successfully completed Groq generation for "${brand.companyName}". Overall score: ${auditReport.overallScore}%`);

    return res.json({
      success: true,
      brand,
      dna,
      assets: savedAssets,
      consistency,
      auditReport
    });
  } catch (error) {
    console.error('[generateBrandAssets error]:', error);
    return res.status(isInvalidGroqKeyError(error) ? 502 : 500).json({
      error: `Generation pipeline failed: ${getGroqErrorMessage(error)}`
    });
  }
};

/**
 * Get Consistency Report for a brand
 */
exports.getConsistencyReport = async (req, res) => {
  try {
    const { id } = req.params;
    const brand = await Brand.findOne({ _id: id, userId: req.user.id });
    if (!brand) {
      return res.status(404).json({ error: 'Brand not found.' });
    }

    const dna = await BrandDNA.findOne({ brandId: brand._id });
    if (!dna) {
      return res.status(404).json({ error: 'Brand DNA has not been generated yet.' });
    }

    const assets = await Asset.find({ brandId: brand._id });
    const auditReport = auditBrandConsistency(dna, assets);

    const consistency = await ConsistencyReport.create({
      brandId: brand._id,
      overallScore: auditReport.overallScore,
      colorScore: auditReport.colorScore,
      typographyScore: auditReport.typographyScore,
      logoScore: auditReport.logoScore,
      checks: auditReport.checks
    });

    return res.json({
      success: true,
      consistency,
      auditReport
    });
  } catch (error) {
    console.error('[getConsistencyReport error]:', error);
    return res.status(500).json({ error: 'Failed to evaluate consistency.' });
  }
};

/** Persist a selected visual direction and refresh assets that depend on it. */
exports.updateBrandDirection = async (req, res) => {
  try {
    const { id } = req.params;
    const brand = await Brand.findOne({ _id: id, userId: req.user.id });
    if (!brand) return res.status(404).json({ error: 'Brand not found or access denied.' });

    const dna = await BrandDNA.findOne({ brandId: brand._id });
    if (!dna) return res.status(404).json({ error: 'Brand DNA has not been generated yet.' });

    const { direction } = req.body || {};
    const allowedStyles = ['minimal', 'tech', 'luxury', 'organic', 'bold'];
    const validHex = (value) => typeof value === 'string' && /^#[\da-f]{3}(?:[\da-f]{3}|[\da-f]{5})?$/i.test(value);
    if (!direction || !direction.id || !direction.colors || !direction.typography) {
      return res.status(400).json({ error: 'A complete design direction is required.' });
    }
    if (!allowedStyles.includes(direction.logoStyleToken) || !['primary', 'secondary', 'accent', 'surface'].every((key) => validHex(direction.colors[key]))) {
      return res.status(400).json({ error: 'The design direction contains an invalid logo style or color.' });
    }
    const styleMarks = VECTOR_MARKS[direction.logoStyleToken] || {};
    if (direction.logoMarkId && !Object.prototype.hasOwnProperty.call(styleMarks, direction.logoMarkId)) {
      const foundStyle = Object.keys(VECTOR_MARKS).find((st) => Object.prototype.hasOwnProperty.call(VECTOR_MARKS[st], direction.logoMarkId));
      if (foundStyle) {
        direction.logoStyleToken = foundStyle;
      } else {
        return res.status(400).json({ error: 'The selected logo mark is not recognized.' });
      }
    }
    const fontFamilies = ['display', 'headline', 'body', 'mono'];
    if (!fontFamilies.every((key) => typeof direction.typography[key]?.family === 'string' && direction.typography[key].family.trim().length > 0 && direction.typography[key].family.length <= 80)) {
      return res.status(400).json({ error: 'The design direction contains an invalid font pairing.' });
    }

    const currentDna = dna.toObject();
    dna.colors = {
      ...currentDna.colors,
      ...direction.colors,
      background: direction.colors.surface,
      text: direction.colors.primary
    };
    dna.typography = {
      ...currentDna.typography,
      ...direction.typography,
      heading_font: direction.typography.display.family,
      body_font: direction.typography.body.family
    };
    dna.logoStyleToken = direction.logoStyleToken;
    dna.logoMarkId = direction.logoMarkId || '';
    dna.designDirection = String(direction.id).slice(0, 60);
    dna.paletteId = typeof direction.paletteId === 'string' ? direction.paletteId : '';
    const previousRationale = currentDna.rationale || {};
    const directionRationale = direction.rationale || {};
    const rationaleText = (value, fallback) => typeof value === 'string' && value.trim() ? value.trim() : fallback;
    const personalitySummary = Array.isArray(currentDna.personality) && currentDna.personality.length
      ? currentDna.personality.join(', ')
      : 'the brand’s established personality';
    dna.rationale = {
      colors: rationaleText(directionRationale.colors, rationaleText(previousRationale.colors, 'This palette refresh keeps the identity aligned with the selected visual direction.')),
      typography: rationaleText(directionRationale.typography, rationaleText(previousRationale.typography, 'This type pairing keeps the identity aligned with the selected visual direction.')),
      tagline: rationaleText(previousRationale.tagline, `The tagline supports the brand’s positioning: ${dna.tagline || brand.companyName}.`),
      personality: rationaleText(previousRationale.personality, `The established identity reflects ${personalitySummary}.`)
    };
    await dna.save();

    const logoSuite = generateLogoSuite(brand, dna);
    const assets = await Asset.find({ brandId: brand._id });
    const variantByType = logoSuite.variants;
    for (const asset of assets) {
      const config = asset.svgOrConfig && typeof asset.svgOrConfig === 'object' ? { ...asset.svgOrConfig } : {};
      if (variantByType[asset.type]) {
        const variant = variantByType[asset.type];
        asset.svgOrConfig = { ...config, svg: variant.svg, name: variant.name, dimensions: variant.dimensions, specs: logoSuite.specs };
      } else if (asset.type === 'business_card') {
        config.front = { ...config.front, background: dna.colors.primary, accentBar: dna.colors.accent };
        config.back = { ...config.back, background: dna.colors.surface, textColor: dna.colors.primary, accentColor: dna.colors.accent, fontDisplay: dna.typography.display.family, fontBody: dna.typography.body.family };
        asset.svgOrConfig = config;
      } else if (asset.type === 'letterhead' || asset.type === 'envelope') {
        asset.svgOrConfig = { ...config, background: dna.colors.surface, primaryColor: dna.colors.primary, accentColor: dna.colors.accent, fontDisplay: dna.typography.display.family, fontBody: dna.typography.body.family, fontMono: dna.typography.mono.family };
      } else if (asset.type.startsWith('social_')) {
        const inverse = asset.type === 'social_post' || asset.type === 'social_banner';
        asset.svgOrConfig = { ...config, background: inverse ? dna.colors.primary : dna.colors.surface, textColor: inverse ? dna.colors.surface : dna.colors.primary, accentColor: dna.colors.accent, fontDisplay: dna.typography.display.family, fontBody: dna.typography.body.family };
      }
      await asset.save();
    }

    const auditReport = auditBrandConsistency(dna, assets);
    const consistency = await ConsistencyReport.create({
      brandId: brand._id,
      overallScore: auditReport.overallScore,
      colorScore: auditReport.colorScore,
      typographyScore: auditReport.typographyScore,
      logoScore: auditReport.logoScore,
      checks: auditReport.checks
    });
    return res.json({ success: true, dna, assets, consistency });
  } catch (error) {
    console.error('[updateBrandDirection error]:', error);
    return res.status(500).json({ error: 'Failed to apply this brand direction.' });
  }
};

/** Apply a curated palette while keeping the selected brand's typography and logo. */
exports.updateBrandPalette = async (req, res) => {
  try {
    const palette = CURATED_PALETTES.find((item) => item.id === req.body?.paletteId);
    if (!palette) return res.status(400).json({ error: 'Choose one of the available curated palettes.' });

    const brand = await Brand.findOne({ _id: req.params.id, userId: req.user.id });
    if (!brand) return res.status(404).json({ error: 'Brand not found or access denied.' });
    const dna = await BrandDNA.findOne({ brandId: brand._id });
    if (!dna) return res.status(404).json({ error: 'Brand DNA has not been generated yet.' });

    req.body = {
      direction: {
        id: dna.designDirection || `brand-${brand._id}`,
        name: palette.name,
        mood: palette.industry,
        paletteId: palette.id,
        colors: { ...palette.colors },
        typography: dna.typography,
        logoStyleToken: dna.logoStyleToken,
        logoMarkId: dna.logoMarkId,
        rationale: {
          colors: `${palette.name} palette for ${palette.industry}. Curated brand colors are preserved exactly as supplied.`,
          typography: dna.rationale?.typography || 'The existing type system remains paired with the selected palette.'
        }
      }
    };
    return await exports.updateBrandDirection(req, res);
  } catch (error) {
    console.error('[updateBrandPalette error]:', error);
    return res.status(500).json({ error: 'Failed to apply this palette.' });
  }
};

/**
 * Delete brand and all related records
 */
exports.deleteBrand = async (req, res) => {
  try {
    const { id } = req.params;
    const brand = await Brand.findOneAndDelete({ _id: id, userId: req.user.id });
    if (!brand) {
      return res.status(404).json({ error: 'Brand not found or unauthorized.' });
    }

    await BrandDNA.deleteMany({ brandId: brand._id });
    await Asset.deleteMany({ brandId: brand._id });
    await ConsistencyReport.deleteMany({ brandId: brand._id });

    return res.json({ success: true, message: 'Brand deleted successfully.' });
  } catch (error) {
    console.error('[deleteBrand error]:', error);
    return res.status(500).json({ error: 'Failed to delete brand.' });
  }
};
