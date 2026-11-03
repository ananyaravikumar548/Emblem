const mongoose = require('mongoose');

const assetSchema = new mongoose.Schema({
  brandId: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand', required: true },
  type: {
    type: String,
    enum: [
      'logo_primary',
      'logo_stacked',
      'logo_mark',
      'logo_mono_light',
      'logo_mono_dark',
      'business_card',
      'letterhead',
      'envelope',
      'social_post',
      'social_story',
      'social_banner'
    ],
    required: true
  },
  svgOrConfig: { type: mongoose.Schema.Types.Mixed },
  cloudinaryUrl: { type: String, default: '' },
  consistencyScore: { type: Number, default: 95 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Asset', assetSchema);
