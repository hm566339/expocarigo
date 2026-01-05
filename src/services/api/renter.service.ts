// Renter API service
import { RENTER_ENDPOINTS } from "../../config/api.config"
import type {
  CreateRenterRequest,
  Renter,
  RenterKYCDocument,
  RenterRatingRequest,
  RenterRatingResponse,
  UpdateRenterProfileRequest,
  UploadRenterKYCResponse,
  VerifyKYCRequest,
  VerifyKYCResponse,
} from "../../types/renter.types"
import ApiService from "../api.service"

class RenterService {
  // Create renter profile
  async createRenter(data: CreateRenterRequest): Promise<Renter> {
    return ApiService.post<Renter>(RENTER_ENDPOINTS.CREATE_RENTER, data)
  }

  // Get renter profile
  async getRenter(id: string): Promise<Renter> {
    return ApiService.get<Renter>(RENTER_ENDPOINTS.GET_RENTER(id))
  }

  // Update renter profile
  async updateProfile(id: string, data: UpdateRenterProfileRequest): Promise<Renter> {
    return ApiService.put<Renter>(RENTER_ENDPOINTS.UPDATE_PROFILE(id), data)
  }

  // Upload KYC documents (multipart/form-data)
  async uploadKYC(id: string, documents: RenterKYCDocument[]): Promise<UploadRenterKYCResponse> {
    const formData = new FormData()

    // Append each document to form data
    documents.forEach((doc) => {
      formData.append(doc.type.toLowerCase(), {
        uri: doc.uri,
        name: doc.fileName,
        type: doc.fileType,
      } as any)
    })

    return ApiService.post<UploadRenterKYCResponse>(RENTER_ENDPOINTS.UPLOAD_KYC(id), formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
  }

  // Verify KYC (Admin action)
  async verifyKYC(id: string, data: VerifyKYCRequest): Promise<VerifyKYCResponse> {
    return ApiService.post<VerifyKYCResponse>(RENTER_ENDPOINTS.VERIFY_KYC(id), data)
  }

  // Reject KYC (Admin action)
  async rejectKYC(id: string, data: VerifyKYCRequest): Promise<VerifyKYCResponse> {
    return ApiService.post<VerifyKYCResponse>(RENTER_ENDPOINTS.REJECT_KYC(id), data)
  }

  // Add rating
  async addRating(id: string, data: RenterRatingRequest): Promise<RenterRatingResponse> {
    return ApiService.post<RenterRatingResponse>(RENTER_ENDPOINTS.ADD_RATING(id), data)
  }
}

export default new RenterService()
