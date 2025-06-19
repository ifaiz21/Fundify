// src/Pages/UserProfileSettings.jsx
"use client"
import React, { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import PaymentMethodIcons from "./Layout/PaymentMethodIcons"
import HeaderLayout from "./Layout/HeaderLayout" // Ensure this is the correct HeaderLayout
import FooterLayout from "./Layout/FooterLayout"
import { useUser } from '../context/UserContext'; // Import useUser hook (assuming '../context/UserContext' is correct relative path from src/Pages/)

// ADDED: showToast prop in function signature
function UserProfileSettings({ showToast }) {
  const { userProfile, setUserProfile, loadingUserContext } = useUser();

  const [profileData, setProfileData] = useState({
    fullName: "",
    userId: "",
    email: "",
    contactNo: "",
    createdCampaigns: 0,
    backedCampaigns: 0,
    accountType: "Choose",
    accountNumber: "",
    cvc: "",
    expiryDate: "",
    profilePictureUrl: "", // Profile picture URL from backend
  })

  const [additionalEmails, setAdditionalEmails] = useState([])
  const [newEmail, setNewEmail] = useState("")
  const [emailError, setEmailError] = useState("")

  const [isProfileEditMode, setIsProfileEditMode] = useState(false); // Profile section default false (view mode)
  const [isPaymentEditMode, setIsPaymentEditMode] = useState(false); // Payment section default false (view mode)

  const [isAddingEmail, setIsAddingEmail] = useState(false)
  const [editedProfile, setEditedProfile] = useState({ ...profileData })
  const [showConfirmLogout, setShowConfirmLogout] = useState(false)
  const [loading, setLoading] = useState(true); // Local loading state for fetching profile details
  const [error, setError] = useState(null);

  // Profile Picture states
  const [selectedProfileImage, setSelectedProfileImage] = useState(null); // File object
  const [profileImagePreview, setProfileImagePreview] = useState(null); // Data URL or backend URL for preview
  const fileInputRef = useRef(null); // File input ref

  const navigate = useNavigate()

  useEffect(() => {
    // ADDED: Check authentication status from context once context is done loading
    if (!loadingUserContext) { // Only proceed when the UserContext has finished its initial loading
      if (!userProfile.isAuthenticated) {
        setError("No authentication token found or session expired. Please log in.");
        navigate("/login");
        return; // Stop further execution of this useEffect if not authenticated
      } else {
        // Only fetch user profile details if the user is authenticated and local profileData hasn't been set yet
        // This prevents re-fetching on every re-render unless necessary
        if (!profileData.userId) { // Using profileData.userId as a flag if profile data is already loaded
          const fetchUserProfileDetails = async () => { // Renamed from fetchUserProfile to avoid confusion with context fetch
            setLoading(true); // Start local loading for profile details
            setError(null);
            try {
              const token = localStorage.getItem('token');
              // No need for if (!token) check here, as context already handled it before this useEffect fires
              
              const response = await fetch('http://localhost:5000/api/users/profile', {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`,
                },
              });

              if (!response.ok) {
                // If token is invalid or user not found, context would have redirected.
                // For other errors, clear token and redirect just in case.
                if (response.status === 401 || response.status === 403 || response.status === 404) {
                    localStorage.removeItem('token');
                    setUserProfile(prev => ({ ...prev, profilePictureUrl: null, isAuthenticated: false }));
                    navigate("/login");
                    return;
                }
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch profile details');
              }

              const data = await response.json();
              console.log("Fetched initial profile data:", data);

              const fetchedProfile = {
                fullName: data.name,
                userId: data._id,
                email: data.email,
                contactNo: data.contactNo || '',
                createdCampaigns: data.createdCampaigns || 0,
                backedCampaigns: data.backedCampaigns || 0,
                accountType: data.accountType || 'Choose',
                accountNumber: data.accountNumber || '',
                cvc: data.cvc || '',
                expiryDate: data.expiryDate || '',
                profilePictureUrl: data.profilePictureUrl || '', 
              };

              setProfileData(fetchedProfile);
              setEditedProfile({ ...fetchedProfile });
              setAdditionalEmails(data.additionalEmails || []);
              // Profile picture preview 
              setProfileImagePreview(data.profilePictureUrl ? `http://localhost:5000${data.profilePictureUrl}` : null); // Backend URL से preview

              // Determine initial edit mode
              if (!data.name || !data.contactNo) {
                setIsProfileEditMode(true);
              } else {
                setIsProfileEditMode(false);
              }
              if (!data.accountNumber || data.accountType === 'Choose') {
                setIsPaymentEditMode(true);
              } else {
                setIsPaymentEditMode(false);
              }

            } catch (err) {
              console.error("Fetch user profile details error:", err);
              setError(err.message || "Failed to load profile details.");
            } finally {
              setLoading(false); // End local loading
            }
          };
          fetchUserProfileDetails();
        }
      }
    }
    // Dependencies: userProfile.isAuthenticated and loadingUserContext to react to changes in context
  }, [userProfile.isAuthenticated, loadingUserContext, navigate, profileData.userId, setUserProfile]); // ADDED dependencies

  const handleProfileEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditedProfile((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImagePreview(reader.result); // Preview ke liye Data URL
      };
      reader.readAsDataURL(file);
    } else {
      setSelectedProfileImage(null);
      // Agar user ne file hatayi toh purana URL dikhayein agar exist karta hai
      setProfileImagePreview(profileData.profilePictureUrl ? `http://localhost:5000${profileData.profilePictureUrl}` : null);
    }
  };

  const handleProfilePictureSave = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError("No authentication token found. Please log in.");
        navigate("/login");
        return;
      }

      const formDataToSend = new FormData();

      if (!selectedProfileImage) {
        showToast("Please select a new photo to save.", "info"); // FIXED: Added type, removed span
        setLoading(false);
        return;
      }
      formDataToSend.append('profilePicture', selectedProfileImage);


      const response = await fetch('http://localhost:5000/api/users/profile-picture', { // Dedicated endpoint for picture
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          // Content-Type will be automatically set to multipart/form-data by the browser for FormData
        },
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update profile picture');
      }

      const updatedData = await response.json();
      console.log("Received data from backend after picture save:", updatedData);

      const updatedBackendUser = updatedData.user;
      const newPicPath = updatedBackendUser.profilePictureUrl; // This is the path from backend
      const newPicUrl = newPicPath ? `http://localhost:5000${newPicPath}` : null;

      setProfileData(prev => ({
        ...prev,
        profilePictureUrl: newPicPath || '',
      }));
      setEditedProfile(prev => ({
        ...prev,
        profilePictureUrl: newPicPath || '',
      }));
      setProfileImagePreview(newPicUrl);
      setSelectedProfileImage(null); // Clear selected file after successful upload
      if (fileInputRef.current) fileInputRef.current.value = ''; // Reset file input

      // ADDED: Update global context state for real-time header update
      setUserProfile(prev => ({ ...prev, profilePictureUrl: newPicUrl })); // THIS IS CRUCIAL

      showToast("Profile picture saved successfully!", "success"); // FIXED: Added type, removed span
    } catch (err) {
      console.error("Save profile picture error:", err);
      setError(err.message || "Failed to save profile picture.");
      showToast(`Error saving profile picture: ${err.message}`, "error"); // FIXED: Added type, removed span
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveProfilePicture = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError("No authentication token found. Please log in.");
        navigate("/login");
        return;
      }

      const response = await fetch('http://localhost:5000/api/users/profile-picture', {
        method: 'DELETE', // Use DELETE method for removal
        headers: {
          'Content-Type': 'application/json', // No body, but good practice for consistency
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to remove profile picture');
      }

      const updatedData = await response.json();
      console.log("Received data from backend after picture removal:", updatedData);

      const updatedBackendUser = updatedData.user;
      const newPicPath = updatedBackendUser.profilePictureUrl; // Should be empty string from backend
      const newPicUrl = newPicPath ? `http://localhost:5000${newPicPath}` : null;


      setProfileData(prev => ({
        ...prev,
        profilePictureUrl: newPicPath || '',
      }));
      setEditedProfile(prev => ({
        ...prev,
        profilePictureUrl: newPicPath || '',
      }));
      setProfileImagePreview(null); // Clear preview
      setSelectedProfileImage(null); // Clear selected file
      if (fileInputRef.current) fileInputRef.current.value = ''; // Reset file input

      // ADDED: Update global context state for real-time header update
      setUserProfile(prev => ({ ...prev, profilePictureUrl: newPicUrl })); // THIS IS CRUCIAL


      showToast("Profile picture removed successfully!", "success"); // FIXED: Added type, removed span
    } catch (err) {
      console.error("Remove profile picture error:", err);
      setError(err.message || "Failed to remove profile picture.");
      showToast(`Error removing profile picture: ${err.message}`, "error"); // FIXED: Added type, removed span
    } finally {
      setLoading(false);
    }
  };


  const handleProfileDetailsSave = async () => { // Renamed for clarity in previous response
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError("No authentication token found. Please log in.");
        navigate("/login");
        return;
      }

      const dataToUpdate = {
        fullName: editedProfile.fullName,
        contactNo: editedProfile.contactNo,
        // Crucial fix: Ensure additionalEmails is stringified before sending as JSON
        additionalEmails: JSON.stringify(additionalEmails),
      };

      console.log("Data to send for profile details update:", dataToUpdate);

      const response = await fetch('http://localhost:5000/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json', // Important: This tells backend to expect JSON
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(dataToUpdate), // Entire body as JSON string
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save profile details');
      }

      const updatedData = await response.json();
      console.log("Received data from backend after profile details save:", updatedData);

      const updatedBackendUser = updatedData.user;

      setProfileData(prev => ({
        ...prev,
        fullName: updatedBackendUser.name,
        contactNo: updatedBackendUser.contactNo || '',
        additionalEmails: updatedBackendUser.additionalEmails || [],
      }));

      setEditedProfile(prev => ({
        ...prev,
        fullName: updatedBackendUser.name,
        contactNo: updatedBackendUser.contactNo || '',
        additionalEmails: updatedBackendUser.additionalEmails || [],
      }));

      setAdditionalEmails(updatedBackendUser.additionalEmails || []);
      setIsProfileEditMode(false);
      setIsAddingEmail(false);

      showToast("Profile details saved successfully!", "success"); // FIXED: Added type, removed span
    } catch (err) {
      console.error("Save profile details error:", err);
      setError(err.message || "Failed to save profile details.");
      showToast(`Error saving profile details: ${err.message}`, "error"); // FIXED: Added type, removed span
    } finally {
      setLoading(false);
    }
  };

  const toggleProfileEditMode = () => {
    setIsProfileEditMode(prev => !prev);
    if (!isProfileEditMode) {
      setEditedProfile({
        ...profileData,
        additionalEmails: profileData.additionalEmails || []
      });
      setAdditionalEmails(profileData.additionalEmails || []);
    } else {
      setEditedProfile({
        ...profileData,
        fullName: profileData.fullName,
        contactNo: profileData.contactNo,
        additionalEmails: profileData.additionalEmails || []
      });
      setAdditionalEmails(profileData.additionalEmails || []);
      setNewEmail("");
      setEmailError("");
      setIsAddingEmail(false);
    }
  };

  const handleAccountSave = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError("No authentication token found. Please log in.");
        navigate("/login");
        return;
      }

      const dataToUpdate = {
        accountType: editedProfile.accountType,
        accountNumber: editedProfile.accountNumber,
        cvc: editedProfile.cvc,
        expiryDate: editedProfile.expiryDate,
      };

      console.log("Data to send for account update:", dataToUpdate);

      const response = await fetch('http://localhost:5000/api/users/profile', {
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

      setProfileData(prevProfileData => ({
        ...prevProfileData,
        fullName: updatedBackendUser.name,
        contactNo: updatedBackendUser.contactNo || '',
        additionalEmails: updatedBackendUser.additionalEmails || [],
        createdCampaigns: updatedBackendUser.createdCampaigns || 0,
        backedCampaigns: updatedBackendUser.backedCampaigns || 0,
        accountType: updatedBackendUser.accountType || 'Choose',
        accountNumber: updatedBackendUser.accountNumber || '',
        cvc: updatedBackendUser.cvc || '',
        expiryDate: updatedBackendUser.expiryDate || '',
        profilePictureUrl: updatedBackendUser.profilePictureUrl || '',
      }));

      setEditedProfile(prev => ({
        ...prev,
        fullName: updatedBackendUser.name,
        contactNo: updatedBackendUser.contactNo || '',
        additionalEmails: updatedBackendUser.additionalEmails || [],
        accountType: updatedBackendUser.accountType || 'Choose',
        accountNumber: updatedBackendUser.accountNumber || '',
        cvc: updatedBackendUser.cvc || '',
        expiryDate: updatedBackendUser.expiryDate || '',
        profilePictureUrl: updatedBackendUser.profilePictureUrl || '',
      }));

      setIsPaymentEditMode(false);
      showToast("Account details saved successfully!", "success"); // FIXED: Added type, removed span
    } catch (err) {
      console.error("Save account details error:", err);
      setError(err.message || "Failed to save account details.");
      showToast(`Error saving account details: ${err.message}`, "error"); // FIXED: Added type, removed span
    } finally {
      setLoading(false);
    }
  };

  const togglePaymentEditMode = () => {
    setIsPaymentEditMode(prev => !prev);
    if (!isPaymentEditMode) {
      setEditedProfile(prev => ({
        ...prev,
        accountType: profileData.accountType,
        accountNumber: profileData.accountNumber,
        cvc: profileData.cvc,
        expiryDate: profileData.expiryDate,
      }));
    } else {
      setEditedProfile(prev => ({
        ...prev,
        accountType: profileData.accountType,
        accountNumber: profileData.accountNumber,
        cvc: profileData.cvc,
        expiryDate: profileData.expiryDate,
      }));
    }
  };


  const handleWithdraw = () => {
    console.log("Withdraw funds logic here")
    showToast("Withdrawal functionality coming soon!", "info"); // FIXED: Added type, removed span
  }

  const handleKYC = () => {
    console.log("KYC verification logic here")
    showToast("KYC verification functionality coming soon!", "info"); // FIXED: Added type, removed span
  }

  const handleAddEmailClick = () => {
    setIsAddingEmail(true)
  }

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(String(email).toLowerCase())
  }

  const handleAddEmail = () => {
    if (!newEmail) {
      setEmailError("Email is required")
      return
    }

    if (!validateEmail(newEmail)) {
      setEmailError("Please enter a valid email address")
      return
    }

    if (newEmail === profileData.email || additionalEmails.includes(newEmail)) {
      setEmailError("This email is already added")
      return
    }

    setAdditionalEmails([...additionalEmails, newEmail])
    setNewEmail("")
    setEmailError("")
    setIsAddingEmail(false)
  }

  const handleRemoveEmail = (emailToRemove) => {
    setAdditionalEmails(additionalEmails.filter((email) => email !== emailToRemove))
  }

  const handleSignOut = () => {
    setShowConfirmLogout(true)
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    setShowConfirmLogout(false)
    // ADDED: Update context on logout
    setUserProfile(prev => ({ ...prev, profilePictureUrl: null, isAuthenticated: false })); 
    navigate("/login")
  }

  // MODIFIED: Consolidated loading and error handling based on context
  if (loading || loadingUserContext) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center bg-gray-50">
        <p className="text-xl text-gray-600">Loading profile...</p>
      </div>
    );
  }

  // MODIFIED: Only show error if not authenticated or if there's a specific fetch error
  if (error && !userProfile.isAuthenticated) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center bg-gray-50">
        <p className="text-red-600 text-xl mb-4">Error: {error}</p>
        <button
          onClick={() => navigate("/login")} // Redirect to login on error
          className="bg-[#4A5D45] text-white py-2 px-4 rounded"
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <HeaderLayout  hideProfile={true}/>

      <main className="flex-grow container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">Settings</h1>

        {/* Profile Picture Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6 text-center">
          <h2 className="text-xl font-semibold mb-4">Profile Picture</h2>
          <div className="w-40 h-40 rounded-full mx-auto overflow-hidden border-2 border-gray-300 flex items-center justify-center cursor-pointer relative group">
            <img
              src={profileImagePreview || "/Images/default-avatar.png"}
              alt="Profile"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/Images/default-avatar.png";
              }}
            />
            <div
              className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity rounded-full"
              onClick={() => fileInputRef.current.click()}
            >
              {profileImagePreview ? 'Change Photo' : 'Upload Photo'}
            </div>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleProfileImageChange}
            accept="image/*"
            className="hidden"
          />
          <p className="text-sm text-gray-600 mt-2">
            {profileImagePreview ? 'Click picture to change' : 'No photo uploaded'}
          </p>

          {/* Profile Picture Save and Remove Buttons */}
          <div className="mt-4 flex justify-center space-x-4">
            {selectedProfileImage && ( // Show save only if a new file is selected
              <button
                onClick={handleProfilePictureSave}
                className="bg-[#4A5D45] text-white py-2 px-4 rounded text-sm"
              >
                Save Photo
              </button>
            )}
            {/* Show remove if there is an existing picture OR a new one selected for preview */}
            {(profileData.profilePictureUrl || selectedProfileImage) && (
              <button
                onClick={handleRemoveProfilePicture}
                className="bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded text-sm"
              >
                Remove Photo
              </button>
            )}
          </div>
        </div>

        {/* Profile Details Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-xl font-semibold">Profile Details</h2>
            <div className="space-y-2">
              {isProfileEditMode ? (
                <div className="flex space-x-2">
                  <button onClick={handleProfileDetailsSave} className="bg-[#4A5D45] text-white py-2 px-4 rounded text-sm">Save</button>
                  <button onClick={toggleProfileEditMode} className="bg-gray-300 text-gray-700 py-2 px-4 rounded text-sm">Cancel</button>
                </div>
              ) : (
                <button onClick={toggleProfileEditMode} className="w-full bg-[#4A5D45] text-white py-2 px-4 rounded text-sm">Edit</button>
              )}
              <button onClick={handleKYC} className="w-full bg-[#4A5D45] text-white py-2 px-4 rounded text-sm">KYC</button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              {isProfileEditMode ? (
                <input type="text" name="fullName" value={editedProfile.fullName} onChange={handleProfileEditChange} className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-green-500" />
              ) : (
                <div className="text-gray-600 font-medium">{profileData.fullName}</div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <div className="text-blue-500 font-medium">{profileData.email}</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Contact No</label>
              {isProfileEditMode ? (
                <input type="text" name="contactNo" value={editedProfile.contactNo} onChange={handleProfileEditChange} className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-green-500" />
              ) : (
                <div className="text-blue-500 font-medium">{profileData.contactNo}</div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">User ID</label>
              <div className="text-gray-600 font-medium break-all">{profileData.userId}</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Created Campaigns</label>
              <div className="text-gray-600 font-medium">{profileData.createdCampaigns}</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Backed Campaigns</label>
              <div className="text-gray-600 font-medium">{profileData.backedCampaigns}</div>
            </div>
          </div>

          {/* Additional Emails section */}
          <div className="mt-8 pt-4 border-t border-gray-200">
            <h3 className="text-lg font-semibold mb-3">Additional Emails</h3>
            {additionalEmails.length > 0 ? (
              <div className="space-y-2 mb-4">
                {additionalEmails.map((email, index) => (
                  <div key={index} className="flex justify-between items-center text-blue-500 text-sm">
                    <span>{email}</span>
                    {isProfileEditMode && (
                      <button onClick={() => handleRemoveEmail(email)} className="text-red-500 hover:text-red-700 ml-2">
                        Remove
                      </button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm mb-4">No additional emails added.</p>
            )}

            {isProfileEditMode && (
              isAddingEmail ? (
                <div className="mt-2 flex items-center">
                  <input type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder="Enter new email" className="flex-grow border border-gray-300 rounded-l px-3 py-1 focus:ring-green-500 text-sm" />
                  <button onClick={handleAddEmail} className="bg-[#4A5D45] text-white px-3 py-1 rounded-r text-sm">Add</button>
                </div>
              ) : (
                <button onClick={handleAddEmailClick} className="text-blue-500 text-sm flex items-center mt-2">
                  <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                  Add Email Address
                </button>
              )
            )}
            {emailError && <p className="text-red-500 text-xs mt-1">{emailError}</p>}
          </div>

        </div>

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
                  <select name="accountType" value={editedProfile.accountType} onChange={handleProfileEditChange} className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-green-500">
                    <option value="Choose">Choose</option>
                    <option value="Visa">Visa</option>
                    <option value="Debit">Debit Card</option>
                    <option value="Stripe">Stripe</option>
                    <option value="JazzCash">JazzCash</option>
                    <option value="EasyPaisa">EasyPaisa</option>
                  </select>
                ) : (
                  <div className="text-gray-600">{profileData.accountType}</div>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">CVC</label>
                {isPaymentEditMode ? (
                  <input type="text" name="cvc" value={editedProfile.cvc} onChange={handleProfileEditChange} className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-green-500" placeholder="XXX" />
                ) : (
                  <div className="text-gray-600">{profileData.cvc ? '***' : 'N/A'}</div>
                )}
              </div>
            </div>

            <div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
                {isPaymentEditMode ? (
                  <input type="text" name="accountNumber" value={editedProfile.accountNumber} onChange={handleProfileEditChange} className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-green-500" placeholder="XXXXXXXXXXXXXXXXXXXX" />
                ) : (
                  <div className="text-gray-600">{profileData.accountNumber || 'N/A'}</div>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                {isPaymentEditMode ? (
                  <input type="text" name="expiryDate" value={editedProfile.expiryDate} onChange={handleProfileEditChange} className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-green-500" placeholder="YYYY-MM-DD" />
                ) : (
                  <div className="text-gray-600">{profileData.expiryDate || 'N/A'}</div>
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

      <div className="flex justify-center py-6 bg-white shadow-inner">
        <button onClick={handleSignOut} className="bg-[#710C04] text-white py-2 px-6 rounded text-sm">
          Sign Out
        </button>
      </div>

      {/* Confirmation Modal */}
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
  )
}

export default UserProfileSettings