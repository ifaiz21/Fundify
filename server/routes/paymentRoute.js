const express = require('express');
const router = express.Router();

const { processPayment } = require('../controllers/paymentController');
const { isAuthenticatedUser } = require('../middleware/auth');

router.route('/payment/process').post(isAuthenticatedUser, processPayment);

module.exports = router;