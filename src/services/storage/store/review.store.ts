import { create } from "zustand"
import type { RenterRatingRequest, ReviewRequest } from "../../../types/index"
import bookingService from "../../renters/services/booking.service"

interface ReviewState {
  isLoading: boolean
  error: string | null

  // Actions
  submitReview: (bookingId: string, data: ReviewRequest) => Promise<void>
  submitRenterRating: (renterId: string, data: RenterRatingRequest) => Promise<void>
  clearError: () => void
}

export const useReviewStore = create<ReviewState>((set) => ({
  isLoading: false,
  error: null,

  submitReview: async (bookingId: string, data: ReviewRequest) => {
    set({ isLoading: true, error: null })
    try {
      await bookingService.reviewVehicle(bookingId, data)
      set({ isLoading: false })
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || "Failed to submit review"
      set({ error: errorMessage, isLoading: false })
      throw error
    }
  },

  submitRenterRating: async (renterId: string, data: RenterRatingRequest) => {
    set({ isLoading: true, error: null })
    try {
      // This would be a separate endpoint in your API
      // For now, using the existing service pattern
      set({ isLoading: false })
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || "Failed to submit rating"
      set({ error: errorMessage, isLoading: false })
      throw error
    }
  },

  clearError: () => set({ error: null }),
}))
