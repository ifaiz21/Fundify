// src/Pages/CampaignsCreation/CampDeletion.jsx
"use client"
import { useNavigate } from "react-router-dom"

const CampaignDeletion = () => {
  const navigate = useNavigate()

  const handleContinue = (event) => {
    event.preventDefault()
    navigate("/")
  }

  return (
    <div className="bg-[#4b5945]">
      <div className="absolute flex items-center m-8">
        <h1 className="font-bold text-3xl text-white font-Inter">Fundify</h1>
      </div>
      <div className="flex flex-row h-screen max-h-full">
        <div className="w-full h-full text-white flex flex-col items-center justify-center relative">
          <div className="h-screen pt-24 z-10">
            <img
              src="/placeholder.svg?height=400&width=300"
              alt="Deletion confirmation"
              className="h-2/3 w-auto z-10"
            />
          </div>
          <div className="absolute bottom-14 z-50 text-center space-y-4">
            <h1 className="font-Inter font-bold text-4xl">Your Campaign has been deleted successfully</h1>
            <button
              onClick={handleContinue}
              className="text-2xl font-bold font-Inter opacity-65 hover:opacity-100 ease-in-out transition duration-300"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CampaignDeletion