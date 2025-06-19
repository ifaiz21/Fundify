// server/models/Campaign.js
const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true,
  },
  campaignId: { // Naya field
    type: String,
    required: true,
    unique: true, // Yeh zaroori hai duplicate errors se bachne ke liye
  },
  name: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  goalAmount: {
    type: Number,
    required: true,
  },
  raised: { // CRITICAL FIX: Added 'raised' field
    type: Number,
    default: 0, // Default to 0, so it's always initialized
  },
  isAdultContent: {
    type: Boolean,
    default: false,
  },
  isIDVerifiedRequired: {
    type: Boolean,
    default: false,
  },
  isProjectVerifiedRequired: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  mediaUrls: {
    type: [String],
    default: [],
  },
  status: {
    type: String,
    default: 'Draft',
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

module.exports = mongoose.model('Campaign', campaignSchema);