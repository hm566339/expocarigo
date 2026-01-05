"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { View, Text, StyleSheet, TouchableOpacity, Alert, Dimensions, Animated } from "react-native"
import { useRoute } from "@react-navigation/native"
import type { GPSLocation } from "../../types/safety.types"

const { width } = Dimensions.get("window")

const LiveTrackingScreen: React.FC = () => {
  const route = useRoute()
  const { bookingId } = route.params as { bookingId: string }

  // Simulated GPS location (in production, use react-native-geolocation-service)
  const [currentLocation, setCurrentLocation] = useState<GPSLocation>({
    latitude: 28.6139,
    longitude: 77.209,
    timestamp: new Date().toISOString(),
    accuracy: 10,
    speed: 45,
    heading: 180,
  })

  const [isTracking, setIsTracking] = useState(true)
  const pulseAnim = useRef(new Animated.Value(1)).current

  useEffect(() => {
    // Pulse animation for tracking indicator
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    ).start()

    // Simulate GPS updates (replace with actual GPS service)
    const interval = setInterval(() => {
      setCurrentLocation((prev) => ({
        ...prev,
        latitude: prev.latitude + (Math.random() - 0.5) * 0.001,
        longitude: prev.longitude + (Math.random() - 0.5) * 0.001,
        timestamp: new Date().toISOString(),
        speed: Math.floor(Math.random() * 80) + 20,
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const handleShareLocation = () => {
    Alert.alert("Share Location", "Location sharing link copied to clipboard!", [{ text: "OK" }])
  }

  const formatSpeed = (speed?: number) => {
    return speed ? `${Math.round(speed)} km/h` : "-- km/h"
  }

  const formatCoordinates = (lat: number, lon: number) => {
    return `${lat.toFixed(6)}, ${lon.toFixed(6)}`
  }

  return (
    <View style={styles.container}>
      {/* Map Placeholder */}
      <View style={styles.mapPlaceholder}>
        <View style={styles.mapOverlay}>
          <Animated.View
            style={[
              styles.trackingIndicator,
              {
                transform: [{ scale: pulseAnim }],
              },
            ]}
          >
            <View style={styles.trackingDot} />
          </Animated.View>
          <Text style={styles.mapPlaceholderText}>GPS Tracking Active</Text>
          <Text style={styles.mapSubtext}>Map integration ready for production</Text>
        </View>
      </View>

      {/* Location Details Card */}
      <View style={styles.detailsCard}>
        <View style={styles.statusBadge}>
          <View style={styles.activeDot} />
          <Text style={styles.statusText}>Live Tracking</Text>
        </View>

        <View style={styles.infoGrid}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Current Speed</Text>
            <Text style={styles.infoValue}>{formatSpeed(currentLocation.speed)}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Accuracy</Text>
            <Text style={styles.infoValue}>±{currentLocation.accuracy}m</Text>
          </View>
        </View>

        <View style={styles.coordinatesSection}>
          <Text style={styles.coordinatesLabel}>Coordinates</Text>
          <Text style={styles.coordinatesValue}>
            {formatCoordinates(currentLocation.latitude, currentLocation.longitude)}
          </Text>
        </View>

        <View style={styles.timestampSection}>
          <Text style={styles.timestampText}>
            Last updated: {new Date(currentLocation.timestamp).toLocaleTimeString()}
          </Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionSection}>
        <TouchableOpacity style={styles.shareButton} onPress={handleShareLocation}>
          <Text style={styles.shareButtonText}>📍 Share Location</Text>
        </TouchableOpacity>

        <Text style={styles.privacyNote}>Location is only shared with trip participants and emergency contacts</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  mapPlaceholder: {
    height: 400,
    backgroundColor: "#e8f4f8",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  mapOverlay: {
    alignItems: "center",
  },
  trackingIndicator: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(33, 150, 243, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  trackingDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#2196F3",
  },
  mapPlaceholderText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 8,
  },
  mapSubtext: {
    fontSize: 14,
    color: "#666",
  },
  detailsCard: {
    backgroundColor: "#fff",
    margin: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e8f5e9",
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 20,
  },
  activeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#4caf50",
    marginRight: 8,
  },
  statusText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2e7d32",
  },
  infoGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  infoItem: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 13,
    color: "#757575",
    marginBottom: 6,
  },
  infoValue: {
    fontSize: 24,
    fontWeight: "700",
    color: "#212121",
  },
  coordinatesSection: {
    marginBottom: 16,
  },
  coordinatesLabel: {
    fontSize: 13,
    color: "#757575",
    marginBottom: 6,
  },
  coordinatesValue: {
    fontSize: 16,
    fontWeight: "500",
    color: "#424242",
    fontFamily: "monospace",
  },
  timestampSection: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  timestampText: {
    fontSize: 13,
    color: "#9e9e9e",
    textAlign: "center",
  },
  actionSection: {
    padding: 16,
  },
  shareButton: {
    backgroundColor: "#2196F3",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 12,
  },
  shareButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  privacyNote: {
    fontSize: 12,
    color: "#9e9e9e",
    textAlign: "center",
    lineHeight: 18,
  },
})

export default LiveTrackingScreen
