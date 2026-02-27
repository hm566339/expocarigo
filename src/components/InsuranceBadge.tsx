"use client"

import React from "react"

import { StyleSheet, Text, View } from "react-native"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import { useTheme } from "../context/ThemeContext"

export const InsuranceBadge: React.FC = () => {
  const { colors } = useTheme()

  return (
    <View style={[styles.container, { backgroundColor: colors.primary + "20", borderColor: colors.primary }]}>
      <Icon name="shield-check" size={16} color={colors.primary} />
      <Text style={[styles.text, { color: colors.primary }]}>Insured</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    gap: 6,
  },
  text: {
    fontSize: 12,
    fontWeight: "600",
  },
})
