// server/models/Donation.js
const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  campaignId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Campaign',
    // This could be optional if general donations are allowed
    // But given the context of campaigns, it's likely always linked.
    // If a donation is not specific to a campaign, this can be null.
    default: null, 
  },
  amount: {
    type: Number,
    required: [true, 'Donation amount is required'],
    min: [1, 'Donation amount must be at least 1'],
  },
  currency: {
    type: String,
    default: 'PKR', // Based on the frontend's PKR
  },
  frequency: {
    type: String,
    enum: ['one-time', 'monthly'],
    default: 'one-time',
  },
  honorOf: {
    type: String,
    default: '',
  },
  donationType: { // To match the select dropdown in frontend
    type: String,
    enum: ['General donation', 'Project specific', 'Emergency relief', 'Education Purpose', 'Flood relief', 'Others'],
    default: 'General donation',
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending',
  },
  transactionId: { // To store payment gateway transaction ID
    type: String,
    unique: true,
    sparse: true, // Allows null values but enforces uniqueness for non-null
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

// Optional: Add index for faster queries
donationSchema.index({ userId: 1, campaignId: 1 });

module.exports = mongoose.model('Donation', donationSchema);