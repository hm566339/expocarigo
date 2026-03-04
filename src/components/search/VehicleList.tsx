import React from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { VehicleCard } from "../vehicle-card/VehicleCard";

export interface VehicleListProps {
  vehicles: any[];
  isLoading: boolean;
  city: string;
  onVehiclePress: (vehicle: any, index: number) => void;
}

export const VehicleList: React.FC<VehicleListProps> = ({
  vehicles,
  isLoading,
  city,
  onVehiclePress,
}) => {
  const renderVehicle = ({ item, index }: any) => (
    <VehicleCard
      item={item}
      index={index}
      onPress={() => onVehiclePress(item, index)}
    />
  );

  return (
    <View style={styles.container}>
      {/* LOADING OVERLAY */}
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#2563eb" />
          <Text style={styles.loadingText}>Finding vehicles...</Text>
        </View>
      )}

      {/* VEHICLE LIST */}
      <FlatList
        data={vehicles}
        keyExtractor={(item, index) => `vehicle-${item.vehicleId}-${index}`}
        renderItem={renderVehicle}
        contentContainerStyle={styles.listContent}
        scrollEnabled={!isLoading}
        ListEmptyComponent={
          !isLoading ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>
                {city
                  ? "No vehicles found"
                  : "Search for vehicles to get started"}
              </Text>
            </View>
          ) : null
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(248, 250, 252, 0.95)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#64748b",
    fontWeight: "500",
  },
  listContent: {
    paddingBottom: 24,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: "#94a3b8",
    fontWeight: "500",
  },
});
