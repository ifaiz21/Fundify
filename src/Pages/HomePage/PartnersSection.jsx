function PartnersSection() {
    // Updated list of partner companies, now structured to include a logoUrl
    // YOU MUST REPLACE THESE 'logoUrl' VALUES WITH THE ACTUAL PATHS TO YOUR LOGO IMAGES
    // If you don't have a logo for a company, you can set logoUrl to null or an empty string,
    // and its name will be displayed instead.
    const partnerCompanies = [
      { name: "Jellop", logoUrl: "/images/jellop.jpeg" },    // Example path
      { name: "ShipBob", logoUrl: "/images/shipbob.png" },  // Example path
      { name: "Pledgebox", logoUrl: "/images/pledgebox.png" }, // Example path
      { name: "BlackBox", logoUrl: "/images/blackbox.jpg" },  // Example path
      // Add more companies here if needed, with their respective logoUrls
    ];

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
            <p className="text-xl text-gray-700 text-justify">
              We aim to collaborate with leading companies and institutions
              to create impactful solutions and foster growth within the community.
              Through strategic alliances, we can expand our reach, enhance our services,
              and collectively drive more successful campaigns.
            </p>
          </div>
  
          {/* Partners Grid - Enhanced Professional Look with Logos (wrapped for centering) */}
          <div className="flex justify-center">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-16">
              {partnerCompanies.map((company, index) => ( // Iterate over company objects
                <div
                  key={index}
                  className="bg-white rounded-lg border border-gray-200 
                             shadow-lg hover:shadow-xl transition-all duration-300 
                             transform hover:-translate-y-1 p-4 flex flex-col items-center justify-center 
                             h-32 text-center cursor-pointer group"
                >
                  {/* Conditional rendering for Logo or Company Name */}
                  {company.logoUrl ? (
                    <img
                      src={company.logoUrl}
                      alt={`${company.name} Logo`}
                      className="max-h-16 object-contain group-hover:scale-105 transition-transform duration-300" // Logo styling
                    />
                  ) : (
                    <p className="text-gray-800 font-bold text-xl leading-tight tracking-wide">{company.name}</p> // Fallback to name
                  )}
                </div>
              ))}
            </div>
          </div>
  
          {/* Contact Section */}
          <div className="bg-[#5EBFB5] rounded-xl overflow-hidden shadow-xl">
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