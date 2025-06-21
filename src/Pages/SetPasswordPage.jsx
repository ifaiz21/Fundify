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
  const [loading, setLoading] = useState(false); // Add loading state
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  // Get email from navigation state
  useEffect(() => {
    if (location.state && location.state.email) {
      setEmail(location.state.email);
    } else {
      // If no email is provided, redirect them back to signup or login
      toast.error("Email not found for password setup. Redirecting...");
     // setTimeout(() => navigate("/sign-up"), 3000); // Redirect to signup or login
    }
  }, [location, navigate]);

  const handleSetPassword = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading

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
      // Make API call to the NEW /api/auth/set-password endpoint
      const response = await axios.post("http://localhost:5000/api/auth/set-password", {
        email,
        newPassword,
      });

      // Assuming backend returns a token and user data on success
      const { message, token, user } = response.data;

      // Store token and user data (e.g., in localStorage or context)
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      toast.success(message || "Password set successfully and logged in!");
      // Redirect to dashboard or main authenticated page
      setTimeout(() => navigate("/"), 2000); // Redirect to your main app page
    } catch (err) {
      console.error("Set password error:", err.response?.data);
      toast.error(err.response?.data?.message || "Failed to set password. Please try again.");
    } finally {
      setLoading(false); // End loading
    }
  };

  return (
    <SideLayout>
      <ToastContainer />
      <div className="min-h-screen bg-white overflow-y-hidden font-Inter">
        <div className="absolute p-4">
          <button
            onClick={() => navigate("/login")}
            className="text-lg text-[#91ac8f] hover:text-[#667964] ease-in-out transition duration-300 mb-4 flex flex-row items-center font-semibold"
          >
            <IoChevronBackOutline size={20} /> Back to Login
          </button>
        </div>
        <div className="flex h-full">
          <div className="w-full flex items-center justify-center">
            <div className="w-3/5 p-8 rounded-md">
              <h2 className="text-3xl font-bold mb-2">Set Your Password</h2>
              <p className="text-md text-gray-500 mb-6">
                Please set a password for your account. This will allow you to log in with your email address in the future.
              </p>

              <form className="space-y-4" onSubmit={handleSetPassword}>
                <div className="space-y-2 text-[#696f79]">
                  <label htmlFor="new-password" className="font-semibold">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPass ? "text" : "password"}
                      placeholder="Enter new Password"
                      className="w-full p-4 border rounded border-[#8692a6] outline-none pr-12 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      minLength={6}
                      disabled={loading} // Disable input during loading
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPass(!showNewPass)}
                      className="absolute right-4 top-4 text-xl text-gray-600"
                      disabled={loading} // Disable toggle button during loading
                    >
                      {showNewPass ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                    </button>
                  </div>
                  {newPassword.length > 0 && newPassword.length < 6 && (
                    <p className="text-sm text-red-500">Password must be at least 6 characters long.</p>
                  )}
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
                      className="w-full p-4 border rounded border-[#8692a6] outline-none pr-12 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      minLength={6}
                      disabled={loading} // Disable input during loading
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPass(!showConfirmPass)}
                      className="absolute right-4 top-4 text-xl text-gray-600"
                      disabled={loading} // Disable toggle button during loading
                    >
                      {showConfirmPass ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                    </button>
                  </div>
                  {newPassword !== confirmPassword && confirmPassword.length > 0 && (
                    <p className="text-sm text-red-500">Passwords do not match.</p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#91ac8f] text-white p-3 rounded hover:bg-[#667964] ease-in-out transition duration-300 font-semibold text-md"
                  disabled={loading} // Disable button during loading
                >
                  {loading ? "Setting Password..." : "Set Password & Log In"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </SideLayout>
  );
};

export default SetPasswordPage;
