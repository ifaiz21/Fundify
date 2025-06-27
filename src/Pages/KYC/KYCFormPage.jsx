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
    idNumber: "", // Keep idNumber in formData state
    documentType: "",
    email: "",
    phoneNumber: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (location.state && location.state.userProfile) {
      const user = location.state.userProfile;
      setFormData(prev => ({
        ...prev,
        fullName: user.fullName || user.name || "",
        email: user.email || "",
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

    console.log("Form Data to Send:", formData);

    try {
      const response = await axios.post(
        "https://server-fundify.up.railway.app/api/kyc/submit",
        {
          fullName: formData.fullName,
          dateOfBirth: formData.dateOfBirth,
          address: formData.address,
          // IMPORTANT CHANGE: Send idNumber as documentNumber to match backend expectation
          documentNumber: formData.idNumber,
          documentType: formData.documentType,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          // city and country are not provided by this form, and are optional on backend
          // so no need to send them as undefined/empty strings explicitly if not collected.
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        showSuccessMessage("KYC information submitted! Redirecting to document upload.");
        navigate("/kyc-document-upload");
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
    <>
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
              <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} className="input" required />
              <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Address" className="input" required />

              {/* Identification Details */}
              <h3 className="text-lg font-semibold text-gray-700 mt-4 mb-2">Identification Details</h3>
              {/* IMPORTANT: Name of this input is now idNumber, but it is mapped to documentNumber in handleSubmit */}
              <input type="text" name="idNumber" value={formData.idNumber} onChange={handleChange} placeholder="ID Number" className="input" required />
              <select name="documentType" value={formData.documentType} onChange={handleChange} className="input" required>
                <option value="">Select document type</option>
                <option value="National ID Card">National ID Card</option>
                <option value="Passport">Passport</option>
                <option value="Driving License">Driving License</option>
              </select>

              {/* Contact Information */}
              <h3 className="text-lg font-semibold text-gray-700 mt-4 mb-2">Contact Information</h3>
              <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" className="input" required />
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
          gap: 15px;
          max-width: 500px;
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
          gap: 10px;
        }
        .input {
          border-radius: 8px;
          border: 1px solid #c0c0c0;
          outline: none;
          padding: 10px 12px;
          width: 100%;
          box-sizing: border-box;
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
    </>
  );
};

export default KYCFormPage;
