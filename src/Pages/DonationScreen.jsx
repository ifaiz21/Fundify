// src/Pages/DonationScreen.jsx
"use client"

import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "./Layout/HeaderLayout";
import Footer from "./Layout/FooterLayout";
import { showSuccessMessage, showErrorMessage } from '../utils/toast';

const DonationScreen = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [donationAmount, setDonationAmount] = useState(2500); // Updated initial amount
    const [isCustomAmount, setIsCustomAmount] = useState(false);
    const [donationFrequency, setDonationFrequency] = useState("one-time");
    const [donationType, setDonationType] = useState("General donation");
    const [campaignId, setCampaignId] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (location.state && location.state.campaignId) {
            setCampaignId(location.state.campaignId);
            setDonationType("Project Specific");
        }
    }, [location.state]);

    const getAuthToken = () => {
        return localStorage.getItem('token');
    };

    const handleDonate = async () => {
        setIsLoading(true);
        const token = getAuthToken();

        if (!token) {
            showErrorMessage("Please log in to make a donation.");
            navigate("/login");
            setIsLoading(false);
            return;
        }

        if (!donationAmount || Number(donationAmount) <= 0) {
            showErrorMessage("Please enter a valid donation amount.");
            setIsLoading(false);
            return;
        }

        // --- MODIFICATION START ---
        // Instead of creating the donation record here, we pass the info to the payment page.
        const donationDetails = {
            amount: Number(donationAmount),
            frequency: donationFrequency,
            donationType: donationType,
            campaignId: campaignId,
        };

        // Use sessionStorage to temporarily store the details for the payment page.
        sessionStorage.setItem('donationDetails', JSON.stringify(donationDetails));

        showSuccessMessage("Proceeding to secure checkout...");
        
        // Navigate directly to the Stripe payment form.
        navigate("/payment1");
        
        // The original fetch logic will be moved to the payment component after successful payment.
        setIsLoading(false);
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
                                                onChange={(e) => { const value = e.target.value;
                                                    if (value === "" || Math.sign(Number(value)) !== -1) {
                                                        setDonationAmount(value);
                                                    }
                                                }}   
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
                /* --- Your existing CSS --- */
                @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
                .donation-page {
                    font-family: 'Poppins', sans-serif;
                    --fundify-green: #4B5842;
                    --fundify-light-green: #A9BEA2;
                    --shadow-color: rgba(75, 88, 66, 0.1);
                    --border-color: #d1d5db;
                }
                .hero-column h2 { text-shadow: 2px 2px 10px rgba(0,0,0,0.5); }
                .form-column h3, .form-column p { letter-spacing: -0.01em; }
                .form-label { display: block; font-size: 0.875rem; font-weight: 500; color: #374151; margin-bottom: 0.5rem; }
                .form-input { width: 100%; padding: 0.75rem 1rem; border: 1px solid var(--border-color); border-radius: 0.375rem; transition: all 0.2s ease-in-out; }
                .form-input:focus { outline: none; border-color: var(--fundify-green); box-shadow: 0 0 0 2px rgba(75, 88, 66, 0.2); }
                .amount-button { padding: 0.75rem 1rem; border: 1px solid var(--border-color); border-radius: 0.375rem; font-weight: 500; transition: all 0.2s ease-in-out; }
                .amount-button:hover { border-color: var(--fundify-light-green); background-color: #f9fafb; }
                .amount-button.active { background-color: var(--fundify-green); color: white; border-color: var(--fundify-green); }
                .frequency-toggle { display: flex; border: 1px solid var(--border-color); border-radius: 0.375rem; overflow: hidden; }
                .frequency-toggle label { flex: 1; padding: 0.75rem; text-align: center; cursor: pointer; background-color: white; font-weight: 500; color: #4b5563; transition: background-color 0.2s ease-in-out; }
                .frequency-toggle label:not(:last-child) { border-right: 1px solid var(--border-color); }
                .frequency-toggle label.active { background-color: var(--fundify-light-green); color: var(--fundify-green); }
                .frequency-toggle input[type="radio"] { display: none; }
                .action-button { flex: 1; padding: 0.875rem 1rem; border-radius: 0.375rem; font-weight: 600; font-size: 1rem; transition: all 0.3s ease; }
                .action-button:disabled { opacity: 0.7; cursor: not-allowed; }
                .cancel-button { background-color: #e5e7eb; color: #4b5563; }
                .cancel-button:hover:not(:disabled) { background-color: #d1d5db; }
                .checkout-button { background-color: var(--fundify-green); color: white; box-shadow: 0 4px 12px var(--shadow-color); }
                .checkout-button:hover:not(:disabled) { background-color: #3A4433; transform: translateY(-2px); box-shadow: 0 7px 15px var(--shadow-color); }
            `}</style>
        </div>
    )
}

export default DonationScreen;