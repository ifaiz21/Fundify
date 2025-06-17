// server/models/Contactus.js
const mongoose = require('mongoose');

const contactusSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  issue: { type: String, required: true }, // e.g., 'campaign', 'payout', 'technical', 'other'
  subject: { type: String, required: true, maxlength: 96 },
  message: { type: String, required: true },
  status: { type: String, default: 'New' }, // e.g., 'New', 'In Progress', 'Resolved'
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Contactus', contactusSchema);