import { useState, useEffect } from "react";
import axios from "axios"; // Ensure axios is imported

function FundifyImpact() {
    const [statsData, setStatsData] = useState({
        totalCampaigns: "...",
        approvedCampaigns: "...",
        rejectedCampaigns: "...",
        pendingCampaigns: "...",
        verifiedDonations: "22,690", // Static placeholder for now
        generousBackers: "10,517", // Static placeholder for now
        empoweredBusinesses: "6,450", // Static placeholder for now
        totalRaised: "1.4 Billion", // Static placeholder for now
        successfullyFunded: "4,803", // Static placeholder for now
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBackendStats = async () => {
            try {
                setLoading(true);
                const response = await axios.get('https://server-fundify.up.railway.app/api/campaigns'); // Fetch from backend
                const { stats } = response.data; // Destructure the stats object

                setStatsData(prevStats => ({
                    ...prevStats,
                    totalCampaigns: stats.total.toLocaleString(),
                    approvedCampaigns: stats.approved.toLocaleString(),
                    rejectedCampaigns: stats.rejected.toLocaleString(),
                    pendingCampaigns: stats.pending.toLocaleString(),
                }));
            } catch (err) {
                console.error("Failed to fetch backend stats:", err);
                setError("Failed to load impact data.");
            } finally {
                setLoading(false);
            }
        };

        fetchBackendStats();
    }, []);

    // Define the stats array for rendering based on fetched data and placeholders
    const stats = [
      {
        number: statsData.verifiedDonations,
        title: "Verified Donations",
        description: "Placeholder: Backend integration needed.",
      },
      {
        number: statsData.generousBackers,
        title: "Generous Backers",
        description: "Placeholder: Backend integration needed.",
      },
      {
        number: statsData.empoweredBusinesses,
        title: "Donations Empowered",
        description: "Placeholder: Backend integration needed.",
      },
      {
        number: statsData.totalCampaigns, // Dynamic: Total campaigns from backend
        title: "Total Campaigns",
        description: "Currently active or approved.",
      },
      {
        number: statsData.totalRaised, // Static placeholder for now
        title: "Raised to Support",
        description: "Placeholder: Backend integration needed.",
      },
      {
        number: statsData.successfullyFunded, // Static placeholder for now
        title: "Campaigns Funded",
        description: "Placeholder: Backend integration needed.",
      },
    ];
  
    return (
      <section className="fundify-impact bg-gradient-to-br from-gray-50 to-gray-100 py-16 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-2">
                Fundify Impact
              </h3>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium text-gray-700 mb-10 drop-shadow-sm">
                Empower Local Businesses, Initiatives, and Charitable Causes.
              </h2>
  
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
                {loading ? (
                  <div className="col-span-2 text-center text-gray-700">Loading impact data...</div>
                ) : error ? (
                  <div className="col-span-2 text-center text-red-600">{error}</div>
                ) : (
                  stats.map((stat, index) => (
                    <div key={index} className="stat-item bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
                      <div className="text-xl md:text-2xl font-semibold text-gray-800 mb-1">
                        {stat.number}
                      </div>
                      <div className="text-gray-700 mb-1">{stat.title}</div>
                      <div className="text-gray-600 text-sm">{stat.description}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
  
            <div className="relative flex justify-center items-center py-10">
              <div className="fundify-graphic relative w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96">
                {/* Circular background with dotted border - more vibrant */}
                <div className="absolute inset-0 rounded-full border-4 border-dashed border-[#B2C9AD] transform scale-110 animate-spin-slow-reverse"></div>
  
                {/* Main circular image with enhanced shadow and gradient */}
                <div className="relative z-10 rounded-full bg-gradient-to-br from-[#4A5D45] to-[#65835e] p-2 shadow-2xl">
                  <div className="bg-white rounded-full p-4">
                    <div className="aspect-square relative rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                      <img
                        src="/Images/FundifyImpact.png"
                        alt="Fundify platform visualization"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>
  
                {/* Decorative elements - more prominent */}
                <div className="absolute top-1/4 -right-6 w-8 h-8 bg-yellow-400 rounded-full shadow-lg animate-bounce-slow"></div>
                <div className="absolute bottom-1/4 -left-4 w-6 h-6 bg-red-400 rounded-full shadow-lg animate-bounce-slow animation-delay-300"></div>
                <div className="absolute top-0 right-1/4 w-5 h-5 bg-green-400 rounded-full shadow-lg animate-bounce-slow animation-delay-600"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
  
  export default FundifyImpact;