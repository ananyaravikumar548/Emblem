const { GoogleGenerativeAI } = require('@google/generative-ai');
const { softenColor, ensureReadable, rotateHue, hashSeed, FONT_PAIRS, MONO_FONTS, STYLE_TOKENS } = require('./designDirectionService');
const { VECTOR_MARKS } = require('./vectorLogoService');

/**
 * Validate hex color code format
 */
function isValidHex(hex) {
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex);
}

/**
 * Fallback deterministic Brand DNA generator
 * Used if GEMINI_API_KEY is not configured or fails.
 */
function generateFallbackBrandDNA(companyName, description = '', industry = 'Technology') {
  const normIndustry = (industry || '').toLowerCase();
  const descLower = (description || '').toLowerCase();

  // Industry-inspired intelligent palette profiles
  const profiles = {
    tech: {
      colors: { primary: '#0F172A', secondary: '#536273', accent: '#788F93', surface: '#F8FAFC' },
      displayFont: 'Syne',
      headlineFont: 'Plus Jakarta Sans',
      bodyFont: 'Inter',
      logoStyleToken: 'tech',
      personality: ['Innovative', 'Architectural', 'Intelligent', 'Precise', 'Visionary'],
      voiceTone: ['Authoritative yet approachable', 'Crisp and precise', 'Forward-looking', 'Objective'],
      values: [
        { title: 'Systematic Precision', description: 'Engineered solutions with zero ambiguity and relentless attention to detail.' },
        { title: 'Continuous Evolution', description: 'Pioneering architectures that scale seamlessly with future demands.' },
        { title: 'Human Centricity', description: 'Translating complex computational capability into intuitive digital clarity.' }
      ],
      rationale: {
        colors: 'Slate navy grounds the palette, while muted blue-gray and mineral accents keep the system calm and readable against a cool surface.',
        typography: 'Syne delivers a modern brutalist headline punch, while Plus Jakarta Sans and Inter guarantee readability across high-density digital dashboards.',
        tagline: 'Synthesizes enterprise-grade capability with frictionless user velocity.',
        personality: 'Combines technical rigour with visionary optimism to inspire customer confidence.'
      }
    },
    luxury: {
      colors: { primary: '#18181B', secondary: '#71717A', accent: '#D4AF37', surface: '#FAFAFA' },
      displayFont: 'Playfair Display',
      headlineFont: 'Cinzel',
      bodyFont: 'Cormorant Garamond',
      logoStyleToken: 'luxury',
      personality: ['Sophisticated', 'Artisanal', 'Exclusive', 'Discerning', 'Timeless'],
      voiceTone: ['Refined and elevated', 'Understated confidence', 'Poetic and deliberate'],
      values: [
        { title: 'Exacting Craftsmanship', description: 'Uncompromising dedication to heritage materials and immaculate finishes.' },
        { title: 'Curated Rarity', description: 'Bespoke experiences crafted exclusively for the discerning few.' },
        { title: 'Quiet Distinction', description: 'Elegance articulated through proportion and subtlety, never noise.' }
      ],
      rationale: {
        colors: 'Deep obsidian (#18181B) provides an editorial anchor, warm neutral (#71717A) softens layout borders, and imperial gold (#D4AF37) delivers tactile prestige.',
        typography: 'Playfair Display with Cinzel evokes timeless editorial prestige and artisanal heritage.',
        tagline: 'Distills quiet opulence into enduring aesthetic value.',
        personality: 'Cultivates an aura of timeless luxury and deliberate curation.'
      }
    },
    organic: {
      colors: { primary: '#143525', secondary: '#536B58', accent: '#9D7955', surface: '#FBFDF9' },
      displayFont: 'Fraunces',
      headlineFont: 'Cabinet Grotesk',
      bodyFont: 'Newsreader',
      logoStyleToken: 'organic',
      personality: ['Earthbound', 'Conscious', 'Vital', 'Holistic', 'Authentic'],
      voiceTone: ['Nurturing and grounded', 'Transparent and direct', 'Warm and restorative'],
      values: [
        { title: 'Ecological Integrity', description: 'Radical traceability and respect for natural regenerative cycles.' },
        { title: 'Pure Transparency', description: 'Honest sourcing, unvarnished ingredients, and clear accountability.' },
        { title: 'Holistic Vitality', description: 'Nourishing sustainable well-being for both individual and community.' }
      ],
      rationale: {
        colors: 'Deep forest and moss tones pair with muted clay for a grounded, nature-led system.',
        typography: 'Fraunces soft serif curves pair harmoniously with Newsreader for a tactile, editorial earthiness.',
        tagline: 'Honors nature-led principles in every conscious touchpoint.',
        personality: 'Inspires deep trust through organic authenticity and unhurried craft.'
      }
    },
    bold: {
      colors: { primary: '#0A0A0A', secondary: '#765B50', accent: '#A18A67', surface: '#FFFFFF' },
      displayFont: 'Clash Display',
      headlineFont: 'Cabinet Grotesk',
      bodyFont: 'Space Grotesk',
      logoStyleToken: 'bold',
      personality: ['Unapologetic', 'Dynamic', 'High-Energy', 'Defiant', 'Impactful'],
      voiceTone: ['Direct and punchy', 'Provocative and energetic', 'No fluff, high conviction'],
      values: [
        { title: 'Relentless Velocity', description: 'Move swiftly, ship fearlessly, and break conventional inertia.' },
        { title: 'Zero Compromise', description: 'Reject mediocre templates in favor of explosive visual impact.' },
        { title: 'Audacious Impact', description: 'Command attention in crowded markets through radical distinction.' }
      ],
      rationale: {
        colors: 'Soft charcoal and weathered clay create a confident, high-contrast system without relying on fluorescent color.',
        typography: 'Clash Display and Space Grotesk deliver high-voltage poster energy and brutalist punch.',
        tagline: 'Engineered for high velocity and defiant disruption.',
        personality: 'Defies industry conventions with high-octane visual dominance.'
      }
    },
    minimal: {
      colors: { primary: '#111111', secondary: '#52525B', accent: '#718091', surface: '#FFFFFF' },
      displayFont: 'Syne',
      headlineFont: 'Plus Jakarta Sans',
      bodyFont: 'Inter',
      logoStyleToken: 'minimal',
      personality: ['Rational', 'Essentialist', 'Clear', 'Functional', 'Focused'],
      voiceTone: ['Calm clarity', 'Minimalist precision', 'Thoughtful restraint'],
      values: [
        { title: 'Essential Reduction', description: 'Stripping away decorative distraction to reveal the core signal.' },
        { title: 'Flawless Function', description: 'Form follows function with immaculate typography and spatial balance.' },
        { title: 'Universal Longevity', description: 'Design engineered to outlast cyclical trends.' }
      ],
      rationale: {
        colors: 'Architectural charcoal and soft stone are balanced by a restrained blue-gray accent for clear hierarchy.',
        typography: 'Syne geometric display anchored by Swiss typography principles in Inter.',
        tagline: 'Clarity distilled into pure commercial momentum.',
        personality: 'Offers a steady, reassuring compass in an era of digital noise.'
      }
    }
  };

  // Determine key profile
  let chosenKey = 'minimal';
  if (normIndustry.includes('tech') || normIndustry.includes('software') || normIndustry.includes('ai') || descLower.includes('platform') || descLower.includes('data')) {
    chosenKey = 'tech';
  } else if (normIndustry.includes('luxury') || normIndustry.includes('fashion') || normIndustry.includes('jewelry') || descLower.includes('premium') || descLower.includes('heritage')) {
    chosenKey = 'luxury';
  } else if (normIndustry.includes('eco') || normIndustry.includes('food') || normIndustry.includes('health') || normIndustry.includes('wellness') || descLower.includes('organic') || descLower.includes('nature')) {
    chosenKey = 'organic';
  } else if (normIndustry.includes('sport') || normIndustry.includes('creative') || normIndustry.includes('media') || descLower.includes('bold') || descLower.includes('disrupt')) {
    chosenKey = 'bold';
  }

  const profile = profiles[chosenKey];
  const seed = hashSeed(`${companyName}|${industry}|${description}`);
  const surface = softenColor(rotateHue(profile.colors.surface, seed % 360), 'surface');
  const colors = {
    primary: ensureReadable(softenColor(rotateHue(profile.colors.primary, seed % 360), 'primary'), surface),
    secondary: ensureReadable(softenColor(rotateHue(profile.colors.secondary, seed % 360), 'secondary'), surface),
    accent: ensureReadable(softenColor(rotateHue(profile.colors.accent, seed % 360), 'accent'), surface),
    surface
  };
  const fontPair = FONT_PAIRS[seed % FONT_PAIRS.length];
  const logoStyleToken = STYLE_TOKENS[seed % STYLE_TOKENS.length];
  const logoMarkId = Object.keys(VECTOR_MARKS[logoStyleToken])[Math.floor(seed / STYLE_TOKENS.length) % Object.keys(VECTOR_MARKS[logoStyleToken]).length];

  return {
    personality: profile.personality,
    coreValues: profile.values,
    voiceTone: profile.voiceTone,
    colors,
    typography: {
      display: { family: fontPair[0], size: 48, weight: 'Bold' },
      headline: { family: fontPair[1], size: 28, weight: 'SemiBold' },
      body: { family: fontPair[1], size: 16, weight: 'Regular' },
      mono: { family: MONO_FONTS[seed % MONO_FONTS.length], size: 12, weight: 'Medium' }
    },
    tagline: `${companyName} — ${chosenKey === 'tech' ? 'Architecting the Future of Intelligence' : chosenKey === 'luxury' ? 'The Epitome of Modern Refinement' : chosenKey === 'organic' ? 'Nourishing Harmony with Nature' : chosenKey === 'bold' ? 'Defying the Ordinary with Power' : 'Precision in Every Dimension'}`,
    coreMantra: `${companyName} champions clarity, distinction, and uncompromising quality in every interaction.`,
    visualDirection: `A ${chosenKey} design language characterized by disciplined grid structures, high-contrast typography, and deliberate negative space.`,
    logoStyleToken,
    logoMarkId,
    rationale: {
      ...profile.rationale,
      colors: 'A muted, brand-specific palette uses tonal contrast and a restrained accent to keep the system calm, clear, and recognizable.'
    }
  };
}

/**
 * Validates whether the returned Brand DNA structure satisfies all requirements
 */
function validateBrandDNA(dna) {
  if (!dna || typeof dna !== 'object') return false;

  // Check personality
  if (!Array.isArray(dna.personality) || dna.personality.length < 3) return false;

  // Check coreValues
  if (!Array.isArray(dna.coreValues) || dna.coreValues.length < 2) return false;
  for (const v of dna.coreValues) {
    if (!v.title || !v.description) return false;
  }

  // Check voiceTone
  if (!Array.isArray(dna.voiceTone) || dna.voiceTone.length < 2) return false;

  // Check colors
  if (!dna.colors || !isValidHex(dna.colors.primary) || !isValidHex(dna.colors.secondary) || !isValidHex(dna.colors.accent) || !isValidHex(dna.colors.surface)) {
    return false;
  }

  // Check typography
  if (!dna.typography?.display?.family || !dna.typography?.body?.family) return false;

  // Check strings
  if (!dna.tagline || !dna.coreMantra || !dna.visualDirection) return false;

  // Check logoStyleToken
  const validTokens = ['minimal', 'tech', 'luxury', 'organic', 'bold'];
  if (!validTokens.includes(dna.logoStyleToken)) {
    dna.logoStyleToken = 'minimal';
  }

  // Check rationale
  if (!dna.rationale || !dna.rationale.colors || !dna.rationale.typography || !dna.rationale.tagline || !dna.rationale.personality) {
    return false;
  }

  return true;
}

/**
 * Main Gemini AI Brand DNA synthesis function
 */
async function generateBrandDNAFromGemini({ companyName, description, industry, targetAudience }) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey.trim() === '' || apiKey === 'YOUR_GEMINI_API_KEY') {
    console.log('[GeminiService] No valid GEMINI_API_KEY configured. Utilizing deterministic Brand DNA engine.');
    return generateFallbackBrandDNA(companyName, description, industry);
  }

  const prompt = `
You are an award-winning executive Creative Director and Brand Identity Strategist at a premier design agency.
Generate a comprehensive, production-grade Brand DNA for the following venture:

Company Name: "${companyName}"
Description: "${description}"
Industry: "${industry || 'General'}"
Target Audience: "${targetAudience || 'General Audience'}"

CRITICAL REQUIREMENTS:
1. Colors: Return 4 hex codes (primary, secondary, accent, surface) in a soft, muted, low-saturation palette with clearly differentiated roles and hues. Avoid four neighboring tints, neon, fluorescent, electric, and hard primary colors.
   - "primary" and "secondary" must contrast strongly with "surface" (WCAG 2.1 AA minimum 4.5:1 ratio, ideally 7:1+). Accent is a highlight color, not default body text.
   - "surface" should usually be an off-white, light cream, or deep dark background if dark mode.
   - All colors must be valid 6-character hex strings starting with #.
2. Typography: Return families for display, headline, body, and mono from Google Fonts (e.g. Syne, Plus Jakarta Sans, Inter, JetBrains Mono, Clash Display, Playfair Display, Space Grotesk, Cabinet Grotesk).
3. logoStyleToken: Must be exactly one of: "minimal", "tech", "luxury", "organic", "bold".
4. Rationale: Provide expert strategic design rationale for:
   - "colors": Why these hues evoke the desired psychological sentiment and how contrast is achieved.
   - "typography": Why these typefaces fit the brand character and readability requirements.
   - "tagline": The core brand positioning narrative distilled.
   - "personality": How these traits differentiate the brand in its market.

Return ONLY a valid, parseable JSON object matching this exact schema:
{
  "personality": ["string", "string", "string", "string", "string"],
  "coreValues": [
    { "title": "string", "description": "string" },
    { "title": "string", "description": "string" },
    { "title": "string", "description": "string" }
  ],
  "voiceTone": ["string", "string", "string"],
  "colors": {
    "primary": "#111111",
    "secondary": "#586A64",
    "accent": "#8A6254",
    "surface": "#FFFFFF"
  },
  "typography": {
    "display": { "family": "Syne", "size": 48, "weight": "Bold" },
    "headline": { "family": "Plus Jakarta Sans", "size": 28, "weight": "SemiBold" },
    "body": { "family": "Inter", "size": 16, "weight": "Regular" },
    "mono": { "family": "JetBrains Mono", "size": 12, "weight": "Medium" }
  },
  "tagline": "string",
  "coreMantra": "string",
  "visualDirection": "string",
  "logoStyleToken": "minimal",
  "rationale": {
    "colors": "string",
    "typography": "string",
    "tagline": "string",
    "personality": "string"
  }
}
Do not wrap in markdown quotes if possible, output pure JSON.
`.trim();

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.7
      }
    });

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    // Clean any surrounding backticks just in case
    const cleanedJson = text.replace(/^```json/i, '').replace(/^```/, '').replace(/```$/, '').trim();
    const parsed = JSON.parse(cleanedJson);

    if (validateBrandDNA(parsed)) {
      console.log(`[GeminiService] Successfully generated valid Brand DNA via Gemini API for "${companyName}".`);
      return parsed;
    } else {
      console.warn('[GeminiService] Gemini output failed schema validation. Falling back to deterministic engine.');
      return generateFallbackBrandDNA(companyName, description, industry);
    }
  } catch (error) {
    console.error(`[GeminiService] Error contacting Gemini API: ${error.message}. Using deterministic fallback.`);
    return generateFallbackBrandDNA(companyName, description, industry);
  }
}

module.exports = {
  generateBrandDNAFromGemini,
  generateFallbackBrandDNA,
  validateBrandDNA,
  isValidHex
};
