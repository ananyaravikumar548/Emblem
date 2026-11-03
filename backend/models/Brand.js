const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  companyName: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  industry: { type: String, default: 'General' },
  targetAudience: { type: String, default: 'General Audience' },
  status: { type: String, enum: ['draft', 'generated', 'archived'], default: 'draft' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

brandSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Brand', brandSchema);
