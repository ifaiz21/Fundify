import Header from "./Header";

export default function Hero() {
    return (
      <section className="relative min-h-screen flex items-center justify-center">
        {/* Background Image with Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('/Images/hero.png')`,
          }}
        >
          <div className="absolute inset-0 bg-black/60" />
        </div>

        {/* Header overlay */}
      <div className="absolute top-0 left-0 w-full z-10">
        <Header hideHome={true} />
      </div>
  
        {/* Content */}
        <div className="relative container mx-auto px-6 text-center mt-16">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            <span className="block"><span className="text-[#B2C9AD]">Empower </span> 
               Dreams</span>
            <span className="block">
              Through <span className="text-[#B2C9AD]">Support</span>
            </span>
          </h1>
  
          <p className="text-lg md:text-xl text-[#B2C9AD] mb-12 max-w-2xl mx-auto">
            Be a part of the breakthrough and make someone's dream come true.
          </p>
  
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <a
              href="/create-campaign"
              className="px-8 py-3 bg-white/10 text-white rounded-full hover:bg-[#4A5D45] transition-colors backdrop-blur-sm w-full sm:w-auto text-center font-medium"
            >
              Start a Campaign
            </a>
            <a
              href="/explore"
              className="px-8 py-3 bg-white/10 text-white rounded-full hover:bg-[#4A5D45] transition-colors backdrop-blur-sm w-full sm:w-auto text-center font-medium"
            >
              Explore Campaigns
            </a>
          </div>
        </div>
      </section>
    );
  } 