import { VEHICLE_ENDPOINTS } from "../../config/api.config";
import {
  AddVehicleRequest,
  AvailabilityRequest,
  AvailabilitySlotDto,
  PriceQuoteDto,
  PriceQuoteRequest,
  UserAndVehicleVerifyRequest,
  VehicleDto,
} from "../../types/vehicle.types";
import ApiService from "../api.service";

class VehicleService {
  /* =========================================================
     CREATE VEHICLE (MULTIPART | POST)
  ========================================================= */
  async createVehicle(userId: string, data: AddVehicleRequest): Promise<void> {
    const formData = this.buildFormData(data);

    await ApiService.upload(
      VEHICLE_ENDPOINTS.CREATE_VEHICLE(userId),
      formData,
      "POST",
    );
  }

  /* =========================================================
     UPDATE VEHICLE (MULTIPART | PUT)
  ========================================================= */
  async updateVehicle(
    vehicleId: string,
    data: Partial<AddVehicleRequest>,
  ): Promise<VehicleDto> {
    const formData = this.buildFormData(data);

    return ApiService.upload(
      VEHICLE_ENDPOINTS.UPDATE_VEHICLE(vehicleId),
      formData,
      "PUT",
    );
  }

  /* =========================================================
     GET VEHICLE BY ID
  ========================================================= */
  getVehicle(vehicleId: string): Promise<VehicleDto> {
    return ApiService.get(VEHICLE_ENDPOINTS.GET_VEHICLE(vehicleId));
  }

  /* =========================================================
     GET VEHICLES BY USER
  ========================================================= */
  getVehiclesByUser(userId: string): Promise<VehicleDto[]> {
    return ApiService.get(VEHICLE_ENDPOINTS.GET_BY_USER(userId));
  }

  /* =========================================================
     DELETE VEHICLE
  ========================================================= */
  deleteVehicle(vehicleId: string): Promise<void> {
    return ApiService.delete(VEHICLE_ENDPOINTS.DELETE_VEHICLE(vehicleId));
  }

  /* =========================================================
     VERIFY USER + VEHICLE
  ========================================================= */
  verifyUserAndVehicle(payload: UserAndVehicleVerifyRequest): Promise<boolean> {
    return ApiService.post(VEHICLE_ENDPOINTS.VERIFY_USER_VEHICLE, payload);
  }

  /* =========================================================
     CHECK IF VEHICLE EXISTS
  ========================================================= */
  checkVehicleExists(vehicleNumber: string): Promise<boolean> {
    return ApiService.get(VEHICLE_ENDPOINTS.CHECK_EXISTS(vehicleNumber));
  }

  /* =========================================================
     AVAILABILITY
  ========================================================= */
  getAvailability(
    vehicleId: string,
    from: string,
    to: string,
  ): Promise<AvailabilitySlotDto[]> {
    return ApiService.get(
      VEHICLE_ENDPOINTS.GET_AVAILABILITY(vehicleId, from, to),
    );
  }

  addAvailability(
    vehicleId: string,
    payload: AvailabilityRequest,
  ): Promise<AvailabilitySlotDto> {
    return ApiService.post(
      VEHICLE_ENDPOINTS.ADD_AVAILABILITY(vehicleId),
      payload,
    );
  }

  /* =========================================================
     PRICE QUOTE
  ========================================================= */
  getPriceQuote(
    vehicleId: string,
    payload: PriceQuoteRequest,
  ): Promise<PriceQuoteDto> {
    return ApiService.post(
      VEHICLE_ENDPOINTS.GET_PRICE_QUOTE(vehicleId),
      payload,
    );
  }

  /* =========================================================
     GET ALL VEHICLES (PAGINATED)
  ========================================================= */
  getAllVehicles(page = 0, size = 20): Promise<VehicleDto[]> {
    return ApiService.get(VEHICLE_ENDPOINTS.LIST_ALL(page, size));
  }

  /* =========================================================
     SEARCH VEHICLES BY CITY / KEYWORD
  ========================================================= */
  searchVehicles(keyword: string): Promise<VehicleDto[]> {
    return ApiService.get(VEHICLE_ENDPOINTS.SEARCH(keyword));
  }

  /* =========================================================
     MAINTENANCE MANAGEMENT
  ========================================================= */
  addMaintenance(vehicleId: string, payload: any): Promise<any> {
    return ApiService.post(
      VEHICLE_ENDPOINTS.ADD_MAINTENANCE(vehicleId),
      payload,
    );
  }

  checkMaintenance(
    vehicleId: string,
    start: string,
    end: string,
  ): Promise<boolean> {
    return ApiService.get(
      VEHICLE_ENDPOINTS.CHECK_MAINTENANCE(vehicleId, start, end),
    );
  }

  /* =========================================================
     VERIFY VEHICLE
  ========================================================= */
  verifyVehicle(vehicleId: string): Promise<boolean> {
    return ApiService.get(VEHICLE_ENDPOINTS.VERIFY_VEHICLE(vehicleId));
  }

  /* =========================================================
     PRIVATE: FORM DATA BUILDER (RN + EXPO SAFE)
  ========================================================= */
  private buildFormData(data: any): FormData {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (value === undefined || value === null) return;

      // 📍 LOCATION → SEND NESTED FIELDS (SPRING SAFE)
      if (key === "location" && typeof value === "object") {
        Object.entries(value).forEach(([locKey, locValue]) => {
          if (locValue !== undefined && locValue !== null) {
            formData.append(`location.${locKey}`, String(locValue));
          }
        });
        return;
      }

      // 📁 MULTIPLE FILES (IMAGES)
      if (Array.isArray(value)) {
        value.forEach((file, index) => {
          if (!file?.uri) return;

          formData.append(key, {
            uri: file.uri,
            name: file.fileName || `image_${index}.jpg`,
            type: file.mimeType || "image/jpeg",
          } as any);
        });
        return;
      }

      // 📸 SINGLE FILE (IMAGE / VIDEO)
      if (value?.uri) {
        formData.append(key, {
          uri: value.uri,
          name: value.fileName || "file",
          type: value.mimeType || "application/octet-stream",
        } as any);
        return;
      }

      // 🔤 PRIMITIVE VALUES
      formData.append(key, String(value));
    });

    return formData;
  }
}

export default new VehicleService();
