// server/index.js
require('dotenv').config(); // <-- MOVE THIS TO THE VERY TOP
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dns = require('dns');
const path = require('path');

// Import routes
const adminRoutes = require('./routes/admin');
const authRoutes = require('./routes/auth');
const campaignRoutes = require('./routes/campaigns');
const userRoutes = require('./routes/users');
const contactusRoutes = require('./routes/contactus');
const donationsRoutes = require('./routes/donations');
const campaignUpdatesRoutes = require('./routes/campaignUpdates');
const newsletterRoutes = require('./routes/newsletter'); // Import newsletter routes

dns.setDefaultResultOrder('ipv4first');

const app = express();
const PORT = process.env.PORT || 5000;

app.get("/",(req,res)=>{
  res.status(200).json({message:"working"})
  })

// Middleware
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Connect MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error("MongoDB connection error:", err));

// Routes
app.use('/api/admin', adminRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api/users', userRoutes);
app.use('/api/contactus', contactusRoutes);
app.use('/api/donations', donationsRoutes);
app.use('/api/campaigns', campaignUpdatesRoutes);
app.use('/api/newsletter', newsletterRoutes);

// Catch-all for undefined routes
app.use((req, res, next) => {
  res.status(404).json({ message: 'API Route not found' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something broke on the server!', error: err.message });
});