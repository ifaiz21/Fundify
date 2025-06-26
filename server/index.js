require('dotenv').config(); // Load environment variables at the very top

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
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

app.get("/", (req, res) => {
    res.status(200).json({ message: "working" })
})

// Middleware
// Use more permissive CORS for development. For production, specify your frontend domain.
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json()); // Parses incoming JSON requests
app.use(express.urlencoded({ extended: true })); // Parses URL-encoded data

// --- STATIC FILE SERVING FOR UPLOADS ---
// Ensure the 'public/uploads' directory exists and is served statically
const publicUploadsDir = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(publicUploadsDir)) {
    fs.mkdirSync(publicUploadsDir, { recursive: true });
}
app.use('/uploads', express.static(publicUploadsDir)); // Serve files from public/uploads


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
app.use('/api/users', userRoutes); // User routes handle their own specific multer configs
app.use('/api/contactus', contactusRoutes);
app.use('/api/donations', donationsRoutes);
app.use('/api/campaign-updates', campaignUpdatesRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/kyc', kycRoutes); // KYC routes, multer is applied directly in kycRoutes if needed, or in userRoutes for file uploads

// Catch-all for undefined routes
app.use((req, res, next) => {
    res.status(404).json({ message: 'API Route not found' });
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something broke on the server!', error: err.message });
});
