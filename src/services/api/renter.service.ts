// // Renter API service
// import { RENTER_ENDPOINTS } from "../../config/api.config"
// import type {
//   CreateRenterRequest,
//   Renter,
//   RenterKYCDocument,
//   RenterRatingRequest,
//   RenterRatingResponse,
//   UpdateRenterProfileRequest,
//   UploadRenterKYCResponse,
//   VerifyKYCRequest,
//   VerifyKYCResponse,
// } from "../../types/renter.types"
// import ApiService from "../api.service"

// class RenterService {
//   // Create renter profile
//   async createRenter(data: CreateRenterRequest): Promise<Renter> {
//     return ApiService.post<Renter>(RENTER_ENDPOINTS.CREATE_RENTER, data)
//   }

//   // Get renter profile
//   async getRenter(id: string): Promise<Renter> {
//     return ApiService.get<Renter>(RENTER_ENDPOINTS.GET_RENTER(id))
//   }

//   // Update renter profile
//   async updateProfile(id: string, data: UpdateRenterProfileRequest): Promise<Renter> {
//     return ApiService.put<Renter>(RENTER_ENDPOINTS.UPDATE_PROFILE(id), data)
//   }

//   // Upload KYC documents (multipart/form-data)
//   async uploadKYC(id: string, documents: RenterKYCDocument[]): Promise<UploadRenterKYCResponse> {
//     const formData = new FormData()

//     // Append each document to form data
//     documents.forEach((doc) => {
//       formData.append(doc.type.toLowerCase(), {
//         uri: doc.uri,
//         name: doc.fileName,
//         type: doc.fileType,
//       } as any)
//     })

//     return ApiService.post<UploadRenterKYCResponse>(RENTER_ENDPOINTS.UPLOAD_KYC(id), formData, {
//       headers: {
//         "Content-Type": "multipart/form-data",
//       },
//     })
//   }

//   // Verify KYC (Admin action)
//   async verifyKYC(id: string, data: VerifyKYCRequest): Promise<VerifyKYCResponse> {
//     return ApiService.post<VerifyKYCResponse>(RENTER_ENDPOINTS.VERIFY_KYC(id), data)
//   }

//   // Reject KYC (Admin action)
//   async rejectKYC(id: string, data: VerifyKYCRequest): Promise<VerifyKYCResponse> {
//     return ApiService.post<VerifyKYCResponse>(RENTER_ENDPOINTS.REJECT_KYC(id), data)
//   }

//   // Add rating
//   async addRating(id: string, data: RenterRatingRequest): Promise<RenterRatingResponse> {
//     return ApiService.post<RenterRatingResponse>(RENTER_ENDPOINTS.ADD_RATING(id), data)
//   }

//     getDashboard() {
//     return api.get<DashboardData>(
//       CAR_OWNER_ENDPOINTS.GET_OWNER_DASHBORD
//     )
//   }
// }

// export default new RenterService()




import { RENTER_ENDPOINTS } from "../../config/api.config"
import api from "../../services/api.service"
import type {
  CreateRenterRequest,
  DashboardData,
  Renter,
  RenterKYCDocument,
  RenterRatingRequest,
  RenterRatingResponse,
  UpdateRenterProfileRequest,
  UploadRenterKYCResponse,
  VerifyKYCRequest,
  VerifyKYCResponse,
} from "../../types/renter.types"

class RenterService {
  // ================= HELPER =================
  private buildFormData(documents: RenterKYCDocument[]) {
    const formData = new FormData()

    documents.forEach((doc) => {
      formData.append(doc.type.toLowerCase(), {
        uri: doc.uri,
        type: doc.fileType,
        name: doc.fileName,
      } as any)
    })

    return formData
  }

  // ================= PROFILE =================
  createRenter(data: CreateRenterRequest) {
    return api.post<Renter>(
      RENTER_ENDPOINTS.CREATE_RENTER,
      data
    )
  }

  getRenter(id: string) {
    return api.get<Renter>(
      RENTER_ENDPOINTS.GET_RENTER(id)
    )
  }

  updateProfile(id: string, data: UpdateRenterProfileRequest) {
    return api.put<Renter>(
      RENTER_ENDPOINTS.UPDATE_PROFILE(id),
      data
    )
  }

  // ================= DASHBOARD =================
  getDashboard() {
    return api.get<DashboardData>(
      RENTER_ENDPOINTS.GET_RENTER_DASHBORD
    )
  }

  // ================= KYC =================
  uploadKYC(id: string, documents: RenterKYCDocument[]) {
    return api.upload<UploadRenterKYCResponse>(
      RENTER_ENDPOINTS.UPLOAD_KYC(id),
      this.buildFormData(documents),
      "POST"
    )
  }

  verifyKYC(id: string, data: VerifyKYCRequest) {
    return api.post<VerifyKYCResponse>(
      RENTER_ENDPOINTS.VERIFY_KYC(id),
      data
    )
  }

  rejectKYC(id: string, data: VerifyKYCRequest) {
    return api.post<VerifyKYCResponse>(
      RENTER_ENDPOINTS.REJECT_KYC(id),
      data
    )
  }

  // ================= SEARCH / BOOKING =================
  searchVehicles(from: string, to: string) {
    return api.get(
      RENTER_ENDPOINTS.SEARCH_VEHICLES(from, to)
    )
  }

  bookVehicle(data: any) {
    return api.post(
      RENTER_ENDPOINTS.BOOK_VEHICLE,
      data
    )
  }

  getBookings(id: string) {
    return api.get(
      RENTER_ENDPOINTS.GET_BOOKINGS(id)
    )
  }

  // ================= RATING =================
  addRating(id: string, data: RenterRatingRequest) {
    return api.post<RenterRatingResponse>(
      RENTER_ENDPOINTS.ADD_RATING(id),
      data
    )
  }
}

export default new RenterService()
