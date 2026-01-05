// Type definitions for driving license module

export type DLStatus = "PENDING" | "VERIFIED" | "REJECTED"

export interface DrivingLicense {
  id: string
  userId: string
  licenseNumber: string
  holderName: string
  dateOfBirth: string // YYYY-MM-DD
  issueDate: string // YYYY-MM-DD
  expiryDate: string // YYYY-MM-DD
  state: string
  address: string
  frontImage: string // URL
  backImage: string // URL
  status: DLStatus
  verifiedAt?: string
  rejectionReason?: string
  createdAt: string
  updatedAt: string
}

export interface CreateDLRequest {
  licenseNumber: string
  holderName: string
  dateOfBirth: string // YYYY-MM-DD
  issueDate: string // YYYY-MM-DD
  expiryDate: string // YYYY-MM-DD
  state: string
  address: string
}

export interface UpdateDLRequest {
  licenseNumber?: string
  holderName?: string
  dateOfBirth?: string
  issueDate?: string
  expiryDate?: string
  state?: string
  address?: string
}

export interface DLDocument {
  uri: string
  fileName: string
  fileType: string
}

export interface CreateDLResponse {
  message: string
  drivingLicense: DrivingLicense
}

export interface VerifyDLRequest {
  verified: boolean
  rejectionReason?: string
}

export interface VerifyDLResponse {
  message: string
  status: DLStatus
  verifiedAt?: string
}

// Indian states for dropdown
export const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Delhi",
  "Puducherry",
  "Chandigarh",
  "Jammu and Kashmir",
  "Ladakh",
]
