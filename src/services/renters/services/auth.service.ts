import { DUMMY_AUTH_RESPONSE } from "../../../data/dummy.data"
import type { AuthResponse, LoginRequest, RegisterRequest, VerifyOTPRequest } from "../../../types/index"

class AuthService {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    if (credentials.email === "raj@example.com" && credentials.password === "password123") {
      return DUMMY_AUTH_RESPONSE
    }

    throw new Error("Invalid credentials. Try: raj@example.com / password123")
  }

  async register(data: RegisterRequest): Promise<AuthResponse> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return {
      ...DUMMY_AUTH_RESPONSE,
      renter: {
        ...DUMMY_AUTH_RESPONSE.renter,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
      },
    }
  }

  async sendOTP(email: string): Promise<any> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 600))

    return {
      success: true,
      message: "OTP sent successfully",
      otp: "123456", // For demo purposes
    }
  }

  async verifyOTP(data: VerifyOTPRequest): Promise<any> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 700))

    if (data.otp === "123456") {
      return {
        success: true,
        message: "OTP verified successfully",
      }
    }

    throw new Error("Invalid OTP")
  }
}

export default new AuthService()
