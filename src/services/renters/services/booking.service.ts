import { DUMMY_BOOKINGS, DUMMY_VEHICLES } from "../../../data/dummy.data"
import type { Booking, BookingRequest, ReviewRequest } from "../../../types/index"

class BookingService {
  private bookings = JSON.parse(JSON.stringify(DUMMY_BOOKINGS))

  async getMyBookings(): Promise<Booking[]> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 600))
    return this.bookings
  }

  async createBooking(data: BookingRequest): Promise<Booking> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    const vehicle = DUMMY_VEHICLES.find((v) => v.id === data.vehicleId)

    if (!vehicle) {
      throw new Error("Vehicle not found")
    }

    const booking: Booking = {
      id: `booking_${Date.now()}`,
      renterId: "renter_001",
      vehicleId: data.vehicleId,
      vehicle,
      startDate: data.startDate,
      endDate: data.endDate,
      totalAmount: data.totalAmount,
      pricePerDay: vehicle.pricePerDay,
      discountAmount: data.discountAmount || 0,
      finalAmount: data.finalAmount,
      status: "PENDING_PAYMENT",
      paymentMethod: data.paymentMethod,
      pickupLocation: data.pickupLocation,
      dropoffLocation: data.dropoffLocation,
      createdAt: new Date().toISOString().split("T")[0],
    }

    this.bookings.push(booking)
    return booking
  }

  async confirmPayment(bookingId: string): Promise<Booking> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 700))

    const booking = this.bookings.find((b: Booking) => b.id === bookingId)

    if (!booking) {
      throw new Error("Booking not found")
    }

    booking.status = "CONFIRMED"
    return booking
  }

  async startTrip(bookingId: string): Promise<Booking> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 600))

    const booking = this.bookings.find((b: Booking) => b.id === bookingId)

    if (!booking) {
      throw new Error("Booking not found")
    }

    booking.status = "ACTIVE"
    booking.startedAt = new Date().toISOString().split("T")[0]
    return booking
  }

  async endTrip(bookingId: string): Promise<Booking> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 700))

    const booking = this.bookings.find((b: Booking) => b.id === bookingId)

    if (!booking) {
      throw new Error("Booking not found")
    }

    booking.status = "COMPLETED"
    booking.endedAt = new Date().toISOString().split("T")[0]
    return booking
  }

  async extendTrip(bookingId: string, newEndDate: string): Promise<Booking> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 600))

    const booking = this.bookings.find((b: Booking) => b.id === bookingId)

    if (!booking) {
      throw new Error("Booking not found")
    }

    booking.endDate = newEndDate
    return booking
  }

  async cancelBooking(bookingId: string): Promise<any> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    const booking = this.bookings.find((b: Booking) => b.id === bookingId)

    if (!booking) {
      throw new Error("Booking not found")
    }

    booking.status = "CANCELLED"
    return { success: true, message: "Booking cancelled successfully" }
  }

  async reviewVehicle(bookingId: string, data: ReviewRequest): Promise<any> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 600))

    const booking = this.bookings.find((b: Booking) => b.id === bookingId)

    if (!booking) {
      throw new Error("Booking not found")
    }

    return {
      success: true,
      message: "Review submitted successfully",
      review: {
        bookingId,
        rating: data.rating,
        comment: data.comment,
        createdAt: new Date().toISOString().split("T")[0],
      },
    }
  }
}

export default new BookingService()
