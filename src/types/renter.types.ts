// Type definitions for renter module

export type KYCStatus = "PENDING" | "VERIFIED" | "REJECTED"
export type RenterDocumentType = "AADHAAR_FRONT" | "AADHAAR_BACK" | "SELFIE" | "DRIVING_LICENSE"

export interface Renter {
  id: string
  name: string
  email: string
  phone?: string
  address?: string
  profileImage?: string
  kycStatus: KYCStatus
  kycRejectionReason?: string
  rating?: number
  totalRatings?: number
  totalRides: number
  createdAt: string
  updatedAt: string
}

export interface CreateRenterRequest {
  name: string
  email: string
  phone: string
  address?: string
}

export interface UpdateRenterProfileRequest {
  name?: string
  phone?: string
  address?: string
  profileImage?: string
}

export interface RenterKYCDocument {
  type: RenterDocumentType
  uri: string
  fileName: string
  fileType: string
}

export interface UploadRenterKYCResponse {
  message: string
  kycStatus: KYCStatus
  uploadedDocuments: string[]
}

export interface VerifyKYCRequest {
  verified: boolean
  rejectionReason?: string
}

export interface VerifyKYCResponse {
  message: string
  kycStatus: KYCStatus
}

export interface RenterRatingRequest {
  rating: number // 1-5
  comment?: string
  ownerId: string
}

export interface RenterRatingResponse {
  message: string
  averageRating: number
  totalRatings: number
}
