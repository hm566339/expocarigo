"use client"

import React from "react"
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import { useTheme } from "../../context/ThemeContext"

export default function OwnerTripsScreen() {
  const { colors } = useTheme()

  const trips = [
    { id: 1, car: "Maruti Swift", renter: "Priya Singh", status: "active", amount: 4832, dates: "15-17 Jan" },
    { id: 2, car: "Hyundai i20", renter: "Amit Kumar", status: "completed", amount: 5400, dates: "10-12 Jan" },
  ]

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Trip History</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {trips.map((trip) => (
          <TouchableOpacity key={trip.id} style={[styles.tripCard, { backgroundColor: colors.surface }]}>
            <View style={styles.tripHeader}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.carName, { color: colors.text }]}>{trip.car}</Text>
                <Text style={[styles.renterName, { color: colors.textSecondary }]}>Renter: {trip.renter}</Text>
              </View>
              <View
                style={[
                  styles.statusBadge,
                  {
                    backgroundColor: trip.status === "active" ? colors.success + "20" : colors.surfaceVariant,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.statusText,
                    {
                      color: trip.status === "active" ? colors.success : colors.textSecondary,
                    },
                  ]}
                >
                  {trip.status === "active" ? "Active" : "Completed"}
                </Text>
              </View>
            </View>

            <View style={styles.tripDetails}>
              <View style={styles.tripDetail}>
                <Icon name="calendar" size={14} color={colors.textSecondary} />
                <Text style={[styles.tripDetailText, { color: colors.textSecondary }]}>{trip.dates} 2025</Text>
              </View>
              <Text style={[styles.amount, { color: colors.text }]}>₹{trip.amount}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 56,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  tripCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  tripHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  carName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  renterName: {
    fontSize: 13,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "600",
  },
  tripDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  tripDetail: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  tripDetailText: {
    fontSize: 12,
  },
  amount: {
    fontSize: 18,
    fontWeight: "700",
  },
})
