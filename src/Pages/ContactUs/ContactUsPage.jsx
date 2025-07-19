"use client"

import { useState } from "react"
import Header from "../Layout/HeaderLayout" // This will now receive profile pic from context
import Footer from "../Layout/FooterLayout"
import { showSuccessMessage, showErrorMessage } from '../../utils/toast'; // Import toast functions

// Simple SVG Icons for better consistency
const EmailIcon = () => (
  <svg className="w-6 h-6 text-[#4A5D45]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
);

const PhoneIcon = () => (
  <svg className="w-6 h-6 text-[#4A5D45]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
);


const ContactUsPage = () => {
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
    if (!formData.name || !formData.email || !formData.issue || !formData.subject || !formData.message) {
      showErrorMessage("Please fill all required fields.");
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
        showSuccessMessage("Your support request has been submitted successfully! We'll get back to you soon. ✅");
        setFormData({
          name: "",
          email: "",
          issue: "",
          subject: "",
          message: "",
        });
      } else {
        const errorData = await response.json();
        showErrorMessage(`Failed to submit request: ${errorData.message || "Unknown error"}`);
        console.error("Submission failed:", errorData);
      }
    } catch (error) {
      showErrorMessage("An error occurred during submission. Please try again. 😥");
      console.error("Submission error:", error);
    }
  }

  const handleCancelSubmit = () => {
    setShowSubmitConfirmation(false)
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#F0FFF0]">
      <Header hideContact={true}/>

      <main className="flex-1 py-12 md:py-16">
        <div className="container mx-auto px-4 md:px-6">
          <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center text-[#4A5D45]">Need Help? Contact Fundify Support</h1>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-start">
            {/* Left Column - Illustration and Contact Info (Takes 2/5 width on large screens) */}
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white p-4 rounded-lg shadow-lg">
                <img src="/Images/cus-sup.jpg" alt="Customer Support" className="max-w-full h-auto rounded-md" />
              </div>

              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-bold mb-4 text-[#4A5D45]">Fundify Support Channels</h2>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="bg-[#E6F0E4] rounded-full p-3">
                      <EmailIcon />
                    </div>
                    <div>
                      <p className="font-semibold text-[#4A5D45]">Support Email</p>
                      <a href="mailto:support@fundify.com" className="text-sm text-gray-600 hover:text-[#4B5842] transition-colors">support@fundify.com</a>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="bg-[#E6F0E4] rounded-full p-3">
                      <PhoneIcon />
                    </div>
                    <div>
                      <p className="font-semibold text-[#4A5D45]">Helpline</p>
                      <p className="text-sm text-gray-600">+92 300 1234567</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Contact Form (Takes 3/5 width on large screens) */}
            <div className="lg:col-span-3 bg-white p-6 sm:p-8 rounded-lg shadow-lg">
              <h2 className="text-2xl text-center font-bold mb-6 text-[#4A5D45]">CONTACT US 📝</h2>
              <form onSubmit={handleSubmitRequest} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="John Doe"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4B5842] focus:border-transparent transition"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      E-mail<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="you@example.com"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4B5842] focus:border-transparent transition"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="issue" className="block text-sm font-medium text-gray-700 mb-1">
                    Select Your Issue<span className="text-red-500">*</span>
                  </label>
                  <select
                    id="issue"
                    value={formData.issue}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4B5842] focus:border-transparent bg-white transition"
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

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                    Subject<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    placeholder="e.g., Issue with my recent contribution"
                    maxLength={96}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4B5842] focus:border-transparent transition"
                    required
                  />
                  <p className="text-xs text-gray-500 text-right mt-1">{formData.subject.length}/96</p>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Message<span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Please describe your issue in detail here..."
                    rows="4"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4B5842] focus:border-transparent transition"
                    required
                  ></textarea>
                </div>

                <div className="text-center pt-2">
                  <button
                    type="submit"
                    className="w-full sm:w-auto bg-[#4B5842] text-white px-8 py-3 rounded-md hover:bg-[#3A4433] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4B5842] font-semibold transition-transform transform hover:scale-105"
                  >
                    Submit Request
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>

      {/* Submit Confirmation Modal */}
      {showSubmitConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl max-w-sm w-full mx-auto">
            <div className="p-6 text-center">
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-5 bg-green-100 rounded-full">
                   <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Confirm Submission</h3>
              <p className="text-gray-600 mb-6">
                Please review your information. Are you sure everything is correct?
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={handleCancelSubmit}
                  className="w-full px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmSubmit}
                  className="w-full px-4 py-2 text-white bg-[#4B5842] rounded-md hover:bg-[#3A4433] transition-colors font-semibold"
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