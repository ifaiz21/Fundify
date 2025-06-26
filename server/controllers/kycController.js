// server/controllers/kycController.js
const KYCApplication = require('../models/KYCApplication');
const User = require('../models/User'); // Assuming you have a User model
// const { errorHandler } = require('../middleware/errorHandler'); // REMOVED THIS LINE

// Helper function to send errors, mimicking the behavior if errorHandler was present
const sendErrorResponse = (res, statusCode, message, errorDetails) => {
  console.error(message, errorDetails); // Log the error for debugging
  res.status(statusCode).json({ message, error: errorDetails ? errorDetails.message : 'Unknown error' });
};


// Function to get all KYC applications (for admin)
const getKYCApplications = async (req, res) => { // Removed next
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

    // Calculate stats (can be optimized if these stats are already returned by another API or are static)
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
const approveKYCApplication = async (req, res) => { // Removed next
  try {
    // Only allow admins to perform this action
    if (req.user.role !== 'admin') {
      return sendErrorResponse(res, 403, 'Access forbidden: Only administrators can approve KYC applications.');
    }

    const { userId } = req.params; // Get userId from params

    const kycApplication = await KYCApplication.findOneAndUpdate(
      { userId: userId, status: 'Pending Review' },
      { $set: { status: 'Approved', adminComments: '' } }, // Clear comments on approval
      { new: true }
    );

    if (!kycApplication) {
      return sendErrorResponse(res, 404, 'Pending KYC application not found for this user.');
    }

    // Update the user's KYC status in the User model
    await User.findByIdAndUpdate(userId, { kycVerified: true });

    res.status(200).json({ message: 'KYC application approved successfully.', kycApplication });
  } catch (error) {
    sendErrorResponse(res, 500, 'Failed to approve KYC application.', error);
  }
};

// Function to reject a KYC application
const rejectKYCApplication = async (req, res) => { // Removed next
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
      { userId: userId, status: 'Pending Review' },
      { $set: { status: 'Rejected', adminComments: adminComments.trim() } },
      { new: true }
    );

    if (!kycApplication) {
      return sendErrorResponse(res, 404, 'Pending KYC application not found for this user.');
    }

    // Optionally, update the user's KYC status in the User model if it was previously verified (unlikely for rejection from pending)
    // or set a flag indicating rejection. For now, we just update the KYCApplication.
    await User.findByIdAndUpdate(userId, { kycVerified: false });

    res.status(200).json({ message: 'KYC application rejected successfully.', kycApplication });
  } catch (error) {
    sendErrorResponse(res, 500, 'Failed to reject KYC application.', error);
  }
};

// Function to submit KYC application data along with file uploads (KYCFormPage and KYCDocumentUpload)
// This function would typically be called after the form data is submitted and files are uploaded.
const submitKYCApplication = async (req, res) => { // Removed next
  try {
    const userId = req.user.id; // User ID from authenticated token

    // Check if a KYC application already exists for this user and is pending or approved
    const existingKYC = await KYCApplication.findOne({ userId: userId });
    if (existingKYC && (existingKYC.status === 'Pending Review' || existingKYC.status === 'Approved')) {
      return sendErrorResponse(res, 400, 'A pending or approved KYC application already exists for this user.');
    }

    // This section assumes `req.body` contains form data and `req.files` (or `req.file`) contains uploaded file URLs.
    // Ensure your multer middleware is correctly configured to handle multiple fields if needed.
    const { fullName, email, phoneNumber, dateOfBirth, address, city, country, documentType, documentNumber } = req.body;
    
    // Assuming URLs are passed from the client or stored by a file upload middleware (e.g., Multer + Cloud Storage)
    // For local development, you might just get file paths, but for production, use URLs from a cloud storage service.
    // Multer path will be relative to the server root (e.g., 'uploads/filename.jpg')
    const documentFrontUrl = req.files?.documentFront?.[0]?.path ? `/${req.files.documentFront[0].path}` : null;
    const documentBackUrl = req.files?.documentBack?.[0]?.path ? `/${req.files.documentBack[0].path}` : null;
    const livenessImageUrl = req.files?.livenessImage?.[0]?.path ? `/${req.files.livenessImage[0].path}` : null;

    if (!fullName || !email || !dateOfBirth || !address || !city || !country || !documentType || !documentNumber || !documentFrontUrl || !livenessImageUrl) {
        return sendErrorResponse(res, 400, 'All required KYC fields and document uploads are necessary.');
    }

    // Create a new KYC application
    const newKYCApplication = new KYCApplication({
      userId,
      fullName,
      email,
      phoneNumber,
      dateOfBirth,
      address,
      city,
      country,
      documentType,
      documentNumber,
      documentFrontUrl,
      documentBackUrl, // Optional
      livenessImageUrl,
      status: 'Pending Review' // Default status
    });

    await newKYCApplication.save();

    // Optionally update the user model to reflect that KYC has been submitted
    await User.findByIdAndUpdate(userId, { kycSubmitted: true }); // A new field in User model

    res.status(201).json({ message: 'KYC application submitted successfully for review.', kycApplication: newKYCApplication });

  } catch (error) {
    sendErrorResponse(res, 500, 'Error submitting KYC application.', error);
  }
};


module.exports = {
  getKYCApplications,
  approveKYCApplication,
  rejectKYCApplication,
  submitKYCApplication
};
