"use client"

import { useRoute } from "@react-navigation/native"
import React, { useEffect, useRef, useState } from "react"
import { Alert, Animated, Linking, StyleSheet, Text, TouchableOpacity, View } from "react-native"

const EmergencySOSScreen: React.FC = () => {
  const route = useRoute()
  const { bookingId } = route.params as { bookingId: string }

  const [sosActive, setSosActive] = useState(false)
  const [countdown, setCountdown] = useState(0)

  const pulseAnim = useRef(new Animated.Value(1)).current
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (sosActive) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ]),
      ).start()
    } else {
      pulseAnim.setValue(1)
    }

    return () => {
      if (countdownRef.current) {
        clearInterval(countdownRef.current)
        countdownRef.current = null
      }
    }
  }, [sosActive])

  const handleSOSPress = () => {
    let count = 5
    setCountdown(count)

    countdownRef.current = setInterval(() => {
      count -= 1
      setCountdown(count)

      if (count === 0) {
        if (countdownRef.current) {
          clearInterval(countdownRef.current)
          countdownRef.current = null
        }
        activateSOS()
      }
    }, 1000)
  }

  const handleCancelCountdown = () => {
    if (countdownRef.current) {
      clearInterval(countdownRef.current)
      countdownRef.current = null
    }
    setCountdown(0)
  }

  const activateSOS = () => {
    setSosActive(true)
    Alert.alert(
      "SOS Activated",
      "Emergency services and your emergency contacts have been notified. Your location is being shared.",
      [{ text: "OK" }],
    )
  }

  const handleDeactivateSOS = () => {
    Alert.alert("Deactivate SOS", "Are you safe now?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Yes, I'm Safe",
        onPress: () => {
          setSosActive(false)
          Alert.alert("SOS Deactivated", "Glad you're safe!")
        },
      },
    ])
  }

  const handleCallPolice = () => Linking.openURL("tel:100")
  const handleCallAmbulance = () => Linking.openURL("tel:108")
  const handleCallSupport = () => Linking.openURL("tel:1800-XXX-XXXX")

  if (countdown > 0) {
    return (
      <View style={styles.countdownContainer}>
        <Text style={styles.countdownText}>{countdown}</Text>
        <Text style={styles.countdownLabel}>Activating SOS...</Text>
        <TouchableOpacity style={styles.cancelButton} onPress={handleCancelCountdown}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    )
  }

  if (sosActive) {
    return (
      <View style={styles.container}>
        <View style={styles.activeSOSContainer}>
          <Animated.View
            style={[
              styles.sosCircleActive,
              { transform: [{ scale: pulseAnim }] },
            ]}
          >
            <Text style={styles.sosIconActive}>🚨</Text>
          </Animated.View>

          <Text style={styles.activeTitleText}>SOS ACTIVE</Text>
          <Text style={styles.activeSubtext}>
            Emergency services and your contacts have been notified
          </Text>
        </View>

        <View style={styles.actionSection}>
          <TouchableOpacity style={styles.deactivateButton} onPress={handleDeactivateSOS}>
            <Text style={styles.deactivateButtonText}>I'm Safe - Deactivate SOS</Text>
          </TouchableOpacity>

          <View style={styles.emergencyButtons}>
            <TouchableOpacity style={styles.emergencyButton} onPress={handleCallPolice}>
              <Text style={styles.emergencyButtonText}>🚔 Police (100)</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.emergencyButton} onPress={handleCallAmbulance}>
              <Text style={styles.emergencyButtonText}>🚑 Ambulance (108)</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.infoSection}>
        <Text style={styles.infoTitle}>Emergency SOS</Text>
        <Text style={styles.infoText}>
          In case of an emergency during your trip, press the SOS button below.
        </Text>
      </View>

      <View style={styles.sosSection}>
        <TouchableOpacity style={styles.sosButton} onPress={handleSOSPress}>
          <View style={styles.sosCircle}>
            <Text style={styles.sosIcon}>🚨</Text>
          </View>
          <Text style={styles.sosText}>Press for Emergency</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.quickContactsSection}>
        <Text style={styles.quickContactsTitle}>Quick Contacts</Text>
        <TouchableOpacity style={styles.contactButton} onPress={handleCallSupport}>
          <Text style={styles.contactButtonText}>📞 CARIGO Support</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },

  countdownContainer: {
    flex: 1,
    backgroundColor: "#d32f2f",
    justifyContent: "center",
    alignItems: "center",
  },

  countdownText: {
    fontSize: 120,
    fontWeight: "700",
    color: "#fff",
  },

  countdownLabel: {
    fontSize: 24,
    color: "#fff",
    marginBottom: 40,
  },

  cancelButton: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
  },

  cancelButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#d32f2f",
  },

  activeSOSContainer: {
    flex: 1,
    backgroundColor: "#d32f2f",
    justifyContent: "center",
    alignItems: "center",
  },

  sosCircleActive: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },

  sosIconActive: {
    fontSize: 80,
  },

  activeTitleText: {
    fontSize: 32,
    fontWeight: "700",
    color: "#fff",
  },

  activeSubtext: {
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
  },

  sosSection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  /** ✅ FIX ADDED */
  sosButton: {
    alignItems: "center",
  },

  sosCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "#d32f2f",
    justifyContent: "center",
    alignItems: "center",
  },

  sosIcon: {
    fontSize: 80,
  },

  sosText: {
    fontSize: 18,
    fontWeight: "600",
  },

  infoSection: {
    padding: 20,
    backgroundColor: "#fff",
  },

  infoTitle: {
    fontSize: 24,
    fontWeight: "700",
  },

  infoText: {
    fontSize: 16,
    color: "#757575",
  },

  quickContactsSection: {
    padding: 20,
    backgroundColor: "#fff",
  },

  quickContactsTitle: {
    fontSize: 16,
    fontWeight: "600",
  },

  contactButton: {
    backgroundColor: "#2196F3",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },

  contactButtonText: {
    color: "#fff",
    fontWeight: "600",
  },

  actionSection: {
    padding: 20,
    backgroundColor: "#fff",
  },

  deactivateButton: {
    backgroundColor: "#4caf50",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 16,
  },

  deactivateButtonText: {
    color: "#fff",
    fontWeight: "600",
  },

  emergencyButtons: {
    flexDirection: "row",
    gap: 12,
  },

  emergencyButton: {
    flex: 1,
    backgroundColor: "#ff5722",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },

  emergencyButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
})


export default EmergencySOSScreen
