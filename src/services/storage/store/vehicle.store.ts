import { create } from "zustand"
import type { QuoteResponse, Vehicle } from "../../../types/index"
import vehicleService from "../../renters/services/booking.service"

interface VehicleState {
  vehicles: Vehicle[]
  selectedVehicle: Vehicle | null
  quote: QuoteResponse | null
  isLoading: boolean
  error: string | null
  filters: {
    city: string
    startDate: string | null
    endDate: string | null
    maxPrice: number | null
  }

  // Actions
  fetchVehicles: (filters?: any) => Promise<void>
  getVehicleDetails: (vehicleId: string) => Promise<void>
  getAvailability: (vehicleId: string, startDate: string, endDate: string) => Promise<void>
  getQuote: (vehicleId: string, startDate: string, endDate: string) => Promise<void>
  setFilters: (filters: any) => void
  clearError: () => void
}

export const useVehicleStore = create<VehicleState>((set) => ({
  vehicles: [],
  selectedVehicle: null,
  quote: null,
  isLoading: false,
  error: null,
  filters: {
    city: "",
    startDate: null,
    endDate: null,
    maxPrice: null,
  },

  fetchVehicles: async (filters?: any) => {
    set({ isLoading: true, error: null })
    try {
      const vehicles = await vehicleService.getAllVehicles(filters)
      set({ vehicles, isLoading: false })
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || "Failed to fetch vehicles"
      set({ error: errorMessage, isLoading: false })
    }
  },

  getVehicleDetails: async (vehicleId: string) => {
    set({ isLoading: true, error: null })
    try {
      const vehicle = await vehicleService.getVehicleById(vehicleId)
      set({ selectedVehicle: vehicle, isLoading: false })
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || "Failed to fetch vehicle details"
      set({ error: errorMessage, isLoading: false })
    }
  },

  getAvailability: async (vehicleId: string, startDate: string, endDate: string) => {
    set({ isLoading: true, error: null })
    try {
      await vehicleService.checkAvailability(vehicleId, startDate, endDate)
      set({ isLoading: false })
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || "Vehicle not available"
      set({ error: errorMessage, isLoading: false })
      throw error
    }
  },

  getQuote: async (vehicleId: string, startDate: string, endDate: string) => {
    set({ isLoading: true, error: null })
    try {
      const quote = await vehicleService.getQuote(vehicleId, startDate, endDate)
      set({ quote, isLoading: false })
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || "Failed to generate quote"
      set({ error: errorMessage, isLoading: false })
      throw error
    }
  },

  setFilters: (filters: any) => {
    set({ filters })
  },

  clearError: () => set({ error: null }),
}))
