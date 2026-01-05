"use client"

import type React from "react"
import { View, Text, StyleSheet } from "react-native"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import { useTheme } from "../../context/ThemeContext"

interface InsuranceBadgeProps {
  isInsured: boolean
  size?: "small" | "medium"
}

export const InsuranceBadge: React.FC<InsuranceBadgeProps> = ({ isInsured, size = "medium" }) => {
  const { colors } = useTheme()
  const isSmall = size === "small"

  const config = isInsured
    ? {
        color: "#10B981",
        icon: "shield-check",
        label: "Insured",
      }
    : {
        color: "#EF4444",
        icon: "shield-off",
        label: "Not Insured",
      }

  return (
    <View style={[styles.badge, { backgroundColor: config.color + "15", borderColor: config.color }]}>
      <Icon name={config.icon} size={isSmall ? 14 : 16} color={config.color} />
      <Text style={[styles.label, { color: config.color, fontSize: isSmall ? 11 : 13 }]}>{config.label}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    gap: 4,
  },
  label: {
    fontWeight: "600",
  },
})
