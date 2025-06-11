"use client"
import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import PaymentMethodIcons from "./Layout/PaymentMethodIcons"
import HeaderLayout from "./Layout/HeaderLayout"
import FooterLayout from "./Layout/FooterLayout"

function UserProfileSettings() {
  const [profileData, setProfileData] = useState({
    fullName: "Ibn e Batuta",
    userId: "346",
    email: "ibneatuta@gmail.com",
    contactNo: "+92 345 3245679",
    createdCampaigns: 12,
    backedCampaigns: 18,
    accountType: "Choose",
    accountNumber: "",
    cvc: "",
    expiryDate: "",
  })

  const [additionalEmails, setAdditionalEmails] = useState([])
  const [newEmail, setNewEmail] = useState("")
  const [emailError, setEmailError] = useState("")
  const [isEditMode, setIsEditMode] = useState(false)
  const [isAddingEmail, setIsAddingEmail] = useState(false)
  const [editedProfile, setEditedProfile] = useState({ ...profileData })
  const [showConfirmLogout, setShowConfirmLogout] = useState(false)

  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleProfileEditChange = (e) => {
    const { name, value } = e.target
    setEditedProfile((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSave = () => {
    console.log("Saving profile data:", editedProfile)
    setProfileData(editedProfile)
    setIsEditMode(false)
    setIsAddingEmail(false)
    // API logic can go here
  }

  const handleWithdraw = () => {
    console.log("Withdraw funds")
  }

  const handleKYC = () => {
    console.log("KYC verification")
  }

  const handleEdit = () => {
    setIsEditMode(true)
    setEditedProfile({ ...profileData })
  }

  const handleCancelEdit = () => {
    setIsEditMode(false)
    setIsAddingEmail(false)
    setEditedProfile({ ...profileData })
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

  // Modified handleSignOut to show confirmation modal
  const handleSignOut = () => {
    setShowConfirmLogout(true)
  }

  // Actual logout logic: clear token and redirect
  const handleLogout = () => {
    localStorage.removeItem("authToken") // or your auth key
    setShowConfirmLogout(false)
    navigate("/login")
  }

  return (
    <div className="flex flex-col min-h-screen">
      <HeaderLayout hideProfile={true} />

      <main className="flex-grow container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">Settings</h1>

        {/* Profile Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-xl font-semibold">Profile</h2>
            <div className="space-y-2">
              {isEditMode ? (
                <div className="flex space-x-2">
                  <button onClick={handleSave} className="bg-[#4A5D45] text-white py-2 px-4 rounded text-sm">Save</button>
                  <button onClick={handleCancelEdit} className="bg-gray-300 text-gray-700 py-2 px-4 rounded text-sm">Cancel</button>
                </div>
              ) : (
                <button onClick={handleEdit} className="w-full bg-[#4A5D45] text-white py-2 px-4 rounded text-sm">Edit</button>
              )}
              <button onClick={handleKYC} className="w-full bg-[#4A5D45] text-white py-2 px-4 rounded text-sm">KYC</button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                {isEditMode ? (
                  <input type="text" name="fullName" value={editedProfile.fullName} onChange={handleProfileEditChange} className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-green-500" />
                ) : (
                  <div className="text-gray-600">{profileData.fullName}</div>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                {isEditMode ? (
                  <input type="email" name="email" value={editedProfile.email} onChange={handleProfileEditChange} className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-green-500" />
                ) : (
                  <div className="text-blue-500">{profileData.email}</div>
                )}

                {/* Additional Emails */}
                {additionalEmails.length > 0 && (
                  <div className="mt-2">
                    {additionalEmails.map((email, index) => (
                      <div key={index} className="flex justify-between text-blue-500 text-sm mt-1">
                        <span>{email}</span>
                        {isEditMode && (
                          <button onClick={() => handleRemoveEmail(email)} className="text-red-500 hover:text-red-700">
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Add Email */}
                {isEditMode && (
                  isAddingEmail ? (
                    <div className="mt-2">
                      <div className="flex items-center">
                        <input type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder="Enter new email" className="flex-grow border border-gray-300 rounded-l px-3 py-1 focus:ring-green-500 text-sm" />
                        <button onClick={handleAddEmail} className="bg-[#4A5D45] text-white px-3 py-1 rounded-r text-sm">Add</button>
                      </div>
                      {emailError && <p className="text-red-500 text-xs mt-1">{emailError}</p>}
                    </div>
                  ) : (
                    <button onClick={handleAddEmailClick} className="text-blue-500 text-sm mt-1 flex items-center">
                      <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                      </svg>
                      Add Email Address
                    </button>
                  )
                )}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Number of created campaigns</label>
                <div className="text-gray-600">{profileData.createdCampaigns}</div>
              </div>
            </div>

            <div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">User ID</label>
                <div className="text-gray-600">{profileData.userId}</div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact No</label>
                {isEditMode ? (
                  <input type="text" name="contactNo" value={editedProfile.contactNo} onChange={handleProfileEditChange} className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-green-500" />
                ) : (
                  <div className="text-blue-500">{profileData.contactNo}</div>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Number of backed campaigns</label>
                <div className="text-gray-600">{profileData.backedCampaigns}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Account Details Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-xl font-semibold">Account Details</h2>
            <button onClick={handleWithdraw} className="bg-[#4A5D45] text-white py-2 px-4 rounded text-sm">Withdraw</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Choose Account type</label>
                <select name="accountType" value={profileData.accountType} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-green-500">
                  <option value="Visa">Visa</option>
                  <option value="Debit">Debit Card</option>
                  <option value="Stripe">Stripe</option>
                  <option value="JazzCash">JazzCash</option>
                  <option value="EasyPaisa">EasyPaisa</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">CVC</label>
                <input type="text" name="cvc" value={profileData.cvc} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-green-500" placeholder="XXX" />
              </div>
            </div>

            <div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
                <input type="text" name="accountNumber" value={profileData.accountNumber} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-green-500" placeholder="XXXXXXXXXXXXXXXXXXXX" />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                <input type="text" name="expiryDate" value={profileData.expiryDate} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-green-500" placeholder="YYYY-MM-DD" />
              </div>
            </div>
          </div>

          <div className="mt-4">
            <PaymentMethodIcons />
          </div>

          <div className="flex justify-end mt-6">
            <button onClick={handleSave} className="bg-[#4A5D45] text-white py-2 px-8 rounded">Save</button>
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
                className="bg-[4b5945] bg-[#4b5945] text-white px-4 py-2 rounded"
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
