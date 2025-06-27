import { useLocation } from "react-router-dom";
import React, { useState, useRef, useEffect } from "react";
import SideLayout from "./Layout/SideLayout";
import { IoChevronBackOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios"; 

const CodeVerificationPage = () => { 
    const navigate = useNavigate();
    const location = useLocation();

    const [email, setEmail] = useState("");
    // NEW: State to store the registration method passed from the previous page
    const [registrationMethod, setRegistrationMethod] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [otp, setOtp] = useState(new Array(6).fill(""));
    const inputRefs = useRef([]);
    const [timeLeft, setTimeLeft] = useState(5 * 60); // 5 minutes in seconds

    // Get email and registrationMethod from navigation state
    useEffect(() => {
        if (location.state && location.state.email) {
            setEmail(location.state.email);
            // Capture the registrationMethod if passed
            if (location.state.registrationMethod) {
                setRegistrationMethod(location.state.registrationMethod);
            }
        } else {
            // If email is not in state, it's an unexpected entry, redirect.
            toast.error("Email not found for verification. Redirecting to signup.", { autoClose: 3000 });
            //setTimeout(() => navigate("/sign-up"), 3000);
        }
    }, [location, navigate]);

    // Timer for code expiry
    useEffect(() => {
        if (timeLeft > 0) {
            const timer = setInterval(() => setTimeLeft(prevTime => prevTime - 1), 1000);
            return () => clearInterval(timer);
        }
        // If timeLeft reaches 0, you might want to disable resend button or show a message
    }, [timeLeft]);

    const formatTime = () => {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    };

    // OTP input change handler
    const handleChange = (e, index) => {
        const value = e.target.value;
        if (isNaN(value)) return; // Only allow numbers

        const newOtp = [...otp];
        newOtp[index] = value.substring(value.length - 1); // Take only the last character
        setOtp(newOtp);

        // Auto-focus next input
        if (value && index < 5) {
            inputRefs.current[index + 1].focus();
        }
    };

    // OTP input key down for backspace
    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    // Handle verification code submission
    const handleVerify = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(""); // Clear previous errors

        try {
            const code = otp.join(""); // Combine OTP digits into a single string
            console.log("Sending verification:", { email, code });

            // Using axios for API call
            const response = await axios.post("https://server-fundify.up.railway.app//api/auth/code-verification", {
                email,
                code,
            });

            // If verification is successful
            if (response.status === 200) {
                toast.success("Email verified successfully!", { autoClose: 2000 });

                // 🚨 NEW LOGIC HERE: Conditional redirection based on registration method
                if (registrationMethod === 'google') {
                    // If it was a Google signup, redirect to set password page
                    setTimeout(() => navigate("/set-password", { state: { email: email, registrationMethod: 'google' } }), 2000);
                } else {
                    // For traditional email signups, redirect to login page
                    setTimeout(() => navigate("/login"), 2000);
                }
            }
        } catch (apiError) {
            console.error("Verification failed:", apiError.response?.data);
            setError(apiError.response?.data?.message || "Invalid verification code. Please try again.");
            toast.error(apiError.response?.data?.message || "Verification failed.", { autoClose: 3000 });
        } finally {
            setLoading(false);
        }
    };

    // Handle resending verification code
    const handleResendCode = async () => {
        try {
            setOtp(new Array(6).fill("")); // Clear OTP input fields
            inputRefs.current[0].focus(); // Focus first input
            setTimeLeft(5 * 60); // Reset timer
            setError(""); // Clear any errors

            // Using axios for API call
            const response = await axios.post("https://server-fundify.up.railway.app//api/auth/resend-code", {
                email,
            });

            if (response.status === 200) {
                toast.success(response.data.message || "A new verification code has been sent to your email.", { autoClose: 3000 });
            }
        } catch (apiError) {
            console.error("Resend code error:", apiError.response?.data);
            setError(apiError.response?.data?.message || "Failed to resend code.");
            toast.error(apiError.response?.data?.message || "Failed to resend code.", { autoClose: 3000 });
        }
    };

    return (
        <SideLayout>
            <ToastContainer /> {/* Toast container for notifications */}
            <div className="h-screen bg-[#F0FFF0] overflow-y-hidden font-Inter">
                <div className="absolute p-4">
                    <button onClick={() => navigate("/sign-up")} // Navigates back to signup page
                        className="text-lg text-[#91ac8f] hover:text-[#667964] ease-in-out transition duration-300 mb-4 flex flex-row items-center font-semibold">
                        <IoChevronBackOutline size={20} /> Back
                    </button>
                </div>
                <div className="flex flex-col items-center justify-center min-h-screen px-4">
                    <div className="form-container">
                        <p className="title">Verify your Email</p>
                        <p className="description">
                            A verification code has been sent to <b>{email.replace(/(.{2})(.*)(?=@)/, (_, a, b) => a + '*'.repeat(b.length))}</b>
                            Please enter the code below. The code will expire in: {" "}
                            <span className="font-bold">{formatTime()}</span>
                        </p>

                        <form onSubmit={handleVerify} className="form">
                            {error && (
                            <div className="text-red-600 font-medium mb-4">
                                {error}
                            </div>
                            )}
                            
                            <div className="flex gap-2 justify-center mb-6">
                                {otp.map((digit, index) => (
                                    <input
                                        key={index}
                                        type="text"
                                        value={digit}
                                        onChange={(e) => handleChange(e, index)}
                                        onKeyDown={(e) => handleKeyDown(e, index)}
                                        ref={(el) => (inputRefs.current[index] = el)}
                                        maxLength="1"
                                        className="otp-input"
                                        required
                                        disabled={loading} // Disable inputs while loading
                                    />
                                ))}
                            </div>

                            <button
                            type="submit"
                            disabled={loading || otp.includes("")}
                            className={`form-btn ${
                                loading || otp.includes("")
                                ? "bg-gray-400 cursor-not-allowed"
                                : ""
                            }`}
                            >
                                {loading ? "Verifying..." : "Verify"}
                            </button>

                            <button
                                type="button"
                                onClick={handleResendCode}
                                disabled={loading || timeLeft === 0} // Disable if loading or timer is 0
                                className={`mt-4 font-semibold transition duration-300 ease-in-out ${
                                    loading || timeLeft === 0
                                    ? "text-gray-500 cursor-not-allowed"
                                    : "text-[#4b5945] hover:underline"
                                }`}
                            >
                                Resend code
                            </button>
                        </form>
                    </div>
                </div>
            </div>
            {/* Embedded CSS for the form and buttons */}
      <style jsx>{`
        .form-container {
          width: 350px;
          min-height: 450px; /* Adjusted min-height for this page's content */
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
        
        .description {
          text-align: center;
          font-family: "Lucida Sans", "Lucida Sans Regular", "Lucida Grande",
              "Lucida Sans Unicode", Geneva, Verdana, sans-serif;
          font-size: 14px;
          color: #555;
          margin-bottom: 20px;
        }

        .form {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 18px; /* Adjusted gap for form elements */
          margin-bottom: 15px;
        }

        .otp-input { /* New style for individual OTP input fields */
          width: 48px; /* Fixed width for OTP box */
          height: 48px; /* Fixed height for OTP box */
          border-radius: 20px; /* Rounded corners */
          border: 1px solid #c0c0c0; /* Border style */
          outline: 0 !important;
          text-align: center;
          font-size: 1.25rem; /* text-xl equivalent */
          box-sizing: border-box; /* Ensure padding/border are included in width/height */
          transition: border-color 0.3s ease-in-out; /* Smooth transition for focus */
        }

        .otp-input:focus {
          border-color: #4B5842; /* Focus color */
          box-shadow: 0 0 0 1px #4B5842; /* Focus ring */
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

        .form-btn:hover:not(:disabled) { /* Hover effect for enabled button */
          background-color: #008080; /* Darker teal on hover */
          box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
        }

        .form-btn:active {
          box-shadow: none;
        }

        .form-btn:disabled { /* Styling for disabled button */
          background-color: #a0a0a0;
          cursor: not-allowed;
          box-shadow: none;
        }
      `}</style>
        </SideLayout>
    );
};

export default CodeVerificationPage;
