// server/models/Campaign.js
const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
  campaignId: { type: String, unique: true, required: true }, // ADDED THIS LINE: Explicitly defines campaignId as unique and required
  title: { type: String, required: true },
  description: { type: String, required: true },
  goalAmount: { type: Number, required: true },
  category: { type: String, required: true },
  mediaUrls: [{ type: String }],
  story: { type: String },
  location: { type: String, required: true },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, default: 'Draft', enum: ['Draft', 'Pending Review', 'Approved', 'Rejected', 'Active', 'Completed', 'Canceled'] },
  isSubmitted: { type: Boolean, default: false },
  raised: { type: Number, default: 0 },
  totalBackers: { type: Number, default: 0 },
  startDate: { type: Date },
  endDate: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Campaign', campaignSchema);