// routes/admin.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

router.get('/dashboard', auth(['admin']), (req, res) => {
  res.json({ message: `Welcome Admin ${req.user.id}` });
});

module.exports = router;
