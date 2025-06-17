
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
                  src="/images/contact-person.png"
                  alt="Person using Fundify app"
                  className="w-full h-full object-cover object-center"
                />
              </div>
            </div>
          </div>

        </div>
      </div>
    );
  }
  
  export default PartnersSection;
  