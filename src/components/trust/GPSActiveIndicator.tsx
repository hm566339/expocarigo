import type React from "react"
import { View, Text, StyleSheet } from "react-native"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"

interface GPSActiveIndicatorProps {
  isActive: boolean
  size?: "small" | "medium"
}

export const GPSActiveIndicator: React.FC<GPSActiveIndicatorProps> = ({ isActive, size = "medium" }) => {
  const isSmall = size === "small"

  const config = isActive
    ? {
        color: "#10B981",
        icon: "map-marker-check",
        label: "GPS Active",
      }
    : {
        color: "#9CA3AF",
        icon: "map-marker-off",
        label: "GPS Off",
      }

  return (
    <View style={[styles.indicator, { backgroundColor: config.color + "15", borderColor: config.color }]}>
      <Icon name={config.icon} size={isSmall ? 14 : 16} color={config.color} />
      <Text style={[styles.label, { color: config.color, fontSize: isSmall ? 11 : 13 }]}>{config.label}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  indicator: {
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
