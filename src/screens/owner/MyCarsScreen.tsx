"use client";

import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import { VehicleCard } from "../../components/vehicle-card/VehicleCard"; // ✅ NEW
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import VehicleService from "../../services/api/vehicle.service";

export default function MyCarsScreen({ navigation }: any) {
  const { colors } = useTheme();
  const { user } = useAuth();
  const ownerId = user?.id;

  const [cars, setCars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  /* 🔄 REFRESH ON SCREEN FOCUS */
  useFocusEffect(
    useCallback(() => {
      if (!ownerId) return;

      let isActive = true;

      const fetchCars = async () => {
        try {
          setLoading(true);

          const data = await VehicleService.getVehiclesByUser(
            ownerId.toString(),
          );

          if (isActive) {
            setCars(Array.isArray(data) ? data : []);
          }
        } catch (err) {
          console.log("Failed to fetch cars:", err);
        } finally {
          if (isActive) setLoading(false);
        }
      };

      fetchCars();

      return () => {
        isActive = false;
      };
    }, [ownerId]),
  );

  /* ---------- LOADING ---------- */
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ color: colors.text, marginTop: 8 }}>
          Loading vehicles...
        </Text>
      </View>
    );
  }

  const ViewCarDetail = (vehicleId: string) => {
    navigation.navigate("CarOwner", {
      screen: "VehicleDetail",
      params: { vehicleId },
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* HEADER */}
      <View
        style={[
          styles.header,
          {
            backgroundColor: colors.surface,
            borderBottomColor: colors.border,
          },
        ]}
      >
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          My Vehicles
        </Text>

        <TouchableOpacity onPress={() => navigation.navigate("AddCar")}>
          <Icon name="plus-circle" size={28} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* CONTENT */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {cars.length === 0 ? (
          /* EMPTY STATE */
          <View style={styles.emptyState}>
            <Icon name="car-outline" size={72} color={colors.textSecondary} />

            <Text style={[styles.emptyTitle, { color: colors.text }]}>
              No vehicles added yet
            </Text>

            <Text
              style={[styles.emptySubtitle, { color: colors.textSecondary }]}
            >
              Start earning by adding your first vehicle.
            </Text>

            <TouchableOpacity
              style={[styles.emptyButton, { backgroundColor: colors.primary }]}
              onPress={() => navigation.navigate("AddCar")}
            >
              <Icon name="plus" size={18} color="#fff" />
              <Text style={styles.emptyButtonText}>Add Vehicle</Text>
            </TouchableOpacity>
          </View>
        ) : (
          /* VEHICLE LIST */
          cars.map((car, index) => {
            const vehicleId = car?.id || car?._id || car?.vehicleId || index;

            return (
              <VehicleCard
                key={vehicleId.toString()}
                item={car}
                index={index}
                onPress={() => ViewCarDetail(vehicleId.toString())}
              />
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

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

  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
  },

  content: {
    flex: 1,
    paddingTop: 12,
  },

  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 80,
    paddingHorizontal: 24,
  },

  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginTop: 16,
  },

  emptySubtitle: {
    fontSize: 14,
    textAlign: "center",
    marginTop: 6,
    marginBottom: 20,
  },

  emptyButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 10,
  },

  emptyButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
});
