"use client"

import React from "react"
import { StyleSheet, Text, View } from "react-native"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import { useTheme } from "../../context/ThemeContext"

type KYCStatus = "pending" | "approved" | "rejected"

interface KYCStatusBadgeProps {
  status: KYCStatus
  size?: "small" | "medium"
}

export const KYCStatusBadge: React.FC<KYCStatusBadgeProps> = ({ status, size = "medium" }) => {
  const { colors } = useTheme()

  const getStatusConfig = () => {
    switch (status) {
      case "approved":
        return {
          color: "#10B981",
          icon: "check-circle",
          label: "KYC Verified",
        }
      case "pending":
        return {
          color: "#F59E0B",
          icon: "clock-outline",
          label: "KYC Pending",
        }
      case "rejected":
        return {
          color: "#EF4444",
          icon: "close-circle",
          label: "KYC Rejected",
        }
    }
  }

  const config = getStatusConfig()
  const isSmall = size === "small"

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
