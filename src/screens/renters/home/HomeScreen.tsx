"use client"

import { useEffect, useState } from "react"
import { FlatList, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import type { NavigationProp } from "../../../navigation/types"
import { useVehicleStore } from "../../../services/storage/store/vehicle.store"

interface HomeScreenProps {
  navigation: NavigationProp<"Main">
}

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const { vehicles, fetchVehicles, isLoading } = useVehicleStore()
  const [selectedCity, setSelectedCity] = useState("Bangalore")

  useEffect(() => {
    fetchVehicles({ city: selectedCity })
  }, [selectedCity])

  const cities = ["Bangalore", "Chennai", "Hyderabad", "Mumbai"]

  const renderVehicleCard = ({ item: vehicle }: any) => (
    <TouchableOpacity
      style={styles.vehicleCard}
      onPress={() => navigation.navigate("CarDetail", { vehicleId: vehicle.id })}
    >
      <Image source={{ uri: vehicle.images?.[0] || "/placeholder.svg" }} style={styles.vehicleImage} />
      <View style={styles.vehicleInfo}>
        <Text style={styles.vehicleName}>{vehicle.name}</Text>
        <Text style={styles.vehicleModel}>{vehicle.model}</Text>
        <View style={styles.vehicleStats}>
          <Text style={styles.rating}>⭐ {vehicle.rating?.toFixed(1) || "N/A"}</Text>
          <Text style={styles.price}>₹{vehicle.pricePerDay}/day</Text>
        </View>
      </View>
    </TouchableOpacity>
  )

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Hello!</Text>
        <Text style={styles.subGreeting}>Find your perfect rental</Text>
      </View>

      <View style={styles.citySection}>
        <Text style={styles.sectionTitle}>Select City</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.cityList}>
          {cities.map((city) => (
            <TouchableOpacity
              key={city}
              style={[styles.cityButton, selectedCity === city && styles.cityButtonActive]}
              onPress={() => setSelectedCity(city)}
            >
              <Text style={[styles.cityButtonText, selectedCity === city && styles.cityButtonTextActive]}>{city}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.vehiclesSection}>
        <Text style={styles.sectionTitle}>Available Vehicles</Text>
        {isLoading ? (
          <View style={styles.centerContent}>
            <Text>Loading vehicles...</Text>
          </View>
        ) : vehicles.length > 0 ? (
          <FlatList
            data={vehicles}
            renderItem={renderVehicleCard}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
          />
        ) : (
          <View style={styles.centerContent}>
            <Text>No vehicles available</Text>
          </View>
        )}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: "#f9f9f9",
  },
  greeting: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
  },
  subGreeting: {
    fontSize: 16,
    color: "#666",
    marginTop: 4,
  },
  citySection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
    color: "#333",
  },
  cityList: {
    marginBottom: 8,
  },
  cityButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "#E5E5EA",
    marginRight: 8,
  },
  cityButtonActive: {
    backgroundColor: "#007AFF",
  },
  cityButtonText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  cityButtonTextActive: {
    color: "#fff",
  },
  vehiclesSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  vehicleCard: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#f9f9f9",
  },
  vehicleImage: {
    width: "100%",
    height: 200,
  },
  vehicleInfo: {
    padding: 12,
  },
  vehicleName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  vehicleModel: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  vehicleStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  rating: {
    fontSize: 12,
    color: "#FF9500",
  },
  price: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#007AFF",
  },
  centerContent: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
})
