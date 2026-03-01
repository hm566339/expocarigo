import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface LocationSectionProps {
  location: string;
}

export const LocationSection: React.FC<LocationSectionProps> = ({
  location,
}) => {
  return (
    <View style={styles.locationSection}>
      <Text style={styles.locationIcon}>📍</Text>
      <Text style={styles.location} numberOfLines={1}>
        {location}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  locationSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  locationIcon: {
    fontSize: 14,
  },
  location: {
    fontSize: 12,
    color: "#64748b",
    fontWeight: "500",
    flex: 1,
  },
});
