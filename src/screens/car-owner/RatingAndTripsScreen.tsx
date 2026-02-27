"use client"

import { useAuth } from "@/src/context/AuthContext"
import React, { useEffect, useState } from "react"
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native"
import { useTheme } from "../../context/ThemeContext"
import { mockCarOwners } from "../../data/mockCarOwners"

export const RatingAndTripsScreen = () => {
  const { colors } = useTheme()
  const { user } = useAuth()

  const ownerId = user?.id

  const [rating, setRating] = useState(0)
  const [trips, setTrips] = useState(0)
  const [newRating, setNewRating] = useState("")
  const [loading, setLoading] = useState({
    rating: false,
    trips: false,
  })

  /* ✅ SAFE DATA LOAD */
  useEffect(() => {
    if (!ownerId) return

    const owner =
      mockCarOwners.find(
        (o) => String(o.id) === String(ownerId)
      ) || mockCarOwners[0]

    if (!owner) {
      setRating(0)
      setTrips(0)
      return
    }

    setRating(owner.rating ?? 0)
    setTrips(owner.tripsCompleted ?? 0)
  }, [ownerId])

  /* ✅ UPDATE RATING */
  const handleUpdateRating = async () => {
    const value = parseFloat(newRating)

    if (isNaN(value) || value < 0 || value > 5) {
      return
    }

    setLoading((p) => ({ ...p, rating: true }))

    setTimeout(() => {
      setRating(value)
      setNewRating("")
      setLoading((p) => ({ ...p, rating: false }))
    }, 1000)
  }

  /* ✅ INCREMENT TRIPS */
  const handleIncrementTrip = async () => {
    setLoading((p) => ({ ...p, trips: true }))

    setTimeout(() => {
      setTrips((prev) => prev + 1)
      setLoading((p) => ({ ...p, trips: false }))
    }, 1000)
  }

  /* ✅ USER GUARD */
  if (!ownerId) {
    return (
      <View style={styles.center}>
        <Text>User not logged in</Text>
      </View>
    )
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>
            Rating & Trips
          </Text>
          <Text
            style={[
              styles.subtitle,
              { color: colors.textSecondary },
            ]}
          >
            Owner statistics
          </Text>
        </View>

        {/* RATING */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <View style={styles.statHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Current Rating
            </Text>
            <Text style={{ color: colors.success, fontWeight: "700" }}>
              ★ {rating.toFixed(1)}
            </Text>
          </View>

          <TextInput
            value={newRating}
            onChangeText={setNewRating}
            placeholder="Enter rating (0-5)"
            keyboardType="numeric"
            style={[
              styles.input,
              {
                color: colors.text,
                borderColor: colors.border,
              },
            ]}
          />

          <TouchableOpacity
            style={[
              styles.button,
              { backgroundColor: colors.primary },
            ]}
            onPress={handleUpdateRating}
            disabled={loading.rating}
          >
            {loading.rating ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Update Rating</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* TRIPS */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <View style={styles.statHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Trips Completed
            </Text>
            <Text style={{ color: colors.primary, fontWeight: "700" }}>
              {trips}
            </Text>
          </View>

          <TouchableOpacity
            style={[
              styles.button,
              { backgroundColor: colors.primary },
            ]}
            onPress={handleIncrementTrip}
            disabled={loading.trips}
          >
            {loading.trips ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>
                Increment Trip
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  )
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollView: { flex: 1, padding: 20 },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: { marginBottom: 24 },
  title: { fontSize: 28, fontWeight: "700" },
  subtitle: { fontSize: 14 },
  section: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
  },
  statHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  button: {
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
})
