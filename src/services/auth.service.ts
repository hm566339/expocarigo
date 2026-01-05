import { API_CONFIG } from "../config/api.config"
import type { LoginRequest, RegisterRequest } from "../types/auth.types"
import api from "./api.service"

class AuthService {
  login(data: LoginRequest): Promise<string> {
    return api.post(API_CONFIG.ENDPOINTS.AUTH.LOGIN, data)
  }

  register(data: RegisterRequest): Promise<string> {
    return api.post(API_CONFIG.ENDPOINTS.AUTH.REGISTER, data)
  }

  /* ================= SEND OTP ================= */
  sendOTP(email: string): Promise<string> {
    console.log(email)
    return api.post(API_CONFIG.ENDPOINTS.AUTH.SEND_OTP, { email })
  }

  /* ================= VERIFY OTP + RESET PASSWORD ================= */
  verifyOTP(payload: {
    email: string
    otp: string
    newPassword: string
  }): Promise<string> {
    console.log(payload)
    return api.post(API_CONFIG.ENDPOINTS.AUTH.VERIFY_OTP, payload)
  }
}

export default new AuthService()
