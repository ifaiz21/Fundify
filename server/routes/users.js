// server/routes/users.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const userController = require('../controllers/userController'); // Import userController

// --- Multer Storage Setup for Profile Pictures ---
const profilePicStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '..', 'public', 'uploads', 'profile_pictures');
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // Add timestamp for unique filename
  }
});

const profilePicFileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed for profile pictures!'), false);
  }
};

const uploadProfilePicture = multer({
  storage: profilePicStorage,
  fileFilter: profilePicFileFilter,
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

// --- Multer Storage Setup for KYC Documents ---
const kycDocumentStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '..', 'public', 'uploads', 'kyc_documents');
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Prefix with user ID to categorize documents per user
    cb(null, `kyc-${req.user.id}-${Date.now()}-${file.originalname}`);
  }
});

const kycDocumentFileFilter = (req, file, cb) => {
  // Allow images (JPEG, PNG) and PDFs for KYC documents
  if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only image (JPG/PNG) or PDF files are allowed for KYC documents!'), false);
  }
};

// Use .array() for multiple files (e.g., ID front/back, proof of address)
// Adjust field names as per your frontend's FormData append calls
const uploadKYCDocuments = multer({
  storage: kycDocumentStorage,
  fileFilter: kycDocumentFileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit per file for documents
}).array('kycDocuments', 5); // 'kycDocuments' is the field name, allow up to 5 files

// --- START OF NEW CODE FOR LIVENESS VERIFICATION ---

// Multer Storage Setup for KYC Liveness Images
const livenessImageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '..', 'public', 'uploads', 'kyc_liveness');
    fs.mkdirSync(uploadPath, { recursive: true }); // Ensure directory exists
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `liveness-${req.user.id}-${Date.now()}-${file.originalname}`);
  }
});

const livenessImageFileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed for liveness verification!'), false);
  }
};

const uploadLivenessImage = multer({
  storage: livenessImageStorage,
  fileFilter: livenessImageFileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit for liveness image
});

// --- END OF NEW CODE FOR LIVENESS VERIFICATION ---


// GET /api/users/profile - Authenticated user ki profile fetch karna
router.get('/profile', authMiddleware(), async (req, res) => {
  try {
    // Calling the controller function
    await userController.getProfile(req, res);
  } catch (err) {
    console.error('Error fetching user profile in route:', err);
    res.status(500).json({ message: 'Failed to fetch user profile', error: err.message });
  }
});

// PUT /api/users/profile - Authenticated user ki general profile details update karna
router.put('/profile', authMiddleware(), async (req, res) => {
  try {
    // Calling the controller function
    await userController.updateProfile(req, res);
  } catch (err) {
    console.error('Error updating user profile in route:', err);
    res.status(500).json({ message: 'Failed to update user profile', error: err.message });
  }
});

// PUT /api/users/profile-picture - Authenticated user ki profile picture update karna
router.put('/profile-picture', authMiddleware(), uploadProfilePicture.single('profilePicture'), async (req, res) => {
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

// --- KYC Document Submission Route ---
router.post('/kyc/submit-documents', authMiddleware(), (req, res, next) => {
  uploadKYCDocuments(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading.
      return res.status(400).json({ message: `File upload error: ${err.message}` });
    } else if (err) {
      // An unknown error occurred when uploading.
      return res.status(500).json({ message: `An unexpected error occurred during file upload: ${err.message}` });
    }
    // Files are uploaded, now call the controller
    try {
      await userController.submitKYCDocuments(req, res);
    } catch (controllerErr) {
      console.error('Error in userController.submitKYCDocuments:', controllerErr);
      // Clean up uploaded files if controller fails
      if (req.files && Array.isArray(req.files)) {
        req.files.forEach(file => {
          fs.unlink(file.path, (unlinkErr) => {
            if (unlinkErr) console.error('Error cleaning up file:', file.path, unlinkErr);
          });
        });
      }
      res.status(500).json({ message: 'Failed to process KYC submission', error: controllerErr.message });
    }
  });
});

// --- START OF NEW ROUTE FOR LIVENESS VERIFICATION ---
router.post('/kyc/submit-liveness', authMiddleware(), (req, res, next) => {
  uploadLivenessImage.single('livenessImage')(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ message: `File upload error: ${err.message}` });
    } else if (err) {
      return res.status(500).json({ message: `An unexpected error occurred during file upload: ${err.message}` });
    }
    // File is uploaded, now call the controller
    try {
      // Ensure req.file exists if upload was successful
      if (!req.file) {
        return res.status(400).json({ message: 'No liveness image file provided.' });
      }
      await userController.submitKYCLiveness(req, res);
    } catch (controllerErr) {
      console.error('Error in userController.submitKYCLiveness:', controllerErr);
      // Clean up uploaded file if controller fails
      if (req.file) {
        fs.unlink(req.file.path, (unlinkErr) => {
          if (unlinkErr) console.error('Error cleaning up file:', req.file.path, unlinkErr);
        });
      }
      res.status(500).json({ message: 'Failed to process KYC liveness submission', error: controllerErr.message });
    }
  });
});
// --- END OF NEW ROUTE FOR LIVENESS VERIFICATION ---


// New route to toggle saved campaigns
router.post('/saved-campaigns', authMiddleware(), userController.toggleSavedCampaign);

// New route to fetch admin email (requires authentication for now, can be adjusted)
router.get('/admin-email', authMiddleware(), userController.getAdminEmail);

module.exports = router;