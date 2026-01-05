// Booking & Trip API service
import ApiService from "./api.service"
import { BOOKING_ENDPOINTS } from "../config/api.config"
import type {
  Booking,
  CreateBookingRequest,
  ApproveBookingRequest,
  RejectBookingRequest,
  PaymentSuccessRequest,
  StartTripRequest,
  EndTripRequest,
  ExtendTripRequest,
  CancelBookingRequest,
  BookingListResponse,
} from "../types/booking.types"

class BookingService {
  // Create a new booking
  async createBooking(data: CreateBookingRequest): Promise<Booking> {
    return ApiService.post<Booking>(BOOKING_ENDPOINTS.CREATE_BOOKING, data)
  }

  // Get single booking by ID
  async getBooking(id: string): Promise<Booking> {
    return ApiService.get<Booking>(BOOKING_ENDPOINTS.GET_BOOKING(id))
  }

  // List all bookings (with optional filters)
  async listBookings(filters?: {
    renterId?: string
    ownerId?: string
    vehicleId?: string
    status?: string
  }): Promise<BookingListResponse> {
    const queryParams = new URLSearchParams()
    if (filters?.renterId) queryParams.append("renterId", filters.renterId)
    if (filters?.ownerId) queryParams.append("ownerId", filters.ownerId)
    if (filters?.vehicleId) queryParams.append("vehicleId", filters.vehicleId)
    if (filters?.status) queryParams.append("status", filters.status)

    const url = `${BOOKING_ENDPOINTS.LIST_BOOKINGS}${queryParams.toString() ? `?${queryParams.toString()}` : ""}`
    return ApiService.get<BookingListResponse>(url)
  }

  // Owner approves booking
  async approveBooking(id: string, data?: ApproveBookingRequest): Promise<Booking> {
    return ApiService.put<Booking>(BOOKING_ENDPOINTS.APPROVE_BOOKING(id), data || {})
  }

  // Owner rejects booking
  async rejectBooking(id: string, data: RejectBookingRequest): Promise<Booking> {
    return ApiService.put<Booking>(BOOKING_ENDPOINTS.REJECT_BOOKING(id), data)
  }

  // Confirm payment success
  async confirmPayment(id: string, data: PaymentSuccessRequest): Promise<Booking> {
    return ApiService.put<Booking>(BOOKING_ENDPOINTS.PAYMENT_SUCCESS(id), data)
  }

  // Start the trip
  async startTrip(id: string, data: StartTripRequest): Promise<Booking> {
    return ApiService.put<Booking>(BOOKING_ENDPOINTS.START_TRIP(id), data)
  }

  // End the trip
  async endTrip(id: string, data: EndTripRequest): Promise<Booking> {
    return ApiService.put<Booking>(BOOKING_ENDPOINTS.END_TRIP(id), data)
  }

  // Request trip extension
  async extendTrip(id: string, data: ExtendTripRequest): Promise<Booking> {
    return ApiService.put<Booking>(BOOKING_ENDPOINTS.EXTEND_TRIP(id), data)
  }

  // Cancel booking
  async cancelBooking(id: string, data: CancelBookingRequest): Promise<Booking> {
    return ApiService.put<Booking>(BOOKING_ENDPOINTS.CANCEL_BOOKING(id), data)
  }

  // Calculate price breakdown
  calculatePrice(
    startDate: string,
    endDate: string,
    startTime: string,
    endTime: string,
    pricePerDay: number,
    pricePerHour: number,
  ): {
    days: number
    hours: number
    subtotal: number
    tax: number
    platformFee: number
    total: number
  } {
    const start = new Date(`${startDate}T${startTime}`)
    const end = new Date(`${endDate}T${endTime}`)
    const diffMs = end.getTime() - start.getTime()
    const totalHours = diffMs / (1000 * 60 * 60)
    const days = Math.floor(totalHours / 24)
    const hours = Math.ceil(totalHours % 24)

    const subtotal = days * pricePerDay + hours * pricePerHour
    const tax = subtotal * 0.18 // 18% GST
    const platformFee = subtotal * 0.05 // 5% platform fee
    const total = subtotal + tax + platformFee

    return {
      days,
      hours,
      subtotal: Number.parseFloat(subtotal.toFixed(2)),
      tax: Number.parseFloat(tax.toFixed(2)),
      platformFee: Number.parseFloat(platformFee.toFixed(2)),
      total: Number.parseFloat(total.toFixed(2)),
    }
  }
}

export default new BookingService()
