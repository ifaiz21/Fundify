// server/routes/campaigns.js
const express = require('express');
const router = express.Router();
const Campaign = require('../models/Campaign');
const User = require('../models/User'); // User model ko import karein
const authMiddleware = require('../middleware/auth');
const { nanoid } = require('nanoid');

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

// POST /api/campaigns - Create a new campaign
router.post('/', authMiddleware(), async (req, res) => {
  try {
    const { name, location, category, goalAmount, isAdultContent, isIDVerifiedRequired, isProjectVerifiedRequired, title, description, mediaUrl, content } = req.body;
    
    // Generate a unique campaignId if your schema includes it and requires it
    const newCampaignId = nanoid(10); // 10-character unique ID generate karein

    const newCampaign = new Campaign({
      userId: req.user.id, // Get user ID from authenticated token
      campaignId: newCampaignId, // Naya unique ID assign karein (agar schema mein hai)
      name,
      location,
      category,
      goalAmount,
      isAdultContent,
      isIDVerifiedRequired,
      isProjectVerifiedRequired,
      title,
      description,
      mediaUrl,
      content, // 'content' field ko bhi shamil karein
      status: 'Pending Review', // Default status for new campaigns
    });
    await newCampaign.save();

    // User ke createdCampaigns count ko badhayein
    await User.findByIdAndUpdate(
      req.user.id,
      { $inc: { createdCampaigns: 1 } }, // createdCampaigns ko 1 se badha dein
      { new: true } // Updated document return karein (optional)
    );

    res.status(201).json({ message: 'Campaign created successfully', campaign: newCampaign });
  } catch (err) {
    console.error('Create campaign error:', err);
    // Mazeed tafseeli error message frontend par bhejne ke liye
    res.status(500).json({ message: 'Failed to create campaign', error: err.message, details: err.errors });
  }
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
    const campaign = await Campaign.findById(req.params.id); // Assuming ID is MongoDB's _id
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
      req.params.id, // Find by MongoDB's _id
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