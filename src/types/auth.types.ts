/**
 * Authentication Type Definitions
 */

/* -------- USER ROLE (BACKEND ENUM MATCH) -------- */
export type UserRole = "ADMIN" | "OWNER" | "REANT"

/* -------- REQUEST TYPES -------- */
export interface RegisterRequest {
  name: string
  email: string
  password: string
  role: UserRole
}

export interface LoginRequest {
  email: string
  password: string
}

export interface SendOTPRequest {
  email: string
}

export interface VerifyOTPRequest {
  email: string
  otp: string
  newPassword: string
}

/* -------- USER MODEL -------- */
export interface User {
  id: number
  name: string
  email: string
  role: UserRole
  profilepictureUrl?: string | null
}

/* -------- AUTH RESPONSE (🔥 FIXED) -------- */
/**
 * Backend response example:
 * {
 *   token: "eyJhbGciOiJSUzI1NiJ9...",
 *   id: 475216,
 *   name: "Mohit Kumar",
 *   email: "hm566339@gmail.com",
 *   role: "OWNER"
 * }
 */
export interface AuthResponse {
  token: string
  id: number
  name: string
  email: string
  role: UserRole
  message?: string
}

/* -------- AUTH CONTEXT -------- */
export interface AuthContextType {
  user: User | null
  token: string | null
  isLoading: boolean
  isAuthenticated: boolean

  login: (credentials: LoginRequest) => Promise<void>
  register: (data: RegisterRequest) => Promise<void>
  logout: () => Promise<void>

  sendOTP: (email: string) => Promise<void>
  verifyOTP: (data: VerifyOTPRequest) => Promise<void>
}
