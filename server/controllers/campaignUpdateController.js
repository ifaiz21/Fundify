// server/controllers/campaignUpdateController.js (NEW FILE)
const CampaignUpdate = require('../models/CampaignUpdate');
const Campaign = require('../models/Campaign'); // To ensure campaign exists

// Create a new update for a campaign
exports.createCampaignUpdate = async (req, res) => {
  try {
    const { campaignId, title, content, listItems, mediaUrls } = req.body;
    // req.user.id will come from authMiddleware if user is logged in
    // const userId = req.user.id; 

    // Ensure the campaign exists and the user is authorized to create updates for it
    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found.' });
    }
    // Optional: Add authorization check here (e.g., if (campaign.userId.toString() !== userId))

    const newUpdate = new CampaignUpdate({
      campaignId,
      title,
      content,
      listItems: listItems || [], // Ensure it's an array
      mediaUrls: mediaUrls || [], // Ensure it's an array
    });

    await newUpdate.save();
    res.status(201).json({ message: 'Campaign update created successfully', update: newUpdate });
  } catch (err) {
    console.error('Create campaign update error:', err);
    res.status(500).json({ message: 'Failed to create campaign update', error: err.message });
  }
};

// Get all updates for a specific campaign
exports.getCampaignUpdates = async (req, res) => {
  try {
    const { campaignId } = req.params; // Get campaignId from URL params

    // Optional: Ensure campaign exists before fetching updates
    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found.' });
    }

    const updates = await CampaignUpdate.find({ campaignId }).sort({ createdAt: -1 }); // Latest first
    res.status(200).json(updates);
  } catch (err) {
    console.error('Get campaign updates error:', err);
    res.status(500).json({ message: 'Failed to retrieve campaign updates', error: err.message });
  }
};

// Update an existing campaign update (optional)
exports.updateCampaignUpdate = async (req, res) => {
    try {
      const { updateId } = req.params; // ID of the update to be modified
      const { title, content, listItems, mediaUrls } = req.body;
      // const userId = req.user.id; // From authMiddleware

      const update = await CampaignUpdate.findById(updateId);
      if (!update) {
        return res.status(404).json({ message: 'Campaign update not found.' });
      }

      // Optional: Add authorization check (e.g., check if user owns the campaign associated with this update)
      // const campaign = await Campaign.findById(update.campaignId);
      // if (campaign.userId.toString() !== userId) {
      //   return res.status(403).json({ message: 'Access forbidden: You cannot update this campaign update.' });
      // }

      update.title = title || update.title;
      update.content = content || update.content;
      update.listItems = listItems || update.listItems;
      update.mediaUrls = mediaUrls || update.mediaUrls;
      update.updatedAt = Date.now();

      await update.save();
      res.status(200).json({ message: 'Campaign update successfully updated', update });
    } catch (err) {
      console.error('Update campaign update error:', err);
      res.status(500).json({ message: 'Failed to update campaign update', error: err.message });
    }
};

// Delete a campaign update (optional)
exports.deleteCampaignUpdate = async (req, res) => {
    try {
      const { updateId } = req.params; // ID of the update to be deleted
      // const userId = req.user.id; // From authMiddleware

      const update = await CampaignUpdate.findById(updateId);
      if (!update) {
        return res.status(404).json({ message: 'Campaign update not found.' });
      }

      // Optional: Add authorization check
      // const campaign = await Campaign.findById(update.campaignId);
      // if (campaign.userId.toString() !== userId) {
      //   return res.status(403).json({ message: 'Access forbidden: You cannot delete this campaign update.' });
      // }

      await CampaignUpdate.findByIdAndDelete(updateId);
      res.status(200).json({ message: 'Campaign update successfully deleted.' });
    } catch (err) {
      console.error('Delete campaign update error:', err);
      res.status(500).json({ message: 'Failed to delete campaign update', error: err.message });
    }
};