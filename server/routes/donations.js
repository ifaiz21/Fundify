// server/routes/donations.js
const express = require('express');
const router = express.Router();
const donationController = require('../controllers/donationController');
const authMiddleware = require('../middleware/auth'); 

// POST /api/donations - Create a new donation
router.post('/', authMiddleware(), donationController.createDonation);

// GET /api/donations/:id - Get a specific donation by ID
router.get('/:id', authMiddleware(), donationController.getDonationById);

// PUT /api/donations/:id/status - Update donation status (e.g., after payment confirmation)
router.put('/:id/status', authMiddleware(), donationController.updateDonationStatus); 

// GET /api/donations - Get all donations (e.g., for admin or user's history)
router.get('/', authMiddleware(), donationController.getAllDonations);

// NEW: GET /api/donations/campaign/:campaignId/recent - Get recent donations for a specific campaign
router.get('/campaign/:campaignId/recent', donationController.getRecentDonationsForCampaign);


module.exports = router;