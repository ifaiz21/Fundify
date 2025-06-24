import React, { useState } from 'react';

function SubscribeBox() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(''); // Clear previous errors

    if (!email) {
      setErrorMessage('Please enter your email address.');
      return;
    }

    try {
      // Simulate API call to your backend
      // In a real application, you'd replace this with an actual axios.post or fetch call:
      // await axios.post('/api/subscribe', { email });
      console.log(`Subscribing with email: ${email}`);

      // Simulate success after a short delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      setIsSubscribed(true); // Mark as subscribed
      setShowSuccessMessage(true); // Show success message

      // Optionally, hide the success message after a few seconds
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 5000); // Message disappears after 5 seconds

    } catch (error) {
      console.error('Subscription failed:', error);
      setErrorMessage('Subscription failed. Please try again.');
    }
  };

  if (showSuccessMessage) {
    return (
      <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
        <strong className="font-bold">Success!</strong>
        <span className="block sm:inline ml-6">You have successfully subscribed to our newsletter.</span>
      </div>
    );
  }

  if (isSubscribed) {
    // If subscribed and success message has faded, you might want to show nothing or a subtle message
    return null; // Or return a simple "Thank You!" if desired after the success message fades
  }

  return (
    <section className=" text-white py-12 px-4">
    <div className="max-w-xl mx-auto p-8 rounded-lg shadow-xl" style={{ backgroundColor: '#4a5d45' }}>
    <h1 className="text-3xl font-bold mb-4 text-white">Subscribe to Our Newsletter.</h1>
    <p className="text-gray-200 mb-6 text-justify">Stay updated with Fundify's latest campaigns, success stories, and community news. Get insights into impactful projects and discover new ways to make a difference.</p>

    <form onSubmit={handleSubmit}>
        <div className="mb-4">
        <label htmlFor="email" className="sr-only">Email Address</label>
        <input
            type="email"
            id="email"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A5D45] focus:border-transparent"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
        />
        </div>

        {errorMessage && (
        <p className="text-red-500 text-sm mb-4 text-center">{errorMessage}</p>
        )}

        <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md font-semibold  hover:bg-blue-700 transition-colors duration-300"
        style={{ backgroundColor: '#625d99' }}
        >
        Subscribe
        </button>
    </form>
    </div>
    </section>
  );
}

export default SubscribeBox;