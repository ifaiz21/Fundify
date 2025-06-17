// server/routes/users.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// --- Multer Storage Setup ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '..', 'public', 'uploads', 'profile_pictures');
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // Add timestamp for unique filename
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Helper function to delete old profile picture
const deleteOldProfilePicture = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (user && user.profilePictureUrl) {
      const oldImagePath = path.join(__dirname, '..', 'public', user.profilePictureUrl);
      // Check if file exists before attempting to delete
      if (fs.existsSync(oldImagePath)) {
        fs.unlink(oldImagePath, (err) => {
          if (err) console.error('Error deleting old profile picture:', oldImagePath, err);
          else console.log('Old profile picture deleted:', oldImagePath);
        });
      } else {
        console.log('Old profile picture not found at path:', oldImagePath);
      }
    }
  } catch (error) {
    console.error('Error in deleteOldProfilePicture helper:', error);
  }
};

// GET /api/users/profile - Authenticated user ki profile fetch karna
router.get('/profile', authMiddleware(), async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password -verificationCode');

    if (!user) {
      return res.status(404).json({ message: 'User profile not found' });
    }
    res.status(200).json(user);
  } catch (err) {
    console.error('Error fetching user profile:', err);
    res.status(500).json({ message: 'Failed to fetch user profile', error: err.message });
  }
});

// PUT /api/users/profile - Authenticated user ki general profile details update karna
router.put('/profile', authMiddleware(), async (req, res) => {
  try {
    const { fullName, contactNo, additionalEmails, accountType, accountNumber, cvc, expiryDate } = req.body;

    const updateFields = {};
    if (fullName !== undefined) updateFields.name = fullName;
    if (contactNo !== undefined) updateFields.contactNo = contactNo;

    // additionalEmails ko handle karein: Frontend JSON.stringify karke bhejega
    if (additionalEmails !== undefined) {
      try {
        // Agar additionalEmails empty string hai, to empty array set karein
        updateFields.additionalEmails = additionalEmails === '' ? [] : JSON.parse(additionalEmails);
        if (!Array.isArray(updateFields.additionalEmails)) {
          throw new Error('additionalEmails must be an array after parsing');
        }
      } catch (parseError) {
        console.error('Error parsing additionalEmails:', parseError);
        return res.status(400).json({ message: 'Invalid format for additional emails. Must be a valid JSON array string.' });
      }
    }


    // Payment details
    if (accountType !== undefined) updateFields.accountType = accountType;
    if (accountNumber !== undefined) updateFields.accountNumber = accountNumber;
    if (cvc !== undefined) updateFields.cvc = cvc;
    if (expiryDate !== undefined) updateFields.expiryDate = expiryDate;

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updateFields },
      { new: true, runValidators: true }
    ).select('-password -verificationCode');

    if (!updatedUser) {
      return res.status(404).json({ message: 'User profile not found or could not be updated' });
    }
    res.status(200).json({ message: 'Profile updated successfully', user: updatedUser });
  } catch (err) {
    console.error('Error updating user profile:', err);
    if (err.name === 'ValidationError') {
      const errors = Object.keys(err.errors).map(key => err.errors[key].message);
      return res.status(400).json({ message: 'Validation Error', errors });
    }
    res.status(500).json({ message: 'Failed to update user profile', error: err.message });
  }
});

// PUT /api/users/profile-picture - Authenticated user ki profile picture update karna
router.put('/profile-picture', authMiddleware(), upload.single('profilePicture'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No profile picture file provided.' });
    }

    // Purani picture delete karein
    await deleteOldProfilePicture(req.user.id);

    const newProfilePictureUrl = `/uploads/profile_pictures/${req.file.filename}`;

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: { profilePictureUrl: newProfilePictureUrl } },
      { new: true, runValidators: true }
    ).select('-password -verificationCode');

    if (!updatedUser) {
      // Agar user na mile, uploaded file ko delete karein takay storage waste na ho
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Error deleting newly uploaded file after user not found:', req.file.path, err);
      });
      return res.status(404).json({ message: 'User not found for profile picture update.' });
    }

    res.status(200).json({ message: 'Profile picture updated successfully', user: updatedUser });
  } catch (err) {
    console.error('Error updating user profile picture:', err);
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ message: `File upload error: ${err.message}` });
    }
    res.status(500).json({ message: 'Failed to update profile picture', error: err.message });
  }
});

// DELETE /api/users/profile-picture - Authenticated user ki profile picture remove karna
router.delete('/profile-picture', authMiddleware(), async (req, res) => {
  try {
    // Purani picture delete karein
    await deleteOldProfilePicture(req.user.id);

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: { profilePictureUrl: '' } }, // DB se URL clear karein
      { new: true }
    ).select('-password -verificationCode');

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found for profile picture removal.' });
    }

    res.status(200).json({ message: 'Profile picture removed successfully', user: updatedUser });
  } catch (err) {
    console.error('Error removing user profile picture:', err);
    res.status(500).json({ message: 'Failed to remove profile picture', error: err.message });
  }
});


module.exports = router;