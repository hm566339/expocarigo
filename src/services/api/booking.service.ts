import {
  OWNER_BOOKING_ENDPOINTS,
  RENTER_BOOKING_ENDPOINTS,
} from "../../config/api.config";

import type {
  Booking,
  CancelBookingRequest,
  CreateBookingRequest,
  RejectBookingRequest,
} from "../../types/booking.types";

import ApiService from "../api.service";

class BookingService {
  // ================= RENTER ACTIONS =================

  async createBooking(data: CreateBookingRequest): Promise<Booking> {
    return ApiService.post(RENTER_BOOKING_ENDPOINTS.CREATE_BOOKING, data);
  }

  async confirmPayment(id: string): Promise<Booking> {
    return ApiService.put(RENTER_BOOKING_ENDPOINTS.PAYMENT_SUCCESS(id), {});
  }

  async cancelBooking(
    id: string,
    data?: CancelBookingRequest,
  ): Promise<Booking> {
    return ApiService.put(
      RENTER_BOOKING_ENDPOINTS.CANCEL_BOOKING(id),
      data || {},
    );
  }

  async submitReview(id: string, data: any): Promise<void> {
    return ApiService.post(RENTER_BOOKING_ENDPOINTS.SUBMIT_REVIEW(id), data);
  }

  // ================= RENTER DASHBOARD =================

  async countTotalBookings(renterId: string): Promise<number> {
    return ApiService.get(
      `${RENTER_BOOKING_ENDPOINTS.COUNT_TOTAL_BOOKINGS}?renterId=${renterId}`,
    );
  }

  async getActiveBookings(renterId: string): Promise<Booking[]> {
    return ApiService.get(
      `${RENTER_BOOKING_ENDPOINTS.ACTIVE_BOOKINGS}?renterId=${renterId}`,
    );
  }

  async getCompletedBookings(renterId: string): Promise<number> {
    return ApiService.get(
      `${RENTER_BOOKING_ENDPOINTS.COMPLETED_BOOKINGS}?renterId=${renterId}`,
    );
  }

  async getCurrentTrip(renterId: string): Promise<Booking> {
    return ApiService.get(
      `${RENTER_BOOKING_ENDPOINTS.CURRENT_TRIP}?renterId=${renterId}`,
    );
  }

  // ================= OWNER ACTIONS =================

  async approveBooking(id: string): Promise<Booking> {
    return ApiService.put(OWNER_BOOKING_ENDPOINTS.APPROVE_BOOKING(id), {});
  }

  async rejectBooking(
    id: string,
    data?: RejectBookingRequest,
  ): Promise<Booking> {
    return ApiService.put(
      OWNER_BOOKING_ENDPOINTS.REJECT_BOOKING(id),
      data || {},
    );
  }

  async startTrip(id: string): Promise<Booking> {
    return ApiService.put(OWNER_BOOKING_ENDPOINTS.START_TRIP(id), {});
  }

  async endTrip(id: string): Promise<Booking> {
    return ApiService.put(OWNER_BOOKING_ENDPOINTS.END_TRIP(id), {});
  }

  // ================= OWNER DASHBOARD =================

  async countOwnerBookings(ownerId: string): Promise<number> {
    return ApiService.get(
      `${OWNER_BOOKING_ENDPOINTS.COUNT_OWNER_BOOKINGS}?ownerId=${ownerId}`,
    );
  }

  async getOngoingBookings(ownerId: string): Promise<Booking[]> {
    return ApiService.get(
      `${OWNER_BOOKING_ENDPOINTS.ONGOING_BOOKINGS}?ownerId=${ownerId}`,
    );
  }

  async getBookingStats(ownerId: string): Promise<any> {
    return ApiService.get(
      `${OWNER_BOOKING_ENDPOINTS.BOOKING_STATS}?ownerId=${ownerId}`,
    );
  }

  async getOwnerCurrentTrip(ownerId: string): Promise<any> {
    return ApiService.get(
      `${OWNER_BOOKING_ENDPOINTS.CURRENT_TRIP}?ownerId=${ownerId}`,
    );
  }

  async getDisputeCount(ownerId: string): Promise<number> {
    return ApiService.get(
      `${OWNER_BOOKING_ENDPOINTS.DISPUTE_COUNT}?ownerId=${ownerId}`,
    );
  }
}

export default new BookingService();
