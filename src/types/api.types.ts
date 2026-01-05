// API Response types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  limit: number
}

// Auth Types
export interface RegisterRequest {
  email: string
  password: string
  firstName: string
  lastName: string
  phoneNumber: string
  role: "RENTER"
}

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  token: string
  user: User
}

export interface SendOtpRequest {
  email: string
}

export interface VerifyOtpRequest {
  email: string
  otp: string
}

export interface ResetPasswordRequest {
  email: string
  otp: string
  newPassword: string
}

// User Types
export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  phoneNumber: string
  role: "RENTER"
  createdAt: string
  updatedAt: string
}

export interface Renter extends User {
  licenseNumber?: string
  licenseExpiry?: string
  kycStatus: "PENDING" | "APPROVED" | "REJECTED"
  kycDocuments: KycDocument[]
  rating?: number
  totalTrips?: number
}

export interface KycDocument {
  id: string
  type: "AADHAAR_FRONT" | "AADHAAR_BACK" | "SELFIE" | "DRIVING_LICENSE"
  url: string
  status: "PENDING" | "APPROVED" | "REJECTED"
  rejectionReason?: string
}

// Vehicle Types
export interface Vehicle {
  id: string
  name: string
  brand: string
  model: string
  year: number
  licensePlate: string
  category: "SEDAN" | "SUV" | "HATCHBACK" | "MUV"
  fuelType: "PETROL" | "DIESEL" | "HYBRID" | "ELECTRIC"
  transmission: "MANUAL" | "AUTOMATIC"
  seatingCapacity: number
  images: string[]
  ownerId: string
  city: string
  dailyRate: number
  hourlyRate: number
  deposits: number
  features: string[]
  rating?: number
  isAvailable: boolean
  createdAt: string
}

export interface VehicleAvailability {
  vehicleId: string
  date: string
  isAvailable: boolean
  reason?: string
}

export interface QuoteRequest {
  vehicleId: string
  startDate: string
  endDate: string
  city: string
}

export interface QuoteResponse {
  vehicleId: string
  dailyRate: number
  totalDays: number
  subtotal: number
  deposit: number
  taxes: number
  total: number
}

// Booking Types
export interface Booking {
  id: string
  renterId: string
  vehicleId: string
  ownerId: string
  startDate: string
  endDate: string
  status: "PENDING" | "CONFIRMED" | "ACTIVE" | "COMPLETED" | "CANCELLED"
  totalAmount: number
  deposit: number
  paymentStatus: "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED"
  pickupLocation: string
  dropoffLocation: string
  createdAt: string
  updatedAt: string
}

export interface CreateBookingRequest {
  vehicleId: string
  startDate: string
  endDate: string
  pickupLocation: string
  dropoffLocation: string
  totalAmount: number
  deposit: number
}

export interface PaymentSuccessRequest {
  bookingId: string
  paymentId: string
  transactionId: string
}

export interface TripHistoryResponse {
  bookings: Booking[]
  total: number
}

export interface ReviewRequest {
  bookingId: string
  rating: number
  comment: string
}

export interface SearchFiltersRequest {
  city: string
  startDate: string
  endDate: string
  minPrice?: number
  maxPrice?: number
  category?: string
}
