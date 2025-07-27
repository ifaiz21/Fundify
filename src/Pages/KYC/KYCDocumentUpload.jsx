// src/Pages/KYC/KYCDocumentUpload.jsx
"use client";
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IoChevronBackOutline } from "react-icons/io5";
import { FiUploadCloud, FiTrash2 } from "react-icons/fi";
import { useSelector, useDispatch } from 'react-redux';
import { updateKycDocument } from '../../features/kycSlice';
import { showSuccessMessage, showErrorMessage } from '../../utils/toast';

const KYCDocumentUpload = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { frontIdFile, backIdFile } = useSelector((state) => state.kyc.documents);
    
    // 1. State for preview URLs
    const [frontIdPreview, setFrontIdPreview] = useState(null);
    const [backIdPreview, setBackIdPreview] = useState(null);

    const [loading, ] = useState(false);

    const frontInputRef = useRef(null);
    const backInputRef = useRef(null);

    useEffect(() => {
        if (frontIdFile && typeof frontIdFile === 'object' && frontIdFile.type?.startsWith('image/')) {
            const url = URL.createObjectURL(frontIdFile);
            setFrontIdPreview(url);
            // Cleanup function
            return () => URL.revokeObjectURL(url);
        }
    }, [frontIdFile]);

    useEffect(() => {
        if (backIdFile && typeof backIdFile === 'object' && backIdFile.type?.startsWith('image/')) {
            const url = URL.createObjectURL(backIdFile);
            setBackIdPreview(url);
            // Cleanup function
            return () => URL.revokeObjectURL(url);
        }
    }, [backIdFile]);

    // 2. Updated file change handler to create preview
    const handleFileChange = (e, fileType) => {
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
            // 4. Local state set karne ke bajaye Redux action dispatch karein
            dispatch(updateKycDocument({ fileType, file }));
        }
    };

    // 3. Updated drop handler to create preview
    const handleDrop = (e, fileType, setPreview) => {
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
            fileType(file);
            if (file.type.startsWith('image/')) {
                setPreview(URL.createObjectURL(file));
            } else {
                setPreview(null);
            }
            dispatch(updateKycDocument({ fileType, file }));
        }
    };
    
    // Function to remove a selected file
    const removeFile = (fileType, inputRef) => {
        dispatch(updateKycDocument({ fileType, file: null }));
        if (fileType === 'frontIdFile') setFrontIdPreview(null);
        if (fileType === 'backIdFile') setBackIdPreview(null);
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


    const handleNextStep = () => {
        if (!frontIdFile || !backIdFile) {
            showErrorMessage("Please upload both front and back of your ID.");
            return;
        }
        showSuccessMessage("Documents saved. Proceeding to next step.");
        navigate("/kyc-liveness-verification");
    };



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

                    {/* Front ID Upload Box */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">Front of ID</h3>
                        <div className="upload-area" onDrop={(e) => handleDrop(e, 'frontIdFile')} onDragOver={handleDragOver} onClick={!frontIdFile ? () => frontInputRef.current.click() : undefined}>
                            {frontIdPreview ? (
                                <div className="preview-container">
                                    <img src={frontIdPreview} alt="Front ID Preview" className="preview-image" />
                                    <button onClick={() => removeFile('frontIdFile', frontInputRef)} className="remove-btn"><FiTrash2 size={18} /></button>
                                </div>
                            ) : frontIdFile ? (
                                <div className="preview-container">
                                    <p className="text-gray-700 text-sm">📄 {frontIdFile.name}</p>
                                    <button onClick={() => removeFile('frontIdFile', frontInputRef)} className="remove-btn"><FiTrash2 size={18} /></button>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center text-center">
                                    <FiUploadCloud className="text-gray-400 text-4xl mb-2" />
                                    <p className="text-gray-500 text-sm">Drag & drop or <span className="font-semibold text-[#4B5842]">browse</span></p>
                                </div>
                            )}
                            <input type="file" ref={frontInputRef} onChange={(e) => handleFileChange(e, 'frontIdFile')} accept=".jpg,.jpeg,.png,.pdf" className="hidden" />
                        </div>
                    </div>

                    {/* Back ID Upload Box */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">Back of ID</h3>
                        <div className="upload-area" onDrop={(e) => handleDrop(e, 'backIdFile')} onDragOver={handleDragOver} onClick={!backIdFile ? () => backInputRef.current.click() : undefined}>
                            {backIdPreview ? (
                                <div className="preview-container">
                                    <img src={backIdPreview} alt="Back ID Preview" className="preview-image" />
                                    <button onClick={() => removeFile('backIdFile', backInputRef)} className="remove-btn"><FiTrash2 size={18} /></button>
                                </div>
                            ) : backIdFile ? (
                                <div className="preview-container">
                                    <p className="text-gray-700 text-sm">📄 {backIdFile.name}</p>
                                    <button onClick={() => removeFile('backIdFile', backInputRef)} className="remove-btn"><FiTrash2 size={18} /></button>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center text-center">
                                    <FiUploadCloud className="text-gray-400 text-4xl mb-2" />
                                    <p className="text-gray-500 text-sm">Drag & drop or <span className="font-semibold text-[#4B5842]">browse</span></p>
                                </div>
                            )}
                            <input type="file" ref={backInputRef} onChange={(e) => handleFileChange(e, 'backIdFile')} accept=".jpg,.jpeg,.png,.pdf" className="hidden" />
                        </div>
                    </div>

                    <button type="button" className="form-btn mt-6" onClick={handleNextStep} disabled={loading || !frontIdFile || !backIdFile}>
                        {loading ? "Saving..." : "Save & Continue"}
                    </button>
                </div>
            </div>

            <style jsx>{`
                /* ... Saare styles jaisay thay waisay hi rahenge ... */
                .form-container { background-color: #fff; box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px; border-radius: 10px; padding: 20px 30px; display: flex; flex-direction: column; gap: 15px; max-width: 500px; }
                .title { text-align: center; font-size: 24px; font-weight: bold; margin-bottom: 10px; }
                .description { line-height: 1.5; }
                .upload-area { border: 2px dashed #c0c0c0; border-radius: 8px; padding: 10px; text-align: center; cursor: pointer; transition: border-color 0.3s ease, background-color 0.3s ease; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 150px; position: relative; }
                .upload-area:hover { border-color: #4B5842; background-color: #f9f9f9; }
                .preview-container { width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; }
                .preview-image { max-width: 100%; max-height: 120px; object-fit: contain; border-radius: 4px; }
                .remove-btn { position: absolute; top: 8px; right: 8px; background-color: rgba(255, 255, 255, 0.8); border: 1px solid #ddd; border-radius: 50%; padding: 4px; cursor: pointer; display: flex; align-items: center; justify-content: center; color: #ef4444; }
                .remove-btn:hover { background-color: #ef4444; color: white; }
                .form-btn { padding: 12px 20px; border-radius: 20px; border: none; outline: none; background: #4B5842; color: white; cursor: pointer; font-size: 16px; font-weight: 600; transition: background-color 0.3s ease; }
                .form-btn:hover:not(:disabled) { background-color: #3A4433; }
                .form-btn:disabled { background-color: #a0a0a0; cursor: not-allowed; }
            `}</style>
        </div>
    );
};

export default KYCDocumentUpload;
