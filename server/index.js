// server/index.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dns = require('dns');
require('dotenv').config();
const path = require('path');

// Import routes
const adminRoutes = require('./routes/admin');
const authRoutes = require('./routes/auth');
const campaignRoutes = require('./routes/campaigns'); // Existing campaigns route for main campaign actions (creation, etc.)
const userRoutes = require('./routes/users');
const contactusRoutes = require('./routes/contactus');
const donationsRoutes = require('./routes/donations');
const campaignUpdatesRoutes = require('./routes/campaignUpdates'); // NEW: Import campaign updates route

dns.setDefaultResultOrder('ipv4first');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json()); // For parsing application/json
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded - important for some form submissions

// Serve static files from the 'public' directory
// This allows images uploaded to 'public/uploads' to be accessible
app.use(express.static(path.join(__dirname, 'public')));


// Connect MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true, // Deprecated, but good practice to keep for older versions
  useUnifiedTopology: true, // Deprecated, but good practice to keep for older versions
})
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error("MongoDB connection error:", err));


// Routes
app.use('/api/admin', adminRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/campaigns', campaignRoutes); // Main campaigns route (includes file upload for creation)
app.use('/api/users', userRoutes);
app.use('/api/contactus', contactusRoutes);
app.use('/api/donations', donationsRoutes);
app.use('/api/campaigns', campaignUpdatesRoutes); // NEW: Add campaign updates route (note: same base path as campaigns, but different sub-routes)

// Catch-all for undefined routes (optional, but good for debugging)
app.use((req, res, next) => {
  res.status(404).json({ message: 'API Route not found' });
});

// Global Error Handler (optional, but good practice)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something broke on the server!', error: err.message });
});