// src/Pages/UserProfileSettings.jsx
"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
// Assuming HeaderLayout and FooterLayout are responsive or will be made responsive externally
import HeaderLayout from "./Layout/HeaderLayout";
// Assuming SideBar is a separate component that will handle its own mobile state (e.g., a drawer)
import SideBar from "../components/SideBar";
import FooterLayout from "./Layout/FooterLayout";
import { useUser } from "../context/UserContext";
import { showSuccessMessage, showErrorMessage } from "../utils/toast";

function UserProfileSettings() {
  const { userProfile, setUserProfile, loadingUserContext } = useUser();

  const [profileData, setProfileData] = useState({
    fullName: "",
    userId: "",
    email: "",
    contactNo: "",
    createdCampaigns: 0,
    backedCampaigns: 0,
    profilePictureUrl: "",
    kycStatus: "Not Submitted", // Default status, will be updated from backend
  });

  const [userKYCApplication, setUserKYCApplication] = useState(null);

  const [additionalEmails, setAdditionalEmails] = useState([]);
  const [newEmail, setNewEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const [isProfileEditMode, setIsProfileEditMode] = useState(false);
  const [isAddingEmail, setIsAddingEmail] = useState(false);
  const [editedProfile, setEditedProfile] = useState({ ...profileData });
  const [showConfirmLogout, setShowConfirmLogout] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedProfileImage, setSelectedProfileImage] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  const [activeMenuItem, setActiveMenuItem] = useState("Profile");
  // State to control mobile sidebar visibility
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const navigate = useNavigate();

  // Function to toggle mobile sidebar
  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen((prev) => !prev);
  };

  const fetchAllUserDetails = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        localStorage.removeItem("token");
        setUserProfile((prev) => ({
          ...prev,
          profilePictureUrl: null,
          isAuthenticated: false,
        }));
        // navigate("/login"); // Commented out as per original code, but often desired
        return;
      }

      // --- 1. Fetch main user profile ---
      const userProfileResponse = await fetch(
        "https://server-fundify.up.railway.app/api/users/profile",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!userProfileResponse.ok) {
        if (
          userProfileResponse.status === 401 ||
          userProfileResponse.status === 403 ||
          userProfileResponse.status === 404
        ) {
          localStorage.removeItem("token");
          setUserProfile((prev) => ({
            ...prev,
            profilePictureUrl: null,
            isAuthenticated: false,
          }));
          navigate("/login");
          return;
        }
        const errorData = await userProfileResponse.json();
        throw new Error(errorData.message || "Failed to fetch profile details");
      }
      const userData = await userProfileResponse.json();
      console.log("Fetched initial user profile data:", userData);

      // --- 2. Fetch user's KYC application details ---
      const kycAppResponse = await fetch(
        "https://server-fundify.up.railway.app/api/kyc/my-application",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      let kycAppData = {};
      if (kycAppResponse.ok) {
        kycAppData = await kycAppResponse.json();
        console.log("Fetched KYC application data:", kycAppData);
      } else {
        const errorData = await kycAppResponse.json();
        console.error("Failed to fetch KYC application:", errorData.message);
        kycAppData = { kycApplication: null };
      }

      let derivedKycStatus = "Not Submitted";
      if (kycAppData.kycApplication) {
        derivedKycStatus = kycAppData.kycApplication.status;
        setUserKYCApplication(kycAppData.kycApplication);
      } else {
        setUserKYCApplication(null);
      }

      const fetchedProfile = {
        fullName: userData.name,
        userId: userData._id,
        email: userData.email,
        contactNo: userData.contactNo || "",
        createdCampaigns: userData.createdCampaigns || 0,
        backedCampaigns: userData.backedCampaigns || 0,
        profilePictureUrl: userData.profilePictureUrl || "",
        kycStatus: derivedKycStatus,
      };

      setProfileData(fetchedProfile);
      setEditedProfile({ ...fetchedProfile });
      setAdditionalEmails(userData.additionalEmails || []);
      setProfileImagePreview(
        userData.profilePictureUrl
          ? `https://server-fundify.up.railway.app/${userData.profilePictureUrl}`
          : null
      );

      if (!userData.name || !userData.contactNo) {
        setIsProfileEditMode(true);
      } else {
        setIsProfileEditMode(false);
      }
    } catch (err) {
      console.error("Error in fetchAllUserDetails:", err);
      setError(err.message || "Failed to load profile details.");
    } finally {
      setLoading(false);
    }
  }, [navigate, setUserProfile]);

  useEffect(() => {
    if (!loadingUserContext) {
      fetchAllUserDetails();
    }
  }, [loadingUserContext, fetchAllUserDetails]);

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
        setProfileImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setSelectedProfileImage(null);
      setProfileImagePreview(
        profileData.profilePictureUrl
          ? `https://server-fundify.up.railway.app/${profileData.profilePictureUrl}`
          : null
      );
    }
  };

  const handleProfilePictureSave = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        showErrorMessage("No authentication token found. Please log in.");
        navigate("/login");
        return;
      }

      const formDataToSend = new FormData();

      if (!selectedProfileImage) {
        showErrorMessage("Please select a new photo to save.");
        setLoading(false);
        return;
      }
      formDataToSend.append("profilePicture", selectedProfileImage);

      const response = await fetch(
        "https://server-fundify.up.railway.app/api/users/profile-picture",
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formDataToSend,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Failed to update profile picture"
        );
      }

      const updatedData = await response.json();
      console.log(
        "Received data from backend after picture save:",
        updatedData
      );

      const updatedBackendUser = updatedData.user;
      const newPicPath = updatedBackendUser.profilePictureUrl;
      const newPicUrl = newPicPath
        ? `https://server-fundify.up.railway.app/${newPicPath}`
        : null;

      setProfileData((prev) => ({
        ...prev,
        profilePictureUrl: newPicPath || "",
      }));
      setEditedProfile((prev) => ({
        ...prev,
        profilePictureUrl: newPicPath || "",
      }));
      setProfileImagePreview(newPicUrl);
      setSelectedProfileImage(null);
      if (fileInputRef.current) fileInputRef.current.value = "";

      setUserProfile((prev) => ({ ...prev, profilePictureUrl: newPicUrl }));

      showSuccessMessage("Profile picture saved successfully!");
    } catch (err) {
      console.error("Save profile picture error:", err);
      setError(err.message || "Failed to save profile picture.");
      showErrorMessage(`Error saving profile picture: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveProfilePicture = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        showErrorMessage("No authentication token found. Please log in.");
        navigate("/login");
        return;
      }

      const response = await fetch(
        "https://server-fundify.up.railway.app/api/users/profile-picture",
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Failed to remove profile picture"
        );
      }

      const updatedData = await response.json();
      console.log(
        "Received data from backend after picture removal:",
        updatedData
      );

      const updatedBackendUser = updatedData.user;
      const newPicPath = updatedBackendUser.profilePictureUrl;
      const newPicUrl = newPicPath
        ? `https://server-fundify.up.railway.app/${newPicPath}`
        : null;

      setProfileData((prev) => ({
        ...prev,
        profilePictureUrl: newPicPath || "",
      }));
      setEditedProfile((prev) => ({
        ...prev,
        profilePictureUrl: newPicPath || "",
      }));
      setProfileImagePreview(null);
      setSelectedProfileImage(null);
      if (fileInputRef.current) fileInputRef.current.value = "";

      setUserProfile((prev) => ({ ...prev, profilePictureUrl: newPicUrl }));

      showSuccessMessage("Profile picture removed successfully!");
    } catch (err) {
      console.error("Remove profile picture error:", err);
      setError(err.message || "Failed to remove profile picture.");
      showErrorMessage(`Error removing profile picture: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileDetailsSave = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        showErrorMessage("No authentication token found. Please log in.");
        navigate("/login");
        return;
      }

      const dataToUpdate = {
        fullName: editedProfile.fullName,
        contactNo: editedProfile.contactNo,
        additionalEmails: JSON.stringify(additionalEmails),
      };

      console.log("Data to send for profile details update:", dataToUpdate);

      const response = await fetch(
        "https://server-fundify.up.railway.app/api/users/profile",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(dataToUpdate),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save profile details");
      }

      const updatedData = await response.json();
      console.log(
        "Received data from backend after profile details save:",
        updatedData
      );

      const updatedBackendUser = updatedData.user;

      setProfileData((prev) => ({
        ...prev,
        fullName: updatedBackendUser.name,
        contactNo: updatedBackendUser.contactNo || "",
        additionalEmails: updatedBackendUser.additionalEmails || [],
      }));

      setEditedProfile((prev) => ({
        ...prev,
        fullName: updatedBackendUser.name,
        contactNo: updatedBackendUser.contactNo || "",
        additionalEmails: updatedBackendUser.additionalEmails || [],
      }));

      setAdditionalEmails(updatedBackendUser.additionalEmails || []);
      setIsProfileEditMode(false);
      setIsAddingEmail(false);

      showSuccessMessage("Profile details saved successfully!");
    } catch (err) {
      console.error("Save profile details error:", err);
      setError(err.message || "Failed to save profile details.");
      showErrorMessage(`Error saving profile details: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const toggleProfileEditMode = () => {
    setIsProfileEditMode((prev) => !prev);
    if (!isProfileEditMode) {
      setEditedProfile({
        ...profileData,
        additionalEmails: profileData.additionalEmails || [],
      });
      setAdditionalEmails(profileData.additionalEmails || []);
    } else {
      setEditedProfile({
        ...profileData,
        fullName: profileData.fullName,
        contactNo: profileData.contactNo,
        additionalEmails: profileData.additionalEmails || [],
      });
      setAdditionalEmails(profileData.additionalEmails || []);
      setNewEmail("");
      setEmailError("");
      setIsAddingEmail(false);
    }
  };

  const handleKYC = () => {
    navigate("/kyc-form");
  };

  const handleAddEmailClick = () => {
    setIsAddingEmail(true);
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const handleAddEmail = () => {
    if (!newEmail) {
      setEmailError("Email is required");
      return;
    }

    if (!validateEmail(newEmail)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    if (newEmail === profileData.email || additionalEmails.includes(newEmail)) {
      setEmailError("This email is already added");
      return;
    }

    setAdditionalEmails([...additionalEmails, newEmail]);
    setNewEmail("");
    setEmailError("");
    setIsAddingEmail(false);
  };

  const handleRemoveEmail = (emailToRemove) => {
    setAdditionalEmails(
      additionalEmails.filter((email) => email !== emailToRemove)
    );
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setShowConfirmLogout(false);
    setUserProfile((prev) => ({
      ...prev,
      profilePictureUrl: null,
      isAuthenticated: false,
    }));
    navigate("/login");
  };

  const handleMenuItemClick = (itemName) => {
    setActiveMenuItem(itemName);
    if (itemName === "Logout") {
      setShowConfirmLogout(true);
    } else if (itemName === "Profile") {
      // Already on this page, no navigation needed
    } else if (itemName === "My Campaigns") {
      navigate("/my-campaigns");
    } else if (itemName === "Billing") {
      navigate("/billing");
    } else if (itemName === "Notifications") {
      navigate("/notifications");
    }
    // Close mobile sidebar if an item is clicked
    setIsMobileSidebarOpen(false);
  };

  if (loading || loadingUserContext) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center bg-gray-50">
        <p className="text-xl text-gray-600">Loading profile...</p>
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
      {/* HeaderLayout needs to handle its own responsiveness, potentially a hamburger */}
      {/* Pass toggleMobileSidebar to HeaderLayout so it can trigger the sidebar */}
      <HeaderLayout hideProfile={true} toggleSidebar={toggleMobileSidebar} />

      {/* Main content area: Flex container for Sidebar and Main content */}
      {/* On small screens, flex-col stacks them. On md and up, it's a row */}
      <div className="flex flex-grow flex-col md:flex-row bg-gray-50">
        {/* Sidebar: Hidden on small screens, block on medium and up */}
        {/* For mobile, consider making SideBar a drawer/overlay component that slides in/out. */}
        {/* Pass isMobileSidebarOpen and toggleMobileSidebar to SideBar */}
        <SideBar
          activeItem={activeMenuItem}
          onItemClick={handleMenuItemClick}
          handleLogout={() => setShowConfirmLogout(true)}
          className="hidden md:block" // Hide on small, show on md and above
          isMobileOpen={isMobileSidebarOpen} // Pass mobile open state
          toggleMobile={toggleMobileSidebar} // Pass toggle function
        />

        {/* Mobile Sidebar Overlay (when open) */}
        {isMobileSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={toggleMobileSidebar} // Close sidebar when clicking outside
          ></div>
        )}

        {/* Mobile Sidebar Drawer (when open) */}
        <div
          className={`fixed top-0 left-0 h-full bg-white w-64 z-50 transform transition-transform duration-300 ease-in-out md:hidden
            ${isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
          <SideBar
            activeItem={activeMenuItem}
            onItemClick={handleMenuItemClick}
            handleLogout={() => setShowConfirmLogout(true)}
            isMobileOpen={isMobileSidebarOpen}
            toggleMobile={toggleMobileSidebar}
          />
        </div>


        {/* Main content area */}
        {/* mx-auto and px-4 on main container are good. */}
        <main className="flex-grow container mx-auto px-4 py-6 md:ml-0">
          {activeMenuItem === "Profile" && (
            <>
              {/* Responsive Heading */}
              <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Profile Settings</h1>

              {/* Profile Picture Section */}
              {/* On mobile, stack items instead of side-by-side */}
              <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-4 sm:mb-6 flex flex-col sm:flex-row items-center sm:justify-between">
                {/* Left Section: Text and File Input */}
                {/* Order of elements might change on mobile if you want picture above text */}
                <div className="text-center sm:text-left flex-grow mb-4 sm:mb-0 sm:mr-6 order-2 sm:order-1">
                  <h1 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2">
                    Profile Picture
                  </h1>
                  <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-4">
                    {profileImagePreview
                      ? "Click on picture to change"
                      : "Click On Picture to Upload Your Photo"}
                  </p>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleProfileImageChange}
                    accept="image/*"
                    className="hidden"
                  />
                  {/* Buttons: Stack on small screens, row on medium and up */}
                  <div className="flex flex-col space-y-2 sm:flex-row sm:space-x-3 sm:space-y-0">
                    {selectedProfileImage && (
                      <button
                        onClick={handleProfilePictureSave}
                        className="bg-[#4A5D45] text-white py-2 px-4 rounded text-sm hover:bg-[#3d4f3a] transition-colors duration-200 w-full sm:w-auto"
                      >
                        Save Photo
                      </button>
                    )}
                    {(profileData.profilePictureUrl || selectedProfileImage) && (
                      <button
                        onClick={handleRemoveProfilePicture}
                        className="bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded text-sm transition-colors duration-200 w-full sm:w-auto"
                      >
                        Remove Photo
                      </button>
                    )}
                  </div>
                </div>

                {/* Right Section: Profile Picture Display */}
                {/* Center on mobile, maintain size but adjust margins/placement */}
                <div
                  className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border-2 border-gray-300 flex items-center justify-center cursor-pointer relative group flex-shrink-0 order-1 sm:order-2 mb-4 sm:mb-0"
                  onClick={() => fileInputRef.current.click()}
                >
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
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white text-xs sm:text-sm opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                    {profileImagePreview ? "Change Photo" : "Upload Photo"}
                  </div>
                </div>
              </div>

              {/* Profile Details Section */}
              <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-4 sm:mb-6">
                <div className="flex flex-col sm:flex-row justify-between items-start mb-4 sm:mb-6"> {/* Stack on mobile */}
                  <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-0">Profile Details</h2> {/* Adjust heading size */}
                  <div className="flex flex-col space-y-2 w-full sm:w-auto"> {/* Stack buttons on mobile */}
                    {/* Edit/Save/Cancel buttons */}
                    {isProfileEditMode ? (
                      <div className="flex space-x-2 w-full">
                        <button
                          onClick={handleProfileDetailsSave}
                          className="bg-[#4A5D45] text-white py-2 px-4 rounded text-sm w-1/2" // Half width on mobile
                        >
                          Save
                        </button>
                        <button
                          onClick={toggleProfileEditMode}
                          className="bg-gray-300 text-gray-700 py-2 px-4 rounded text-sm w-1/2" // Half width on mobile
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      // This is the "Edit" button
                      <button
                        onClick={toggleProfileEditMode}
                        className="w-full bg-[#4A5D45] text-white py-2 px-4 rounded text-sm"
                      >
                        Edit
                      </button>
                    )}

                    {/* Conditional rendering for KYC button - Always ensure it occupies space for consistent layout */}
                    {profileData.kycStatus === "Approved" ? (
                      // If Approved, render an invisible placeholder to maintain layout
                      <div className="w-full py-2 px-4 text-sm invisible"></div>
                    ) : (
                      // For other statuses (Pending Review, Rejected, Not Submitted), show the button
                      <button
                        onClick={handleKYC}
                        className="w-full bg-[#4A5D45] text-white py-2 px-4 rounded text-sm"
                      >
                        {profileData.kycStatus === "Rejected"
                          ? "Apply again for KYC"
                          : "KYC"}
                      </button>
                    )}
                  </div>
                </div>

                {/* Profile Details Grid */}
                {/* On small screens, make it a single column grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700">
                      Full Name
                    </label>
                    {isProfileEditMode ? (
                      <input
                        type="text"
                        name="fullName"
                        value={editedProfile.fullName}
                        onChange={handleProfileEditChange}
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-green-500" // Adjusted text size
                      />
                    ) : (
                      <div className="text-gray-600 font-medium text-sm"> {/* Adjusted text size */}
                        {profileData.fullName}
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <div className="text-blue-500 font-medium text-sm break-words"> {/* Adjusted text size, added break-words */}
                      {profileData.email}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700">
                      Contact No
                    </label>
                    {isProfileEditMode ? (
                      <input
                        type="text"
                        name="contactNo"
                        value={editedProfile.contactNo}
                        onChange={handleProfileEditChange}
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-green-500" // Adjusted text size
                      />
                    ) : (
                      <div className="text-blue-500 font-medium text-sm"> {/* Adjusted text size */}
                        {profileData.contactNo}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700">
                      User ID
                    </label>
                    <div className="text-gray-600 font-medium text-sm break-all"> {/* Adjusted text size */}
                      {profileData.userId}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700">
                      Created Campaigns
                    </label>
                    <div className="text-gray-600 font-medium text-sm"> {/* Adjusted text size */}
                      {profileData.createdCampaigns}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700">
                      Backed Campaigns
                    </label>
                    <div className="text-gray-600 font-medium text-sm"> {/* Adjusted text size */}
                      {profileData.backedCampaigns}
                    </div>
                  </div>
                </div>

                {/* KYC Status Section */}
                <div className="mt-6 sm:mt-8 pt-4 border-t border-gray-200">
                  <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3">KYC Status</h3> {/* Adjust heading size */}
                  <div className="flex items-center flex-wrap gap-2"> {/* Added flex-wrap and gap for small screens */}
                    {/* Conditional rendering for status tag based on profileData.kycStatus */}
                    {profileData.kycStatus === "Pending Review" && (
                      <span className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-yellow-100 text-yellow-800">
                        <svg
                          className="h-3 w-3 sm:h-4 sm:w-4 mr-1" // Adjusted icon size
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            d="M8.257 3.099c.765-1.36 2.722-1.36 3.487 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          ></path>
                        </svg>
                        {profileData.kycStatus}
                      </span>
                    )}
                    {profileData.kycStatus === "Approved" && (
                      <span className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-green-100 text-green-800">
                        <svg
                          className="h-3 w-3 sm:h-4 sm:w-4 mr-1" // Adjusted icon size
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          ></path>
                        </svg>
                        {profileData.kycStatus}
                      </span>
                    )}
                    {profileData.kycStatus === "Rejected" && (
                      <span className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-red-100 text-red-800">
                        <svg
                          className="h-3 w-3 sm:h-4 sm:w-4 mr-1" // Adjusted icon size
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                            clipRule="evenodd"
                          ></path>
                        </svg>
                        {profileData.kycStatus}
                      </span>
                    )}
                    {profileData.kycStatus === "Not Submitted" && (
                      <span className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-gray-100 text-gray-800">
                        <svg
                          className="h-3 w-3 sm:h-4 sm:w-4 mr-1" // Adjusted icon size
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          ></path>
                        </svg>
                        {profileData.kycStatus}
                      </span>
                    )}
                  </div>
                  {profileData.kycStatus === "Rejected" &&
                    userKYCApplication?.adminComments && (
                      <p className="text-red-600 text-xs sm:text-sm mt-2"> {/* Adjusted text size */}
                        Reason for Rejection: {userKYCApplication.adminComments}
                      </p>
                    )}
                </div>

                {/* Additional Emails section */}
                <div className="mt-6 sm:mt-8 pt-4 border-t border-gray-200">
                  <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3">
                    Additional Emails
                  </h3>
                  {additionalEmails.length > 0 ? (
                    <div className="space-y-2 mb-4">
                      {additionalEmails.map((email, index) => (
                        <div
                          key={index}
                          className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-blue-500 text-sm" // Stack on mobile
                        >
                          <span className="mb-1 sm:mb-0 break-words">{email}</span> {/* Added break-words */}
                          {isProfileEditMode && (
                            <button
                              onClick={() => handleRemoveEmail(email)}
                              className="text-red-500 hover:text-red-700 sm:ml-2 text-xs sm:text-sm" // Adjusted text size
                            >
                              Remove
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm mb-4">
                      No additional emails added.
                    </p>
                  )}

                  {isProfileEditMode &&
                    (isAddingEmail ? (
                      <div className="mt-2 flex flex-col sm:flex-row items-stretch sm:items-center"> {/* Stack on mobile */}
                        <input
                          type="email"
                          value={newEmail}
                          onChange={(e) => setNewEmail(e.target.value)}
                          placeholder="Enter new email"
                          className="flex-grow border border-gray-300 rounded sm:rounded-l px-3 py-1 focus:ring-green-500 text-sm mb-2 sm:mb-0" // Full width on mobile, rounded
                        />
                        <button
                          onClick={handleAddEmail}
                          className="bg-[#4A5D45] text-white px-3 py-1 rounded sm:rounded-r text-sm w-full sm:w-auto" // Full width on mobile
                        >
                          Add
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={handleAddEmailClick}
                        className="text-blue-500 text-sm flex items-center mt-2"
                      >
                        <svg
                          className="h-4 w-4 mr-1"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 4v16m8-8H4"
                          />
                        </svg>
                        Add Email Address
                      </button>
                    ))}
                  {emailError && (
                    <p className="text-red-500 text-xs mt-1">{emailError}</p>
                  )}
                </div>
              </div>
            </>
          )}

          {activeMenuItem === "Notifications" && (
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6"> {/* Adjusted padding */}
              <h2 className="text-lg sm:text-xl font-semibold"> {/* Adjusted heading size */}
                Notifications (Coming Soon)
              </h2>
            </div>
          )}
        </main>
      </div>

      {showConfirmLogout && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-xs sm:max-w-sm text-center">
            <h2 className="text-lg font-semibold mb-4">Confirm Logout</h2>
            <p className="mb-6">Are you sure you want to log out?</p>
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
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}

      <FooterLayout />
    </div>
  );
}

export default UserProfileSettings;
