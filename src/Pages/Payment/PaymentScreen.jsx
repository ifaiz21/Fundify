// src/Pages/Payment/PaymentScreen.jsx
"use client"

import { useState, useEffect } from "react" // Added useEffect
import Footer from "../Layout/FooterLayout"
import Header from "../Layout/HeaderLayout"
import { useNavigate, useLocation } from "react-router-dom" // Added useLocation
import { showSuccessMessage, showErrorMessage } from '../../utils/toast'; // Import toast functions

const PaymentPage = () => {
  const navigate = useNavigate()
  const location = useLocation() // Initialize useLocation
  const [paymentMethod, setPaymentMethod] = useState("visa")
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false) // New state for loading
  const [donationId, setDonationId] = useState(null) // State to store donation ID

  const [formData, setFormData] = useState({
    address: "",
    city: "",
    state: "",
    postalCode: "",
    cardholderName: "",
    cardNumber: "",
    expiry: "",
    cvc: "",
  })

  useEffect(() => {
    // Retrieve donationId from location state
    if (location.state && location.state.donationId) {
      setDonationId(location.state.donationId)
      console.log("PaymentPage received donation ID:", location.state.donationId)
    } else {
      // Handle case where donationId is not present (e.g., direct access or error)
      showErrorMessage("Donation ID not found. Please start a new donation.") // Replaced alert
      navigate("/donate") // Redirect back to donation screen
    }
  }, [location.state, navigate]) // Added navigate to dependency array

  const handleInputChange = (e) => {
    const { id, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }))
  }

  const getAuthToken = () => {
    return localStorage.getItem('token');
  };

  const handleSubmit = (e) => {
    e.preventDefault()
    // Basic validation before showing confirmation
    if (!formData.address || !formData.city || !formData.cardholderName || !formData.cardNumber) {
      showErrorMessage("Please fill in all required payment details."); // Replaced alert
      return;
    }
    setShowConfirmation(true)
  }

  const handleConfirmPayment = async () => {
    setShowConfirmation(false)
    setIsProcessing(true) // Set loading to true

    if (!donationId) {
      showErrorMessage("Cannot process payment: Donation ID is missing."); // Replaced alert
      setIsProcessing(false);
      navigate("/donate"); // Redirect if ID is missing
      return;
    }

    const token = getAuthToken();
    if (!token) {
      showErrorMessage("Authentication token missing. Please log in again."); // Replaced alert
      setIsProcessing(false);
      navigate("/login");
      return;
    }

    // Simulate payment processing delay
    await new Promise(resolve => setTimeout(resolve, 2000)); // 2 second delay

    try {
        // Call backend to update donation status to 'completed'
        const response = await fetch(`https://server-fundify.up.railway.app/api/donations/${donationId}/status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ status: 'completed', transactionId: `txn_${Date.now()}` }) // Dummy transaction ID
        });

        if (response.ok) {
            showSuccessMessage("Payment successful! Thank you for your donation."); // Replaced alert
            console.log("Donation status updated to completed.");
            // Redirect to Explore Campaigns or a success page
            navigate("/explore");
        } else {
            const errorData = await response.json();
            showErrorMessage(`Payment failed to confirm: ${errorData.message}`); // Replaced alert
            console.error("Failed to update donation status:", errorData);
            navigate("/donate"); // Redirect back to donation page on failure
        }
    } catch (error) {
        showErrorMessage("An error occurred during payment confirmation."); // Replaced alert
        console.error("Payment confirmation error:", error);
        navigate("/donate"); // Redirect back to donation page on error
    } finally {
        setIsProcessing(false); // Reset loading state
    }
  }

  const handleCancelPayment = () => {
    setShowConfirmation(false)
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Left Column - Logo */}
            <div className="flex flex-col items-center ">
              <div className="w-64 h-64 mb-6">
                <img src="./Images/fundify-white-bg-logo.png" alt="Fundify Logo" className="w-full h-64" />
              </div>
            </div>

            {/* Right Column - Payment Form */}
            <div>
              <h2 className="text-xl font-bold mb-6">Complete registration payment</h2>

              <form onSubmit={handleSubmit}>
                {/* Personal Details Section */}
                <div className="mb-8">
                  <h3 className="text-md font-semibold mb-4">Personal details</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label htmlFor="address" className="block text-sm mb-1">
                        Address line
                      </label>
                      <input
                        type="text"
                        id="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#4B5842]"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="city" className="block text-sm mb-1">
                        City
                      </label>
                      <input
                        type="text"
                        id="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#4B5842]"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="state" className="block text-sm mb-1">
                        State
                      </label>
                      <input
                        type="text"
                        id="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#4B5842]"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="postalCode" className="block text-sm mb-1">
                        Postal code
                      </label>
                      <input
                        type="text"
                        id="postalCode"
                        value={formData.postalCode}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#4B5842]"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Payment Methods Section */}
                <div className="mb-8">
                  <h3 className="text-md font-semibold mb-4">Payment methods</h3>

                  <div className="flex flex-wrap gap-3">
                    {["visa", "stripe", "mastercard", "JazzCash", "EasyPaisa"].map((method) => (
                      <label
                        key={method}
                        className={`flex items-center justify-center border rounded-md p-2 cursor-pointer ${
                          paymentMethod === method ? "border-[#4B5842] bg-gray-50" : "border-gray-300"
                        }`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={method}
                          checked={paymentMethod === method}
                          onChange={() => setPaymentMethod(method)}
                          className="sr-only"
                        />
                        <img src={`/Images/${method}-logo.png`} alt={method} className="h-6" />
                      </label>
                    ))}
                  </div>
                </div>

                {/* Card Details Section */}
                <div className="mb-8">
                  <h3 className="text-md font-semibold mb-4">Card details</h3>

                  <div className="space-y-4">
                    <div>
                      <label htmlFor="cardholderName" className="block text-sm mb-1">
                        Cardholder's name
                      </label>
                      <input
                        type="text"
                        id="cardholderName"
                        value={formData.cardholderName}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#4B5842]"
                        placeholder="Enter your name"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="cardNumber" className="block text-sm mb-1">
                        Card number
                      </label>
                      <input
                        type="text"
                        id="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#4B5842]"
                        placeholder="Enter your card number"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="expiry" className="block text-sm mb-1">
                          Expiry
                        </label>
                        <input
                          type="text"
                          id="expiry"
                          value={formData.expiry}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#4B5842]"
                          placeholder="MM/YY"
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor="cvc" className="block text-sm mb-1">
                          CVC
                        </label>
                        <input
                          type="text"
                          id="cvc"
                          value={formData.cvc}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#4B5842]"
                          placeholder="123"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#4B5842] text-white py-3 rounded-md hover:bg-[#3A4433] transition-colors"
                  disabled={isProcessing} // Disable button while processing
                >
                  {isProcessing ? "Processing Payment..." : "Confirm Payment"}
                </button>
              </form>

              <div className="mt-8 text-xs text-gray-500 text-center">
                © 2023. All rights reserved. Prod. by Fundify.com
                <div className="flex justify-center space-x-4 mt-2">
                  <a href="/installation" className="hover:underline">
                    Installation
                  </a>
                  <a href="/license" className="hover:underline">
                    License
                  </a>
                  <a href="/terms-of-use" className="hover:underline">
                    Terms of Use
                  </a>
                  <a href="/privacy-policy" className="hover:underline">
                    Privacy
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Payment Confirmation Modal */}
      {showConfirmation && (
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

              <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">Confirm Payment</h3>

              <p className="text-gray-600 text-center mb-6">Is your information correct?</p>

              {/* Summary of entered information */}
              <div className="bg-gray-50 p-4 rounded-md mb-6 text-sm">
                <div className="space-y-2">
                  <div>
                    <span className="font-medium">Address:</span> {formData.address}
                  </div>
                  <div>
                    <span className="font-medium">City:</span> {formData.city}, {formData.state} {formData.postalCode}
                  </div>
                  <div>
                    <span className="font-medium">Payment Method:</span> {paymentMethod.toUpperCase()}
                  </div>
                  <div>
                    <span className="font-medium">Cardholder:</span> {formData.cardholderName}
                  </div>
                  <div>
                    <span className="font-medium">Card Number:</span> ****{formData.cardNumber.slice(-4)}
                  </div>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={handleCancelPayment}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 transition-colors"
                  disabled={isProcessing}
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmPayment}
                  className="flex-1 px-4 py-2 text-white bg-[#4B5842] rounded-md hover:bg-[#3A4433] transition-colors"
                  disabled={isProcessing}
                >
                  {isProcessing ? "Processing..." : "Confirm Payment"}
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

export default PaymentPage;