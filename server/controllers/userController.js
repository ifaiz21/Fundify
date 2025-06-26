const User = require('../models/User');
const KYCApplication = require('../models/KYCApplication'); // Import KYCApplication model
const Campaign = require('../models/Campaign');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs'); // For file system operations, e.g., deleting failed uploads
const path = require('path'); // For path operations

// Helper function to send errors, mimicking the behavior if errorHandler was present
const sendErrorResponse = (res, statusCode, message, errorDetails) => {
    console.error(message, errorDetails); // Log the error for debugging
    res.status(statusCode).json({ message, error: errorDetails ? errorDetails.message : 'Unknown error' });
};


// Get all users (Admin only)
exports.getAllUsers = async (req, res) => {
    try {
        // Find all users and select specific fields, exclude password and verification code
        const users = await User.find({}).select('-password -verificationCode');
        res.status(200).json(users);
    } catch (err) {
        console.error('Get all users error:', err);
        sendErrorResponse(res, 500, 'Failed to retrieve users', err);
    }
};

// Get user profile
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
            .select('-password -verificationCode')
            .populate('savedCampaigns'); // Populate savedCampaigns to get full campaign objects for the user's saved list

        if (!user) {
            return sendErrorResponse(res, 404, 'User not found');
        }
        res.json(user);
    } catch (err) {
        console.error('Get profile error:', err);
        sendErrorResponse(res, 500, 'Server error');
    }
};

// Update user profile
exports.updateProfile = async (req, res) => {
    const { name, email, contactNo, accountNumber, accountType, additionalEmails } = req.body;
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return sendErrorResponse(res, 404, 'User not found');
        }

        user.name = name || user.name;
        user.email = email || user.email; // Email change requires re-verification logic (not implemented here)
        user.contactNo = contactNo || user.contactNo;
        user.accountNumber = accountNumber || user.accountNumber;
        user.accountType = accountType || user.accountType;
        
        // Ensure additionalEmails is handled correctly (it might come as a JSON string)
        try {
            user.additionalEmails = additionalEmails ? JSON.parse(additionalEmails) : user.additionalEmails;
        } catch (parseError) {
            console.warn("Could not parse additionalEmails as JSON, using raw value if it's an array directly.", parseError);
            user.additionalEmails = additionalEmails; // Assume it's already an array if parsing fails
        }


        await user.save();
        res.json({ message: 'Profile updated successfully', user });
    } catch (err) {
        console.error('Update profile error:', err);
        sendErrorResponse(res, 500, 'Server error');
    }
};

// Update user password
exports.updatePassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return sendErrorResponse(res, 404, 'User not found');
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return sendErrorResponse(res, 400, 'Current password incorrect');
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();

        res.json({ message: 'Password updated successfully' });
    } catch (err) {
        console.error('Update password error:', err);
        sendErrorResponse(res, 500, 'Server error');
    }
};

// Upload profile picture (assuming multer has processed the file)
exports.uploadProfilePicture = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            // If user not found, delete the uploaded file
            if (req.file) {
                fs.unlink(req.file.path, (err) => {
                    if (err) console.error('Error deleting profile picture for unfound user:', req.file.path, err);
                });
            }
            return sendErrorResponse(res, 404, 'User not found');
        }

        if (req.file) {
            // Delete old profile picture if it exists and is not the default
            if (user.profilePictureUrl && user.profilePictureUrl !== '/Images/default-avatar.png') {
                const oldPath = path.join(__dirname, '../..', user.profilePictureUrl);
                fs.unlink(oldPath, (err) => {
                    if (err) console.error('Error deleting old profile picture:', oldPath, err);
                });
            }
            user.profilePictureUrl = `/uploads/profile_pictures/${req.file.filename}`;
            await user.save();
            res.json({ message: 'Profile picture uploaded successfully', user }); // Return user object as well for consistency
        } else {
            sendErrorResponse(res, 400, 'No file uploaded');
        }
    } catch (err) {
        console.error('Upload profile picture error:', err);
        // If an error occurs, clean up the uploaded file
        if (req.file) {
            fs.unlink(req.file.path, (unlinkErr) => {
                if (unlinkErr) console.error('Error cleaning up file after profile picture upload failure:', req.file.path, unlinkErr);
            });
        }
        sendErrorResponse(res, 500, 'Server error');
    }
};

// Remove profile picture
exports.removeProfilePicture = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return sendErrorResponse(res, 404, 'User not found');
        }

        // Delete the actual file if it's not the default and exists
        if (user.profilePictureUrl && user.profilePictureUrl !== '/Images/default-avatar.png') {
            const filePath = path.join(__dirname, '../..', user.profilePictureUrl);
            fs.unlink(filePath, (err) => {
                if (err) console.error('Error deleting file:', filePath, err);
            });
        }

        user.profilePictureUrl = null; // Set to null or a default image path
        await user.save();
        res.json({ message: 'Profile picture removed successfully', user }); // Return user object
    } catch (err) {
        console.error('Remove profile picture error:', err);
        sendErrorResponse(res, 500, 'Server error');
    }
};

// Toggle saving a campaign (add/remove from savedCampaigns array)
exports.toggleSavedCampaign = async (req, res) => {
    try {
        const userId = req.user.id; // From authMiddleware
        const { campaignId } = req.body;

        if (!campaignId) {
            return sendErrorResponse(res, 400, 'Campaign ID is required.');
        }

        const user = await User.findById(userId);
        if (!user) {
            return sendErrorResponse(res, 404, 'User not found.');
        }

        const campaignExists = await Campaign.findById(campaignId);
        if (!campaignExists) {
            return sendErrorResponse(res, 404, 'Campaign not found.');
        }

        const isSaved = user.savedCampaigns.includes(campaignId);

        if (isSaved) {
            user.savedCampaigns.pull(campaignId);
            await user.save();
            res.status(200).json({ message: 'Campaign removed from saved.', saved: false });
        } else {
            user.savedCampaigns.push(campaignId);
            await user.save();
            res.status(200).json({ message: 'Campaign added to saved.', saved: true });
        }
    } catch (err) {
        console.error('Error toggling saved campaign:', err);
        sendErrorResponse(res, 500, 'Failed to update saved campaigns.', err);
    }
};

// New function to fetch the email of a user with the 'admin' role
exports.getAdminEmail = async (req, res) => {
    try {
        // Find a user with the role 'admin' and select only their email
        const adminUser = await User.findOne({ role: 'admin' }).select('email -_id'); // -_id to exclude the ID

        if (!adminUser) {
            return sendErrorResponse(res, 404, 'Admin user not found.');
        }

        res.status(200).json({ adminEmail: adminUser.email });
    } catch (err) {
        console.error('Error fetching admin email:', err);
        sendErrorResponse(res, 500, 'Server error while fetching admin email.', err);
    }
};

// --- MODIFIED FUNCTION: Submit KYC Documents ---
exports.submitKYCDocuments = async (req, res) => {
    try {
        const userId = req.user.id;

        // Find the user's KYC application
        const kycApplication = await KYCApplication.findOne({ userId: userId });

        if (!kycApplication) {
            // If no KYC application exists, it means the initial form wasn't submitted first.
            // Delete uploaded files to prevent junk data.
            if (req.files && Array.isArray(req.files)) {
                req.files.forEach(file => {
                    fs.unlink(file.path, (err) => {
                        if (err) console.error('Error cleaning up file for missing KYC application:', file.path, err);
                    });
                });
            }
            return sendErrorResponse(res, 404, 'KYC application not found. Please submit the KYC form first.');
        }

        if (!req.files || req.files.length < 2) { // Expecting at least two files (front and back of ID)
            return sendErrorResponse(res, 400, 'Both front and back ID documents are required.');
        }

        // Get file paths. Assuming req.files is an array from Multer's .array() or .fields()
        // If using .fields(), filenames will be accessible via req.files['fieldName'][0].filename
        // For .array(), you'd typically have specific names or infer order.
        // Let's assume order: first file is front, second is back.
        const documentFrontUrl = `/uploads/kyc_documents/${req.files[0].filename}`;
        const documentBackUrl = `/uploads/kyc_documents/${req.files[1].filename}`;

        // Update the KYCApplication document with the file URLs
        kycApplication.documentFrontUrl = documentFrontUrl;
        kycApplication.documentBackUrl = documentBackUrl;
        // The status remains 'Pending Review' as it was set in submitKYCApplication

        await kycApplication.save();

        res.status(200).json({
            message: 'KYC documents submitted successfully to your application. Proceed to liveness verification.',
            kycApplication: kycApplication
        });

    } catch (err) {
        console.error('Error submitting KYC documents:', err);
        // If an error occurs during processing, clean up uploaded files
        if (req.files && Array.isArray(req.files)) {
            req.files.forEach(file => {
                fs.unlink(file.path, (unlinkErr) => {
                    if (unlinkErr) console.error('Error cleaning up file after KYC document submission failure:', file.path, unlinkErr);
                });
            });
        }
        sendErrorResponse(res, 500, 'Failed to submit KYC documents.', err);
    }
};

// --- MODIFIED FUNCTION: Submit KYC Liveness ---
exports.submitKYCLiveness = async (req, res) => {
    try {
        const userId = req.user.id;

        // Find the user's KYC application
        const kycApplication = await KYCApplication.findOne({ userId: userId });

        if (!kycApplication) {
            // If no KYC application exists, delete uploaded file
            if (req.file) {
                fs.unlink(req.file.path, (err) => {
                    if (err) console.error('Error cleaning up liveness file for missing KYC application:', req.file.path, err);
                });
            }
            return sendErrorResponse(res, 404, 'KYC application not found. Please submit the KYC form and documents first.');
        }

        // Multer places the single file on req.file
        if (!req.file) {
            return sendErrorResponse(res, 400, 'No liveness image file provided.');
        }

        const livenessImageUrl = `/uploads/kyc_liveness/${req.file.filename}`;

        // Update the KYCApplication document with the liveness image URL
        kycApplication.livenessImageUrl = livenessImageUrl;
        // The status remains 'Pending Review' as it was set in submitKYCApplication

        await kycApplication.save();

        res.status(200).json({
            message: 'Liveness image submitted successfully to your KYC application!',
            kycApplication: kycApplication
        });
    } catch (error) {
        console.error('Error in submitKYCLiveness controller:', error);
        // If an error occurs during processing or DB update, clean up the uploaded file
        if (req.file) {
            fs.unlink(req.file.path, (unlinkErr) => {
                if (unlinkErr) console.error('Error cleaning up file after KYC liveness submission failure:', req.file.path, unlinkErr);
            });
        }
        sendErrorResponse(res, 500, 'Failed to process KYC liveness submission', error);
    }
};
