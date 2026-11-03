import { useState, useCallback } from 'react';
import { fetchBrandById, fetchBrands, generateBrandAssets } from '../services/brandApi';
import { auditBrandConsistency } from '../lib/consistencyAuditor';

const DEFAULT_BRAND = {
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
  colors: { primary: '#0F172A', secondary: '#1E293B', accent: '#738F80', surface: '#F8FAFC', background: '#F8FAFC', text: '#0F172A' },
  typography: {
    display: { family: 'Syne', size: 48, weight: 'Bold' },
    headline: { family: 'Plus Jakarta Sans', size: 28, weight: 'SemiBold' },
    body: { family: 'Inter', size: 16, weight: 'Regular' },
    mono: { family: 'JetBrains Mono', size: 12, weight: 'Medium' },
    heading_font: 'Plus Jakarta Sans',
    body_font: 'Inter'
  },
  coreMantra: 'NOVA unites high-density renewable energy with Swiss graphic clarity to power human ambition.',
  visualDirection: 'An ultra-clean, modern aesthetic built on high contrast, generous negative space, and sharp emerald focal accents.',
  visual_style_description: 'An ultra-clean, modern aesthetic built on high contrast, generous whitespace, and sharp emerald focal points.',
  logoStyleToken: 'tech',
  rationale: { colors: '', typography: '', tagline: '', personality: '' }
};

export function useBrand() {
  const [brand, setBrand] = useState(DEFAULT_BRAND);
  const [brands, setBrands] = useState([]);
  const [assets, setAssets] = useState([]);
  const [dna, setDna] = useState(null);
  const [consistency, setConsistency] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedBrandId, setSelectedBrandId] = useState(null);

  const loadBrandData = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchBrandById(id);
      setBrand(data.brand);
      setDna(data.dna);
      setAssets(data.assets || []);
      setConsistency(data.consistency || null);
      setSelectedBrandId(id);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const loadBrands = useCallback(async () => {
    try {
      const data = await fetchBrands();
      setBrands(data.brands || []);
    } catch (err) {
      console.warn('Failed to load brands:', err);
    }
  }, []);

  const handleGenerate = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const data = await generateBrandAssets(id);
      setBrand(data.brand);
      setDna(data.dna);
      setAssets(data.assets || []);
      setConsistency(data.consistency || null);
      setSelectedBrandId(id);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const selectBrand = useCallback((id) => {
    setSelectedBrandId(id);
    loadBrandData(id);
  }, [loadBrandData]);

  const applyBackendData = useCallback((data) => {
    if (data.brand) setBrand(data.brand);
    if (data.dna) setDna(data.dna);
    if (data.assets) setAssets(data.assets);
    if (data.consistency) setConsistency(data.consistency);
    if (data.brand?._id) { setSelectedBrandId(data.brand._id); setBrand(data.brand); }
  }, []);

  const report = consistency || (brand ? auditBrandConsistency(brand) : null);

  return {
    brand,
    brands,
    assets,
    dna,
    consistency,
    report,
    loading,
    error,
    selectedBrandId,
    loadBrandData,
    loadBrands,
    handleGenerate,
    selectBrand,
    applyBackendData,
    setBrand,
    setAssets,
    setDna,
    setConsistency,
    setError,
  };
}
