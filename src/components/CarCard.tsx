"use client"

import React from "react"

import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import { useTheme } from "../context/ThemeContext"
import type { Car } from "../types"

interface CarCardProps {
  car: Car
  onPress: () => void
}

export const CarCard: React.FC<CarCardProps> = ({ car, onPress }) => {
  const { colors } = useTheme()

  return (
    <TouchableOpacity style={[styles.card, { backgroundColor: colors.surface }]} onPress={onPress} activeOpacity={0.7}>
      <Image source={{ uri: car.images[0] }} style={styles.image} />

      {car.fuelType === "Electric" && (
        <View style={[styles.badge, { backgroundColor: colors.success }]}>
          <Icon name="leaf" size={12} color="#FFFFFF" />
          <Text style={styles.badgeText}>EV</Text>
        </View>
      )}

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.name, { color: colors.text }]}>{car.name}</Text>
          <View style={styles.rating}>
            <Icon name="star" size={14} color={colors.warning} />
            <Text style={[styles.ratingText, { color: colors.text }]}>{car.rating}</Text>
          </View>
        </View>

        <Text style={[styles.model, { color: colors.textSecondary }]}>{car.model}</Text>

        <View style={styles.specs}>
          <View style={styles.spec}>
            <Icon name="fuel" size={16} color={colors.textSecondary} />
            <Text style={[styles.specText, { color: colors.textSecondary }]}>{car.fuelType}</Text>
          </View>
          <View style={styles.spec}>
            <Icon name="car-shift-pattern" size={16} color={colors.textSecondary} />
            <Text style={[styles.specText, { color: colors.textSecondary }]}>{car.transmission}</Text>
          </View>
          <View style={styles.spec}>
            <Icon name="shield-check" size={16} color={colors.success} />
            <Text style={[styles.specText, { color: colors.success }]}>{car.trustScore}</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <View>
            <Text style={[styles.price, { color: colors.text }]}>₹{car.pricePerDay}</Text>
            <Text style={[styles.priceLabel, { color: colors.textSecondary }]}>per day</Text>
          </View>
          <View style={[styles.bookButton, { backgroundColor: colors.primary }]}>
            <Text style={styles.bookButtonText}>Book</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    marginBottom: 16,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: 200,
  },
  badge: {
    position: "absolute",
    top: 12,
    right: 12,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  name: {
    fontSize: 18,
    fontWeight: "600",
  },
  rating: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: "600",
  },
  model: {
    fontSize: 14,
    marginBottom: 12,
  },
  specs: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 16,
  },
  spec: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  specText: {
    fontSize: 12,
    fontWeight: "500",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  price: {
    fontSize: 20,
    fontWeight: "700",
  },
  priceLabel: {
    fontSize: 12,
  },
  bookButton: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
  },
  bookButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
})
