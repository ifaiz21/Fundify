// server/controllers/kycController.js
const KYCApplication = require('../models/KYCApplication');
const User = require('../models/User'); // Assuming you have a User model

// Helper function to send errors
const sendErrorResponse = (res, statusCode, message, errorDetails) => {
    console.error(message, errorDetails); // Log the error for debugging
    res.status(statusCode).json({ message, error: errorDetails ? errorDetails.message : 'Unknown error' });
};

// Function to get all KYC applications (for admin)
const getKYCApplications = async (req, res) => {
    try {
        // Only allow admins to access this endpoint
        if (req.user.role !== 'admin') {
            return sendErrorResponse(res, 403, 'Access forbidden: Only administrators can view KYC applications.');
        }

        const { status } = req.query; // Allow filtering by status (e.g., Pending Review, Approved, Rejected)
        let query = {};

        if (status) {
            query.status = status;
        }

        const kycApplications = await KYCApplication.find(query)
            .populate('userId', 'name email') // Populate user details (name and email)
            .sort({ createdAt: -1 }); // Sort by most recent

        // Calculate stats
        const total = await KYCApplication.countDocuments();
        const approved = await KYCApplication.countDocuments({ status: 'Approved' });
        const rejected = await KYCApplication.countDocuments({ status: 'Rejected' });
        const pending = await KYCApplication.countDocuments({ status: 'Pending Review' });

        res.status(200).json({
            kycApplications,
            stats: { total, approved, rejected, pending }
        });
    } catch (error) {
        sendErrorResponse(res, 500, 'Failed to retrieve KYC applications.', error);
    }
};

// Function to approve a KYC application
const approveKYCApplication = async (req, res) => {
    console.log('Attempting to approve KYC. User:', req.user, 'UserId from params:', req.params.userId);
    try {
        // Only allow admins to perform this action
        if (req.user.role !== 'admin') {
            return sendErrorResponse(res, 403, 'Access forbidden: Only administrators can approve KYC applications.');
        }

        const { userId } = req.params; // Get userId from params

        const kycApplication = await KYCApplication.findOneAndUpdate(
            { userId: userId, status: 'Pending Review' }, // Ensure only pending applications can be approved
            { $set: { status: 'Approved', adminComments: '' } }, // Clear comments on approval
            { new: true }
        );

        if (!kycApplication) {
            return sendErrorResponse(res, 404, 'Pending KYC application not found for this user, or already processed.');
        }

        // UPDATED: Update the user's KYC status in the User model to verified and set kycStatus to 'Approved'
        await User.findByIdAndUpdate(userId, { kycVerified: true, kycSubmitted: true, kycStatus: 'Approved' });

        res.status(200).json({ message: 'KYC application approved successfully.', kycApplication });
    } catch (error) {
        sendErrorResponse(res, 500, 'Failed to approve KYC application.', error);
    }
};

// Function to reject a KYC application
const rejectKYCApplication = async (req, res) => {
    console.log('Attempting to reject KYC. User:', req.user, 'UserId from params:', req.params.userId);
    console.log('Admin Comments for rejection:', req.body.adminComments);
    try {
        // Only allow admins to perform this action
        if (req.user.role !== 'admin') {
            return sendErrorResponse(res, 403, 'Access forbidden: Only administrators can reject KYC applications.');
        }

        const { userId } = req.params; // Get userId from params
        const { adminComments } = req.body; // Expect comments for rejection

        if (!adminComments || adminComments.trim() === '') {
            return sendErrorResponse(res, 400, 'Admin comments are required when rejecting a KYC application.');
        }

        const kycApplication = await KYCApplication.findOneAndUpdate(
            { userId: userId, status: 'Pending Review' }, // Ensure only pending applications can be rejected
            { $set: { status: 'Rejected', adminComments: adminComments.trim() } },
            { new: true }
        );

        if (!kycApplication) {
            return sendErrorResponse(res, 404, 'Pending KYC application not found for this user, or already processed.');
        }

        // UPDATED: Update the user's KYC status to submitted:true, verified:false, and set kycStatus to 'Rejected' on rejection
        await User.findByIdAndUpdate(userId, { kycVerified: false, kycSubmitted: true, kycStatus: 'Rejected' });

        res.status(200).json({ message: 'KYC application rejected successfully.', kycApplication });
    } catch (error) {
        sendErrorResponse(res, 500, 'Failed to reject KYC application.', error);
    }
};

// Function to submit initial KYC application data (from KYCFormPage)
const submitKYCApplication = async (req, res) => {
    console.log("Received KYC submission payload on backend:", req.body);
    try {
        const userId = req.user.id; // User ID from authenticated token

        const existingKYC = await KYCApplication.findOne({ userId: userId });

        if (existingKYC && existingKYC.status === 'Approved') {
            return sendErrorResponse(res, 400, 'An approved KYC application already exists for this user.');
        } else if (existingKYC && existingKYC.status === 'Pending Review') {
            return sendErrorResponse(res, 400, 'A pending KYC application already exists for this user.');
        }

        const { fullName, email, phoneNumber, dateOfBirth, address, city, country, documentType, documentNumber } = req.body;

        console.log(`Debugging validation:
            fullName: ${fullName} (truthy: ${!!fullName})
            email: ${email} (truthy: ${!!email})
            phoneNumber: ${phoneNumber} (truthy: ${!!phoneNumber})
            dateOfBirth: ${dateOfBirth} (truthy: ${!!dateOfBirth})
            address: ${address} (truthy: ${!!address})
            documentType: ${documentType} (truthy: ${!!documentType})
            documentNumber: ${documentNumber} (truthy: ${!!documentNumber})
            city: ${city} (truthy: ${!!city})
            country: ${country} (truthy: ${!!country})
        `);

        if (!fullName || !email || !phoneNumber || !dateOfBirth || !address || !documentType || !documentNumber) {
            return sendErrorResponse(res, 400, 'All required personal and identification fields are necessary.');
        }

        let kycApplication;

        if (existingKYC && existingKYC.status === 'Rejected') {
            kycApplication = await KYCApplication.findByIdAndUpdate(
                existingKYC._id,
                {
                    fullName,
                    email,
                    phoneNumber,
                    dateOfBirth,
                    address,
                    city: city || '',
                    country: country || '',
                    documentType,
                    documentNumber,
                    documentFrontUrl: null,
                    documentBackUrl: null,
                    livenessImageUrl: null,
                    status: 'Pending Review',
                    adminComments: '',
                    createdAt: Date.now(),
                },
                { new: true, runValidators: true }
            );
        } else {
            kycApplication = new KYCApplication({
                userId,
                fullName,
                email,
                phoneNumber,
                dateOfBirth,
                address,
                city: city || '',
                country: country || '',
                documentType,
                documentNumber,
                status: 'Pending Review'
            });
            await kycApplication.save();
        }

        // UPDATED: Also update kycStatus in User model when KYC is submitted
        await User.findByIdAndUpdate(userId, { kycSubmitted: true, kycVerified: false, kycStatus: 'Pending Review' });

        res.status(201).json({ message: 'KYC application initial data submitted successfully. Proceed to document upload.', kycApplication });

    } catch (error) {
        sendErrorResponse(res, 500, 'Error submitting KYC application initial data.', error);
    }
};

// NEW FUNCTION: Get authenticated user's own KYC application details
const getMyKYCApplication = async (req, res) => {
    try {
        const userId = req.user.id; // User ID from authenticated token

        const kycApplication = await KYCApplication.findOne({ userId: userId });

        if (!kycApplication) {
            // If no KYC application is found, return a specific message
            return res.status(200).json({ message: 'No KYC application submitted yet.', kycApplication: null });
        }

        res.status(200).json({ message: 'KYC application found.', kycApplication });
    } catch (error) {
        sendErrorResponse(res, 500, 'Failed to retrieve user\'s KYC application.', error);
    }
};

// NEW FUNCTION: Delete a KYC application (Admin action, also resets user's KYC status)
const deleteKYCApplication = async (req, res) => {
    try {
        // Only allow admins to perform this action
        if (req.user.role !== 'admin') {
            return sendErrorResponse(res, 403, 'Access forbidden: Only administrators can delete KYC applications.');
        }

        const { userId } = req.params; // Get userId from params

        const kycApplication = await KYCApplication.findOneAndDelete({ userId: userId });

        if (!kycApplication) {
            return sendErrorResponse(res, 404, 'KYC application not found for this user.');
        }

        // IMPORTANT: Reset the user's KYC status fields in the User model
        await User.findByIdAndUpdate(userId, {
            kycSubmitted: false,
            kycVerified: false,
            kycStatus: 'Not Submitted'
        });

        res.status(200).json({ message: 'KYC application deleted successfully and user KYC status reset.' });
    } catch (error) {
        sendErrorResponse(res, 500, 'Failed to delete KYC application.', error);
    }
};


module.exports = {
    getKYCApplications,
    approveKYCApplication,
    rejectKYCApplication,
    submitKYCApplication,
    getMyKYCApplication,
    deleteKYCApplication // <-- Export the new function
};