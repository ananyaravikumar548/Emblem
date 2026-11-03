import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { auditBrandConsistency } from '../lib/consistencyAuditor';
import { exportBrandKitZip } from '../lib/exportEngine';

const API_BASE = process.env.REACT_APP_API_URL || (process.env.NODE_ENV === 'production' ? '/api/v1' : 'http://localhost:5001/api/v1');

const BrandContext = createContext();

// Default Initial Brand (NOVA)
export const DEFAULT_BRAND = {
  id: 'demo-nova-001',
  companyName: 'NOVA',
  company_name: 'NOVA',
  tagline: 'Sustainable energy architecture for the next era.',
  industry: 'CleanTech',
  targetAudience: 'Enterprise ESG Leaders & Sustainable Cities',
  personality: ['Modern', 'Architectural', 'Intelligent', 'Sustainable', 'Visionary'],
  coreValues: [
    { title: 'Radical Transparency', description: 'Zero greenwashing with real-time carbon telemetry and open audit logs.' },
    { title: 'Generative Harmony', description: 'Power systems engineered to regenerate local ecosystems and communities.' },
    { title: 'Flawless Reliability', description: 'Mission-critical energy storage with 99.999% uptime guarantee.' }
  ],
  voiceTone: ['Authoritative yet approachable', 'Crisp and precise', 'Forward-looking'],
  colors: {
    primary: '#0F172A',
    secondary: '#1E293B',
    accent: '#738F80',
    surface: '#F8FAFC',
    background: '#F8FAFC',
    text: '#0F172A'
  },
  typography: {
    display: { family: 'Syne', size: 48, weight: 'Bold' },
    headline: { family: 'Plus Jakarta Sans', size: 28, weight: 'SemiBold' },
    body: { family: 'Inter', size: 16, weight: 'Regular' },
    mono: { family: 'JetBrains Mono', size: 12, weight: 'Medium' },
    heading_font: 'Plus Jakarta Sans',
    body_font: 'Inter'
  },
  coreMantra: 'NOVA unites high-density renewable energy with Swiss graphic clarity to power human ambition.',
  visualDirection: 'An ultra-clean, modern aesthetic built on high contrast, generous negative space, and restrained sage focal accents.',
  visual_style_description: 'An ultra-clean, modern aesthetic built on high contrast, generous whitespace, and restrained sage focal points.',
  logoStyleToken: 'tech',
  rationale: {
    colors: 'Deep slate navy (#0F172A) anchors corporate credibility, while muted sage (#738F80) signals sustainable growth against clean surface (#F8FAFC). Passes WCAG 2.1 AA with 14.2:1 contrast.',
    typography: 'Syne provides modern geometric authority, while Plus Jakarta Sans delivers exceptional legibility across dense energy data dashboards.',
    tagline: 'Directly addresses enterprise clean-tech demand while signaling generational permanence.',
    personality: 'Balances rigorous technical excellence with optimistic visionary clarity.'
  },
  assets: [
    {
      _id: 'demo-bc-001',
      brandId: 'demo-nova-001',
      type: 'business_card',
      svgOrConfig: {
        dimensions: '3.5in x 2.0in (1050x600)',
        front: { background: '#0F172A', logoVariant: 'logo_mark', accentBar: '#738F80' },
        back: { background: '#F8FAFC', textColor: '#0F172A', accentColor: '#738F80', fontDisplay: 'Syne', fontBody: 'Inter', name: 'Alex Vance', title: 'Founding Partner & CEO', email: 'contact@nova.energy', phone: '+1 (555) 249-8012', website: 'www.nova.energy' }
      },
      consistencyScore: 96
    },
    {
      _id: 'demo-lh-001',
      brandId: 'demo-nova-001',
      type: 'letterhead',
      svgOrConfig: {
        dimensions: '8.5in x 11.0in A4 (2480x3508)',
        background: '#F8FAFC',
        primaryColor: '#0F172A',
        accentColor: '#738F80',
        fontDisplay: 'Syne',
        fontBody: 'Inter',
        fontMono: 'JetBrains Mono',
        headerLogoVariant: 'logo_primary',
        tagline: 'Sustainable energy architecture for the next era.'
      },
      consistencyScore: 97
    },
    {
      _id: 'demo-env-001',
      brandId: 'demo-nova-001',
      type: 'envelope',
      svgOrConfig: {
        dimensions: '#10 Commercial (9.5in x 4.125in)',
        background: '#F8FAFC',
        primaryColor: '#0F172A',
        accentColor: '#738F80',
        fontDisplay: 'Syne',
        fontBody: 'Inter',
        logoVariant: 'logo_primary'
      },
      consistencyScore: 95
    },
    {
      _id: 'demo-sp-001',
      brandId: 'demo-nova-001',
      type: 'social_post',
      svgOrConfig: {
        dimensions: '1080x1080 Square',
        background: '#0F172A',
        textColor: '#F8FAFC',
        accentColor: '#738F80',
        headline: 'Sustainable energy architecture for the next era.',
        subhead: 'Sustainable energy architecture for the next era.'
      },
      consistencyScore: 94
    },
    {
      _id: 'demo-ss-001',
      brandId: 'demo-nova-001',
      type: 'social_story',
      svgOrConfig: {
        dimensions: '1080x1920 Vertical Story',
        background: '#F8FAFC',
        textColor: '#0F172A',
        accentColor: '#738F80',
        headline: 'Sustainable energy architecture for the next era.',
        subhead: 'Sustainable energy architecture for the next era.'
      },
      consistencyScore: 95
    },
    {
      _id: 'demo-sb-001',
      brandId: 'demo-nova-001',
      type: 'social_banner',
      svgOrConfig: {
        dimensions: '1500x500 Header Banner',
        background: '#0F172A',
        textColor: '#F8FAFC',
        accentColor: '#738F80',
        headline: 'NOVA',
        subhead: 'Sustainable energy architecture for the next era.'
      },
      consistencyScore: 96
    }
  ]
};

export const BrandProvider = ({ children }) => {
  const [brand, setBrand] = useState(DEFAULT_BRAND);
  const [userBrands, setUserBrands] = useState([]);
  const [user, setUser] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isApplyingDirection, setIsApplyingDirection] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [complianceReport, setComplianceReport] = useState(auditBrandConsistency(DEFAULT_BRAND));

  // Compute compliance score whenever brand changes
  useEffect(() => {
    if (brand) {
      const report = auditBrandConsistency(brand);
      setComplianceReport(report);
    }
  }, [brand]);

  // Load the actual typefaces selected for this brand, rather than silently rendering fallbacks.
  useEffect(() => {
    const families = [...new Set([
      brand?.typography?.display?.family || brand?.typography?.heading_font,
      brand?.typography?.headline?.family,
      brand?.typography?.body?.family || brand?.typography?.body_font,
      brand?.typography?.mono?.family
    ].filter(Boolean))];
    families.forEach((family) => {
      const id = `brand-font-${family.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
      if (document.getElementById(id)) return;
      const link = document.createElement('link');
      link.id = id;
      link.rel = 'stylesheet';
      link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family).replace(/%20/g, '+')}&display=swap`;
      document.head.appendChild(link);
    });
    const fontStack = (family, fallback) => `"${String(family || '').replace(/["\\]/g, '')}", ${fallback}`;
    document.documentElement.style.setProperty('--brand-font-display', fontStack(families[0] || 'Manrope', 'sans-serif'));
    document.documentElement.style.setProperty('--brand-font-body', fontStack(brand?.typography?.body?.family || brand?.typography?.body_font || 'Manrope', 'sans-serif'));
    document.documentElement.style.setProperty('--brand-font-mono', fontStack(brand?.typography?.mono?.family || 'ui-monospace', 'monospace'));
  }, [brand?.typography]);

  // Check current session auth status
  const checkAuth = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/auth/me`, {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        return data.user;
      } else {
        setUser(null);
        return null;
      }
    } catch (e) {
      setUser(null);
      return null;
    } finally {
      setAuthLoading(false);
    }
  }, []);

  // Fetch list of user brands
  const fetchUserBrands = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/brand`, {
        credentials: 'include'
      });
      if (res.ok) {
        const data = await res.json();
        setUserBrands(data.brands || []);
      }
    } catch (e) {
      console.warn('Failed to load user brands:', e);
    }
  }, []);

  // Initialize session on mount
  useEffect(() => {
    const init = async () => {
      const currentUser = await checkAuth();
      if (!currentUser && process.env.NODE_ENV !== 'production') {
        try {
          const demoRes = await fetch(`${API_BASE}/auth/demo`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' }
          });
          if (demoRes.ok) {
            const demoData = await demoRes.json();
            setUser(demoData.user);
          }
        } catch (e) {
          console.warn('Backend offline, running in client-only demo mode.');
        }
      }
      fetchUserBrands();
    };
    init();
  }, [checkAuth, fetchUserBrands]);

  // Login handler
  const login = async (email, password) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Login failed.');
    }
    const data = await res.json();
    setUser(data.user);
    fetchUserBrands();
    return data.user;
  };

  // Register handler
  const register = async (name, email, password) => {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ name, email, password })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Registration failed.');
    }
    const data = await res.json();
    setUser(data.user);
    fetchUserBrands();
    return data.user;
  };

  // Logout handler
  const logout = async () => {
    try {
      await fetch(`${API_BASE}/auth/logout`, {
        method: 'POST',
        credentials: 'include'
      });
    } catch (e) {
      console.warn('Logout request failed:', e);
    }
    setUser(null);
    setUserBrands([]);
  };

  // Create & Generate Brand Pipeline
  const createBrand = async (formData) => {
    setIsGenerating(true);
    const previousBrand = brand;

    const name = formData.company_name || formData.companyName || 'AURA';
    const vision = formData.vision || formData.description || 'Next-generation intelligent products.';
    const industry = formData.industry || 'Technology';
    const personality = formData.personality?.length ? formData.personality : DEFAULT_BRAND.personality;
    const targetAudience = formData.targetAudience || 'Modern Consumers';
    let createdBrandId = null;

    // Show the submitted project name immediately while the generation screen runs.
    setBrand((current) => ({
      ...current,
      id: `pending-${Date.now()}`,
      companyName: name,
      company_name: name,
      industry,
      tagline: vision,
      targetAudience,
      personality,
      assets: []
    }));

    try {
      const createRes = await fetch(`${API_BASE}/brand`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          companyName: name,
          description: vision,
          industry,
          targetAudience
        })
      });
      const createData = await createRes.json().catch(() => ({}));
      if (!createRes.ok) {
        throw new Error(createData.error || `Brand creation failed (${createRes.status}).`);
      }

      createdBrandId = createData.brand?._id;
      if (!createdBrandId) throw new Error('The server created no brand record. Check the backend response.');

      const genRes = await fetch(`${API_BASE}/brand/${createdBrandId}/generate`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      });
      const genData = await genRes.json().catch(() => ({}));
      if (!genRes.ok) {
        throw new Error(genData.error || `Brand generation failed (${genRes.status}).`);
      }
      if (!genData.brand || !genData.dna) {
        throw new Error('The server response is missing generated Brand DNA.');
      }

      const mergedBrand = {
        ...DEFAULT_BRAND,
        ...genData.brand,
        ...genData.dna,
        // Brand DNA also has an `_id`; keep the route's Brand document ID canonical.
        _id: genData.brand._id,
        id: genData.brand._id,
        companyName: genData.brand.companyName || name,
        company_name: genData.brand.companyName || name,
        targetAudience: genData.dna.targetAudience || targetAudience,
        personality,
        assets: genData.assets || [],
        consistency: genData.consistency
      };
      setBrand(mergedBrand);
      fetchUserBrands();
      return mergedBrand;
    } catch (err) {
      console.error('Error during brand generation:', err);
      setBrand(previousBrand);
      if (createdBrandId) {
        try {
          await fetch(`${API_BASE}/brand/${createdBrandId}`, { method: 'DELETE', credentials: 'include' });
        } catch (cleanupError) {
          console.warn('Failed to remove the incomplete brand draft:', cleanupError.message);
        }
      }
      if (err instanceof TypeError && /fetch/i.test(err.message)) {
        throw new Error('Cannot reach the EMBLEM backend. Start the backend server and try again.');
      }
      throw err;
    } finally {
      setIsGenerating(false);
    }
  };

  // Switch to a brand from user's list
  const selectBrand = async (brandId) => {
    try {
      const res = await fetch(`${API_BASE}/brand/${brandId}`, {
        credentials: 'include'
      });
      if (res.ok) {
        const data = await res.json();
        const merged = {
          ...data.brand,
          ...data.dna,
          // The DNA spread above would otherwise replace this with the DNA document ID.
          _id: data.brand._id,
          id: data.brand._id,
          companyName: data.brand.companyName,
          company_name: data.brand.companyName,
          assets: data.assets,
          consistency: data.consistency
        };
        setBrand(merged);
      }
    } catch (e) {
      console.warn('Failed to switch brand:', e);
    }
  };

  // Export full brand kit ZIP
  const exportKit = async () => {
    if (isExporting) return;
    setIsExporting(true);
    try {
      await exportBrandKitZip(brand, complianceReport);
    } catch (err) {
      console.error('Export kit error:', err);
      alert('Failed to generate export package: ' + err.message);
    } finally {
      setIsExporting(false);
    }
  };

  const updateBrandTokens = (updatedFields) => {
    setBrand((prev) => ({
      ...prev,
      ...updatedFields
    }));
  };

  const applyBrandDirection = async (direction) => {
    const fields = {
      colors: { ...brand.colors, ...direction.colors, background: direction.colors.surface, text: direction.colors.primary },
      typography: { ...brand.typography, ...direction.typography, heading_font: direction.typography.display.family, body_font: direction.typography.body.family },
      logoStyleToken: direction.logoStyleToken,
      logoMarkId: direction.logoMarkId || '',
      designDirection: direction.id,
      paletteId: '',
      rationale: { ...brand.rationale, ...direction.rationale }
    };
    setIsApplyingDirection(true);
    try {
      const brandId = brand?.brandId || brand?.id || brand?._id;
      if (brandId) {
        const response = await fetch(`${API_BASE}/brand/${brandId}/direction`, {
          method: 'PATCH',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ direction: { ...direction, typography: fields.typography, colors: fields.colors, paletteId: '' } })
        });
        const responseText = await response.text();
        let data = {};
        try { data = responseText ? JSON.parse(responseText) : {}; } catch (error) { data = {}; }
        if (!response.ok) {
          const routeNotLoaded = response.status === 404 && responseText.includes('Cannot PATCH');
          const message = routeNotLoaded
            ? 'The backend has not loaded the new direction-save route yet. Restart the backend, then try again.'
            : data.error || `Could not save this brand direction (HTTP ${response.status}).`;
          throw new Error(message);
        }
        setBrand((previous) => {
          const canonicalBrandId = previous.brandId || previous.id || previous._id;
          return {
            ...previous,
            ...data.dna,
            _id: canonicalBrandId,
            id: canonicalBrandId,
            assets: data.assets || previous.assets,
            consistency: data.consistency || previous.consistency
          };
        });
        return data.dna;
      }
      setBrand((previous) => ({ ...previous, ...fields }));
      return fields;
    } finally {
      setIsApplyingDirection(false);
    }
  };

  const applyBrandPalette = async (palette) => {
    if (!palette?.id || !palette?.colors) throw new Error('This palette is incomplete.');
    setIsApplyingDirection(true);
    try {
      const colors = {
        ...palette.colors,
        background: palette.colors.surface,
        text: palette.colors.primary
      };
      const brandId = brand?.brandId || brand?.id || brand?._id;
      if (brandId && /^[\da-f]{24}$/i.test(String(brandId))) {
        const response = await fetch(`${API_BASE}/brand/${brandId}/palette`, {
          method: 'PATCH',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ paletteId: palette.id })
        });
        const responseText = await response.text();
        let data = {};
        try { data = responseText ? JSON.parse(responseText) : {}; } catch (error) { data = {}; }
        if (!response.ok) throw new Error(data.error || `Could not save this palette (HTTP ${response.status}).`);
        setBrand((previous) => {
          const canonicalBrandId = previous.brandId || previous.id || previous._id;
          return {
            ...previous,
            ...data.dna,
            _id: canonicalBrandId,
            id: canonicalBrandId,
            assets: data.assets || previous.assets,
            consistency: data.consistency || previous.consistency
          };
        });
        return data.dna;
      }

      const fields = { colors, paletteId: palette.id };
      setBrand((previous) => ({ ...previous, ...fields }));
      return fields;
    } finally {
      setIsApplyingDirection(false);
    }
  };

  const loadDemo = () => setBrand(DEFAULT_BRAND);

  return (
    <BrandContext.Provider
      value={{
        brand,
        setBrand,
        user,
        userBrands,
        authLoading,
        login,
        register,
        logout,
        checkAuth,
        selectBrand,
        createBrand,
        updateBrandTokens,
        applyBrandDirection,
        applyBrandPalette,
        isApplyingDirection,
        loadDemo,
        isGenerating,
        isExporting,
        exportKit,
        complianceScore: {
          total: complianceReport.overallScore,
          breakdown: {
            contrast: complianceReport.colorScore,
            typography: complianceReport.typographyScore,
            safetyZone: complianceReport.logoScore
          },
          report: complianceReport
        }
      }}
    >
      {children}
    </BrandContext.Provider>
  );
};

export const useBrand = () => useContext(BrandContext);
