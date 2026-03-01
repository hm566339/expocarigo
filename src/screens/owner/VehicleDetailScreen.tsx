import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    View,
} from "react-native";
import { VehicleActionsSection } from "../../components/vehicle-detail/VehicleActionsSection";
import { VehicleDetailHeader } from "../../components/vehicle-detail/VehicleDetailHeader";
import { VehicleDetailsCard } from "../../components/vehicle-detail/VehicleDetailsCard";
import { VehicleMediaSection } from "../../components/vehicle-detail/VehicleMediaSection";
import { VehicleMetaInfo } from "../../components/vehicle-detail/VehicleMetaInfo";
import { useTheme } from "../../context/ThemeContext";
import VehicleService from "../../services/api/vehicle.service";

export default function VehicleDetailScreen({ route, navigation }: any) {
  const { vehicleId } = route.params;
  const { colors } = useTheme();

  const [loading, setLoading] = useState(true);
  const [vehicle, setVehicle] = useState<any>(null);

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

  /* ---------- HANDLE EDIT ---------- */
  const handleEdit = () => {
    navigation.navigate("EditVehicle", {
      vehicle: {
        ...vehicle,
        id: vehicle.vehicleId,
      },
    });
  };

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!vehicle) return null;

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
            { label: "Owner Address", value: vehicle.ownerAddress },
            { label: "Chassis Number", value: vehicle.chassisNumber },
            { label: "Engine Number", value: vehicle.engineNumber },
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
            { label: "Billing Mode", value: vehicle.billingMode },
          ]}
          colors={colors}
          delay={500}
        />

        {/* Action Buttons */}
        <VehicleActionsSection
          onEdit={handleEdit}
          onDelete={handleDelete}
          colors={colors}
          delay={650}
        />

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
});
