
import { create } from "zustand"
import { getRoleFromToken } from "../../utils/jwt-decode"
import StorageService from "../storage.service"

type Role = "USER" | "ADMIN"

type AuthState = {
    token: string | null
    role: Role | null
    loading: boolean

    login: (token: string) => Promise<void>
    logout: () => Promise<void>
    loadFromStorage: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
    token: null,
    role: null,
    loading: true,

    login: async (token) => {
        const role = getRoleFromToken(token)

        await StorageService.setItem("@carigo_access_token", token)

        set({ token, role })
    },

    logout: async () => {
        await StorageService.clearAuthData()
        set({ token: null, role: null })
    },

    loadFromStorage: async () => {
        const token = await StorageService.getItem("@carigo_access_token")

        if (token) {
            const role = getRoleFromToken(token)
            set({ token, role, loading: false })
        } else {
            set({ loading: false })
        }
    },
}))
