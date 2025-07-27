// src/Pages/KYC/KYCDocumentUpload.jsx
"use client";
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IoChevronBackOutline } from "react-icons/io5";
import { FiUploadCloud, FiTrash2 } from "react-icons/fi"; // Added Trash icon
import axios from "axios";
import { showSuccessMessage, showErrorMessage } from '../../utils/toast';

const KYCDocumentUpload = () => {
    const navigate = useNavigate();
    const [frontIdFile, setFrontIdFile] = useState(null);
    const [backIdFile, setBackIdFile] = useState(null);
    
    // 1. State for preview URLs
    const [frontIdPreview, setFrontIdPreview] = useState(null);
    const [backIdPreview, setBackIdPreview] = useState(null);

    const [loading, setLoading] = useState(false);

    const frontInputRef = useRef(null);
    const backInputRef = useRef(null);

    // 2. Updated file change handler to create preview
    const handleFileChange = (e, setFile, setPreview) => {
        const file = e.target.files[0];
        if (file) {
            const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
            if (!allowedTypes.includes(file.type)) {
                showErrorMessage("Unsupported file type. Please upload JPG, PNG, or PDF.");
                e.target.value = null;
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                showErrorMessage("File size exceeds 5MB limit.");
                e.target.value = null;
                return;
            }
            setFile(file);
            // Create preview only for images
            if (file.type.startsWith('image/')) {
                setPreview(URL.createObjectURL(file));
            } else {
                setPreview(null); // No preview for PDF
            }
        }
    };

    // 3. Updated drop handler to create preview
    const handleDrop = (e, setFile, setPreview) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file) {
            const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
            if (!allowedTypes.includes(file.type)) {
                showErrorMessage("Unsupported file type. Please upload JPG, PNG, or PDF.");
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                showErrorMessage("File size exceeds 5MB limit.");
                return;
            }
            setFile(file);
            if (file.type.startsWith('image/')) {
                setPreview(URL.createObjectURL(file));
            } else {
                setPreview(null);
            }
        }
    };
    
    // Function to remove a selected file
    const removeFile = (setFile, setPreview, inputRef) => {
        setFile(null);
        setPreview(null);
        if(inputRef.current) {
            inputRef.current.value = null;
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    // 4. Cleanup object URLs to prevent memory leaks
    useEffect(() => {
        return () => {
            if (frontIdPreview) URL.revokeObjectURL(frontIdPreview);
            if (backIdPreview) URL.revokeObjectURL(backIdPreview);
        };
    }, [frontIdPreview, backIdPreview]);


    const handleSubmitDocuments = async () => {
        if (!frontIdFile || !backIdFile) {
            showErrorMessage("Please upload both front and back of your ID.");
            return;
        }

        setLoading(true);
        const formData = new FormData();
        formData.append('kycDocuments', frontIdFile);
        formData.append('kycDocuments', backIdFile);

        const token = localStorage.getItem('token');
        if (!token) {
            showErrorMessage("Authentication required. Please log in.");
            navigate("/login");
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post("https://server-fundify.up.railway.app/api/users/kyc/submit-documents", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                showSuccessMessage("Documents uploaded successfully! Redirecting to liveness verification.");
                navigate("/kyc-liveness-verification");
            }
        } catch (error) {
            console.error("Document upload error:", error.response?.data || error.message);
            showErrorMessage(`An error occurred during upload: ${error.response?.data?.message || error.message}`);
        } finally {
            setLoading(false);
        }
    };

    // A reusable component for the upload area
    const UploadBox = ({ file, preview, onDrop, onDragOver, onClick, onRemove, inputRef, title }) => (
        <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">{title}</h3>
            <div
                className="upload-area"
                onDrop={onDrop}
                onDragOver={onDragOver}
                onClick={!file ? onClick : undefined} // Make clickable only if no file
            >
                {preview ? (
                    <div className="preview-container">
                        <img src={preview} alt="ID Preview" className="preview-image" />
                        <button onClick={onRemove} className="remove-btn">
                            <FiTrash2 size={18} /> Remove
                        </button>
                    </div>
                ) : file ? (
                     <div className="preview-container">
                        <p className="text-gray-700 text-sm flex items-center">📄 {file.name} (PDF)</p>
                         <button onClick={onRemove} className="remove-btn">
                            <FiTrash2 size={18} /> Remove
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center text-center">
                        <FiUploadCloud className="text-gray-400 text-4xl mb-2" />
                        <p className="text-gray-500 text-sm">Drag and drop or <span className="font-semibold text-[#4B5842]">browse</span></p>
                        <span className="text-xs text-gray-400 mt-1">Supported formats: JPG, PNG, PDF</span>
                    </div>
                )}
                <input
                    type="file"
                    ref={inputRef}
                    onChange={(e) => handleFileChange(e, file === frontIdFile ? setFrontIdFile : setBackIdFile, file === frontIdFile ? setFrontIdPreview : setBackIdPreview)}
                    accept=".jpg,.jpeg,.png,.pdf"
                    className="hidden"
                />
            </div>
        </div>
    );


    return (
        <div className="flex flex-col min-h-screen bg-[#F0FFF0] font-Inter">
            <div className="absolute p-4">
                <button onClick={() => navigate("/kyc-form")} className="text-lg text-[#91ac8f] hover:text-[#667964] transition duration-300 mb-4 flex items-center font-semibold">
                    <IoChevronBackOutline size={20} /> Back to KYC Form
                </button>
            </div>

            <div className="flex h-full items-center justify-center py-12">
                <div className="form-container w-full max-w-md mx-auto">
                    <p className="title text-[#4b5849]">Upload Government ID</p>
                    <p className="description text-gray-600 text-center mb-6">
                        Please upload clear images of both the front and back of your government-issued identification document.
                    </p>

                    <UploadBox
                        file={frontIdFile}
                        preview={frontIdPreview}
                        onDrop={(e) => handleDrop(e, setFrontIdFile, setFrontIdPreview)}
                        onDragOver={handleDragOver}
                        onClick={() => frontInputRef.current.click()}
                        onRemove={() => removeFile(setFrontIdFile, setFrontIdPreview, frontInputRef)}
                        inputRef={frontInputRef}
                        title="Front of ID"
                    />

                    <UploadBox
                        file={backIdFile}
                        preview={backIdPreview}
                        onDrop={(e) => handleDrop(e, setBackIdFile, setBackIdPreview)}
                        onDragOver={handleDragOver}
                        onClick={() => backInputRef.current.click()}
                        onRemove={() => removeFile(setBackIdFile, setBackIdPreview, backInputRef)}
                        inputRef={backInputRef}
                        title="Back of ID"
                    />

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
                    margin-bottom: 10px;
                }
                .description {
                    line-height: 1.5;
                }
                .upload-area {
                    border: 2px dashed #c0c0c0;
                    border-radius: 8px;
                    padding: 10px;
                    text-align: center;
                    cursor: pointer;
                    transition: border-color 0.3s ease, background-color 0.3s ease;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    min-height: 150px;
                    position: relative;
                }
                .upload-area:hover {
                    border-color: #4B5842;
                    background-color: #f9f9f9;
                }
                .preview-container {
                    width: 100%;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                }
                .preview-image {
                    max-width: 100%;
                    max-height: 120px;
                    object-fit: contain;
                    border-radius: 4px;
                }
                .remove-btn {
                    position: absolute;
                    top: 8px;
                    right: 8px;
                    background-color: rgba(255, 255, 255, 0.8);
                    border: 1px solid #ddd;
                    border-radius: 50%;
                    padding: 4px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #ef4444;
                }
                .remove-btn:hover {
                    background-color: #ef4444;
                    color: white;
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
