// server/controllers/userController.js
const User = require('../models/User');
const Campaign = require('../models/Campaign'); // Import Campaign model
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); // Assuming JWT might be needed for some profile operations or if token is generated here
// const upload = require('../middleware/multer'); // Agar Multer yahan use hota hai, warna route mein handle hoga

// Get all users (Admin only)
exports.getAllUsers = async (req, res) => {
    try {
        // Find all users and select specific fields, exclude password and verification code
        const users = await User.find({}).select('-password -verificationCode');
        res.status(200).json(users);
    } catch (err) {
        console.error('Get all users error:', err);
        res.status(500).json({ message: 'Failed to retrieve users', error: err.message });
    }
};

// Get user profile
exports.getProfile = async (req, res) => {
    try {
        // req.user will be populated by the auth middleware
        // Populate savedCampaigns to get full campaign objects for the user's saved list
        const user = await User.findById(req.user.id).select('-password -verificationCode').populate('savedCampaigns');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        console.error('Get profile error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update user profile
exports.updateProfile = async (req, res) => {
    const { name, email, contactNo, accountNumber, accountType, additionalEmails } = req.body;
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.name = name || user.name;
        user.email = email || user.email; // Email change requires re-verification logic (not implemented here)
        user.contactNo = contactNo || user.contactNo;
        user.accountNumber = accountNumber || user.accountNumber;
        user.accountType = accountType || user.accountType;
        user.additionalEmails = additionalEmails || user.additionalEmails;

        await user.save();
        res.json({ message: 'Profile updated successfully', user });
    } catch (err) {
        console.error('Update profile error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update user password
exports.updatePassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Current password incorrect' });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();

        res.json({ message: 'Password updated successfully' });
    } catch (err) {
        console.error('Update password error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Upload profile picture (assuming multer has processed the file)
exports.uploadProfilePicture = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (req.file) {
            user.profilePictureUrl = `/uploads/profile_pictures/${req.file.filename}`;
            await user.save();
            res.json({ message: 'Profile picture uploaded successfully', profilePictureUrl: user.profilePictureUrl });
        } else {
            res.status(400).json({ message: 'No file uploaded' });
        }
    } catch (err) {
        console.error('Upload profile picture error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Remove profile picture
exports.removeProfilePicture = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.profilePictureUrl = null; // Ya default image URL
        await user.save();
        res.json({ message: 'Profile picture removed successfully' });
    } catch (err) {
        console.error('Remove profile picture error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Toggle saving a campaign (add/remove from savedCampaigns array)
exports.toggleSavedCampaign = async (req, res) => {
    try {
      const userId = req.user.id; // From authMiddleware
      const { campaignId } = req.body;

      if (!campaignId) {
        return res.status(400).json({ message: 'Campaign ID is required.' });
      }

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }

      const campaignExists = await Campaign.findById(campaignId);
      if (!campaignExists) {
          return res.status(404).json({ message: 'Campaign not found.' });
      }

      const isSaved = user.savedCampaigns.includes(campaignId);

      if (isSaved) {
        // Remove from saved campaigns
        user.savedCampaigns.pull(campaignId);
        await user.save();
        res.status(200).json({ message: 'Campaign removed from saved.', saved: false });
      } else {
        // Add to saved campaigns
        user.savedCampaigns.push(campaignId);
        await user.save();
        res.status(200).json({ message: 'Campaign added to saved.', saved: true });
      }
    } catch (err) {
      console.error('Error toggling saved campaign:', err);
      res.status(500).json({ message: 'Failed to update saved campaigns.', error: err.message });
    }
};