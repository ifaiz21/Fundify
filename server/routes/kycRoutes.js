// server/routes/kycRoutes.js
const express = require('express');
const authMiddleware = require('../middleware/auth'); // Import the single authMiddleware
const {
  getKYCApplications,
  approveKYCApplication,
  rejectKYCApplication,
  submitKYCApplication
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
// This path needs the multer middleware from server/index.js if you want to use req.files
router.route('/submit').post(authMiddleware(), submitKYCApplication); // Assuming 'protect' logic is handled by authMiddleware() without specific roles for user submission

module.exports = router;
