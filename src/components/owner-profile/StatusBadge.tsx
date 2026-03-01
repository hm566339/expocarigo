"use client"

import React from "react"
import { StyleSheet, Text, View } from "react-native"
import { useTheme } from "../../context/ThemeContext"

interface StatusBadgeProps {
  status: "pending" | "approved" | "rejected" | "verified" | "unverified"
  label?: string
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, label }) => {
  const { colors } = useTheme()

  const getStatusConfig = () => {
    switch (status) {
      case "approved":
      case "verified":
        return {
          bg: colors.success + "20",
          color: colors.success,
          text: label || "Verified",
        }
      case "rejected":
        return {
          bg: colors.error + "20",
          color: colors.error,
          text: label || "Rejected",
        }
      case "pending":
        return {
          bg: colors.warning + "20",
          color: colors.warning,
          text: label || "Pending",
        }
      case "unverified":
        return {
          bg: colors.textTertiary + "20",
          color: colors.textTertiary,
          text: label || "Unverified",
        }
    }
  }

  const config = getStatusConfig()

  return (
    <View style={[styles.badge, { backgroundColor: config.bg }]}>
      <View style={[styles.dot, { backgroundColor: config.color }]} />
      <Text style={[styles.text, { color: config.color }]}>{config.text}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  text: {
    fontSize: 12,
    fontWeight: "600",
  },
})
