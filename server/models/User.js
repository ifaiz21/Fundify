// server/models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'user' },
  verified: { type: Boolean, default: false },
  verificationCode: { type: String },

  contactNo: { type: String, default: '' },
  additionalEmails: [{ type: String }],
  createdCampaigns: { type: Number, default: 0 },
  backedCampaigns: { type: Number, default: 0 },

  accountType: { type: String, default: 'Choose' },
  accountNumber: { type: String, default: '' },
  cvc: { type: String, default: '' },
  expiryDate: { type: String, default: '' },

  profilePictureUrl: { type: String, default: '' }, // Naya field: Profile Picture ka URL/path
});

module.exports = mongoose.model('User', userSchema);