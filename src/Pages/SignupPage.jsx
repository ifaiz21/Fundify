import React, { useState } from "react";
import SideLayout from "./Layout/SideLayout";
import { IoChevronBackOutline } from "react-icons/io5";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import GoogleSignInButton from '../components/GoogleSignUp'; // Ensure this import is present

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
  const [error, setError] = useState(""); // Added error state for SignupPage

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError(""); // Clear error when user types
  };

  const handleContinue = async (e) => {
    e.preventDefault();

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long."); // Using state for error
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!"); // Using state for error
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/auth/sign-up", {
        name: formData.fullName,
        email: formData.email,
        password: formData.password,
        role: "user",
      });

      navigate("/code-verification", { state: { email: formData.email, message: response.data.message } });
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed. Try again.");
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
          <div className="form-container">
            <p className="title">Sign Up</p>

            {error && (
              <p className="text-red-600 text-sm mt-2 text-center">
                {error}
              </p>
            )}

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

              <button className="form-btn" type="submit">
                Sign up
              </button>
            </form>

            <p className="sign-up-label">
              Already have an account?
              <a href="/login" className="sign-up-link">
                Login
              </a>
            </p>

            {/* Social Login Buttons */}
            <div className="buttons-container">
              {/* Removed Apple Login Button */}
              {/* Re-integrated original GoogleSignInButton component */}
              <GoogleSignInButton />
            </div>
          </div>
        </div>
      </div>
      {/* Embedded CSS for the form and buttons */}
      <style jsx>{`
        .form-container {
          width: 350px;
          min-height: 500px;
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

        .page-link {
          text-decoration: underline;
          margin: 0;
          text-align: end;
          color: #747474;
          text-decoration-color: #747474;
        }

        .page-link-label {
          cursor: pointer;
          font-family: "Lucida Sans", "Lucida Sans Regular", "Lucida Grande",
              "Lucida Sans Unicode", Geneva, Verdana, sans-serif;
          font-size: 9px;
          font-weight: 700;
          text-decoration: none;
        }

        .page-link-label:hover {
          color: #000;
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
        }

        .form-btn:active {
          box-shadow: none;
        }

        .sign-up-label {
          margin: 0;
          font-size: 10px;
          color: #747474;
          font-family: "Lucida Sans", "Lucida Sans Regular", "Lucida Grande",
              "Lucida Sans Unicode", Geneva, Verdana, sans-serif;
        }

        .sign-up-link {
          margin-left: 1px;
          font-size: 11px;
          text-decoration: underline;
          text-decoration-color: teal;
          color: teal;
          cursor: pointer;
          font-weight: 800;
          font-family: "Lucida Sans", "Lucida Sans Regular", "Lucida Grande",
              "Lucida Sans Unicode", Geneva, Verdana, sans-serif;
        }

        .buttons-container {
          width: 100%;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          margin-top: 20px;
          gap: 15px;
        }

        /* Removed .apple-login-button CSS rule */
        .google-login-button { /* Keep this CSS rule, though not directly used by GoogleSignInButton */
          border-radius: 20px;
          box-sizing: border-box;
          padding: 10px 15px;
          box-shadow: rgba(0, 0, 0, 0.16) 0px 10px 36px 0px,
              rgba(0, 0, 0, 0.06) 0px 0px 0px 1px;
          cursor: pointer;
          display: flex;
          justify-content: center;
          align-items: center;
          font-family: "Lucida Sans", "Lucida Sans Regular", "Lucida Grande",
              "Lucida Sans Unicode", Geneva, Verdana, sans-serif;
          font-size: 11px;
          gap: 5px;
          border: 2px solid #747474; /* Re-added border */
        }
        
        /* Removed .apple-icon CSS rule */
        .google-icon { /* Keep this CSS rule */
          font-size: 18px;
          margin-bottom: 1px;
        }
      `}</style>
    </SideLayout>
  );
};

export default SignupPage;