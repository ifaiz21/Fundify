import React, { useState, useEffect } from "react";
import SideLayout from "./Layout/SideLayout";
import { IoChevronBackOutline } from "react-icons/io5";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useNavigate, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const SetPasswordPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  useEffect(() => {
    if (location.state && location.state.email) {
      setEmail(location.state.email);
    } else {
      toast.error("Email not found for password setup. Redirecting...");
      // setTimeout(() => navigate("/sign-up"), 3000); // Consider where to redirect if email is missing
    }
  }, [location, navigate]);

  const handleSetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      setLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post("https://server-fundify.up.railway.app/api/auth/set-password", {
        email,
        newPassword,
      });

      const { message, token, user } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      toast.success(message || "Password set successfully and logged in!");
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      console.error("Set password error:", err.response?.data);
      toast.error(err.response?.data?.message || "Failed to set password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SideLayout>
      <ToastContainer />
      <div className="h-screen bg-[#F0FFF0] overflow-y-hidden font-Inter">
        <div className="absolute p-4">
          <button
            onClick={() => navigate("/login")}
            className="text-lg text-[#91ac8f] hover:text-[#667964] ease-in-out transition duration-300 mb-4 flex flex-row items-center font-semibold"
          >
            <IoChevronBackOutline size={20} /> Back to Login
          </button>
        </div>

        <div className="flex h-full items-center justify-center">
          {/* Apply the same form-container, title, and form classes */}
          <div className="form-container">
            <p className="title">Set Your Password</p>

            <form className="form" onSubmit={handleSetPassword}>
              <div className="relative">
                <input
                  type={showNewPass ? "text" : "password"}
                  placeholder="New Password"
                  className="input pr-12"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={6}
                  disabled={loading}
                />
                <span
                  className="absolute inset-y-0 right-4 flex items-center cursor-pointer text-gray-600"
                  onClick={() => setShowNewPass(!showNewPass)}
                >
                  {showNewPass ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
                </span>
              </div>

              <div className="relative">
                <input
                  type={showConfirmPass ? "text" : "password"}
                  placeholder="Confirm New Password"
                  className="input pr-12"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                  disabled={loading}
                />
                <span
                  className="absolute inset-y-0 right-4 flex items-center cursor-pointer text-gray-600"
                  onClick={() => setShowConfirmPass(!showConfirmPass)}
                >
                  {showConfirmPass ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
                </span>
              </div>

              <button
                type="submit"
                className="form-btn"
                disabled={loading}
              >
                {loading ? "Setting Password..." : "Set Password & Log In"}
              </button>
            </form>
          </div>
        </div>
      </div>
      {/* Embedded CSS from PasswordReset */}
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

export default SetPasswordPage;