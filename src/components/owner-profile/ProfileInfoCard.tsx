"use client"

import React from "react"
import { StyleSheet, Text, View } from "react-native"
import { useTheme } from "../../context/ThemeContext"

interface ProfileInfoCardProps {
  label: string
  value: string | number
  icon?: React.ReactNode
}

export const ProfileInfoCard: React.FC<ProfileInfoCardProps> = ({ label, value, icon }) => {
  const { colors } = useTheme()

  return (
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      {icon && <View style={styles.iconContainer}>{icon}</View>}
      <View style={styles.content}>
        <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text>
        <Text style={[styles.value, { color: colors.text }]}>{value || "—"}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  iconContainer: {
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  label: {
    fontSize: 13,
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    fontWeight: "600",
  },
})
