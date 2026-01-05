// Auth Types
export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
  phone: string
  role: "RENTER"
}

export interface AuthResponse {
  token: string
  user: User
}

export interface User {
  id: string
  name: string
  email: string
  phone: string
  role: "RENTER"
  profileCompleted: boolean
  kycStatus: "PENDING" | "SUBMITTED" | "VERIFIED" | "REJECTED"
}

export interface OTPRequest {
  email: string
}

export interface VerifyOTPRequest {
  email: string
  otp: string
  newPassword: string
}

// Renter Profile Types
export interface RenterProfile {
  id: string
  userId: string
  aadharNumber: string
  aadharFrontUrl?: string
  aadharBackUrl?: string
  drivingLicenseNumber: string
  drivingLicenseUrl?: string
  selfieUrl?: string
  kycStatus: "PENDING" | "SUBMITTED" | "VERIFIED" | "REJECTED"
  createdAt: string
  updatedAt: string
}

// Vehicle Types
export interface Vehicle {
  id: string
  name: string
  model: string
  year: number
  licensePlate: string
  images: string[]
  pricePerDay: number
  transmission: "MANUAL" | "AUTOMATIC"
  fuelType: "PETROL" | "DIESEL" | "ELECTRIC"
  seats: number
  features: string[]
  rating: number
  reviewCount: number
  owner: {
    id: string
    name: string
    rating: number
  }
  location: {
    city: string
    latitude: number
    longitude: number
  }
  isAvailable: boolean
}

export interface VehicleAvailability {
  vehicleId: string
  startDate: string
  endDate: string
  isAvailable: boolean
}

export interface QuoteResponse {
  vehicleId: string
  pricePerDay: number
  totalDays: number
  subtotal: number
  tax: number
  total: number
}

// Booking Types
export interface BookingRequest {
  vehicleId: string
  startDate: string
  endDate: string
  pickupLocation: string
  dropoffLocation: string
  paymentMethod: string
}

export interface Booking {
  id: string
  vehicleId: string
  renterId: string
  startDate: string
  endDate: string
  status: "PENDING" | "CONFIRMED" | "ACTIVE" | "COMPLETED" | "CANCELLED"
  pickupLocation: string
  dropoffLocation: string
  totalCost: number
  paymentStatus: "PENDING" | "COMPLETED" | "FAILED"
  createdAt: string
  updatedAt: string
}

export interface ExtendTripRequest {
  bookingId: string
  newEndDate: string
}

// Review & Rating Types
export interface ReviewRequest {
  bookingId: string
  rating: number
  comment: string
}

export interface RenterRatingRequest {
  renterId: string
  rating: number
  comment: string
}

// API Response Wrapper
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export * from "./api.types"

// Re-export commonly used types
export type {
  User,
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  Vehicle,
  Booking,
  RenterProfile,
  QuoteResponse,
  BookingRequest,
  ReviewRequest,
  ApiResponse,
} from "./api.types"
