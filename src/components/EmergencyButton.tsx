"use client"

import type React from "react"

import { TouchableOpacity, Text, StyleSheet } from "react-native"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import { useTheme } from "../context/ThemeContext"

interface EmergencyButtonProps {
  onPress: () => void
}

export const EmergencyButton: React.FC<EmergencyButtonProps> = ({ onPress }) => {
  const { colors } = useTheme()

  return (
    <TouchableOpacity style={[styles.button, { backgroundColor: colors.error }]} onPress={onPress} activeOpacity={0.8}>
      <Icon name="phone-alert" size={24} color="#FFFFFF" />
      <Text style={styles.text}>Emergency Help</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  text: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
})
