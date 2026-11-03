export const NOVA_DEMO_BRAND = {
  id: "demo-nova-001",
  company_name: "NOVA",
  tagline: "Sustainable energy for the next generation.",
  industry: "CleanTech",
  personality: ["Modern", "Minimal", "Premium", "Innovative"],
  values: ["Sustainability", "Transparency", "Efficiency", "Impact"],
  tone_of_voice: ["Confident", "Clear", "Forward-thinking"],
  colors: {
    primary: "#0F172A",
    secondary: "#1E293B",
    accent: "#738F80",
    background: "#F8FAFC",
    text: "#0F172A"
  },
  typography: {
    heading_font: "Plus Jakarta Sans",
    body_font: "Inter"
  },
  visual_style_description: "An ultra-clean, modern aesthetic built on high contrast, generous whitespace, and restrained sage accents.",
  consistency_score: 96
};

export const generateMockBrand = (formData) => ({
  id: `brand-${Date.now()}`,
  company_name: formData.company_name || "Aura",
  tagline: `Redefining ${formData.industry || "Tech"} with purpose.`,
  industry: formData.industry || "Technology",
  personality: formData.personality?.length ? formData.personality : ["Modern", "Minimal"],
  values: ["Excellence", "Integrity", "Design-First", "User-Centric"],
  tone_of_voice: ["Human", "Direct", "Inspiring"],
  colors: {
    primary: "#18181B",
    secondary: "#27272A",
    accent: "#8D829B",
    background: "#FAFAFA",
    text: "#18181B"
  },
  typography: {
    heading_font: "Space Grotesk",
    body_font: "Inter"
  },
  visual_style_description: "A sophisticated, high-clarity visual direction with bold typography and subtle glassmorphic accents.",
  consistency_score: 94
});