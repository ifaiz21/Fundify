// server/models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'user' },
  verified: { type: Boolean, default: false },
  verificationCode: { type: String },

  // --- New fields for Google Sign-in ---
  googleId: { type: String, unique: true, sparse: true }, // Google's unique user ID
  registrationMethod: { type: String, enum: ['email', 'google', 'facebook'], default: 'email' }, // How user registered


  contactNo: { type: String, default: '' },
  additionalEmails: [{ type: String }],
  createdCampaigns: { type: Number, default: 0 },
  backedCampaigns: { type: Number, default: 0 },

  accountType: { type: String, default: 'Choose' },
  accountNumber: { type: String, default: '' },
  cvc: { type: String, default: '' },
  expiryDate: { type: String, default: '' },

  profilePictureUrl: { type: String, default: '' }, // Naya field: Profile Picture ka URL/path

  // Added lastLogin and createdAt for better user tracking
  createdAt: { type: Date, default: Date.now },
  lastLogin: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', userSchema);