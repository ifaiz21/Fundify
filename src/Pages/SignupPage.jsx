import React, { useState } from "react";
import SideLayout from "./Layout/SideLayout"; 
import { IoChevronBackOutline } from "react-icons/io5";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import GoogleSignUpButton from '../components/Google-Sign-Up';

const SignupPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");        // Clear errors on input change
    setSuccessMessage(""); // Clear success message on input change
  };

  // Handler for traditional email/password signup
  const handleContinue = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors
    setSuccessMessage(""); // Clear previous success messages
    setLoading(true);

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      setLoading(false);
      return;
    }

    try {
      // API call for manual email/password signup
      const response = await axios.post("https://fundify-server.vercel.app/api/auth/sign-up", {
        name: formData.fullName,
        email: formData.email,
        password: formData.password,
        role: "user", // Default role for new sign-ups
      });

      setSuccessMessage(response.data.message); // Set success message
      // Navigate to your verification page and pass email for verification
      navigate("/code-verification", {
        state: {
          email: formData.email,
          registrationMethod: 'email' // Explicitly pass 'email' for traditional signup
        }
      });
    } catch (apiError) {
      console.error("Traditional signup failed:", apiError.response?.data);
      setError(apiError.response?.data?.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handler for Google Sign-Up
  const handleGoogleSignupSuccess = async (idToken, googleAuthResponse) => {
    setLoading(true); 
    setError(""); 
    setSuccessMessage("");

    try {
      const response = await axios.post(
        "https://fundify-server.vercel.app/api/auth/google-signup-verify-email",
        {},
        {
          headers: {
            Authorization: `Bearer ${idToken}`, 
          },
        }
      );

      setSuccessMessage(response.data.message); 
      navigate("/code-verification", {
        state: {
          email: response.data.email || googleAuthResponse.email,
          registrationMethod: 'google' 
        }
      });

    } catch (apiError) {
      console.error("Google signup with verification failed:", apiError.response?.data);
      if (apiError.response?.status === 400 && apiError.response?.data?.message?.includes('already exists using a different sign-in method')) {
          setError(
            <>
              An account with this email already exists. Please{" "}
              <a href="/login" className="text-[#91ac8f] hover:text-[#667964] font-semibold underline">log in here</a>{" "}
              with your existing method, or try signing up with a different email.
            </>
          );
      } else if (apiError.response?.status === 400 && apiError.response?.data?.message?.includes('already exists and is verified')) {
          setError(
            <>
              You already have a verified account with this Google ID. Please{" "}
              <a href="/login" className="text-[#91ac8f] hover:text-[#667964] font-semibold underline">log in here</a>.
            </>
          );
      } else {
          setError(apiError.response?.data?.message || "Google signup failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SideLayout>
      <div className="min-h-screen bg-[#F0FFF0] overflow-y-auto font-Inter">
        <div className="absolute p-4">
          <button
            onClick={() => navigate("/login")}
            className="text-lg text-[#91ac8f] hover:text-[#667964] transition duration-300 mb-4 flex items-center font-semibold"
          >
            <IoChevronBackOutline size={20} /> Back
          </button>
        </div>

        {/* --- RESPONSIVE LAYOUT CHANGES --- */}
        {/* Added padding (px-4) for mobile and vertical margin/padding (py-12) */}
        <div className="flex h-full justify-center items-center py-12 px-4 mt-12 md:mt-0">
          <div className="form-container">
            <p className="title text-[#4b5849]">Sign Up</p>

            <form className="form" onSubmit={handleContinue}>
              <input
                type="text"
                className="input"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Full Name"
                required
              />

              <input
                type="email"
                className="input"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                required
              />

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="input pr-12"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  required
                  minLength={6}
                />
                <span
                  className="absolute inset-y-0 right-4 flex items-center cursor-pointer text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
                </span>
              </div>

              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  className="input pr-12"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm Password"
                  required
                  minLength={6}
                />
                <span
                  className="absolute inset-y-0 right-4 flex items-center cursor-pointer text-gray-600"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
                </span>
              </div>
              
              {/* Display messages based on type */}   
              {error && (
                <p className="text-red-600 text-sm mt-2 text-center">
                  {error}
                </p>
                )}
              {successMessage && (
                <p className="text-green-600 text-sm mb-4">
                  {successMessage}
                </p>
                )}

              <button className="form-btn" type="submit" disabled={loading}>
                {loading ? 'Signing up...' : 'Sign up'}
              </button>
            </form>

            <p className="sign-up-label">
              Already have an account?
              <a href="/login" className="sign-up-link">
                Login
              </a>
            </p>

            <div className="flex flex-col items-center mt-1 space-y-4">
              <div className="w-full flex justify-center mt-0">
                <GoogleSignUpButton 
                    onGoogleSuccess={handleGoogleSignupSuccess} 
                    buttonText="Sign up with Google" 
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* --- RESPONSIVE CSS CHANGES --- */}
      <style jsx>{`
        .form-container {
          width: 100%; /* Fill container width */
          max-width: 380px; /* But don't exceed 380px on larger screens */
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
          width: 100%;
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
          transition: background-color 0.3s, box-shadow 0.3s;
        }
        
        .form-btn:disabled {
            background-color: #9ca3af;
            cursor: not-allowed;
        }

        .form-btn:active {
          box-shadow: none;
        }

        .sign-up-label {
          margin: 0;
          font-size: 10px;
          text-align: center;
          color: #747474;
          font-family: "Lucida Sans", "Lucida Sans Regular", "Lucida Grande",
            "Lucida Sans Unicode", Geneva, Verdana, sans-serif;
        }

        .sign-up-link {
          margin-left: 4px;
          font-size: 11px;
          text-decoration: underline;
          text-decoration-color: teal;
          color: teal;
          cursor: pointer;
          font-weight: 800;
          font-family: "Lucida Sans", "Lucida Sans Regular", "Lucida Grande",
            "Lucida Sans Unicode", Geneva, Verdana, sans-serif;
        }
        
        /* --- MEDIA QUERY FOR MOBILE DEVICES --- */
        @media (max-width: 480px) {
            .form-container {
                padding: 20px;
            }
            .title {
                font-size: 24px;
                margin-bottom: 20px;
            }
        }
      `}</style>
    </SideLayout>
  );
};

export default SignupPage;

