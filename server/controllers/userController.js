// server/controllers/userController.js
const User = require('../models/User');
const Campaign = require('../models/Campaign'); // Import Campaign model
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); // Assuming JWT might be needed for some profile operations or if token is generated here
const fs = require('fs'); // For file system operations, e.g., deleting failed uploads
const path = require('path'); // For path operations

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

// New function to fetch the email of a user with the 'admin' role
exports.getAdminEmail = async (req, res) => {
    try {
        // Find a user with the role 'admin' and select only their email
        const adminUser = await User.findOne({ role: 'admin' }).select('email -_id'); // -_id to exclude the ID

        if (!adminUser) {
            return res.status(404).json({ message: 'Admin user not found.' });
        }

        res.status(200).json({ adminEmail: adminUser.email });
    } catch (err) {
        console.error('Error fetching admin email:', err);
        res.status(500).json({ message: 'Server error while fetching admin email.', error: err.message });
    }
};

// --- NEW FUNCTION: Submit KYC Documents ---
exports.submitKYCDocuments = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);

        if (!user) {
            // If user not found, delete uploaded files to prevent junk data
            if (req.files && Array.isArray(req.files)) {
                req.files.forEach(file => {
                    fs.unlink(file.path, (err) => {
                        if (err) console.error('Error cleaning up file for unfound user:', file.path, err);
                    });
                });
            }
            return res.status(404).json({ message: 'User not found.' });
        }

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'No KYC documents provided.' });
        }

        // Extract paths of uploaded files
        const documentPaths = req.files.map(file => `/uploads/kyc_documents/${file.filename}`);

        // In a real application, you might want to store these paths in the User model
        // For example, by adding a new field like 'kycDocuments': [{ path: String, uploadedAt: Date }]
        // user.kycDocuments = user.kycDocuments.concat(documentPaths.map(p => ({ path: p, uploadedAt: new Date() })));
        // For now, we are just updating the kycStatus.

        // Update KYC status to 'Pending Review'
        user.kycStatus = 'Pending Review';
        await user.save();

        res.status(200).json({
            message: 'KYC documents submitted successfully. Your status is now Pending Review.',
            kycStatus: user.kycStatus,
            // You might return documentPaths here for confirmation, but avoid sensitive data
            // uploadedDocuments: documentPaths
        });

    } catch (err) {
        console.error('Error submitting KYC documents:', err);
        // If an error occurs during processing, clean up uploaded files
        if (req.files && Array.isArray(req.files)) {
            req.files.forEach(file => {
                fs.unlink(file.path, (unlinkErr) => {
                    if (unlinkErr) console.error('Error cleaning up file after KYC submission failure:', file.path, unlinkErr);
                });
            });
        }
        res.status(500).json({ message: 'Failed to submit KYC documents.', error: err.message });
    }
};

// --- START OF NEW CODE FOR LIVENESS VERIFICATION CONTROLLER ---
exports.submitKYCLiveness = async (req, res) => {
  try {
    const userId = req.user.id; // User ID from authMiddleware
    // Multer places the single file on req.file
    if (!req.file) {
      return res.status(400).json({ message: 'No liveness image file provided.' });
    }

    const livenessImagePath = `/uploads/kyc_liveness/${req.file.filename}`;

    // Find the user and update their KYC details
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          'kyc.livenessImagePath': livenessImagePath, // Store the path to the liveness image
          'kyc.status': 'Pending Review' // Update KYC status
        }
      },
      { new: true, runValidators: true } // Return the updated document and run schema validators
    ).select('-password -verificationCode'); // Exclude sensitive info from the response

    if (!updatedUser) {
      // If user not found, delete the uploaded file to prevent junk data
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Error deleting liveness image after user not found:', req.file.path, err);
      });
      return res.status(404).json({ message: 'User not found for liveness verification update.' });
    }

    res.status(200).json({
      message: 'Liveness image submitted successfully for verification!',
      user: updatedUser // Return updated user object
    });
  } catch (error) {
    console.error('Error in submitKYCLiveness controller:', error);
    // If an error occurs during processing or DB update, clean up the uploaded file
    if (req.file) {
      fs.unlink(req.file.path, (unlinkErr) => {
        if (unlinkErr) console.error('Error cleaning up file after controller error:', req.file.path, unlinkErr);
      });
    }
    res.status(500).json({ message: 'Failed to process KYC liveness submission', error: error.message });
  }
};