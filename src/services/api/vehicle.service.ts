import { VEHICLE_ENDPOINTS } from "../../config/api.config"
import {
  AddVehicleRequest,
  AvailabilityRequest,
  AvailabilitySlotDto,
  PriceQuoteDto,
  PriceQuoteRequest,
  UserAndVehicleVerifyRequest,
  VehicleDto,
} from "../../types/vehicle.types"
import ApiService from "../api.service"

class VehicleService {
  /* =========================================================
     CREATE VEHICLE (MULTIPART | POST)
  ========================================================= */
  async createVehicle(
    userId: string,
    data: AddVehicleRequest
  ): Promise<void> {
    const formData = this.buildFormData(data)

    await ApiService.upload(
      VEHICLE_ENDPOINTS.CREATE_VEHICLE(userId),
      formData,
      "POST"
    )
  }

  /* =========================================================
     UPDATE VEHICLE (MULTIPART | PUT)
  ========================================================= */
  async updateVehicle(
    vehicleId: string,
    data: Partial<AddVehicleRequest>
  ): Promise<VehicleDto> {
    const formData = this.buildFormData(data)

    return ApiService.upload(
      VEHICLE_ENDPOINTS.UPDATE_VEHICLE(vehicleId),
      formData,
      "PUT"
    )
  }

  /* =========================================================
     GET VEHICLE BY ID
  ========================================================= */
  getVehicle(vehicleId: string): Promise<VehicleDto> {
    return ApiService.get(
      VEHICLE_ENDPOINTS.GET_VEHICLE(vehicleId)
    )
  }

  /* =========================================================
     GET VEHICLES BY USER
  ========================================================= */
  getVehiclesByUser(userId: string): Promise<VehicleDto[]> {
    return ApiService.get(
      VEHICLE_ENDPOINTS.GET_BY_USER(userId)
    )
  }

  /* =========================================================
     DELETE VEHICLE
  ========================================================= */
  deleteVehicle(vehicleId: string): Promise<void> {
    return ApiService.delete(
      VEHICLE_ENDPOINTS.DELETE_VEHICLE(vehicleId)
    )
  }

  /* =========================================================
     VERIFY USER + VEHICLE
  ========================================================= */
  verifyUserAndVehicle(
    payload: UserAndVehicleVerifyRequest
  ): Promise<boolean> {
    return ApiService.post(
      VEHICLE_ENDPOINTS.VERIFY_USER_VEHICLE,
      payload
    )
  }

  /* =========================================================
     AVAILABILITY
  ========================================================= */
  getAvailability(
    vehicleId: string,
    from: string,
    to: string
  ): Promise<AvailabilitySlotDto[]> {
    return ApiService.get(
      VEHICLE_ENDPOINTS.GET_AVAILABILITY(vehicleId, from, to)
    )
  }

  addAvailability(
    vehicleId: string,
    payload: AvailabilityRequest
  ): Promise<AvailabilitySlotDto> {
    return ApiService.post(
      VEHICLE_ENDPOINTS.ADD_AVAILABILITY(vehicleId),
      payload
    )
  }

  /* =========================================================
     PRICE QUOTE
  ========================================================= */
  getPriceQuote(
    vehicleId: string,
    payload: PriceQuoteRequest
  ): Promise<PriceQuoteDto> {
    return ApiService.post(
      VEHICLE_ENDPOINTS.GET_PRICE_QUOTE(vehicleId),
      payload
    )
  }

  /* =========================================================
     PRIVATE: FORM DATA BUILDER (RN SAFE)
  ========================================================= */
  private buildFormData(data: any): FormData {
    const formData = new FormData()

    Object.entries(data).forEach(([key, value]) => {
      if (value === undefined || value === null) return

      // 📁 Multiple files (images)
      if (Array.isArray(value)) {
        value.forEach((file) => {
          if (!file?.uri) return
          formData.append(key, {
            uri: file.uri,
            name: file.fileName || "image.jpg",
            type: file.type || "image/jpeg",
          } as any)
        })
        return
      }

      // 📸 Single file (video)
      if (value?.uri) {
        formData.append(key, {
          uri: value.uri,
          name: value.fileName || "video.mp4",
          type: value.type || "video/mp4",
        } as any)
        return
      }

      // 🔤 Normal fields
      formData.append(key, String(value))
    })

    return formData
  }
}

export default new VehicleService()
