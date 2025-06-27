// src/Pages/ContactUs/ContactUsPage.jsx
"use client"

import { useState } from "react"
import Header from "../Layout/HeaderLayout" // This will now receive profile pic from context
import Footer from "../Layout/FooterLayout"
//import { useNavigate } from "react-router-dom"
import { showSuccessMessage, showErrorMessage } from '../../utils/toast'; // Import toast functions

const ContactUsPage = () => { // Removed showToast prop
  //const navigate = useNavigate()
  const [showSubmitConfirmation, setShowSubmitConfirmation] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    issue: "",
    subject: "",
    message: "",
  })

  const handleInputChange = (e) => {
    const { id, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }))
  }

  const handleSubmitRequest = (event) => {
    event.preventDefault()
    // Validation here using showErrorMessage instead of showToast
    if (!formData.name || !formData.email || !formData.issue || !formData.subject || !formData.message) {
        showErrorMessage("Please fill all required fields."); // Replaced showToast
        return;
    }
    setShowSubmitConfirmation(true)
  }

  const handleConfirmSubmit = async () => {
    setShowSubmitConfirmation(false)
    console.log("Submitting support request to backend:", formData)

    try {
      const response = await fetch('https://server-fundify.up.railway.app/api/contactus', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        showSuccessMessage("Your support request has been submitted successfully!"); // Replaced showToast
        // Clear the form after successful submission
        setFormData({
          name: "",
          email: "",
          issue: "",
          subject: "",
          message: "",
        });
        // navigate("/Submitted"); // Optional: Navigate to success page. Commented out if toast is main feedback
      } else {
        const errorData = await response.json();
        showErrorMessage(`Failed to submit request: ${errorData.message || "Unknown error"}`); // Replaced showToast
        console.error("Submission failed:", errorData);
      }
    } catch (error) {
      showErrorMessage("An error occurred during submission. Please try again."); // Replaced showToast
      console.error("Submission error:", error);
    }
  }

  const handleCancelSubmit = () => {
    setShowSubmitConfirmation(false)
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header hideContact={true}/>

      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 md:px-6">
          <h1 className="text-2xl font-bold mb-8 text-center text-[#4A5D45]">Need Help? Contact Fundify Support</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column - Illustration and Contact Info */}
            <div>
              <div className="mb-6">
                <img src="/Images/contact-support.png" alt="Customer Support" className="max-w-full h-auto" />
              </div>

              <div className="bg-[#A9BEA2] p-4 rounded-md">
                <h2 className="text-lg font-semibold mb-4">Fundify Support</h2>

                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="bg-gray-300 rounded-full p-2 mr-3">📧</div>
                    <div>
                      <p className="text-sm text-[#4A5D45]">Support Email</p>
                      <p className="text-sm">support@fundify.com</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="bg-gray-300 rounded-full p-2 mr-3">📞</div>
                    <div>
                      <p className="text-sm text-[#4A5D45]">Helpline</p>
                      <p className="text-sm">+92 300 1234567</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Contact Form */}
            <div className="bg-[#A9BEA2] p-6 rounded-md">
              <h2 className="text-center font-semibold mb-4 text-[#000000]">CONTACT US</h2>

              <form onSubmit={handleSubmitRequest}>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="name" className="block text-sm text-[#000000] mb-1">
                      Full Name<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="John Doe"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#4B5842]"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm text-[#000000] mb-1">
                      E-mail<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="you@example.com"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#4B5842]"
                      required
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label htmlFor="issue" className="block text-sm text-[#000000] mb-1">
                    Select Your Issue<span className="text-red-500">*</span>
                  </label>
                  <select
                    id="issue"
                    value={formData.issue}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#4B5842] bg-white"
                    required
                  >
                    <option value="">Choose an option</option>
                    <option value="backing a project">Backing a project</option>
                    <option value="campaign">Campaign support</option>
                    <option value="general question">General question</option>
                    <option value="payout">Payout issue</option>
                    <option value="reporting a bug">Reporting a bug</option>
                    <option value="technical">Technical problem</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label htmlFor="subject" className="block text-sm text-[#000000] mb-1">
                    Subject<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    placeholder=""
                    maxLength={96}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#4B5842]"
                    required
                  />
                  <p className="text-xs text-gray-600 text-right">{formData.subject.length}/96</p>
                </div>

                <div className="mb-4">
                  <label htmlFor="message" className="block text-sm text-[#000000] mb-1">
                    Message<span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Describe your issue..."
                    rows="2"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#4B5842]"
                    required
                  ></textarea>
                </div>

                <div className="text-center">
                  <button
                    type="submit"
                    className="bg-[#4B5842] text-white px-6 py-2 rounded-md hover:bg-[#3A4433] transition-colors"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>

      {/* Submit Confirmation Modal */}
      {showSubmitConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-[#4B5842] rounded-full">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">Submit Contact Form</h3>

              <p className="text-gray-600 text-center mb-6">
                Are you sure you want to submit your details correctly? Please review your information before
                submitting.
              </p>

              <div className="flex space-x-3">
                <button
                  onClick={handleCancelSubmit}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmSubmit}
                  className="flex-1 px-4 py-2 text-white bg-[#4B5842] rounded-md hover:bg-[#3A4433] transition-colors"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}

export default ContactUsPage;