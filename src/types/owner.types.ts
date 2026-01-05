// Type definitions for Car Owner module


/* =====================================================
   ENUMS (MATCHES Spring enums exactly)
===================================================== */

export type BloodGroup =
  | "A_POSITIVE"
  | "A_NEGATIVE"
  | "B_POSITIVE"
  | "B_NEGATIVE"
  | "AB_POSITIVE"
  | "AB_NEGATIVE"
  | "O_POSITIVE"
  | "O_NEGATIVE"

export type KycStatus =
  | "PENDING"
  | "VERIFIED"
  | "REJECTED"

/* =====================================================
   RESPONSE DTO  (CarOwnerResponseDTO)
===================================================== */

export interface CarOwner {
  data: any
  success: any
  id: number

  // BASIC PROFILE
  name: string
  email: string
  dob: string | null
  phone: string
  address: string | null

  // KYC
  aadhaarNumber: string | null
  drivingLicenseNumber: string | null
  bloodGroup: BloodGroup | null

  aadhaarFrontUrl: string | null
  aadhaarBackUrl: string | null
  selfieUrl: string | null

  // WALLET
  walletBalance: number
  totalEarnings: number

  // BANK
  bankAccountNumber: string | null
  ifscCode: string | null
  accountHolderName: string | null

  // RATING
  rating: number
  totalTripsCompleted: number

  // STATUS
  kycStatus: KycStatus

  profilepictureUrl: string | null

  // AUDIT
  createdAt: string
  updatedAt: string
}


/* =====================================================
   REQUEST DTO (PUT /car-owners/{id})
   Matches CarOwnerRequestDTO exactly
===================================================== */

export interface UpdateOwnerProfileRequest {
  name: string                // @NotBlank
  email: string               // @NotBlank + @Email
  dob?: string | null         // LocalDate
  phone: string               // @NotBlank
  address?: string | null
  aadhaarNumber: string       // @NotBlank
  drivingLicenseNumber?: string | null
  bloodGroup?: BloodGroup | null
}


export interface KYCDocuments {
  aadhaarFront: string // file URI
  aadhaarBack: string
  selfie: string
  drivingLicense: string
}

export interface BankDetails {
  accountHolderName: string
  accountNumber: string
  ifscCode: string
  bankName: string
  branchName?: string
}

export interface WalletTransaction {
  id: string
  type: "credit" | "debit" | "withdraw"
  amount: number
  description: string
  status: "pending" | "completed" | "failed"
  createdAt: string
}

export interface CreateOwnerRequest {
  userId: string
  fullName: string
  email: string
  phoneNumber: string
  address?: string
  city?: string
  state?: string
  pincode?: string
}


export interface WalletOperationRequest {
  amount: number
  description: string
}

export interface RatingRequest {
  rating: number
  review?: string
  bookingId: string
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

export interface KYCDocument {
  type: "AADHAAR_FRONT" | "AADHAAR_BACK" | "SELFIE" | "DRIVING_LICENSE"
  uri: string
  fileName: string
  fileType: string
}

export interface UploadKYCResponse {
  success: boolean
  message: string
}

export interface WalletRequest {
  amount: number
  description?: string
}

export interface WalletResponse {
  success: boolean
  balance: number
}

export interface BankDetailsResponse {
  success: boolean
  message: string
}

export interface RatingResponse {
  success: boolean
  rating: number
}

export interface EarningsSummary {
  totalEarnings: number
  walletBalance: number
}
