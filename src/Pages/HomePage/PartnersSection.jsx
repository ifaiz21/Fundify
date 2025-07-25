import React from 'react';

function PartnersSection() {
  // A list of partner companies with their logos.
  // Replace the 'logoUrl' with actual paths to your logo images.
  const partnerCompanies = [
    { name: "Jellop", logoUrl: "/Images/jellop.jpeg" },
    { name: "ShipBob", logoUrl: "/Images/shipbob.png" },
    { name: "Pledgebox", logoUrl: "/Images/pledgebox.png" },
    { name: "BlackBox", logoUrl: "/Images/blackbox.jpg" },
  ];

  return (
    <div className="bg-[#F0FFF0] py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-12 md:mb-16 text-center md:text-left">
          <p className="text-gray-500 uppercase tracking-wider mb-4">
            FUTURE PARTNERS
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Building Strong Connections for a Better Future
          </h2>
          <p className="text-lg sm:text-xl text-gray-700 text-justify">
            We aim to collaborate with leading companies and institutions
            to create impactful solutions and foster growth within the community.
            Through strategic alliances, we can expand our reach, enhance our services,
            and collectively drive more successful campaigns.
          </p>
        </div>

        {/* Partners Grid */}
        <div className="flex justify-center">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 mb-12 md:mb-16">
            {partnerCompanies.map((company, index) => (
              <div
                key={index}
                className="bg-white rounded-lg border border-gray-200 
                           shadow-lg hover:shadow-xl transition-all duration-300 
                           transform hover:-translate-y-1 p-4 flex flex-col items-center justify-center 
                           h-32 text-center cursor-pointer group"
              >
                {company.logoUrl ? (
                  <img
                    src={company.logoUrl}
                    alt={`${company.name} Logo`}
                    className="max-h-16 object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <p className="text-gray-800 font-bold text-xl leading-tight tracking-wide">{company.name}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-[#5eb0bf] rounded-xl overflow-hidden shadow-xl">
          <div className="flex flex-col md:flex-row">
            <div className="p-8 md:p-10 lg:p-12 md:w-1/2 text-center md:text-left">
              <p className="text-white uppercase tracking-wider mb-2">
                CUSTOMER SUPPORT
              </p>
              <p className="text-white text-2xl sm:text-3xl font-light mb-6 sm:mb-8">
                (042) 3456-789
              </p>

              <p className="text-white uppercase tracking-wider mb-2">EMAIL</p>
              <p className="text-white text-2xl sm:text-3xl font-light">
                contact@fundify.com
              </p>
            </div>
            <div className="md:w-1/2 relative h-48 md:h-80">
              <img
                src="./Images/contacting-person.png"
                alt="Person using Fundify app"
                className="w-full h-full object-cover object-center md:object-right"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PartnersSection;