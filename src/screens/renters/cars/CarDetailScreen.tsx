"use client"

import React, { useEffect, useState } from "react"
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { Button } from "../../../components/ui/Button"
import InputField from "../../../components/ui/InputField"
import type { NavigationProp, RoutePropType } from "../../../navigation/types"
import { useVehicleStore } from "../../../services/storage/store/vehicle.store"

interface CarDetailScreenProps {
  navigation: NavigationProp<"Main">
  route: RoutePropType<"Main">
}

export default function CarDetailScreen({ navigation, route }: CarDetailScreenProps) {
  const { vehicleId } = route.params
  const { selectedVehicle, getVehicleDetails, getQuote, quote, isLoading } = useVehicleStore()
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")

  useEffect(() => {
    getVehicleDetails(vehicleId)
  }, [vehicleId])

  const handleGetQuote = async () => {
    if (!startDate || !endDate) {
      alert("Please select dates")
      return
    }
    await getQuote(vehicleId, startDate, endDate)
  }

  const handleBookNow = async () => {
    if (!quote) {
      alert("Please get a quote first")
      return
    }
    navigation.navigate("BookingSummary", {
      vehicleId,
      startDate,
      endDate,
      quote,
    })
  }

  if (!selectedVehicle) {
    return (
      <View style={styles.container}>
        <Text>Loading vehicle details...</Text>
      </View>
    )
  }

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>

      <Image source={{ uri: selectedVehicle.images?.[0] || "/placeholder.svg" }} style={styles.mainImage} />

      <View style={styles.detailsSection}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.vehicleName}>{selectedVehicle.name}</Text>
            <Text style={styles.vehicleModel}>
              {selectedVehicle.model} • {selectedVehicle.year}
            </Text>
          </View>
          <View>
            <Text style={styles.rating}>⭐ {selectedVehicle.rating?.toFixed(1) || "N/A"}</Text>
          </View>
        </View>

        <View style={styles.priceSection}>
          <Text style={styles.price}>₹{selectedVehicle.pricePerDay}</Text>
          <Text style={styles.priceLabel}>per day</Text>
        </View>

        <View style={styles.specSection}>
          <View style={styles.spec}>
            <Text style={styles.specLabel}>Transmission</Text>
            <Text style={styles.specValue}>{selectedVehicle.transmission}</Text>
          </View>
          <View style={styles.spec}>
            <Text style={styles.specLabel}>Fuel</Text>
            <Text style={styles.specValue}>{selectedVehicle.fuelType}</Text>
          </View>
          <View style={styles.spec}>
            <Text style={styles.specLabel}>Seats</Text>
            <Text style={styles.specValue}>{selectedVehicle.seats}</Text>
          </View>
        </View>

        <View style={styles.featureSection}>
          <Text style={styles.featureTitle}>Features</Text>
          <View style={styles.featureList}>
            {selectedVehicle.features?.map((feature, idx) => (
              <Text key={idx} style={styles.featureItem}>
                • {feature}
              </Text>
            ))}
          </View>
        </View>

        <View style={styles.bookingSection}>
          <Text style={styles.bookingTitle}>Select Dates</Text>
          <InputField
            label="Start Date (YYYY-MM-DD)"
            placeholder="2024-01-15"
            value={startDate}
            onChangeText={setStartDate}
          />
          <InputField
            label="End Date (YYYY-MM-DD)"
            placeholder="2024-01-20"
            value={endDate}
            onChangeText={setEndDate}
          />

          <Button title="Get Quote" onPress={handleGetQuote} loading={isLoading} />

          {quote && (
            <View style={styles.quoteSection}>
              <Text style={styles.quoteTitle}>Price Breakdown</Text>
              <View style={styles.quoteLine}>
                <Text style={styles.quoteLabel}>Daily Rate × {quote.totalDays} days</Text>
                <Text>₹{quote.subtotal}</Text>
              </View>
              <View style={styles.quoteLine}>
                <Text style={styles.quoteLabel}>Tax</Text>
                <Text>₹{quote.tax}</Text>
              </View>
              <View style={[styles.quoteLine, styles.quoteTotalLine]}>
                <Text style={styles.quoteTotalLabel}>Total</Text>
                <Text style={styles.quoteTotalValue}>₹{quote.total}</Text>
              </View>
              <Button title="Book Now" onPress={handleBookNow} />
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  backButton: {
    position: "absolute",
    top: 20,
    left: 20,
    zIndex: 10,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  backButtonText: {
    color: "#007AFF",
    fontWeight: "600",
    fontSize: 14,
  },
  mainImage: {
    width: "100%",
    height: 250,
  },
  detailsSection: {
    padding: 20,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  vehicleName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  vehicleModel: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  rating: {
    fontSize: 16,
    fontWeight: "600",
  },
  priceSection: {
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  price: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#007AFF",
  },
  priceLabel: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  specSection: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
    paddingVertical: 16,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
  },
  spec: {
    alignItems: "center",
  },
  specLabel: {
    fontSize: 12,
    color: "#666",
  },
  specValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginTop: 4,
  },
  featureSection: {
    marginBottom: 20,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
    color: "#333",
  },
  featureList: {
    marginLeft: 4,
  },
  featureItem: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  bookingSection: {
    marginTop: 20,
  },
  bookingTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
    color: "#333",
  },
  quoteSection: {
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    padding: 16,
    marginTop: 16,
  },
  quoteTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
    color: "#333",
  },
  quoteLine: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  quoteTotalLine: {
    borderBottomWidth: 2,
    borderBottomColor: "#333",
    marginBottom: 16,
  },
  quoteLabel: {
    fontSize: 14,
    color: "#666",
  },
  quoteTotalLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  quoteTotalValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#007AFF",
  },
})
