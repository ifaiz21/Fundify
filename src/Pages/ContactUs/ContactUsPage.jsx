import React from "react";
import Header from "../Layout/HeaderLayout"
import Footer from "../Layout/FooterLayout"
import { useNavigate } from "react-router-dom";

const ContactUsPage = () => {
  const navigate = useNavigate();

  function handleSubmitRequest(event) {
    event.preventDefault();
    navigate("/Submitted");
    console.log("Support request submitted");
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 md:px-6">
          <h1 className="text-2xl font-bold mb-8 text-center text-[#4A5D45]">Need Help? Contact Fundify Support</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column - Illustration and Contact Info */}
            <div>
              <div className="mb-6">
                <img
                  src="/images/contact-support.png"
                  alt="Customer Support"
                  className="max-w-full h-auto"
                />
              </div>

              <div className="bg-[#A9BEA2] p-4 rounded-md">
                <h2 className="text-lg font-semibold mb-4">Fundify Support</h2>

                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="bg-gray-300 rounded-full p-2 mr-3">
                      📧
                    </div>
                    <div>
                      <p className="text-sm text-[#4A5D45]">Support Email</p>
                      <p className="text-sm">support@fundify.com</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="bg-gray-300 rounded-full p-2 mr-3">
                      📞
                    </div>
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
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      placeholder="John Doe"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#4B5842]"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm text-[#000000] mb-1">
                      E-mail
                    </label>
                    <input
                      type="email"
                      id="email"
                      placeholder="you@example.com"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#4B5842]"
                      required
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label htmlFor="issue" className="block text-sm text-[#000000] mb-1">
                    Select Your Issue
                  </label>
                  <select
                    id="issue"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#4B5842] bg-white"
                    required
                  >
                    <option value="">Choose an option</option>
                    <option value="campaign">Campaign Support</option>
                    <option value="payout">Payout Issue</option>
                    <option value="technical">Technical Problem</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                    <label htmlFor="subject" className="block text-sm text-[#000000] mb-1">
                      Subject (96 character limit)
                    </label>
                    <input
                      type="subject"
                      id="subject"
                      placeholder=""
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#4B5842]"
                      required
                    />
                  </div>

                <div className="mb-4">
                  <label htmlFor="message" className="block text-sm text-[#000000] mb-1">
                    Message
                  </label>
                  <textarea
                    id="message"
                    placeholder="Describe your issue..."
                    rows="4"
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

      {/* Chat Support Button */}
      <div className="fixed bottom-6 right-6">
        <button className="bg-[#4B5842] text-white rounded-full p-3 shadow-lg">
          💬 Chat Support
        </button>
      </div>

      <Footer />
    </div>
  )

};

export default ContactUsPage;
