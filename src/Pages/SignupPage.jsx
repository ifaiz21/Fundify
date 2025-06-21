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
      const response = await axios.post("http://localhost:5000/api/auth/sign-up", {
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

  // This is the NEW and specific handler for Google Sign-Up on this page.
  // It is called by the GoogleSignUpButton component after successful Google authentication.
  const handleGoogleSignupSuccess = async (idToken, googleAuthResponse) => {
    setLoading(true); // Indicate overall process is loading
    setError(""); // Clear previous errors
    setSuccessMessage(""); // Clear previous success messages

    try {
      // Make API call to your backend's *Google Sign-up with Verification* endpoint
      const response = await axios.post(
        "http://localhost:5000/api/auth/google-signup-verify-email",
        {}, // Body can be empty as the Google ID token is in the Authorization header
        {
          headers: {
            Authorization: `Bearer ${idToken}`, // Send the Google ID token to your backend
          },
        }
      );

      setSuccessMessage(response.data.message); // Set success message from backend
      // Navigate to the code verification page, passing the email AND registration method
      navigate("/code-verification", {
        state: {
          email: response.data.email || googleAuthResponse.email,
          registrationMethod: 'google' // 🚨 CRITICAL: Pass 'google' as the registration method
        }
      });

    } catch (apiError) {
      console.error("Google signup with verification failed:", apiError.response?.data);
      // Check for specific error message from backend
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
      <div className="min-h-screen bg-white overflow-y-auto font-Inter">
        <div className="absolute p-4">
          <button
            onClick={() => navigate("/login")}
            className="text-lg text-[#91ac8f] hover:text-[#667964] transition duration-300 mb-4 flex items-center font-semibold"
          >
            <IoChevronBackOutline size={20} /> Back
          </button>
        </div>

        <div className="flex h-full justify-center items-center">
          <div className="w-3/5 p-8 rounded-md">
            <h2 className="text-3xl font-bold mb-2 text-[#4b5849]">Signup with Fundify</h2>
            <p className="text-md text-gray-500 mb-6">
              Become a Member and enjoy exclusive promotions.
            </p>

            {/* Display messages based on type */}
            {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
            {successMessage && <p className="text-green-600 text-sm mb-4">{successMessage}</p>}

            <form className="space-y-4" onSubmit={handleContinue}>
              <div className="space-y-2 text-[#696f79]">
                <label htmlFor="fullName" className="font-semibold">
                  Full Name
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter your Full Name"
                  className="w-full p-2 border rounded border-[#8692a6] outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  required
                  disabled={loading} // Disable inputs during loading
                />
              </div>

              <div className="space-y-2 text-[#696f79]">
                <label htmlFor="email" className="font-semibold">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email address"
                  className="w-full p-2 border rounded border-[#8692a6] outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  required
                  disabled={loading} // Disable inputs during loading
                />
              </div>

              <div className="space-y-2 text-[#696f79]">
                <label htmlFor="password" className="font-semibold">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Password"
                    className="w-full p-2 border rounded border-[#8692a6] outline-none pr-12 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    required
                    minLength={6}
                    disabled={loading} // Disable inputs during loading
                  />
                  <span
                      className="absolute top-1/2 right-4 transform -translate-y-1/2 cursor-pointer text-gray-600"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <AiOutlineEyeInvisible size={20} />
                      ) : (
                        <AiOutlineEye size={20} />
                      )}
                    </span>
                </div>
                {formData.password.length > 0 && formData.password.length < 6 && (
                  <p className="text-sm text-red-500">Password must be at least 6 characters long.</p>
                )}
              </div>

              <div className="space-y-2 text-[#696f79]">
                <label htmlFor="confirmPassword" className="font-semibold">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm Password"
                    className="w-full p-2 border rounded border-[#8692a6] outline-none pr-12 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    required
                    minLength={6}
                    disabled={loading} // Disable inputs during loading
                  />
                   <span
                      className="absolute top-1/2 right-4 transform -translate-y-1/2 cursor-pointer text-gray-600"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <AiOutlineEyeInvisible size={20} />
                      ) : (
                        <AiOutlineEye size={20} />
                      )}
                    </span>
                </div>
                {formData.password !== formData.confirmPassword && formData.confirmPassword.length > 0 && (
                  <p className="text-sm text-red-500">Passwords do not match.</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-[#91ac8f] text-white p-3 rounded hover:bg-[#667964] transition duration-300 font-semibold text-md"
                disabled={loading} // Disable button during loading
              >
                {loading ? "Signing Up..." : "Continue"}
              </button>
            </form>

            <p className="text-sm text-gray-500 text-center mt-4">
              Already have an account?{" "}
              <a
                href="/login"
                className="text-[#91ac8f] hover:text-[#667964] transition duration-300 font-semibold"
              >
                Login here
              </a>
            </p>

            <div className="flex flex-col items-center mt-1 space-y-4">
              {/* Added a visual separator *
              <div className="flex items-center w-full my-4">
                <div className="flex-grow border-t border-gray-300"></div>
                <span className="flex-shrink mx-4 text-gray-500">OR</span>
                <div className="flex-grow border-t border-gray-300"></div>
              </div> */}

              {/* THIS IS THE GOOGLE SIGN-UP BUTTON FOR NEW USERS */}
              <div className="w-full flex justify-center mt-0">
                <GoogleSignUpButton // Using GoogleSignUpButton
                  onGoogleSuccess={handleGoogleSignupSuccess} // Pass the handler for Google Sign-up
                  buttonText="Sign up with Google" // Custom text for this specific button
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </SideLayout>
  );
};

export default SignupPage;
