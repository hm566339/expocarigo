import { create } from "zustand"
import type { RenterProfile } from "../../../types/index"
import profileService from "../../renters/services/profile.service"

interface ProfileState {
  profile: RenterProfile | null
  isLoading: boolean
  error: string | null

  // Actions
  fetchProfile: () => Promise<void>
  updateProfile: (data: any) => Promise<void>
  uploadAadhaarFront: (fileUri: string, renterId: string) => Promise<void>
  uploadAadhaarBack: (fileUri: string, renterId: string) => Promise<void>
  uploadDrivingLicense: (fileUri: string, renterId: string) => Promise<void>
  uploadSelfie: (fileUri: string, renterId: string) => Promise<void>
  verifyKYC: (renterId: string) => Promise<void>
  clearError: () => void
}

export const useProfileStore = create<ProfileState>((set) => ({
  profile: null,
  isLoading: false,
  error: null,

  fetchProfile: async () => {
    set({ isLoading: true, error: null })
    try {
      const profile = await profileService.getRenterProfile()
      set({ profile, isLoading: false })
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || "Failed to fetch profile"
      set({ error: errorMessage, isLoading: false })
    }
  },

  updateProfile: async (data: any) => {
    set({ isLoading: true, error: null })
    try {
      const profile = await profileService.updateProfile(data)
      set({ profile, isLoading: false })
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || "Failed to update profile"
      set({ error: errorMessage, isLoading: false })
      throw error
    }
  },

  uploadAadhaarFront: async (fileUri: string, renterId: string) => {
    set({ isLoading: true, error: null })
    try {
      await profileService.uploadAadhaarFront(fileUri, renterId)
      set({ isLoading: false })
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || "Failed to upload Aadhaar front"
      set({ error: errorMessage, isLoading: false })
      throw error
    }
  },

  uploadAadhaarBack: async (fileUri: string, renterId: string) => {
    set({ isLoading: true, error: null })
    try {
      await profileService.uploadAadhaarBack(fileUri, renterId)
      set({ isLoading: false })
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || "Failed to upload Aadhaar back"
      set({ error: errorMessage, isLoading: false })
      throw error
    }
  },

  uploadDrivingLicense: async (fileUri: string, renterId: string) => {
    set({ isLoading: true, error: null })
    try {
      await profileService.uploadDrivingLicense(fileUri, renterId)
      set({ isLoading: false })
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || "Failed to upload driving license"
      set({ error: errorMessage, isLoading: false })
      throw error
    }
  },

  uploadSelfie: async (fileUri: string, renterId: string) => {
    set({ isLoading: true, error: null })
    try {
      await profileService.uploadSelfie(fileUri, renterId)
      set({ isLoading: false })
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || "Failed to upload selfie"
      set({ error: errorMessage, isLoading: false })
      throw error
    }
  },

  verifyKYC: async (renterId: string) => {
    set({ isLoading: true, error: null })
    try {
      await profileService.verifyKYC(renterId)
      set({ isLoading: false })
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || "Failed to verify KYC"
      set({ error: errorMessage, isLoading: false })
      throw error
    }
  },

  clearError: () => set({ error: null }),
}))
