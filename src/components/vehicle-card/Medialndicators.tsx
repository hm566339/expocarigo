import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface MediaIndicatorsProps {
  photoCount?: number;
  hasVideo?: boolean;
}

export const MediaIndicators: React.FC<MediaIndicatorsProps> = ({
  photoCount = 0,
  hasVideo = false,
}) => {
  return (
    <View style={styles.container}>
      {photoCount > 1 && (
        <View style={styles.galleryIndicator}>
          <Text style={styles.galleryText}>📸 {photoCount} photos</Text>
        </View>
      )}
      {hasVideo && (
        <View style={styles.videoIndicator}>
          <Text style={styles.videoText}>▶ Video available</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  galleryIndicator: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#eff6ff",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  galleryText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#2563eb",
  },
  videoIndicator: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fef3c7",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  videoText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#92400e",
  },
});
