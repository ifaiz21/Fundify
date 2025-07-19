// src/Pages/Billing.jsx
"use client";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PaymentMethodIcons from "./Layout/PaymentMethodIcons"; // Assuming this path is correct
import HeaderLayout from "./Layout/HeaderLayout"; // Assuming this path is correct
import FooterLayout from "./Layout/FooterLayout"; // Assuming this path is correct
import { useUser } from '../context/UserContext';
import SideBar from '../components/SideBar';

function Billing({ showToast }) {
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
        showToast("No authentication token found. Please log in.", "error");
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
      showToast("Account details saved successfully!", "success");
    } catch (err) {
      console.error("Save account details error:", err);
      setError(err.message || "Failed to save account details.");
      showToast(`Error saving account details: ${err.message}`, "error");
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
    showToast("Withdrawal functionality coming soon!", "info");
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    setShowConfirmLogout(false);
    setUserProfile(prev => ({ ...prev, profilePictureUrl: null, isAuthenticated: false }));
    navigate("/login");
  };

  const handleMenuItemClick = (itemName) => {
    setActiveMenuItem(itemName);
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

      <div className="flex flex-grow bg-gray-50">
        <SideBar activeItem={activeMenuItem} onItemClick={handleMenuItemClick} handleLogout={() => setShowConfirmLogout(true)} />

        <main className="flex-grow container mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold mb-6">Billing Details</h1>

          {/* Account Details Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-xl font-semibold">Account Details</h2>
              {isPaymentEditMode ? (
                <button onClick={togglePaymentEditMode} className="bg-gray-300 text-gray-700 py-2 px-4 rounded text-sm">Cancel</button>
              ) : (
                <button onClick={togglePaymentEditMode} className="bg-[#4A5D45] text-white py-2 px-4 rounded text-sm">Edit</button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Choose Account type</label>
                  {isPaymentEditMode ? (
                    <select name="accountType" value={editedAccountDetails.accountType} onChange={handleAccountEditChange} className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-green-500">
                      <option value="Choose">Choose</option>
                      <option value="Visa">Visa</option>
                      <option value="Debit">Debit Card</option>
                      <option value="Stripe">Stripe</option>
                      <option value="JazzCash">JazzCash</option>
                      <option value="EasyPaisa">EasyPaisa</option>
                    </select>
                  ) : (
                    <div className="text-gray-600">{accountDetails.accountType}</div>
                  )}
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">CVC</label>
                  {isPaymentEditMode ? (
                    <input type="text" name="cvc" value={editedAccountDetails.cvc} onChange={handleAccountEditChange} className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-green-500" placeholder="XXX" />
                  ) : (
                    <div className="text-gray-600">{accountDetails.cvc ? '***' : 'N/A'}</div>
                  )}
                </div>
              </div>

              <div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
                  {isPaymentEditMode ? (
                    <input type="text" name="accountNumber" value={editedAccountDetails.accountNumber} onChange={handleAccountEditChange} className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-green-500" placeholder="XXXXXXXXXXXXXXXXXXXX" />
                  ) : (
                    <div className="text-gray-600">{accountDetails.accountNumber || 'N/A'}</div>
                  )}
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                  {isPaymentEditMode ? (
                    <input type="text" name="expiryDate" value={editedAccountDetails.expiryDate} onChange={handleAccountEditChange} className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-green-500" placeholder="YYYY-MM-DD" />
                  ) : (
                    <div className="text-gray-600">{accountDetails.expiryDate || 'N/A'}</div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-4">
              <PaymentMethodIcons />
            </div>

            <div className="flex justify-end mt-6 space-x-4">
              <button onClick={handleWithdraw} className="bg-[#4A5D45] text-white py-2 px-8 rounded">Withdraw</button>
              {isPaymentEditMode && (
                <button onClick={handleAccountSave} className="bg-[#4A5D45] text-white py-2 px-8 rounded">Save Account</button>
              )}
            </div>
          </div>
        </main>
      </div>

      {showConfirmLogout && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-80 text-center">
            <h2 className="text-lg font-semibold mb-4">Confirm Sign Out</h2>
            <p className="mb-6">Are you sure you want to sign out?</p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setShowConfirmLogout(false)}
                className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="bg-[#4b5945] text-white px-4 py-2 rounded"
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