/* ================= ENUMS ================= */

export type BillingMode = "PER_DAY" | "PER_HOUR" | "BOTH";

export type KycStatus = "PENDING" | "VERIFIED" | "FAILED";

export type VehicleStatus = "ACTIVE" | "BLOCKED" | "INACTIVE";

/* ================= LOCATION ================= */

export interface VehicleLocation {
  latitude: number;
  longitude: number;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
}

/* ================= FILE (EXPO IMAGE PICKER) ================= */
/**
 * Expo ImagePicker returns this shape
 */
export interface ExpoFile {
  uri: string;
  name?: string;
  type?: string;
}

/* ================= ADD VEHICLE REQUEST ================= */
/**
 * Used in:
 * VehicleService.createVehicle(userId, payload)
 * Sent as multipart/form-data
 */
export interface AddVehicleRequest {
  vehicleNumber: string;
  ownerName?: string;

  billingMode?: BillingMode;

  ratePerDay?: number;
  ratePerHour?: number;

  location: VehicleLocation;

  // ===== MEDIA (MULTIPART) =====
  rcFrontImage?: ExpoFile | null;
  rcBackImage?: ExpoFile | null;
  vehicleImages?: ExpoFile[];
  vehicleVideo?: ExpoFile | null;
}

/* ================= VEHICLE DTO ================= */
/**
 * Backend → Frontend response
 */
export interface VehicleDto {
  vehicleId: string;
  userId: number;

  vehicleNumber: string;

  ownerName?: string;

  ratePerDay?: number;
  ratePerHour?: number;
  billingMode?: BillingMode;

  // ===== LOCATION =====
  location?: VehicleLocation;

  // ===== MEDIA URLS =====
  rcFrontImageUrl?: string;
  rcBackImageUrl?: string;
  vehicleImageUrls?: string[];
  vehicleVideoUrl?: string | null;

  kycStatus?: KycStatus;
  status?: VehicleStatus;

  createdAt?: string;
  updatedAt?: string;
}

/* ================= AVAILABILITY ================= */

export interface AvailabilityRequest {
  vehicleId: string;
  startTime: string;
  endTime: string;
  available: boolean;
}

export interface AvailabilitySlotDto {
  id: number;
  vehicleId: string;
  startTime: string;
  endTime: string;
  available: boolean;
}

/* ================= PRICE QUOTE ================= */

export interface PriceQuoteRequest {
  startTime: string;
  endTime: string;
  promoCode?: string;
}

export interface PriceQuoteDto {
  baseAmount: number;
  discount: number;
  finalAmount: number;
  currency: string;
  promoCode?: string;
  promoMessage?: string;
}

/* ================= VERIFY USER & VEHICLE ================= */

export interface UserAndVehicleVerifyRequest {
  ownerId: number;
  vehicleId: string;
  preDay: number;
}
