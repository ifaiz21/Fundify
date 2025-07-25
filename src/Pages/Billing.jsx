// src/Pages/Billing.jsx
"use client";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PaymentMethodIcons from "./Layout/PaymentMethodIcons";
import HeaderLayout from "./Layout/HeaderLayout";
import FooterLayout from "./Layout/FooterLayout";
import { useUser } from '../context/UserContext';
import SideBar from '../components/SideBar';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { showSuccessMessage, showErrorMessage } from "../utils/toast";

function Billing() {
    const { userProfile, setUserProfile, loadingUserContext } = useUser();
    const navigate = useNavigate();

    const [accountDetails, setAccountDetails] = useState({
        accountType: "Choose",
        accountNumber: "",
        cvc: "",
        expiryDate: "",
    });

    const [isPaymentEditMode, setIsPaymentEditMode] = useState(false);
    const [editedAccountDetails, setEditedAccountDetails] = useState({ ...accountDetails });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // NEW STATE for validation errors
    const [accountNumberError, setAccountNumberError] = useState("");
    const [cvcError, setCvcError] = useState("");
    const [expiryDateError, setExpiryDateError] = useState("");

    const [activeMenuItem, setActiveMenuItem] = useState("Billing");
    const [showConfirmLogout, setShowConfirmLogout] = useState(false);
    const [isProfileSidebarOpen, setIsProfileSidebarOpen] = useState(false);

    const toggleProfileSidebar = () => {
        setIsProfileSidebarOpen((prev) => !prev);
    };

    useEffect(() => {
        if (!loadingUserContext) {
            if (!userProfile.isAuthenticated) {
                setError("No authentication token found or session expired. Please log in.");
                navigate("/login");
                return;
            } else {
                const fetchAccountDetails = async () => {
                    setLoading(true);
                    setError(null);
                    try {
                        const token = localStorage.getItem('token');
                        const response = await fetch('https://server-fundify.up.railway.app/api/users/profile', {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${token}`,
                            },
                        });

                        if (!response.ok) {
                            if (response.status === 401 || response.status === 403 || response.status === 404) {
                                localStorage.removeItem('token');
                                setUserProfile(prev => ({ ...prev, profilePictureUrl: null, isAuthenticated: false }));
                                navigate("/login");
                                return;
                            }
                            const errorData = await response.json();
                            throw new Error(errorData.message || 'Failed to fetch account details');
                        }

                        const data = await response.json();
                        const fetchedAccount = {
                            accountType: data.accountType || 'Choose',
                            accountNumber: data.accountNumber || '',
                            cvc: data.cvc || '',
                            expiryDate: data.expiryDate || '',
                        };
                        setAccountDetails(fetchedAccount);
                        setEditedAccountDetails({ ...fetchedAccount });

                        if (!data.accountNumber || data.accountType === 'Choose') {
                            setIsPaymentEditMode(true);
                        } else {
                            setIsPaymentEditMode(false);
                        }

                    } catch (err) {
                        console.error("Fetch account details error:", err);
                        setError(err.message || "Failed to load account details.");
                    } finally {
                        setLoading(false);
                    }
                };
                fetchAccountDetails();
            }
        }
    }, [userProfile.isAuthenticated, loadingUserContext, navigate, setUserProfile]);

    // Validation function
    const validateInputs = () => {
        let isValid = true;

        // Validate Account Number
        const accNum = editedAccountDetails.accountNumber.replace(/\s/g, '');
        if (!/^\d{16}$/.test(accNum)) {
            setAccountNumberError("Account number must be 16 digits.");
            isValid = false;
        } else {
            setAccountNumberError("");
        }

        // Validate CVC
        const cvc = editedAccountDetails.cvc;
        if (!/^\d{3,4}$/.test(cvc)) {
            setCvcError("CVC must be 3 or 4 digits.");
            isValid = false;
        } else {
            setCvcError("");
        }

        // Validate Expiry Date (MM/YY or MM/YYYY)
        const expiry = editedAccountDetails.expiryDate;
        const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}(\d{2})?$/; // MM/YY or MM/YYYY
        if (!expiryRegex.test(expiry)) {
            setExpiryDateError("Expiry date must be in MM/YY or MM/YYYY format.");
            isValid = false;
        } else {
            // Further check for valid month (01-12) - already handled by regex
            const [month, year] = expiry.split('/').map(Number);
            const currentYear = new Date().getFullYear() % 100; // Last two digits of current year
            const currentMonth = new Date().getMonth() + 1; // 1-indexed

            if (year < currentYear || (year === currentYear && month < currentMonth)) {
                setExpiryDateError("Expiry date cannot be in the past.");
                isValid = false;
            } else {
                setExpiryDateError("");
            }
        }

        return isValid;
    };


    const handleAccountEditChange = (e) => {
        const { name, value } = e.target;
        let newValue = value;

        // Immediate formatting and basic validation feedback during typing
        if (name === "accountNumber") {
            newValue = value.replace(/\D/g, ''); // Allow only digits
            if (newValue.length > 16) {
                newValue = newValue.substring(0, 16); // Truncate to 16 digits
            }
            // Add spaces for readability every 4 digits
            newValue = newValue.replace(/(\d{4})(?=\d)/g, '$1 ');

            if (newValue.replace(/\s/g, '').length === 16) {
                setAccountNumberError(""); // Clear error if length is now 16
            } else if (newValue.replace(/\s/g, '').length > 0 && newValue.replace(/\s/g, '').length < 16) {
                setAccountNumberError("Must be 16 digits.");
            } else {
                setAccountNumberError(""); // Clear if empty
            }

        } else if (name === "cvc") {
            newValue = value.replace(/\D/g, ''); // Allow only digits
            if (newValue.length > 4) { // Max 4 digits for CVC
                newValue = newValue.substring(0, 4);
            }
            if (newValue.length >= 3 && newValue.length <= 4) {
                setCvcError("");
            } else if (newValue.length > 0 && newValue.length < 3) {
                 setCvcError("Must be 3 or 4 digits.");
            } else {
                setCvcError("");
            }
        } else if (name === "expiryDate") {
            newValue = value.replace(/\D/g, ''); // Allow only digits
            // Add '/' automatically
            if (newValue.length > 2 && newValue.indexOf('/') === -1) {
                newValue = newValue.substring(0, 2) + '/' + newValue.substring(2);
            }
            if (newValue.length > 7) { // MM/YYYY is 7 characters
                newValue = newValue.substring(0, 7);
            }

            // Basic validation feedback for expiry date format
            const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}(\d{2})?$/;
            if (newValue.length > 0 && !expiryRegex.test(newValue)) {
                setExpiryDateError("Format MM/YY or MM/YYYY.");
            } else {
                setExpiryDateError("");
            }
        }

        setEditedAccountDetails((prev) => ({
            ...prev,
            [name]: newValue,
        }));
    };


    const handleAccountSave = async () => {
        if (!validateInputs()) {
            showErrorMessage("Please correct the validation errors before saving.");
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                showErrorMessage("No authentication token found. Please log in.");
                navigate("/login");
                return;
            }

            const dataToUpdate = {
                accountType: editedAccountDetails.accountType,
                accountNumber: editedAccountDetails.accountNumber.replace(/\s/g, ''), // Remove spaces before sending to backend
                cvc: editedAccountDetails.cvc,
                expiryDate: editedAccountDetails.expiryDate,
            };

            console.log("Data to send for account update:", dataToUpdate);

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
            console.log("Received data from backend after account save:", updatedData);

            const updatedBackendUser = updatedData.user;
            setAccountDetails({
                accountType: updatedBackendUser.accountType || 'Choose',
                accountNumber: updatedBackendUser.accountNumber || '',
                cvc: updatedBackendUser.cvc || '',
                expiryDate: updatedBackendUser.expiryDate || '',
            });
            setIsPaymentEditMode(false);
            showSuccessMessage("Account details saved successfully!");
        } catch (err) {
            console.error("Save account details error:", err);
            setError(err.message || "Failed to save account details.");
            showErrorMessage(`Error saving account details: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const togglePaymentEditMode = () => {
        setIsPaymentEditMode(prev => !prev);
        // Reset errors when entering/exiting edit mode
        setAccountNumberError("");
        setCvcError("");
        setExpiryDateError("");
        if (!isPaymentEditMode) {
            setEditedAccountDetails(prev => ({
                ...prev,
                accountType: accountDetails.accountType,
                accountNumber: accountDetails.accountNumber,
                cvc: accountDetails.cvc,
                expiryDate: accountDetails.expiryDate,
            }));
        } else {
            setEditedAccountDetails(prev => ({
                ...prev,
                accountType: accountDetails.accountType,
                accountNumber: accountDetails.accountNumber,
                cvc: accountDetails.cvc,
                expiryDate: accountDetails.expiryDate,
            }));
        }
    };

    const handleWithdraw = () => {
        console.log("Withdraw funds logic here")
        showSuccessMessage("Withdrawal functionality coming soon!");
    }

    const handleLogout = () => {
        localStorage.removeItem("token");
        setShowConfirmLogout(false);
        setUserProfile(prev => ({ ...prev, profilePictureUrl: null, isAuthenticated: false }));
        navigate("/login");
    };

    const handleMenuItemClick = (itemName) => {
        setActiveMenuItem(itemName);
        setIsProfileSidebarOpen(false);
        if (itemName === "Logout") {
            setShowConfirmLogout(true);
        } else if (itemName === "Profile") {
            navigate("/user-profile");
        } else if (itemName === "My Campaigns") {
            navigate("/my-campaigns");
        } else if (itemName === "Notifications") {
            navigate("/notifications");
        } else if (itemName === "Billing") {
            // Already on this page, no navigation needed
        }
    };

    if (loading || loadingUserContext) {
        return (
            <div className="flex flex-col min-h-screen items-center justify-center bg-gray-50">
                <p className="text-xl text-gray-600">Loading billing details...</p>
            </div>
        );
    }

    if (error && !userProfile.isAuthenticated) {
        return (
            <div className="flex flex-col min-h-screen items-center justify-center bg-gray-50">
                <p className="text-red-600 text-xl mb-4">Error: {error}</p>
                <button
                    onClick={() => navigate("/login")}
                    className="bg-[#4A5D45] text-white py-2 px-4 rounded"
                >
                    Go to Login
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen">
            <HeaderLayout hideProfile={true} />

            <div className="flex flex-grow flex-col md:flex-row bg-gray-50">
                {/* Desktop Profile Sidebar */}
                <div className="hidden md:block w-64 flex-shrink-0">
                    <SideBar activeItem={activeMenuItem} onItemClick={handleMenuItemClick} handleLogout={() => setShowConfirmLogout(true)} />
                </div>

                {/* Mobile Profile Sidebar Button */}
                <div className="md:hidden flex justify-start p-4 bg-gray-50">
                    <button
                        onClick={toggleProfileSidebar}
                        className="p-2 text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500 rounded"
                        aria-label="Toggle profile sidebar"
                    >
                        {isProfileSidebarOpen ? (
                            <XMarkIcon className="h-8 w-8" />
                        ) : (
                            <Bars3Icon className="h-8 w-8" />
                        )}
                    </button>
                </div>

                {/* Mobile Profile Sidebar Overlay (when open) */}
                {isProfileSidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
                        onClick={toggleProfileSidebar}
                    ></div>
                )}

                {/* Mobile Profile Sidebar Drawer (when open) */}
                <div
                    className={`fixed top-0 left-0 h-full bg-white w-64 z-50 transform transition-transform duration-300 ease-in-out md:hidden
                        ${isProfileSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
                >
                    <SideBar
                        activeItem={activeMenuItem}
                        onItemClick={handleMenuItemClick}
                        handleLogout={() => setShowConfirmLogout(true)}
                        isMobileOpen={isProfileSidebarOpen}
                        toggleMobile={toggleProfileSidebar}
                    />
                </div>


                <main className="flex-grow container mx-auto px-4 py-6 md:ml-0">
                    <h1 className="text-2xl sm:text-3xl font-bold mb-6">Billing Details</h1>

                    {/* Account Details Section */}
                    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                            <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-0">Account Details</h2>
                            {isPaymentEditMode ? (
                                <button onClick={togglePaymentEditMode} className="bg-gray-300 text-gray-700 py-2 px-4 rounded text-sm w-full sm:w-auto">Cancel</button>
                            ) : (
                                <button onClick={togglePaymentEditMode} className="bg-[#4A5D45] text-white py-2 px-4 rounded text-sm w-full sm:w-auto">Edit</button>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                            <div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Choose Account type</label>
                                    {isPaymentEditMode ? (
                                        <select name="accountType" value={editedAccountDetails.accountType} onChange={handleAccountEditChange} className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-green-500 text-sm">
                                            <option value="Choose">Choose</option>
                                            <option value="Stripe">Stripe</option>
                                        </select>
                                    ) : (
                                        <div className="text-gray-600 text-sm">{accountDetails.accountType}</div>
                                    )}
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">CVC</label>
                                    {isPaymentEditMode ? (
                                        <input
                                            type="text" // Keep as text to allow input masking/formatting
                                            name="cvc"
                                            value={editedAccountDetails.cvc}
                                            onChange={handleAccountEditChange}
                                            className={`w-full border ${cvcError ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2 focus:ring-green-500 text-sm`}
                                            placeholder="XXX"
                                            maxLength="4" // Max length for CVC
                                        />
                                    ) : (
                                        <div className="text-gray-600 text-sm">{accountDetails.cvc ? '***' : 'N/A'}</div>
                                    )}
                                    {cvcError && <p className="text-red-500 text-xs mt-1">{cvcError}</p>}
                                </div>
                            </div>

                            <div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
                                    {isPaymentEditMode ? (
                                        <input
                                            type="text" // Keep as text to allow input masking/formatting
                                            name="accountNumber"
                                            value={editedAccountDetails.accountNumber}
                                            onChange={handleAccountEditChange}
                                            className={`w-full border ${accountNumberError ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2 focus:ring-green-500 text-sm`}
                                            placeholder="XXXX XXXX XXXX XXXX"
                                            maxLength="19" // 16 digits + 3 spaces = 19
                                        />
                                    ) : (
                                        <div className="text-gray-600 text-sm break-all">{accountDetails.accountNumber || 'N/A'}</div>
                                    )}
                                    {accountNumberError && <p className="text-red-500 text-xs mt-1">{accountNumberError}</p>}
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                                    {isPaymentEditMode ? (
                                        <input
                                            type="text" // Keep as text for MM/YY formatting
                                            name="expiryDate"
                                            value={editedAccountDetails.expiryDate}
                                            onChange={handleAccountEditChange}
                                            className={`w-full border ${expiryDateError ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2 focus:ring-green-500 text-sm`}
                                            placeholder="MM/YY or MM/YYYY"
                                            maxLength="7" // MM/YYYY is 7 characters
                                        />
                                    ) : (
                                        <div className="text-gray-600 text-sm">{accountDetails.expiryDate || 'N/A'}</div>
                                    )}
                                    {expiryDateError && <p className="text-red-500 text-xs mt-1">{expiryDateError}</p>}
                                </div>
                            </div>
                        </div>

                        <div className="mt-4">
                            <PaymentMethodIcons />
                        </div>

                        <div className="flex flex-col sm:flex-row justify-end mt-6 space-y-3 sm:space-y-0 sm:space-x-4">
                            <button onClick={handleWithdraw} className="bg-[#4A5D45] text-white py-2 px-8 rounded w-full sm:w-auto hover:bg-opacity-90 transition-colors">Withdraw</button>
                            {isPaymentEditMode && (
                                <button onClick={handleAccountSave} className="bg-[#4A5D45] text-white py-2 px-8 rounded w-full sm:w-auto hover:bg-opacity-90 transition-colors">Save Account</button>
                            )}
                        </div>
                    </div>
                </main>
            </div>

            {showConfirmLogout && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-xs sm:max-w-sm text-center">
                        <h2 className="text-lg font-semibold mb-4">Confirm Sign Out</h2>
                        <p className="mb-6">Are you sure you want to sign out?</p>
                        <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-x-4 sm:space-y-0">
                            <button
                                onClick={() => setShowConfirmLogout(false)}
                                className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded w-full sm:w-auto"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleLogout}
                                className="bg-[#4b5945] text-white px-4 py-2 rounded hover:bg-[#B2C9AD] w-full sm:w-auto"
                            >
                                Sign Out
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <FooterLayout />
        </div>
    );
}

export default Billing;