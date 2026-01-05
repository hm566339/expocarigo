// // src/context/AuthContext.tsx

// import { jwtDecode } from "jwt-decode"
// import React, { createContext, useContext, useEffect, useState } from "react"
// import AuthService from "../services/auth.service"
// import StorageService from "../services/storage.service"
// import type {
//   AuthContextType,
//   LoginRequest,
//   RegisterRequest,
//   User,
// } from "../types/auth.types"

// type JwtPayload = {
//   id: number
//   name: string
//   email: string
//   role: "OWNER" | "REANT" | "ADMIN"
//   exp?: number
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined)

// export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
//   const [user, setUser] = useState<User | null>(null)
//   const [token, setToken] = useState<string | null>(null)
//   const [isLoading, setIsLoading] = useState(true)

//   /* ---------- LOAD AUTH ---------- */
//   useEffect(() => {
//     const loadAuth = async () => {
//       const { token, user } = await StorageService.getAuthData()

//       if (token && user) {
//         const decoded = jwtDecode<JwtPayload>(token)
//         if (!decoded.exp || decoded.exp * 1000 > Date.now()) {
//           setToken(token)
//           setUser(user)
//         } else {
//           await StorageService.clearAuthData()
//         }
//       }
//       setIsLoading(false)
//     }

//     loadAuth()
//   }, [])

//   /* ---------- LOGIN ---------- */
//   const login = async (credentials: LoginRequest) => {
//     const token = await AuthService.login(credentials)

//     if (!token) {
//       throw new Error("Login failed: token not received")
//     }

//     const decoded = jwtDecode<JwtPayload>(token)

//     const userData: User = {
//       id: decoded.id,        // ✅ OWNER ID
//       name: decoded.name,
//       email: decoded.email,
//       role: decoded.role,    // ✅ ROLE FROM TOKEN
//     }
//     console.log(userData.role);
//     await StorageService.setAuthData(token, userData)
//     setToken(token)
//     setUser(userData)
//   }

//   /* ---------- REGISTER ---------- */
//   const register = async (data: RegisterRequest) => {
//     const token = await AuthService.register(data)

//     if (!token) {
//       throw new Error("Registration failed")
//     }

//     const decoded = jwtDecode<JwtPayload>(token)

//     const userData: User = {
//       id: decoded.id,
//       name: decoded.name,
//       email: decoded.email,
//       role: decoded.role,
//     }

//     await StorageService.setAuthData(token, userData)
//     setToken(token)
//     setUser(userData)
//   }

//   const logout = async () => {
//     await StorageService.clearAuthData()
//     setToken(null)
//     setUser(null)
//   }

//   /* ---------- SEND OTP ---------- */
//   const sendOTP = async (email: string): Promise<void> => {
//     await AuthService.sendOTP(email)
//   }


//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         token,
//         isLoading,
//         isAuthenticated: !!token && !!user,
//         login,
//         register,
//         logout,
//         sendOTP: async () => { sendOTP },
//         verifyOTP: async () => { },
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   )
// }

// export const useAuth = () => {
//   const ctx = useContext(AuthContext)
//   if (!ctx) throw new Error("useAuth must be used inside AuthProvider")
//   return ctx
// }


import { jwtDecode } from "jwt-decode"
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react"
import AuthService from "../services/auth.service"
import StorageService from "../services/storage.service"
import type {
  AuthContextType,
  LoginRequest,
  RegisterRequest,
  User,
  VerifyOTPRequest,
} from "../types/auth.types"

type JwtPayload = {
  id: number
  name: string
  email: string
  role: "OWNER" | "REANT" | "ADMIN"
  exp?: number
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  /* ---------- LOAD AUTH ---------- */
  useEffect(() => {
    const loadAuth = async () => {
      const { token, user } = await StorageService.getAuthData()

      if (token && user) {
        try {
          const decoded = jwtDecode<JwtPayload>(token)

          if (!decoded.exp || decoded.exp * 1000 > Date.now()) {
            setToken(token)
            setUser(user)
          } else {
            await StorageService.clearAuthData()
          }
        } catch {
          await StorageService.clearAuthData()
        }
      }

      setIsLoading(false)
    }

    loadAuth()
  }, [])

  /* ---------- LOGIN ---------- */
  const login = async (credentials: LoginRequest): Promise<void> => {
    const token = await AuthService.login(credentials)

    if (!token) {
      throw new Error("Login failed: token not received")
    }

    const decoded = jwtDecode<JwtPayload>(token)

    const userData: User = {
      id: decoded.id,
      name: decoded.name,
      email: decoded.email,
      role: decoded.role,
    }

    await StorageService.setAuthData(token, userData)
    setToken(token)
    setUser(userData)
  }

  /* ---------- REGISTER ---------- */
  const register = async (data: RegisterRequest): Promise<void> => {
    const token = await AuthService.register(data)

    if (!token) {
      throw new Error("Registration failed")
    }

    const decoded = jwtDecode<JwtPayload>(token)

    const userData: User = {
      id: decoded.id,
      name: decoded.name,
      email: decoded.email,
      role: decoded.role,
    }

    await StorageService.setAuthData(token, userData)
    setToken(token)
    setUser(userData)
  }

  /* ---------- LOGOUT ---------- */
  const logout = async (): Promise<void> => {
    await StorageService.clearAuthData()
    setToken(null)
    setUser(null)
  }

  /* ---------- SEND OTP ---------- */
  const sendOTP = async (email: string): Promise<void> => {
    await AuthService.sendOTP(email)
  }

  /* ---------- VERIFY OTP ---------- */
  const verifyOTP = async (
    data: VerifyOTPRequest
  ): Promise<void> => {
    await AuthService.verifyOTP(data)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!token && !!user,
        login,
        register,
        logout,
        sendOTP,     // ✅ CORRECT
        verifyOTP,   // ✅ CORRECT
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider")
  }
  return ctx
}
