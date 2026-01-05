import { CAR_OWNER_ENDPOINTS } from "../../config/api.config"
import api from "../../services/api.service"
import type {
  BankDetails,
  BankDetailsResponse,
  CarOwner,
  CreateOwnerRequest,
  EarningsSummary,
  RatingRequest,
  RatingResponse,
  UpdateOwnerProfileRequest,
  WalletRequest,
  WalletResponse,
  WalletTransaction,
} from "../../types/owner.types"

class CarOwnerService {
  // ================= HELPER =================
  private buildFormData(file: any) {
    const formData = new FormData()
    formData.append("file", {
      uri: file.uri,
      type: file.type || "image/jpeg",
      name: file.name || "image.jpg",
    } as any)
    return formData
  }

  // ================= PROFILE =================
  createOwner(data: CreateOwnerRequest) {
    return api.post<CarOwner>(
      CAR_OWNER_ENDPOINTS.CREATE_OWNER,
      data
    )
  }

  getOwner(id: string) {
    return api.get<CarOwner>(
      CAR_OWNER_ENDPOINTS.GET_OWNER(id)
    )
  }

  updateProfile(id: string, data: UpdateOwnerProfileRequest) {
    return api.put<CarOwner>(
      CAR_OWNER_ENDPOINTS.UPDATE_PROFILE(id),
      data
    )
  }

  // ================= KYC UPLOAD =================
  uploadAadhaarFront(id: string, file: any) {
    return api.upload<CarOwner>(
      CAR_OWNER_ENDPOINTS.UPLOAD_AADHAAR_FRONT(id),
      this.buildFormData(file),
      "POST"
    )
  }

  uploadAadhaarBack(id: string, file: any) {
    return api.upload<CarOwner>(
      CAR_OWNER_ENDPOINTS.UPLOAD_AADHAAR_BACK(id),
      this.buildFormData(file),
      "POST"
    )
  }

  uploadSelfie(id: string, file: any) {
    return api.upload<CarOwner>(
      CAR_OWNER_ENDPOINTS.UPLOAD_SELFIE(id),
      this.buildFormData(file),
      "POST"
    )
  }

  uploadDrivingLicense(id: string, file: any) {
    return api.upload<CarOwner>(
      CAR_OWNER_ENDPOINTS.UPLOAD_DL(id),
      this.buildFormData(file),
      "POST"
    )
  }


  // ================= KYC GET URLS =================
  getAadhaarFront(id: string) {
    return api.get<string>(
      CAR_OWNER_ENDPOINTS.GET_AADHAAR_FRONT(id)
    )
  }

  getAadhaarBack(id: string) {
    return api.get<string>(
      CAR_OWNER_ENDPOINTS.GET_AADHAAR_BACK(id)
    )
  }

  getSelfie(id: string) {
    return api.get<string>(
      CAR_OWNER_ENDPOINTS.GET_SELFIE(id)
    )
  }

  getDrivingLicense(id: string) {
    return api.get<string>(
      CAR_OWNER_ENDPOINTS.GET_DL(id)
    )
  }

  // ================= WALLET =================
  addToWallet(id: string, data: WalletRequest) {
    return api.post<WalletResponse>(
      CAR_OWNER_ENDPOINTS.ADD_WALLET(id),
      data
    )
  }

  deductFromWallet(id: string, data: WalletRequest) {
    return api.post<WalletResponse>(
      CAR_OWNER_ENDPOINTS.DEDUCT_WALLET(id),
      data
    )
  }

  withdrawFromWallet(id: string, data: WalletRequest) {
    return api.post<WalletResponse>(
      CAR_OWNER_ENDPOINTS.WITHDRAW_WALLET(id),
      data
    )
  }

  getTransactions(id: string) {
    return api.get<WalletTransaction[]>(
      CAR_OWNER_ENDPOINTS.GET_TRANSACTIONS(id)
    )
  }

  // ================= BANK / RATING / EARNINGS =================
  updateBankDetails(id: string, data: BankDetails) {
    return api.post<BankDetailsResponse>(
      CAR_OWNER_ENDPOINTS.UPDATE_BANK(id),
      data
    )
  }

  addRating(id: string, data: RatingRequest) {
    return api.post<RatingResponse>(
      CAR_OWNER_ENDPOINTS.ADD_RATING(id),
      data
    )
  }

  getEarningsSummary(id: string) {
    return api.get<EarningsSummary>(
      CAR_OWNER_ENDPOINTS.GET_EARNINGS(id)
    )
  }
}

export default new CarOwnerService()
