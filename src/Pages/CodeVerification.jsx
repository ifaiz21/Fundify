import { useLocation } from "react-router-dom";
import React, { useState, useRef, useEffect } from "react";
import SideLayout from "./Layout/SideLayout";
import { IoChevronBackOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";


const EmailVerificationCode = () => {
    const navigate = useNavigate();
  
    const [email, setEmail] = useState(""); // email will be passed via location state
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    

  const [otp, setOtp] = useState(new Array(6).fill(""));
  const inputRefs = useRef([]);
  const [timeLeft, setTimeLeft] = useState(10 * 60);


  const location = useLocation();

  useEffect(() => {
    if (location.state && location.state.email) {
      setEmail(location.state.email);
    }
  }, [location]);
  
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft]);

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

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
  
    try {
      const code = otp.join("");
      console.log("Sending verification:", { email, code });
      const response = await fetch("http://localhost:5000/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" } ,
        body: JSON.stringify({ email, code }),
      });
  
      const data = await response.json();
      console.log("Server response:", data);
  
      if (response.ok) {
        alert("Email verified! You can now login.");
        navigate("/login");
      } else {
        setError(data.message || "Invalid code");
      }
    } catch (err) {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = () => {
    setOtp(new Array(6).fill(""));
    inputRefs.current[0].focus();
    setTimeLeft(7 * 60 + 35);
  };

  return (
    <SideLayout>
      <div className="h-screen bg-white overflow-y-hidden font-Inter">
      <div className="absolute p-4">
        <button onClick={() => navigate("/sign-up")}
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
            
            className="w-full bg-[#91ac8f] text-white p-3 rounded hover:bg-[#667964] ease-in-out transition duration-300 font-semibold text-md"
          >
            Verify
          </button>

          <button
            onClick={handleResendCode}
            className="mt-4 text-[#4b5945] hover:underline font-semibold"
          >
            Resend code
          </button>
          </form>
        </div>
      </div>
      </div>
    </SideLayout>
  );
};

export default EmailVerificationCode;
