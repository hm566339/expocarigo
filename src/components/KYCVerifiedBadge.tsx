"use client"

import React from "react"

import { StyleSheet, Text, View } from "react-native"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import { useTheme } from "../context/ThemeContext"

export const KYCVerifiedBadge: React.FC = () => {
  const { colors } = useTheme()

  return (
    <View style={[styles.container, { backgroundColor: colors.success + "20" }]}>
      <Icon name="check-decagram" size={14} color={colors.success} />
      <Text style={[styles.text, { color: colors.success }]}>KYC Verified</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  text: {
    fontSize: 11,
    fontWeight: "600",
  },
})
