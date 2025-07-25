import React, {  useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CardNumberElement, CardCvcElement, CardExpiryElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { showSuccessMessage, showErrorMessage } from '../../utils/toast';
import Header from "../Layout/HeaderLayout";
import Footer from "../Layout/FooterLayout";

const StripePaymentScreen = () => {
    const navigate = useNavigate();
    const stripe = useStripe();
    const elements = useElements();
    
    // State from both files
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [formData, setFormData] = useState({
        address: "",
        city: "",
        state: "",
        postalCode: "",
        cardholderName: "",
    });
    const [errors, setErrors] = useState({});
    // Get user and donation details
    const { user } = useSelector((state) => state.user);
    const donationDetails = JSON.parse(sessionStorage.getItem('donationDetails'));

    useEffect(() => {
        if (!donationDetails) {
            showErrorMessage("Donation details not found. Please start again.");
            navigate('/donate');
        }
    }, [donationDetails, navigate]);
    
    const getAuthToken = () => localStorage.getItem('token');

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }));
        if (errors[id]) {
            setErrors(prev => ({ ...prev, [id]: null }));
        }
    };
    const validateForm = () => {
        const newErrors = {};
        
        // Cardholder Name Validation
        if (!formData.cardholderName.trim()) {
            newErrors.cardholderName = "Cardholder's name is required.";
        } else if (!/^[A-Za-z\s]+$/.test(formData.cardholderName)) {
            newErrors.cardholderName = "Name can only contain letters and spaces.";
        }

        // Billing Details Validation
        if (!formData.address.trim()) newErrors.address = "Address is required.";
        if (!formData.city.trim()) newErrors.city = "City is required.";
        if (!formData.state.trim()) newErrors.state = "State is required.";

        // Postal Code Validation
        if (!formData.postalCode.trim()) {
            newErrors.postalCode = "Postal code is required.";
        } else if (!/^\d{5}$/.test(formData.postalCode)) {
            newErrors.postalCode = "Please enter a valid 5-digit postal code.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const submitHandler = (e) => {
        e.preventDefault();
        if (validateForm()) {
            setShowConfirmation(true);
        } else {
            showErrorMessage("Please correct the errors in the form.");
        }
    };

    const handleConfirmPayment = async () => {
        setIsProcessing(true);
        payBtn.current.disabled = true;

        if (!stripe || !elements || !donationDetails) {
            setIsProcessing(false);
            payBtn.current.disabled = false;
            return;
        }

        try {
            const token = getAuthToken();
            if (!token) {
                showErrorMessage("Please log in to continue.");
                setIsProcessing(false);
                payBtn.current.disabled = false;
                navigate('/login');
                return;
            }

            // 1. Create Payment Intent
            const paymentData = { amount: donationDetails.amount };
            const API_URL = process.env.REACT_APP_API_URL;
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            };
            const { data } = await axios.post(`${API_URL}/api/payment/process`, paymentData, config);
            const client_secret = data.client_secret;

            // 2. Confirm Card Payment with Stripe
            const paymentResult = await stripe.confirmCardPayment(client_secret, {
                payment_method: {
                    card: elements.getElement(CardNumberElement),
                    billing_details: {
                        name: formData.cardholderName,
                        email: user.email,
                        address: {
                            line1: formData.address,
                            city: formData.city,
                            state: formData.state,
                            postal_code: formData.postalCode,
                        },
                    },
                },
            });

            if (paymentResult.error) {
                showErrorMessage(paymentResult.error.message);
                throw new Error(paymentResult.error.message);
            }

            // 3. If Payment Succeeded, Save Donation to Your Database
            if (paymentResult.paymentIntent.status === 'succeeded') {
                const donationDataForDB = {
                    amount: donationDetails.amount,
                    frequency: donationDetails.frequency,
                    donationType: donationDetails.donationType,
                    campaignId: donationDetails.campaignId, // Campaign ID is included here
                    paymentInfo: {
                        id: paymentResult.paymentIntent.id,
                        status: paymentResult.paymentIntent.status,
                    },
                };

                // Use axios to post to your original donations endpoint
                await axios.post(`${API_URL}/api/donations`, donationDataForDB, config);

                showSuccessMessage('Payment Successful & Donation Recorded!');
                sessionStorage.removeItem('donationDetails');
                navigate('/submit-2');
            }
        } catch (error) {
            setIsProcessing(false);
            payBtn.current.disabled = false;
            const errorMessage = error.response ? error.response.data.message : "An error occurred during payment.";
            showErrorMessage(errorMessage);
        }
    };
    
    // For the submit button ref
    const payBtn = useRef(null);

    return (
        <div className="payment-page flex flex-col min-h-screen bg-gray-50">
            <Header />
            <main className="flex-1 py-8 sm:py-12">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="flex flex-col lg:flex-row items-start gap-8 lg:gap-12">
                        {/* Left Column from old page */}
                        <div className="lg:block w-full lg:w-4/12">
                            <div className="sticky top-28 space-y-6">
                                {/* ... Your info boxes and graphics ... */}
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
                         <div className="hidden bd:blocktrust-badges lg:flex p-6 bg-white rounded-lg shadow-md">
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

                        {/* Right Column with merged form */}
                        <div className="w-full lg:w-8/12">
                            <div className="bg-white p-6 sm:p-8 rounded-lg shadow-xl">
                                <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800">Complete Your Payment</h2>
                                <form onSubmit={submitHandler} className="space-y-8">
                                    {/* Personal Details Section */}
                                    <div className="form-section">
                                        <h3 className="form-section-title">Billing Details</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="md:col-span-2">
                                                <label htmlFor="address" className="form-label">Address line</label>
                                                <input type="text" id="address" value={formData.address} onChange={handleInputChange} className={`form-input ${errors.address ? 'border-red-500' : ''}`} />
                                                {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                                            </div>
                                            <div>
                                                <label htmlFor="city" className="form-label">City</label>
                                                <input type="text" id="city" value={formData.city} onChange={handleInputChange} className={`form-input ${errors.city ? 'border-red-500' : ''}`} />
                                                {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                                            </div>
                                            <div>
                                                <label htmlFor="state" className="form-label">State / Province</label>
                                                <input type="text" id="state" value={formData.state} onChange={handleInputChange} className={`form-input ${errors.state ? 'border-red-500' : ''}`} />
                                                {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}                                            </div>
                                            <div>
                                                <label htmlFor="postalCode" className="form-label">Postal code</label>
                                                <input type="text" id="postalCode" value={formData.postalCode} onChange={handleInputChange} className={`form-input ${errors.postalCode ? 'border-red-500' : ''}`} />
                                                {errors.postalCode && <p className="text-red-500 text-xs mt-1">{errors.postalCode}</p>}                                            </div>
                                            </div>
                                    </div>
                                    
                                    {/* Card Details Section with Stripe Elements */}
                                    <div className="form-section">
                                        <h3 className="form-section-title">Card Details</h3>
                                        <div className="space-y-4">
                                            <div>
                                                <label htmlFor="cardholderName" className="form-label">Cardholder's name</label>
                                                <input type="text" id="cardholderName" value={formData.cardholderName} onChange={handleInputChange} className={`form-input ${errors.cardholderName ? 'border-red-500' : ''}`} placeholder="Enter your name" />
                                                {errors.cardholderName && <p className="text-red-500 text-xs mt-1">{errors.cardholderName}</p>}                                            </div>
                                            {/* Stripe Card Number */}
                                            <div>
                                                <label className="form-label">Card number</label>
                                                <div className="form-input"><CardNumberElement /></div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                {/* Stripe Expiry */}
                                                <div>
                                                    <label className="form-label">Expiry</label>
                                                    <div className="form-input"><CardExpiryElement /></div>
                                                </div>
                                                {/* Stripe CVC */}
                                                <div>
                                                    <label className="form-label">CVC</label>
                                                    <div className="form-input"><CardCvcElement /></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <button ref={payBtn} type="submit" className="action-button confirm-button w-full" disabled={isProcessing}>
                                        Pay PKR {donationDetails ? donationDetails.amount.toLocaleString() : '0'}
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
                            <h3 className="text-lg font-semibold text-gray-900 text-center mb-6">Confirm Payment Details</h3>
                            <div className="flex space-x-3">
                                <button onClick={() => setShowConfirmation(false)} className="action-button cancel-button flex-1" disabled={isProcessing}>Edit</button>
                                <button onClick={handleConfirmPayment} className="action-button confirm-button flex-1" disabled={isProcessing}>
                                    {isProcessing ? "Processing..." : "Confirm & Pay"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <Footer />
            {/* Add your CSS styles from the old component here */}
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

export default StripePaymentScreen;