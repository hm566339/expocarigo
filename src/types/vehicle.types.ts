/* ================= ENUMS ================= */

export type BillingMode = "PER_DAY" | "PER_HOUR" | "BOTH"

export type KycStatus = "PENDING" | "APPROVED" | "REJECTED"

/* ================= ADD VEHICLE REQUEST ================= */

export interface AddVehicleRequest {
  vehicleNumber: string
  vehicleType?: string
  manufacturer?: string
  model?: string
  manufactureYear?: number
  fuelType?: string
  color?: string
  ownerName?: string
  ownerAddress?: string

  preDay?: number

  chassisNumber: string
  engineNumber: string

  // multipart files
  rcFrontImage?: File
  rcBackImage?: File
  vehicleImages?: File[]
  vehicleVideo?: File

  ratePerDay?: number
  ratePerHour?: number
  billingMode?: BillingMode
}

/* ================= VEHICLE DTO ================= */

export interface VehicleDto {
  vehicleId: string
  userId: number

  vehicleNumber: string
  vehicleType?: string
  manufacturer?: string
  model?: string
  manufactureYear?: number

  fuelType?: string
  color?: string

  ownerName?: string
  ownerAddress?: string

  chassisNumber?: string
  engineNumber?: string

  rcFrontImageUrl?: string
  rcBackImageUrl?: string

  vehicleImageUrls?: string[]
  vehicleVideoUrl?: string | null

  kycStatus?: KycStatus

  ratePerDay?: number
  ratePerHour?: number
  billingMode?: BillingMode

  createdAt?: string
  updatedAt?: string
}

/* ================= AVAILABILITY ================= */

export interface AvailabilityRequest {
  vehicleId: string
  startTime: string
  endTime: string
  available: boolean
}

export interface AvailabilitySlotDto {
  id: number
  vehicleId: string
  startTime: string
  endTime: string
  available: boolean
}

/* ================= PRICE QUOTE ================= */

export interface PriceQuoteRequest {
  startTime: string
  endTime: string
  promoCode?: string
}

export interface PriceQuoteDto {
  baseAmount: number
  discount: number
  finalAmount: number
  currency: string
  promoCode?: string
  promoMessage?: string
}

/* ================= VERIFY ================= */

export interface UserAndVehicleVerifyRequest {
  ownerId: number
  vehicleId: string
  preDay: number
}
