import api from "../api.service"
import type {
  CarOwner,
  CreateOwnerRequest,
  UpdateOwnerProfileRequest,
  BankDetails,
  WalletOperationRequest,
  RatingRequest,
  ApiResponse,
  WalletTransaction,
} from "../../types/owner.types"

class OwnerApiService {
  /* ---------- CREATE OWNER ---------- */
  createOwner(data: CreateOwnerRequest) {
    return api.post<ApiResponse<CarOwner>>("/car-owners", data)
      .then(res => res.data)
  }

  /* ---------- GET OWNER PROFILE ---------- */
  getOwnerProfile(ownerId: string): Promise<CarOwner> {
    return api
      .get<ApiResponse<CarOwner>>(`/car-owners/${ownerId}`)
      .then(res => {
        if (!res.data.data) {
          throw new Error("Owner data not found")
        }
        return res.data.data
      })
  }



  /* ---------- UPDATE OWNER ---------- */
  updateOwnerProfile(ownerId: string, data: UpdateOwnerProfileRequest) {
    return api.put<ApiResponse<CarOwner>>(`/car-owners/${ownerId}`, data)
      .then(res => res.data)
  }

  /* ---------- BANK DETAILS ---------- */
  getBankDetails(ownerId: string) {
    if (!ownerId) throw new Error("Owner ID not found")

    return api.get<ApiResponse<BankDetails>>(
      `/car-owners/${ownerId}/bank`
    ).then(res => res.data)
  }

  updateBankDetails(ownerId: string, data: BankDetails) {
    return api.post<ApiResponse<BankDetails>>(
      `/car-owners/${ownerId}/bank`,
      data
    ).then(res => res.data)
  }

  /* ---------- KYC ---------- */
  uploadKYCDocuments(ownerId: string, documents: any) {
    const formData = new FormData()

    Object.entries(documents).forEach(([key, file]: any) => {
      formData.append(key, {
        uri: file.uri,
        type: file.type || "image/jpeg",
        name: file.fileName || `${key}.jpg`,
      } as any)
    })

    return api.post(`/car-owners/${ownerId}/kyc`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }).then(res => res.data)
  }

  /* ---------- WALLET ---------- */
  addToWallet(ownerId: string, data: WalletOperationRequest) {
    return api.post(`/car-owners/${ownerId}/wallet/add`, data)
      .then(res => res.data)
  }

  getWalletTransactions(ownerId: string) {
    return api.get<ApiResponse<WalletTransaction[]>>(
      `/car-owners/${ownerId}/wallet/transactions`
    ).then(res => res.data)
  }

  /* ---------- EARNINGS ---------- */
  getEarningsSummary(ownerId: string) {
    return api.get(`/car-owners/${ownerId}/earnings`)
      .then(res => res.data)
  }
  /* ---------- WITHDRAW ---------- */
  withdrawFromWallet(ownerId: string, data: WalletOperationRequest) {
    return api.post(
      `/car-owners/${ownerId}/wallet/withdraw`,
      data
    ).then(res => res.data)
  }

}

export const ownerApiService = new OwnerApiService()
