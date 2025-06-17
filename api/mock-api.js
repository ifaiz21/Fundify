"use client"

// This is a mock API implementation that can be used for testing
// when the real backend is not available or having issues

import { useState, useEffect } from "react"

// In-memory storage for campaigns
const campaigns = [
  {
    _id: "60d21b4667d0d8992e610c85",
    campaignName: "Neptune Play",
    category: "Business",
    fundingGoal: 123000,
    totalBackers: 2,
    status: "Active",
    creatorName: "John Doe",
    location: "Pakistan",
    campaignDescription: "A business campaign for Neptune Play",
    story: "This is the story of Neptune Play...",
    createdAt: new Date().toISOString(),
  },
  {
    _id: "60d21b4667d0d8992e610c86",
    campaignName: "Richie Club",
    category: "Startup",
    fundingGoal: 108000,
    totalBackers: 4,
    status: "Pending Review",
    creatorName: "Jane Smith",
    location: "United States",
    campaignDescription: "A startup campaign for Richie Club",
    story: "This is the story of Richie Club...",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
]

// Mock API functions
export const mockApi = {
  // Get all campaigns
  getCampaigns: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...campaigns])
      }, 500) // Simulate network delay
    })
  },

  // Create a new campaign
  createCampaign: (campaignData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newCampaign = {
          _id: `mock-${Date.now()}`,
          ...campaignData,
          createdAt: new Date().toISOString(),
        }

        campaigns.push(newCampaign)
        resolve(newCampaign)
      }, 800) // Simulate network delay
    })
  },
}

// React hook for using the mock API
export const useMockApi = () => {
  const [isConnected, setIsConnected] = useState(false)

  // Check connection on mount
  useEffect(() => {
    const checkConnection = setTimeout(() => {
      setIsConnected(true)
    }, 1000)

    return () => clearTimeout(checkConnection)
  }, [])

  return {
    isConnected,
    api: mockApi,
  }
}

// Function to switch between real API and mock API
export const useApi = (useRealApi = true) => {
  const { isConnected, api: mockApiInstance } = useMockApi()

  const getCampaigns = async () => {
    if (useRealApi) {
      try {
        const response = await fetch("http://localhost:5000/api/campaigns")
        if (!response.ok) throw new Error("API request failed")
        return await response.json()
      } catch (error) {
        console.error("Error with real API, falling back to mock:", error)
        return mockApiInstance.getCampaigns()
      }
    } else {
      return mockApiInstance.getCampaigns()
    }
  }

  const createCampaign = async (data) => {
    if (useRealApi) {
      try {
        const response = await fetch("http://localhost:5000/api/campaigns", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        })
        if (!response.ok) throw new Error("API request failed")
        return await response.json()
      } catch (error) {
        console.error("Error with real API, falling back to mock:", error)
        return mockApiInstance.createCampaign(data)
      }
    } else {
      return mockApiInstance.createCampaign(data)
    }
  }

  return {
    isConnected,
    getCampaigns,
    createCampaign,
  }
}
