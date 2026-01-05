"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useColorScheme } from "react-native"

type Theme = "light" | "dark"

interface ThemeContextType {
  theme: Theme
  colors: typeof lightColors
  toggleTheme: () => void
}

const lightColors = {
  primary: "#2563EB",
  primaryDark: "#1E40AF",
  secondary: "#10B981",
  background: "#FFFFFF",
  surface: "#F3F4F6",
  surfaceVariant: "#E5E7EB",
  error: "#EF4444",
  warning: "#F59E0B",
  success: "#10B981",
  text: "#111827",
  textSecondary: "#6B7280",
  textTertiary: "#9CA3AF",
  border: "#E5E7EB",
  divider: "#F3F4F6",
  disabled: "#D1D5DB",
  overlay: "rgba(0, 0, 0, 0.5)",
}

const darkColors = {
  primary: "#3B82F6",
  primaryDark: "#2563EB",
  secondary: "#34D399",
  background: "#111827",
  surface: "#1F2937",
  surfaceVariant: "#374151",
  error: "#F87171",
  warning: "#FBBF24",
  success: "#34D399",
  text: "#F9FAFB",
  textSecondary: "#D1D5DB",
  textTertiary: "#9CA3AF",
  border: "#374151",
  divider: "#1F2937",
  disabled: "#4B5563",
  overlay: "rgba(0, 0, 0, 0.7)",
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemTheme = useColorScheme()

  const [theme, setTheme] = useState<Theme>(
    systemTheme === "dark" ? "dark" : "light"
  )

  useEffect(() => {
    if (systemTheme === "dark" || systemTheme === "light") {
      setTheme(systemTheme)
    }
  }, [systemTheme])

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"))
  }

  const colors = theme === "light" ? lightColors : darkColors

  return (
    <ThemeContext.Provider value={{ theme, colors, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider")
  }
  return context
}
