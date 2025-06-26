const express = require('express');
const authMiddleware = require('../middleware/auth'); // Import the single authMiddleware
const {
    getKYCApplications,
    approveKYCApplication,
    rejectKYCApplication,
    submitKYCApplication,
    getMyKYCApplication // <-- NEW: Import the new function
} = require('../controllers/kycController');

const router = express.Router();

// Routes for Admin KYC verification
// GET all KYC applications (for admin dashboard)
router.route('/').get(authMiddleware(['admin']), getKYCApplications);

// Approve a specific KYC application by userId
router.route('/:userId/approve').put(authMiddleware(['admin']), approveKYCApplication);

// Reject a specific KYC application by userId
router.route('/:userId/reject').put(authMiddleware(['admin']), rejectKYCApplication);

// Route for user to submit KYC application
router.route('/submit').post(authMiddleware(), submitKYCApplication);

// NEW ROUTE: Get authenticated user's own KYC application details
router.route('/my-application').get(authMiddleware(), getMyKYCApplication); // Protect this route for authenticated users

module.exports = router;
