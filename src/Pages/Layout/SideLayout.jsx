import React from "react";

const SideLayout = ({ children }) => {
  return (
    <div className="bg-[#F0FFF0] h-screen w-full">
      <div className="absolute flex items-center m-8 right-0 md:left-0 md:text-[#4b5945] text-[#4b5945]">
        <h1 className="font-bold text-3xl font-Inter">Fundify</h1>
      </div>
      <div className="flex flex-row h-screen max-h-full">
        <div className="hidden md:flex w-1/2 h-full text-white items-center justify-center relative">
          <div className="h-screen pt-24 z-50">
            <img
              src="/Images/Landing logo.png"
              alt="Login Illustration"
              className="h-5/6 w-auto z-20"
            />
          </div>
        </div>

        <div className="w-full md:w-1/2 max-h-full h-screen bg-[#141414] text-black overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default SideLayout;
