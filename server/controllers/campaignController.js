// server/controllers/campaignController.js
const Campaign = require('../models/Campaign');
const User = require('../models/User'); // Ensure User model is required

// Helper function to calculate overall campaign statistics
const calculateCampaignStats = async () => {
    // These queries fetch counts for all campaigns regardless of the filter in getAllCampaigns
    const total = await Campaign.countDocuments({});
    const approved = await Campaign.countDocuments({ status: 'Approved' });
    const rejected = await Campaign.countDocuments({ status: 'Rejected' });
    const pending = await Campaign.countDocuments({ status: 'Pending Review' });
    return { total, approved, rejected, pending };
};

// Create a new campaign (for CampaignCreation01 - 03)
exports.createCampaign = async (req, res) => {
    try {
        const campaign = new Campaign(req.body);
        await campaign.save();
        res.status(201).json(campaign);
    } catch (err) {
        console.error('Create campaign error:', err); // Added error logging
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
        console.error('Get campaign by ID error:', err); // Added error logging
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
        console.error('Update campaign error:', err); // Added error logging
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
        console.error('Update campaign story error:', err); // Added error logging
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
        console.error('Delete campaign error:', err); // Added error logging
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
        console.error('Submit campaign error:', err); // Added error logging
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

        // It's good to check the status, but if the update directly sets it,
        // this check might be redundant if the frontend ensures it only acts on 'Pending Review'.
        // Keeping it for robust backend validation.
        if (campaign.status !== 'Pending Review') {
             // You might want to return a different message here if already Approved/Rejected
            return res.status(400).json({ message: 'Campaign is not in Pending Review status or already processed.' });
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
            return res.status(400).json({ message: 'Campaign is not in Pending Review status or already processed.' });
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

// Get all campaigns with optional filtering by status and return counts
exports.getAllCampaigns = async (req, res) => {
    try {
        const { status } = req.query; // Get status from query parameter

        let query = {}; // Initialize an empty query object

        // If a status query parameter is provided, add it to the query object
        if (status) {
            query.status = status;
        }

        // Find campaigns based on the constructed query
        const campaigns = await Campaign.find(query);

        // --- Debugging Log ---
        console.log(`Backend: Received status query: ${status || 'None'}`);
        console.log(`Backend: MongoDB query object:`, query);
        console.log(`Backend: Number of campaigns found with this query: ${campaigns.length}`);
        // --- End Debugging Log ---

        // Calculate and fetch overall campaign statistics (these are for the pie chart and stats section)
        const stats = await calculateCampaignStats();

        // Return both the filtered campaigns (for the table) and the overall statistics (for the dashboard/chart)
        res.status(200).json({
            campaigns, // This array will contain only campaigns matching the 'status' filter (e.g., 'Pending Review')
            stats: {    // This object contains counts for ALL campaigns (total, approved, rejected, pending)
                total: stats.total,
                approved: stats.approved,
                rejected: stats.rejected,
                pending: stats.pending
            }
        });
    } catch (err) {
        console.error('Get all campaigns error:', err);
        res.status(500).json({ message: 'Failed to retrieve campaigns', error: err.message });
    }
};
