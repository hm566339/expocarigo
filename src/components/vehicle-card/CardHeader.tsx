import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface CardHeaderProps {
  vehicleName: string;
  ownerName?: string;
  pricePerDay: number;
}

export const CardHeader: React.FC<CardHeaderProps> = ({
  vehicleName,
  ownerName = "Owner",
  pricePerDay,
}) => {
  return (
    <View style={styles.cardHeader}>
      <View style={styles.vehicleInfoSection}>
        <Text style={styles.vehicleNumber}>{vehicleName}</Text>
        <Text style={styles.ownerName}>by {ownerName}</Text>
      </View>
      <View style={styles.priceSection}>
        <Text style={styles.price}>₹{pricePerDay.toLocaleString()}</Text>
        <Text style={styles.priceLabel}>/day</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
  },
  vehicleInfoSection: {
    flex: 1,
    gap: 4,
  },
  vehicleNumber: {
    fontWeight: "700",
    fontSize: 16,
    color: "#1e293b",
  },
  ownerName: {
    fontSize: 12,
    color: "#94a3b8",
    fontWeight: "500",
  },
  priceSection: {
    alignItems: "flex-end",
  },
  price: {
    fontWeight: "700",
    fontSize: 18,
    color: "#2563eb",
  },
  priceLabel: {
    fontSize: 11,
    color: "#64748b",
    fontWeight: "500",
  },
});
