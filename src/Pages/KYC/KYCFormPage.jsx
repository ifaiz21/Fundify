// src/Pages/KYC/KYCFormPage.jsx
"use client";
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { IoChevronBackOutline } from "react-icons/io5";
import axios from "axios";
import { showSuccessMessage, showErrorMessage } from '../../utils/toast';

const KYCFormPage = () => {
  const navigate = useNavigate();
  const location = useLocation(); // To potentially get user info if passed from UserProfileSettings

  const [formData, setFormData] = useState({
    fullName: "",
    dateOfBirth: "",
    address: "",
    idNumber: "",
    documentType: "",
    contactEmail: "", // User's primary email might already be known, but collecting for form completeness
    phoneNumber: "",
  });

  const [loading, setLoading] = useState(false);

  // You might want to pre-populate some fields if the user is logged in
  // For example, if UserProfileSettings passes current user email/name
  useEffect(() => {
    if (location.state && location.state.userProfile) {
      const user = location.state.userProfile;
      setFormData(prev => ({
        ...prev,
        fullName: user.fullName || user.name || "",
        contactEmail: user.email || "",
        phoneNumber: user.contactNo || "",
      }));
    }
  }, [location.state]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem('token');
    if (!token) {
      showErrorMessage("Authentication required. Please log in.");
      navigate("/login");
      setLoading(false);
      return;
    }

    try {
      // In a real application, you might use a dedicated KYC submission endpoint
      // For now, we'll simulate by updating the user profile with KYC data
      const response = await axios.put(
        "http://localhost:5000/api/users/profile", // Using existing updateProfile endpoint
        {
          // Map form data to user model fields
          kycDetails: { // This would be a new sub-object in your User schema
            fullName: formData.fullName,
            dateOfBirth: formData.dateOfBirth,
            address: formData.address,
            idNumber: formData.idNumber,
            documentType: formData.documentType,
            contactEmail: formData.contactEmail,
            phoneNumber: formData.phoneNumber,
          },
          kycStatus: "Pending Review", // Set status on submission
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        showSuccessMessage("KYC information submitted! Redirecting to document upload.");
        // Navigate to the next step: document upload
        // Pass relevant data, e.g., user ID
        navigate("/kyc-document-upload", { state: { userId: response.data.user._id } });
      } else {
        const errorData = response.data;
        showErrorMessage(`Submission failed: ${errorData.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("KYC form submission error:", error.response?.data || error.message);
      showErrorMessage(`An error occurred: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <> {/* Added React Fragment */}
      <div className="flex flex-col min-h-screen bg-[#F0FFF0] font-Inter">
        <div className="absolute p-4">
          <button onClick={() => navigate("/user-profile")} className="text-lg text-[#91ac8f] hover:text-[#667964] transition duration-300 mb-4 flex items-center font-semibold">
            <IoChevronBackOutline size={20} /> Back to Profile
          </button>
        </div>

        <div className="flex h-full items-center justify-center py-12">
          <div className="form-container w-full max-w-md mx-auto">
            <p className="title text-[#4b5849]">Know Your Customer (KYC) Information</p>

            <form className="form" onSubmit={handleSubmit}>
              {/* Personal Information */}
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Personal Information</h3>
              <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Full Name" className="input" required />
              <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} className="input" required /> {/* Removed placeholder for date input as it's not standard */}
              <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Address" className="input" required />

              {/* Identification Details */}
              <h3 className="text-lg font-semibold text-gray-700 mt-4 mb-2">Identification Details</h3>
              <input type="text" name="idNumber" value={formData.idNumber} onChange={handleChange} placeholder="ID Number" className="input" required />
              <select name="documentType" value={formData.documentType} onChange={handleChange} className="input" required>
                <option value="">Select document type</option>
                <option value="National ID Card">National ID Card</option>
                <option value="Passport">Passport</option>
                <option value="Driving License">Driving License</option>
              </select>

              {/* Contact Information */}
              <h3 className="text-lg font-semibold text-gray-700 mt-4 mb-2">Contact Information</h3>
              <input type="email" name="contactEmail" value={formData.contactEmail} onChange={handleChange} placeholder="Email" className="input" required />
              <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} placeholder="Phone Number" className="input" required />

              <button type="submit" className="form-btn mt-6" disabled={loading}>
                {loading ? "Submitting..." : "Submit"}
              </button>
            </form>
          </div>
        </div>
      </div>
      <style jsx>{`
        .form-container {
          background-color: #fff;
          box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
          border-radius: 10px;
          padding: 20px 30px;
          display: flex;
          flex-direction: column;
          gap: 15px; /* Adjust gap between elements */
          max-width: 500px; /* Limit width */
        }
        .title {
          text-align: center;
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 20px;
        }
        .form {
          display: flex;
          flex-direction: column;
          gap: 10px; /* Adjust gap between form fields */
        }
        .input {
          border-radius: 8px; /* Slightly rounded corners */
          border: 1px solid #c0c0c0;
          outline: none;
          padding: 10px 12px;
          width: 100%;
          box-sizing: border-box; /* Include padding in width */
        }
        .input:focus {
          border-color: #4B5842;
          box-shadow: 0 0 0 1px #4B5842;
        }
        .form-btn {
          padding: 12px 20px;
          border-radius: 20px;
          border: none;
          outline: none;
          background: #4B5842;
          color: white;
          cursor: pointer;
          font-size: 16px;
          font-weight: 600;
          transition: background-color 0.3s ease;
        }
        .form-btn:hover:not(:disabled) {
          background-color: #3A4433;
        }
        .form-btn:disabled {
          background-color: #a0a0a0;
          cursor: not-allowed;
        }
      `}</style>
    </> // Added React Fragment closing tag
  );
};

export default KYCFormPage;