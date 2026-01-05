"use client"

import { useState } from "react"
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { Button } from "../../../components/ui/Button"
import type { NavigationProp, RoutePropType } from "../../../navigation/types"
import { useBookingStore } from "../../../services/storage/store/booking.store"

interface BookingSummaryScreenProps {
  navigation: NavigationProp<"Main">
  route: RoutePropType<"Main">
}

export default function BookingSummaryScreen({ navigation, route }: BookingSummaryScreenProps) {
  const { vehicleId, startDate, endDate, quote } = route.params
  const { createBooking, isLoading } = useBookingStore()
  const [pickupLocation, setPickupLocation] = useState("")
  const [dropoffLocation, setDropoffLocation] = useState("")

  const handleConfirmBooking = async () => {
    if (!pickupLocation || !dropoffLocation) {
      alert("Please enter pickup and dropoff locations")
      return
    }

    try {
      const booking = await createBooking({
        vehicleId,
        startDate,
        endDate,
        pickupLocation,
        dropoffLocation,
        totalCost: quote.total,
        paymentMethod: "CARD",
      })

      navigation.navigate("PaymentScreen", { bookingId: booking.id, totalAmount: quote.total })
    } catch (error: any) {
      console.log("Booking error:", error)
    }
  }

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>

      <View style={styles.header}>
        <Text style={styles.title}>Booking Summary</Text>
      </View>

      <View style={styles.summaryCard}>
        <Text style={styles.cardTitle}>Booking Details</Text>

        <View style={styles.detailRow}>
          <Text style={styles.label}>Check-in</Text>
          <Text style={styles.value}>{startDate}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.label}>Check-out</Text>
          <Text style={styles.value}>{endDate}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.locationSection}>
          <Text style={styles.label}>Pickup Location</Text>
          <TouchableOpacity style={styles.locationInput}>
            <Text style={styles.locationText}>{pickupLocation || "Select location"}</Text>
          </TouchableOpacity>

          <Text style={[styles.label, { marginTop: 12 }]}>Dropoff Location</Text>
          <TouchableOpacity style={styles.locationInput}>
            <Text style={styles.locationText}>{dropoffLocation || "Select location"}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        <Text style={styles.cardTitle}>Price Breakdown</Text>

        <View style={styles.detailRow}>
          <Text style={styles.label}>Subtotal</Text>
          <Text style={styles.value}>₹{quote.subtotal}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.label}>Tax</Text>
          <Text style={styles.value}>₹{quote.tax}</Text>
        </View>

        <View style={[styles.detailRow, styles.totalRow]}>
          <Text style={styles.totalLabel}>Total Amount</Text>
          <Text style={styles.totalValue}>₹{quote.total}</Text>
        </View>
      </View>

      <View style={styles.actionSection}>
        <Button title="Proceed to Payment" onPress={handleConfirmBooking} loading={isLoading} />
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  backButton: {
    marginLeft: 20,
    marginTop: 20,
    width: 60,
  },
  backButtonText: {
    color: "#007AFF",
    fontWeight: "600",
    fontSize: 14,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  summaryCard: {
    marginHorizontal: 20,
    marginVertical: 12,
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#333",
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  value: {
    fontSize: 14,
    color: "#333",
    fontWeight: "600",
  },
  divider: {
    height: 1,
    backgroundColor: "#E5E5EA",
    marginVertical: 12,
  },
  locationSection: {
    marginBottom: 12,
  },
  locationInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginTop: 6,
  },
  locationText: {
    fontSize: 14,
    color: "#666",
  },
  totalRow: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: "#f0f7ff",
    borderRadius: 8,
    marginTop: 8,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#007AFF",
  },
  actionSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
})
