"use client"

import React, { useState } from "react"
import { ScrollView, StyleSheet, Text, View } from "react-native"
import { Button } from "../../../components/ui/Button"
import InputField from "../../../components/ui/InputField"
import type { NavigationProp, RoutePropType } from "../../../navigation/types"
import { useBookingStore } from "../../../services/storage/store/booking.store"

interface ExtendTripScreenProps {
  navigation: NavigationProp<"Main">
  route: RoutePropType<"Main">
}

export default function ExtendTripScreen({ navigation, route }: ExtendTripScreenProps) {
  const { bookingId } = route.params
  const { extendTrip, isLoading } = useBookingStore()
  const [newEndDate, setNewEndDate] = useState("")

  const handleExtend = async () => {
    if (!newEndDate) {
      alert("Please select new end date")
      return
    }

    try {
      await extendTrip(bookingId, newEndDate)
      alert("Trip extended successfully")
      navigation.goBack()
    } catch (error: any) {
      alert("Failed to extend trip")
    }
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Extend Trip</Text>
      </View>

      <View style={styles.formCard}>
        <InputField
          label="New End Date (YYYY-MM-DD)"
          placeholder="2024-01-25"
          value={newEndDate}
          onChangeText={setNewEndDate}
        />
      </View>

      <View style={styles.actionSection}>
        <Button title="Extend Trip" onPress={handleExtend} loading={isLoading} />
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
