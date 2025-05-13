
function FundifyImpact() {
    const stats = [
      {
        number: "22,690",
        title: "Verified Donations",
        description: "Actively Supporting Campaigns.",
      },
      {
        number: "10,517",
        title: "generous backers",
        description: "supporting community initiatives.",
      },
      {
        number: "6,450",
        title: "donations have",
        description: "empowered small businesses to grow.",
      },
      {
        number: "5,058",
        title: "campaigns are currently",
        description: "active and seeking support.",
      },
      {
        number: "1.4 Billion",
        title: "raised to support",
        description: "local projects and causes.",
      },
      {
        number: "4,803",
        title: "campaigns successfully",
        description: "funded.",
      },
    ];
  
    return (
      <section className="fundify-impact bg-gray-50 py-16 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-2">
                Fundify Impact
              </h3>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium text-gray-700 mb-10">
                Empower Local Businesses, Initiatives, and Charitable Causes.
              </h2>
  
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
                {stats.map((stat, index) => (
                  <div key={index} className="stat-item">
                    <div className="text-xl md:text-2xl font-semibold text-gray-800">
                      {stat.number}
                    </div>
                    <div className="text-gray-700">{stat.title}</div>
                    <div className="text-gray-600">{stat.description}</div>
                  </div>
                ))}
              </div>
            </div>
  
            <div className="relative">
              <div className="fundify-graphic relative">
                {/* Circular background with dotted border */}
                <div className="absolute inset-0 rounded-full border-2 border-dashed border-teal-300 transform scale-110"></div>
  
                {/* Main circular image */}
                <div className="relative z-10 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 p-1">
                  <div className="bg-white rounded-full p-4">
                    <div className="aspect-square relative rounded-full overflow-hidden bg-teal-400 flex items-center justify-center">
                      <img
                        src="/Images/FundifyImpact.png"
                        alt="Fundify platform visualization"
                        className="w-full h-full object-cover"
                      />
  
                      {/* Logo overlay */}
                      {/* <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-teal-400 p-4 rounded">
                          <div className="flex items-center space-x-2">
                            <div className="flex flex-col space-y-1">
                              <div className="w-6 h-1 bg-gray-800"></div>
                              <div className="w-6 h-1 bg-gray-800"></div>
                              <div className="w-6 h-1 bg-gray-800"></div>
                            </div>
                            <span className="text-gray-800 font-bold text-xl">
                              FUNDIFY
                            </span>
                          </div>
                        </div>
                      </div> */}
                    </div>
                  </div>
                </div>
  
                {/* Decorative elements */}
                <div className="absolute top-1/4 -right-4 w-6 h-6 bg-yellow-400 rounded-full"></div>
                <div className="absolute bottom-1/4 -left-2 w-4 h-4 bg-red-400 rounded-full"></div>
                <div className="absolute top-0 right-1/4 w-3 h-3 bg-green-400 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
  
  export default FundifyImpact;
  