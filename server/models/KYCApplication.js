const mongoose = require('mongoose');

const kycApplicationSchema = new mongoose.Schema({
    // Reference to the User who submitted the KYC
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Assuming your User model is named 'User'
        required: true,
        unique: true // A user should only have one KYC application at a time
    },
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    phoneNumber: {
        type: String,
        trim: true
    },
    dateOfBirth: {
        type: Date,
        required: true
    },
    address: {
        type: String,
        required: true,
        trim: true
    },
    city: {
        type: String,
        required: false, // Changed to not required, as it's not sent from KYCFormPage
        trim: true
    },
    country: {
        type: String,
        required: false, // Changed to not required, as it's not sent from KYCFormPage
        trim: true
    },
    // Document details
    documentType: {
        type: String,
        enum: ['National ID Card', 'Passport', 'Driving License', 'Other'],
        required: true
    },
    documentNumber: {
        type: String,
        required: true,
        trim: true
    },
    documentFrontUrl: { // URL to the uploaded front side of the document
        type: String,
        // This will be set by submitKYCDocuments, not the initial form
        // It's required for a complete KYC application, but not on initial creation
        required: false // Temporarily set to false, set to true if validation happens after all steps
    },
    documentBackUrl: { // URL to the uploaded back side of the document (optional for some document types)
        type: String,
        required: false // Not always required
    },
    livenessImageUrl: { // URL to the uploaded liveness image
        type: String,
        // This will be set by submitKYCLiveness, not the initial form
        // It's required for a complete KYC application, but not on initial creation
        required: false // Temporarily set to false, set to true if validation happens after all steps
    },
    // Status of the KYC application
    status: {
        type: String,
        enum: ['Pending Review', 'Approved', 'Rejected'],
        default: 'Pending Review'
    },
    // Admin comments if rejected
    adminComments: {
        type: String,
        trim: true
    }
}, {
    timestamps: true // Adds createdAt and updatedAt timestamps
});

const KYCApplication = mongoose.model('KYCApplication', kycApplicationSchema);

module.exports = KYCApplication;
