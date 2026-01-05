"use client"

import { useFocusEffect } from "@react-navigation/native"
import React, { useCallback, useState } from "react"
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import { ImageSlider } from "../../components/ImageSlider"
import { useAuth } from "../../context/AuthContext"
import { useTheme } from "../../context/ThemeContext"
import VehicleService from "../../services/api/vehicle.service"

export default function MyCarsScreen({ navigation }: any) {
  const { colors } = useTheme()
  const { user } = useAuth()
  const ownerId = user?.id

  const [cars, setCars] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  /* 🔥 REFRESH ON SCREEN FOCUS */
  useFocusEffect(
    useCallback(() => {
      if (!ownerId) return

      let isActive = true

      const fetchCars = async () => {
        try {
          setLoading(true)
          const data = await VehicleService.getVehiclesByUser(
            ownerId.toString()
          )

          if (isActive) {
            setCars(Array.isArray(data) ? data : [])
          }
        } catch (err) {
          console.log("Failed to fetch cars:", err)
        } finally {
          if (isActive) setLoading(false)
        }
      }

      fetchCars()
      return () => {
        isActive = false
      }
    }, [ownerId])
  )

  /* ---------- LOADING ---------- */
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ color: colors.text, marginTop: 8 }}>
          Loading cars...
        </Text>
      </View>
    )
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* HEADER */}
      <View
        style={[
          styles.header,
          { backgroundColor: colors.surface, borderBottomColor: colors.border },
        ]}
      >
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          My Cars
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate("AddCar")}>
          <Icon name="plus-circle" size={28} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* CONTENT */}
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {cars.length === 0 ? (
          <Text style={{ color: colors.textSecondary }}>
            No cars found
          </Text>
        ) : (
          cars.map((car, index) => {
            const vehicleId =
              car?.id || car?._id || car?.vehicleId || index

            /* 🖼 IMAGE URLs */
            const imageUrls =
              Array.isArray(car.vehicleImageUrls) &&
                car.vehicleImageUrls.length > 0
                ? car.vehicleImageUrls.map((img: any) =>
                  typeof img === "string"
                    ? img
                    : img?.url || img?.secure_url || img?.path
                )
                : ["https://via.placeholder.com/400"]
            /* 🎥 VIDEO URL (OPTIONAL) */
            const videoUrl = car.vehicleVideoUrl ?? undefined
            // console.log("VIDEO URL PASSED 👉", videoUrl)
            return (
              <View
                key={vehicleId.toString()}
                style={[
                  styles.carCard,
                  { backgroundColor: colors.surface },
                ]}
              >
                {/* IMAGE + VIDEO SLIDER */}
                <ImageSlider
                  images={imageUrls}
                  videoUrl={videoUrl}
                />
                {/* CARD CONTENT */}
                <View style={styles.carContent}>
                  <View style={styles.carHeader}>
                    <View style={{ flex: 1 }}>
                      <Text
                        style={[
                          styles.carName,
                          { color: colors.text },
                        ]}
                      >
                        {car.manufacturer} {car.model}
                      </Text>
                      <Text
                        style={[
                          styles.carModel,
                          { color: colors.textSecondary },
                        ]}
                      >
                        {car.vehicleNumber}
                      </Text>
                    </View>

                    <View
                      style={[
                        styles.statusBadge,
                        { backgroundColor: colors.success + "20" },
                      ]}
                    >
                      <View
                        style={[
                          styles.statusDot,
                          { backgroundColor: colors.success },
                        ]}
                      />
                      <Text
                        style={[
                          styles.statusText,
                          { color: colors.success },
                        ]}
                      >
                        {car.isAvailable ? "Available" : "Unavailable"}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.carStats}>
                    <View style={styles.statItem}>
                      <Icon
                        name="currency-inr"
                        size={16}
                        color={colors.success}
                      />
                      <Text
                        style={[
                          styles.statText,
                          { color: colors.text },
                        ]}
                      >
                        ₹{car.ratePerDay}/day
                      </Text>
                    </View>
                  </View>

                  {/* ACTION BUTTONS */}
                  <View style={styles.carActions}>
                    <TouchableOpacity
                      style={[
                        styles.actionButton,
                        styles.editActionButton,
                      ]}
                      onPress={() =>
                        navigation.navigate("EditVehicle", {
                          vehicleId: vehicleId.toString(),
                        })
                      }
                    >
                      <Icon name="pencil" size={18} color="#fff" />
                      <Text style={styles.editActionText}>Edit</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.actionButton,
                        { borderColor: colors.border },
                      ]}
                      onPress={() =>
                        navigation.navigate("VehicleDetail", {
                          vehicleId: vehicleId.toString(),
                        })
                      }
                    >
                      <Icon
                        name="eye"
                        size={18}
                        color={colors.textSecondary}
                      />
                      <Text
                        style={[
                          styles.actionText,
                          { color: colors.textSecondary },
                        ]}
                      >
                        View Car
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )
          })
        )}
      </ScrollView>
    </View>
  )
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 56,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  headerTitle: { fontSize: 24, fontWeight: "700" },

  content: { flex: 1, paddingHorizontal: 24, paddingTop: 24 },

  carCard: {
    borderRadius: 16,
    marginBottom: 16,
    overflow: "hidden",
  },

  carContent: { padding: 16 },

  carHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  carName: { fontSize: 18, fontWeight: "600" },
  carModel: { fontSize: 14 },

  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 6,
  },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusText: { fontSize: 12, fontWeight: "600" },

  carStats: { marginBottom: 16 },
  statItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  statText: { fontSize: 13, fontWeight: "500" },

  carActions: { flexDirection: "row", gap: 8 },

  actionButton: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    gap: 6,
  },
  actionText: { fontSize: 13, fontWeight: "600" },

  editActionButton: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  editActionText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
  },
})
