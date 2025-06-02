import React, { useState, useEffect } from "react";
import SideLayout from "../Layout/SideLayout";
import { IoChevronBackOutline } from "react-icons/io5";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useNavigate, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PasswordReset = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  useEffect(() => {
    if (location.state && location.state.email) {
      setEmail(location.state.email);
    } else {
      toast.error("Email not found. Redirecting...");
      setTimeout(() => navigate("/forget-password"), 2000);
    }
  }, [location, navigate]);

  const handleFinalSubmit = async () => {
    setShowConfirmModal(false);

    try {
      const res = await fetch("http://localhost:5000/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, newPassword }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Password reset successfully!");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        toast.error(data.message || "Password reset failed.");
      }
    } catch (err) {
      console.error("Reset error:", err);
      toast.error("Something went wrong.");
    }
  };

  const handleShowModal = (e) => {
    e.preventDefault();
    
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    setShowConfirmModal(true);
  };

  return (
    <SideLayout>
      <ToastContainer />
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
                  <div className="relative">
                    <input
                      type={showNewPass ? "text" : "password"}
                      placeholder="Enter new Password"
                      className="w-full p-4 border rounded border-[#8692a6] outline-none pr-12"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPass(!showNewPass)}
                      className="absolute right-4 top-4 text-xl text-gray-600"
                    >
                      {showNewPass ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                    </button>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">Password must be at least 6 characters.</p>
                </div>

                <div className="space-y-2 text-[#696f79]">
                  <label htmlFor="confirm-new-password" className="font-semibold">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPass ? "text" : "password"}
                      placeholder="Confirm your new Password"
                      className="w-full p-4 border rounded border-[#8692a6] outline-none pr-12"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPass(!showConfirmPass)}
                      className="absolute right-4 top-4 text-xl text-gray-600"
                    >
                      {showConfirmPass ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                    </button>
                  </div>
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
                <div className="flex items-center justify-center w-12 h-12 bg-[#4B5842] rounded-full">
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
              <h3 className="text-lg font-semibold text-gray-900">Reset Password</h3>
              <p className="text-gray-600 mb-6">Are you sure you want to reset your password?</p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleFinalSubmit}
                  className="flex-1 px-4 py-2 text-white rounded-md bg-[#4a5741]"
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
