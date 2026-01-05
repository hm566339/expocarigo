// Booking & Trip management types

export type BookingStatus =
  | "pending" // Initial state after booking creation
  | "approved" // Owner approved the booking
  | "rejected" // Owner rejected the booking
  | "payment_completed" // Payment successful
  | "active" // Trip started
  | "completed" // Trip ended
  | "cancelled" // Booking cancelled
  | "extended" // Trip extension requested

export interface Booking {
  _id: string
  renterId: string
  ownerId: string
  vehicleId: string
  startDate: string // ISO date string
  endDate: string // ISO date string
  startTime: string // HH:mm format
  endTime: string // HH:mm format
  pickupLocation: string
  dropLocation: string
  totalDays: number
  totalHours: number
  pricePerDay: number
  pricePerHour: number
  subtotal: number
  tax: number
  platformFee: number
  totalAmount: number
  status: BookingStatus
  paymentId?: string
  paymentMethod?: string
  actualStartTime?: string
  actualEndTime?: string
  extensionRequests?: ExtensionRequest[]
  cancellationReason?: string
  rejectionReason?: string
  createdAt: string
  updatedAt: string
  // Populated fields
  vehicle?: {
    _id: string
    brand: string
    model: string
    registrationNumber: string
    images: string[]
    vehicleType: string
  }
  renter?: {
    _id: string
    fullName: string
    email: string
    phone: string
    profilePicture?: string
  }
  owner?: {
    _id: string
    fullName: string
    email: string
    phone: string
    profilePicture?: string
  }
}

export interface ExtensionRequest {
  newEndDate: string
  newEndTime: string
  additionalHours: number
  additionalAmount: number
  status: "pending" | "approved" | "rejected"
  requestedAt: string
}

export interface CreateBookingRequest {
  renterId: string
  vehicleId: string
  startDate: string
  endDate: string
  startTime: string
  endTime: string
  pickupLocation: string
  dropLocation: string
}

export interface ApproveBookingRequest {
  remarks?: string
}

export interface RejectBookingRequest {
  reason: string
}

export interface PaymentSuccessRequest {
  paymentId: string
  paymentMethod: string
}

export interface StartTripRequest {
  actualStartTime: string
  odometerReading?: number
  preCheckPhotos?: string[]
}

export interface EndTripRequest {
  actualEndTime: string
  odometerReading?: number
  postCheckPhotos?: string[]
}

export interface ExtendTripRequest {
  newEndDate: string
  newEndTime: string
}

export interface CancelBookingRequest {
  reason: string
}

export interface BookingListResponse {
  bookings: Booking[]
  total: number
}

export interface PriceBreakdown {
  days: number
  hours: number
  pricePerDay: number
  pricePerHour: number
  subtotal: number
  tax: number
  platformFee: number
  total: number
}
