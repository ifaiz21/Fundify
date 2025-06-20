// server/routes/campaigns.js
const express = require('express');
const router = express.Router();
const Campaign = require('../models/Campaign'); // Ensure Campaign model is imported
const User = require('../models/User'); // Ensure User model is imported
const authMiddleware = require('../middleware/auth');
const campaignController = require('../controllers/campaignController'); // Import the campaignController
const { nanoid } = require('nanoid');
const multer = require('multer');
const path = require('path');
const fs = require('fs'); // Import fs for file operations (if needed for old media deletion)

// Configure multer storage for new campaign creation
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '..', 'public', 'uploads');
    // Ensure the directory exists
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
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
}).array('mediaFile', 5); // 'mediaFile' is the name of the input field in the form

// Middleware to check if the user is authorized to manage the campaign
const authorizeCampaign = async (req, res, next) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }
    // Corrected to use 'creator' field from Campaign model
    if (campaign.creator.toString() !== req.user.id && req.user.role !== 'admin') {
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

      // Basic validation for required fields
      if (!name || !location || !category || !goalAmount || !title || !description || !content) {
          return res.status(400).json({ message: 'Missing required campaign fields.' });
      }

      // Construct mediaUrls array from uploaded files
      const mediaUrls = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];

      const newCampaignId = nanoid(10); // Generate a unique campaign ID

      const newCampaign = new Campaign({
        creator: req.user.id, // Corrected to use 'creator' field
        campaignId: newCampaignId, // Ensure this unique ID is set
        name,
        location,
        category,
        goalAmount: Number(goalAmount), // Ensure it's a number
        isAdultContent: isAdultContent === 'true', // Convert string to boolean
        isIDVerifiedRequired: isIDVerifiedRequired === 'true', // Convert string to boolean
        isProjectVerifiedRequired: isProjectVerifiedRequired === 'true', // Convert string to boolean
        title,
        description,
        mediaUrls: mediaUrls,
        content,
        status: 'Pending Review', // Default status for new submissions
      });

      await newCampaign.save(); // Save the new campaign to the database

      // Update user's createdCampaigns count
      await User.findByIdAndUpdate(
        req.user.id,
        { $inc: { createdCampaigns: 1 } },
        { new: true }
      );

      res.status(201).json({ message: 'Campaign created successfully', campaign: newCampaign });
    } catch (err) {
      console.error('Create campaign error:', err);
      // More detailed error response for debugging
      res.status(500).json({ message: 'Failed to create campaign', error: err.message, details: err.errors });
    }
  });
});

// GET /api/campaigns - Get all campaigns with optional status filtering
// This route is called by ExploreCampaigns.jsx (should be public) and VerificationPage.jsx (needs admin for filtered view)
router.get('/', async (req, res) => { // REMOVED authMiddleware(['admin']) to allow public access for explore page
  try {
    const { status } = req.query; // Get status from query parameters

    let query = {};
    // If no status is explicitly specified, default to showing 'Active' and 'Approved' campaigns
    // This handles the public Explore page which doesn't send a status filter.
    if (status) {
      query.status = status; // If status IS specified (e.g., from admin page), use that status.
    } else {
      query.status = { $in: ['Active', 'Approved'] }; // Default for public view
    }


    // Fetch campaigns based on the constructed query
    const campaigns = await Campaign.find(query);

    // Calculate overall statistics for the dashboard/pie chart (from ALL campaigns)
    // This part remains the same as it's for general stats, not specific to the filtered list.
    const total = await Campaign.countDocuments({});
    const approved = await Campaign.countDocuments({ status: 'Approved' });
    const rejected = await Campaign.countDocuments({ status: 'Rejected' });
    const pending = await Campaign.countDocuments({ status: 'Pending Review' });

    const campaignStats = {
      total: total,
      approved: approved,
      rejected: rejected,
      pending: pending,
    };

    // Respond with an object containing both the filtered campaigns and overall stats
    res.status(200).json({ campaigns: campaigns, stats: campaignStats });

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

// PUT /api/campaigns/:id - Update a campaign by ID (general fields)
router.put('/:id', authMiddleware(), authorizeCampaign, async (req, res) => {
  try {
    const updatedCampaign = await Campaign.findByIdAndUpdate(
      req.params.id,
      { $set: req.body, updatedAt: Date.now() },
      { new: true, runValidators: true } // runValidators ensures schema validation on update
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
        // Corrected to use 'creator' field for updating user stats
        await User.findByIdAndUpdate(
            campaignToDelete.creator,
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

// Admin routes for approving/rejecting campaigns - These use campaignController functions directly
router.put('/:id/approve', authMiddleware(['admin']), campaignController.approveCampaign);
router.put('/:id/reject', authMiddleware(['admin']), campaignController.rejectCampaign);


module.exports = router;