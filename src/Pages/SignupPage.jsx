import React, { useState } from "react";
import SideLayout from "./Layout/SideLayout";
import { IoChevronBackOutline } from "react-icons/io5";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import axios from "axios"; 

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleContinue = async (e) => {
    e.preventDefault();

    if (formData.password.length < 6) {
      alert("Password must be at least 6 characters long.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      // Replace URL with your actual backend signup route
      const response = await axios.post("http://localhost:5000/api/auth/sign-up", {
        name: formData.fullName,
        email: formData.email,
        password: formData.password,
        role: "user" ,
      });

      alert(response.data.message);  // e.g. "Verification code sent to email"
      // Navigate to your verification page and pass email if needed
      navigate("/code-verification", { state: { email: formData.email } });
    } catch (error) {
      alert(error.response?.data?.message || "Signup failed. Try again.");
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
            <h2 className="text-3xl font-bold mb-2">Account Signup</h2>
            <p className="text-md text-gray-500 mb-6">
              Become a Member and enjoy exclusive promotions.
            </p>

            <form className="space-y-4" onSubmit={handleContinue}>
              <div className="space-y-2 text-[#696f79]">
                <label htmlFor="fullName" className="font-semibold">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter your Full Name"
                  className="w-full p-4 border rounded border-[#8692a6] outline-none"
                  required
                />
              </div>

              <div className="space-y-2 text-[#696f79]">
                <label htmlFor="email" className="font-semibold">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email address"
                  className="w-full p-4 border rounded border-[#8692a6] outline-none"
                  required
                />
              </div>

              <div className="space-y-2 text-[#696f79]">
                <label htmlFor="password" className="font-semibold">
                  Password
                </label>
                <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  className="w-full p-4 border rounded border-[#8692a6] outline-none"
                  required
                  minLength={6}
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
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm Password"
                  className="w-full p-4 border rounded border-[#8692a6] outline-none"
                  required
                  minLength={6}
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
              </div>
              
              <button
                type="submit"
                className="w-full bg-[#91ac8f] text-white p-3 rounded hover:bg-[#667964] transition duration-300 font-semibold text-md"
              >
                Continue
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

            <div className="flex justify-center mt-4">
              <button className="mx-2">
                <img
                  src="/Images/google-icon.png"
                  alt="Google"
                  className="w-10 h-10"
                />
              </button>
              <button className="mx-2">
                <img
                  src="/Images/facebook-icon.png"
                  alt="Facebook"
                  className="w-10 h-10"
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </SideLayout>
  );
};

export default SignupPage;
