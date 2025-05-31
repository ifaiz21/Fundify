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
  const [code, setCode] = useState("");
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

  const combinedCode = otp.join(""); // Combine OTP input values
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
        navigate("/password-reset"); // or redirect wherever needed
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
        <div className="bg-white p-8 w-3/5 text-center">
          <h2 className="text-3xl font-bold mb-2">Verify your email address</h2>
          <p className="text-md text-gray-500 mb-6">
            A verification code has been sent to <b>{email.replace(/(.{2})(.*)(?=@)/, (_, a, b) => a + '*'.repeat(b.length))}</b>
          </p>
          <p className="text-md text-gray-500 mb-6">
            Please check your email and enter the verification code below. The
            code will expire in:{" "}
            <span className="font-bold">{formatTime()}</span>
          </p>

          <form onSubmit={handleVerify}>
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
                className="w-12 h-12 border border-gray-400 text-center text-xl rounded focus:outline-none focus:border-green-600"
                required
              />
            ))}
          </div>

          <button
          type="submit"
          disabled={loading || otp.includes("")}
          className={`w-full text-white p-3 rounded font-semibold text-md transition duration-300 ease-in-out ${
            loading || otp.includes("")
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-[#91ac8f] hover:bg-[#667964]"
          }`}
          >
            {loading ? "Verifying..." : "Verify"}
          </button>

          <button
            type="button"
            onClick={handleResendCode}
            disabled={resendLoading}
            className="mt-4 text-[#4b5945] hover:underline font-semibold"
          >
            {resendLoading ? "Resending..." : "Resend Code"}
          </button>
          </form>
        </div>
      </div>
      </div>
    </SideLayout>
  );
};

export default EmailVerification;
