// src/Pages/BillingPage.jsx (Refactored Code)
"use client";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PaymentMethodIcons from "./Layout/PaymentMethodIcons"; // Assuming this component exists
import { showSuccessMessage, showErrorMessage } from "../utils/toast";

// --- YEH AAPKA MAIN REFACTORED COMPONENT HAI ---
// Yeh 'user' prop aur 'onAccountUpdate' function ko receive kar raha hai.
function BillingPage({ user, onAccountUpdate }) {
    const navigate = useNavigate();

    // Component ki apni state
    const [accountDetails, setAccountDetails] = useState({});
    const [editedAccountDetails, setEditedAccountDetails] = useState({});
    const [isPaymentEditMode, setIsPaymentEditMode] = useState(false);
    const [loading, setLoading] = useState(false);
    const [setError] = useState(null);

    // Validation errors ke liye state
    const [accountNumberError, setAccountNumberError] = useState("");
    const [cvcError, setCvcError] = useState("");
    const [expiryDateError, setExpiryDateError] = useState("");

    // Jab bhi 'user' prop change ho, component ki state ko update karein
    useEffect(() => {
        if (user) {
            const initialDetails = {
                accountType: user.accountType || "Choose",
                accountNumber: user.accountNumber || "",
                // CVC ko kabhi bhi store ya display nahi karna chahiye. User har bar enter karega.
                cvc: "", 
                expiryDate: user.expiryDate || "",
            };
            setAccountDetails(initialDetails);
            setEditedAccountDetails(initialDetails);

            // Agar account number nahi hai to edit mode by default open rakhein
            if (!user.accountNumber) {
                setIsPaymentEditMode(true);
            }
        }
    }, [user]); // Yeh effect 'user' prop par depend karta hai

    // Validation function (jaisa tha waisa hi)
    const validateInputs = () => {
        let isValid = true;
        const accNum = editedAccountDetails.accountNumber.replace(/\s/g, '');
        if (!/^\d{16}$/.test(accNum)) {
            setAccountNumberError("Account number must be 16 digits.");
            isValid = false;
        } else {
            setAccountNumberError("");
        }

        const cvc = editedAccountDetails.cvc;
        if (!/^\d{3,4}$/.test(cvc)) {
            setCvcError("CVC must be 3 or 4 digits.");
            isValid = false;
        } else {
            setCvcError("");
        }
        
        const expiry = editedAccountDetails.expiryDate;
        const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}(\d{2})?$/;
        if (!expiryRegex.test(expiry)) {
            setExpiryDateError("Expiry date must be in MM/YY or MM/YYYY format.");
            isValid = false;
        } else {
            const [month, year] = expiry.split('/').map(Number);
            const fullYear = year < 100 ? 2000 + year : year;
            const currentYear = new Date().getFullYear();
            const currentMonth = new Date().getMonth() + 1;
            if (fullYear < currentYear || (fullYear === currentYear && month < currentMonth)) {
                setExpiryDateError("Expiry date cannot be in the past.");
                isValid = false;
            } else {
                setExpiryDateError("");
            }
        }
        return isValid;
    };

    // Input change handler (jaisa tha waisa hi, formatting ke sath)
    const handleAccountEditChange = (e) => {
        const { name, value } = e.target;
        let newValue = value;

        if (name === "accountNumber") {
            newValue = value.replace(/\D/g, '').replace(/(\d{4})(?=\d)/g, '$1 ').trim();
             if (newValue.length > 19) newValue = newValue.substring(0, 19);
        } else if (name === "cvc") {
            newValue = value.replace(/\D/g, '');
            if (newValue.length > 4) newValue = newValue.substring(0, 4);
        } else if (name === "expiryDate") {
            newValue = value.replace(/\D/g, '');
            if (newValue.length > 2) {
                newValue = newValue.substring(0, 2) + '/' + newValue.substring(2);
            }
            if (newValue.length > 7) newValue = newValue.substring(0, 7);
        }

        setEditedAccountDetails((prev) => ({ ...prev, [name]: newValue }));
    };

    // Account details save karne ka function
    const handleAccountSave = async () => {
        if (!validateInputs()) {
            showErrorMessage("Please correct the errors before saving.");
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                showErrorMessage("Authentication error. Please log in again.");
                navigate("/login");
                return;
            }

            const dataToUpdate = {
                accountType: editedAccountDetails.accountType,
                accountNumber: editedAccountDetails.accountNumber.replace(/\s/g, ''),
                cvc: editedAccountDetails.cvc,
                expiryDate: editedAccountDetails.expiryDate,
            };

            const response = await fetch('https://server-fundify.up.railway.app/api/users/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(dataToUpdate),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to save account details');
            }

            const updatedData = await response.json();
            
            // Parent component ko updated user data bhejein
            if (onAccountUpdate) {
                onAccountUpdate(updatedData.user);
            }

            setIsPaymentEditMode(false);
            showSuccessMessage("Account details saved successfully!");

        } catch (err) {
            console.error("Save account details error:", err);
            setError(err.message);
            showErrorMessage(`Error: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const togglePaymentEditMode = () => {
        if (isPaymentEditMode) {
            // Agar cancel kar rahe hain to purani details wapas le aaein
            setEditedAccountDetails(accountDetails);
            setAccountNumberError("");
            setCvcError("");
            setExpiryDateError("");
        }
        setIsPaymentEditMode(prev => !prev);
    };

    const handleWithdraw = () => {
        showSuccessMessage("Withdrawal functionality is coming soon!");
    };
    
    // Agar user prop abhi load nahi hua to loading dikhayein
    if (!user) {
        return <p className="text-center py-10">Loading billing information...</p>;
    }

    return (
        <div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-6">Billing Details</h1>

            {/* Account Details Section */}
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                    <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-0">Account Details</h2>
                    <button 
                        onClick={togglePaymentEditMode} 
                        className="bg-gray-200 text-gray-800 hover:bg-gray-300 py-2 px-4 rounded text-sm w-full sm:w-auto"
                    >
                        {isPaymentEditMode ? 'Cancel' : 'Edit'}
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    {/* Account Type */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Account Type</label>
                        {isPaymentEditMode ? (
                            <select name="accountType" value={editedAccountDetails.accountType} onChange={handleAccountEditChange} className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-green-500 text-sm">
                                <option value="Choose">Choose</option>
                                <option value="Stripe">Stripe</option>
                            </select>
                        ) : (
                            <div className="text-gray-600 text-sm p-2">{accountDetails.accountType}</div>
                        )}
                    </div>

                    {/* Account Number */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
                        {isPaymentEditMode ? (
                            <input
                                type="text"
                                name="accountNumber"
                                value={editedAccountDetails.accountNumber}
                                onChange={handleAccountEditChange}
                                className={`w-full border ${accountNumberError ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2 focus:ring-green-500 text-sm`}
                                placeholder="XXXX XXXX XXXX XXXX"
                                maxLength="19"
                            />
                        ) : (
                            <div className="text-gray-600 text-sm p-2 break-all">{accountDetails.accountNumber ? `**** **** **** ${accountDetails.accountNumber.slice(-4)}` : 'N/A'}</div>
                        )}
                        {accountNumberError && isPaymentEditMode && <p className="text-red-500 text-xs mt-1">{accountNumberError}</p>}
                    </div>

                    {/* CVC */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">CVC</label>
                        {isPaymentEditMode ? (
                            <input
                                type="text"
                                name="cvc"
                                value={editedAccountDetails.cvc}
                                onChange={handleAccountEditChange}
                                className={`w-full border ${cvcError ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2 focus:ring-green-500 text-sm`}
                                placeholder="XXX"
                                maxLength="4"
                            />
                        ) : (
                            <div className="text-gray-600 text-sm p-2">***</div>
                        )}
                        {cvcError && isPaymentEditMode && <p className="text-red-500 text-xs mt-1">{cvcError}</p>}
                    </div>

                    {/* Expiry Date */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                        {isPaymentEditMode ? (
                            <input
                                type="text"
                                name="expiryDate"
                                value={editedAccountDetails.expiryDate}
                                onChange={handleAccountEditChange}
                                className={`w-full border ${expiryDateError ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2 focus:ring-green-500 text-sm`}
                                placeholder="MM/YY"
                                maxLength="7"
                            />
                        ) : (
                            <div className="text-gray-600 text-sm p-2">{accountDetails.expiryDate || 'N/A'}</div>
                        )}
                        {expiryDateError && isPaymentEditMode && <p className="text-red-500 text-xs mt-1">{expiryDateError}</p>}
                    </div>
                </div>

                <div className="mt-4">
                    <PaymentMethodIcons />
                </div>

                <div className="flex flex-col sm:flex-row justify-end mt-6 space-y-3 sm:space-y-0 sm:space-x-4">
                    <button onClick={handleWithdraw} className="bg-[#4B5842] text-white py-2 px-8 rounded w-full sm:w-auto hover:bg-gray-700 transition-colors">Withdraw</button>
                    {isPaymentEditMode && (
                        <button onClick={handleAccountSave} disabled={loading} className="bg-[#4A5D45] text-white py-2 px-8 rounded w-full sm:w-auto hover:bg-opacity-90 transition-colors disabled:bg-gray-400">
                            {loading ? 'Saving...' : 'Save Account'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default BillingPage;
