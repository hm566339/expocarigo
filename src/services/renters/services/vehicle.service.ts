import { DUMMY_VEHICLES } from "../../../data/dummy.data"
import type { QuoteResponse, Vehicle, VehicleAvailability } from "../../../types/index"

class VehicleService {
  async getAllVehicles(filters?: any): Promise<Vehicle[]> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 600))

    let vehicles = DUMMY_VEHICLES

    // Filter by city if provided
    if (filters?.city) {
      vehicles = vehicles.filter((v) => v.location.city === filters.city)
    }

    // Filter by category if provided
    if (filters?.category) {
      vehicles = vehicles.filter((v) => v.category === filters.category)
    }

    // Filter by price range if provided
    if (filters?.minPrice || filters?.maxPrice) {
      vehicles = vehicles.filter((v) => {
        const price = v.pricePerDay
        const minOk = !filters.minPrice || price >= filters.minPrice
        const maxOk = !filters.maxPrice || price <= filters.maxPrice
        return minOk && maxOk
      })
    }

    return vehicles
  }

  async getVehicleById(vehicleId: string): Promise<Vehicle> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 400))

    const vehicle = DUMMY_VEHICLES.find((v) => v.id === vehicleId)

    if (!vehicle) {
      throw new Error("Vehicle not found")
    }

    return vehicle
  }

  async checkAvailability(vehicleId: string, startDate: string, endDate: string): Promise<VehicleAvailability> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 400))

    return {
      vehicleId,
      isAvailable: true,
      startDate,
      endDate,
      message: "Vehicle is available for selected dates",
    }
  }

  async getQuote(vehicleId: string, startDate: string, endDate: string): Promise<QuoteResponse> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    const vehicle = DUMMY_VEHICLES.find((v) => v.id === vehicleId)

    if (!vehicle) {
      throw new Error("Vehicle not found")
    }

    // Calculate number of days
    const start = new Date(startDate)
    const end = new Date(endDate)
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) || 1

    const subtotal = vehicle.pricePerDay * days
    const discount = Math.floor(subtotal * 0.05) // 5% discount
    const taxes = Math.floor((subtotal - discount) * 0.18) // 18% GST
    const total = subtotal - discount + taxes

    return {
      vehicleId,
      vehicleName: vehicle.name,
      startDate,
      endDate,
      numberOfDays: days,
      pricePerDay: vehicle.pricePerDay,
      subtotal,
      discount,
      taxes,
      total,
      breakdown: {
        rentalCost: subtotal,
        gstCharge: taxes,
        discountApplied: discount,
      },
    }
  }
}

export default new VehicleService()
