// server/routes/newsletter.js
const express = require('express');
const router = express.Router();
const newsletterController = require('../controllers/newsletterController');

// POST route for newsletter subscription
router.post('/subscribe', newsletterController.subscribeToNewsletter);

module.exports = router;