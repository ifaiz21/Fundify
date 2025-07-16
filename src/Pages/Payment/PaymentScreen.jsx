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
      // navigate("/donate") // Redirect back to donation screen
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
        const response = await fetch(`https://fundify-server.vercel.app/api/donations/${donationId}/status`, {
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
    <div className="payment-page flex flex-col min-h-screen bg-gray-50">
        <Header />
        <main className="flex-1 py-8 sm:py-12">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex flex-col lg:flex-row items-start gap-8 lg:gap-12">
                    {/* Left Column - Decorative Info */}
                    <div className=" lg:block w-full lg:w-4/12">
                       <div className="sticky top-28 space-y-6">
                         <div className="p-6 bg-white rounded-lg shadow-md border-l-4 border-fundify-green">
                             <div className="w-24 h-24 mx-auto mb-4">
                                 <img src="./Images/fundify-white-bg-logo.png" alt="Fundify Logo" className="w-full h-full object-contain" />
                             </div>
                             <h2 className="text-xl font-bold text-center text-gray-800">Secure Checkout</h2>
                             <p className="text-sm text-gray-600 text-center mt-2">
                                 Your payment is processed securely. We protect your personal information and ensure your privacy.
                             </p>
                         </div>

                         {/* Donation Impact Graphic */}
                         <div className="hidden md:block impact-card p-6 bg-[#A9BEA2] text-white rounded-lg shadow-md">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                            <h3 className="font-semibold text-center">Your Donation Matters</h3>
                            <p className="text-sm text-center text-gray-200 mt-1">Every contribution helps bring amazing ideas to life and supports communities in need.</p>
                         </div>
                          {/* UPDATED: Trust & Security Badges - Hidden on mobile */}
                         <div className="hidden bd:blocktrust-badges hidden lg:flex p-6 bg-white rounded-lg shadow-md">
                          <div className="badge-item">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-fundify-green" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                              <span>PCI Compliant</span>
                          </div>
                          <div className="badge-item">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-fundify-green" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                              <span>SSL Secured</span>
                         </div>
                         </div>
                       </div>
                    </div>

                    {/* Right Column - Payment Form */}
                    <div className="w-full lg:w-8/12">
                      <div className="bg-white p-6 sm:p-8 rounded-lg shadow-xl">
                        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800">Complete Your Payment</h2>

                        <form onSubmit={handleSubmit} className="space-y-8">
                            {/* Personal Details Section */}
                            <div className="form-section">
                                <h3 className="form-section-title">Personal Details</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="md:col-span-2">
                                        <label htmlFor="address" className="form-label">Address line</label>
                                        <input type="text" id="address" value={formData.address} onChange={handleInputChange} className="form-input" required />
                                    </div>
                                    <div>
                                        <label htmlFor="city" className="form-label">City</label>
                                        <input type="text" id="city" value={formData.city} onChange={handleInputChange} className="form-input" required />
                                    </div>
                                    <div>
                                        <label htmlFor="state" className="form-label">State / Province</label>
                                        <input type="text" id="state" value={formData.state} onChange={handleInputChange} className="form-input" required />
                                    </div>
                                    <div>
                                        <label htmlFor="postalCode" className="form-label">Postal code</label>
                                        <input type="text" id="postalCode" value={formData.postalCode} onChange={handleInputChange} className="form-input" required />
                                    </div>
                                </div>
                            </div>

                            {/* Payment Methods Section */}
                            <div className="form-section">
                                <h3 className="form-section-title">Payment Methods</h3>
                                <div className="flex flex-wrap gap-3">
                                    {["visa", "stripe", "mastercard", "JazzCash", "EasyPaisa"].map((method) => (
                                        <label key={method} className={`payment-method-label ${paymentMethod === method ? "active" : ""}`}>
                                            <input type="radio" name="paymentMethod" value={method} checked={paymentMethod === method} onChange={() => setPaymentMethod(method)} className="sr-only" />
                                            <img src={`/Images/${method}-logo.png`} alt={method} className="h-6 object-contain" onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.innerHTML += method; }} />
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Card Details Section */}
                            <div className="form-section">
                                <h3 className="form-section-title">Card Details</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label htmlFor="cardholderName" className="form-label">Cardholder's name</label>
                                        <input type="text" id="cardholderName" value={formData.cardholderName} onChange={handleInputChange} className="form-input" placeholder="Enter your name" required />
                                    </div>
                                    <div>
                                        <label htmlFor="cardNumber" className="form-label">Card number</label>
                                        <input type="text" id="cardNumber" value={formData.cardNumber} onChange={handleInputChange} className="form-input" placeholder="0000 0000 0000 0000" required />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="expiry" className="form-label">Expiry</label>
                                            <input type="text" id="expiry" value={formData.expiry} onChange={handleInputChange} className="form-input" placeholder="MM/YY" required />
                                        </div>
                                        <div>
                                            <label htmlFor="cvc" className="form-label">CVC</label>
                                            <input type="text" id="cvc" value={formData.cvc} onChange={handleInputChange} className="form-input" placeholder="123" required />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <button type="submit" className="action-button confirm-button w-full" disabled={isProcessing}>
                                {isProcessing ? "Processing..." : "Confirm Payment"}
                            </button>
                        </form>
                       </div>
                    </div>
                </div>
            </div>
        </main>

        {/* Payment Confirmation Modal */}
        {showConfirmation && (
            <div className="modal-overlay fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
                <div className="modal-card bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
                    <div className="p-6">
                        <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-fundify-green rounded-full">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">Confirm Payment</h3>
                        <p className="text-gray-600 text-center mb-6">Is your information correct?</p>
                        
                        <div className="bg-gray-50 p-4 rounded-md mb-6 text-sm space-y-2">
                            <div><span className="font-medium text-gray-700">Address:</span> {formData.address}, {formData.city}</div>
                            <div><span className="font-medium text-gray-700">Payment Method:</span> {paymentMethod.charAt(0).toUpperCase() + paymentMethod.slice(1)}</div>
                            <div><span className="font-medium text-gray-700">Card Number:</span> **** **** **** {formData.cardNumber.slice(-4)}</div>
                        </div>
                        
                        <div className="flex space-x-3">
                            <button onClick={handleCancelPayment} className="action-button cancel-button flex-1" disabled={isProcessing}>Cancel</button>
                            <button onClick={handleConfirmPayment} className="action-button confirm-button flex-1" disabled={isProcessing}>
                                {isProcessing ? "Processing..." : "Confirm"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )}
        <Footer />

        <style jsx global>{`
            /* --- Google Font Import --- */
            @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');

            /* --- General Styling & Variables --- */
            .payment-page {
                font-family: 'Poppins', sans-serif;
                --fundify-green: #4B5842;
                --fundify-light-green: #A9BEA2;
                --shadow-color: rgba(75, 88, 66, 0.1);
                --border-color: #d1d5db; /* gray-300 */
            }

            .form-section {
                padding-bottom: 2rem;
                border-bottom: 1px solid #f3f4f6; /* gray-100 */
            }
            form > .form-section:last-of-type {
                border-bottom: none;
                padding-bottom: 0;
            }

            .form-section-title {
                font-size: 1.125rem; /* text-lg */
                font-weight: 600; /* font-semibold */
                color: var(--fundify-green);
                margin-bottom: 1rem;
            }

            .form-label {
                display: block;
                font-size: 0.875rem;
                font-weight: 500;
                color: #4b5563; /* text-gray-600 */
                margin-bottom: 0.25rem;
            }
            
            .form-input {
                width: 100%;
                padding: 0.625rem 0.875rem;
                border: 1px solid var(--border-color);
                border-radius: 0.375rem;
                transition: all 0.2s ease-in-out;
            }
            .form-input:focus {
                outline: none;
                border-color: var(--fundify-green);
                box-shadow: 0 0 0 2px rgba(75, 88, 66, 0.2);
            }

            /* --- Payment Method Buttons --- */
            .payment-method-label {
                display: flex;
                align-items: center;
                justify-content: center;
                border: 1px solid var(--border-color);
                border-radius: 0.375rem;
                padding: 0.5rem;
                cursor: pointer;
                transition: all 0.2s ease-in-out;
                background-color: white;
                min-width: 80px;
            }
            .payment-method-label:hover {
                border-color: var(--fundify-light-green);
            }
            .payment-method-label.active {
                border-color: var(--fundify-green);
                background-color: #f0f3ef;
                box-shadow: 0 0 0 2px rgba(75, 88, 66, 0.2);
            }
            
            /* --- Action Buttons --- */
            .action-button {
                padding: 0.875rem 1rem;
                border-radius: 0.375rem;
                font-weight: 600;
                font-size: 1rem;
                transition: all 0.3s ease;
            }
            .action-button:disabled {
                opacity: 0.6;
                cursor: not-allowed;
            }
            .cancel-button {
                background-color: #e5e7eb;
                color: #4b5563;
            }
            .cancel-button:hover:not(:disabled) {
                background-color: #d1d5db;
            }
            .confirm-button {
                background-color: var(--fundify-green);
                color: white;
                box-shadow: 0 4px 12px var(--shadow-color);
            }
            .confirm-button:hover:not(:disabled) {
                background-color: #3A4433;
                transform: translateY(-2px);
                box-shadow: 0 7px 15px var(--shadow-color);
            }
            
            /* --- Left Column Graphics --- */
            .trust-badges {
                display: flex;
                justify-content: space-around;
                align-items: center;
            }
            .badge-item {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                font-size: 0.875rem;
                color: #4b5563;
                font-weight: 500;
            }
            .impact-card {
                transition: transform 0.3s ease, box-shadow 0.3s ease;
            }
            .impact-card:hover {
                transform: translateY(-5px);
                box-shadow: 0 10px 20px var(--shadow-color);
            }

            /* --- Modal Styling --- */
            .modal-overlay {
                animation: fade-in 0.3s ease-out forwards;
            }
            .modal-card {
                animation: slide-up 0.4s ease-out forwards;
            }
            @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
            @keyframes slide-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

        `}</style>
    </div>
);
};

export default PaymentPage;
