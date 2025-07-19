// src/Pages/Billing.jsx
"use client";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PaymentMethodIcons from "./Layout/PaymentMethodIcons"; // Assuming this path is correct
import HeaderLayout from "./Layout/HeaderLayout"; // Assuming this path is correct
import FooterLayout from "./Layout/FooterLayout"; // Assuming this path is correct
import { useUser } from '../context/UserContext';
import SideBar from '../components/SideBar';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'; // Import icons for the new sidebar button
import { showSuccessMessage, showErrorMessage } from "../utils/toast"; // Import toast messages

function Billing() { // Removed showToast prop as it's handled by imported functions
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

  const [activeMenuItem, setActiveMenuItem] = useState("Billing");
  const [showConfirmLogout, setShowConfirmLogout] = useState(false);
  // NEW STATE: State to control the DEDICATED profile sidebar visibility
  const [isProfileSidebarOpen, setIsProfileSidebarOpen] = useState(false);

  // Function to toggle the DEDICATED profile sidebar
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

  const handleAccountEditChange = (e) => {
    const { name, value } = e.target;
    setEditedAccountDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAccountSave = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        showErrorMessage("No authentication token found. Please log in."); // Use showErrorMessage
        navigate("/login");
        return;
      }

      const dataToUpdate = {
        accountType: editedAccountDetails.accountType,
        accountNumber: editedAccountDetails.accountNumber,
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
      showSuccessMessage("Account details saved successfully!"); // Use showSuccessMessage
    } catch (err) {
      console.error("Save account details error:", err);
      setError(err.message || "Failed to save account details.");
      showErrorMessage(`Error saving account details: ${err.message}`); // Use showErrorMessage
    } finally {
      setLoading(false);
    }
  };

  const togglePaymentEditMode = () => {
    setIsPaymentEditMode(prev => !prev);
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
    showSuccessMessage("Withdrawal functionality coming soon!"); // Use showSuccessMessage
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    setShowConfirmLogout(false);
    setUserProfile(prev => ({ ...prev, profilePictureUrl: null, isAuthenticated: false }));
    navigate("/login");
  };

  const handleMenuItemClick = (itemName) => {
    setActiveMenuItem(itemName);
    // Close the DEDICATED profile sidebar if an item is clicked
    setIsProfileSidebarOpen(false); // Important: Close sidebar after navigation
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
      <HeaderLayout hideProfile={true}/>

      <div className="flex flex-grow flex-col md:flex-row bg-gray-50">
        {/* Desktop Profile Sidebar (visible on medium screens and up) */}
        <div className="hidden md:block w-64 flex-shrink-0">
          <SideBar activeItem={activeMenuItem} onItemClick={handleMenuItemClick} handleLogout={() => setShowConfirmLogout(true)} />
        </div>

        {/* Mobile Profile Sidebar Button - Visible on small screens, hidden on md and up */}
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
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6"> {/* Adjusted padding */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6"> {/* Stack on mobile */}
              <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-0">Account Details</h2> {/* Adjusted heading size */}
              {isPaymentEditMode ? (
                <button onClick={togglePaymentEditMode} className="bg-gray-300 text-gray-700 py-2 px-4 rounded text-sm w-full sm:w-auto">Cancel</button> /* Full width on mobile */
              ) : (
                <button onClick={togglePaymentEditMode} className="bg-[#4A5D45] text-white py-2 px-4 rounded text-sm w-full sm:w-auto">Edit</button> /* Full width on mobile */
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6"> {/* Adjusted gap */}
              <div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Choose Account type</label>
                  {isPaymentEditMode ? (
                    <select name="accountType" value={editedAccountDetails.accountType} onChange={handleAccountEditChange} className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-green-500 text-sm"> {/* Adjusted text size */}
                      <option value="Choose">Choose</option>
                      <option value="Visa">Visa</option>
                      <option value="Debit">Debit Card</option>
                      <option value="Stripe">Stripe</option>
                      <option value="JazzCash">JazzCash</option>
                      <option value="EasyPaisa">EasyPaisa</option>
                    </select>
                  ) : (
                    <div className="text-gray-600 text-sm">{accountDetails.accountType}</div> /* Adjusted text size */
                  )}
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">CVC</label>
                  {isPaymentEditMode ? (
                    <input type="text" name="cvc" value={editedAccountDetails.cvc} onChange={handleAccountEditChange} className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-green-500 text-sm" placeholder="XXX" /> /* Adjusted text size */
                  ) : (
                    <div className="text-gray-600 text-sm">{accountDetails.cvc ? '***' : 'N/A'}</div> /* Adjusted text size */
                  )}
                </div>
              </div>

              <div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
                  {isPaymentEditMode ? (
                    <input type="text" name="accountNumber" value={editedAccountDetails.accountNumber} onChange={handleAccountEditChange} className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-green-500 text-sm" placeholder="XXXXXXXXXXXXXXXXXXXX" /> /* Adjusted text size */
                  ) : (
                    <div className="text-gray-600 text-sm break-all">{accountDetails.accountNumber || 'N/A'}</div> /* Adjusted text size, added break-all */
                  )}
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                  {isPaymentEditMode ? (
                    <input type="text" name="expiryDate" value={editedAccountDetails.expiryDate} onChange={handleAccountEditChange} className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-green-500 text-sm" placeholder="YYYY-MM-DD" /> /* Adjusted text size */
                  ) : (
                    <div className="text-gray-600 text-sm">{accountDetails.expiryDate || 'N/A'}</div> /* Adjusted text size */
                  )}
                </div>
              </div>
            </div>

            <div className="mt-4">
              <PaymentMethodIcons />
            </div>

            <div className="flex flex-col sm:flex-row justify-end mt-6 space-y-3 sm:space-y-0 sm:space-x-4"> {/* Stack on mobile, row on desktop */}
              <button onClick={handleWithdraw} className="bg-[#4A5D45] text-white py-2 px-8 rounded w-full sm:w-auto hover:bg-opacity-90 transition-colors">Withdraw</button> {/* Full width on mobile */}
              {isPaymentEditMode && (
                <button onClick={handleAccountSave} className="bg-[#4A5D45] text-white py-2 px-8 rounded w-full sm:w-auto hover:bg-opacity-90 transition-colors">Save Account</button> /* Full width on mobile */
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
