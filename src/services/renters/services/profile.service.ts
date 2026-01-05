import { DUMMY_PROFILE } from "../../../data/dummy.data"
import type { RenterProfile } from "../../../types/index"

class ProfileService {
  private profile = JSON.parse(JSON.stringify(DUMMY_PROFILE))

  async getRenterProfile(): Promise<RenterProfile> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500))
    return this.profile
  }

  async updateProfile(data: any): Promise<RenterProfile> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 700))

    this.profile = {
      ...this.profile,
      ...data,
      updatedAt: new Date().toISOString().split("T")[0],
    }

    return this.profile
  }

  async uploadAadhaarFront(fileUri: string, renterId: string): Promise<any> {
    // Simulate file upload delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    this.profile.documents.aadhaarFront = fileUri

    return {
      success: true,
      message: "Aadhaar front uploaded successfully",
    }
  }

  async uploadAadhaarBack(fileUri: string, renterId: string): Promise<any> {
    // Simulate file upload delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    this.profile.documents.aadhaarBack = fileUri

    return {
      success: true,
      message: "Aadhaar back uploaded successfully",
    }
  }

  async uploadDrivingLicense(fileUri: string, renterId: string): Promise<any> {
    // Simulate file upload delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    this.profile.documents.drivingLicense = fileUri

    return {
      success: true,
      message: "Driving license uploaded successfully",
    }
  }

  async uploadSelfie(fileUri: string, renterId: string): Promise<any> {
    // Simulate file upload delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    this.profile.documents.selfie = fileUri

    return {
      success: true,
      message: "Selfie uploaded successfully",
    }
  }

  async verifyKYC(renterId: string): Promise<any> {
    // Simulate verification delay
    await new Promise((resolve) => setTimeout(resolve, 1200))

    this.profile.kycStatus = "VERIFIED"
    this.profile.aadhaarVerified = true
    this.profile.drivingLicenseVerified = true
    this.profile.selfieVerified = true

    return {
      success: true,
      message: "KYC verified successfully",
      kycStatus: "VERIFIED",
    }
  }
}

export default new ProfileService()
