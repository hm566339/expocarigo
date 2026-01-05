"use client"

import { useState } from "react"
import { FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { Button } from "../../../components/ui/Button"
import InputField from "../../../components/ui/InputField"
import type { NavigationProp } from "../../../navigation/types"
import { useVehicleStore } from "../../../services/storage/store/vehicle.store"

interface SearchScreenProps {
  navigation: NavigationProp<"Main">
}

export default function SearchScreen({ navigation }: SearchScreenProps) {
  const { vehicles, fetchVehicles, isLoading } = useVehicleStore()
  const [city, setCity] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [maxPrice, setMaxPrice] = useState("")
  const [isSearching, setIsSearching] = useState(false)

  const handleSearch = async () => {
    if (!city || !startDate || !endDate) {
      alert("Please fill all fields")
      return
    }

    setIsSearching(true)
    await fetchVehicles({
      city,
      startDate,
      endDate,
      maxPrice: maxPrice ? Number.parseInt(maxPrice) : undefined,
    })
    setIsSearching(false)
  }

  const renderVehicleCard = ({ item: vehicle }: any) => (
    <TouchableOpacity
      style={styles.vehicleCard}
      onPress={() => navigation.navigate("CarDetail", { vehicleId: vehicle.id })}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.vehicleName}>{vehicle.name}</Text>
        <Text style={styles.price}>₹{vehicle.pricePerDay}/day</Text>
      </View>
      <Text style={styles.vehicleModel}>
        {vehicle.model} • {vehicle.year}
      </Text>
      <Text style={styles.vehicleLocation}>{vehicle.location.city}</Text>
    </TouchableOpacity>
  )

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Search Vehicles</Text>
      </View>

      <View style={styles.filterSection}>
        <InputField label="City" placeholder="Enter city" value={city} onChangeText={setCity} />

        <InputField
          label="Start Date (YYYY-MM-DD)"
          placeholder="2024-01-15"
          value={startDate}
          onChangeText={setStartDate}
        />

        <InputField label="End Date (YYYY-MM-DD)" placeholder="2024-01-20" value={endDate} onChangeText={setEndDate} />

        <InputField
          label="Max Price (₹)"
          placeholder="5000"
          value={maxPrice}
          onChangeText={setMaxPrice}
          keyboardType="number-pad"
        />

        <Button title="Search" onPress={handleSearch} loading={isLoading || isSearching} />
      </View>

      {isSearching || isLoading ? (
        <View style={styles.loadingContainer}>
          <Text>Searching vehicles...</Text>
        </View>
      ) : vehicles.length > 0 ? (
        <View style={styles.resultsSection}>
          <Text style={styles.resultsTitle}>Found {vehicles.length} vehicles</Text>
          <FlatList
            data={vehicles}
            renderItem={renderVehicleCard}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
          />
        </View>
      ) : null}
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
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  filterSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  resultsSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  resultsTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
    color: "#333",
  },
  vehicleCard: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginBottom: 8,
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
    borderWidth: 1,
    borderColor: "#E5E5EA",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  vehicleName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
  price: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#007AFF",
  },
  vehicleModel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  vehicleLocation: {
    fontSize: 12,
    color: "#666",
  },
  loadingContainer: {
    alignItems: "center",
    paddingVertical: 40,
  },
})
