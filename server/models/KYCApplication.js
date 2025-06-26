// server/models/KYCApplication.js
const mongoose = require('mongoose');

const kycApplicationSchema = new mongoose.Schema({
  // Reference to the User who submitted the KYC
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Assuming your User model is named 'User'
    required: true,
    unique: true // A user should only have one KYC application at a time
  },
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  phoneNumber: {
    type: String,
    trim: true
  },
  dateOfBirth: {
    type: Date,
    required: true
  },
  address: {
    type: String,
    required: true,
    trim: true
  },
  city: {
    type: String,
    required: true,
    trim: true
  },
  country: {
    type: String,
    required: true,
    trim: true
  },
  // Document details
  documentType: {
    type: String,
    enum: ['National ID', 'Passport', 'Driving License', 'Other'],
    required: true
  },
  documentNumber: {
    type: String,
    required: true,
    trim: true
  },
  documentFrontUrl: { // URL to the uploaded front side of the document
    type: String,
    required: true
  },
  documentBackUrl: { // URL to the uploaded back side of the document (optional for some document types)
    type: String
  },
  livenessImageUrl: { // URL to the uploaded liveness image
    type: String,
    required: true
  },
  // Status of the KYC application
  status: {
    type: String,
    enum: ['Pending Review', 'Approved', 'Rejected'],
    default: 'Pending Review'
  },
  // Admin comments if rejected
  adminComments: {
    type: String,
    trim: true
  }
}, {
  timestamps: true // Adds createdAt and updatedAt timestamps
});

const KYCApplication = mongoose.model('KYCApplication', kycApplicationSchema);

module.exports = KYCApplication;
