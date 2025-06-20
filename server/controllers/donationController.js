// server/controllers/donationController.js
const Donation = require('../models/Donation');
const Campaign = require('../models/Campaign'); // Import the Campaign model
const User = require('../models/User');

// Create a new donation (initial pending state)
exports.createDonation = async (req, res) => {
  try {
    const { amount, frequency, honorOf, donationType, campaignId } = req.body;
    const userId = req.user ? req.user.id : '60d5ec49f8a3c80015f8a3c8'; // Example: Use a dummy ID if no user is logged in for testing

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated.' });
    }

    if (!amount) {
      return res.status(400).json({ message: 'Donation amount is required.' });
    }
    if (Number(amount) <= 0) {
      return res.status(400).json({ message: 'Donation amount must be positive.' });
    }

    const newDonation = new Donation({
      userId,
      campaignId: campaignId || null, 
      amount: Number(amount),
      frequency,
      honorOf,
      donationType,
      status: 'pending', 
    });

    await newDonation.save();

    res.status(201).json({ 
      message: 'Donation initiated successfully. Proceed to payment.', 
      donation: newDonation 
    });

  } catch (err) {
    console.error('Create donation error:', err);
    res.status(500).json({ message: 'Failed to create donation', error: err.message, details: err.errors });
  }
};

// Get donation by ID (optional, for history or verification)
exports.getDonationById = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);
    if (!donation) {
      return res.status(404).json({ message: 'Donation not found' });
    }
    if (req.user && donation.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access forbidden' });
    }
    res.status(200).json(donation);
  } catch (err) {
    console.error('Get donation by ID error:', err);
    res.status(500).json({ message: 'Failed to retrieve donation', error: err.message });
  }
};

// Update donation status (e.g., after successful payment)
exports.updateDonationStatus = async (req, res) => {
  try {
    const { status, transactionId } = req.body;
    const donation = await Donation.findById(req.params.id);

    if (!donation) {
      return res.status(404).json({ message: 'Donation not found' });
    }

    if (status && !['pending', 'completed', 'failed', 'refunded'].includes(status)) {
        return res.status(400).json({ message: 'Invalid donation status.' });
    }

    const oldStatus = donation.status;
    donation.status = status || donation.status;
    if (transactionId) {
      donation.transactionId = transactionId;
    }
    donation.updatedAt = Date.now();
    await donation.save();

    if (donation.status === 'completed' && oldStatus !== 'completed') {
      if (donation.campaignId) {
        const campaign = await Campaign.findById(donation.campaignId);
        if (campaign) {
          campaign.raised = (campaign.raised || 0) + donation.amount;
          // Increment totalBackers here
          campaign.totalBackers = (campaign.totalBackers || 0) + 1; //
          await campaign.save(); //
          console.log(`Campaign ${campaign.title} raised amount updated by ${donation.amount} and totalBackers incremented to ${campaign.totalBackers}`); //
        }
      }
      await User.findByIdAndUpdate(
        donation.userId,
        { $inc: { backedCampaigns: 1, totalDonated: donation.amount } }, // Assuming User model has totalDonated. Increment backedCampaigns.
        { new: true }
      );
    }

    res.status(200).json({ message: 'Donation status updated successfully', donation });
  } catch (err) {
    console.error('Update donation status error:', err);
    res.status(500).json({ message: 'Failed to update donation status', error: err.message });
  }
};

// Get all donations (admin only, or for a specific user)
exports.getAllDonations = async (req, res) => {
  try {
    let query = {};
    if (req.user && req.user.role !== 'admin') {
      query.userId = req.user.id;
    }
    const donations = await Donation.find(query).populate('userId', 'name email').populate('campaignId', 'title');
    res.status(200).json(donations);
  } catch (err) {
    console.error('Get all donations error:', err);
    res.status(500).json({ message: 'Failed to retrieve donations', error: err.message });
  }
};

// NEW: Get recent donations for a specific campaign
exports.getRecentDonationsForCampaign = async (req, res) => {
  try {
    const { campaignId } = req.params;
    const limit = parseInt(req.query.limit) || 3; // Default to 3 recent donors

    const donations = await Donation.find({ campaignId, status: 'completed' })
      .populate('userId', 'name') // Only fetch donor's name
      .sort({ createdAt: -1 }) // Latest donations first
      .limit(limit);

    // Count total unique backers for the campaign
    const totalBackers = await Donation.distinct('userId', { campaignId, status: 'completed' }).countDocuments();

    const transformedDonations = donations.map(d => ({
      name: d.honorOf || (d.userId ? d.userId.name : 'Anonymous'), // Prefer honorOf, then user name, else Anonymous
      amount: d.amount,
    }));

    res.status(200).json({
      recentDonors: transformedDonations,
      totalBackers: totalBackers,
    });

  } catch (err) {
    console.error('Get recent donations for campaign error:', err);
    res.status(500).json({ message: 'Failed to retrieve recent donations', error: err.message });
  }
};