"use client"

import { useEffect, useState } from "react"
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import type { NavigationProp } from "../../../navigation/types"
import { useBookingStore } from "../../../services/storage/store/booking.store"

interface BookingsScreenProps {
  navigation: NavigationProp<"Main">
}

export default function BookingsScreen({ navigation }: BookingsScreenProps) {
  const { bookings, fetchMyBookings, isLoading } = useBookingStore()
  const [activeTab, setActiveTab] = useState<"ACTIVE" | "COMPLETED" | "CANCELLED">("ACTIVE")

  useEffect(() => {
    fetchMyBookings()
  }, [])

  const filteredBookings = bookings.filter((b) => {
    if (activeTab === "ACTIVE") return ["PENDING", "CONFIRMED", "ACTIVE"].includes(b.status)
    if (activeTab === "COMPLETED") return b.status === "COMPLETED"
    return b.status === "CANCELLED"
  })

  const renderBookingCard = ({ item }: any) => (
    <TouchableOpacity
      style={styles.bookingCard}
      onPress={() => navigation.navigate("ActiveTrip", { bookingId: item.id })}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.bookingId}>Booking #{item.id.slice(0, 8)}</Text>
        <View style={[styles.statusBadge, styles[`status_${item.status}`]]}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>

      <View style={styles.cardBody}>
        <View style={styles.dateRow}>
          <Text style={styles.label}>Check-in</Text>
          <Text style={styles.value}>{item.startDate}</Text>
        </View>
        <View style={styles.dateRow}>
          <Text style={styles.label}>Check-out</Text>
          <Text style={styles.value}>{item.endDate}</Text>
        </View>

        <View style={styles.priceRow}>
          <Text style={styles.label}>Total Cost</Text>
          <Text style={styles.price}>₹{item.totalCost}</Text>
        </View>
      </View>
    </TouchableOpacity>
  )

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Bookings</Text>
      </View>

      <View style={styles.tabBar}>
        {(["ACTIVE", "COMPLETED", "CANCELLED"] as const).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {isLoading ? (
        <View style={styles.centerContent}>
          <Text>Loading bookings...</Text>
        </View>
      ) : filteredBookings.length > 0 ? (
        <FlatList
          data={filteredBookings}
          renderItem={renderBookingCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <View style={styles.centerContent}>
          <Text>No {activeTab.toLowerCase()} bookings</Text>
        </View>
      )}
    </View>
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
  tabBar: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: "#007AFF",
  },
  tabText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#999",
  },
  tabTextActive: {
    color: "#007AFF",
  },
  listContent: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  bookingCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 12,
    overflow: "hidden",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#f9f9f9",
  },
  bookingId: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  status_ACTIVE: {
    backgroundColor: "#D1EDFF",
  },
  status_PENDING: {
    backgroundColor: "#FFF3CD",
  },
  status_CONFIRMED: {
    backgroundColor: "#D1EDFF",
  },
  status_COMPLETED: {
    backgroundColor: "#D1E7DD",
  },
  status_CANCELLED: {
    backgroundColor: "#F8D7DA",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#333",
  },
  cardBody: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  dateRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  label: {
    fontSize: 12,
    color: "#666",
  },
  value: {
    fontSize: 12,
    color: "#333",
    fontWeight: "600",
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#E5E5EA",
  },
  price: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#007AFF",
  },
  centerContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
})
