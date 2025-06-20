// server/routes/admin.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const userController = require('../controllers/userController'); // User controller import karein
const campaignController = require('../controllers/campaignController'); // Campaign controller import karein
const donationController = require('../controllers/donationController'); // Donation controller import karein

// Example admin dashboard route
router.get('/dashboard', auth(['admin']), (req, res) => {
  res.json({ message: `Welcome Admin ${req.user.id}` });
});

// NEW: Admin route to get all users
router.get('/users', auth(['admin']), userController.getAllUsers);

// NEW: Admin route to get all campaigns
router.get('/campaigns', auth(['admin']), campaignController.getAllCampaigns);

// NEW: Admin route to get all donations
router.get('/donations', auth(['admin']), donationController.getAllDonations);

// NEW: Admin route to get all contact messages (feedbacks)
const Contactus = require('../models/Contactus'); // Make sure to import the Contactus model
router.get('/feedbacks', auth(['admin']), async (req, res) => {
    try {
        const feedbacks = await Contactus.find({});
        res.status(200).json(feedbacks);
    } catch (err) {
        console.error('Get all feedbacks error:', err);
        res.status(500).json({ message: 'Failed to retrieve feedbacks', error: err.message });
    }
});


module.exports = router;