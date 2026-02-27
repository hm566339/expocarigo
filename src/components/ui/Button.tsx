"use client"

import React from "react"
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity } from "react-native"
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

  const bg =
    disabled
      ? colors.disabled
      : variant === "primary"
        ? colors.primary
        : variant === "secondary"
          ? colors.secondary
          : "transparent"

  const textColor =
    disabled ? colors.textSecondary : variant === "outline" ? colors.primary : "#fff"

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: bg,
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
        <ActivityIndicator color={textColor} />
      ) : (
        <Text style={[styles.text, { color: textColor }]}>{title}</Text>
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    minHeight: 56,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 16,
    fontWeight: "600",
  },
})
