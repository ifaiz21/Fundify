// server/routes/campaigns.js
const express = require('express');
const router = express.Router();
const Campaign = require('../models/Campaign');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');
const { nanoid } = require('nanoid');
const multer = require('multer'); // Import multer
const path = require('path');     // Import path module

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Ensure this directory exists in your server's root (e.g., server/public/uploads)
    cb(null, 'public/uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

// Initialize multer upload middleware for handling single image file
// 'mediaFile' is the name of the input field in your form (e.g., formData.mediaFile)
// If you want to allow multiple files, use .array('mediaFile', maxCount)
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file size limit (adjust as needed)
  fileFilter: (req, file, cb) => {
    // Allow only images and videos
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Only images and videos are allowed!'), false);
    }
  }
}).array('mediaFile', 5); // Allow up to 5 media files

// Middleware to check if the user is authorized to manage the campaign
const authorizeCampaign = async (req, res, next) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }
    // Check if the authenticated user is the creator of the campaign or an admin
    if (campaign.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access forbidden: You do not own this campaign' });
    }
    req.campaign = campaign; // Attach campaign to request for further use
    next();
  } catch (err) {
    console.error('Authorize campaign error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/campaigns - Create a new campaign with file uploads
router.post('/', authMiddleware(), (req, res) => { // Auth middleware first
  upload(req, res, async (err) => { // Then multer upload
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading.
      return res.status(400).json({ message: 'Multer error during file upload', error: err.message });
    } else if (err) {
      // An unknown error occurred when uploading.
      return res.status(500).json({ message: 'File upload failed', error: err.message });
    }

    try {
      const { name, location, category, goalAmount, isAdultContent, isIDVerifiedRequired, isProjectVerifiedRequired, title, description, content } = req.body;

      // Ensure that all required text fields are present
      if (!name || !location || !category || !goalAmount || !title || !description) {
          return res.status(400).json({ message: 'Missing required campaign fields.' });
      }

      // Extract paths of uploaded files
      const mediaUrls = req.files ? req.files.map(file => `/uploads/${file.filename}`) : []; // Correctly get paths from req.files

      // Generate a unique campaignId
      const newCampaignId = nanoid(10);

      const newCampaign = new Campaign({
        userId: req.user.id,
        campaignId: newCampaignId,
        name,
        location,
        category,
        goalAmount,
        isAdultContent: isAdultContent === 'true', // Convert string to boolean
        isIDVerifiedRequired: isIDVerifiedRequired === 'true', // Convert string to boolean
        isProjectVerifiedRequired: isProjectVerifiedRequired === 'true', // Convert string to boolean
        title,
        description,
        mediaUrls: mediaUrls, // Store array of paths correctly
        content,
        status: 'Pending Review', // Default status
      });
      await newCampaign.save();

      // Update user's createdCampaigns count
      await User.findByIdAndUpdate(
        req.user.id,
        { $inc: { createdCampaigns: 1 } },
        { new: true }
      );

      res.status(201).json({ message: 'Campaign created successfully', campaign: newCampaign });
    } catch (err) {
      console.error('Create campaign error:', err);
      // Detailed error message for frontend
      res.status(500).json({ message: 'Failed to create campaign', error: err.message, details: err.errors });
    }
  });
});

// GET /api/campaigns - Get all campaigns (can add filtering/pagination later)
router.get('/', async (req, res) => {
  try {
    const campaigns = await Campaign.find({});
    res.status(200).json(campaigns);
  } catch (err) {
    console.error('Get all campaigns error:', err);
    res.status(500).json({ message: 'Failed to retrieve campaigns', error: err.message });
  }
});

// GET /api/campaigns/:id - Get a single campaign by ID
router.get('/:id', async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }
    res.status(200).json(campaign);
  } catch (err) {
    console.error('Get campaign by ID error:', err);
    res.status(500).json({ message: 'Failed to retrieve campaign', error: err.message });
  }
});

// PUT /api/campaigns/:id - Update a campaign by ID (consider adding multer here if media can be updated)
router.put('/:id', authMiddleware(), authorizeCampaign, async (req, res) => {
  try {
    const updatedCampaign = await Campaign.findByIdAndUpdate(
      req.params.id,
      { $set: req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );
    res.status(200).json({ message: 'Campaign updated successfully', campaign: updatedCampaign });
  } catch (err) {
    console.error('Update campaign error:', err);
    res.status(500).json({ message: 'Failed to update campaign', error: err.message });
  }
});

// DELETE /api/campaigns/:id - Delete a campaign by ID
router.delete('/:id', authMiddleware(['admin']), authorizeCampaign, async (req, res) => {
  try {
    // Campaign ko delete karne se pehle, user ke createdCampaigns count ko kam karein (agar user delete kar raha hai)
    const campaignToDelete = await Campaign.findById(req.params.id);
    if (campaignToDelete) {
        await User.findByIdAndUpdate(
            campaignToDelete.userId,
            { $inc: { createdCampaigns: -1 } }, // createdCampaigns ko 1 se kam karein
            { new: true }
        );
    }

    await Campaign.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Campaign deleted successfully' });
  } catch (err) {
    console.error('Delete campaign error:', err);
    res.status(500).json({ message: 'Failed to delete campaign', error: err.message });
  }
});

module.exports = router;