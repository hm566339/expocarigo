import { RenterStackScreenProps } from "@/src/navigation/renter/renter.types";
import { VehicleDto } from "@/src/types/vehicle.types";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { VehicleDetailHeader } from "../../components/vehicle-detail/VehicleDetailHeader";
import { VehicleDetailsCard } from "../../components/vehicle-detail/VehicleDetailsCard";
import { VehicleMediaSection } from "../../components/vehicle-detail/VehicleMediaSection";
import { VehicleMetaInfo } from "../../components/vehicle-detail/VehicleMetaInfo";
import { useTheme } from "../../context/ThemeContext";
import VehicleService from "../../services/api/vehicle.service";

type Props = RenterStackScreenProps<"CarDetail">;

export default function VehicleRentalDetailScreen({
  route,
  navigation,
}: Props) {
  const { vehicleId, startDate, endDate } = route.params;
  const { colors } = useTheme();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [vehicle, setVehicle] = useState<VehicleDto | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);

  const bookAnim = useState(new Animated.Value(1))[0];
  const favAnim = useState(new Animated.Value(1))[0];

  /* ================= FETCH VEHICLE ================= */

  const fetchVehicle = useCallback(async () => {
    try {
      setLoading(true);
      const res = await VehicleService.getVehicle(vehicleId);
      setVehicle(res);
    } catch (e) {
      Alert.alert("Error", "Failed to load vehicle details");
    } finally {
      setLoading(false);
    }
  }, [vehicleId]);

  useEffect(() => {
    fetchVehicle();
  }, [fetchVehicle]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchVehicle();
    setRefreshing(false);
  };

  /* ================= BOOKABLE LOGIC ================= */

  // TEMP: Always bookable
  const isBookable = true;

  //   const isBookable =
  //     vehicle?.status === "ACTIVE" && vehicle?.kycStatus === "VERIFIED";

  /* ================= HANDLE BOOKING ================= */

  const handleBooking = () => {
    if (!vehicle || !isBookable) return;

    Animated.sequence([
      Animated.timing(bookAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(bookAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    // convert incoming date to ISO
    const start = startDate ? new Date(startDate) : new Date();
    const end = endDate ? new Date(endDate) : new Date();

    navigation.navigate("BookingSummary", {
      vehicleId: vehicle.vehicleId,
      ownerId: vehicle.userId,

      startDate: start.toISOString(),
      endDate: end.toISOString(),

      ratePerHour: vehicle.ratePerHour ?? 0,
      ratePerDay: vehicle.ratePerDay ?? 0,

      vehicleNumber: vehicle.vehicleNumber,
      ownerName: vehicle.ownerName,
      vehicleImage: vehicle.vehicleImageUrls?.[0] ?? "",
    });
  };

  /* ================= HANDLE FAVORITE ================= */

  const handleFavorite = () => {
    setIsFavorite((prev) => !prev);

    Animated.sequence([
      Animated.timing(favAnim, {
        toValue: 1.2,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(favAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  };

  /* ================= LOADING STATE ================= */

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ marginTop: 12 }}>Loading vehicle details...</Text>
      </View>
    );
  }

  if (!vehicle) {
    return (
      <View style={styles.center}>
        <Text>Vehicle not found.</Text>
      </View>
    );
  }

  /* ================= LOCATION STRING ================= */

  const locationString = vehicle.location
    ? [
        vehicle.location.address,
        vehicle.location.city,
        vehicle.location.state,
        vehicle.location.country,
      ]
        .filter(Boolean)
        .join(", ")
    : "-";

  /* ================= UI ================= */

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <VehicleDetailHeader
        onBackPress={() => navigation.goBack()}
        title="Vehicle Details"
        colors={colors}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <VehicleMediaSection
          images={vehicle.vehicleImageUrls || []}
          videoUrl={vehicle.vehicleVideoUrl || undefined}
          colors={colors}
        />

        <VehicleDetailsCard
          title="Vehicle Information"
          details={[
            { label: "Vehicle Number", value: vehicle.vehicleNumber ?? "-" },
            { label: "Fuel Type", value: vehicle.fuelType ?? "-" },
            { label: "Color", value: vehicle.color ?? "-" },
            { label: "KYC Status", value: vehicle.kycStatus ?? "-" },
            { label: "Status", value: vehicle.status ?? "-" },
          ]}
          colors={colors}
          delay={200}
        />

        <VehicleDetailsCard
          title="Owner Information"
          details={[
            { label: "Owner Name", value: vehicle.ownerName ?? "-" },
            { label: "Location", value: locationString },
          ]}
          colors={colors}
          delay={350}
        />

        <VehicleDetailsCard
          title="Pricing & Billing"
          details={[
            {
              label: "Rate / Day",
              value: vehicle.ratePerDay ? `₹ ${vehicle.ratePerDay}` : "-",
            },
            {
              label: "Rate / Hour",
              value: vehicle.ratePerHour ? `₹ ${vehicle.ratePerHour}` : "-",
            },
          ]}
          colors={colors}
          delay={500}
        />

        {/* ACTION BUTTONS */}
        <View style={styles.actionContainer}>
          <View style={styles.buttonRow}>
            <Animated.View
              style={{
                transform: [{ scale: bookAnim }],
                flex: 1,
                marginRight: 12,
              }}
            >
              <TouchableOpacity
                style={[
                  styles.bookButton,
                  {
                    backgroundColor: isBookable ? colors.primary : "#999",
                  },
                ]}
                onPress={handleBooking}
                disabled={!isBookable}
                activeOpacity={0.8}
              >
                <Text style={styles.bookText}>
                  {isBookable ? "Book Now" : "Not Available"}
                </Text>
              </TouchableOpacity>
            </Animated.View>

            <Animated.View style={{ transform: [{ scale: favAnim }] }}>
              <TouchableOpacity
                style={[
                  styles.favoriteButton,
                  {
                    backgroundColor: colors.card,
                    borderColor: colors.primary,
                  },
                ]}
                onPress={handleFavorite}
                activeOpacity={0.8}
              >
                <Text style={{ fontSize: 20 }}>{isFavorite ? "❤️" : "🤍"}</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </View>

        <VehicleMetaInfo
          createdAt={vehicle.createdAt}
          updatedAt={vehicle.updatedAt}
          colors={colors}
          delay={750}
        />
      </ScrollView>
    </View>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  favoriteButton: {
    width: 56,
    height: 56,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
  },
  bookButton: {
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  bookText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  actionContainer: {
    padding: 16,
    paddingBottom: 40,
    marginTop: 8,
  },
  buttonRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
