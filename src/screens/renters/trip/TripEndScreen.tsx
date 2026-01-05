"use client"

import { useState } from "react"
import { ScrollView, StyleSheet, Text, View } from "react-native"
import { Button } from "../../../components/ui/Button"
import InputField from "../../../components/ui/InputField"
import type { NavigationProp, RoutePropType } from "../../../navigation/types"
import { useBookingStore } from "../../../services/storage/store/booking.store"

interface TripEndScreenProps {
  navigation: NavigationProp<"Main">
  route: RoutePropType<"Main">
}

export default function TripEndScreen({ navigation, route }: TripEndScreenProps) {
  const { bookingId } = route.params
  const { endTrip, isLoading } = useBookingStore()
  const [odometerReading, setOdometerReading] = useState("")
  const [fuelLevel, setFuelLevel] = useState("")
  const [damageReport, setDamageReport] = useState("")

  const handleEndTrip = async () => {
    try {
      await endTrip(bookingId)
      navigation.navigate("RateOwner", { bookingId })
    } catch (error: any) {
      alert("Failed to end trip")
    }
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>End Trip</Text>
        <Text style={styles.subtitle}>Please provide vehicle status details</Text>
      </View>

      <View style={styles.formCard}>
        <InputField
          label="Odometer Reading (km)"
          placeholder="45230"
          value={odometerReading}
          onChangeText={setOdometerReading}
          keyboardType="number-pad"
        />

        <InputField
          label="Fuel Level (%)"
          placeholder="85"
          value={fuelLevel}
          onChangeText={setFuelLevel}
          keyboardType="number-pad"
        />

        <InputField
          label="Damage Report (if any)"
          placeholder="Describe any damage to the vehicle"
          value={damageReport}
          onChangeText={setDamageReport}
        />
      </View>

      <View style={styles.actionSection}>
        <Button title="Complete Trip" onPress={handleEndTrip} loading={isLoading} />
      </View>
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
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  formCard: {
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
  },
  actionSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
})
