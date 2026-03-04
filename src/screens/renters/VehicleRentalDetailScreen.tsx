import React, { useEffect, useState } from "react";
import {
    Alert,
    Animated,
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

export default function VehicleRentalDetailScreen({ route, navigation }: any) {
  const { vehicleId } = route.params;
  const { colors } = useTheme();

  const [loading, setLoading] = useState(true);
  const [vehicle, setVehicle] = useState<any>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const scaleAnim = useState(new Animated.Value(1))[0];
  const isBookable = true; // or whatever logic you want

  /* ---------- FETCH VEHICLE ---------- */
  const fetchVehicle = async () => {
    try {
      setLoading(true);
      const res = await VehicleService.getVehicle(vehicleId);
      setVehicle(res);
    } catch (e) {
      Alert.alert("Error", "Failed to load vehicle details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicle();
  }, []);

  /* ---------- HANDLE DELETE ---------- */
  const handleDelete = () => {
    Alert.alert(
      "Delete Vehicle",
      "Are you sure you want to delete this vehicle?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await VehicleService.deleteVehicle(vehicle.vehicleId);
              Alert.alert("Success", "Vehicle deleted");
              navigation.goBack();
            } catch (e) {
              Alert.alert("Error", "Failed to delete vehicle");
            }
          },
        },
      ],
    );
  };

  const handleBooking = () => {
    if (!isBookable) return;

    // Animate button press
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    navigation.navigate("BookingSummary", {
      vehicleId: vehicle.vehicleId,
      startDate: "",
      endDate: "",
    });
  };

  /* ---------- HANDLE EDIT ---------- */
  const handleFavorite = () => {
    setIsFavorite(!isFavorite);
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.2,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  };

  if (!vehicle) return null;

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

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <VehicleDetailHeader
        onBackPress={() => navigation.goBack()}
        title="Vehicle Details"
        colors={colors}
      />

      <ScrollView showsVerticalScrollIndicator={false} scrollEventThrottle={16}>
        {/* Media Section */}
        <VehicleMediaSection
          images={vehicle.vehicleImageUrls}
          videoUrl={vehicle.vehicleVideoUrl}
          colors={colors}
        />

        {/* Vehicle Details Card */}
        <VehicleDetailsCard
          title="Vehicle Information"
          details={[
            { label: "Vehicle Number", value: vehicle.vehicleNumber },
            { label: "Type", value: vehicle.vehicleType },
            { label: "Manufacturer", value: vehicle.manufacturer },
            { label: "Model", value: vehicle.model },
            { label: "Year", value: vehicle.manufactureYear },
            { label: "Fuel Type", value: vehicle.fuelType },
            { label: "Color", value: vehicle.color },
            { label: "KYC Status", value: vehicle.kycStatus },
          ]}
          colors={colors}
          delay={200}
        />

        {/* Owner Details Card */}
        <VehicleDetailsCard
          title="Owner Information"
          details={[
            { label: "Owner Name", value: vehicle.ownerName },
            { label: "Location", value: locationString },
          ]}
          colors={colors}
          delay={350}
        />

        {/* Pricing Card */}
        <VehicleDetailsCard
          title="Pricing & Billing"
          details={[
            { label: "Rate / Day", value: `₹ ${vehicle.ratePerDay}` },
            { label: "Rate / Hour", value: `₹ ${vehicle.ratePerHour}` },
          ]}
          colors={colors}
          delay={500}
        />

        <View style={styles.actionContainer}>
          <View style={styles.buttonRow}>
            <Animated.View
              style={{
                transform: [{ scale: scaleAnim }],
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

            <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
              <TouchableOpacity
                style={[
                  styles.favoriteButton,
                  { backgroundColor: colors.card, borderColor: colors.primary },
                ]}
                onPress={handleFavorite}
                activeOpacity={0.8}
              >
                <Text style={{ fontSize: 20 }}>{isFavorite ? "❤️" : "🤍"}</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </View>

        {/* Meta Info */}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
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
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  bookButton: {
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
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
