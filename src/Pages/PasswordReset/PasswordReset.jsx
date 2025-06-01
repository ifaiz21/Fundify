import React, { useState, useEffect } from "react";
import SideLayout from "../Layout/SideLayout";
import { IoChevronBackOutline } from "react-icons/io5";
import { useNavigate, useLocation } from "react-router-dom";

const PasswordReset = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    if (location.state && location.state.email) {
      setEmail(location.state.email);
    } else {
      alert("Email not found. Redirecting...");
      navigate("/forget-password");
    }
  }, [location, navigate]);

  const handleFinalSubmit = async () => {
    setShowConfirmModal(false);

    try {
      const res = await fetch("http://localhost:5000/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, newPassword }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Password reset successfully!");
        navigate("/login");
      } else {
        alert(data.message || "Password reset failed.");
      }
    } catch (err) {
      console.error("Reset error:", err);
      alert("Something went wrong.");
    }
  };

  const handleShowModal = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }
    setShowConfirmModal(true);
  };

  return (
    <SideLayout>
      <div className="h-screen bg-white overflow-y-hidden font-Inter">
        <div className="absolute p-4">
          <button
            onClick={() => navigate("/forget-password")}
            className="text-lg text-[#91ac8f] hover:text-[#667964] ease-in-out transition duration-300 mb-4 flex flex-row items-center font-semibold"
          >
            <IoChevronBackOutline size={20} /> Back
          </button>
        </div>
        <div className="flex h-full">
          <div className="w-full flex items-center justify-center">
            <div className="w-3/5 p-8 rounded-md">
              <h2 className="text-3xl font-bold mb-2">Reset Your Password</h2>
              <p className="text-md text-gray-500 mb-6">
                Enter your new password to recover your account.
              </p>

              <form className="space-y-4" onSubmit={handleShowModal}>
                <div className="space-y-2 text-[#696f79]">
                  <label htmlFor="new-password" className="font-semibold">
                    New Password
                  </label>
                  <input
                    type="password"
                    placeholder="Enter new Password"
                    className="w-full p-4 border rounded mb-4 border-[#8692a6] outline-none"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2 text-[#696f79]">
                  <label htmlFor="confirm-new-password" className="font-semibold">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    placeholder="Confirm your new Password"
                    className="w-full p-4 border rounded mb-4 border-[#8692a6] outline-none"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#91ac8f] text-white p-3 rounded hover:bg-[#667964] ease-in-out transition duration-300 font-semibold text-md"
                >
                  Continue
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Confirmation Modal */}
        {showConfirmModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-6 rounded-lg shadow-lg w-[400px] text-center">
              <div className="flex justify-center mb-4">
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-[#4B5842] rounded-full">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">Reset Password</h3>
              <p className="text-gray-600 text-center mb-6">Are you sure you want to reset your password?</p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleFinalSubmit}
                  className="flex-1 px-4 py-2 text-white rounded-md bg-[#4a5741] transition-colors"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </SideLayout>
  );
};

export default PasswordReset;
