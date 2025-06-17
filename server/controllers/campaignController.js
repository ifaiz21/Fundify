const Campaign = require('../models/Campaign');

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
