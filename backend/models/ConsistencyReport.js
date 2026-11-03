const mongoose = require('mongoose');

const checkItemSchema = new mongoose.Schema({
  rule: { type: String, required: true },
  category: { type: String, enum: ['color', 'typography', 'logo'], required: true },
  passed: { type: Boolean, required: true },
  score: { type: Number, required: true },
  detail: { type: String, required: true },
  assetType: { type: String }
}, { _id: false });

const consistencyReportSchema = new mongoose.Schema({
  brandId: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand', required: true, index: true },
  overallScore: { type: Number, required: true, min: 0, max: 100 },
  colorScore: { type: Number, required: true, min: 0, max: 100 },
  typographyScore: { type: Number, required: true, min: 0, max: 100 },
  logoScore: { type: Number, required: true, min: 0, max: 100 },
  checks: [checkItemSchema],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ConsistencyReport', consistencyReportSchema);

