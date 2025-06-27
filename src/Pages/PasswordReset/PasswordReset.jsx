import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { IoChevronBackOutline } from "react-icons/io5";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
// axios is not directly used in the provided code snippet, but keeping import if needed elsewhere
// import axios from "axios";
import SideLayout from "../Layout/SideLayout";
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
      //setTimeout(() => navigate("/forget-password"), 2000);
    }
  }, [location, navigate]);

  const handleFinalSubmit = async () => {
    setShowConfirmModal(false);

    try {
      const res = await fetch("https://server-fundify.up.railway.app/api/auth/reset-password", {
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
      <div className="h-screen bg-[#F0FFF0] overflow-y-hidden font-Inter">
        <div className="absolute p-4">
          <button
            onClick={() => navigate("/forget-password")}
            className="text-lg text-[#91ac8f] hover:text-[#667964] ease-in-out transition duration-300 mb-4 flex flex-row items-center font-semibold"
          >
            <IoChevronBackOutline size={20} /> Back
          </button>
        </div>
        <div className="flex h-full items-center justify-center">
          <div className="form-container"> {/* New: Main container for the form */}
            <p className="title">Reset Password</p> {/* New: Title */}
            {/* Removed previous descriptive paragraphs */}

            <form className="form" onSubmit={handleShowModal}> {/* New: Form structure */}
              {/* New Password Input with Toggle */}
              <div className="relative">
                <input
                  type={showNewPass ? "text" : "password"}
                  placeholder="New Password"
                  className="input pr-12" /* New class, added pr-12 for icon */
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={6}
                />
                <span
                  type="button"
                  onClick={() => setShowNewPass(!showNewPass)}
                  className="absolute inset-y-0 right-4 flex items-center cursor-pointer text-gray-600"
                >
                  {showNewPass ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
                </span>
              </div>
              
              {/* Confirm New Password Input with Toggle */}
              <div className="relative">
                <input
                  type={showConfirmPass ? "text" : "password"}
                  placeholder="Confirm New Password"
                  className="input pr-12" /* New class, added pr-12 for icon */
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                />
                <span
                  type="button"
                  onClick={() => setShowConfirmPass(!showConfirmPass)}
                  className="absolute inset-y-0 right-4 flex items-center cursor-pointer text-gray-600"
                >
                  {showConfirmPass ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
                </span>
              </div>

              <button
                type="submit"
                className="form-btn" /* New class for the button */
              >
                Reset Password
              </button>
            </form>
          </div>
        </div>

        {/* Confirmation Modal - Kept separate as its styling is distinct */}
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
      {/* Embedded CSS for the form and buttons */}
      <style jsx>{`
        .form-container {
          width: 350px;
          min-height: 400px; /* Adjusted min-height for this page */
          background-color: #fff;
          box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
          border-radius: 10px;
          box-sizing: border-box;
          padding: 20px 30px;
        }

        .title {
          text-align: center;
          font-family: "Lucida Sans", "Lucida Sans Regular", "Lucida Grande",
              "Lucida Sans Unicode", Geneva, Verdana, sans-serif;
          margin: 10px 0 30px 0;
          font-size: 28px;
          font-weight: 800;
        }

        .form {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 18px;
          margin-bottom: 15px;
        }

        .input {
          border-radius: 20px;
          border: 1px solid #c0c0c0;
          outline: 0 !important;
          box-sizing: border-box;
          padding: 12px 15px;
        }

        .form-btn {
          padding: 10px 15px;
          font-family: "Lucida Sans", "Lucida Sans Regular", "Lucida Grande",
              "Lucida Sans Unicode", Geneva, Verdana, sans-serif;
          border-radius: 20px;
          border: 0 !important;
          outline: 0 !important;
          background: #4B5842;
          color: white;
          cursor: pointer;
          box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
          width: 100%; /* Ensure button takes full width of form */
          margin-top: 10px; /* Add some space above button */
        }

        .form-btn:hover:not(:disabled) {
          background-color: #008080; /* Darker teal on hover */
          box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
        }

        .form-btn:active {
          box-shadow: none;
        }

        .form-btn:disabled {
          background-color: #a0a0a0;
          cursor: not-allowed;
          box-shadow: none;
        }
      `}</style>
    </SideLayout>
  );
};

export default PasswordReset;