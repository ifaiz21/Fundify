"use client"

import { useState } from "react";
import Footer from "./Layout/FooterLayout";
import { useNavigate } from "react-router-dom";


const PaymentPage = () => {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState("visa")

  const handleSubmit = (e) => {
    e.preventDefault()
    // Add your payment processing logic here
    console.log("Processing payment")
    navigate("/Submitted");
  }

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Left Column - Logo */}
            <div className="flex flex-col items-center justify-center">
              <div className="w-40 h-40 mb-4">
                <img src="./Images/fundify-white-bg-logo.png" alt="Fundify Logo" className="w-full h-full" />
              </div>
              {/* <h1 className="text-3xl font-bold text-center mb-2">FUNDIFY</h1>
              <p className="text-sm text-gray-600 text-center">INVEST LOCALLY, IMPACT GLOBALLY</p> */}
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
                    {["visa", "amex", "mastercard", "discover", "clearpay"].map((method) => (
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
                        <img src={`/${method}-logo.svg`} alt={method} className="h-6" />
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
                >
                  Confirm
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

      <Footer />
    </div>
  )
}

export default PaymentPage

