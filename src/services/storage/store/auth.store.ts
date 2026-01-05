import AsyncStorage from "@react-native-async-storage/async-storage"
import { create } from "zustand"
import authService from "../../../services/renters/services/auth.service"
import type { LoginRequest, RegisterRequest, User } from "../../../types/index"

interface AuthState {
  user: User | null
  token: string | null
  isLoading: boolean
  error: string | null
  isInitialized: boolean

  // Actions
  login: (credentials: LoginRequest) => Promise<void>
  register: (data: RegisterRequest) => Promise<void>
  logout: () => Promise<void>
  initAuth: () => Promise<void>
  clearError: () => void
  sendOTP: (email: string) => Promise<void>
  verifyOTPAndReset: (email: string, otp: string, newPassword: string) => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isLoading: false,
  error: null,
  isInitialized: false,

  initAuth: async () => {
    try {
      const token = await AsyncStorage.getItem("authToken")
      const userStr = await AsyncStorage.getItem("user")

      if (token && userStr) {
        const user = JSON.parse(userStr)
        set({ user, token, isInitialized: true })
      } else {
        set({ isInitialized: true })
      }
    } catch (error) {
      console.log("Auth init error:", error)
      set({ isInitialized: true })
    }
  },

  login: async (credentials: LoginRequest) => {
    set({ isLoading: true, error: null })
    try {
      const response = await authService.login(credentials)
      await AsyncStorage.setItem("authToken", response.token)
      await AsyncStorage.setItem("user", JSON.stringify(response.user))
      set({ user: response.user, token: response.token, isLoading: false })
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || "Login failed"
      set({ error: errorMessage, isLoading: false })
      throw error
    }
  },

  register: async (data: RegisterRequest) => {
    set({ isLoading: true, error: null })
    try {
      const response = await authService.register(data)
      await AsyncStorage.setItem("authToken", response.token)
      await AsyncStorage.setItem("user", JSON.stringify(response.user))
      set({ user: response.user, token: response.token, isLoading: false })
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || "Registration failed"
      set({ error: errorMessage, isLoading: false })
      throw error
    }
  },

  logout: async () => {
    await AsyncStorage.removeItem("authToken")
    await AsyncStorage.removeItem("user")
    set({ user: null, token: null })
  },

  sendOTP: async (email: string) => {
    set({ isLoading: true, error: null })
    try {
      await authService.sendOTP(email)
      set({ isLoading: false })
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || "Failed to send OTP"
      set({ error: errorMessage, isLoading: false })
      throw error
    }
  },

  verifyOTPAndReset: async (email: string, otp: string, newPassword: string) => {
    set({ isLoading: true, error: null })
    try {
      await authService.verifyOTP({ email, otp, newPassword })
      set({ isLoading: false })
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || "OTP verification failed"
      set({ error: errorMessage, isLoading: false })
      throw error
    }
  },

  clearError: () => set({ error: null }),
}))
