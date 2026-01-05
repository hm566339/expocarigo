import { create } from "zustand"
import bookingService from "../../../services/renters/services/booking.service"
import type { Booking } from "../../../types/index"

interface BookingState {
  bookings: Booking[]
  currentBooking: Booking | null
  isLoading: boolean
  error: string | null

  // Actions
  fetchMyBookings: () => Promise<void>
  createBooking: (data: any) => Promise<Booking>
  confirmPayment: (bookingId: string) => Promise<void>
  startTrip: (bookingId: string) => Promise<void>
  endTrip: (bookingId: string) => Promise<void>
  extendTrip: (bookingId: string, newEndDate: string) => Promise<void>
  cancelBooking: (bookingId: string) => Promise<void>
  clearError: () => void
}

export const useBookingStore = create<BookingState>((set, get) => ({
  bookings: [],
  currentBooking: null,
  isLoading: false,
  error: null,

  fetchMyBookings: async () => {
    set({ isLoading: true, error: null })
    try {
      const bookings = await bookingService.getMyBookings()
      set({ bookings, isLoading: false })
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || "Failed to fetch bookings"
      set({ error: errorMessage, isLoading: false })
    }
  },

  createBooking: async (data: any) => {
    set({ isLoading: true, error: null })
    try {
      const booking = await bookingService.createBooking(data)
      const bookings = [...get().bookings, booking]
      set({ currentBooking: booking, bookings, isLoading: false })
      return booking
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || "Failed to create booking"
      set({ error: errorMessage, isLoading: false })
      throw error
    }
  },

  confirmPayment: async (bookingId: string) => {
    set({ isLoading: true, error: null })
    try {
      const booking = await bookingService.confirmPayment(bookingId)
      set({ currentBooking: booking, isLoading: false })
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || "Payment confirmation failed"
      set({ error: errorMessage, isLoading: false })
      throw error
    }
  },

  startTrip: async (bookingId: string) => {
    set({ isLoading: true, error: null })
    try {
      const booking = await bookingService.startTrip(bookingId)
      set({ currentBooking: booking, isLoading: false })
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || "Failed to start trip"
      set({ error: errorMessage, isLoading: false })
      throw error
    }
  },

  endTrip: async (bookingId: string) => {
    set({ isLoading: true, error: null })
    try {
      const booking = await bookingService.endTrip(bookingId)
      set({ currentBooking: booking, isLoading: false })
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || "Failed to end trip"
      set({ error: errorMessage, isLoading: false })
      throw error
    }
  },

  extendTrip: async (bookingId: string, newEndDate: string) => {
    set({ isLoading: true, error: null })
    try {
      const booking = await bookingService.extendTrip(bookingId, newEndDate)
      set({ currentBooking: booking, isLoading: false })
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || "Failed to extend trip"
      set({ error: errorMessage, isLoading: false })
      throw error
    }
  },

  cancelBooking: async (bookingId: string) => {
    set({ isLoading: true, error: null })
    try {
      await bookingService.cancelBooking(bookingId)
      const bookings = get().bookings.filter((b) => b.id !== bookingId)
      set({ bookings, currentBooking: null, isLoading: false })
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || "Failed to cancel booking"
      set({ error: errorMessage, isLoading: false })
      throw error
    }
  },

  clearError: () => set({ error: null }),
}))
