// src/Pages/DonationScreen.jsx
"use client"

import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "./Layout/HeaderLayout";
import Footer from "./Layout/FooterLayout";
import { showSuccessMessage, showErrorMessage } from '../utils/toast'; // Adjust path based on where you saved toast.js

const DonationScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [donationAmount, setDonationAmount] = useState(25);
  const [isCustomAmount, setIsCustomAmount] = useState(false);
  const [donationFrequency, setDonationFrequency] = useState("one-time");
  //const [honorOf, setHonorOf] = useState("");
  const [donationType, setDonationType] = useState("General donation");
  const [campaignId, setCampaignId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (location.state && location.state.campaignId) {
      setCampaignId(location.state.campaignId);
      setDonationType("Project specific");
      console.log("DonationScreen received campaign ID:", location.state.campaignId);
    }
  }, [location.state]);

  const getAuthToken = () => {
    return localStorage.getItem('token');
  };

  const handleDonate = async () => {
    setIsLoading(true);
    const token = getAuthToken();

    if (!token) {
      showErrorMessage("Please log in to make a donation."); // Replaced alert
      navigate("/login");
      setIsLoading(false);
      return;
    }

    if (donationAmount <= 0 || donationAmount === "") {
      showErrorMessage("Please enter a valid donation amount."); // Replaced alert
      setIsLoading(false);
      return;
    }

    const donationData = {
      amount: Number(donationAmount),
      frequency: donationFrequency,
      //honorOf: honorOf,
      donationType: donationType,
      campaignId: campaignId,
    };

    console.log("Attempting to send donation:", donationData);

    try {
      const response = await fetch('https://fundify-server.vercel.app/api/donations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(donationData),
      });

      if (response.ok) {
        const result = await response.json();
        showSuccessMessage("Donation initiated successfully! Redirecting to payment."); // Replaced alert
        console.log("Donation response:", result);
        navigate("/payment", { state: { donationId: result.donation._id } });
      } else {
        const errorData = await response.json();
        showErrorMessage(`Donation failed: ${errorData.message}`); // Replaced alert
        console.error("Donation submission error:", errorData);
      }
    } catch (error) {
      showErrorMessage("An error occurred during donation processing."); // Replaced alert
      console.error("Network or unexpected error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="donation-page flex flex-col min-h-screen bg-gray-50">
        <Header hideDonate={true} />

        <main className="flex-1 py-8 sm:py-12">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">

                    {/* Left Column - Hero Image */}
                    <div className="hero-column w-full lg:w-5/12">
                        <div className="relative rounded-lg overflow-hidden shadow-lg">
                            <img
                                src="./Images/donation-screen-img.jpeg"
                                alt="We Can Save The Future"
                                className="w-full h-96 lg:h-full object-cover brightness-50"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#4A5D45] via-transparent to-transparent opacity-80"></div>
                            <div className="absolute bottom-0 left-0 p-6 sm:p-8">
                                <h2 className="text-white text-4xl sm:text-5xl font-bold leading-tight">
                                    We Can <br />
                                    Save The <br />
                                    Future
                                </h2>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Donation Form */}
                    <div className="form-column w-full lg:w-7/12">
                        <div className="bg-white p-6 sm:p-8 rounded-lg shadow-xl">
                            <div className="text-center lg:text-left mb-6">
                                <h3 className="text-2xl sm:text-3xl font-bold text-gray-800">Make a Donation</h3>
                                <p className="text-gray-600 mt-1">Your support helps us create a better world. Every contribution is a blessing.</p>
                            </div>

                            <form className="space-y-6">
                                <div>
                                    <label className="form-label">Choose a donation type</label>
                                    <select
                                        className="form-input"
                                        value={donationType}
                                        onChange={(e) => setDonationType(e.target.value)}
                                    >
                                        <option>General Donation</option>
                                        <option>Project Specific</option>
                                        <option>Emergency Relief</option>
                                        <option>Education Purpose</option>
                                        <option>Flood Relief</option>
                                        <option>Other</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="form-label">Choose a donation amount (PKR)</label>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                        {[2500, 5000, 10000].map((amount) => (
                                            <button
                                                key={amount}
                                                type="button"
                                                onClick={() => {
                                                    setDonationAmount(amount);
                                                    setIsCustomAmount(false);
                                                }}
                                                className={`amount-button ${donationAmount === amount && !isCustomAmount ? "active" : ""}`}
                                            >
                                                {amount.toLocaleString()}
                                            </button>
                                        ))}
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setIsCustomAmount(true);
                                                setDonationAmount("");
                                            }}
                                            className={`amount-button ${isCustomAmount ? "active" : ""}`}
                                        >
                                            Other
                                        </button>
                                    </div>
                                    {isCustomAmount && (
                                        <input
                                            type="number"
                                            min="1"
                                            value={donationAmount}
                                            onChange={(e) => setDonationAmount(e.target.value === "" ? "" : parseInt(e.target.value))}
                                            className="form-input mt-3"
                                            placeholder="Enter your amount"
                                            required
                                        />
                                    )}
                                </div>

                                <div>
                                    <label className="form-label">Choose donation frequency</label>
                                    <div className="frequency-toggle">
                                        <label className={donationFrequency === 'one-time' ? 'active' : ''}>
                                            <input type="radio" name="frequency" value="one-time" checked={donationFrequency === 'one-time'} onChange={() => setDonationFrequency('one-time')} />
                                            One-time
                                        </label>
                                        <label className={donationFrequency === 'monthly' ? 'active' : ''}>
                                            <input type="radio" name="frequency" value="monthly" checked={donationFrequency === 'monthly'} onChange={() => setDonationFrequency('monthly')} />
                                            Monthly
                                        </label>
                                    </div>
                                </div>

                                <div className="pt-4 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                                    <button onClick={() => navigate("/")} type="button" className="action-button cancel-button" disabled={isLoading}>
                                        Cancel
                                    </button>
                                    <button onClick={handleDonate} type="button" className="action-button checkout-button" disabled={isLoading}>
                                        {isLoading ? "Processing..." : "Go to Checkout"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </main>

        <Footer />
        <style jsx global>{`
            /* --- Google Font Import --- */
            @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');

            /* --- General Styling & Variables --- */
            .donation-page {
                font-family: 'Poppins', sans-serif;
                --fundify-green: #4B5842;
                --fundify-light-green: #A9BEA2;
                --shadow-color: rgba(75, 88, 66, 0.1);
                --border-color: #d1d5db; /* gray-300 */
            }

            .hero-column h2 {
                text-shadow: 2px 2px 10px rgba(0,0,0,0.5);
            }
            
            .form-column h3, .form-column p {
                letter-spacing: -0.01em;
            }
            
            .form-label {
                display: block;
                font-size: 0.875rem; /* text-sm */
                font-weight: 500; /* font-medium */
                color: #374151; /* text-gray-700 */
                margin-bottom: 0.5rem;
            }
            
            .form-input {
                width: 100%;
                padding: 0.75rem 1rem;
                border: 1px solid var(--border-color);
                border-radius: 0.375rem; /* rounded-md */
                transition: all 0.2s ease-in-out;
            }
            .form-input:focus {
                outline: none;
                border-color: var(--fundify-green);
                box-shadow: 0 0 0 2px rgba(75, 88, 66, 0.2);
            }

            /* --- Amount Buttons --- */
            .amount-button {
                padding: 0.75rem 1rem;
                border: 1px solid var(--border-color);
                border-radius: 0.375rem;
                font-weight: 500;
                transition: all 0.2s ease-in-out;
            }
            .amount-button:hover {
                border-color: var(--fundify-light-green);
                background-color: #f9fafb; /* bg-gray-50 */
            }
            .amount-button.active {
                background-color: var(--fundify-green);
                color: white;
                border-color: var(--fundify-green);
            }

            /* --- Frequency Toggle --- */
            .frequency-toggle {
                display: flex;
                border: 1px solid var(--border-color);
                border-radius: 0.375rem;
                overflow: hidden;
            }
            .frequency-toggle label {
                flex: 1;
                padding: 0.75rem;
                text-align: center;
                cursor: pointer;
                background-color: white;
                font-weight: 500;
                color: #4b5563; /* text-gray-600 */
                transition: background-color 0.2s ease-in-out;
            }
            .frequency-toggle label:not(:last-child) {
                border-right: 1px solid var(--border-color);
            }
            .frequency-toggle label.active {
                background-color: var(--fundify-light-green);
                color: var(--fundify-green);
            }
            .frequency-toggle input[type="radio"] {
                display: none; /* Hide the actual radio button */
            }
            
            /* --- Action Buttons --- */
            .action-button {
                flex: 1;
                padding: 0.875rem 1rem;
                border-radius: 0.375rem;
                font-weight: 600;
                font-size: 1rem;
                transition: all 0.3s ease;
            }
            .action-button:disabled {
                opacity: 0.7;
                cursor: not-allowed;
            }
            .cancel-button {
                background-color: #e5e7eb; /* bg-gray-200 */
                color: #4b5563; /* text-gray-600 */
            }
            .cancel-button:hover:not(:disabled) {
                background-color: #d1d5db; /* bg-gray-300 */
            }
            .checkout-button {
                background-color: var(--fundify-green);
                color: white;
                box-shadow: 0 4px 12px var(--shadow-color);
            }
            .checkout-button:hover:not(:disabled) {
                background-color: #3A4433; /* Darker green */
                transform: translateY(-2px);
                box-shadow: 0 7px 15px var(--shadow-color);
            }

        `}</style>
    </div>
)
}

export default DonationScreen;
