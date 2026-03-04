/**
 * API Configuration
 * Centralized API configuration for the CARIGO app
 */

export const API_CONFIG = {
  // BASE_URL: "https://leatrice-inapposite-foster.ngrok-free.dev",
  // BASE_URL: "http://10.0.2.2:9000",
  BASE_URL: "https://api.carigo.xyz/ms",
  TIMEOUT: 30000,
  ENDPOINTS: {
    AUTH: {
      REGISTER: "/user/register",
      LOGIN: "/user/login",
      SEND_OTP: "/user/send-otp",
      VERIFY_OTP: "/user/verify-otp",
    },
  },
};

/* ================= STORAGE KEYS ================= */
/**
 * IMPORTANT:
 * Expo SecureStore allows ONLY:
 * a-z A-Z 0-9 . - _
 * ❌ NO @
 */
export const STORAGE_KEYS = {
  ACCESS_TOKEN: "carigo.access_token",
  REFRESH_TOKEN: "carigo.refresh_token",
  USER_DATA: "carigo.user_data",
  USER_ROLE: "carigo.user_role",
};

/* ================= VEHICLE ENDPOINTS ================= */

export const VEHICLE_ENDPOINTS = {
  CREATE_VEHICLE: (userId: string) => `/vehicles/create/${userId}`,
  UPDATE_VEHICLE: (vehicleId: string) => `/vehicles/${vehicleId}`,
  GET_VEHICLE: (id: string) => `/vehicles/${id}`,
  GET_BY_USER: (userId: string) => `/vehicles/by-number/${userId}`,
  LIST_ALL: (page = 0, size = 20) => `/vehicles/all?page=${page}&size=${size}`,
  DELETE_VEHICLE: (vehicleId: string) => `/vehicles/${vehicleId}`,
  VERIFY_VEHICLE: (id: string) => `/vehicles/${id}/verify`,
  CHECK_EXISTS: (vehicleNumber: string) =>
    `/vehicles/exitvehicle/${vehicleNumber}`,
  VERIFY_USER_VEHICLE: `/vehicles/userandvehicle`,
  GET_AVAILABILITY: (id: string, from: string, to: string) =>
    `/vehicles/${id}/availability?from=${from}&to=${to}`,
  ADD_AVAILABILITY: (id: string) => `/vehicles/${id}/availability`,
  GET_PRICE_QUOTE: (id: string) => `/vehicles/${id}/quote`,
  ADD_MAINTENANCE: (id: string) => `/vehicles/${id}/maintenance`,
  CHECK_MAINTENANCE: (id: string, start: string, end: string) =>
    `/vehicles/${id}/maintenance/check?start=${start}&end=${end}`,
  SEARCH: (keyword: string) =>
    `/vehicles/search?keyword=${encodeURIComponent(keyword)}`,
  GET_VEHICLE_all: `/vehicles/all`,
};

/* ================= CAR OWNER ENDPOINTS ================= */
export const CAR_OWNER_ENDPOINTS = {
  CREATE_OWNER: "/car-owners",
  GET_OWNER: (id: string) => `/car-owners/${id}`,
  UPDATE_PROFILE: (id: string) => `/car-owners/${id}`,

  // KYC Upload
  UPLOAD_AADHAAR_FRONT: (id: string) =>
    `/car-owners/${id}/upload/aadhaar-front`,
  UPLOAD_AADHAAR_BACK: (id: string) => `/car-owners/${id}/upload/aadhaar-back`,
  UPLOAD_SELFIE: (id: string) => `/car-owners/${id}/upload/selfie`,
  UPLOAD_DL: (id: string) => `/car-owners/${id}/upload/driving-license`,

  // KYC Get URLs
  GET_AADHAAR_FRONT: (id: string) => `/car-owners/${id}/aadhaar-front-url`,
  GET_AADHAAR_BACK: (id: string) => `/car-owners/${id}/aadhaar-back-url`,
  GET_SELFIE: (id: string) => `/car-owners/${id}/selfie-url`,
  GET_DL: (id: string) => `/car-owners/${id}/driving-license-url`,

  // Wallet
  ADD_WALLET: (id: string) => `/car-owners/${id}/wallet/add`,
  DEDUCT_WALLET: (id: string) => `/car-owners/${id}/wallet/deduct`,
  WITHDRAW_WALLET: (id: string) => `/car-owners/${id}/wallet/withdraw`,
  GET_TRANSACTIONS: (id: string) => `/car-owners/${id}/wallet/transactions`,

  // Bank / Rating / Earnings
  UPDATE_BANK: (id: string) => `/car-owners/${id}/bank`,
  ADD_RATING: (id: string) => `/car-owners/${id}/rating`,
  GET_EARNINGS: (id: string) => `/car-owners/${id}/earnings`,
  GET_OWNER_DASHBORD: `/dashboard/owner`,
};

/* ================= RENTER ENDPOINTS ================= */

export const RENTER_ENDPOINTS = {
  // Profile
  CREATE_RENTER: "/renters",
  GET_RENTER: (id: string) => `/renters/${id}`,
  UPDATE_PROFILE: (id: string) => `/renters/${id}`,

  // Search Vehicles
  SEARCH_VEHICLES: (from: string, to: string) =>
    `/renters/search?from=${from}&to=${to}`,

  // Booking
  BOOK_VEHICLE: "/renters/book",
  GET_BOOKINGS: (id: string) => `/renters/${id}/bookings`,
  GET_RENTER_DASHBORD: `/dashboard/renter`,
};
