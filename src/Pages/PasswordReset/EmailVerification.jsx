import React, { useState, useRef, useEffect } from "react";
import SideLayout from "../Layout/SideLayout";
import { IoChevronBackOutline } from "react-icons/io5";
import { useNavigate, useLocation } from "react-router-dom";

const EmailVerification = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const inputRefs = useRef([]);
  const [timeLeft, setTimeLeft] = useState(5 * 60);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  const location = useLocation();

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft]);

  useEffect(() => {
    if (location.state && location.state.email) {
        setEmail(location.state.email);
    }
  }, [location]);

  const formatTime = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (isNaN(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleVerify = async (event) => {
    event.preventDefault();

  const combinedCode = otp.join("");
  setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/verify-reset-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, code: combinedCode })
      });

      const data = await res.json();

      if (res.ok) {
        alert("Email verified successfully!");
        navigate("/password-reset", { state: { email } });
      } else {
        alert(data.message || "Verification failed.");
      }
    } catch (error) {
      console.error("Verification error:", error);
      alert("Something went wrong.");
    }finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setResendLoading(true);
    setOtp(new Array(6).fill(""));
    inputRefs.current[0].focus();
    setTimeLeft(5 * 60);

    try {
      const res = await fetch("http://localhost:5000/api/auth/resend-code-pr", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email })
      });

      const data = await res.json();
      if (res.ok) {
        alert("Verification code resent to your email.");
      } else {
        alert(data.message || "Failed to resend code.");
      }
    } catch (error) {
      console.error("Resend error:", error);
      alert("Something went wrong.");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <SideLayout>
      <div className="h-screen bg-white overflow-y-hidden font-Inter">
      <div className="absolute p-4">
        <button onClick={() => navigate("/forget-password")}
          className="text-lg text-[#91ac8f] hover:text-[#667964] ease-in-out transition duration-300 mb-4 flex flex-row items-center font-semibold">
          <IoChevronBackOutline size={20} /> Back
        </button>
      </div>
      <div className="flex flex-col items-center justify-center min-h-screen px-4">
        <div className="form-container"> {/* New: Main container for the form */}
          <p className="title">Verify Your Email</p> {/* New: Title */}
          <p className="description">
            A verification code has been sent to <b>{email.replace(/(.{2})(.*)(?=@)/, (_, a, b) => a + '*'.repeat(b.length))}</b>.
            Please enter the code below. The code will expire in: {" "}
            <span className="font-bold">{formatTime()}</span>
          </p>

          <form onSubmit={handleVerify} className="form"> {/* Added form class */}
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
                className="otp-input" /* New class for OTP inputs */
                required
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={loading || otp.includes("")}
            className={`form-btn ${ /* New class for the button */
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
            disabled={resendLoading}
            className="mt-4 text-[#4b5945] hover:underline font-semibold" /* Retained original styling */
          >
            {resendLoading ? "Resending..." : "Resend Code"}
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

export default EmailVerification;