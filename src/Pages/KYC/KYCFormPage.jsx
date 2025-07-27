// src/Pages/KYC/KYCFormPage.jsx
"use client";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IoChevronBackOutline } from "react-icons/io5";
import { showSuccessMessage, showErrorMessage } from '../../utils/toast';
import { useSelector, useDispatch } from 'react-redux';
import { updateKycFormData } from '../../features/kycSlice';

const KYCFormPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // 2. Local state ke bajaye Redux store se data lein
    const { formData } = useSelector((state) => state.kyc);
    const { currentUser, loading: userLoading } = useSelector((state) => state.user);

    const [errors, setErrors] = useState({});
    const [loading, ] = useState(false);

    // 3. User ke data se Redux store ko pre-fill karein (agar zaroori ho)
    useEffect(() => {
        if (!userLoading && currentUser && !formData.email) {
            const initialData = {
                fullName: currentUser.name || "",
                email: currentUser.email || "",
                phoneNumber: currentUser.contactNo || "",
            };
            dispatch(updateKycFormData(initialData));
        }
    }, [currentUser, userLoading, formData.email, dispatch]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        // 4. Har change par Redux store ko update karein
        dispatch(updateKycFormData({ [name]: value }));

        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    // Validation logic bilkul waisa hi rahega kyunke woh 'formData' variable par depend karta hai
    const validateForm = () => {
        const newErrors = {};
        if (!formData.fullName.trim()) newErrors.fullName = "Full name is required.";
        if (!formData.dateOfBirth) {
            newErrors.dateOfBirth = "Date of birth is required.";
        } else {
            const birthDate = new Date(formData.dateOfBirth);
            const today = new Date();
            let age = today.getFullYear() - birthDate.getFullYear();
            const m = today.getMonth() - birthDate.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
            if (age < 18) newErrors.dateOfBirth = "You must be at least 18 years old.";
        }
        if (!formData.address.trim()) newErrors.address = "Address is required.";
        if (!formData.documentType) newErrors.documentType = "Please select a document type.";
        if (!formData.idNumber.trim()) {
            newErrors.idNumber = "ID number is required.";
        } else if (formData.documentType === 'National ID Card' && !/^[0-9]{13}$/.test(formData.idNumber)) {
            newErrors.idNumber = "CNIC must be 13 digits.";
        }
        if (!formData.email.trim()) {
            newErrors.email = "Email is required.";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Email is invalid.";
        }
        if (!formData.phoneNumber.trim()) {
            newErrors.phoneNumber = "Phone number is required.";
        } else if (!/^((\+92)|(0092))-{0,1}\d{3}-{0,1}\d{7}$|^\d{11}$|^\d{4}-\d{7}$/.test(formData.phoneNumber)) {
            newErrors.phoneNumber = "Please enter a valid Pakistani phone number.";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNextStep = (e) => {
        e.preventDefault();
        
        // 1. Sirf form ko validate karein
        if (validateForm()) {
            // 2. Agar valid hai, to agle page par navigate karein. Koi API call nahi hogi.
            showSuccessMessage("Information saved. Proceeding to next step.");
            navigate("/kyc-document-upload");
        } else {
            showErrorMessage("Please fix the errors before proceeding.");
        }
    };

    if (userLoading) {
        return (
            <div className="flex flex-col min-h-screen bg-[#F0FFF0] font-Inter items-center justify-center">
                <p className="text-[#4b5849] text-xl">Loading user data...</p>
            </div>
        );
    }

    if (currentUser && (currentUser.kycStatus === 'Pending Review' || currentUser.kycStatus === 'Approved')) {
        return (
            <div className="flex flex-col min-h-screen bg-[#F0FFF0] font-Inter items-center justify-center text-center px-4">
                <div className="absolute p-4 top-0 left-0">
                    <button onClick={() => navigate("/user-profile")} className="text-lg text-[#91ac8f] hover:text-[#667964] transition duration-300 mb-4 flex items-center font-semibold">
                        <IoChevronBackOutline size={20} /> Back to Profile
                    </button>
                </div>
                <div className="form-container w-full max-w-md mx-auto p-6">
                    {currentUser.kycStatus === 'Pending Review' && (
                        <p className="title text-[#4b5849] text-xl font-bold">Please wait, your KYC verification is under review.</p>
                    )}
                    {currentUser.kycStatus === 'Approved' && (
                        <p className="title text-[#4b5849] text-xl font-bold">Your KYC has been approved!</p>
                    )}
                    <p className="mt-4 text-gray-700">You can return to your profile or campaigns.</p>
                    <button onClick={() => navigate("/user-profile")} className="form-btn mt-6">Go to Profile</button>
                </div>
                <style jsx>{`
                    .form-container { background-color: #fff; box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px; border-radius: 10px; padding: 20px 30px; display: flex; flex-direction: column; gap: 15px; max-width: 500px; }
                    .title { text-align: center; font-size: 24px; font-weight: bold; margin-bottom: 20px; }
                    .form-btn { padding: 12px 20px; border-radius: 20px; border: none; outline: none; background: #4B5842; color: white; cursor: pointer; font-size: 16px; font-weight: 600; transition: background-color 0.3s ease; }
                    .form-btn:hover:not(:disabled) { background-color: #3A4433; }
                `}</style>
            </div>
        );
    }

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
                        <form className="form" onSubmit={handleNextStep} noValidate>
                            <h3 className="text-lg font-semibold text-gray-700 mb-2">Personal Information</h3>
                            <div>
                                <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Full Name" className={`input ${errors.fullName ? 'input-error' : ''}`} required />
                                {errors.fullName && <p className="error-text">{errors.fullName}</p>}
                            </div>
                            <div>
                                <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} className={`input ${errors.dateOfBirth ? 'input-error' : ''}`} required />
                                {errors.dateOfBirth && <p className="error-text">{errors.dateOfBirth}</p>}
                            </div>
                            <div>
                                <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Address" className={`input ${errors.address ? 'input-error' : ''}`} required />
                                {errors.address && <p className="error-text">{errors.address}</p>}
                            </div>
                            <h3 className="text-lg font-semibold text-gray-700 mt-4 mb-2">Identification Details</h3>
                            <div>
                                <input type="text" name="idNumber" value={formData.idNumber} onChange={handleChange} placeholder="ID Number" className={`input ${errors.idNumber ? 'input-error' : ''}`} required />
                                {errors.idNumber && <p className="error-text">{errors.idNumber}</p>}
                            </div>
                            <div>
                                <select name="documentType" value={formData.documentType} onChange={handleChange} className={`input ${errors.documentType ? 'input-error' : ''}`} required>
                                    <option value="">Select document type</option>
                                    <option value="National ID Card">National ID Card</option>
                                    <option value="Passport">Passport</option>
                                    <option value="Driving License">Driving License</option>
                                </select>
                                {errors.documentType && <p className="error-text">{errors.documentType}</p>}
                            </div>
                            <h3 className="text-lg font-semibold text-gray-700 mt-4 mb-2">Contact Information</h3>
                            <div>
                                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" className={`input ${errors.email ? 'input-error' : ''}`} required />
                                {errors.email && <p className="error-text">{errors.email}</p>}
                            </div>
                            <div>
                                <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} placeholder="Phone Number" className={`input ${errors.phoneNumber ? 'input-error' : ''}`} required />
                                {errors.phoneNumber && <p className="error-text">{errors.phoneNumber}</p>}
                            </div>
                            <button type="submit" className="form-btn mt-6" disabled={loading}>
                                {loading ? "Saving..." : "Save & Continue"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
            <style jsx>{`
                .form-container { background-color: #fff; box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px; border-radius: 10px; padding: 20px 30px; display: flex; flex-direction: column; gap: 15px; max-width: 500px; }
                .title { text-align: center; font-size: 24px; font-weight: bold; margin-bottom: 20px; }
                .form { display: flex; flex-direction: column; gap: 10px; }
                .input { border-radius: 8px; border: 1px solid #c0c0c0; outline: none; padding: 10px 12px; width: 100%; box-sizing: border-box; }
                .input:focus { border-color: #4B5842; box-shadow: 0 0 0 1px #4B5842; }
                .input-error { border-color: #ef4444; }
                .input-error:focus { border-color: #ef4444; box-shadow: 0 0 0 1px #ef4444; }
                .error-text { color: #ef4444; font-size: 0.875rem; margin-top: 4px; }
                .form-btn { padding: 12px 20px; border-radius: 20px; border: none; outline: none; background: #4B5842; color: white; cursor: pointer; font-size: 16px; font-weight: 600; transition: background-color 0.3s ease; }
                .form-btn:hover:not(:disabled) { background-color: #3A4433; }
                .form-btn:disabled { background-color: #a0a0a0; cursor: not-allowed; }
            `}</style>
        </>
    );
};

export default KYCFormPage;
