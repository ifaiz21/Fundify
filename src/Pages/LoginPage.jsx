import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { setAuthUser } from '../features/authSlice'; 
//import { loginSuccess } from '../store';
import { IoChevronBackOutline } from "react-icons/io5";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import axios from "axios";
import SideLayout from "./Layout/SideLayout";
import GoogleSignInButton from '../components/Google-Sign-In';
import { showSuccessMessage, showErrorMessage } from '../utils/toast';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const msg = params.get("message");
    if (msg) setMessage(msg);
  }, [location]);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (message) setMessage("");
    if (error) setError("");
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (message) setMessage("");
    if (error) setError("");
  };

  const handleContinue = async (event) => {
    event.preventDefault();

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    try {
      const response = await axios.post("https://server-fundify.up.railway.app/api/auth/login", {
        email,
        password,
      });

      const { token, role, user } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("role", role);

      dispatch(setAuthUser(user)); 
      showSuccessMessage("Login successful!");

      if (role === "admin") {
        navigate("/admin-dashboard");
      } else {
        navigate("/homepage");
      }
    } catch (err) {
      console.error("Login failed:", err.response?.data);
      const errorMessage = err.response?.data?.message || "Login failed. Please check your credentials.";
      setError(errorMessage);
      showErrorMessage(errorMessage);
    }
  };

  return (
    <SideLayout>
      <div className="min-h-screen bg-[#F0FFF0] font-Inter flex flex-col"> {/* Changed h-screen to min-h-screen and added flex-col */}
        <div className="p-4 absolute"> {/* Added md:p-8 for more padding on larger screens */}
          <button
            onClick={() => navigate("/")}
            className="text-lg text-[#91ac8f] hover:text-[#667964] ease-in-out transition duration-300 mb-4 flex flex-row items-center font-semibold"
          >
            <IoChevronBackOutline size={20} /> Back
          </button>
        </div>

        {/* Ensure the form container is centered and takes appropriate width */}
        <div className="flex h-full justify-center items-center py-12 px-4 mt-12 md:mt-0"> {/* Added flex-grow and padding */}
          <div className="form-container w-full max-w-sm mx-auto p-6 mt-2"> {/* Added Tailwind classes for responsiveness */}
            <p className="title text-[#4b5849]">Welcome back</p>

            <form className="form" onSubmit={handleContinue}>
              <input
                type="email"
                className="input"
                id="email"
                placeholder="Email"
                value={email}
                onChange={handleEmailChange}
                required
              />

                <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="input pr-12"
                  id="password"
                  placeholder="Password"
                  value={password}
                  onChange={handlePasswordChange}
                  required
                />
                <span
                  className="absolute inset-y-0 right-4 flex items-center cursor-pointer text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
                </span>
              </div>

              {message && <div className="text-green-600 mb-4 text-center">{message}</div>}
              {error && <p className="text-red-600 text-sm mt-2 text-center">{error}</p>}

              <p className="page-link">
                <a href="/forget-password" className="page-link-label">
                  Forgot Password?
                </a>
              </p>

              <button className="form-btn" type="submit">
                Log in
              </button>
            </form>

            <p className="sign-up-label">
              Don't have an account?
              <a href="/sign-up" className="sign-up-link">
                Sign up
              </a>
            </p>

            <div className="buttons-container">
              <GoogleSignInButton />
            </div>
          </div>
        </div>
      </div>
      {/* Embedded CSS for the form and buttons */}
      <style jsx>{`
        .form-container {
          /* Remove fixed width and height from here to make it responsive */
          /* width: 350px; */
          /* height: 500px; */
          background-color: #fff;
          box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
          border-radius: 10px;
          box-sizing: border-box;
          /* Padding is now controlled by Tailwind class 'p-6' on the div above */
          /* padding: 20px 30px; */
        }

        /* Responsive adjustments for form-container using media query if needed,
           but Tailwind classes should handle most of it now */
        @media (max-width: 639px) { /* Tailwind's 'sm' breakpoint is 640px, so this applies to smaller screens */
            .form-container {
                padding: 1.5rem; /* Equivalent to p-6, ensuring consistent mobile padding */
            }
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
          font-size: 9px; /* This font size might be too small on some phones. Consider increasing it slightly. */
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
          font-size: 10px; /* This font size might be too small on some phones. Consider increasing it slightly. */
          color: #747474;
          font-family: "Lucida Sans", "Lucida Sans Regular", "Lucida Grande",
            "Lucida Sans Unicode", Geneva, Verdana, sans-serif;
        }

        .sign-up-link {
          margin-left: 1px;
          font-size: 11px; /* This font size might be too small on some phones. Consider increasing it slightly. */
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
          border: 2px solid #747474;
        }

        .google-icon {
          font-size: 18px;
          margin-bottom: 1px;
        }
      `}</style>
    </SideLayout>
  );
};

export default LoginPage;