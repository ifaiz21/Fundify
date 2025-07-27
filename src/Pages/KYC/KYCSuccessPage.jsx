// src/Pages/KYC/KYCSuccessPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import HeaderLayout from '../Layout/HeaderLayout';
import FooterLayout from '../Layout/FooterLayout';

function KYCSuccessPage() {
  return (
    <>
      <HeaderLayout />
      <div className="flex flex-col items-center justify-center min-h-[80vh] bg-gray-50 p-4">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md w-full">
          <svg
            className="w-24 h-24 text-green-500 mx-auto mb-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">KYC Details Received!</h1>
          <p className="text-gray-600 mb-6">
            Your KYC details have been successfully received by FUNDIFY.
            Please allow (1-2 working days) for review and approval.
          </p>
          <Link
            to="/user-profile"
            className="bg-[#4A5D45] text-white py-3 px-6 rounded-md hover:bg-[#3A4433] transition-colors duration-300 ease-in-out text-lg font-semibold"
          >
            Go to User Profile
          </Link>
        </div>
      </div>
      <FooterLayout />
    </>
  );
}

export default KYCSuccessPage;