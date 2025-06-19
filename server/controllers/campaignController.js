// server/controllers/campaignController.js
const Campaign = require('../models/Campaign');
const User = require = require('../models/User'); // Ensure User model is required

// Create a new campaign (for CampaignCreation01 - 03)
exports.createCampaign = async (req, res) => {
  try {
    const campaign = new Campaign(req.body);
    await campaign.save();
    res.status(201).json(campaign);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get campaign by ID (used in previews and updates)
exports.getCampaignById = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) return res.status(404).json({ error: 'Campaign not found' });
    res.json(campaign);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update campaign fields partially (used in CampaignCreation updates)
exports.updateCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    );
    if (!campaign) return res.status(404).json({ error: 'Campaign not found' });
    res.json(campaign);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update campaign story only (for CampaignCreation04 and CampaignUpdate)
exports.updateCampaignStory = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) return res.status(404).json({ error: 'Campaign not found' });

    campaign.story = req.body.story;
    campaign.updatedAt = Date.now();
    await campaign.save();
    res.json(campaign);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete campaign (used in CampaignDeletion)
exports.deleteCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findByIdAndDelete(req.params.id);
    if (!campaign) return res.status(404).json({ error: 'Campaign not found' });
    res.json({ message: 'Campaign deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Submit campaign (mark isSubmitted = true) (used in CampSubmission)
exports.submitCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) return res.status(404).json({ error: 'Campaign not found' });

    campaign.isSubmitted = true;
    campaign.updatedAt = Date.now();
    await campaign.save();
    res.json({ message: 'Campaign submitted successfully', campaign });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Approve a campaign (Admin action)
exports.approveCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    if (campaign.status !== 'Pending Review') {
      return res.status(400).json({ message: 'Campaign is not in Pending Review status.' });
    }

    campaign.status = 'Approved';
    campaign.updatedAt = Date.now();
    await campaign.save();

    res.status(200).json({ message: 'Campaign approved successfully', campaign });
  } catch (err) {
    console.error('Approve campaign error:', err);
    res.status(500).json({ message: 'Failed to approve campaign', error: err.message });
  }
};

// Reject a campaign (Admin action)
exports.rejectCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    if (campaign.status !== 'Pending Review') {
      return res.status(400).json({ message: 'Campaign is not in Pending Review status.' });
    }

    campaign.status = 'Rejected';
    campaign.updatedAt = Date.now();
    await campaign.save();

    res.status(200).json({ message: 'Campaign rejected successfully', campaign });
  } catch (err) {
    console.error('Reject campaign error:', err);
    res.status(500).json({ message: 'Failed to reject campaign', error: err.message });
  }
};

// MODIFIED: Get all campaigns with filtering by status and return counts
exports.getAllCampaigns = async (req, res) => {
  try {
    const { status } = req.query; // Get status from query parameter

    let query = {};
    if (status) {
      query.status = status;
    }

    const campaigns = await Campaign.find(query);

    // Get counts for dashboard statistics
    const total = await Campaign.countDocuments({});
    const approved = await Campaign.countDocuments({ status: 'Approved' });
    const rejected = await Campaign.countDocuments({ status: 'Rejected' });
    const pending = await Campaign.countDocuments({ status: 'Pending Review' });

    res.status(200).json({
      campaigns,
      stats: { // Include stats in the response
        total,
        approved,
        rejected,
        pending
      }
    });
  } catch (err) {
    console.error('Get all campaigns error:', err);
    res.status(500).json({ message: 'Failed to retrieve campaigns', error: err.message });
  }
};