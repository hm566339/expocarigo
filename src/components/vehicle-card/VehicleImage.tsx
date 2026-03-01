import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

interface VehicleImageProps {
  imageUrl: string | null;
  badgeText?: string;
}

export const VehicleImage: React.FC<VehicleImageProps> = ({
  imageUrl,
  badgeText = "Premium",
}) => {
  if (!imageUrl) return null;

  return (
    <View style={styles.imageContainer}>
      <Image source={{ uri: imageUrl }} style={styles.vehicleImage} />
      <View style={styles.imageBadgeContainer}>
        <View style={styles.imageBadge}>
          <Text style={styles.imageBadgeText}>{badgeText}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    position: "relative",
    width: "100%",
    height: 200,
    backgroundColor: "#f1f5f9",
  },
  vehicleImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  imageBadgeContainer: {
    position: "absolute",
    top: 12,
    right: 12,
  },
  imageBadge: {
    backgroundColor: "#2563eb",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  imageBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#ffffff",
  },
});
