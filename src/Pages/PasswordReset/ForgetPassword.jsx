import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoChevronBackOutline } from "react-icons/io5";
// Removed AiOutlineEye, AiOutlineEyeInvisible, axios as they are not used in this simplified version
// import axios from "axios"; // Keeping axios import as fetch is used, but typically axios would be used for post
import SideLayout from "../Layout/SideLayout";

const ForgetPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const handleContinue = async (event) => {
    event.preventDefault();
  
    try {
      const res = await fetch("http://localhost:5000/api/auth/send-verification-code-for-reset", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email })
      });
  
      const data = await res.json();
  
      if (res.ok) {
        navigate("/email-verification", { state: { email } });
      } else {
        alert(data.message || "Failed to send code.");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      alert("Something went wrong.");
    }
  };

  return (
    <SideLayout>
      <div className="h-screen bg-white overflow-y-hidden font-Inter">
        <div className="absolute p-4">
          <button
            onClick={() => navigate("/Login")}
            className="text-lg text-[#91ac8f] hover:text-[#667964] ease-in-out transition duration-300 mb-4 flex flex-row items-center font-semibold"
          >
            <IoChevronBackOutline size={20} /> Back
          </button>
        </div>
        <div className="flex h-full items-center justify-center">
          <div className="form-container"> {/* New: Main container for the form */}
            <p className="title">Forgot Password?</p> {/* New: Title */}
            {/* Removed previous descriptive paragraphs */}
            
            <form className="form" onSubmit={handleContinue}> {/* New: Form structure */}
              <input
                type="email"
                className="input" // New class
                placeholder="Email" // Changed placeholder
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <button className="form-btn" type="submit">
                Continue
              </button>
            </form>
          </div>
        </div>
      </div>
      {/* Embedded CSS for the form and buttons */}
      <style jsx>{`
        .form-container {
          width: 350px;
          min-height: 350px; /* Adjusted min-height for this page, as content is less */
          background-color: #fff;
          box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
          border-radius: 10px;
          box-sizing: border-box;
          padding: 20px 30px;
        }

        .title {
          text-align: center;
          font-family: "Lucida Sans", "Lucida Sans Regular", "Lucida Grande",
              "Lucida Sans Unicode", Geneva, Verdana, sans-serif; /* Consider replacing with 'Inter' if not imported */
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
              "Lucida Sans Unicode", Geneva, Verdana, sans-serif; /* Consider replacing with 'Inter' if not imported */
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
        /* Removed .page-link, .page-link-label, .sign-up-label, .sign-up-link, .buttons-container, .apple-login-button, .google-login-button, .apple-icon, .google-icon as they are not needed for this page */
      `}</style>
    </SideLayout>
  );
};

export default ForgetPassword;