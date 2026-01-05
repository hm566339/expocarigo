"use client"

import type React from "react"

import { View, Text, StyleSheet } from "react-native"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import { useTheme } from "../context/ThemeContext"

interface TrustScoreBadgeProps {
  score: number
  size?: "small" | "medium" | "large"
}

export const TrustScoreBadge: React.FC<TrustScoreBadgeProps> = ({ score, size = "medium" }) => {
  const { colors } = useTheme()

  const getColor = () => {
    if (score >= 80) return colors.success
    if (score >= 60) return colors.warning
    return colors.error
  }

  const getSize = () => {
    if (size === "small") return { container: 24, icon: 12, text: 10 }
    if (size === "large") return { container: 48, icon: 20, text: 16 }
    return { container: 32, icon: 16, text: 14 }
  }

  const sizes = getSize()
  const color = getColor()

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: color + "20",
          paddingHorizontal: sizes.container * 0.375,
          paddingVertical: sizes.container * 0.1875,
          borderRadius: sizes.container * 0.25,
        },
      ]}
    >
      <Icon name="shield-check" size={sizes.icon} color={color} />
      <Text style={[styles.score, { color, fontSize: sizes.text }]}>{score}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  score: {
    fontWeight: "700",
  },
})
