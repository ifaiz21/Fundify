// src/Pages/KYC/KYCDocumentUpload.jsx
"use client";
import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { IoChevronBackOutline } from "react-icons/io5";
import { FiUploadCloud } from "react-icons/fi"; // Icon for upload
import axios from "axios";
import { showSuccessMessage, showErrorMessage } from '../../utils/toast';

const KYCDocumentUpload = () => {
  const navigate = useNavigate();
  const [frontIdFile, setFrontIdFile] = useState(null);
  const [backIdFile, setBackIdFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const frontInputRef = useRef(null);
  const backInputRef = useRef(null);

  const handleFileChange = (e, setFile) => {
    const file = e.target.files[0];
    if (file) {
      // Basic file type validation (can be more robust on backend)
      const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        showErrorMessage("Unsupported file type. Please upload JPG, PNG, or PDF.");
        setFile(null);
        e.target.value = null; // Clear the input
        return;
      }
      // Max file size (e.g., 5MB)
      if (file.size > 5 * 1024 * 1024) {
        showErrorMessage("File size exceeds 5MB limit.");
        setFile(null);
        e.target.value = null; // Clear the input
        return;
      }
      setFile(file);
    }
  };

  const handleDrop = (e, setFile) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      // Basic file type validation (can be more robust on backend)
      const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        showErrorMessage("Unsupported file type. Please upload JPG, PNG, or PDF.");
        setFile(null);
        return;
      }
      // Max file size (e.g., 5MB)
      if (file.size > 5 * 1024 * 1024) {
        showErrorMessage("File size exceeds 5MB limit.");
        setFile(null);
        return;
      }
      setFile(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleSubmitDocuments = async () => {
    if (!frontIdFile || !backIdFile) {
      showErrorMessage("Please upload both front and back of your ID.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('kycDocuments', frontIdFile);
    formData.append('kycDocuments', backIdFile);
    formData.append('kycStatus', 'Pending Review'); // Update KYC status on submission

    const token = localStorage.getItem('token');
    if (!token) {
      showErrorMessage("Authentication required. Please log in.");
      navigate("/login");
      setLoading(false);
      return;
    }

    try {
      // This endpoint needs to be created on the backend to handle file uploads
      // and update the user's KYC details with document paths.
      const response = await axios.post("http://localhost:5000/api/users/kyc/submit-documents", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        showSuccessMessage("Documents uploaded successfully! Redirecting to liveness verification.");
        navigate("/kyc-liveness-verification"); // Navigate to the next step
      } else {
        const errorData = response.data;
        showErrorMessage(`Upload failed: ${errorData.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Document upload error:", error.response?.data || error.message);
      showErrorMessage(`An error occurred during upload: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F0FFF0] font-Inter">
      <div className="absolute p-4">
        <button onClick={() => navigate("/kyc/form")} className="text-lg text-[#91ac8f] hover:text-[#667964] transition duration-300 mb-4 flex items-center font-semibold">
          <IoChevronBackOutline size={20} /> Back to KYC Form
        </button>
      </div>

      <div className="flex h-full items-center justify-center py-12">
        <div className="form-container w-full max-w-md mx-auto">
          <p className="title text-[#4b5849]">Upload Government ID</p>
          <p className="description text-gray-600 text-center mb-6">
            Please upload clear images of both the front and back of your government-issued identification document. Ensure all details are visible and legible.
          </p>

          <h3 className="text-lg font-semibold text-gray-700 mb-2">Front of ID</h3>
          <div
            className="upload-area"
            onDrop={(e) => handleDrop(e, setFrontIdFile)}
            onDragOver={handleDragOver}
            onClick={() => frontInputRef.current.click()}
          >
            {frontIdFile ? (
              <p className="text-green-600 text-sm flex items-center">
                <FiUploadCloud className="mr-2" /> {frontIdFile.name} (Ready to upload)
              </p>
            ) : (
              <p className="text-gray-500 text-sm flex items-center">
                <FiUploadCloud className="mr-2" /> Drag and drop or browse
              </p>
            )}
            <input
              type="file"
              ref={frontInputRef}
              onChange={(e) => handleFileChange(e, setFrontIdFile)}
              accept=".jpg,.jpeg,.png,.pdf"
              className="hidden"
            />
            <span className="text-xs text-gray-400 mt-1">Supported formats: JPG, PNG, PDF</span>
          </div>

          <h3 className="text-lg font-semibold text-gray-700 mt-4 mb-2">Back of ID</h3>
          <div
            className="upload-area"
            onDrop={(e) => handleDrop(e, setBackIdFile)}
            onDragOver={handleDragOver}
            onClick={() => backInputRef.current.click()}
          >
            {backIdFile ? (
              <p className="text-green-600 text-sm flex items-center">
                <FiUploadCloud className="mr-2" /> {backIdFile.name} (Ready to upload)
              </p>
            ) : (
              <p className="text-gray-500 text-sm flex items-center">
                <FiUploadCloud className="mr-2" /> Drag and drop or browse
              </p>
            )}
            <input
              type="file"
              ref={backInputRef}
              onChange={(e) => handleFileChange(e, setBackIdFile)}
              accept=".jpg,.jpeg,.png,.pdf"
              className="hidden"
            />
            <span className="text-xs text-gray-400 mt-1">Supported formats: JPG, PNG, PDF</span>
          </div>

          <button
            type="button"
            className="form-btn mt-6"
            onClick={handleSubmitDocuments}
            disabled={loading || !frontIdFile || !backIdFile}
          >
            {loading ? "Submitting..." : "Submit Documents"}
          </button>
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
        .description {
          line-height: 1.5;
        }
        .upload-area {
          border: 2px dashed #c0c0c0;
          border-radius: 8px;
          padding: 20px;
          text-align: center;
          cursor: pointer;
          transition: border-color 0.3s ease, background-color 0.3s ease;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 120px; /* Ensure sufficient area */
        }
        .upload-area:hover {
          border-color: #4B5842;
          background-color: #f9f9f9;
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
    </div>
  );
};

export default KYCDocumentUpload;