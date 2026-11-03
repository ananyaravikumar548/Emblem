const mongoose = require('mongoose');

const brandDnaSchema = new mongoose.Schema({
  brandId: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand', required: true, unique: true },
  personality: [{ type: String }],
  coreValues: [
    {
      title: { type: String, required: true },
      description: { type: String, required: true }
    }
  ],
  voiceTone: [{ type: String }],
  colors: {
    primary: { type: String, required: true },
    secondary: { type: String, required: true },
    accent: { type: String, required: true },
    surface: { type: String, required: true }
  },
  typography: {
    display: {
      family: { type: String, default: 'Syne' },
      size: { type: Number, default: 48 },
      weight: { type: String, default: 'Bold' }
    },
    headline: {
      family: { type: String, default: 'Plus Jakarta Sans' },
      size: { type: Number, default: 28 },
      weight: { type: String, default: 'SemiBold' }
    },
    body: {
      family: { type: String, default: 'Inter' },
      size: { type: Number, default: 16 },
      weight: { type: String, default: 'Regular' }
    },
    mono: {
      family: { type: String, default: 'JetBrains Mono' },
      size: { type: Number, default: 12 },
      weight: { type: String, default: 'Medium' }
    }
  },
  tagline: { type: String, required: true },
  coreMantra: { type: String, required: true },
  visualDirection: { type: String, required: true },
  logoStyleToken: {
    type: String,
    enum: ['minimal', 'tech', 'luxury', 'organic', 'bold'],
    default: 'minimal'
  },
  logoMarkId: { type: String, default: '' },
  designDirection: { type: String, default: '' },
  paletteId: { type: String, default: '' },
  designDirections: { type: [mongoose.Schema.Types.Mixed], default: [] },
  rationale: {
    colors: { type: String, required: true },
    typography: { type: String, required: true },
    tagline: { type: String, required: true },
    personality: { type: String, required: true }
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('BrandDNA', brandDnaSchema);
