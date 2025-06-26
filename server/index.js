// server/index.js
require('dotenv').config(); // Load environment variables at the very top

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const multer = require('multer'); // Import multer
const fs = require('fs'); // Import file system module to create upload directory

// Import routes
const adminRoutes = require('./routes/admin');
const authRoutes = require('./routes/auth');
const campaignRoutes = require('./routes/campaigns'); // Main campaign routes
const userRoutes = require('./routes/users');
const contactusRoutes = require('./routes/contactus');
const donationsRoutes = require('./routes/donations');
const campaignUpdatesRoutes = require('./routes/campaignUpdates'); // Campaign updates specific
const newsletterRoutes = require('./routes/newsletter');
const kycRoutes = require('./routes/kycRoutes'); // Import KYC routes

const app = express();
const PORT = process.env.PORT || 5000;

app.get("/",(req,res)=>{
  res.status(200).json({message:"working"})
  })

// Middleware
// Use more permissive CORS for development. For production, specify your frontend domain.
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json()); // Parses incoming JSON requests
app.use(express.urlencoded({ extended: true })); // Parses URL-encoded data

// --- Multer Configuration for File Uploads (for KYC documents and liveness images) ---
const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir); // Files will be saved in the 'uploads' directory
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // Unique filename
  }
});

const upload = multer({ storage: storage });
// Expose the 'uploads' directory as a static resource
app.use('/uploads', express.static(path.join(__dirname, uploadDir)));

// Serve static files from the 'public' directory (if your frontend build goes here)
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
app.use('/api/campaign-updates', campaignUpdatesRoutes); // Distinct path for campaign updates
app.use('/api/newsletter', newsletterRoutes);
// KYC Routes - **Crucial for the frontend to connect**
// Note: If 'submitKYCApplication' route also requires file uploads,
// you need to use the 'upload' middleware before that controller.
app.use('/api/kyc', upload.fields([
    { name: 'documentFront', maxCount: 1 },
    { name: 'documentBack', maxCount: 1 },
    { name: 'livenessImage', maxCount: 1 }
]), kycRoutes); // Apply multer middleware globally for /api/kyc routes that need it


// Catch-all for undefined routes
app.use((req, res, next) => {
  res.status(404).json({ message: 'API Route not found' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something broke on the server!', error: err.message });
});
