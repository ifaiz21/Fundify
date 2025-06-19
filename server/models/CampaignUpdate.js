// server/models/CampaignUpdate.js (NEW FILE)
const mongoose = require('mongoose');

const campaignUpdateSchema = new mongoose.Schema({
  campaignId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Campaign',
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  content: {
    type: String,
    required: true,
  },
  // Optionally, for list items if you want structured content within updates
  listItems: [{
    type: String,
    trim: true,
  }],
  // Optionally, media for updates
  mediaUrls: {
    type: [String],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for faster queries by campaignId
campaignUpdateSchema.index({ campaignId: 1, createdAt: -1 });

module.exports = mongoose.model('CampaignUpdate', campaignUpdateSchema);