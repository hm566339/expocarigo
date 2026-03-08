// src/navigation/shared/navigation.constants.ts

export const ROOT_ROUTES = {
  AUTH: "Auth",
  OWNER_APP: "OwnerApp",
  RENTER_APP: "RenterApp",
} as const;

export const AUTH_ROUTES = {
  LOGIN: "Login",
  REGISTER: "Register",
  FORGOT_PASSWORD: "ForgotPassword",
  OTP_VERIFICATION: "OTPVerification",
} as const;

export const OWNER_ROUTES = {
  DASHBOARD: "Dashboard",
  MY_CARS: "MyCars",
  TRIPS: "Trips",
  EARNINGS: "Earnings",
  PROFILE: "Profile",
} as const;

export const RENTER_ROUTES = {
  HOME: "Home",
  SEARCH: "Search",
  BOOKINGS: "Bookings",
  PROFILE: "Profile",
} as const;

export const SAFETY_ROUTES = {
  LIVE_TRACKING: "LiveTracking",
  EMERGENCY_SOS: "EmergencySOS",
  TRUST_SCORE: "TrustScore",
  PRE_TRIP_PHOTOS: "PreTripPhotos",
} as const;
