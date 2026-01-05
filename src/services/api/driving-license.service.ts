// Driving License API service
import ApiService from "./api.service"
import { DL_ENDPOINTS } from "../config/api.config"
import type {
  DrivingLicense,
  CreateDLRequest,
  UpdateDLRequest,
  CreateDLResponse,
  VerifyDLRequest,
  VerifyDLResponse,
  DLDocument,
} from "../types/driving-license.types"

class DrivingLicenseService {
  // Create driving license with multipart/form-data (includes image upload)
  async createDL(
    userId: string,
    data: CreateDLRequest,
    documents: { front: DLDocument; back: DLDocument },
  ): Promise<CreateDLResponse> {
    const formData = new FormData()

    // Append all DL data
    formData.append("licenseNumber", data.licenseNumber)
    formData.append("holderName", data.holderName)
    formData.append("dateOfBirth", data.dateOfBirth)
    formData.append("issueDate", data.issueDate)
    formData.append("expiryDate", data.expiryDate)
    formData.append("state", data.state)
    formData.append("address", data.address)

    // Append front and back images
    formData.append("frontImage", {
      uri: documents.front.uri,
      name: documents.front.fileName,
      type: documents.front.fileType,
    } as any)

    formData.append("backImage", {
      uri: documents.back.uri,
      name: documents.back.fileName,
      type: documents.back.fileType,
    } as any)

    return ApiService.post<CreateDLResponse>(DL_ENDPOINTS.CREATE_DL(userId), formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
  }

  // Get driving license details
  async getDL(dlId: string): Promise<DrivingLicense> {
    return ApiService.get<DrivingLicense>(DL_ENDPOINTS.GET_DL(dlId))
  }

  // Update driving license details
  async updateDL(dlId: string, data: UpdateDLRequest): Promise<DrivingLicense> {
    return ApiService.put<DrivingLicense>(DL_ENDPOINTS.UPDATE_DL(dlId), data)
  }

  // Verify driving license (Admin action)
  async verifyDL(dlId: string, data: VerifyDLRequest): Promise<VerifyDLResponse> {
    return ApiService.post<VerifyDLResponse>(DL_ENDPOINTS.VERIFY_DL(dlId), data)
  }
}

export default new DrivingLicenseService()
