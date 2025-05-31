import React, { useState } from "react";
import SideLayout from "../Layout/SideLayout";
import { IoChevronBackOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

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
          <button onClick={() => navigate("/Login")}
            className="text-lg text-[#91ac8f] hover:text-[#667964] ease-in-out transition duration-300 mb-4 flex flex-row items-center font-semibold">
            <IoChevronBackOutline size={20} /> Back
          </button>
        </div>
        <div className="flex h-full">
          <div className="w-full flex items-center justify-center">
            <div className="w-3/5 p-8 rounded-md">
              <div className="text-center">
              <h2 className="text-3xl font-bold mb-2">Forgot Your Password?</h2>
              <p className="text-md text-gray-500 mb-6">
                Thats okay! We will help you reset your password
              </p>
              </div>
              <p className="text-lg text-gray-500 mb-10">
                Enter your Email below to get started with recovering your account 
              </p>
              <form className="space-y-4" onSubmit={handleContinue}>
                <div className="space-y-2 text-[#696f79]">
                  <label htmlFor="email" className="font-semibold">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="Email address"
                    className="w-full p-4 border rounded mb-4 border-[#8692a6] outline-none"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#91ac8f] text-white p-3 rounded hover:bg-[#667964] ease-in-out transition duration-300 font-semibold text-md"
                >
                  Continue
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </SideLayout>
  );
};

export default ForgetPassword;
