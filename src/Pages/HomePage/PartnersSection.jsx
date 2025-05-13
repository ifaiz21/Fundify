
function PartnersSection() {
    return (
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="mb-16">
            <p className="text-gray-500 uppercase tracking-wider mb-4">
              FUTURE PARTNERS
            </p>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Building Strong Connections for a Better Future
            </h2>
            <p className="text-xl text-gray-700">
              We aim to collaborate with leading companies and institutions
              <br />
              to create impactful solutions. and growth.
            </p>
          </div>
  
          {/* Partners Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-16">
            {/* First row */}
            {[1, 2, 3, 4, 5].map((item) => (
              <div
                key={item}
                className="bg-white rounded-lg shadow-sm p-8 flex items-center justify-center"
              >
                <p className="text-gray-800 font-medium">Company</p>
              </div>
            ))}
  
            {/* Second row */}
            {[6, 7, 8, 9].map((item) => (
              <div
                key={item}
                className="bg-white rounded-lg shadow-sm p-8 flex items-center justify-center"
              >
                <p className="text-gray-800 font-medium">Company</p>
              </div>
            ))}
          </div>
  
          {/* Contact Section */}
          <div className="bg-[#5EBFB5] rounded-xl overflow-hidden">
            <div className="flex flex-col md:flex-row">
              <div className="p-8 md:p-12 md:w-1/2">
                <p className="text-white uppercase tracking-wider mb-2">
                  CALL CENTER
                </p>
                <p className="text-white text-3xl font-light mb-8">
                  (XXX) XXXX-XXX
                </p>
  
                <p className="text-white uppercase tracking-wider mb-2">EMAIL</p>
                <p className="text-[#2A5F59] text-3xl font-light">
                  contact@fundify.com
                </p>
              </div>
              <div className="md:w-1/2 relative">
                <img
                  src="/images/contact-person.jpg"
                  alt="Person using Fundify app"
                  className="w-full h-full object-cover object-center"
                />
              </div>
            </div>
          </div>
  
          {/* Chat Button */}
          <div className="fixed bottom-8 right-8">
            <button className="bg-[#4A5D45] text-white rounded-full p-4 shadow-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  export default PartnersSection;
  