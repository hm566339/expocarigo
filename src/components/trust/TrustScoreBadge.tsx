"use client"

import type React from "react"
import { View, Text, StyleSheet } from "react-native"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import { useTheme } from "../../context/ThemeContext"

interface TrustScoreBadgeProps {
  score: number // 0-100
  size?: "small" | "medium" | "large"
  showLabel?: boolean
}

export const TrustScoreBadge: React.FC<TrustScoreBadgeProps> = ({ score, size = "medium", showLabel = true }) => {
  const { colors } = useTheme()

  const getScoreColor = () => {
    if (score >= 80) return "#10B981" // Green
    if (score >= 60) return "#F59E0B" // Orange
    return "#EF4444" // Red
  }

  const getScoreLabel = () => {
    if (score >= 80) return "Excellent"
    if (score >= 60) return "Good"
    return "Fair"
  }

  const sizes = {
    small: { badge: 32, text: 10, icon: 14 },
    medium: { badge: 48, text: 14, icon: 20 },
    large: { badge: 64, text: 18, icon: 26 },
  }

  const currentSize = sizes[size]
  const scoreColor = getScoreColor()

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.badge,
          {
            width: currentSize.badge,
            height: currentSize.badge,
            backgroundColor: scoreColor + "20",
            borderColor: scoreColor,
          },
        ]}
      >
        <Icon name="shield-check" size={currentSize.icon} color={scoreColor} />
        <Text style={[styles.score, { fontSize: currentSize.text, color: scoreColor }]}>{score}</Text>
      </View>
      {showLabel && <Text style={[styles.label, { color: colors.textSecondary }]}>{getScoreLabel()}</Text>}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  badge: {
    borderRadius: 100,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  score: {
    fontWeight: "700",
    marginTop: 2,
  },
  label: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: "500",
  },
})
