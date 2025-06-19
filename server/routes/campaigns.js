// server/routes/campaigns.js
const express = require('express');
const router = express.Router();
const Campaign = require('../models/Campaign');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');
const campaignController = require('../controllers/campaignController'); // Import the campaignController
const { nanoid } = require('nanoid');
const multer = require('multer');
const path = require('path');

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file size limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Only images and videos are allowed!'), false);
    }
  }
}).array('mediaFile', 5);

// Middleware to check if the user is authorized to manage the campaign
const authorizeCampaign = async (req, res, next) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }
    if (campaign.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access forbidden: You do not own this campaign' });
    }
    req.campaign = campaign;
    next();
  } catch (err) {
    console.error('Authorize campaign error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/campaigns - Create a new campaign with file uploads
router.post('/', authMiddleware(), (req, res) => {
  upload(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ message: 'Multer error during file upload', error: err.message });
    } else if (err) {
      return res.status(500).json({ message: 'File upload failed', error: err.message });
    }

    try {
      const { name, location, category, goalAmount, isAdultContent, isIDVerifiedRequired, isProjectVerifiedRequired, title, description, content } = req.body;

      if (!name || !location || !category || !goalAmount || !title || !description) {
          return res.status(400).json({ message: 'Missing required campaign fields.' });
      }

      const mediaUrls = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];

      const newCampaignId = nanoid(10);

      const newCampaign = new Campaign({
        userId: req.user.id,
        campaignId: newCampaignId,
        name,
        location,
        category,
        goalAmount,
        isAdultContent: isAdultContent === 'true',
        isIDVerifiedRequired: isIDVerifiedRequired === 'true',
        isProjectVerifiedRequired: isProjectVerifiedRequired === 'true',
        title,
        description,
        mediaUrls: mediaUrls,
        content,
        status: 'Pending Review',
      });
      await newCampaign.save();

      await User.findByIdAndUpdate(
        req.user.id,
        { $inc: { createdCampaigns: 1 } },
        { new: true }
      );

      res.status(201).json({ message: 'Campaign created successfully', campaign: newCampaign });
    } catch (err) {
      console.error('Create campaign error:', err);
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

// PUT /api/campaigns/:id - Update a campaign by ID
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
    const campaignToDelete = await Campaign.findById(req.params.id);
    if (campaignToDelete) {
        await User.findByIdAndUpdate(
            campaignToDelete.userId,
            { $inc: { createdCampaigns: -1 } },
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

// NEW: Admin routes for approving/rejecting campaigns
router.put('/:id/approve', authMiddleware(['admin']), campaignController.approveCampaign);
router.put('/:id/reject', authMiddleware(['admin']), campaignController.rejectCampaign);


module.exports = router;