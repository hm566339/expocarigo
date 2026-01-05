export interface CarOwner {
  id: string
  name: string
  email: string
  dob?: string
  phone?: string
  address?: string
  aadhaarNumber?: string
  drivingLicenseNumber?: string
  bloodGroup?: string
  kycStatus: {
    aadhaarFront: "pending" | "uploaded"
    aadhaarBack: "pending" | "uploaded"
    selfie: "pending" | "uploaded"
    drivingLicense: "pending" | "uploaded"
    overall: "pending" | "approved" | "rejected"
  }
  wallet: {
    balance: number
  }
  bankDetails?: {
    accountHolderName: string
    accountNumber: string
    ifscCode: string
  }
  rating: number
  tripsCompleted: number
  createdAt: string
}

export interface WalletTransaction {
  id: string
  type: "add" | "deduct" | "withdraw"
  amount: number
  timestamp: string
  status: "success" | "pending" | "failed"
}
