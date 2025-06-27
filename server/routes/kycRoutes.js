// server/routes/kycRoutes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth'); // Import the single authMiddleware
const {
    getKYCApplications,
    approveKYCApplication,
    rejectKYCApplication,
    submitKYCApplication,
    getMyKYCApplication,
    deleteKYCApplication // <-- NEW: Import the delete function
} = require('../controllers/kycController');

// Routes for Admin KYC verification
// GET all KYC applications (for admin dashboard)
router.route('/').get(authMiddleware(['admin']), getKYCApplications);

// Approve a specific KYC application by userId
router.route('/:userId/approve').put(authMiddleware(['admin']), approveKYCApplication);

// Reject a specific KYC application by userId
router.route('/:userId/reject').put(authMiddleware(['admin']), rejectKYCApplication);

// NEW: Delete a specific KYC application by userId
router.route('/admin/delete/:userId').delete(authMiddleware(['admin']), deleteKYCApplication); // ADDED: Admin delete route

// Route for user to submit KYC application
router.route('/submit').post(authMiddleware(), submitKYCApplication); // CORRECTED: submitKYcApplication -> submitKYCApplication

// NEW ROUTE: Get authenticated user's own KYC application details
router.route('/my-application').get(authMiddleware(), getMyKYCApplication); // Protect this route for authenticated users

module.exports = router;