"use client"

import { useEffect } from "react"
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { Button } from "../../../components/ui/Button"
import type { NavigationProp, RoutePropType } from "../../../navigation/types"
import { useBookingStore } from "../../../services/storage/store/booking.store"

interface ActiveTripScreenProps {
  navigation: NavigationProp<"Main">
  route: RoutePropType<"Main">
}

export default function ActiveTripScreen({ navigation, route }: ActiveTripScreenProps) {
  const { bookingId } = route.params
  const { currentBooking, startTrip, isLoading } = useBookingStore()

  useEffect(() => {
    // Booking is already confirmed, just wait for user to start trip
  }, [])

  const handleStartTrip = async () => {
    try {
      await startTrip(bookingId)
      navigation.replace("TripEnd", { bookingId })
    } catch (error: any) {
      alert("Failed to start trip")
    }
  }

  if (!currentBooking) {
    return (
      <View style={styles.container}>
        <Text>Loading trip details...</Text>
      </View>
    )
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Trip Details</Text>
      </View>

      <View style={styles.statusCard}>
        <Text style={styles.statusLabel}>Status</Text>
        <Text style={styles.statusValue}>{currentBooking.status}</Text>
      </View>

      <View style={styles.detailCard}>
        <Text style={styles.cardTitle}>Booking Information</Text>

        <View style={styles.detailRow}>
          <Text style={styles.label}>Booking ID</Text>
          <Text style={styles.value}>{currentBooking.id}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.label}>Start Date</Text>
          <Text style={styles.value}>{currentBooking.startDate}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.label}>End Date</Text>
          <Text style={styles.value}>{currentBooking.endDate}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.label}>Total Cost</Text>
          <Text style={styles.value}>₹{currentBooking.totalCost}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.detailRow}>
          <Text style={styles.label}>Pickup</Text>
          <Text style={styles.value}>{currentBooking.pickupLocation}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.label}>Dropoff</Text>
          <Text style={styles.value}>{currentBooking.dropoffLocation}</Text>
        </View>
      </View>

      {currentBooking.status === "CONFIRMED" && (
        <View style={styles.actionSection}>
          <Button title="Start Trip" onPress={handleStartTrip} loading={isLoading} />
          <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.goBack()}>
            <Text style={styles.secondaryButtonText}>Cancel Booking</Text>
          </TouchableOpacity>
        </View>
      )}

      {currentBooking.status === "ACTIVE" && (
        <View style={styles.actionSection}>
          <Button title="End Trip" onPress={() => navigation.navigate("TripEnd", { bookingId })} />
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => navigation.navigate("ExtendTrip", { bookingId })}
          >
            <Text style={styles.secondaryButtonText}>Extend Trip</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  statusCard: {
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#34C759",
  },
  statusLabel: {
    fontSize: 14,
    color: "#666",
  },
  statusValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#34C759",
    marginTop: 4,
  },
  detailCard: {
    marginHorizontal: 20,
    marginBottom: 16,
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
  actionSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  secondaryButton: {
    marginTop: 12,
    paddingVertical: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FF3B30",
    borderRadius: 8,
  },
  secondaryButtonText: {
    color: "#FF3B30",
    fontWeight: "600",
    fontSize: 16,
  },
})
