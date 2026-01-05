"use client"

import type React from "react"

import { TouchableOpacity, Text, ActivityIndicator, StyleSheet } from "react-native"
import { useTheme } from "../../context/ThemeContext"

interface ButtonProps {
  title: string
  onPress: () => void
  variant?: "primary" | "secondary" | "outline"
  disabled?: boolean
  loading?: boolean
  fullWidth?: boolean
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = "primary",
  disabled = false,
  loading = false,
  fullWidth = false,
}) => {
  const { colors } = useTheme()

  const getBackgroundColor = () => {
    if (disabled) return colors.disabled
    if (variant === "primary") return colors.primary
    if (variant === "secondary") return colors.secondary
    return "transparent"
  }

  const getTextColor = () => {
    if (disabled) return colors.textSecondary
    if (variant === "outline") return colors.primary
    return "#FFFFFF"
  }

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: getBackgroundColor(),
          borderColor: variant === "outline" ? colors.primary : "transparent",
          borderWidth: variant === "outline" ? 2 : 0,
          width: fullWidth ? "100%" : "auto",
        },
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} />
      ) : (
        <Text style={[styles.buttonText, { color: getTextColor() }]}>{title}</Text>
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 56,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
  },
})
