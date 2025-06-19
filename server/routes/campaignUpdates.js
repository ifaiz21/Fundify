// server/routes/campaignUpdates.js (NEW FILE)
const express = require('express');
const router = express.Router();
const campaignUpdateController = require('../controllers/campaignUpdateController');
const authMiddleware = require('../middleware/auth'); // Assuming you have an auth middleware

// POST /api/campaigns/:campaignId/updates - Create a new update for a specific campaign
// Only authenticated users (e.g., campaign creator or admin) should be able to create updates
router.post('/:campaignId/updates', authMiddleware(), campaignUpdateController.createCampaignUpdate);

// GET /api/campaigns/:campaignId/updates - Get all updates for a specific campaign
router.get('/:campaignId/updates', campaignUpdateController.getCampaignUpdates);

// PUT /api/campaigns/updates/:updateId - Update a specific campaign update
// Only authenticated users (e.g., campaign creator or admin) should be able to update their updates
router.put('/updates/:updateId', authMiddleware(), campaignUpdateController.updateCampaignUpdate);

// DELETE /api/campaigns/updates/:updateId - Delete a specific campaign update
// Only authenticated users (e.g., campaign creator or admin) should be able to delete their updates
router.delete('/updates/:updateId', authMiddleware(), campaignUpdateController.deleteCampaignUpdate);

module.exports = router;